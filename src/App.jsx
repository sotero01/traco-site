import React, { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  ShieldCheck, FileText, Gauge, Boxes, Users, Settings as SettingsIcon, PlusCircle, Search,
  Printer, ArrowRight, Layers, Database, Server, Cloud, Lock, ChevronRight,
  X, Trash2, Building2, Thermometer, Droplets, Menu, Check, ClipboardList,
  BarChart3, Clock, ArrowLeft, Beaker, Image as ImageIcon, PenTool, Upload,
  QrCode, Download
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
      .cert-footer-bar { padding: 8px 10px !important; font-size: 8.5px !important; }
      .cert-title { font-size: 22px !important; }

      .cert-signature-row { flex-direction: column !important; align-items: center !important; gap: 18px; text-align: center !important; }
      .cert-signature-row > div:first-child, .cert-signature-row > div:last-child { text-align: center !important; }

      /* prevents iOS Safari from auto-zooming the page on input focus */
      input, select { font-size: 16px !important; }
    }

    /* ---- certificate document (matches the CTJ/Elus reference pattern) ---- */
    .cert-doc {
      position: relative;
      background: white;
      overflow: hidden;
      border: 1px solid var(--line);
      display: flex;
      flex-direction: column;
    }
    .cert-diagonal {
      position: absolute; top: 0; left: 0; width: 46px; height: 100%;
      background: var(--orange);
      clip-path: polygon(0 0, 100% 0, 34% 100%, 0 100%);
      z-index: 1;
    }
    .cert-watermark {
      position: absolute; inset: 0; overflow: hidden; pointer-events: none;
      user-select: none; z-index: 0;
    }
    .cert-content {
      position: relative; z-index: 1; flex: 1;
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
      position: relative; z-index: 1;
      background: white; color: var(--graphite);
      font-size: 9.5px; padding: 10px 20px; text-align: center; line-height: 1.6;
      border-top: 1px solid var(--paper-line); margin-top: 24px;
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

const CONFIG_KEY = "traco:config";

function defaultConfig() {
  return {
    empresaNome: "",
    logoDataUrl: null,
    endereco: "",
    telefone: "",
    email: "",
    acreditacaoNumero: "",
    acreditacaoData: "",
    responsavelNome: "",
    responsavelCargo: "Responsável Técnico",
    assinaturaDataUrl: null,
  };
}
async function loadConfig() {
  try {
    const res = await storageAdapter.get(CONFIG_KEY);
    return res ? { ...defaultConfig(), ...JSON.parse(res.value) } : defaultConfig();
  } catch {
    return defaultConfig();
  }
}
async function saveConfig(cfg) {
  try {
    await storageAdapter.set(CONFIG_KEY, JSON.stringify(cfg));
  } catch (e) {
    console.error("Falha ao salvar configuração", e);
  }
}

function fileToDataUrl(file, cb) {
  const reader = new FileReader();
  reader.onload = () => cb(reader.result);
  reader.readAsDataURL(file);
}

/* ==================================================================== */
/* Motor de incerteza (GUM) — portado das fórmulas da planilha PP-014     */
/* (Tipo A/B, combinação por quadratura, Welch-Satterthwaite, Student-t)  */
/* ==================================================================== */

// Student-t bicaudal a 95,45% de confiança (p = 0,0455) — Anexo G, Tabela G.2
// do Guia para Expressão da Incerteza de Medição (GUM). Mesma tabela que a
// planilha original consulta via TINV(0,0455; veff).
const T_TABLE_9545 = [
  [1, 13.97], [2, 4.527], [3, 3.307], [4, 2.869], [5, 2.649], [6, 2.517],
  [7, 2.429], [8, 2.366], [9, 2.320], [10, 2.284], [11, 2.256], [12, 2.233],
  [13, 2.214], [14, 2.198], [15, 2.184], [16, 2.173], [17, 2.162], [18, 2.154],
  [19, 2.145], [20, 2.139], [25, 2.113], [30, 2.097], [35, 2.086], [40, 2.078],
  [45, 2.072], [50, 2.067], [60, 2.059], [80, 2.048], [100, 2.042],
];

function studentT9545(v) {
  if (!isFinite(v) || v <= 0) return 2.0;
  if (v >= 100) return 2.0;
  for (let i = 0; i < T_TABLE_9545.length - 1; i++) {
    const [v1, t1] = T_TABLE_9545[i];
    const [v2, t2] = T_TABLE_9545[i + 1];
    if (v >= v1 && v <= v2) {
      const frac = (v - v1) / (v2 - v1);
      return t1 + frac * (t2 - t1);
    }
  }
  return 2.0;
}

function parseNum(v) {
  if (v === "" || v === null || v === undefined) return NaN;
  return parseFloat(String(v).replace(",", "."));
}
function meanOf(arr) {
  const nums = (arr || []).map(parseNum).filter((n) => !isNaN(n));
  if (!nums.length) return NaN;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}
function countValid(arr) {
  return (arr || []).map(parseNum).filter((n) => !isNaN(n)).length;
}
function stdevOf(arr) {
  const nums = (arr || []).map(parseNum).filter((n) => !isNaN(n));
  if (nums.length < 2) return 0;
  const m = meanOf(nums);
  const variance = nums.reduce((a, b) => a + (b - m) ** 2, 0) / (nums.length - 1);
  return Math.sqrt(variance);
}
// Tipo B, distribuição retangular: entra a amplitude total (ex.: resolução),
// internamente meia-amplitude / √3 — mesma convenção da planilha (C = a/2; divisor √3).
function typeBRect(fullRange) {
  const n = parseNum(fullRange);
  if (isNaN(n) || n === 0) return 0;
  return (n / 2) / Math.sqrt(3);
}
// Tipo B, distribuição normal (ex.: incerteza expandida do certificado do padrão): U/k.
function typeBNormal(U, k) {
  const u = parseNum(U);
  const kk = parseNum(k) || 2;
  if (isNaN(u)) return 0;
  return u / kk;
}

function emptyPontoIncerteza() {
  return {
    leiturasPadrao: ["", "", "", "", ""],
    leiturasInstrumento: ["", "", "", "", ""],
    correcaoPadrao: "0",
    incertezaPadrao: "",
    kPadrao: "2",
    derivaPadrao: "",
    outrasContribuicoes: "",
  };
}

// Núcleo do cálculo — reproduz a estrutura da aba "Incerteza" da planilha PP-014
// para um ponto de calibração: incerteza do SMC (instrumento sob calibração),
// incerteza do SMP (padrão de referência), combinação, graus de liberdade
// efetivos (Welch-Satterthwaite) e incerteza expandida (k de Student a 95,45%).
function computeIncertezaPonto(ponto, resolucaoInstrumento, resolucaoPadrao) {
  const leiturasP = ponto.leiturasPadrao || [];
  const leiturasI = ponto.leiturasInstrumento || [];

  const mediaPadrao = meanOf(leiturasP);
  const mediaInstrumento = meanOf(leiturasI);
  const nPadrao = countValid(leiturasP);
  const nInstr = countValid(leiturasI);
  const stdevPadrao = stdevOf(leiturasP);
  const stdevInstr = stdevOf(leiturasI);

  // Incerteza do SMC (instrumento sob calibração)
  const u_Tm = nInstr > 1 ? stdevInstr / Math.sqrt(nInstr) : 0;
  const v_Tm = nInstr > 1 ? nInstr - 1 : 0;
  const u_resInstr = typeBRect(resolucaoInstrumento);
  const u_outras = typeBRect(ponto.outrasContribuicoes);
  const uc_smc = Math.sqrt(u_Tm ** 2 + u_resInstr ** 2 + u_outras ** 2);

  // Incerteza do SMP (padrão de referência)
  const u_Tmpad = nPadrao > 1 ? stdevPadrao / Math.sqrt(nPadrao) : 0;
  const v_Tmpad = nPadrao > 1 ? nPadrao - 1 : 0;
  const u_cert = typeBNormal(ponto.incertezaPadrao, ponto.kPadrao);
  const u_resPad = typeBRect(resolucaoPadrao);
  const u_deriva = typeBRect(ponto.derivaPadrao);
  const uc_smp = Math.sqrt(u_Tmpad ** 2 + u_cert ** 2 + u_resPad ** 2 + u_deriva ** 2);

  // Combinação por quadratura
  const uc = Math.sqrt(uc_smc ** 2 + uc_smp ** 2);

  // Graus de liberdade efetivos (Welch-Satterthwaite) — só as contribuições
  // Tipo A entram no denominador; Tipo B (v = ∞) contribuem 0.
  const denom = (v_Tm > 0 ? u_Tm ** 4 / v_Tm : 0) + (v_Tmpad > 0 ? u_Tmpad ** 4 / v_Tmpad : 0);
  const veff = (denom === 0 || uc === 0) ? Infinity : (uc ** 4) / denom;

  const k = studentT9545(veff);
  const uexp = uc * k;

  const correcaoPadrao = parseNum(ponto.correcaoPadrao) || 0;
  const valorConvencionado = (isNaN(mediaPadrao) ? 0 : mediaPadrao) + correcaoPadrao;
  const erro = (isNaN(mediaInstrumento) ? 0 : mediaInstrumento) - valorConvencionado;

  return {
    mediaPadrao, mediaInstrumento, nPadrao, nInstr,
    valorConvencionado, erro, uc_smc, uc_smp, uc, veff, k, uexp,
  };
}

/* ==================================================================== */
/* Verificação por QR Code — o certificado carrega, dentro do próprio    */
/* QR, um resumo assinado (checksum leve) dos dados essenciais, para que */
/* a verificação funcione em qualquer dispositivo, sem precisar de       */
/* servidor/banco de dados central.                                      */
/* ==================================================================== */

// Checksum simples (não-criptográfico) só pra sinalizar se o payload foi
// adulterado depois de gerado — não substitui uma assinatura digital real.
function lightChecksum(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h.toString(36);
}

function base64UrlEncode(str) {
  const b64 = btoa(unescape(encodeURIComponent(str)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function base64UrlDecode(str) {
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  return decodeURIComponent(escape(atob(b64)));
}

function buildVerificationPayload(cert, config) {
  const base = {
    id: cert.id,
    n: cert.numero,
    t: cert.tipo,
    e: config?.empresaNome || "Traço",
    s: cert.status,
    r: cert.responsavel || "",
  };
  if (cert.tipo === "mrc") {
    base.a = cert.mrcNome;
    base.d = cert.dataCertificacao;
    base.c = cert.codigo;
    base.l = cert.lote;
  } else {
    base.a = `${cert.cliente?.razaoSocial || ""} — ${cert.instrumento?.nome || ""}`;
    base.d = cert.dataCalibracao;
    base.c = cert.instrumento?.codigoId || "";
  }
  const payloadStr = JSON.stringify(base);
  const chk = lightChecksum(payloadStr);
  return base64UrlEncode(JSON.stringify({ d: base, c: chk }));
}

function decodeVerificationPayload(encoded) {
  try {
    const parsed = JSON.parse(base64UrlDecode(encoded));
    const expected = lightChecksum(JSON.stringify(parsed.d));
    return { data: parsed.d, valid: expected === parsed.c };
  } catch {
    return null;
  }
}

function buildVerificationUrl(cert, config) {
  const payload = buildVerificationPayload(cert, config);
  const origin = typeof window !== "undefined" ? window.location.origin + window.location.pathname : "";
  return `${origin}?v=${payload}`;
}

// Captura os "cartões" do certificado (um por página) e monta um PDF real,
// multi-página, em vez de depender só da caixa de impressão do navegador.
async function downloadCertificatePdf(pageElements, filename) {
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < pageElements.length; i++) {
    const el = pageElements[i];
    if (!el) continue;
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const ratio = Math.min((pageWidth - 40) / canvas.width, (pageHeight - 40) / canvas.height);
    const w = canvas.width * ratio;
    const h = canvas.height * ratio;
    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, "PNG", (pageWidth - w) / 2, 20, w, h);
  }
  pdf.save(filename);
}

function seedData() {
  return [
    {
      id: "cert-seed-1",
      tipo: "calibracao",
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
        temperatura: {
          resolucaoInstrumento: "0,1",
          resolucaoPadrao: "0,01",
          pontos: [
            { leiturasPadrao: ["14,85", "14,88", "14,87", "14,86", "14,89"], leiturasInstrumento: ["15,1", "15,1", "15,2", "15,1", "15,0"], correcaoPadrao: "0,02", incertezaPadrao: "0,05", kPadrao: "2", derivaPadrao: "0,02", outrasContribuicoes: "0,1" },
            { leiturasPadrao: ["19,98", "20,01", "19,99", "20,00", "20,02"], leiturasInstrumento: ["20,1", "20,1", "20,1", "20,2", "20,1"], correcaoPadrao: "0,01", incertezaPadrao: "0,05", kPadrao: "2", derivaPadrao: "0,02", outrasContribuicoes: "0,1" },
            { leiturasPadrao: ["29,95", "29,97", "29,96", "29,98", "29,94"], leiturasInstrumento: ["30,3", "30,2", "30,3", "30,4", "30,3"], correcaoPadrao: "0,03", incertezaPadrao: "0,05", kPadrao: "2", derivaPadrao: "0,02", outrasContribuicoes: "0,1" },
          ],
        },
        umidade: {
          resolucaoInstrumento: "1",
          resolucaoPadrao: "0,5",
          pontos: [
            { leiturasPadrao: ["43,8", "43,9", "44,0", "43,9", "43,8"], leiturasInstrumento: ["45", "45", "46", "45", "45"], correcaoPadrao: "0", incertezaPadrao: "1,5", kPadrao: "2", derivaPadrao: "0,3", outrasContribuicoes: "0,5" },
            { leiturasPadrao: ["63,0", "63,2", "63,3", "63,1", "63,2"], leiturasInstrumento: ["65", "65", "66", "65", "65"], correcaoPadrao: "0", incertezaPadrao: "1,5", kPadrao: "2", derivaPadrao: "0,3", outrasContribuicoes: "0,5" },
          ],
        },
      },
    },
    {
      id: "cert-seed-2",
      tipo: "mrc",
      numero: "MR-001/26",
      status: "emitido",
      mrcNome: "Solução Padrão de Condutividade 1,413 mS/cm",
      codigo: "TRCOND1413",
      lote: "0626-TRCOND1413-0091",
      descricao: "O Material de Referência Certificado consiste em uma solução eletrolítica preparada a partir de sal de cloreto de potássio e água purificada.",
      preparacao: "O material foi preparado gravimetricamente e envasado em frasco de polietileno de alta densidade.",
      metodologia: "O valor certificado foi obtido por caracterização com condutivímetro calibrado, conforme estudos de homogeneidade e estabilidade baseados na ABNT ISO 17034.",
      rastreabilidade: "A rastreabilidade foi assegurada por medição com célula de condutividade calibrada por padrão rastreado ao Sistema Internacional de Unidades (SI).",
      finalidade: "Uso para calibração e verificação de medidores de condutividade eletrolítica.",
      armazenamento: "Armazenar em ambiente protegido da luz, entre 15 e 30 °C. Após o uso, fechar bem o frasco e manter refrigerado.",
      valorCertificado: { grandeza: "Condutividade eletrolítica", valor: "1,413", unidade: "mS/cm", incerteza: "0,01", temperaturaRef: "25,0", incertezaTemp: "0,1" },
      dataCertificacao: "2026-06-10",
      validadeLote: "2027-06",
      responsavel: "Eng. Marina Alcântara",
      cargo: "Signatária Autorizada",
      informacoesAdicionais: [
        "A integridade deste material é assegurada até a abertura da embalagem, se esta estiver íntegra.",
        "Este MRC deve ser manuseado conforme as instruções deste certificado e a ficha de segurança correspondente.",
        "Este certificado perde a validade caso o material seja danificado, contaminado ou alterado.",
        "Este certificado é válido apenas para o lote produzido, não sendo extensivo a outros lotes.",
        "A reprodução deste certificado só pode ser feita de forma integral, sem alterações.",
      ],
    },
  ];
}

function nextNumero(list) {
  const year = new Date().getFullYear().toString().slice(-2);
  const nums = list
    .filter((c) => c.tipo !== "mrc")
    .map((c) => parseInt((c.numero || "").split("-")[1]?.split("/")[0], 10))
    .filter((n) => !isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `TRC-${String(next).padStart(4, "0")}/${year}`;
}

function nextNumeroMRC(list) {
  const year = new Date().getFullYear().toString().slice(-2);
  const nums = list
    .filter((c) => c.tipo === "mrc")
    .map((c) => parseInt((c.numero || "").split("-")[1]?.split("/")[0], 10))
    .filter((n) => !isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `MR-${String(next).padStart(3, "0")}/${year}`;
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
    { id: "config", label: "Configurações", icon: SettingsIcon },
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
  const dataDe = (c) => c.tipo === "mrc" ? c.dataCertificacao : c.dataCalibracao;
  const mesAtual = certificados.filter((c) => (dataDe(c) || "").startsWith("2026-06") || (dataDe(c) || "").startsWith("2026-07")).length;
  const cards = [
    { label: "Certificados emitidos", value: total, icon: FileText },
    { label: "Emitidos este mês", value: mesAtual, icon: Clock },
    { label: "Clientes ativos", value: new Set(certificados.map((c) => c.cliente?.razaoSocial).filter(Boolean)).size, icon: Building2 },
    { label: "Responsáveis técnicos", value: new Set(certificados.map((c) => c.responsavel).filter(Boolean)).size || 1, icon: Users },
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
          <thead><tr><th>Nº</th><th>Tipo</th><th>Assunto</th><th>Data</th><th>Status</th></tr></thead>
          <tbody>
            {certificados.slice(0, 5).map((c) => (
              <tr key={c.id}>
                <td className="mono">{c.numero}</td>
                <td><TypeTag tipo={c.tipo} /></td>
                <td>{c.tipo === "mrc" ? c.mrcNome : `${c.cliente?.razaoSocial || ""} — ${c.instrumento?.nome || ""}`}</td>
                <td className="mono">{dataDe(c)}</td>
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

function TypeTag({ tipo }) {
  const isMrc = tipo === "mrc";
  return (
    <span className="status-pill" style={{ background: isMrc ? "rgba(61,108,138,0.12)" : "rgba(232,89,12,0.12)", color: isMrc ? "var(--steel)" : "var(--orange-dim)" }}>
      {isMrc ? <Beaker size={12} /> : <Thermometer size={12} />} {isMrc ? "MRC" : "Calibração"}
    </span>
  );
}

function CertificateList({ certificados, setPage, setActiveId }) {
  const [q, setQ] = useState("");
  const searchText = (c) => (c.tipo === "mrc"
    ? `${c.mrcNome || ""} ${c.numero || ""} ${c.codigo || ""}`
    : `${c.cliente?.razaoSocial || ""} ${c.numero || ""} ${c.instrumento?.nome || ""}`
  ).toLowerCase();
  const filtered = certificados.filter((c) => searchText(c).includes(q.toLowerCase()));
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
          <thead><tr><th>Nº certificado</th><th>Tipo</th><th>Assunto</th><th>Data</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 30, color: "var(--graphite)" }}>Nenhum certificado encontrado.</td></tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id} style={{ cursor: "pointer" }} onClick={() => { setActiveId(c.id); setPage("ver"); }}>
                <td className="mono">{c.numero}</td>
                <td><TypeTag tipo={c.tipo} /></td>
                <td>
                  {c.tipo === "mrc"
                    ? <>{c.mrcNome} <span style={{ color: "var(--graphite)" }}>({c.codigo})</span></>
                    : <>{c.cliente?.razaoSocial} — {c.instrumento?.nome}</>
                  }
                </td>
                <td className="mono">{c.tipo === "mrc" ? c.dataCertificacao : c.dataCalibracao}</td>
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
      temperatura: { resolucaoInstrumento: "0,1", resolucaoPadrao: "0,01", pontos: [emptyPontoIncerteza()] },
      umidade: { resolucaoInstrumento: "1", resolucaoPadrao: "0,5", pontos: [emptyPontoIncerteza()] },
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

// Pequeno input compacto usado dentro dos cartões de ponto de calibração.
function MiniField({ label, value, onChange, placeholder, width }) {
  return (
    <div style={{ width: width || "auto", flex: width ? "none" : 1, minWidth: 58 }}>
      <div style={{ fontSize: 9.5, color: "var(--graphite)", marginBottom: 3, textAlign: "center" }}>{label}</div>
      <input value={value} onChange={onChange} placeholder={placeholder} style={{ padding: "6px 6px", fontSize: 12.5, textAlign: "center" }} />
    </div>
  );
}

function fmtNum(n, casas = 3) {
  if (!isFinite(n)) return "—";
  return n.toFixed(casas).replace(".", ",");
}

// Um ponto de calibração: 5 leituras do padrão + 5 leituras do instrumento,
// contribuições Tipo B, e o resultado do cálculo de incerteza (GUM) ao vivo.
function PontoIncertezaCard({ ponto, index, resolucaoInstrumento, resolucaoPadrao, onChange, onRemove, canRemove }) {
  const set = (field, v) => onChange({ ...ponto, [field]: v });
  const setLeitura = (arrField, i, v) => {
    const arr = [...ponto[arrField]];
    arr[i] = v;
    onChange({ ...ponto, [arrField]: arr });
  };
  const r = computeIncertezaPonto(ponto, resolucaoInstrumento, resolucaoPadrao);

  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 6, padding: 16, marginBottom: 14, background: "var(--paper)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 12.5 }}>Ponto {index + 1}</span>
        {canRemove && <button onClick={onRemove} style={{ background: "none", border: "none" }}><Trash2 size={15} color="var(--alert)" /></button>}
      </div>

      <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--graphite)", marginBottom: 6 }}>Leituras do padrão (SMP)</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {ponto.leiturasPadrao.map((v, i) => (
          <MiniField key={i} label={`L${i + 1}`} value={v} onChange={(e) => setLeitura("leiturasPadrao", i, e.target.value)} />
        ))}
      </div>

      <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--graphite)", marginBottom: 6 }}>Leituras do instrumento (SMC)</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {ponto.leiturasInstrumento.map((v, i) => (
          <MiniField key={i} label={`L${i + 1}`} value={v} onChange={(e) => setLeitura("leiturasInstrumento", i, e.target.value)} />
        ))}
      </div>

      <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--graphite)", marginBottom: 6 }}>Dados do padrão neste ponto</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        <MiniField label="Correção" value={ponto.correcaoPadrao} onChange={(e) => set("correcaoPadrao", e.target.value)} placeholder="0,02" />
        <MiniField label="U certificado" value={ponto.incertezaPadrao} onChange={(e) => set("incertezaPadrao", e.target.value)} placeholder="0,05" />
        <MiniField label="k certificado" value={ponto.kPadrao} onChange={(e) => set("kPadrao", e.target.value)} placeholder="2" />
        <MiniField label="Deriva" value={ponto.derivaPadrao} onChange={(e) => set("derivaPadrao", e.target.value)} placeholder="0,02" />
        <MiniField label="Outras contrib." value={ponto.outrasContribuicoes} onChange={(e) => set("outrasContribuicoes", e.target.value)} placeholder="0,1" />
      </div>

      <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: 4, padding: "10px 12px", display: "flex", flexWrap: "wrap", gap: "6px 18px", fontSize: 11.5 }}>
        <span><b>V.C.</b> <span className="mono">{fmtNum(r.valorConvencionado, 2)}</span></span>
        <span><b>V.M.I.</b> <span className="mono">{fmtNum(r.mediaInstrumento, 2)}</span></span>
        <span><b>Erro</b> <span className="mono">{fmtNum(r.erro, 2)}</span></span>
        <span><b>uc</b> <span className="mono">{fmtNum(r.uc, 4)}</span></span>
        <span><b>ν<span style={{ fontSize: 9 }}>eff</span></b> <span className="mono">{r.k >= 2 && r.veff >= 100 ? "∞" : fmtNum(r.veff, 1)}</span></span>
        <span><b>k</b> <span className="mono">{fmtNum(r.k, 2)}</span></span>
        <span style={{ color: "var(--steel)", fontWeight: 700 }}><b>U<span style={{ fontSize: 9 }}>exp</span></b> <span className="mono">{fmtNum(r.uexp, 2)}</span></span>
      </div>
    </div>
  );
}

