import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ShieldCheck, FileText, Gauge, Boxes, Users, Settings, PlusCircle, Search,
  Printer, ArrowRight, Layers, Database, Server, Cloud, Lock, ChevronRight,
  X, Trash2, Building2, Thermometer, Droplets, Menu, Check, ClipboardList,
  BarChart3, Clock, ArrowLeft
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Global style — design tokens for "Traço"                            */
/* ------------------------------------------------------------------ */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&family=Playfair+Display:ital,wght@1,600;1,700&display=swap');

    .traco-root {
      --paper: #F5F4EF;
      --paper-line: #E3E1D6;
      --ink: #191F1B;
      --graphite: #4A5650;
      --navy: #101A22;
      --navy-2: #16232D;
      --orange: #E8590C;
      --orange-dim: #C94E0B;
      --steel: #3D6C8A;
      --seal-green: #2C7A4B;
      --alert: #B23A2F;
      --line: #D8D5C8;
      --white: #FFFFFF;
      font-family: 'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif;
      color: var(--ink);
      background: var(--paper);
      -webkit-font-smoothing: antialiased;
    }
    .traco-root * { box-sizing: border-box; }
    .traco-root h1, .traco-root h2, .traco-root h3, .traco-root .disp {
      font-family: 'Space Grotesk', sans-serif;
      letter-spacing: -0.01em;
    }
    .traco-root .mono {
      font-family: 'IBM Plex Mono', monospace;
      font-variant-numeric: tabular-nums;
    }
    .traco-root button { font-family: inherit; cursor: pointer; }
    .traco-root a { color: inherit; }
    .traco-root ::selection { background: var(--orange); color: white; }

    /* grid paper texture for light sections */
    .grid-paper {
      background-image:
        linear-gradient(var(--paper-line) 1px, transparent 1px),
        linear-gradient(90deg, var(--paper-line) 1px, transparent 1px);
      background-size: 28px 28px;
    }

    .btn-primary {
      background: var(--orange);
      color: white;
      border: none;
      padding: 13px 24px;
      border-radius: 3px;
      font-weight: 600;
      font-size: 15px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: background 0.15s ease, transform 0.1s ease;
    }
    .btn-primary:hover { background: var(--orange-dim); }
    .btn-primary:active { transform: translateY(1px); }
    .btn-primary:focus-visible, .btn-ghost:focus-visible, .btn-nav:focus-visible {
      outline: 2px solid var(--steel); outline-offset: 2px;
    }

    .btn-ghost {
      background: transparent;
      color: var(--ink);
      border: 1.5px solid var(--line);
      padding: 12px 22px;
      border-radius: 3px;
      font-weight: 600;
      font-size: 15px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: border-color 0.15s ease, background 0.15s ease;
    }
    .btn-ghost:hover { border-color: var(--ink); background: rgba(0,0,0,0.02); }

    .stamp-ring {
      border: 2px dashed rgba(255,255,255,0.35);
      border-radius: 50%;
      animation: spin 40s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (prefers-reduced-motion: reduce) {
      .stamp-ring { animation: none; }
      .traco-root * { transition: none !important; animation: none !important; }
    }

    .chain-node {
      width: 74px; height: 74px; border-radius: 50%;
      border: 2px solid var(--navy);
      display: flex; align-items: center; justify-content: center;
      background: var(--paper);
      flex-shrink: 0;
    }
    .chain-line {
      flex: 1; height: 0; border-top: 2px dashed var(--line);
      min-width: 24px;
    }

    input, select {
      font-family: inherit;
      font-size: 14px;
      padding: 9px 11px;
      border: 1.5px solid var(--line);
      border-radius: 3px;
      background: white;
      color: var(--ink);
      width: 100%;
    }
    input:focus, select:focus {
      outline: none; border-color: var(--steel);
      box-shadow: 0 0 0 3px rgba(61,108,138,0.12);
    }
    label.field-label {
      font-size: 11.5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--graphite);
      display: block;
      margin-bottom: 6px;
    }

    table.data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
    table.data-table th {
      text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em;
      color: var(--graphite); font-weight: 600; padding: 8px 10px; border-bottom: 2px solid var(--ink);
    }
    table.data-table td { padding: 9px 10px; border-bottom: 1px solid var(--paper-line); }

    .status-pill {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 11.5px; font-weight: 600; padding: 3px 10px; border-radius: 20px;
    }

    .table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }

    .mobile-menu-btn { display: none; background: none; border: none; padding: 4px; }
    .mobile-menu-panel {
      display: flex; flex-direction: column; gap: 2px;
      padding: 6px 24px 20px; border-top: 1px solid var(--line); background: var(--paper);
    }
    .mobile-menu-panel a { padding: 12px 4px; font-size: 15px; font-weight: 500; border-bottom: 1px solid var(--paper-line); }

    .app-topbar-mobile { display: none; }
    .app-sidebar-scrim { display: none; }

    @media (max-width: 760px) {
      .hide-mobile { display: none !important; }
      .mobile-menu-btn { display: flex !important; }

      .hero-grid { grid-template-columns: 1fr !important; padding: 44px 20px 52px !important; gap: 32px !important; }
      .hero-stamp-circle { width: 208px !important; height: 208px !important; }

      .app-topbar-mobile {
        display: flex !important; align-items: center; justify-content: space-between;
        padding: 14px 18px; background: white; border-bottom: 1px solid var(--line);
        position: sticky; top: 0; z-index: 30;
      }
      .app-sidebar {
        position: fixed !important; top: 0; left: 0; height: 100vh; width: 250px !important;
        z-index: 70; transform: translateX(-100%); transition: transform 0.22s ease;
        box-shadow: 10px 0 34px rgba(0,0,0,0.28);
      }
      .app-sidebar.open { transform: translateX(0); }
      .app-sidebar-scrim {
        display: block !important; position: fixed; inset: 0;
        background: rgba(9,14,18,0.5); z-index: 65;
      }
      .app-main { padding: 18px 16px 64px !important; }

      .form-grid { grid-template-columns: 1fr !important; }
      .form-grid-padrao { grid-template-columns: 1fr !important; }
      .form-section { padding: 16px !important; }

      .action-row, .cert-toolbar { flex-direction: column !important; align-items: stretch !important; gap: 10px !important; }
      .action-row button, .cert-toolbar button { width: 100%; justify-content: center; }

      table.data-table { font-size: 12px; }
      table.data-table th, table.data-table td { padding: 7px 9px; white-space: nowrap; }

      .cert-doc { padding: 26px 16px 0 32px !important; }
      .cert-diagonal { width: 22px !important; clip-path: polygon(0 0, 100% 0, 30% 100%, 0 100%); }
      .cert-footer-bar { margin: 0 -16px 0 -32px !important; padding: 8px 12px !important; font-size: 9px !important; }
      .cert-title { font-size: 22px !important; }

      .cert-signature-row { flex-direction: column !important; align-items: center !important; gap: 18px; text-align: center !important; }
      .cert-signature-row > div:first-child, .cert-signature-row > div:last-child { text-align: center !important; }

      /* prevents iOS Safari from auto-zooming the page on input focus */
      input, select { font-size: 16px !important; }
    }

    /* ---- certificate document (matches the CTJ-pattern layout) ---- */
    .cert-doc {
      position: relative;
      background: white;
      overflow: hidden;
      border: 1px solid var(--line);
    }
    .cert-diagonal {
      position: absolute; top: 0; left: 0; width: 46px; height: 100%;
      background: var(--orange);
      clip-path: polygon(0 0, 100% 0, 34% 100%, 0 100%);
    }
    .cert-title {
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-weight: 700;
      color: var(--orange-dim);
    }
    .cert-field-row { display: flex; justify-content: flex-end; gap: 10px; font-size: 12.5px; margin-bottom: 3px; }
    .cert-field-label { color: var(--graphite); font-style: italic; font-size: 10.5px; }
    .cert-section-title {
      font-size: 12.5px; font-weight: 700; text-transform: none;
      border-bottom: 1.5px solid var(--ink); padding-bottom: 4px; margin: 22px 0 10px;
      display: flex; justify-content: space-between; align-items: baseline;
    }
    .cert-section-title .en { font-style: italic; font-weight: 400; font-size: 10.5px; color: var(--graphite); }
    .cert-doc table.data-table th { font-size: 10px; }
    .cert-doc table.data-table td, .cert-doc table.data-table th { padding: 6px 8px; }
    .cert-note { font-size: 10.5px; line-height: 1.6; color: var(--graphite); margin: 3px 0; }
    .cert-footer-bar {
      background: var(--navy); color: rgba(255,255,255,0.75);
      font-size: 10px; padding: 9px 24px; text-align: center;
      display: flex; justify-content: center; gap: 6px; flex-wrap: wrap;
    }
    @media print {
      .no-print { display: none !important; }
      .cert-page-break { page-break-before: always; }
      body, .traco-root { background: white !important; }
    }
  `}</style>
);

/* ------------------------------------------------------------------ */
/* Storage helpers                                                     */
/* ------------------------------------------------------------------ */
const STORAGE_KEY = "traco:certificados";

// Funciona dentro do Claude (window.storage) e também como site standalone
// (Vercel/Netlify), caso em que cai automaticamente para localStorage.
const storageAdapter = {
  async get(key) {
    if (typeof window !== "undefined" && window.storage) {
      return window.storage.get(key, false);
    }
    const v = localStorage.getItem(key);
    return v ? { value: v } : null;
  },
  async set(key, value) {
    if (typeof window !== "undefined" && window.storage) {
      return window.storage.set(key, value, false);
    }
    localStorage.setItem(key, value);
    return { value };
  },
};

async function loadCertificados() {
  try {
    const res = await storageAdapter.get(STORAGE_KEY);
    return res ? JSON.parse(res.value) : seedData();
  } catch {
    return seedData();
  }
}
async function saveCertificados(list) {
  try {
    await storageAdapter.set(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Falha ao salvar", e);
  }
}

function seedData() {
  return [
    {
      id: "cert-seed-1",
      numero: "TRC-0001/26",
      os: "OS-0044/26",
      dataCalibracao: "2026-06-18",
      responsavel: "Eng. Marina Alcântara",
      status: "emitido",
      cliente: {
        razaoSocial: "Metalúrgica Nordeste Ltda",
        endereco: "Av. Santos Dumont, 1200 - Aldeota - Fortaleza - CE",
        codigo: "CL-1029",
      },
      instrumento: {
        nome: "Termohigrômetro",
        fabricante: "Kasvi",
        modelo: "Não consta",
        numeroSerie: "Não consta",
        codigoId: "THG-08",
        faixa: "15 a 30 °C / 45 a 80 % ur",
        resolucao: "0,1 °C / 1 % ur",
      },
      padroes: [
        { descricao: "Termohigrômetro Testo 650", codigo: "TRC-H-004", certificado: "RBC-9002214", validade: "2026-11" },
      ],
      resultados: {
        temperatura: [
          { referencia: 14.9, medido: 15.1, k: 2.0, incerteza: 0.3 },
          { referencia: 20.0, medido: 20.1, k: 2.0, incerteza: 0.3 },
          { referencia: 30.0, medido: 30.3, k: 2.0, incerteza: 0.3 },
        ],
        umidade: [
          { referencia: 43.9, medido: 45.0, k: 2.0, incerteza: 1.6 },
          { referencia: 63.2, medido: 65.0, k: 2.0, incerteza: 2.2 },
        ],
      },
    },
  ];
}

function nextNumero(list) {
  const year = new Date().getFullYear().toString().slice(-2);
  const nums = list
    .map((c) => parseInt((c.numero || "").split("-")[1]?.split("/")[0], 10))
    .filter((n) => !isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `TRC-${String(next).padStart(4, "0")}/${year}`;
}

/* ------------------------------------------------------------------ */
/* Landing page pieces                                                  */
/* ------------------------------------------------------------------ */

function Nav({ onEnterApp }) {
  const [open, setOpen] = useState(false);
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(245,244,239,0.9)", backdropFilter: "blur(6px)", borderBottom: "1px solid var(--line)" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="26" height="26" viewBox="0 0 26 26">
            <circle cx="13" cy="13" r="11.5" fill="none" stroke="var(--ink)" strokeWidth="1.6" />
            <line x1="13" y1="2.2" x2="13" y2="6.2" stroke="var(--orange)" strokeWidth="1.8" />
            <line x1="13" y1="19.8" x2="13" y2="23.8" stroke="var(--ink)" strokeWidth="1.6" />
            <line x1="2.2" y1="13" x2="6.2" y2="13" stroke="var(--ink)" strokeWidth="1.6" />
            <line x1="19.8" y1="13" x2="23.8" y2="13" stroke="var(--ink)" strokeWidth="1.6" />
          </svg>
          <span className="disp" style={{ fontWeight: 700, fontSize: 19 }}>Traço</span>
        </div>
        <nav className="hide-mobile" style={{ display: "flex", gap: 30, fontSize: 14.5, fontWeight: 500 }}>
          <a href="#recursos">Recursos</a>
          <a href="#rastreabilidade">Rastreabilidade</a>
          <a href="#precos">Planos</a>
          <a href="#stack">Tecnologia</a>
        </nav>
        <div className="hide-mobile" style={{ display: "flex", gap: 12 }}>
          <button className="btn-ghost" onClick={onEnterApp}>Entrar</button>
          <button className="btn-primary" onClick={onEnterApp}>Ver demonstração <ArrowRight size={16} /></button>
        </div>
        <button className="mobile-menu-btn" onClick={() => setOpen((o) => !o)} aria-label="Abrir menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="mobile-menu-panel">
          <a href="#recursos" onClick={() => setOpen(false)}>Recursos</a>
          <a href="#rastreabilidade" onClick={() => setOpen(false)}>Rastreabilidade</a>
          <a href="#precos" onClick={() => setOpen(false)}>Planos</a>
          <a href="#stack" onClick={() => setOpen(false)}>Tecnologia</a>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            <button className="btn-ghost" style={{ justifyContent: "center" }} onClick={onEnterApp}>Entrar</button>
            <button className="btn-primary" style={{ justifyContent: "center" }} onClick={onEnterApp}>Ver demonstração <ArrowRight size={16} /></button>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero({ onEnterApp }) {
  const [count, setCount] = useState(482);
  useEffect(() => {
    const t = setInterval(() => setCount((c) => c + 1), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="grid-paper" style={{ borderBottom: "1px solid var(--line)" }}>
      <div className="hero-grid" style={{ maxWidth: 1180, margin: "0 auto", padding: "72px 24px 88px", display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 56, alignItems: "center" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 600, color: "var(--steel)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 18 }}>
            <ShieldCheck size={15} /> Conformidade ISO/IEC 17025 &middot; Inmetro
          </div>
          <h1 className="disp" style={{ fontSize: "clamp(32px, 4.6vw, 54px)", fontWeight: 700, lineHeight: 1.05, margin: "0 0 22px" }}>
            Certificados de calibração,<br />emitidos na velocidade do laboratório.
          </h1>
          <p style={{ fontSize: 17.5, color: "var(--graphite)", lineHeight: 1.6, maxWidth: 520, marginBottom: 32 }}>
            Traço automatiza a emissão de certificados de conformidade e calibração conforme normas do Inmetro — do cadastro do instrumento até o PDF assinado. Sem limite de certificados, de usuários, ou de crescimento.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={onEnterApp}>Acessar demonstração <ArrowRight size={17} /></button>
            <button className="btn-ghost" onClick={() => document.getElementById("precos")?.scrollIntoView({ behavior: "smooth" })}>Ver planos</button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="hero-stamp-circle" style={{ position: "relative", width: 260, height: 260, borderRadius: "50%", background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 24px 60px -20px rgba(16,26,34,0.5)" }}>
            <div className="stamp-ring" style={{ position: "absolute", inset: 14 }} />
            <div style={{ textAlign: "center", color: "white" }}>
              <div style={{ fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 8 }}>Certificado nº</div>
              <div className="mono" style={{ fontSize: 26, fontWeight: 600, color: "var(--orange)" }}>
                TRC-{String(count).padStart(4, "0")}/26
              </div>
              <div style={{ fontSize: 11, marginTop: 10, color: "rgba(255,255,255,0.55)" }}>emitido agora &middot; assinado digitalmente</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LogosBar() {
  const items = [
    { icon: Server, label: "FastAPI" },
    { icon: Database, label: "PostgreSQL" },
    { icon: Layers, label: "React" },
    { icon: Clock, label: "Celery + Redis" },
    { icon: Cloud, label: "S3 / R2" },
    { icon: Lock, label: "RBAC + Docker" },
  ];
  return (
    <div style={{ borderBottom: "1px solid var(--line)", background: "white" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "20px 24px", display: "flex", gap: 36, flexWrap: "wrap", justifyContent: "space-between" }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--graphite)", fontSize: 13.5, fontWeight: 500 }}>
            <it.icon size={16} /> {it.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function Features() {
  const feats = [
    { icon: Gauge, title: "Cálculo automático de incerteza", desc: "Erro de medição, incerteza expandida e fator k calculados a partir dos valores de referência e medidos — sem planilha paralela." },
    { icon: Boxes, title: "Multi-tenant de verdade", desc: "Cada laboratório opera isolado, com suas unidades, instrumentos-padrão e responsáveis técnicos — do MEI ao grupo com várias filiais." },
    { icon: FileText, title: "Templates por tipo de instrumento", desc: "Balanças, manômetros, termohigrômetros, paquímetros: cada categoria com sua tabela de resultados e sua norma associada." },
    { icon: ShieldCheck, title: "Assinatura e rastreabilidade", desc: "Assinatura digital do responsável técnico, numeração sequencial e trilha de auditoria imutável em cada certificado." },
    { icon: Users, title: "Papéis e permissões", desc: "Administrador, responsável técnico, operador e cliente-visualizador — cada um vê e assina exatamente o que deve." },
    { icon: Clock, title: "Emissão em lote, sem travar", desc: "Fila assíncrona processa centenas de certificados de uma vez, enquanto o time continua trabalhando no sistema." },
  ];
  return (
    <section id="recursos" style={{ maxWidth: 1180, margin: "0 auto", padding: "84px 24px" }}>
      <div style={{ maxWidth: 560, marginBottom: 48 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--orange)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Recursos</div>
        <h2 className="disp" style={{ fontSize: "clamp(26px,3vw,36px)", fontWeight: 700, margin: 0 }}>Feito para o fluxo real de um laboratório de calibração</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 1, background: "var(--line)", border: "1px solid var(--line)" }}>
        {feats.map((f, i) => (
          <div key={i} style={{ background: "white", padding: 30 }}>
            <f.icon size={22} color="var(--steel)" style={{ marginBottom: 16 }} />
            <h3 className="disp" style={{ fontSize: 17, fontWeight: 600, margin: "0 0 8px" }}>{f.title}</h3>
            <p style={{ fontSize: 14, color: "var(--graphite)", lineHeight: 1.55, margin: 0 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TraceabilityChain() {
  const nodes = [
    { label: "INMETRO / RBC", sub: "padrão nacional" },
    { label: "Laboratório padrão", sub: "instrumento de referência" },
    { label: "Instrumento do cliente", sub: "calibrado em campo ou bancada" },
    { label: "Certificado Traço", sub: "emitido e assinado" },
  ];
  return (
    <section id="rastreabilidade" style={{ background: "var(--navy)", color: "white", padding: "84px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--orange)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Cadeia de rastreabilidade</div>
        <h2 className="disp" style={{ fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, marginBottom: 40, maxWidth: 640 }}>
          Cada certificado carrega, embutida, a cadeia até o padrão nacional
        </h2>
        <div style={{ display: "flex", alignItems: "center", overflowX: "auto", paddingBottom: 8 }}>
          {nodes.map((n, i) => (
            <React.Fragment key={i}>
              <div style={{ textAlign: "center", width: 150, flexShrink: 0 }}>
                <div className="chain-node" style={{ margin: "0 auto 12px", borderColor: i === nodes.length - 1 ? "var(--orange)" : "rgba(255,255,255,0.5)", background: "var(--navy-2)" }}>
                  <span className="mono" style={{ fontSize: 20, color: i === nodes.length - 1 ? "var(--orange)" : "white" }}>{i + 1}</span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{n.label}</div>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", marginTop: 3 }}>{n.sub}</div>
              </div>
              {i < nodes.length - 1 && <div className="chain-line" style={{ borderColor: "rgba(255,255,255,0.25)" }} />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ onEnterApp }) {
  const tiers = [
    {
      name: "Pequeno laboratório",
      desc: "Para quem está começando a formalizar a emissão",
      price: "R$ 249",
      period: "/mês",
      features: ["Certificados ilimitados", "1 responsável técnico", "1 unidade", "Templates padrão", "Suporte por e-mail"],
    },
    {
      name: "Laboratório em crescimento",
      desc: "Para operações com mais de uma equipe técnica",
      price: "R$ 890",
      period: "/mês",
      features: ["Certificados ilimitados", "Até 10 responsáveis técnicos", "Até 5 unidades", "Templates personalizados", "Portal do cliente", "Suporte prioritário"],
      highlight: true,
    },
    {
      name: "Grande operação",
      desc: "Para grupos com múltiplas filiais e alto volume",
      price: "Sob consulta",
      period: "",
      features: ["Certificados e usuários ilimitados", "Unidades e filiais ilimitadas", "Assinatura ICP-Brasil", "SLA dedicado", "Integração via API"],
    },
  ];
  return (
    <section id="precos" style={{ maxWidth: 1180, margin: "0 auto", padding: "84px 24px" }}>
      <div style={{ maxWidth: 560, marginBottom: 48 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--orange)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Planos</div>
        <h2 className="disp" style={{ fontSize: "clamp(26px,3vw,36px)", fontWeight: 700, margin: "0 0 10px" }}>O volume de certificados nunca é o limite</h2>
        <p style={{ color: "var(--graphite)", fontSize: 15 }}>Os planos escalam por usuários, unidades e suporte — nunca por quantos certificados seu laboratório emite.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        {tiers.map((t, i) => (
          <div key={i} style={{
            background: t.highlight ? "var(--navy)" : "white",
            color: t.highlight ? "white" : "var(--ink)",
            border: t.highlight ? "none" : "1px solid var(--line)",
            borderRadius: 6, padding: 30,
            display: "flex", flexDirection: "column",
          }}>
            <h3 className="disp" style={{ fontSize: 18, fontWeight: 600, margin: "0 0 6px" }}>{t.name}</h3>
            <p style={{ fontSize: 13.5, color: t.highlight ? "rgba(255,255,255,0.6)" : "var(--graphite)", marginBottom: 20, minHeight: 36 }}>{t.desc}</p>
            <div style={{ marginBottom: 22 }}>
              <span className="mono" style={{ fontSize: 30, fontWeight: 600 }}>{t.price}</span>
              <span style={{ fontSize: 13.5, color: t.highlight ? "rgba(255,255,255,0.6)" : "var(--graphite)" }}>{t.period}</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 26px", flex: 1 }}>
              {t.features.map((f, j) => (
                <li key={j} style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 13.5, marginBottom: 11 }}>
                  <Check size={15} style={{ marginTop: 2, flexShrink: 0, color: "var(--orange)" }} /> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={onEnterApp}
              className={t.highlight ? "btn-primary" : "btn-ghost"}
              style={t.highlight ? {} : { borderColor: "var(--line)" }}
            >
              Começar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function StackSection() {
  const layers = [
    { label: "Frontend", value: "React + dashboard multi-tenant" },
    { label: "API", value: "FastAPI (Python) — cálculo de incerteza nativo" },
    { label: "Fila assíncrona", value: "Celery + Redis — emissão em lote" },
    { label: "Banco de dados", value: "PostgreSQL — isolado por tenant" },
    { label: "Arquivos", value: "S3-compatível — PDFs e anexos" },
    { label: "Infraestrutura", value: "Docker — escala horizontal sem retrabalho" },
  ];
  return (
    <section id="stack" className="grid-paper" style={{ borderTop: "1px solid var(--line)", padding: "84px 24px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--orange)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Sob o capô</div>
        <h2 className="disp" style={{ fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, marginBottom: 32 }}>Arquitetura pensada para crescer sem re-escrever</h2>
        <div style={{ border: "1px solid var(--line)", background: "white" }}>
          {layers.map((l, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "16px 20px", borderBottom: i < layers.length - 1 ? "1px solid var(--paper-line)" : "none", flexWrap: "wrap" }}>
              <span style={{ fontWeight: 600, fontSize: 14, minWidth: 150 }}>{l.label}</span>
              <span className="mono" style={{ fontSize: 13.5, color: "var(--graphite)" }}>{l.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", padding: "36px 24px", background: "white" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 13, color: "var(--graphite)" }}>
        <span>© 2026 Traço. Plataforma de certificados de calibração.</span>
        <span>Conforme ABNT NBR ISO/IEC 17025 &middot; requisitos Inmetro/CGCRE</span>
      </div>
    </footer>
  );
}

function LandingPage({ onEnterApp }) {
  return (
    <div>
      <Nav onEnterApp={onEnterApp} />
      <Hero onEnterApp={onEnterApp} />
      <LogosBar />
      <Features />
      <TraceabilityChain />
      <Pricing onEnterApp={onEnterApp} />
      <StackSection />
      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* App shell (demo)                                                     */
/* ------------------------------------------------------------------ */

function Sidebar({ page, setPage, onExit, open }) {
  const items = [
    { id: "dashboard", label: "Painel", icon: BarChart3 },
    { id: "certificados", label: "Certificados", icon: FileText },
    { id: "novo", label: "Novo certificado", icon: PlusCircle },
    { id: "clientes", label: "Clientes", icon: Building2 },
    { id: "usuarios", label: "Usuários", icon: Users },
    { id: "config", label: "Configurações", icon: Settings },
  ];
  return (
    <aside className={`app-sidebar${open ? " open" : ""}`} style={{ width: 226, flexShrink: 0, background: "var(--navy)", color: "white", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div style={{ padding: "22px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 9 }}>
        <svg width="22" height="22" viewBox="0 0 26 26">
          <circle cx="13" cy="13" r="11.5" fill="none" stroke="white" strokeWidth="1.6" />
          <line x1="13" y1="2.2" x2="13" y2="6.2" stroke="var(--orange)" strokeWidth="1.8" />
          <line x1="13" y1="19.8" x2="13" y2="23.8" stroke="white" strokeWidth="1.6" />
          <line x1="2.2" y1="13" x2="6.2" y2="13" stroke="white" strokeWidth="1.6" />
          <line x1="19.8" y1="13" x2="23.8" y2="13" stroke="white" strokeWidth="1.6" />
        </svg>
        <span className="disp" style={{ fontWeight: 700, fontSize: 17 }}>Traço</span>
      </div>
      <div style={{ padding: "16px 20px", fontSize: 11.5, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Metalúrgica Nordeste Ltda
      </div>
      <nav style={{ flex: 1, padding: "0 12px" }}>
        {items.map((it) => (
          <button
            key={it.id}
            className="btn-nav"
            onClick={() => setPage(it.id)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 11,
              padding: "10px 12px", marginBottom: 3, borderRadius: 4, border: "none",
              background: page === it.id ? "rgba(232,89,12,0.16)" : "transparent",
              color: page === it.id ? "var(--orange)" : "rgba(255,255,255,0.8)",
              fontSize: 14, fontWeight: 500, textAlign: "left",
            }}
          >
            <it.icon size={17} /> {it.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: 16 }}>
        <button className="btn-ghost" style={{ width: "100%", justifyContent: "center", color: "white", borderColor: "rgba(255,255,255,0.25)" }} onClick={onExit}>
          <ArrowLeft size={15} /> Sair da demo
        </button>
      </div>
    </aside>
  );
}

function StatusPill({ status }) {
  const map = {
    emitido: { bg: "rgba(44,122,75,0.12)", color: "var(--seal-green)", label: "Emitido" },
    rascunho: { bg: "rgba(74,86,80,0.12)", color: "var(--graphite)", label: "Rascunho" },
  };
  const s = map[status] || map.rascunho;
  return <span className="status-pill" style={{ background: s.bg, color: s.color }}><Check size={12} /> {s.label}</span>;
}

function Dashboard({ certificados, setPage }) {
  const total = certificados.length;
  const mesAtual = certificados.filter((c) => (c.dataCalibracao || "").startsWith("2026-06") || (c.dataCalibracao || "").startsWith("2026-07")).length;
  const cards = [
    { label: "Certificados emitidos", value: total, icon: FileText },
    { label: "Emitidos este mês", value: mesAtual, icon: Clock },
    { label: "Clientes ativos", value: new Set(certificados.map((c) => c.cliente?.razaoSocial)).size, icon: Building2 },
    { label: "Responsáveis técnicos", value: new Set(certificados.map((c) => c.responsavel)).size || 1, icon: Users },
  ];
  return (
    <div>
      <h1 className="disp" style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Painel</h1>
      <p style={{ color: "var(--graphite)", fontSize: 14.5, marginBottom: 28 }}>Visão geral da operação de calibração.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 16, marginBottom: 34 }}>
        {cards.map((c, i) => (
          <div key={i} style={{ background: "white", border: "1px solid var(--line)", borderRadius: 6, padding: 20 }}>
            <c.icon size={18} color="var(--steel)" style={{ marginBottom: 12 }} />
            <div className="mono" style={{ fontSize: 26, fontWeight: 600 }}>{c.value}</div>
            <div style={{ fontSize: 12.5, color: "var(--graphite)", marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: 6, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--paper-line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Certificados recentes</h3>
          <button className="btn-ghost" style={{ padding: "7px 14px", fontSize: 13 }} onClick={() => setPage("certificados")}>Ver todos</button>
        </div>
        <div className="table-scroll">
        <table className="data-table">
          <thead><tr><th>Nº</th><th>Cliente</th><th>Instrumento</th><th>Data</th><th>Status</th></tr></thead>
          <tbody>
            {certificados.slice(0, 5).map((c) => (
              <tr key={c.id}>
                <td className="mono">{c.numero}</td>
                <td>{c.cliente?.razaoSocial}</td>
                <td>{c.instrumento?.nome}</td>
                <td className="mono">{c.dataCalibracao}</td>
                <td><StatusPill status={c.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

function CertificateList({ certificados, setPage, setActiveId }) {
  const [q, setQ] = useState("");
  const filtered = certificados.filter((c) =>
    (c.cliente?.razaoSocial + c.numero + c.instrumento?.nome).toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="disp" style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Certificados</h1>
          <p style={{ color: "var(--graphite)", fontSize: 14.5, margin: 0 }}>{certificados.length} certificado(s) emitido(s)</p>
        </div>
        <button className="btn-primary" onClick={() => setPage("novo")}><PlusCircle size={16} /> Novo certificado</button>
      </div>
      <div style={{ position: "relative", marginBottom: 18, maxWidth: 340 }}>
        <Search size={15} style={{ position: "absolute", left: 11, top: 11, color: "var(--graphite)" }} />
        <input style={{ paddingLeft: 32 }} placeholder="Buscar por cliente, número, instrumento..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: 6, overflow: "hidden" }}>
        <div className="table-scroll">
        <table className="data-table">
          <thead><tr><th>Nº certificado</th><th>Cliente</th><th>Instrumento</th><th>Data calibração</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 30, color: "var(--graphite)" }}>Nenhum certificado encontrado.</td></tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id} style={{ cursor: "pointer" }} onClick={() => { setActiveId(c.id); setPage("ver"); }}>
                <td className="mono">{c.numero}</td>
                <td>{c.cliente?.razaoSocial}</td>
                <td>{c.instrumento?.nome} <span style={{ color: "var(--graphite)" }}>({c.instrumento?.codigoId})</span></td>
                <td className="mono">{c.dataCalibracao}</td>
                <td><StatusPill status={c.status} /></td>
                <td><ChevronRight size={16} color="var(--graphite)" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

/* ---- New certificate form ---- */

function emptyForm() {
  return {
    cliente: { razaoSocial: "", endereco: "", codigo: "" },
    instrumento: { nome: "", fabricante: "", modelo: "", numeroSerie: "", codigoId: "", faixa: "", resolucao: "" },
    dataCalibracao: "",
    responsavel: "",
    padroes: [{ descricao: "", codigo: "", certificado: "", validade: "" }],
    resultados: {
      temperatura: [{ referencia: "", medido: "", k: "2,00", incerteza: "" }],
      umidade: [{ referencia: "", medido: "", k: "2,00", incerteza: "" }],
    },
  };
}

function Section({ title, children }) {
  return (
    <div className="form-section" style={{ background: "white", border: "1px solid var(--line)", borderRadius: 6, padding: 22, marginBottom: 18 }}>
      <h3 style={{ fontSize: 14.5, fontWeight: 600, margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--graphite)" }}>{title}</h3>
      {children}
    </div>
  );
}

function ResultTable({ label, icon: Icon, rows, onChange }) {
  const update = (i, field, value) => {
    const copy = rows.map((r, idx) => (idx === i ? { ...r, [field]: value } : r));
    onChange(copy);
  };
  const addRow = () => onChange([...rows, { referencia: "", medido: "", k: "2,00", incerteza: "" }]);
  const removeRow = (i) => onChange(rows.filter((_, idx) => idx !== i));
  const erro = (r) => {
    const ref = parseFloat(String(r.referencia).replace(",", "."));
    const med = parseFloat(String(r.medido).replace(",", "."));
    if (isNaN(ref) || isNaN(med)) return "—";
    return (med - ref).toFixed(1).replace(".", ",");
  };
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10, fontWeight: 600, fontSize: 13.5 }}>
        <Icon size={15} color="var(--steel)" /> {label}
      </div>
      <div className="table-scroll">
      <table className="data-table">
        <thead><tr><th>Referência</th><th>Medido</th><th>Erro</th><th>k</th><th>Incerteza</th><th></th></tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td><input value={r.referencia} onChange={(e) => update(i, "referencia", e.target.value)} placeholder="20,0" /></td>
              <td><input value={r.medido} onChange={(e) => update(i, "medido", e.target.value)} placeholder="20,1" /></td>
              <td className="mono" style={{ color: "var(--graphite)" }}>{erro(r)}</td>
              <td><input value={r.k} onChange={(e) => update(i, "k", e.target.value)} style={{ width: 70 }} /></td>
              <td><input value={r.incerteza} onChange={(e) => update(i, "incerteza", e.target.value)} placeholder="0,3" style={{ width: 80 }} /></td>
              <td>{rows.length > 1 && <button onClick={() => removeRow(i)} style={{ background: "none", border: "none" }}><Trash2 size={15} color="var(--alert)" /></button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <button className="btn-ghost" style={{ marginTop: 10, padding: "7px 14px", fontSize: 13 }} onClick={addRow}><PlusCircle size={14} /> Adicionar leitura</button>
    </div>
  );
}

function NewCertificate({ certificados, onSave, setPage }) {
  const [form, setForm] = useState(emptyForm());

  const setCliente = (field, v) => setForm((f) => ({ ...f, cliente: { ...f.cliente, [field]: v } }));
  const setInstrumento = (field, v) => setForm((f) => ({ ...f, instrumento: { ...f.instrumento, [field]: v } }));
  const setPadrao = (i, field, v) => setForm((f) => ({ ...f, padroes: f.padroes.map((p, idx) => (idx === i ? { ...p, [field]: v } : p)) }));
  const addPadrao = () => setForm((f) => ({ ...f, padroes: [...f.padroes, { descricao: "", codigo: "", certificado: "", validade: "" }] }));
  const removePadrao = (i) => setForm((f) => ({ ...f, padroes: f.padroes.filter((_, idx) => idx !== i) }));

  const canSave = form.cliente.razaoSocial && form.instrumento.nome && form.dataCalibracao;

  const handleSave = () => {
    const novo = {
      id: "cert-" + Date.now(),
      numero: nextNumero(certificados),
      os: "OS-" + String(1000 + certificados.length).slice(-4) + "/26",
      status: "emitido",
      ...form,
    };
    onSave(novo);
  };

  return (
    <div style={{ maxWidth: 780 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <button onClick={() => setPage("certificados")} style={{ background: "none", border: "none" }}><ArrowLeft size={18} /></button>
        <h1 className="disp" style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Novo certificado</h1>
      </div>
      <p style={{ color: "var(--graphite)", fontSize: 14, marginBottom: 22 }}>Próximo número: <span className="mono">{nextNumero(certificados)}</span></p>

      <Section title="Cliente">
        <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 14 }}>
          <div><label className="field-label">Razão social</label><input value={form.cliente.razaoSocial} onChange={(e) => setCliente("razaoSocial", e.target.value)} placeholder="Ex: Metalúrgica Nordeste Ltda" /></div>
          <div><label className="field-label">Código do cliente</label><input value={form.cliente.codigo} onChange={(e) => setCliente("codigo", e.target.value)} placeholder="CL-0000" /></div>
        </div>
        <label className="field-label">Endereço</label>
        <input value={form.cliente.endereco} onChange={(e) => setCliente("endereco", e.target.value)} placeholder="Rua, número - bairro - cidade - UF" />
      </Section>

      <Section title="Instrumento">
        <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div><label className="field-label">Instrumento</label><input value={form.instrumento.nome} onChange={(e) => setInstrumento("nome", e.target.value)} placeholder="Termohigrômetro" /></div>
          <div><label className="field-label">Código de identificação</label><input value={form.instrumento.codigoId} onChange={(e) => setInstrumento("codigoId", e.target.value)} placeholder="THG-12" /></div>
          <div><label className="field-label">Fabricante</label><input value={form.instrumento.fabricante} onChange={(e) => setInstrumento("fabricante", e.target.value)} /></div>
          <div><label className="field-label">Modelo</label><input value={form.instrumento.modelo} onChange={(e) => setInstrumento("modelo", e.target.value)} /></div>
          <div><label className="field-label">Número de série</label><input value={form.instrumento.numeroSerie} onChange={(e) => setInstrumento("numeroSerie", e.target.value)} /></div>
          <div><label className="field-label">Resolução</label><input value={form.instrumento.resolucao} onChange={(e) => setInstrumento("resolucao", e.target.value)} placeholder="0,1 °C / 1 % ur" /></div>
        </div>
        <label className="field-label">Faixa de calibração</label>
        <input value={form.instrumento.faixa} onChange={(e) => setInstrumento("faixa", e.target.value)} placeholder="15 a 30 °C / 45 a 80 % ur" />
      </Section>

      <Section title="Padrões utilizados">
        {form.padroes.map((p, i) => (
          <div key={i} className="form-grid-padrao" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 10, marginBottom: 10, alignItems: "end" }}>
            <div><label className="field-label">Descrição</label><input value={p.descricao} onChange={(e) => setPadrao(i, "descricao", e.target.value)} placeholder="Termohigrômetro Testo 650" /></div>
            <div><label className="field-label">Código</label><input value={p.codigo} onChange={(e) => setPadrao(i, "codigo", e.target.value)} /></div>
            <div><label className="field-label">Certificado</label><input value={p.certificado} onChange={(e) => setPadrao(i, "certificado", e.target.value)} /></div>
            <div><label className="field-label">Validade</label><input value={p.validade} onChange={(e) => setPadrao(i, "validade", e.target.value)} placeholder="2026-11" /></div>
            {form.padroes.length > 1 && <button onClick={() => removePadrao(i)} style={{ background: "none", border: "none" }}><Trash2 size={16} color="var(--alert)" /></button>}
          </div>
        ))}
        <button className="btn-ghost" style={{ padding: "7px 14px", fontSize: 13 }} onClick={addPadrao}><PlusCircle size={14} /> Adicionar padrão</button>
      </Section>

      <Section title="Resultados">
        <ResultTable label="Temperatura (°C)" icon={Thermometer} rows={form.resultados.temperatura} onChange={(rows) => setForm((f) => ({ ...f, resultados: { ...f.resultados, temperatura: rows } }))} />
        <ResultTable label="Umidade relativa (% ur)" icon={Droplets} rows={form.resultados.umidade} onChange={(rows) => setForm((f) => ({ ...f, resultados: { ...f.resultados, umidade: rows } }))} />
      </Section>

      <Section title="Emissão">
        <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div><label className="field-label">Data da calibração</label><input type="date" value={form.dataCalibracao} onChange={(e) => setForm((f) => ({ ...f, dataCalibracao: e.target.value }))} /></div>
          <div><label className="field-label">Responsável técnico</label><input value={form.responsavel} onChange={(e) => setForm((f) => ({ ...f, responsavel: e.target.value }))} placeholder="Eng. Nome Sobrenome" /></div>
        </div>
      </Section>

      <div className="action-row" style={{ display: "flex", gap: 12 }}>
        <button className="btn-primary" disabled={!canSave} style={!canSave ? { opacity: 0.4, cursor: "not-allowed" } : {}} onClick={handleSave}>
          <Check size={16} /> Gerar certificado
        </button>
        <button className="btn-ghost" onClick={() => setPage("certificados")}>Cancelar</button>
      </div>
    </div>
  );
}

/* ---- View / printable certificate ---- */

function FieldRow({ label, labelEn, value }) {
  return (
    <div className="cert-field-row">
      <span className="cert-field-label">{label} <i>/ {labelEn}</i>:</span>
      <span className="mono" style={{ fontWeight: 600 }}>{value || "—"}</span>
    </div>
  );
}

function CertificateView({ cert, setPage }) {
  if (!cert) return null;
  const erro = (ref, med) => {
    const r = parseFloat(String(ref).replace(",", "."));
    const m = parseFloat(String(med).replace(",", "."));
    if (isNaN(r) || isNaN(m)) return "—";
    return (m - r).toFixed(1).replace(".", ",");
  };
  const fmtDate = (iso) => {
    if (!iso) return "—";
    const [y, m, d] = iso.split("-");
    return d ? `${d}/${m}/${y}` : iso;
  };

  return (
    <div>
      <div className="cert-toolbar no-print" style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <button onClick={() => setPage("certificados")} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500 }}>
          <ArrowLeft size={17} /> Voltar
        </button>
        <button className="btn-primary" onClick={() => window.print()}><Printer size={15} /> Exportar / Imprimir PDF</button>
      </div>

      {/* ===== PÁGINA 1 — identificação ===== */}
      <div className="cert-doc" style={{ maxWidth: 780, margin: "0 auto 24px", padding: "36px 40px 0 60px" }}>
        <div className="cert-diagonal" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 className="cert-title" style={{ fontSize: 30, margin: "0 0 2px" }}>Certificado de Calibração</h2>
            <div style={{ fontSize: 11, fontStyle: "italic", color: "var(--graphite)" }}>Calibration Certificate issued by Traço</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="30" height="30" viewBox="0 0 26 26">
              <circle cx="13" cy="13" r="11.5" fill="none" stroke="var(--ink)" strokeWidth="1.6" />
              <line x1="13" y1="2.2" x2="13" y2="6.2" stroke="var(--orange)" strokeWidth="1.8" />
              <line x1="13" y1="19.8" x2="13" y2="23.8" stroke="var(--ink)" strokeWidth="1.6" />
              <line x1="2.2" y1="13" x2="6.2" y2="13" stroke="var(--ink)" strokeWidth="1.6" />
              <line x1="19.8" y1="13" x2="23.8" y2="13" stroke="var(--ink)" strokeWidth="1.6" />
            </svg>
            <span className="disp" style={{ fontWeight: 700, fontSize: 16 }}>Traço</span>
          </div>
        </div>

        <div style={{ fontSize: 11, textAlign: "center", color: "var(--graphite)", margin: "10px 0 20px", lineHeight: 1.5 }}>
          Laboratório de calibração operando conforme a ABNT NBR ISO/IEC 17025, com emissão rastreada pela plataforma Traço
        </div>

        <div className="cert-section-title"><span>Identificação do Certificado</span><span className="en">Certificate Data</span></div>
        <div>
          <FieldRow label="Certificado de Calibração" labelEn="Calibration Certificate" value={cert.numero} />
          <FieldRow label="Ordem de Serviço nº" labelEn="Service Order" value={cert.os} />
          <FieldRow label="Data da Calibração" labelEn="Calibration Date" value={fmtDate(cert.dataCalibracao)} />
          <FieldRow label="Página" labelEn="Page Number" value="01 / 02" />
        </div>

        <div className="cert-section-title"><span>Identificação do Cliente</span><span className="en">Customer's Data</span></div>
        <table style={{ width: "100%", fontSize: 12.5, borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ padding: "4px 0", width: "60%" }}>
                <div className="cert-field-label">Razão Social <i>/ Company Name</i>:</div>
                <div style={{ fontWeight: 600 }}>{cert.cliente?.razaoSocial || "—"}</div>
              </td>
              <td style={{ padding: "4px 0" }}>
                <div className="cert-field-label">Código <i>/ ID Code</i>:</div>
                <div className="mono" style={{ fontWeight: 600 }}>{cert.cliente?.codigo || "—"}</div>
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{ padding: "4px 0" }}>
                <div className="cert-field-label">Endereço <i>/ Address</i>:</div>
                <div>{cert.cliente?.endereco || "—"}</div>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="cert-section-title"><span>Identificação do Instrumento</span><span className="en">Measurand Data</span></div>
        <table style={{ width: "100%", fontSize: 12.5, borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ padding: "4px 0", width: "50%" }}><div className="cert-field-label">Instrumento <i>/ Measuring Instrument</i>:</div><div style={{ fontWeight: 600 }}>{cert.instrumento?.nome || "—"}</div></td>
              <td style={{ padding: "4px 0" }}><div className="cert-field-label">Cód. de Identificação <i>/ ID Code</i>:</div><div className="mono" style={{ fontWeight: 600 }}>{cert.instrumento?.codigoId || "—"}</div></td>
            </tr>
            <tr>
              <td style={{ padding: "4px 0" }}><div className="cert-field-label">Fabricante <i>/ Manufacturer</i>:</div><div>{cert.instrumento?.fabricante || "—"}</div></td>
              <td style={{ padding: "4px 0" }}><div className="cert-field-label">Modelo / Tipo <i>/ Model</i>:</div><div>{cert.instrumento?.modelo || "Não consta"}</div></td>
            </tr>
            <tr>
              <td style={{ padding: "4px 0" }}><div className="cert-field-label">Número de Série <i>/ Serial Number</i>:</div><div className="mono">{cert.instrumento?.numeroSerie || "Não consta"}</div></td>
              <td style={{ padding: "4px 0" }}><div className="cert-field-label">Resolução <i>/ Resolution</i>:</div><div>{cert.instrumento?.resolucao || "—"}</div></td>
            </tr>
            <tr>
              <td colSpan={2} style={{ padding: "4px 0" }}><div className="cert-field-label">Faixa de Calibração <i>/ Measuring Range</i>:</div><div>{cert.instrumento?.faixa || "—"}</div></td>
            </tr>
          </tbody>
        </table>

        {cert.padroes?.length > 0 && (
          <>
            <div className="cert-section-title"><span>Padrão Utilizado</span><span className="en">Measurement Standard</span></div>
            <div className="table-scroll">
            <table className="data-table">
              <thead><tr><th>Descrição / Description</th><th>Código / Code</th><th>Nº Certificado / Certificate</th><th>Validade / Valid Until</th></tr></thead>
              <tbody>{cert.padroes.map((p, i) => (
                <tr key={i}><td>{p.descricao || "—"}</td><td className="mono">{p.codigo || "—"}</td><td className="mono">{p.certificado || "—"}</td><td className="mono">{p.validade || "—"}</td></tr>
              ))}</tbody>
            </table>
            </div>
          </>
        )}

        <div className="cert-section-title"><span>Observação</span><span className="en">Notes</span></div>
        <div style={{ paddingBottom: 8 }}>
          <p className="cert-note">A incerteza expandida de medição relatada é declarada como a incerteza padrão multiplicada pelo fator de abrangência k, de tal forma que a probabilidade de abrangência corresponde a aproximadamente 95%.</p>
          <p className="cert-note">Este certificado se refere apenas ao instrumento identificado acima e às condições descritas. Sua reprodução parcial não é autorizada sem a emissão original completa.</p>
          <p className="cert-note">Este certificado foi conferido e assinado digitalmente por meio de senha eletrônica, garantindo sua autenticidade e inviolabilidade.</p>
        </div>

        <div className="cert-section-title" style={{ marginBottom: 6 }}><span>Procedimento de Calibração</span><span className="en">Measurement Procedure</span></div>
        <p className="cert-note" style={{ marginBottom: 26 }}>Os resultados obtidos são médias de leituras sucessivas. O instrumento em referência foi calibrado por comparação direta a instrumentos de características padrão, conforme procedimento(s) interno(s) do laboratório.</p>

        <div className="cert-signature-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: 20 }}>
          <div style={{ fontSize: 11, color: "var(--graphite)" }}>
            <div>Data da Emissão <i>/ Issued on</i></div>
            <div className="mono" style={{ fontWeight: 600, color: "var(--ink)" }}>{fmtDate(cert.dataCalibracao)}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 20, color: "var(--steel)", borderBottom: "1px solid var(--ink)", paddingBottom: 4, minWidth: 200 }}>
              {cert.responsavel || "—"}
            </div>
            <div style={{ fontSize: 10.5, marginTop: 4 }}>{cert.responsavel || "—"}</div>
            <div style={{ fontSize: 10, fontStyle: "italic", color: "var(--graphite)" }}>Responsável Técnico / Technical Manager</div>
          </div>
          <div style={{ textAlign: "right", fontSize: 10, color: "var(--seal-green)" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 600 }}><ShieldCheck size={13} /> Assinado digitalmente</div>
            <div style={{ color: "var(--graphite)", marginTop: 2 }}>{cert.numero}</div>
          </div>
        </div>

        <div className="cert-footer-bar" style={{ margin: "0 -40px 0 -60px" }}>
          <span>Traço — Plataforma de Certificados de Calibração</span><span>&middot;</span><span>Documento gerado eletronicamente</span>
        </div>
      </div>

      {/* ===== PÁGINA 2 — folha de resultado ===== */}
      <div className="cert-doc cert-page-break" style={{ maxWidth: 780, margin: "0 auto", padding: "36px 40px 0 60px" }}>
        <div className="cert-diagonal" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <h2 className="cert-title" style={{ fontSize: 22, margin: 0 }}>Certificado de Calibração</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="24" height="24" viewBox="0 0 26 26">
              <circle cx="13" cy="13" r="11.5" fill="none" stroke="var(--ink)" strokeWidth="1.6" />
              <line x1="13" y1="2.2" x2="13" y2="6.2" stroke="var(--orange)" strokeWidth="1.8" />
              <line x1="13" y1="19.8" x2="13" y2="23.8" stroke="var(--ink)" strokeWidth="1.6" />
              <line x1="2.2" y1="13" x2="6.2" y2="13" stroke="var(--ink)" strokeWidth="1.6" />
              <line x1="19.8" y1="13" x2="23.8" y2="13" stroke="var(--ink)" strokeWidth="1.6" />
            </svg>
            <span className="disp" style={{ fontWeight: 700, fontSize: 15 }}>Traço</span>
          </div>
        </div>

        <div className="cert-section-title"><span>Identificação do Certificado</span><span className="en">Certificate Data</span></div>
        <div style={{ marginBottom: 6 }}>
          <FieldRow label="Certificado de Calibração" labelEn="Calibration Certificate" value={cert.numero} />
          <FieldRow label="Ordem de Serviço nº" labelEn="Service Order" value={cert.os} />
          <FieldRow label="Data da Calibração" labelEn="Calibration Date" value={fmtDate(cert.dataCalibracao)} />
          <FieldRow label="Página" labelEn="Page Number" value="02 / 02" />
        </div>

        <div className="cert-section-title"><span>Folha de Resultado</span><span className="en">Results Sheet</span></div>
        <p className="cert-note">Valor de Referência — valor indicado no instrumento padrão. Valor Medido — valor medido no instrumento em calibração. Erro de Medição = Valor Medido − Valor de Referência.</p>

        {["temperatura", "umidade"].map((g) =>
          cert.resultados?.[g]?.length > 0 && (
            <div key={g} style={{ margin: "18px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>
                {g === "temperatura" ? <Thermometer size={13} /> : <Droplets size={13} />} {g === "temperatura" ? "Temperatura" : "Umidade"}
              </div>
              <div className="table-scroll">
              <table className="data-table">
                <thead><tr><th>Valor de Referência</th><th>Valor Medido</th><th>Erro de Medição</th><th>k</th><th>Incerteza de Medição</th></tr></thead>
                <tbody>{cert.resultados[g].map((r, i) => (
                  <tr key={i}>
                    <td className="mono">{r.referencia || "—"}</td><td className="mono">{r.medido || "—"}</td>
                    <td className="mono">{erro(r.referencia, r.medido)}</td>
                    <td className="mono">{r.k}</td><td className="mono">{r.incerteza || "—"}</td>
                  </tr>
                ))}</tbody>
              </table>
              </div>
            </div>
          )
        )}

        <div style={{ height: 40 }} />
        <div className="cert-footer-bar" style={{ margin: "0 -40px 0 -60px" }}>
          <span>Traço — Plataforma de Certificados de Calibração</span><span>&middot;</span><span>Documento gerado eletronicamente</span>
        </div>
      </div>
    </div>
  );
}

function Placeholder({ title }) {
  return (
    <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--graphite)" }}>
      <ClipboardList size={30} style={{ marginBottom: 14, opacity: 0.5 }} />
      <h2 className="disp" style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "var(--ink)" }}>{title}</h2>
      <p style={{ fontSize: 14 }}>Módulo de demonstração — em construção nesta versão do protótipo.</p>
    </div>
  );
}

function AppShell({ onExit }) {
  const [page, setPage] = useState("dashboard");
  const [certificados, setCertificados] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadCertificados().then((list) => { setCertificados(list); setLoaded(true); });
  }, []);

  const handleSave = useCallback((novo) => {
    setCertificados((prev) => {
      const updated = [novo, ...prev];
      saveCertificados(updated);
      return updated;
    });
    setActiveId(novo.id);
    setPage("ver");
  }, []);

  const activeCert = certificados.find((c) => c.id === activeId);
  const goPage = (p) => { setPage(p); setSidebarOpen(false); };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {sidebarOpen && <div className="app-sidebar-scrim" onClick={() => setSidebarOpen(false)} />}
      <Sidebar page={page} setPage={goPage} onExit={onExit} open={sidebarOpen} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div className="app-topbar-mobile">
          <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none" }} aria-label="Abrir menu">
            <Menu size={22} color="var(--ink)" />
          </button>
          <span className="disp" style={{ fontWeight: 700, fontSize: 16 }}>Traço</span>
          <div style={{ width: 22 }} />
        </div>
        <main className="app-main" style={{ flex: 1, padding: "32px 36px", background: "var(--paper)" }}>
          {!loaded ? (
            <div style={{ color: "var(--graphite)", fontSize: 14 }}>Carregando...</div>
          ) : page === "dashboard" ? (
            <Dashboard certificados={certificados} setPage={setPage} />
          ) : page === "certificados" ? (
            <CertificateList certificados={certificados} setPage={setPage} setActiveId={setActiveId} />
          ) : page === "novo" ? (
            <NewCertificate certificados={certificados} onSave={handleSave} setPage={setPage} />
          ) : page === "ver" ? (
            <CertificateView cert={activeCert} setPage={setPage} />
          ) : page === "clientes" ? (
            <Placeholder title="Clientes" />
          ) : page === "usuarios" ? (
            <Placeholder title="Usuários e permissões" />
          ) : (
            <Placeholder title="Configurações" />
          )}
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Root                                                                 */
/* ------------------------------------------------------------------ */

export default function TracoApp() {
  const [view, setView] = useState("landing");
  return (
    <div className="traco-root">
      <GlobalStyle />
      {view === "landing" ? (
        <LandingPage onEnterApp={() => setView("app")} />
      ) : (
        <AppShell onExit={() => setView("landing")} />
      )}
    </div>
  );
}
