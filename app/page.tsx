"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowRight, BookOpen, Bus, Check, ChevronRight, CircleDollarSign,
  CreditCard, GraduationCap, ListChecks, PiggyBank,
  Sparkles, TrendingUp, Utensils, WalletCards,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

const painPoints = [
  ["Mensalidade", "A data chega todo mês", GraduationCap],
  ["Transporte", "Uma ida de cada vez", Bus],
  ["Alimentação", "Entre aulas e trabalhos", Utensils],
  ["Assinaturas", "Pequenas cobranças somam", CreditCard],
  ["Lazer", "Porque descanso também conta", Sparkles],
] as const;

const pillars = [
  ["Organize seus gastos", "Reúna faculdade e dia a dia em categorias que fazem sentido.", ListChecks],
  ["Acompanhe seu mês", "Veja quanto já saiu e o que ainda está disponível.", TrendingUp],
  ["Entenda seus hábitos", "Identifique padrões sem precisar montar fórmulas.", CircleDollarSign],
  ["Aprenda enquanto organiza", "Conteúdos simples conectados à sua rotina.", BookOpen],
] as const;

const features = [
  "Balanço mensal", "Despesas acadêmicas", "Categorização de gastos",
  "Dicas personalizadas", "Conteúdos financeiros", "Desafios e recompensas",
];

function getAttribution() {
  if (typeof window === "undefined") return { utmSource: "", utmMedium: "", utmCampaign: "", referrer: "" };
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source")?.slice(0, 120) ?? "",
    utmMedium: params.get("utm_medium")?.slice(0, 120) ?? "",
    utmCampaign: params.get("utm_campaign")?.slice(0, 120) ?? "",
    referrer: document.referrer.slice(0, 500),
  };
}