// Bloco completo de uma grandeza (Temperatura ou Umidade): resolução do
// instrumento/padrão + lista de pontos de calibração com o cálculo de
// incerteza (GUM) ao vivo, portado das fórmulas da planilha PP-014.
function IncertezaGrandeza({ label, icon: Icon, grandeza, onChange }) {
  const setResolucao = (field, v) => onChange({ ...grandeza, [field]: v });
  const setPonto = (i, novoPonto) => {
    const pontos = grandeza.pontos.map((p, idx) => (idx === i ? novoPonto : p));
    onChange({ ...grandeza, pontos });
  };
  const addPonto = () => onChange({ ...grandeza, pontos: [...grandeza.pontos, emptyPontoIncerteza()] });
  const removePonto = (i) => onChange({ ...grandeza, pontos: grandeza.pontos.filter((_, idx) => idx !== i) });

  return (
    <div style={{ marginBottom: 26 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12, fontWeight: 600, fontSize: 13.5 }}>
        <Icon size={15} color="var(--steel)" /> {label}
      </div>
      <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
        <div><label className="field-label">Resolução do instrumento</label><input value={grandeza.resolucaoInstrumento} onChange={(e) => setResolucao("resolucaoInstrumento", e.target.value)} placeholder="0,1" /></div>
        <div><label className="field-label">Resolução do padrão</label><input value={grandeza.resolucaoPadrao} onChange={(e) => setResolucao("resolucaoPadrao", e.target.value)} placeholder="0,01" /></div>
      </div>

      {grandeza.pontos.map((ponto, i) => (
        <PontoIncertezaCard
          key={i}
          ponto={ponto}
          index={i}
          resolucaoInstrumento={grandeza.resolucaoInstrumento}
          resolucaoPadrao={grandeza.resolucaoPadrao}
          onChange={(novoPonto) => setPonto(i, novoPonto)}
          onRemove={() => removePonto(i)}
          canRemove={grandeza.pontos.length > 1}
        />
      ))}
      <button className="btn-ghost" style={{ padding: "7px 14px", fontSize: 13 }} onClick={addPonto}><PlusCircle size={14} /> Adicionar ponto de calibração</button>
    </div>
  );
}

