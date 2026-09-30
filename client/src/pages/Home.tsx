/**
 * Balanço Editorial — dashboard pessoal de estética Swiss Finance.
 * Princípios: números em primeiro plano, verde-petróleo como âncora, hierarquia editorial e ações objetivas.
 */
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Grid2X2,
  Landmark,
  Menu,
  MoreHorizontal,
  PiggyBank,
  Plus,
  ReceiptText,
  Search,
  Sparkles,
  Target,
  WalletCards,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Page = "dashboard" | "expenses" | "income" | "savings";
type TransactionKind = "income" | "expense";

type Transaction = {
  id: number;
  title: string;
  category: string;
  date: string;
  value: number;
  kind: TransactionKind;
};

const logoUrl = "/manus-storage/controle-financeiro-logo_183b61ff.png";
const balanceTextureUrl = "/manus-storage/controle-financeiro-balance-texture_ac1f0ce9.jpg";
const incomeArtUrl = "/manus-storage/controle-financeiro-income-art_e6c57489.jpg";
const goalArtUrl = "/manus-storage/controle-financeiro-goal-art_2eae342b.jpg";

const monthlyData = [
  { month: "Abr", entradas: 4200, saídas: 2600 },
  { month: "Mai", entradas: 4800, saídas: 3100 },
  { month: "Jun", entradas: 4650, saídas: 2800 },
  { month: "Jul", entradas: 5100, saídas: 3400 },
  { month: "Ago", entradas: 4800, saídas: 2450 },
  { month: "Set", entradas: 5340, saídas: 2920 },
];

const categoryData = [
  { name: "Moradia", value: 35, color: "#0E504C" },
  { name: "Alimentação", value: 24, color: "#64D6B4" },
  { name: "Mobilidade", value: 18, color: "#C49B43" },
  { name: "Lazer", value: 13, color: "#E98470" },
  { name: "Outros", value: 10, color: "#D7E4DC" },
];

const initialTransactions: Transaction[] = [
  { id: 1, title: "Supermercado Vila", category: "Alimentação", date: "Hoje, 10:42", value: 186.4, kind: "expense" },
  { id: 2, title: "Projeto Horizonte", category: "Freelance", date: "Hoje, 09:18", value: 840, kind: "income" },
  { id: 3, title: "Assinatura de música", category: "Lazer", date: "Ontem, 19:01", value: 21.9, kind: "expense" },
  { id: 4, title: "Pagamento mensal", category: "Salário", date: "01 set, 08:00", value: 4500, kind: "income" },
  { id: 5, title: "Conta de energia", category: "Moradia", date: "31 ago, 14:36", value: 142.75, kind: "expense" },
];

const availableMonths = [
  "Janeiro 2026",
  "Fevereiro 2026",
  "Março 2026",
  "Abril 2026",
  "Maio 2026",
  "Junho 2026",
  "Julho 2026",
  "Agosto 2026",
  "Setembro 2026",
  "Outubro 2026",
  "Novembro 2026",
  "Dezembro 2026",
];

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

function formatCurrency(value: number) {
  return currency.format(value);
}

