"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  calculateSpine,
  type SpineInput,
  type SpineResult,
  type PaperType,
} from "../lib/spine-calculator";
import logo from "../public/logo.jpg";

const PAPER_TYPES: { value: PaperType; label: string }[] = [
  { value: "O", label: "Offset" },
  { value: "B", label: "Brillo" },
  { value: "M", label: "Mate" },
];

const DEFAULT_INPUT: SpineInput = {
  width: 0,
  height: 0,
  pages: 0,
  coverWeight: 0,
  paperType: "O",
  paperWeight: 0,
  cardboardThickness: 0,
  endpaperWeight: 0,
};

type BindingType = "blanda" | "dura";

export default function HomePage() {
  const [input, setInput] = useState<SpineInput>(DEFAULT_INPUT);
  const [binding, setBinding] = useState<BindingType>("blanda");
  const [openSection, setOpenSection] = useState<string | null>(null);

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
          <Image src={logo} alt="Logo" className="w-9 h-9 rounded-full" />
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
            <Field label="Ancho (cm)" value={input.width} step={0.1} onChange={(v) => set("width", v)} />
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
              <Field label="Gramaje forro (g)" value={input.coverWeight} step={10} onChange={(v) => set("coverWeight", v)} />
              <Field label="Cartón (mm)" value={input.cardboardThickness} step={0.25} onChange={(v) => set("cardboardThickness", v)} />
              <Field label="Guardas (g)" value={input.endpaperWeight} step={10} onChange={(v) => set("endpaperWeight", v)} />
            </div>
          )}
        </section>

        {/* === DETAILS (collapsible) === */}
        {result && (
          <div className="space-y-2">
            {binding === "blanda" ? (
              <Accordion
                title="Peso por ejemplar"
                right={`${fmt(result.weightRustica.total)} g`}
                open={openSection === "peso"}
                onToggle={() => setOpenSection(openSection === "peso" ? null : "peso")}
              >
                <DetailRow label="Interiores" value={`${fmt(result.weightRustica.interior)} g`} />
                <DetailRow label="Cubierta plastificada" value={`${fmt(result.weightRustica.cover)} g`} />
              </Accordion>
            ) : (
              <>
                <Accordion
                  title="Peso por ejemplar"
                  right={`${fmt(result.weightTapaDura.total)} g`}
                  open={openSection === "peso"}
                  onToggle={() => setOpenSection(openSection === "peso" ? null : "peso")}
                >
                  <DetailRow label="Interiores" value={`${fmt(result.weightTapaDura.interior)} g`} />
                  <DetailRow label="Forro cubierta" value={`${fmt(result.weightTapaDura.coverLining)} g`} />
                  <DetailRow label="Cartón bigrís" value={`${fmt(result.weightTapaDura.cardboard)} g`} />
                  <DetailRow label="Guardas" value={`${fmt(result.weightTapaDura.endpapers)} g`} />
                </Accordion>

                <Accordion
                  title="Desarrollo forro"
                  right={`${fmt(result.hardcoverDevelopment.width)} × ${fmt(result.hardcoverDevelopment.height)} mm`}
                  open={openSection === "forro"}
                  onToggle={() => setOpenSection(openSection === "forro" ? null : "forro")}
                >
                  <div className="flex items-center gap-0.5 text-[10px] text-center overflow-x-auto py-2">
                    <Block label="Pest." value={result.hardcoverDevelopment.flap} />
                    <Block label="Contrac." value={result.hardcoverDevelopment.backCover} />
                    <Block label="Franq." value={result.hardcoverDevelopment.hinge} />
                    <Block label="Lomo" value={result.hardcoverDevelopment.spine} accent />
                    <Block label="Franq." value={result.hardcoverDevelopment.hinge} />
                    <Block label="Cubier." value={result.hardcoverDevelopment.frontCover} />
                    <Block label="Pest." value={result.hardcoverDevelopment.flap} />
                  </div>
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

function Field({ label, value, step, onChange }: { label: string; value: number; step: number; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{label}</span>
      <input
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

function Block({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`flex-shrink-0 rounded-md px-2 py-1.5 ${accent ? "bg-[#1d3557]/8 ring-1 ring-[#1d3557]/20" : "bg-gray-50"}`}>
      <p className="text-gray-400 leading-none mb-0.5">{label}</p>
      <p className={`text-xs font-bold leading-none ${accent ? "text-[#1d3557]" : "text-[#1a1a2e]"}`}>{value}</p>
    </div>
  );
}