function emptyFormMRC() {
  return {
    mrcNome: "",
    codigo: "",
    lote: "",
    descricao: "",
    preparacao: "",
    metodologia: "",
    rastreabilidade: "",
    finalidade: "",
    armazenamento: "",
    valorCertificado: { grandeza: "", valor: "", unidade: "", incerteza: "", temperaturaRef: "25,0", incertezaTemp: "0,5" },
    dataCertificacao: "",
    validadeLote: "",
    responsavel: "",
    cargo: "Signatário Autorizado",
    informacoesAdicionais: [
      "A integridade deste material é assegurada até a abertura da embalagem, se esta estiver íntegra.",
      "Este MRC deve ser manuseado conforme as instruções deste certificado e a ficha de segurança correspondente.",
      "Este certificado perde a validade caso o material seja danificado, contaminado ou alterado.",
      "Este certificado é válido apenas para o lote produzido, não sendo extensivo a outros lotes.",
      "A reprodução deste certificado só pode ser feita de forma integral, sem alterações.",
    ],
  };
}

function TypeToggle({ tipo, setTipo }) {
  const opts = [
    { id: "calibracao", label: "Calibração", icon: Thermometer },
    { id: "mrc", label: "Material de Referência (MRC)", icon: Beaker },
  ];
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
      {opts.map((o) => (
        <button
          key={o.id}
          onClick={() => setTipo(o.id)}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 4,
            border: `1.5px solid ${tipo === o.id ? "var(--orange)" : "var(--line)"}`,
            background: tipo === o.id ? "rgba(232,89,12,0.08)" : "white",
            color: tipo === o.id ? "var(--orange-dim)" : "var(--ink)",
            fontWeight: 600, fontSize: 13.5,
          }}
        >
          <o.icon size={15} /> {o.label}
        </button>
      ))}
    </div>
  );
}

