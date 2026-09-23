"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Download, Eye, LogOut, RefreshCw, ShieldCheck, Users } from "lucide-react";

type Lead = {
  id: number;
  createdAt: string;
  firstName: string;
  email: string;
  modality: string;
  mainChallenge: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  isTest: boolean;
};

type AdminData = {
  counts: { leads: number; tests: number; pageViews: number };
  leads: Lead[];
};

const modalityLabel: Record<string, string> = { presencial: "Presencial", ead: "EAD", hibrida: "Híbrida" };
const challengeLabel: Record<string, string> = {
  controlar_gastos: "Controlar gastos",
  saber_disponivel: "Saber quanto pode gastar",
  despesas_faculdade: "Despesas da faculdade",
  guardar_dinheiro: "Guardar dinheiro",
  renda_variavel: "Renda variável",
  outro: "Outro",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadData(event?: FormEvent) {
    event?.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/leads", {
        headers: { Authorization: `Bearer ${password}` },
        cache: "no-store",
      });
      const result = await response.json() as AdminData & { error?: string };
      if (!response.ok) throw new Error(result.error || "Não foi possível entrar.");
      setData(result);
    } catch (loadError) {
      setData(null);
      setError(loadError instanceof Error ? loadError.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  function exportCsv() {
    if (!data) return;
    const rows = [
      ["data", "nome", "email", "modalidade", "dificuldade", "utm_source", "utm_medium", "utm_campaign", "teste"],
      ...data.leads.map((lead) => [lead.createdAt, lead.firstName, lead.email, modalityLabel[lead.modality] || lead.modality, challengeLabel[lead.mainChallenge] || lead.mainChallenge, lead.utmSource || "", lead.utmMedium || "", lead.utmCampaign || "", lead.isTest ? "sim" : "não"]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    link.download = `unifin-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  if (!data) {
    return <main className="admin-login">
      <section className="admin-login-card">
        <Link className="brand" href="/"><span className="brand-mark"><span /></span><span>UNIFIN</span></Link>
        <div className="admin-icon"><ShieldCheck size={28} /></div>
        <h1>Painel de validação</h1>
        <p>Acesso restrito aos responsáveis pelo projeto.</p>
        <form onSubmit={loadData}>
          <label htmlFor="admin-password">Senha de acesso</label>
          <input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" placeholder="Digite a senha" />
          {error && <div className="admin-error" role="alert">{error}</div>}
          <button className="button" disabled={loading}>{loading ? "Entrando…" : "Entrar no painel"}</button>
        </form>
        <small>A senha não é salva neste dispositivo.</small>
      </section>
    </main>;
  }

  const conversion = data.counts.pageViews ? ((data.counts.leads / data.counts.pageViews) * 100).toFixed(1).replace(".", ",") : "0,0";
  return <main className="admin-shell">
    <header className="admin-header">
      <div><span className="admin-kicker">UNIFIN</span><h1>Painel de validação</h1><p>Dados atualizados diretamente do formulário.</p></div>
      <div className="admin-actions">
        <button onClick={() => loadData()} disabled={loading}><RefreshCw size={16} /> Atualizar</button>
        <button onClick={exportCsv}><Download size={16} /> Exportar CSV</button>
        <button onClick={() => { setData(null); setPassword(""); }}><LogOut size={16} /> Sair</button>
      </div>
    </header>

    <section className="admin-metrics">
      <article><Users size={20} /><span>Leads reais</span><strong>{data.counts.leads}</strong></article>
      <article><Eye size={20} /><span>Acessos</span><strong>{data.counts.pageViews}</strong></article>
      <article><span>Taxa de conversão</span><strong>{conversion}%</strong><small>leads ÷ acessos</small></article>
      <article><span>Registros de teste</span><strong>{data.counts.tests}</strong><small>não entram na conversão</small></article>
    </section>

    <section className="admin-table-card">
      <div className="admin-table-title"><div><h2>Cadastros recebidos</h2><p>Até 500 registros mais recentes.</p></div><span>{data.leads.length} exibidos</span></div>
      <div className="admin-table-wrap">
        <table>
          <thead><tr><th>Data</th><th>Nome</th><th>E-mail</th><th>Modalidade</th><th>Dificuldade</th><th>Origem</th><th>Tipo</th></tr></thead>
          <tbody>{data.leads.length ? data.leads.map((lead) => <tr key={lead.id}>
            <td>{new Date(`${lead.createdAt}Z`).toLocaleString("pt-BR")}</td>
            <td>{lead.firstName}</td><td>{lead.email}</td><td>{modalityLabel[lead.modality] || lead.modality}</td>
            <td>{challengeLabel[lead.mainChallenge] || lead.mainChallenge}</td>
            <td>{lead.utmSource || "Direto"}</td><td><span className={lead.isTest ? "admin-badge test" : "admin-badge"}>{lead.isTest ? "Teste" : "Real"}</span></td>
          </tr>) : <tr><td colSpan={7} className="admin-empty">Nenhum cadastro recebido ainda.</td></tr>}</tbody>
        </table>
      </div>
    </section>
  </main>;
}
