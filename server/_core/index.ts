import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function listenOnAvailablePort(server: ReturnType<typeof createServer>, startPort: number = 3000): Promise<number> {
  return new Promise((resolve, reject) => {
    let currentPort = startPort;

    const tryListen = () => {
      server.once("error", onError);
      server.listen(currentPort, () => {
        server.removeListener("error", onError);
        resolve(currentPort);
      });
    };

    const onError = (err: NodeJS.ErrnoException) => {
      server.removeListener("error", onError);
      if (err.code === "EADDRINUSE" && currentPort < startPort + 20) {
        currentPort++;
        tryListen();
      } else {
        reject(err);
      }
    };

    tryListen();
  });
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await listenOnAvailablePort(server, preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  console.log(`Server running on http://localhost:${port}/`);
}

startServer().catch(console.error);