function NewCertificate({ certificados, onSave, setPage, config }) {
  const [tipo, setTipo] = useState("calibracao");
  const [form, setForm] = useState(emptyForm());
  const [formMrc, setFormMrc] = useState(emptyFormMRC());

  const setCliente = (field, v) => setForm((f) => ({ ...f, cliente: { ...f.cliente, [field]: v } }));
  const setInstrumento = (field, v) => setForm((f) => ({ ...f, instrumento: { ...f.instrumento, [field]: v } }));
  const setPadrao = (i, field, v) => setForm((f) => ({ ...f, padroes: f.padroes.map((p, idx) => (idx === i ? { ...p, [field]: v } : p)) }));
  const addPadrao = () => setForm((f) => ({ ...f, padroes: [...f.padroes, { descricao: "", codigo: "", certificado: "", validade: "" }] }));
  const removePadrao = (i) => setForm((f) => ({ ...f, padroes: f.padroes.filter((_, idx) => idx !== i) }));

  const setMrc = (field, v) => setFormMrc((f) => ({ ...f, [field]: v }));
  const setValorCert = (field, v) => setFormMrc((f) => ({ ...f, valorCertificado: { ...f.valorCertificado, [field]: v } }));
  const setInfoAdicional = (i, v) => setFormMrc((f) => ({ ...f, informacoesAdicionais: f.informacoesAdicionais.map((it, idx) => (idx === i ? v : it)) }));
  const addInfoAdicional = () => setFormMrc((f) => ({ ...f, informacoesAdicionais: [...f.informacoesAdicionais, ""] }));
  const removeInfoAdicional = (i) => setFormMrc((f) => ({ ...f, informacoesAdicionais: f.informacoesAdicionais.filter((_, idx) => idx !== i) }));

  const responsavelPadrao = config?.responsavelNome || "";
  const cargoPadrao = config?.responsavelCargo || "Responsável Técnico";

  const canSave = tipo === "calibracao"
    ? form.cliente.razaoSocial && form.instrumento.nome && form.dataCalibracao
    : formMrc.mrcNome && formMrc.codigo && formMrc.dataCertificacao;

  const handleSave = () => {
    if (tipo === "calibracao") {
      onSave({
        id: "cert-" + Date.now(),
        tipo: "calibracao",
        numero: nextNumero(certificados),
        os: "OS-" + String(1000 + certificados.length).slice(-4) + "/26",
        status: "emitido",
        responsavel: form.responsavel || responsavelPadrao,
        ...form,
      });
    } else {
      onSave({
        id: "cert-" + Date.now(),
        tipo: "mrc",
        numero: nextNumeroMRC(certificados),
        status: "emitido",
        responsavel: formMrc.responsavel || responsavelPadrao,
        cargo: formMrc.cargo || cargoPadrao,
        ...formMrc,
      });
    }
  };

  return (
    <div style={{ maxWidth: 780 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <button onClick={() => setPage("certificados")} style={{ background: "none", border: "none" }}><ArrowLeft size={18} /></button>
        <h1 className="disp" style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Novo certificado</h1>
      </div>
      <p style={{ color: "var(--graphite)", fontSize: 14, marginBottom: 18 }}>
        Próximo número: <span className="mono">{tipo === "calibracao" ? nextNumero(certificados) : nextNumeroMRC(certificados)}</span>
      </p>

      <TypeToggle tipo={tipo} setTipo={setTipo} />

      {tipo === "calibracao" ? (
        <>
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
            <IncertezaGrandeza label="Temperatura (°C)" icon={Thermometer} grandeza={form.resultados.temperatura} onChange={(g) => setForm((f) => ({ ...f, resultados: { ...f.resultados, temperatura: g } }))} />
            <IncertezaGrandeza label="Umidade relativa (% ur)" icon={Droplets} grandeza={form.resultados.umidade} onChange={(g) => setForm((f) => ({ ...f, resultados: { ...f.resultados, umidade: g } }))} />
          </Section>

          <Section title="Emissão">
            <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div><label className="field-label">Data da calibração</label><input type="date" value={form.dataCalibracao} onChange={(e) => setForm((f) => ({ ...f, dataCalibracao: e.target.value }))} /></div>
              <div><label className="field-label">Responsável técnico</label><input value={form.responsavel} onChange={(e) => setForm((f) => ({ ...f, responsavel: e.target.value }))} placeholder={responsavelPadrao || "Eng. Nome Sobrenome"} /></div>
            </div>
          </Section>
        </>
      ) : (
        <>
          <Section title="Identificação do MRC">
            <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 14 }}>
              <div><label className="field-label">Nome do MRC</label><input value={formMrc.mrcNome} onChange={(e) => setMrc("mrcNome", e.target.value)} placeholder="Ex: Solução Padrão de Condutividade 1,413 mS/cm" /></div>
              <div><label className="field-label">Código</label><input value={formMrc.codigo} onChange={(e) => setMrc("codigo", e.target.value)} placeholder="TRCOND1413" /></div>
            </div>
            <label className="field-label">Lote</label>
            <input value={formMrc.lote} onChange={(e) => setMrc("lote", e.target.value)} placeholder="0626-TRCOND1413-0091" />
          </Section>

          <Section title="Descrição e preparação">
            <label className="field-label">Descrição do MRC</label>
            <input value={formMrc.descricao} onChange={(e) => setMrc("descricao", e.target.value)} placeholder="Do que é composto o material de referência" style={{ marginBottom: 14 }} />
            <label className="field-label">Preparação do MRC</label>
            <input value={formMrc.preparacao} onChange={(e) => setMrc("preparacao", e.target.value)} placeholder="Como o material foi preparado e envasado" />
          </Section>

          <Section title="Metodologia e rastreabilidade">
            <label className="field-label">Metodologia analítica</label>
            <input value={formMrc.metodologia} onChange={(e) => setMrc("metodologia", e.target.value)} placeholder="Como o valor certificado foi obtido" style={{ marginBottom: 14 }} />
            <label className="field-label">Rastreabilidade</label>
            <input value={formMrc.rastreabilidade} onChange={(e) => setMrc("rastreabilidade", e.target.value)} placeholder="Como a rastreabilidade metrológica foi garantida" />
          </Section>

          <Section title="Uso e armazenamento">
            <label className="field-label">Finalidade de uso</label>
            <input value={formMrc.finalidade} onChange={(e) => setMrc("finalidade", e.target.value)} placeholder="Para que esse MRC deve ser usado" style={{ marginBottom: 14 }} />
            <label className="field-label">Armazenamento e manipulação</label>
            <input value={formMrc.armazenamento} onChange={(e) => setMrc("armazenamento", e.target.value)} placeholder="Condições de armazenamento e cuidados" />
          </Section>

          <Section title="Valor certificado e incerteza de medição">
            <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 14 }}>
              <div><label className="field-label">Grandeza</label><input value={formMrc.valorCertificado.grandeza} onChange={(e) => setValorCert("grandeza", e.target.value)} placeholder="Condutividade eletrolítica" /></div>
              <div><label className="field-label">Unidade</label><input value={formMrc.valorCertificado.unidade} onChange={(e) => setValorCert("unidade", e.target.value)} placeholder="mS/cm" /></div>
            </div>
            <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
              <div><label className="field-label">Valor certificado</label><input value={formMrc.valorCertificado.valor} onChange={(e) => setValorCert("valor", e.target.value)} placeholder="1,413" /></div>
              <div><label className="field-label">Incerteza (±)</label><input value={formMrc.valorCertificado.incerteza} onChange={(e) => setValorCert("incerteza", e.target.value)} placeholder="0,01" /></div>
              <div><label className="field-label">Temp. referência (°C)</label><input value={formMrc.valorCertificado.temperaturaRef} onChange={(e) => setValorCert("temperaturaRef", e.target.value)} placeholder="25,0" /></div>
              <div><label className="field-label">Incerteza temp. (±°C)</label><input value={formMrc.valorCertificado.incertezaTemp} onChange={(e) => setValorCert("incertezaTemp", e.target.value)} placeholder="0,5" /></div>
            </div>
          </Section>

          <Section title="Informações adicionais">
            {formMrc.informacoesAdicionais.map((info, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center" }}>
                <input value={info} onChange={(e) => setInfoAdicional(i, e.target.value)} />
                <button onClick={() => removeInfoAdicional(i)} style={{ background: "none", border: "none", flexShrink: 0 }}><Trash2 size={15} color="var(--alert)" /></button>
              </div>
            ))}
            <button className="btn-ghost" style={{ padding: "7px 14px", fontSize: 13 }} onClick={addInfoAdicional}><PlusCircle size={14} /> Adicionar item</button>
          </Section>

          <Section title="Emissão">
            <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div><label className="field-label">Data da certificação</label><input type="date" value={formMrc.dataCertificacao} onChange={(e) => setMrc("dataCertificacao", e.target.value)} /></div>
              <div><label className="field-label">Validade do lote</label><input value={formMrc.validadeLote} onChange={(e) => setMrc("validadeLote", e.target.value)} placeholder="2027-06" /></div>
            </div>
            <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div><label className="field-label">Responsável / signatário</label><input value={formMrc.responsavel} onChange={(e) => setMrc("responsavel", e.target.value)} placeholder={responsavelPadrao || "Eng. Nome Sobrenome"} /></div>
              <div><label className="field-label">Cargo</label><input value={formMrc.cargo} onChange={(e) => setMrc("cargo", e.target.value)} placeholder={cargoPadrao} /></div>
            </div>
          </Section>
        </>
      )}

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