function formatCompact(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function NavItem({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof Grid2X2;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3 border-l-2 px-4 py-3 text-left text-sm font-semibold transition-all duration-200 ${
        active
          ? "border-[#64D6B4] bg-white/10 text-white"
          : "border-transparent text-white/55 hover:border-white/35 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon className={`h-4 w-4 ${active ? "text-[#64D6B4]" : "text-white/55 group-hover:text-white"}`} strokeWidth={1.8} />
      <span>{label}</span>
    </button>
  );
}

function StatCard({
  label,
  value,
  note,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  note: string;
  icon: typeof WalletCards;
  tone: "teal" | "mint" | "coral" | "gold";
}) {
  const tones = {
    teal: "bg-[#DDEDE8] text-[#0E504C]",
    mint: "bg-[#DDF8ED] text-[#218766]",
    coral: "bg-[#FBE4DE] text-[#C85F4D]",
    gold: "bg-[#F7EEDB] text-[#9C742B]",
  };

  return (
    <article className="fin-panel group relative overflow-hidden p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="fin-eyebrow">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${tones[tone]}`}>
          <Icon className="h-4 w-4" strokeWidth={1.8} />
        </span>
      </div>
      <p className="mt-5 font-display text-[1.65rem] leading-none tracking-[-0.045em] text-[#173631] sm:text-[1.9rem]">{value}</p>
      <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#73817E]">
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
        {note}
      </p>
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#64D6B4] transition-all duration-300 group-hover:w-full" />
    </article>
  );
}

function LoginScreen({ onSuccess }: { onSuccess: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isEmailValid) {
      setError("Digite um email válido para continuar.");
      return;
    }
    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    setError("");
    onSuccess(email);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F4F7F5] text-[#173631]">
      <div className="absolute inset-y-0 left-0 hidden w-[42%] overflow-hidden bg-[#0E504C] lg:block">
        <div className="absolute -left-28 top-1/4 h-[520px] w-[520px] rounded-full border border-white/10" />
        <div className="absolute -left-10 top-[33%] h-[360px] w-[360px] rounded-full border border-white/[0.08]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0E504C] via-[#0E504C] to-[#073732]" />
        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[0.9rem] border border-white/15 bg-white/10"><img src={logoUrl} alt="Símbolo Controle financeiro" className="h-9 w-9 rounded-[0.6rem] p-1" /></span>
            <span><span className="block text-[0.62rem] font-extrabold uppercase tracking-[0.26em] text-[#64D6B4]">Controle</span><span className="block text-[0.98rem] font-extrabold leading-none tracking-[-0.04em] text-white">financeiro</span></span>
          </div>
          <div className="relative max-w-[370px]">
            <p className="fin-eyebrow text-[#9BE8D1]">Seu dinheiro, com contexto</p>
            <h1 className="mt-4 font-display text-[3.6rem] leading-[0.98] tracking-[-0.055em] text-white xl:text-[4.4rem]">Clareza para decidir melhor.</h1>
            <p className="mt-6 max-w-[310px] text-sm leading-relaxed text-white/65">Acompanhe o que entra, o que sai e o que importa para os seus próximos planos.</p>
          </div>
          <p className="text-xs font-medium text-white/45">© 2026 Controle financeiro · Feito para uma rotina mais tranquila.</p>
        </div>
      </div>

      <main className="relative flex min-h-screen items-center justify-center px-5 py-10 lg:ml-[42%] lg:px-10">
        <div className="w-full max-w-[430px]">
          <div className="mb-10 flex items-center gap-3 lg:hidden"><span className="flex h-10 w-10 items-center justify-center rounded-[0.75rem] bg-[#0E504C]"><img src={logoUrl} alt="Símbolo Controle financeiro" className="h-8 w-8 rounded p-1" /></span><span><span className="block text-[0.58rem] font-extrabold uppercase tracking-[0.23em] text-[#0E504C]">Controle</span><span className="block text-sm font-extrabold leading-none tracking-[-0.04em] text-[#173631]">financeiro</span></span></div>
          <div className="mb-8"><p className="fin-eyebrow">Área segura</p><h2 className="mt-2 font-display text-[2.6rem] leading-none tracking-[-0.05em] text-[#173631]">Bom ter você de volta.</h2><p className="mt-4 text-sm leading-relaxed text-[#6D7D77]">Entre para acompanhar o seu mês com mais clareza.</p></div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2"><label htmlFor="login-email" className="text-xs font-extrabold text-[#456259]">Email</label><Input id="login-email" type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} placeholder="voce@email.com" className="h-12 border-[#D5E3DE] bg-white px-4 text-sm focus-visible:ring-[#0E504C]" /></div>
            <div className="space-y-2"><div className="flex items-center justify-between"><label htmlFor="login-password" className="text-xs font-extrabold text-[#456259]">Senha</label><button type="button" onClick={() => toast.info("Em breve você poderá recuperar sua senha por email.")} className="text-xs font-bold text-[#0E504C] hover:underline">Esqueci minha senha</button></div><div className="relative"><Input id="login-password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} placeholder="Mínimo de 6 caracteres" className="h-12 border-[#D5E3DE] bg-white px-4 pr-12 text-sm focus-visible:ring-[#0E504C]" /><button type="button" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowPassword((current) => !current)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1.5 text-[#7D8E87] hover:bg-[#EDF4F1] hover:text-[#0E504C]">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
            {error && <p role="alert" className="border-l-2 border-[#E98470] bg-[#FDF0EC] px-3 py-2.5 text-xs font-semibold text-[#B65343]">{error}</p>}
            <Button type="submit" className="h-12 w-full bg-[#0E504C] text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(14,80,76,0.18)] hover:bg-[#0A403D]">Entrar no meu painel <ChevronRight className="ml-2 h-4 w-4" /></Button>
          </form>
          <p className="mt-8 text-center text-xs text-[#82918D]">Ainda não tem uma conta? <button type="button" onClick={() => toast.info("O cadastro estará disponível em breve.")} className="font-extrabold text-[#0E504C] hover:underline">Criar acesso</button></p>
          <p className="mt-10 text-center text-[0.68rem] leading-relaxed text-[#9AA7A2]">Ao entrar, você concorda com os termos de uso e a política de privacidade.</p>
        </div>
      </main>
    </div>
  );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const positive = transaction.kind === "income";
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-[#DDE7E3] py-4 last:border-0 md:grid-cols-[minmax(0,1.35fr)_minmax(100px,0.7fr)_120px_112px] md:items-center">
      <div className="flex min-w-0 items-center gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${positive ? "bg-[#DEF8ED] text-[#218766]" : "bg-[#FCE8E2] text-[#C85F4D]"}`}>
          {positive ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-[#173631]">{transaction.title}</p>
          <p className="mt-0.5 text-xs text-[#74827F] md:hidden">{transaction.category} · {transaction.date}</p>
        </div>
      </div>
      <p className="hidden text-xs font-medium text-[#687773] md:block">{transaction.category}</p>
      <p className="hidden text-xs font-medium text-[#687773] md:block">{transaction.date}</p>
      <p className={`text-right font-mono text-sm font-bold ${positive ? "text-[#218766]" : "text-[#C85F4D]"}`}>
        {positive ? "+" : "−"}{formatCurrency(transaction.value)}
      </p>
    </div>
  );
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [page, setPage] = useState<Page>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [monthMenuOpen, setMonthMenuOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("Setembro 2026");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionKind>("expense");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [cofrinhoAmount, setCofrinhoAmount] = useState(8460);
  const [cofrinhoDeposit, setCofrinhoDeposit] = useState("");

  const cofrinhoGoal = 12000;
  const cofrinhoProgress = Math.min(100, Math.round((cofrinhoAmount / cofrinhoGoal) * 100));

  const totals = useMemo(() => {
    const newIncome = transactions.filter((item) => item.id > 5 && item.kind === "income").reduce((sum, item) => sum + item.value, 0);
    const newExpenses = transactions.filter((item) => item.id > 5 && item.kind === "expense").reduce((sum, item) => sum + item.value, 0);
    return {
      income: 5340 + newIncome,
      expenses: 2920 + newExpenses,
      balance: 12480 + newIncome - newExpenses,
    };
  }, [transactions]);

  const pageTitle: Record<Page, string> = {
    dashboard: "Visão geral",
    expenses: "Minhas despesas",
    income: "Minhas receitas",
    savings: "Cofrinho",
  };

  const filteredTransactions = page === "expenses"
    ? transactions.filter((transaction) => transaction.kind === "expense")
    : page === "income"
      ? transactions.filter((transaction) => transaction.kind === "income")
      : transactions;

  const openTransaction = (type: TransactionKind) => {
    setTransactionType(type);
    setDescription("");
    setCategory("");
    setAmount("");
    setDialogOpen(true);
  };

  const createTransaction = () => {
    const normalizedAmount = Number(amount.replace(",", "."));
    if (!description.trim() || !category.trim() || !normalizedAmount || normalizedAmount <= 0) {
      toast.error("Preencha a descrição, categoria e um valor válido.");
      return;
    }

    const transaction: Transaction = {
      id: Date.now(),
      title: description.trim(),
      category: category.trim(),
      date: "Agora",
      value: normalizedAmount,
      kind: transactionType,
    };
    setTransactions((current) => [transaction, ...current]);
    setDialogOpen(false);
    toast.success(transactionType === "income" ? "Receita registrada no seu saldo." : "Despesa registrada no seu saldo.");
  };

  const addToCofrinho = () => {
    const normalizedAmount = Number(cofrinhoDeposit.replace(",", "."));
    if (!normalizedAmount || normalizedAmount <= 0) {
      toast.error("Digite um valor válido para guardar.");
      return;
    }
    setCofrinhoAmount((current) => current + normalizedAmount);
    setCofrinhoDeposit("");
    toast.success(`${formatCurrency(normalizedAmount)} guardados no seu cofrinho.`);
  };

  const changePage = (nextPage: Page) => {
    setPage(nextPage);
    setMenuOpen(false);
  };

  const changeMonth = (month: string) => {
    setSelectedMonth(month);
    setMonthMenuOpen(false);
    toast.success(`Visualizando ${month}.`);
  };

  if (!isAuthenticated) {
    return <LoginScreen onSuccess={(email) => { setUserEmail(email); setIsAuthenticated(true); toast.success("Login realizado. Seu painel está pronto."); }} />;
  }

  const summarySubtitle = page === "dashboard"
    ? "Uma leitura clara do seu dinheiro em setembro."
    : page === "expenses"
      ? "Confira cada saída e preserve seu ritmo financeiro."
      : page === "income"
        ? "Acompanhe seus recebimentos e próximas entradas."
        : "Guarde um pouco por vez e acompanhe sua reserva com tranquilidade.";

  return (
    <div className="relative min-h-screen bg-[#F4F7F5] text-[#173631] lg:flex">
      {menuOpen && <button aria-label="Fechar menu" className="fixed inset-0 z-30 bg-[#073732]/50 backdrop-blur-[1px] lg:hidden" onClick={() => setMenuOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[286px] flex-col overflow-hidden bg-[#0E504C] px-4 pb-5 pt-6 text-white transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-[#64D6B4]" />
        <div className="pointer-events-none absolute -right-16 top-20 h-44 w-44 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-7 top-28 h-28 w-28 rounded-full border border-white/[0.08]" />
        <div className="flex items-center justify-between px-3">
          <button type="button" className="flex items-center gap-3 text-left" onClick={() => changePage("dashboard")}>
            <span className="relative flex h-11 w-11 items-center justify-center rounded-[0.9rem] border border-white/15 bg-white/10 shadow-[0_8px_18px_rgba(0,0,0,.12)]"><img src={logoUrl} alt="Símbolo Controle financeiro" className="h-9 w-9 rounded-[0.6rem] p-1" /></span>
            <span>
              <span className="block text-[0.62rem] font-extrabold uppercase tracking-[0.26em] text-[#64D6B4]">Controle</span>
              <span className="block text-[0.98rem] font-extrabold leading-none tracking-[-0.04em] text-white">financeiro</span>
            </span>
          </button>
          <button type="button" className="rounded-full p-2 text-white/65 hover:bg-white/10 lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Fechar menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-3 mt-8 border-t border-white/15" />
        <nav className="mt-5 space-y-1" aria-label="Navegação principal">
          <p className="px-4 pb-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white/35">Seu espaço</p>
          <NavItem active={page === "dashboard"} icon={Grid2X2} label="Visão geral" onClick={() => changePage("dashboard")} />
          <NavItem active={page === "expenses"} icon={ReceiptText} label="Minhas despesas" onClick={() => changePage("expenses")} />
          <NavItem active={page === "income"} icon={CircleDollarSign} label="Minhas receitas" onClick={() => changePage("income")} />
          <NavItem active={page === "savings"} icon={PiggyBank} label="Cofrinho" onClick={() => changePage("savings")} />
        </nav>

        <div className="mt-auto overflow-hidden rounded-[1.15rem] border border-white/12 bg-white/[0.08] p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#64D6B4]" />
            <div>
              <p className="text-xs font-bold text-white">Um passo de cada vez</p>
              <p className="mt-1 text-[0.69rem] leading-relaxed text-white/58">Você já registrou 74% do que planejou para setembro.</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="min-h-screen min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex min-h-[84px] items-center justify-between border-b border-[#DFE8E4] bg-[#F4F7F5]/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setMenuOpen(true)} aria-label="Abrir menu" className="rounded-full border border-[#D5E2DD] bg-white p-2 text-[#0E504C] lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="fin-eyebrow hidden sm:block">Controle financeiro</p>
              <h1 className="font-display text-[1.65rem] leading-none tracking-[-0.04em] text-[#173631] sm:mt-1 sm:text-[2rem]">{pageTitle[page]}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative hidden sm:block">
              <button type="button" aria-haspopup="listbox" aria-expanded={monthMenuOpen} className="flex items-center gap-2 border border-[#D7E4DF] bg-white px-3 py-2 text-xs font-bold text-[#49635C] transition hover:border-[#0E504C]" onClick={() => setMonthMenuOpen((current) => !current)}>
                <CalendarDays className="h-3.5 w-3.5 text-[#0E504C]" /> {selectedMonth} <ChevronDown className={`h-3.5 w-3.5 transition-transform ${monthMenuOpen ? "rotate-180" : ""}`} />
              </button>
              {monthMenuOpen && (
                <div role="listbox" aria-label="Selecionar mês" className="absolute right-0 top-[calc(100%+0.5rem)] z-30 max-h-72 w-48 overflow-auto rounded-xl border border-[#D7E4DF] bg-white p-1.5 shadow-[0_16px_35px_rgba(32,69,59,0.14)]">
                  {availableMonths.map((month) => (
                    <button key={month} type="button" role="option" aria-selected={selectedMonth === month} onClick={() => changeMonth(month)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-bold transition ${selectedMonth === month ? "bg-[#E6F4EE] text-[#0E504C]" : "text-[#61766E] hover:bg-[#F2F7F4] hover:text-[#0E504C]"}`}>
                      {month}
                      {selectedMonth === month && <span className="h-1.5 w-1.5 rounded-full bg-[#64D6B4]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="button" aria-label="Notificações" onClick={() => toast.info("Você não tem novas notificações.")} className="relative rounded-full border border-[#D7E4DF] bg-white p-2.5 text-[#426059] transition hover:border-[#0E504C] hover:text-[#0E504C]">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#E98470]" />
            </button>
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F2D4BF] text-xs font-extrabold text-[#734535] shadow-sm" onClick={() => toast.info(`Perfil conectado: ${userEmail}`)}>MC</button>
          </div>
        </header>

        <div className="px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
          <section className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <p className="max-w-xl text-sm leading-relaxed text-[#64756F]">{summarySubtitle}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {page !== "income" && page !== "savings" && <Button onClick={() => openTransaction("expense")} variant="outline" className="h-10 border-[#C9D9D4] bg-white px-4 text-xs font-bold text-[#254D45] hover:border-[#0E504C] hover:bg-[#EEF7F3]"> <ArrowUpRight className="mr-1.5 h-4 w-4" /> Nova despesa</Button>}
              {page !== "expenses" && page !== "savings" && <Button onClick={() => openTransaction("income")} className="h-10 bg-[#0E504C] px-4 text-xs font-bold text-white shadow-[0_8px_20px_rgba(14,80,76,0.16)] hover:bg-[#0A403D]"> <Plus className="mr-1.5 h-4 w-4" /> Nova receita</Button>}
            </div>
          </section>

          {page === "dashboard" && (
            <>
              <section className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_repeat(2,minmax(190px,0.72fr))]">
                <article className="relative min-h-[206px] overflow-hidden rounded-[1.45rem] bg-[#0E504C] p-6 text-white shadow-[0_16px_35px_rgba(14,80,76,0.16)] sm:p-7">
                  <div className="absolute inset-0 bg-cover bg-center opacity-55" style={{ backgroundImage: `url(${balanceTextureUrl})` }} />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0E504C] via-[#0E504C]/93 to-[#0E504C]/45" />
                  <div className="relative flex h-full flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="fin-eyebrow text-white/58">Saldo disponível</span>
                      <span className="flex items-center gap-1.5 border border-white/15 bg-white/10 px-2.5 py-1 text-[0.64rem] font-bold uppercase tracking-[0.14em] text-[#B7F1DF]"> <span className="h-1.5 w-1.5 rounded-full bg-[#64D6B4]" /> Atualizado</span>
                    </div>
                    <div>
                      <p className="font-display text-[2.65rem] leading-none tracking-[-0.055em] sm:text-[3.35rem]">{formatCurrency(totals.balance)}</p>
                      <p className="mt-3 text-xs font-medium text-white/65">Em todas as suas contas registradas.</p>
                    </div>
                  </div>
                </article>
                <StatCard label="Entradas no mês" value={formatCurrency(totals.income)} note="8,6% acima de agosto" icon={ArrowDownRight} tone="mint" />
                <StatCard label="Saídas no mês" value={formatCurrency(totals.expenses)} note="54% do limite mensal" icon={ArrowUpRight} tone="coral" />
              </section>

              <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(330px,0.85fr)]">
                <article className="fin-panel p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="fin-eyebrow">Fluxo do mês</p>
                      <h2 className="mt-1 font-display text-2xl tracking-[-0.04em] text-[#173631]">Entradas e saídas</h2>
                    </div>
                    <span className="flex items-center gap-2 border border-[#DDE8E4] bg-[#F8FAF9] px-3 py-1.5 text-[0.66rem] font-bold uppercase tracking-[0.12em] text-[#557069]">Últimos 6 meses <ChevronDown className="h-3.5 w-3.5" /></span>
                  </div>
                  <div className="mt-6 h-[244px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyData} margin={{ top: 8, right: 6, left: -18, bottom: 0 }}>
                        <defs>
                          <linearGradient id="incomeFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#64D6B4" stopOpacity={0.38} /><stop offset="100%" stopColor="#64D6B4" stopOpacity={0} /></linearGradient>
                          <linearGradient id="expenseFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#E98470" stopOpacity={0.2} /><stop offset="100%" stopColor="#E98470" stopOpacity={0} /></linearGradient>
                        </defs>
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#82918D", fontSize: 11, fontWeight: 700 }} dy={9} />
                        <YAxis tickFormatter={(value) => `R$${value / 1000}k`} tickLine={false} axisLine={false} tick={{ fill: "#82918D", fontSize: 10 }} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ border: "1px solid #D9E6E1", borderRadius: 12, boxShadow: "0 12px 25px rgba(25, 60, 52, .1)", fontSize: 12 }} />
                        <Area type="monotone" dataKey="entradas" stroke="#0E504C" strokeWidth={2.5} fill="url(#incomeFill)" isAnimationActive={false} />
                        <Area type="monotone" dataKey="saídas" stroke="#E98470" strokeWidth={2.25} fill="url(#expenseFill)" isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#E1EBE7] pt-4 text-xs font-semibold text-[#60736D]">
                    <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#0E504C]" /> Entradas</span>
                    <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#E98470]" /> Saídas</span>
                    <span className="ml-auto text-[#218766]">Resultado previsto: +{formatCurrency(2420)}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 divide-x divide-[#E1EBE7] border-t border-[#E1EBE7] pt-4">
                    <div className="pr-3"><p className="fin-eyebrow">Melhor mês</p><p className="mt-1 font-mono text-xs font-bold text-[#173631]">Set · {formatCompact(5340)}</p></div>
                    <div className="px-3"><p className="fin-eyebrow">Média poupada</p><p className="mt-1 font-mono text-xs font-bold text-[#173631]">{formatCurrency(2210)}</p></div>
                    <div className="pl-3"><p className="fin-eyebrow">Próximo marco</p><p className="mt-1 text-xs font-bold text-[#218766]">Meta em 74%</p></div>
                  </div>
                </article>

                <article className="fin-panel p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="fin-eyebrow">Distribuição</p>
                      <h2 className="mt-1 font-display text-2xl tracking-[-0.04em] text-[#173631]">Para onde foi</h2>
                    </div>
                    <button type="button" aria-label="Opções de distribuição" onClick={() => toast.info("Você pode detalhar as categorias no relatório.")} className="rounded-full p-1.5 text-[#75847F] hover:bg-[#EDF4F1]"><MoreHorizontal className="h-5 w-5" /></button>
                  </div>
                  <div className="mt-3 flex flex-col items-center gap-3 sm:flex-row">
                    <div className="h-[172px] w-[172px] shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={72} paddingAngle={3} stroke="none">
                            {categoryData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                          </Pie>
                          <Tooltip formatter={(value: number) => `${value}%`} contentStyle={{ border: "1px solid #D9E6E1", borderRadius: 10, fontSize: 12 }} />
                          <text x="50%" y="47%" textAnchor="middle" className="fill-[#173631] text-[18px] font-bold">{formatCompact(totals.expenses)}</text>
                          <text x="50%" y="59%" textAnchor="middle" className="fill-[#82918D] text-[9px] font-bold">DESPESAS</text>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-full space-y-2.5">
                      {categoryData.slice(0, 4).map((category) => <div key={category.name} className="flex items-center justify-between gap-3 text-xs"><span className="flex items-center gap-2 font-semibold text-[#547068]"><i className="h-2 w-2 rounded-full" style={{ backgroundColor: category.color }} />{category.name}</span><strong className="font-mono text-[#173631]">{category.value}%</strong></div>)}
                    </div>
                  </div>
                </article>
              </section>

              <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(330px,0.85fr)]">
                <article className="fin-panel p-5 sm:p-6">
                  <div className="flex items-end justify-between gap-3">
                    <div><p className="fin-eyebrow">Atividade recente</p><h2 className="mt-1 font-display text-2xl tracking-[-0.04em] text-[#173631]">Movimentações</h2></div>
                    <button type="button" onClick={() => changePage("expenses")} className="flex items-center gap-1 text-xs font-bold text-[#0E504C] hover:underline">Ver tudo <ChevronRight className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="mt-5">
                    <div className="hidden grid-cols-[minmax(0,1.35fr)_minmax(100px,0.7fr)_120px_112px] gap-3 border-b border-[#DDE7E3] pb-3 text-[0.62rem] font-bold uppercase tracking-[0.13em] text-[#85938E] md:grid"><span>Movimentação</span><span>Categoria</span><span>Data</span><span className="text-right">Valor</span></div>
                    {transactions.slice(0, 5).map((transaction) => <TransactionRow key={transaction.id} transaction={transaction} />)}
                  </div>
                </article>

                <article className="relative min-h-[285px] overflow-hidden rounded-[1.35rem] bg-[#F1E8D7] p-6">
                  <img src={goalArtUrl} alt="Colagem abstrata que representa a evolução de uma meta" className="absolute inset-0 h-full w-full object-cover object-right opacity-75 mix-blend-multiply" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#F4EBD9] via-[#F4EBD9]/93 to-[#F4EBD9]/10" />
                  <div className="relative flex h-full max-w-[250px] flex-col justify-between">
                    <div>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C49B43]/20 text-[#937028]"><Target className="h-5 w-5" /></span>
                      <p className="mt-4 fin-eyebrow text-[#806A46]">Meta do semestre</p>
                      <h2 className="mt-1 font-display text-[1.75rem] leading-[1.05] tracking-[-0.045em] text-[#3E3728]">Reserva de tranquilidade</h2>
                    </div>
                    <div>
                      <div className="mb-2 flex items-end justify-between gap-3"><strong className="font-mono text-sm text-[#4D432E]">R$ 8.460</strong><span className="text-xs font-bold text-[#786B50]">71%</span></div>
                      <div className="h-2 bg-[#D9CBAE]"><div className="h-full w-[71%] bg-[#C49B43]" /></div>
                      <p className="mt-3 text-xs leading-relaxed text-[#786B50]">Faltam R$ 3.540 para cumprir sua meta até dezembro.</p>
                    </div>
                  </div>
                </article>
              </section>
            </>
          )}

          {(page === "expenses" || page === "income") && (
            <>
              <section className="grid gap-4 md:grid-cols-3">
                <StatCard label={page === "expenses" ? "Despesas do mês" : "Receitas do mês"} value={formatCurrency(page === "expenses" ? totals.expenses : totals.income)} note={page === "expenses" ? "Em 9 lançamentos" : "Em 5 recebimentos"} icon={page === "expenses" ? ArrowUpRight : ArrowDownRight} tone={page === "expenses" ? "coral" : "mint"} />
                <StatCard label={page === "expenses" ? "Limite restante" : "Previsto até o fim"} value={page === "expenses" ? formatCurrency(2480) : formatCurrency(1250)} note={page === "expenses" ? "46% do orçamento" : "Projetos e recorrências"} icon={page === "expenses" ? WalletCards : Landmark} tone={page === "expenses" ? "gold" : "teal"} />
                <article className="relative min-h-[155px] overflow-hidden rounded-[1.25rem] bg-[#E5F3EC] p-5">
                  {page === "income" && <img src={incomeArtUrl} alt="Composição abstrata associada a entradas financeiras" className="absolute inset-0 h-full w-full object-cover object-right opacity-35 mix-blend-multiply" />}
                  <div className="relative"><p className="fin-eyebrow text-[#52736A]">Leitura rápida</p><p className="mt-3 max-w-[15rem] font-display text-xl leading-tight tracking-[-0.04em] text-[#1F5146]">{page === "expenses" ? "Alimentação lidera suas despesas no período." : "Seu principal recebimento chegou dentro do prazo."}</p></div>
                </article>
              </section>

              <section className="fin-panel mt-4 p-5 sm:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div><p className="fin-eyebrow">Lançamentos de setembro</p><h2 className="mt-1 font-display text-2xl tracking-[-0.04em] text-[#173631]">{page === "expenses" ? "Saídas registradas" : "Entradas registradas"}</h2></div>
                  <div className="flex gap-2"><div className="flex items-center gap-2 border border-[#DAE5E1] bg-[#FAFCFB] px-3 text-xs text-[#77908A]"><Search className="h-3.5 w-3.5" /> <input aria-label="Buscar lançamento" placeholder="Buscar" className="w-20 bg-transparent py-2 outline-none placeholder:text-[#8A9995]" /></div><button type="button" onClick={() => toast.info("Os filtros detalhados estarão disponíveis em breve.")} className="border border-[#DAE5E1] bg-white px-3 text-xs font-bold text-[#516B63]">Filtrar</button></div>
                </div>
                <div className="mt-6"><div className="hidden grid-cols-[minmax(0,1.35fr)_minmax(100px,0.7fr)_120px_112px] gap-3 border-b border-[#DDE7E3] pb-3 text-[0.62rem] font-bold uppercase tracking-[0.13em] text-[#85938E] md:grid"><span>Movimentação</span><span>Categoria</span><span>Data</span><span className="text-right">Valor</span></div>{filteredTransactions.map((transaction) => <TransactionRow key={transaction.id} transaction={transaction} />)}</div>
              </section>
            </>
          )}

          {page === "savings" && (
            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
              <article className="fin-panel p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="fin-eyebrow">Seu cofrinho</p>
                    <h2 className="mt-1 font-display text-[2rem] tracking-[-0.045em] text-[#173631]">Reserva de tranquilidade</h2>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#667772]">Guarde um pouco por vez para construir uma reserva sem complicação.</p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#DDF8ED] text-[#0E504C]"><PiggyBank className="h-5 w-5" /></span>
                </div>
                <div className="mt-8 rounded-[1rem] bg-[#F2F7F4] p-5">
                  <div className="flex items-end justify-between gap-3"><div><p className="fin-eyebrow">Guardado</p><p className="mt-2 font-display text-[2.6rem] leading-none tracking-[-0.05em] text-[#173631]">{formatCurrency(cofrinhoAmount)}</p></div><span className="text-sm font-extrabold text-[#218766]">{cofrinhoProgress}%</span></div>
                  <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#D4E5DC]"><div className="h-full rounded-full bg-[#0E504C] transition-all duration-300" style={{ width: `${cofrinhoProgress}%` }} /></div>
                  <div className="mt-3 flex justify-between gap-3 text-xs font-semibold text-[#71837C]"><span>Começo</span><span>Meta: {formatCurrency(cofrinhoGoal)}</span></div>
                </div>
                <div className="mt-6 border-t border-[#E1EBE7] pt-5">
                  <p className="text-sm font-extrabold text-[#173631]">Adicionar ao cofrinho</p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row"><Input aria-label="Valor para guardar" type="number" min="0" step="0.01" value={cofrinhoDeposit} onChange={(event) => setCofrinhoDeposit(event.target.value)} placeholder="Ex.: 50,00" className="h-11 border-[#D5E3DE] bg-white focus-visible:ring-[#0E504C]" /><Button onClick={addToCofrinho} className="h-11 bg-[#0E504C] px-5 text-xs font-bold text-white hover:bg-[#0A403D]">Guardar valor</Button></div>
                </div>
              </article>
              <article className="relative min-h-[330px] overflow-hidden rounded-[1.35rem] bg-[#F1E8D7] p-6">
                <img src={goalArtUrl} alt="Colagem abstrata que representa um cofrinho" className="absolute inset-0 h-full w-full object-cover object-right opacity-70 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#F4EBD9] via-[#F4EBD9]/90 to-[#F4EBD9]/15" />
                <div className="relative flex h-full max-w-[260px] flex-col justify-between">
                  <div><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C49B43]/20 text-[#937028]"><Sparkles className="h-5 w-5" /></span><p className="mt-5 fin-eyebrow text-[#806A46]">Próximo passo</p><h3 className="mt-1 font-display text-[1.8rem] leading-[1.02] tracking-[-0.04em] text-[#3E3728]">Pequenos depósitos fazem diferença.</h3><p className="mt-3 text-sm leading-relaxed text-[#786B50]">Guardando {formatCurrency(350)} por semana, você chega mais perto da sua meta sem apertar o mês.</p></div>
                  <p className="text-xs font-bold text-[#806A46]">Faltam {formatCurrency(Math.max(cofrinhoGoal - cofrinhoAmount, 0))} para completar.</p>
                </div>
              </article>
            </section>
          )}
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md border-[#D7E4DF] bg-[#FBFCFB] p-0 shadow-2xl sm:rounded-[1.35rem]">
          <div className="border-b border-[#DFE9E5] px-6 pb-5 pt-6">
            <DialogHeader><p className="fin-eyebrow">Novo lançamento</p><DialogTitle className="mt-1 font-display text-[1.9rem] tracking-[-0.045em] text-[#173631]">{transactionType === "income" ? "Registrar receita" : "Registrar despesa"}</DialogTitle><DialogDescription className="mt-1 text-sm text-[#687A74]">O saldo e os resumos serão atualizados imediatamente.</DialogDescription></DialogHeader>
          </div>
          <div className="space-y-5 px-6 py-5">
            <div className="grid grid-cols-2 border border-[#D6E4DF] bg-white p-1"><button type="button" onClick={() => setTransactionType("expense")} className={`px-3 py-2 text-xs font-bold transition ${transactionType === "expense" ? "bg-[#FCE5DE] text-[#B84F3E]" : "text-[#70817C]"}`}>Despesa</button><button type="button" onClick={() => setTransactionType("income")} className={`px-3 py-2 text-xs font-bold transition ${transactionType === "income" ? "bg-[#DEF8ED] text-[#1A795B]" : "text-[#70817C]"}`}>Receita</button></div>
            <div className="space-y-2"><Label htmlFor="description" className="text-xs font-bold text-[#456259]">Descrição</Label><Input id="description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder={transactionType === "income" ? "Ex.: Projeto Aurora" : "Ex.: Mercado da semana"} className="h-11 border-[#D5E3DE] bg-white focus-visible:ring-[#0E504C]" /></div>
            <div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label htmlFor="category" className="text-xs font-bold text-[#456259]">Categoria</Label><Input id="category" value={category} onChange={(event) => setCategory(event.target.value)} placeholder={transactionType === "income" ? "Freelance" : "Alimentação"} className="h-11 border-[#D5E3DE] bg-white focus-visible:ring-[#0E504C]" /></div><div className="space-y-2"><Label htmlFor="amount" className="text-xs font-bold text-[#456259]">Valor (R$)</Label><Input id="amount" type="number" min="0" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0,00" className="h-11 border-[#D5E3DE] bg-white focus-visible:ring-[#0E504C]" /></div></div>
          </div>
          <div className="flex justify-end gap-2 border-t border-[#DFE9E5] bg-[#F5F8F6] px-6 py-4"><Button variant="outline" onClick={() => setDialogOpen(false)} className="border-[#D3E1DC] bg-white text-xs font-bold text-[#486259]">Cancelar</Button><Button onClick={createTransaction} className="bg-[#0E504C] text-xs font-bold text-white hover:bg-[#0A403D]">Salvar lançamento</Button></div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