export default function Home() {
  const openedAt = useRef(0);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    openedAt.current = performance.now();
    const key = "unifin_view_session";
    let sessionId = sessionStorage.getItem(key);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem(key, sessionId);
    }
    fetch("/api/page-views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, ...getAttribution() }),
      keepalive: true,
    }).catch(() => undefined);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) {
      setStatus("error");
      setError("Confirme o consentimento para participar da validação.");
      return;
    }
    setStatus("loading");
    setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      firstName: String(data.get("firstName") ?? ""),
      email: String(data.get("email") ?? ""),
      modality: String(data.get("modality") ?? ""),
      mainChallenge: String(data.get("mainChallenge") ?? ""),
      consent,
      company: String(data.get("company") ?? ""),
      formElapsedMs: Math.round(performance.now() - openedAt.current),
      ...getAttribution(),
    };
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "Não foi possível enviar agora.");
      form.reset();
      setConsent(false);
      setStatus("success");
    } catch (submissionError) {
      setStatus("error");
      setError(submissionError instanceof Error ? submissionError.message : "Não foi possível enviar agora. Tente novamente.");
    }
  }

  return (
    <main>
      <header className="shell site-header">
        <a href="#inicio" className="brand" aria-label="UNIFIN — início"><span className="brand-mark"><span /></span><span>UNIFIN</span></a>
        <a href="#cadastro" className="button button-small">Quero testar</a>
      </header>

      <section id="inicio" className="shell hero">
        <div className="hero-copy">
          <div className="eyebrow"><GraduationCap size={16} /> Feito para a rotina universitária</div>
          <h1>Sua vida universitária já é complicada.<br /><span>Suas finanças não precisam ser.</span></h1>
          <p>O UNIFIN reúne seus gastos da faculdade e do dia a dia em uma visão simples para você entender para onde seu dinheiro está indo e quanto ainda pode gastar no mês.</p>
          <div className="hero-actions"><a href="#cadastro" className="button">Quero testar o UNIFIN <ArrowRight size={18} /></a><small>Projeto em fase de validação.</small></div>
        </div>
        <DashboardMockup />
      </section>

      <section className="pain-section section-pad">
        <div className="shell">
          <div className="section-heading"><span className="kicker">A rotina real</span><h2>O dinheiro some antes do mês acabar?</h2><p>Quando mensalidade, transporte, alimentação e lazer ficam espalhados entre aplicativos, anotações e contas, enxergar o mês inteiro vira mais uma tarefa.</p></div>
          <div className="pain-grid">
            {painPoints.map(([title, text, Icon], index) => <article className={`pain-card pain-${index}`} key={title}><Icon size={21} /><div><b>{title}</b><span>{text}</span></div></article>)}
          </div>
        </div>
      </section>

      <section className="section-pad solution-section">
        <div className="shell">
          <div className="section-heading centered"><span className="kicker">Tudo no mesmo lugar</span><h2>Uma visão simples da sua vida financeira universitária.</h2><p>Menos tempo configurando planilhas. Mais clareza para tomar decisões durante o mês.</p></div>
          <div className="pillars-grid">{pillars.map(([title, text, Icon], index) => <article className="pillar-card" key={title}><span className="pillar-number">0{index + 1}</span><Icon size={25} /><h3>{title}</h3><p>{text}</p></article>)}</div>
        </div>
      </section>

      <section className="section-pad visual-section">
        <div className="shell visual-grid">
          <div className="month-visual" aria-label="Representação conceitual da organização de despesas">
            <div className="month-top"><div><small>VISÃO DO MÊS</small><h3>Setembro em ordem</h3></div><span className="month-badge">Em dia</span></div>
            <div className="timeline">
              <div className="timeline-row"><span>02</span><i className="academic-dot"/><div><b>Mensalidade</b><small>Faculdade</small></div><strong>Pago</strong></div>
              <div className="timeline-row"><span>10</span><i className="transport-dot"/><div><b>Recarga transporte</b><small>Mobilidade</small></div><strong>Previsto</strong></div>
              <div className="timeline-row"><span>18</span><i className="material-dot"/><div><b>Material da disciplina</b><small>Acadêmico</small></div><strong>Previsto</strong></div>
            </div>
            <div className="weekly-budget"><div><span>Orçamento da semana</span><b>R$ 210 disponíveis</b></div><div className="week-track"><i /></div></div>
            <div className="concept-label">Representação conceitual · dados ilustrativos</div>
          </div>
          <div className="visual-copy"><span className="kicker">Pensado para estudantes</span><h2>Da mensalidade ao lanche entre as aulas.</h2><p>O UNIFIN propõe organizar despesas acadêmicas e do cotidiano sem exigir que você adapte uma ferramenta genérica à sua rotina.</p><ul>{["Contas acadêmicas visíveis no calendário", "Categorias prontas para o dia a dia", "Disponível do mês sempre em destaque"].map(item => <li key={item}><Check size={17}/>{item}</li>)}</ul><a href="#cadastro" className="text-link">Quero participar da validação <ChevronRight size={17}/></a></div>
        </div>
      </section>

      <section className="section-pad features-section">
        <div className="shell"><div className="features-head"><div><span className="kicker light">O que estamos propondo</span><h2>Funcionalidades planejadas para o UNIFIN</h2></div><p>Estas ideias fazem parte da proposta em validação. Seu interesse ajuda a indicar quais delas devem ganhar prioridade.</p></div><div className="feature-cloud">{features.map((feature, index) => <div className="feature-pill" key={feature}><span>{String(index + 1).padStart(2,"0")}</span>{feature}</div>)}</div></div>
      </section>

      <section className="section-pad compare-section">
        <div className="shell"><div className="section-heading centered"><span className="kicker">O diferencial</span><h2>Não é só uma planilha de gastos.</h2><p>O ponto de partida é a vida universitária, não uma tela vazia para você configurar.</p></div><div className="compare-grid"><article className="compare-card muted-card"><span>PLANILHA</span><h3>Você monta o sistema</h3><ul><li>Configuração manual</li><li>Manutenção manual</li><li>Experiência genérica</li></ul></article><article className="compare-card unifin-card"><span>UNIFIN</span><h3>A estrutura já vem pronta</h3><ul><li><Check size={17}/> Foco universitário</li><li><Check size={17}/> Visão simplificada</li><li><Check size={17}/> Acompanhamento contínuo</li></ul></article></div></div>
      </section>

      <section id="cadastro" className="signup-section section-pad">
        <div className="shell signup-grid">
          <div className="signup-copy"><span className="kicker light">Faça parte do próximo passo</span><h2>Quer ajudar a construir o UNIFIN?</h2><p>Estamos validando a ideia com universitários. Deixe seu contato para participar dos próximos testes e receber novidades do projeto.</p><div className="privacy-note"><PiggyBank size={22}/><div><b>Sem dados financeiros</b><span>Pedimos apenas o necessário para esta validação.</span></div></div></div>
          <div className="form-card">
            {status === "success" ? <div className="success-state" role="status"><span><Check size={28}/></span><h3>Cadastro recebido!</h3><p>Obrigado por ajudar na validação do UNIFIN.</p><button className="text-link reset-button" onClick={() => { openedAt.current = Date.now(); setStatus("idle"); }}>Enviar outro cadastro</button></div> :
            <form onSubmit={handleSubmit} noValidate={false}>
              <div className="field"><Label htmlFor="firstName">Primeiro nome</Label><Input id="firstName" name="firstName" autoComplete="given-name" maxLength={80} placeholder="Como podemos chamar você?" required /></div>
              <div className="field"><Label htmlFor="email">E-mail</Label><Input id="email" name="email" type="email" autoComplete="email" maxLength={254} placeholder="voce@exemplo.com" required /></div>
              <div className="field"><Label htmlFor="modality">Modalidade da graduação</Label><NativeSelect id="modality" name="modality" required defaultValue="" className="form-select"><NativeSelectOption value="" disabled>Selecione uma opção</NativeSelectOption><NativeSelectOption value="presencial">Presencial</NativeSelectOption><NativeSelectOption value="ead">EAD</NativeSelectOption><NativeSelectOption value="hibrida">Híbrida</NativeSelectOption></NativeSelect></div>
              <div className="field"><Label htmlFor="mainChallenge">Maior dificuldade financeira hoje</Label><NativeSelect id="mainChallenge" name="mainChallenge" required defaultValue="" className="form-select"><NativeSelectOption value="" disabled>Selecione uma opção</NativeSelectOption><NativeSelectOption value="controlar_gastos">Controlar meus gastos</NativeSelectOption><NativeSelectOption value="saber_disponivel">Saber quanto ainda posso gastar</NativeSelectOption><NativeSelectOption value="despesas_faculdade">Organizar despesas da faculdade</NativeSelectOption><NativeSelectOption value="guardar_dinheiro">Guardar dinheiro</NativeSelectOption><NativeSelectOption value="renda_variavel">Minha renda varia muito</NativeSelectOption><NativeSelectOption value="outro">Outro</NativeSelectOption></NativeSelect></div>
              <div className="honeypot" aria-hidden="true"><Label htmlFor="company">Empresa</Label><Input id="company" name="company" tabIndex={-1} autoComplete="off" /></div>
              <div className="consent-row"><Checkbox id="consent" checked={consent} onCheckedChange={(checked) => setConsent(checked === true)} aria-required="true" /><Label htmlFor="consent">Concordo em fornecer meus dados para participar da validação do projeto UNIFIN.</Label></div>
              {status === "error" && <p className="form-error" role="alert">{error}</p>}
              <button type="submit" className="button submit-button" disabled={status === "loading"}>{status === "loading" ? <><span className="loader"/> Enviando...</> : <>Quero participar <ArrowRight size={18}/></>}</button>
              <p className="form-footnote">Projeto acadêmico em fase de validação.</p>
            </form>}
          </div>
        </div>
      </section>

      <footer><div className="shell footer-inner"><a href="#inicio" className="brand"><span className="brand-mark"><span /></span><span>UNIFIN</span></a><p>Uma proposta de finanças para a vida universitária.</p><small>Projeto em fase de validação.</small></div></footer>
    </main>
  );
}

function DashboardMockup() {
  return <div className="mockup-wrap" aria-label="Demonstração conceitual do painel UNIFIN"><div className="mockup-glow"/><div className="dashboard-card"><div className="dashboard-top"><div><span className="mini-label">SETEMBRO</span><h2>Olá, Ana!</h2></div><span className="avatar">A</span></div><div className="balance-card"><span>Disponível no mês</span><strong>R$ 1.240,00</strong><div className="balance-track"><i/></div><small>62% do orçamento ainda disponível</small></div><div className="expenses-head"><b>Gastos por categoria</b><WalletCards size={18}/></div><div className="expense-list">{[["Mensalidade","R$ 680","academic"],["Transporte","R$ 176","transport"],["Alimentação","R$ 294","food"],["Assinaturas","R$ 62","subscription"]].map(([name,value,tone]) => <div className="expense-row" key={name}><span className={`expense-icon ${tone}`}/><span>{name}</span><b>{value}</b></div>)}</div><div className="concept-label">Mockup conceitual · dados ilustrativos</div></div></div>;
}