function BrandMark({ config, size = 30, fontSize = 16 }) {
  const nome = config?.empresaNome || "Traço";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      {config?.logoDataUrl ? (
        <img src={config.logoDataUrl} alt="Logo" style={{ height: size + 6, maxWidth: 110, objectFit: "contain" }} />
      ) : (
        <svg width={size} height={size} viewBox="0 0 26 26">
          <circle cx="13" cy="13" r="11.5" fill="none" stroke="var(--ink)" strokeWidth="1.6" />
          <line x1="13" y1="2.2" x2="13" y2="6.2" stroke="var(--orange)" strokeWidth="1.8" />
          <line x1="13" y1="19.8" x2="13" y2="23.8" stroke="var(--ink)" strokeWidth="1.6" />
          <line x1="2.2" y1="13" x2="6.2" y2="13" stroke="var(--ink)" strokeWidth="1.6" />
          <line x1="19.8" y1="13" x2="23.8" y2="13" stroke="var(--ink)" strokeWidth="1.6" />
        </svg>
      )}
      <span className="disp" style={{ fontWeight: 700, fontSize }}>{nome}</span>
    </div>
  );
}

function SignatureBlock({ config, nome, cargo, cargoEn }) {
  return (
    <div style={{ textAlign: "center" }}>
      {config?.assinaturaDataUrl ? (
        <img src={config.assinaturaDataUrl} alt="Assinatura" style={{ height: 46, display: "block", margin: "0 auto 4px" }} />
      ) : (
        <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 20, color: "var(--steel)", borderBottom: "1px solid var(--ink)", paddingBottom: 4, minWidth: 200 }}>
          {nome || "—"}
        </div>
      )}
      <div style={{ fontSize: 10.5, marginTop: 4, fontWeight: 600 }}>{nome || "—"}</div>
      <div style={{ fontSize: 10, fontStyle: "italic", color: "var(--graphite)" }}>{cargo || "Responsável Técnico"}{cargoEn ? ` / ${cargoEn}` : ""}</div>
    </div>
  );
}

