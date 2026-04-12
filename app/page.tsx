"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  calculateSpine,
  type SpineInput,
  type SpineResult,
  type PaperType,
} from "../lib/spine-calculator";

const PAPER_TYPES: { value: PaperType; label: string }[] = [
  { value: "O", label: "Offset" },
  { value: "B", label: "Brillo" },
  { value: "M", label: "Mate" },
];

const DEFAULT_INPUT: SpineInput = {
  width: 0,
  height: 0,
  pages: 0,
  coverWeight: 300,
  paperType: "O",
  paperWeight: 0,
  cardboardThickness: 2.5,
  endpaperWeight: 140,
};

type BindingType = "blanda" | "dura";

export default function HomePage() {
  const [input, setInput] = useState<SpineInput>(DEFAULT_INPUT);
  const [binding, setBinding] = useState<BindingType>("blanda");
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["peso", "desarrollo"]));
  const widthRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    widthRef.current?.focus();
  }, []);

  // Real-time calculation
  const result: SpineResult | null = useMemo(() => {
    if (!input.pages || !input.paperWeight) return null;
    return calculateSpine(input);
  }, [input]);

  function set(field: keyof SpineInput, value: string) {
    if (field === "paperType") {
      setInput((prev) => ({ ...prev, paperType: value as PaperType }));
    } else {
      setInput((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
    }
  }

  function toggleSection(key: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function clearAll() {
    setInput(DEFAULT_INPUT);
    setOpenSections(new Set(["peso", "desarrollo"]));
    widthRef.current?.focus();
  }

  const fmt = (v: number, d = 1) => v.toFixed(d);

  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-gray-100">
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-extrabold text-[#1a1a2e] tracking-tight">Cálculo de Lomo</h1>
            <p className="text-[11px] text-gray-400">Encuadernación profesional</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearAll}
              className="h-8 px-3 rounded-lg bg-gray-100 text-xs font-semibold text-gray-500 hover:bg-gray-200 transition-colors"
            >
              Limpiar
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/CalculoLomo/logo.jpg" alt="Logo" className="w-9 h-9 rounded-full" />
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-5">

        {/* === RESULTS (hero) === */}
        {result && (
          binding === "blanda" ? (
            <div className="grid grid-cols-2 gap-3">
              <SpineCard label="Fresado / PUR" value={result.fresado} raw={result.rawFresado} />
              <SpineCard label="Rústica Cosida" value={result.rusticaCosida} raw={result.rawRusticaCosida} />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              <SpineCard label="Tapa Dura" value={result.tapaDura} raw={result.rawTapaDura} />
            </div>
          )
        )}

        {/* === INPUTS === */}
        <section className="bg-white rounded-2xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">

          {/* Tipo de tapa */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Tipo de encuadernación</span>
            <div className="flex gap-1 h-[38px]">
              {([["blanda", "Tapa Blanda"], ["dura", "Tapa Dura"]] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setBinding(val)}
                  className={`flex-1 rounded-lg text-xs font-semibold transition-all ${
                    binding === val
                      ? "bg-[#1d3557] text-white shadow-sm"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tamaño + Páginas */}
          <div className="grid grid-cols-3 gap-3">
            <Field label="Ancho (cm)" value={input.width} step={0.1} onChange={(v) => set("width", v)} inputRef={widthRef} />
            <Field label="Alto (cm)" value={input.height} step={0.1} onChange={(v) => set("height", v)} />
            <Field label="Páginas" value={input.pages} step={1} onChange={(v) => set("pages", v)} />
          </div>

          {/* Papel interior */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Papel</span>
              <div className="flex gap-1 h-[38px]">
                {PAPER_TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => set("paperType", t.value)}
                    className={`flex-1 rounded-lg text-xs font-semibold transition-all ${
                      input.paperType === t.value
                        ? "bg-[#1d3557] text-white shadow-sm"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <Field label="Gramaje interior (g)" value={input.paperWeight} step={5} onChange={(v) => set("paperWeight", v)} />
          </div>

          {/* Cubierta */}
          {binding === "blanda" ? (
            <div className="grid grid-cols-1 gap-3">
              <Field label="Gramaje cubierta (g)" value={input.coverWeight} step={10} onChange={(v) => set("coverWeight", v)} />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <Field label="Gramaje cubierta (g)" value={input.coverWeight} step={10} onChange={(v) => set("coverWeight", v)} />
              <Field label="Cartón (mm)" value={input.cardboardThickness} step={0.25} onChange={(v) => set("cardboardThickness", v)} />
              <Field label="Guardas (g)" value={input.endpaperWeight} step={10} onChange={(v) => set("endpaperWeight", v)} />
            </div>
          )}
        </section>

        {/* === DETAILS === */}
        {result && (
          <div className="space-y-2">
            {binding === "blanda" ? (
              <Accordion
                title="Peso por ejemplar"
                right={`${fmt(result.weightRustica.total)} g`}
                open={openSections.has("peso")}
                onToggle={() => toggleSection("peso")}
              >
                <DetailRow label="Interiores" value={`${fmt(result.weightRustica.interior)} g`} />
                <DetailRow label="Cubierta plastificada" value={`${fmt(result.weightRustica.cover)} g`} />
              </Accordion>
            ) : (
              <>
                <Accordion
                  title="Peso por ejemplar"
                  right={`${fmt(result.weightTapaDura.total)} g`}
                  open={openSections.has("peso")}
                  onToggle={() => toggleSection("peso")}
                >
                  <DetailRow label="Interiores" value={`${fmt(result.weightTapaDura.interior)} g`} />
                  <DetailRow label="Forro cubierta" value={`${fmt(result.weightTapaDura.coverLining)} g`} />
                  <DetailRow label="Cartón bigrís" value={`${fmt(result.weightTapaDura.cardboard)} g`} />
                  <DetailRow label="Guardas" value={`${fmt(result.weightTapaDura.endpapers)} g`} />
                </Accordion>

                <Accordion
                  title="Desarrollo"
                  right={`${fmt(result.hardcoverDevelopment.width)} × ${fmt(result.hardcoverDevelopment.height)} mm`}
                  open={openSections.has("desarrollo")}
                  onToggle={() => toggleSection("desarrollo")}
                >
                  <DevelopmentDiagram dev={result.hardcoverDevelopment} />
                </Accordion>
              </>
            )}
          </div>
        )}

      </div>
    </main>
  );
}

/* --- Components --- */

function Field({ label, value, step, onChange, inputRef }: { label: string; value: number; step: number; onChange: (v: string) => void; inputRef?: React.Ref<HTMLInputElement> }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{label}</span>
      <input
        ref={inputRef}
        type="number"
        step={step}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="h-[38px] bg-gray-50 border-0 rounded-lg px-3 text-sm font-medium text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 transition-shadow"
      />
    </label>
  );
}

function SpineCard({ label, value, raw }: { label: string; value: number; raw: number }) {
  return (
    <div className="bg-white rounded-2xl p-4 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <p className="text-3xl font-extrabold text-[#1a1a2e] leading-none">{value}</p>
      <p className="text-[10px] text-gray-300 mt-1 font-mono">{raw.toFixed(2)}</p>
      <p className="text-[10px] font-semibold text-gray-400 mt-2 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function Accordion({ title, right, open, onToggle, children }: { title: string; right: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-3.5 text-left">
        <span className="text-sm font-semibold text-[#1a1a2e]">{title}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#1d3557]">{right}</span>
          <svg className={`w-4 h-4 text-gray-300 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {open && <div className="px-5 pb-4 space-y-1.5">{children}</div>}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium text-gray-600">{value}</span>
    </div>
  );
}

function DevelopmentDiagram({ dev }: { dev: SpineResult["hardcoverDevelopment"] }) {
  const sections = [
    { label: "Pest.", value: dev.flap, accent: false, grow: 0 },
    { label: "Contracub.", value: dev.backCover, accent: false, grow: 1 },
    { label: "Franq.", value: dev.hinge, accent: false, grow: 0 },
    { label: "Lomo", value: dev.spine, accent: true, grow: 0 },
    { label: "Franq.", value: dev.hinge, accent: false, grow: 0 },
    { label: "Cubierta", value: dev.frontCover, accent: false, grow: 1 },
    { label: "Pest.", value: dev.flap, accent: false, grow: 0 },
  ];
  const cardboardH = dev.height - dev.flap * 2;

  return (
    <div className="py-2 space-y-4">
      {/* Horizontal bar diagram */}
      <div className="flex h-16 rounded-lg overflow-hidden border-2 border-[#1d3557]/25">
        {sections.map((s, i) => (
          <div
            key={i}
            className={`flex flex-col items-center justify-center px-1 ${
              s.accent
                ? "bg-[#1d3557] text-white"
                : i === 0 || i === sections.length - 1
                  ? "bg-[#1d3557]/5"
                  : "bg-white"
            } ${i < sections.length - 1 ? "border-r border-[#1d3557]/15" : ""}`}
            style={{ flexGrow: s.grow, flexBasis: s.grow ? 0 : "auto", minWidth: "40px" }}
          >
            <span className={`text-[10px] font-medium leading-tight ${
              s.accent ? "text-white/80" : "text-gray-400"
            }`}>
              {s.label}
            </span>
            <span className={`text-sm font-bold leading-tight ${
              s.accent ? "text-white" : "text-[#1a1a2e]"
            }`}>
              {s.value}
            </span>
          </div>
        ))}
      </div>

      {/* Height breakdown */}
      <div className="flex items-center gap-3 justify-center">
        <div className="flex items-center h-10 rounded-lg overflow-hidden border border-[#1d3557]/15 text-[11px]">
          <div className="h-full flex flex-col items-center justify-center px-3 bg-[#1d3557]/5">
            <span className="text-gray-400 text-[9px]">Pest.</span>
            <span className="font-bold text-[#1a1a2e]">{dev.flap}</span>
          </div>
          <div className="h-full flex flex-col items-center justify-center px-5 border-x border-[#1d3557]/15">
            <span className="text-gray-400 text-[9px]">Alto cartón</span>
            <span className="font-bold text-[#1a1a2e]">{cardboardH}</span>
          </div>
          <div className="h-full flex flex-col items-center justify-center px-3 bg-[#1d3557]/5">
            <span className="text-gray-400 text-[9px]">Pest.</span>
            <span className="font-bold text-[#1a1a2e]">{dev.flap}</span>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="text-center">
        <span className="inline-block bg-[#1d3557]/8 rounded-lg px-4 py-1.5 text-xs font-mono font-bold text-[#1d3557]">
          Total: {dev.width} × {dev.height} mm
        </span>
      </div>
    </div>
  );
}