// QR Code de verificação — ao ser lido, abre uma página pública (sem login)
// que exibe os dados essenciais do certificado. O próprio QR carrega o
// resumo do certificado embutido, então funciona em qualquer dispositivo,
// mesmo sem um banco de dados compartilhado.
function VerificationQR({ cert, config, size = 92 }) {
  const [dataUrl, setDataUrl] = useState(null);
  const url = buildVerificationUrl(cert, config);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(url, { margin: 1, width: size * 2, color: { dark: "#191F1B", light: "#FFFFFF" } })
      .then((d) => { if (!cancelled) setDataUrl(d); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [url, size]);

  return (
    <div style={{ textAlign: "center" }}>
      {dataUrl ? (
        <img src={dataUrl} alt="QR Code de verificação" style={{ width: size, height: size, display: "block", margin: "0 auto" }} />
      ) : (
        <div style={{ width: size, height: size, border: "1px dashed var(--line)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <QrCode size={20} color="var(--graphite)" />
        </div>
      )}
      <div style={{ fontSize: 8.5, color: "var(--graphite)", marginTop: 4, maxWidth: size + 20 }}>Verifique a autenticidade</div>
    </div>
  );
}


// Marca d'água discreta e repetida — reforça a autenticidade visual do documento,
// como nos certificados de referência (papel de segurança).
function Watermark({ text }) {
  const label = (text || "TRAÇO").toUpperCase();
  const rows = [0, 1, 2, 3, 4, 5];
  return (
    <div className="cert-watermark">
      {rows.map((r) => (
        <div
          key={r}
          style={{
            position: "absolute", left: "-20%", top: `${r * 17 - 4}%`, width: "140%",
            display: "flex", justifyContent: "space-between", whiteSpace: "nowrap",
            transform: "rotate(-27deg)", transformOrigin: "left center",
          }}
        >
          {[0, 1, 2].map((c) => (
            <span
              key={c}
              className="disp"
              style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", opacity: 0.035, letterSpacing: "0.08em" }}
            >
              {label}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

// Rodapé em texto simples com endereço/telefone/e-mail — no padrão dos certificados
// de referência (linha única, centralizada, sem elementos coloridos).
function CertFooter({ config }) {
  const empresaNome = config?.empresaNome || "Traço";
  const parts = [config?.endereco, config?.telefone ? `Tel: ${config.telefone}` : null, config?.email].filter(Boolean);
  return (
    <div className="cert-footer-bar">
      <div style={{ fontWeight: 700, marginBottom: parts.length ? 2 : 0 }}>{empresaNome}</div>
      {parts.length > 0 && <div>{parts.join("  ·  ")}</div>}
    </div>
  );
}


// Página pública de verificação — é o que abre quando alguém lê o QR Code
// do certificado. Não exige login: os dados essenciais vêm embutidos no
// próprio link (payload + checksum), então funciona em qualquer aparelho.
function VerificationPage({ payload }) {
  const result = decodeVerificationPayload(payload);

  const fmtDate = (iso) => {
    if (!iso) return "—";
    if (!iso.includes("-")) return iso;
    const [y, m, d] = iso.split("-");
    return d ? `${d}/${m}/${y}` : iso;
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", background: "var(--paper)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 28 }}>
        <svg width="26" height="26" viewBox="0 0 26 26">
          <circle cx="13" cy="13" r="11.5" fill="none" stroke="var(--ink)" strokeWidth="1.6" />
          <line x1="13" y1="2.2" x2="13" y2="6.2" stroke="var(--orange)" strokeWidth="1.8" />
          <line x1="13" y1="19.8" x2="13" y2="23.8" stroke="var(--ink)" strokeWidth="1.6" />
          <line x1="2.2" y1="13" x2="6.2" y2="13" stroke="var(--ink)" strokeWidth="1.6" />
          <line x1="19.8" y1="13" x2="23.8" y2="13" stroke="var(--ink)" strokeWidth="1.6" />
        </svg>
        <span className="disp" style={{ fontWeight: 700, fontSize: 19 }}>Traço</span>
      </div>

      <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: 8, padding: 32, maxWidth: 460, width: "100%" }}>
        {!result ? (
          <div style={{ textAlign: "center" }}>
            <ShieldCheck size={32} color="var(--alert)" style={{ marginBottom: 14 }} />
            <h2 className="disp" style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Não foi possível ler este código</h2>
            <p style={{ fontSize: 13.5, color: "var(--graphite)" }}>O link de verificação está incompleto ou foi corrompido.</p>
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 22 }}>
              {result.valid ? (
                <>
                  <ShieldCheck size={32} color="var(--seal-green)" style={{ marginBottom: 10 }} />
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--seal-green)" }}>Certificado verificado</div>
                </>
              ) : (
                <>
                  <ShieldCheck size={32} color="var(--alert)" style={{ marginBottom: 10 }} />
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--alert)" }}>Dados não conferem</div>
                  <div style={{ fontSize: 12, color: "var(--graphite)", marginTop: 4 }}>O conteúdo deste link pode ter sido alterado após a emissão.</div>
                </>
              )}
            </div>

            <table style={{ width: "100%", fontSize: 13.5, borderCollapse: "collapse" }}>
              <tbody>
                <tr><td style={{ padding: "6px 0", color: "var(--graphite)", width: 140 }}>Nº do certificado</td><td className="mono" style={{ fontWeight: 700 }}>{result.data.n}</td></tr>
                <tr><td style={{ padding: "6px 0", color: "var(--graphite)" }}>Tipo</td><td><TypeTag tipo={result.data.t} /></td></tr>
                <tr><td style={{ padding: "6px 0", color: "var(--graphite)" }}>Assunto</td><td>{result.data.a}</td></tr>
                <tr><td style={{ padding: "6px 0", color: "var(--graphite)" }}>Data</td><td className="mono">{fmtDate(result.data.d)}</td></tr>
                {result.data.c && <tr><td style={{ padding: "6px 0", color: "var(--graphite)" }}>Código</td><td className="mono">{result.data.c}</td></tr>}
                {result.data.l && <tr><td style={{ padding: "6px 0", color: "var(--graphite)" }}>Lote</td><td className="mono">{result.data.l}</td></tr>}
                <tr><td style={{ padding: "6px 0", color: "var(--graphite)" }}>Responsável</td><td>{result.data.r || "—"}</td></tr>
                <tr><td style={{ padding: "6px 0", color: "var(--graphite)" }}>Emitido por</td><td style={{ fontWeight: 600 }}>{result.data.e}</td></tr>
                <tr><td style={{ padding: "6px 0", color: "var(--graphite)" }}>Status</td><td><StatusPill status={result.data.s} /></td></tr>
              </tbody>
            </table>
          </>
        )}
      </div>

      <p style={{ fontSize: 11.5, color: "var(--graphite)", marginTop: 22, maxWidth: 420, textAlign: "center", lineHeight: 1.6 }}>
        Esta verificação lê os dados que estavam codificados no QR Code no momento da emissão. Ela não substitui uma assinatura digital com certificado ICP-Brasil.
      </p>
    </div>
  );
}


function CertificateView({ cert, setPage, config }) {
  if (!cert) return null;
  const fmtDate = (iso) => {
    if (!iso) return "—";
    const [y, m, d] = iso.split("-");
    return d ? `${d}/${m}/${y}` : iso;
  };
  const empresaNome = config?.empresaNome || "Traço";
  const page1Ref = useRef(null);
  const page2Ref = useRef(null);
  const [baixando, setBaixando] = useState(false);

  const handleBaixarPdf = async () => {
    setBaixando(true);
    try {
      await downloadCertificatePdf([page1Ref.current, page2Ref.current], `${(cert.numero || "certificado").replace(/\//g, "-")}.pdf`);
    } finally {
      setBaixando(false);
    }
  };

  return (
    <div>
      <div className="cert-toolbar no-print" style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <button onClick={() => setPage("certificados")} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500 }}>
          <ArrowLeft size={17} /> Voltar
        </button>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn-ghost" onClick={handleBaixarPdf} disabled={baixando}>
            <Download size={15} /> {baixando ? "Gerando PDF..." : "Baixar PDF"}
          </button>
          <button className="btn-primary" onClick={() => window.print()}><Printer size={15} /> Imprimir</button>
        </div>
      </div>

      {/* ===== PÁGINA 1 — identificação ===== */}
      <div className="cert-doc" ref={page1Ref} style={{ maxWidth: 780, margin: "0 auto 24px", padding: "36px 40px 0 60px" }}>
        <div className="cert-diagonal" />
        <Watermark text={empresaNome} />
        <div className="cert-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 className="cert-title" style={{ fontSize: 30, margin: "0 0 2px" }}>Certificado de Calibração</h2>
            <div style={{ fontSize: 11, fontStyle: "italic", color: "var(--graphite)" }}>Calibration Certificate issued by {empresaNome}</div>
          </div>
          <BrandMark config={config} />
        </div>

        <div style={{ fontSize: 11, textAlign: "center", color: "var(--graphite)", margin: "10px 0 20px", lineHeight: 1.5 }}>
          Laboratório de calibração operando conforme a ABNT NBR ISO/IEC 17025{config?.acreditacaoNumero ? `, sob acreditação Nº ${config.acreditacaoNumero}` : ""}, com emissão rastreada pela plataforma Traço
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

        <div className="cert-signature-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: 20, gap: 16 }}>
          <div style={{ fontSize: 11, color: "var(--graphite)" }}>
            <div>Data da Emissão <i>/ Issued on</i></div>
            <div className="mono" style={{ fontWeight: 600, color: "var(--ink)" }}>{fmtDate(cert.dataCalibracao)}</div>
          </div>
          <SignatureBlock config={config} nome={cert.responsavel} cargo="Responsável Técnico" cargoEn="Technical Manager" />
          <VerificationQR cert={cert} config={config} size={78} />
          <div style={{ textAlign: "right", fontSize: 10, color: "var(--seal-green)" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 600 }}><ShieldCheck size={13} /> Assinado digitalmente</div>
            <div style={{ color: "var(--graphite)", marginTop: 2 }}>{cert.numero}</div>
          </div>
        </div>

        </div>
        <CertFooter config={config} />
      </div>

      {/* ===== PÁGINA 2 — folha de resultado ===== */}
      <div className="cert-doc cert-page-break" ref={page2Ref} style={{ maxWidth: 780, margin: "0 auto", padding: "36px 40px 0 60px" }}>
        <div className="cert-diagonal" />
        <Watermark text={empresaNome} />
        <div className="cert-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <h2 className="cert-title" style={{ fontSize: 22, margin: 0 }}>Certificado de Calibração</h2>
          <BrandMark config={config} size={24} fontSize={15} />
        </div>

        <div className="cert-section-title"><span>Identificação do Certificado</span><span className="en">Certificate Data</span></div>
        <div style={{ marginBottom: 6 }}>
          <FieldRow label="Certificado de Calibração" labelEn="Calibration Certificate" value={cert.numero} />
          <FieldRow label="Ordem de Serviço nº" labelEn="Service Order" value={cert.os} />
          <FieldRow label="Data da Calibração" labelEn="Calibration Date" value={fmtDate(cert.dataCalibracao)} />
          <FieldRow label="Página" labelEn="Page Number" value="02 / 02" />
        </div>

        <div className="cert-section-title"><span>Folha de Resultado</span><span className="en">Results Sheet</span></div>
        <p className="cert-note">V.C. — valor convencionado do padrão (média das leituras + correção do certificado do padrão). V.M.I. — valor médio indicado pelo instrumento em calibração. Erro de Medição = V.M.I. − V.C. Incerteza calculada segundo o GUM (ISO/IEC Guia 98-3), com graus de liberdade efetivos por Welch-Satterthwaite e fator k de Student a 95,45% de confiança.</p>

        {["temperatura", "umidade"].map((g) => {
          const grandeza = cert.resultados?.[g];
          if (!grandeza?.pontos?.length) return null;
          return (
            <div key={g} style={{ margin: "18px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>
                {g === "temperatura" ? <Thermometer size={13} /> : <Droplets size={13} />} {g === "temperatura" ? "Temperatura" : "Umidade"}
              </div>
              <div className="table-scroll">
              <table className="data-table">
                <thead><tr><th>V.C.</th><th>V.M.I.</th><th>Erro</th><th>Incerteza Expandida</th><th>k</th><th>ν<span style={{ fontSize: 8 }}>eff</span></th></tr></thead>
                <tbody>{grandeza.pontos.map((ponto, i) => {
                  const r = computeIncertezaPonto(ponto, grandeza.resolucaoInstrumento, grandeza.resolucaoPadrao);
                  return (
                    <tr key={i}>
                      <td className="mono">{fmtNum(r.valorConvencionado, 2)}</td>
                      <td className="mono">{fmtNum(r.mediaInstrumento, 2)}</td>
                      <td className="mono">{fmtNum(r.erro, 2)}</td>
                      <td className="mono">{fmtNum(r.uexp, 2)}</td>
                      <td className="mono">{r.k.toFixed(2).replace(".", ",")}</td>
                      <td className="mono">{r.k >= 2 && r.veff >= 100 ? "∞" : fmtNum(r.veff, 1)}</td>
                    </tr>
                  );
                })}</tbody>
              </table>
              </div>
            </div>
          );
        })}

        <div style={{ height: 40 }} />
        </div>
        <CertFooter config={config} />
      </div>
    </div>
  );
}

/* ---- MRC — Certificado de Material de Referência (padrão Elus) ---- */

function MRCCertificateView({ cert, setPage, config }) {
  if (!cert) return null;
  const fmtDate = (iso) => {
    if (!iso) return "—";
    const [y, m, d] = iso.split("-");
    return d ? `${d}/${m}/${y}` : iso;
  };
  const fmtMonthYear = (iso) => {
    if (!iso) return "—";
    if (!iso.includes("-")) return iso;
    const [y, m] = iso.split("-");
    const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    const idx = parseInt(m, 10) - 1;
    return meses[idx] ? `${meses[idx]}-${y.slice(-2)}` : iso;
  };
  const empresaNome = config?.empresaNome || "Traço";
  const vc = cert.valorCertificado || {};
  const page1Ref = useRef(null);
  const page2Ref = useRef(null);
  const [baixando, setBaixando] = useState(false);

  const handleBaixarPdf = async () => {
    setBaixando(true);
    try {
      await downloadCertificatePdf([page1Ref.current, page2Ref.current], `${(cert.numero || "certificado").replace(/\//g, "-")}.pdf`);
    } finally {
      setBaixando(false);
    }
  };

  const MrcSection = ({ title, children }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{title}</div>
      <p style={{ fontSize: 12.5, lineHeight: 1.6, color: "var(--ink)", margin: 0 }}>{children}</p>
    </div>
  );

  return (
    <div>
      <div className="cert-toolbar no-print" style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <button onClick={() => setPage("certificados")} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500 }}>
          <ArrowLeft size={17} /> Voltar
        </button>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn-ghost" onClick={handleBaixarPdf} disabled={baixando}>
            <Download size={15} /> {baixando ? "Gerando PDF..." : "Baixar PDF"}
          </button>
          <button className="btn-primary" onClick={() => window.print()}><Printer size={15} /> Imprimir</button>
        </div>
      </div>

      {/* ===== PÁGINA 1 ===== */}
      <div className="cert-doc" ref={page1Ref} style={{ maxWidth: 780, margin: "0 auto 24px", padding: "34px 40px" }}>
        <Watermark text={empresaNome} />
        <div className="cert-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid var(--steel)", paddingBottom: 16, marginBottom: 18 }}>
          <BrandMark config={config} size={44} fontSize={17} />
          <div style={{ textAlign: "right" }}>
            <h2 className="cert-title" style={{ fontSize: 22, margin: "0 0 2px" }}>Certificado de Material de Referência</h2>
            <div style={{ fontSize: 10.5, fontStyle: "italic", color: "var(--graphite)" }}>Certified Reference Material Certificate</div>
            {config?.acreditacaoNumero && (
              <div style={{ fontSize: 10, color: "var(--steel)", fontWeight: 600, marginTop: 4 }}>
                Número de Acreditação {config.acreditacaoNumero}{config.acreditacaoData ? ` · Data de Acreditação ${fmtDate(config.acreditacaoData)}` : ""}
              </div>
            )}
          </div>
        </div>

        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>MRC: {cert.mrcNome || "—"}</div>
        <div className="mono" style={{ fontSize: 11.5, color: "var(--graphite)", marginBottom: 22 }}>
          Código: {cert.codigo || "—"} &nbsp;&nbsp; Lote: {cert.lote || "—"} &nbsp;&nbsp; Nº Certificado: {cert.numero} &nbsp;&nbsp; Folha 01/02
        </div>

        <MrcSection title="Descrição do MRC">{cert.descricao || "—"}</MrcSection>
        <MrcSection title="Preparação do MRC">{cert.preparacao || "—"}</MrcSection>
        <MrcSection title="Metodologia Analítica">{cert.metodologia || "—"}</MrcSection>
        <MrcSection title="Rastreabilidade">{cert.rastreabilidade || "—"}</MrcSection>
        <MrcSection title="Finalidade de uso">{cert.finalidade || "—"}</MrcSection>
        <MrcSection title="Armazenamento e Manipulação">{cert.armazenamento || "—"}</MrcSection>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Valor Certificado e Incerteza de Medição</div>
          <p style={{ fontSize: 12.5, lineHeight: 1.6, margin: "0 0 12px" }}>
            O valor declarado, com sua respectiva incerteza expandida, é baseado na incerteza combinada dos estudos de homogeneidade, estabilidade e caracterização, para um nível de confiança de aproximadamente 95% (k = 2).
          </p>
          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 4, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontWeight: 600, fontSize: 13.5 }}>{vc.grandeza || "—"}</span>
            <span className="mono" style={{ fontSize: 14.5, fontWeight: 700, color: "var(--steel)" }}>
              {vc.valor || "—"} {vc.unidade} ± {vc.incerteza} {vc.unidade} @ {vc.temperaturaRef}°C ± {vc.incertezaTemp}°C
            </span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
          <table style={{ fontSize: 12, marginBottom: 8 }}>
            <tbody>
              <tr><td style={{ padding: "3px 10px 3px 0", color: "var(--graphite)" }}>A certificação foi realizada no dia:</td><td className="mono" style={{ fontWeight: 600 }}>{fmtDate(cert.dataCertificacao)}</td></tr>
              <tr><td style={{ padding: "3px 10px 3px 0", color: "var(--graphite)" }}>O lote referente a este certificado tem validade até:</td><td className="mono" style={{ fontWeight: 600 }}>{fmtMonthYear(cert.validadeLote)}</td></tr>
            </tbody>
          </table>
          <VerificationQR cert={cert} config={config} size={72} />
        </div>

        </div>
        <CertFooter config={config} />
      </div>

      {/* ===== PÁGINA 2 ===== */}
      <div className="cert-doc cert-page-break" ref={page2Ref} style={{ maxWidth: 780, margin: "0 auto", padding: "34px 40px" }}>
        <Watermark text={empresaNome} />
        <div className="cert-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid var(--steel)", paddingBottom: 16, marginBottom: 18 }}>
          <BrandMark config={config} size={34} fontSize={15} />
          <div style={{ textAlign: "right" }}>
            <h2 className="cert-title" style={{ fontSize: 18, margin: 0 }}>Certificado de Material de Referência</h2>
          </div>
        </div>

        <div className="mono" style={{ fontSize: 11.5, color: "var(--graphite)", marginBottom: 20 }}>
          MRC: {cert.mrcNome} &nbsp;&nbsp; Nº Certificado: {cert.numero} &nbsp;&nbsp; Folha 02/02
        </div>

        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Informações Adicionais</div>
        <ul style={{ margin: "0 0 26px", padding: "0 0 0 18px", fontSize: 12, lineHeight: 1.7 }}>
          {(cert.informacoesAdicionais || []).map((info, i) => (
            <li key={i}>{info}</li>
          ))}
        </ul>

        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 14 }}>Responsável Técnico</div>
        <SignatureBlock config={config} nome={cert.responsavel} cargo={cert.cargo || "Signatário Autorizado"} />

        <div style={{ height: 30 }} />
        </div>
        <CertFooter config={config} />
      </div>
    </div>
  );
}

function SettingsPage({ config, onSave }) {
  const [form, setForm] = useState(config);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => { setForm(config); }, [config]);

  const set = (field, v) => setForm((s) => ({ ...s, [field]: v }));
  const handleLogo = (e) => {
    const f = e.target.files[0];
    if (f) fileToDataUrl(f, (dataUrl) => set("logoDataUrl", dataUrl));
  };
  const handleAssinatura = (e) => {
    const f = e.target.files[0];
    if (f) fileToDataUrl(f, (dataUrl) => set("assinaturaDataUrl", dataUrl));
  };
  const save = () => {
    onSave(form);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2200);
  };

  return (
    <div style={{ maxWidth: 680 }}>
      <h1 className="disp" style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Configurações</h1>
      <p style={{ color: "var(--graphite)", fontSize: 14.5, marginBottom: 22 }}>
        Esses dados são aplicados automaticamente em todos os certificados emitidos — logo, endereço, acreditação e assinatura do responsável técnico.
      </p>

      <Section title="Identidade do laboratório">
        <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 14 }}>
          <div><label className="field-label">Razão social</label><input value={form.empresaNome} onChange={(e) => set("empresaNome", e.target.value)} placeholder="Ex: Traço Laboratório de Calibração Ltda" /></div>
          <div><label className="field-label">Nº de acreditação</label><input value={form.acreditacaoNumero} onChange={(e) => set("acreditacaoNumero", e.target.value)} placeholder="PMR-003" /></div>
        </div>
        <label className="field-label">Endereço</label>
        <input value={form.endereco} onChange={(e) => set("endereco", e.target.value)} placeholder="Rua, número - bairro - cidade - UF - CEP" style={{ marginBottom: 14 }} />
        <div style={{ maxWidth: 240 }}>
          <label className="field-label">Data de acreditação</label>
          <input type="date" value={form.acreditacaoData} onChange={(e) => set("acreditacaoData", e.target.value)} />
        </div>
      </Section>

      <Section title="Logo da empresa">
        <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <div style={{ width: 96, height: 96, border: "1.5px dashed var(--line)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--paper)", overflow: "hidden", flexShrink: 0 }}>
            {form.logoDataUrl ? <img src={form.logoDataUrl} alt="Logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} /> : <ImageIcon size={26} color="var(--graphite)" />}
          </div>
          <div>
            <label className="btn-ghost" style={{ display: "inline-flex" }}>
              <Upload size={15} /> Enviar logo
              <input type="file" accept="image/*" onChange={handleLogo} style={{ display: "none" }} />
            </label>
            {form.logoDataUrl && (
              <button className="btn-ghost" style={{ marginLeft: 10 }} onClick={() => set("logoDataUrl", null)}>Remover</button>
            )}
            <p style={{ fontSize: 12, color: "var(--graphite)", marginTop: 8, maxWidth: 320 }}>Aparece no cabeçalho de todos os certificados. Se não enviar uma logo, o símbolo padrão do Traço é usado.</p>
          </div>
        </div>
      </Section>

      <Section title="Responsável técnico">
        <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
          <div><label className="field-label">Nome</label><input value={form.responsavelNome} onChange={(e) => set("responsavelNome", e.target.value)} placeholder="Eng. Nome Sobrenome" /></div>
          <div><label className="field-label">Cargo</label><input value={form.responsavelCargo} onChange={(e) => set("responsavelCargo", e.target.value)} placeholder="Responsável Técnico" /></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <div style={{ width: 140, height: 70, border: "1.5px dashed var(--line)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--paper)", overflow: "hidden", flexShrink: 0 }}>
            {form.assinaturaDataUrl ? <img src={form.assinaturaDataUrl} alt="Assinatura" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} /> : <PenTool size={22} color="var(--graphite)" />}
          </div>
          <div>
            <label className="btn-ghost" style={{ display: "inline-flex" }}>
              <Upload size={15} /> Enviar assinatura
              <input type="file" accept="image/*" onChange={handleAssinatura} style={{ display: "none" }} />
            </label>
            {form.assinaturaDataUrl && (
              <button className="btn-ghost" style={{ marginLeft: 10 }} onClick={() => set("assinaturaDataUrl", null)}>Remover</button>
            )}
            <p style={{ fontSize: 12, color: "var(--graphite)", marginTop: 8, maxWidth: 320 }}>Se não enviar uma imagem de assinatura, o nome digitado aparece em estilo manuscrito nos certificados.</p>
          </div>
        </div>
      </Section>

      <div className="action-row" style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button className="btn-primary" onClick={save}><Check size={16} /> Salvar configurações</button>
        {savedFlash && <span style={{ fontSize: 13, color: "var(--seal-green)", fontWeight: 600 }}>Configurações salvas.</span>}
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
  const [config, setConfig] = useState(defaultConfig());

  useEffect(() => {
    loadCertificados().then((list) => { setCertificados(list); setLoaded(true); });
    loadConfig().then(setConfig);
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

  const handleSaveConfig = useCallback((cfg) => {
    setConfig(cfg);
    saveConfig(cfg);
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
            <NewCertificate certificados={certificados} onSave={handleSave} setPage={setPage} config={config} />
          ) : page === "ver" ? (
            activeCert?.tipo === "mrc"
              ? <MRCCertificateView cert={activeCert} setPage={setPage} config={config} />
              : <CertificateView cert={activeCert} setPage={setPage} config={config} />
          ) : page === "clientes" ? (
            <Placeholder title="Clientes" />
          ) : page === "usuarios" ? (
            <Placeholder title="Usuários e permissões" />
          ) : (
            <SettingsPage config={config} onSave={handleSaveConfig} />
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
  const [verifyPayload, setVerifyPayload] = useState(undefined);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      setVerifyPayload(params.get("v"));
    } catch {
      setVerifyPayload(null);
    }
  }, []);

  if (verifyPayload === undefined) return null;

  if (verifyPayload) {
    return (
      <div className="traco-root">
        <GlobalStyle />
        <VerificationPage payload={verifyPayload} />
      </div>
    );
  }

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
