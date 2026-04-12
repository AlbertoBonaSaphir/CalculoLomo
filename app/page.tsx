"use client";

import { useState } from "react";
import {
  calculateSpine,
  type SpineInput,
  type SpineResult,
  type PaperType,
} from "../lib/spine-calculator";

const PAPER_TYPE_LABELS: Record<PaperType, string> = {
  O: "Offset",
  B: "Brillo",
  M: "Mate",
};

const DEFAULT_INPUT: SpineInput = {
  width: 21,
  height: 29.7,
  pages: 128,
  coverWeight: 300,
  paperType: "M",
  paperWeight: 135,
  cardboardThickness: 2.5,
  endpaperWeight: 140,
};

export default function HomePage() {
  const [input, setInput] = useState<SpineInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<SpineResult | null>(null);

  function handleChange(field: keyof SpineInput, value: string) {
    if (field === "paperType") {
      setInput((prev) => ({ ...prev, paperType: value as PaperType }));
    } else {
      setInput((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
    }
  }

  function handleCalculate() {
    const res = calculateSpine(input);
    setResult(res);
  }

  const fmt = (v: number, decimals = 2) => v.toFixed(decimals);

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold text-[#e2001a] tracking-tight">
          Cálculo de Lomo
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Datos en milímetros — Encuadernación profesional
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#e2001a] mb-5">
            Datos del libro
          </h2>

          {/* Tamaño */}
          <fieldset className="mb-5">
            <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Tamaño (cm)
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">Ancho</span>
                <input
                  type="number"
                  step="0.1"
                  value={input.width || ""}
                  onChange={(e) => handleChange("width", e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e2001a]/30 focus:border-[#e2001a]"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">Alto</span>
                <input
                  type="number"
                  step="0.1"
                  value={input.height || ""}
                  onChange={(e) => handleChange("height", e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e2001a]/30 focus:border-[#e2001a]"
                />
              </label>
            </div>
          </fieldset>

          {/* Páginas y gramaje cubierta */}
          <fieldset className="mb-5">
            <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Interior
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">Páginas</span>
                <input
                  type="number"
                  step="1"
                  value={input.pages || ""}
                  onChange={(e) => handleChange("pages", e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e2001a]/30 focus:border-[#e2001a]"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">Gramaje cubierta (g)</span>
                <input
                  type="number"
                  step="1"
                  value={input.coverWeight || ""}
                  onChange={(e) => handleChange("coverWeight", e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e2001a]/30 focus:border-[#e2001a]"
                />
              </label>
            </div>
          </fieldset>

          {/* Papel interior */}
          <fieldset className="mb-5">
            <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Papel interior
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">Tipo</span>
                <div className="flex gap-1">
                  {(["O", "B", "M"] as PaperType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleChange("paperType", t)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                        input.paperType === t
                          ? "bg-[#e2001a] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {PAPER_TYPE_LABELS[t]}
                    </button>
                  ))}
                </div>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">Gramaje (g)</span>
                <input
                  type="number"
                  step="1"
                  value={input.paperWeight || ""}
                  onChange={(e) => handleChange("paperWeight", e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e2001a]/30 focus:border-[#e2001a]"
                />
              </label>
            </div>
          </fieldset>

          {/* Tapa dura */}
          <fieldset className="mb-6">
            <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Tapa dura
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">Cartón (mm)</span>
                <input
                  type="number"
                  step="0.25"
                  value={input.cardboardThickness || ""}
                  onChange={(e) => handleChange("cardboardThickness", e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e2001a]/30 focus:border-[#e2001a]"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">Guardas (g)</span>
                <input
                  type="number"
                  step="1"
                  value={input.endpaperWeight || ""}
                  onChange={(e) => handleChange("endpaperWeight", e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e2001a]/30 focus:border-[#e2001a]"
                />
              </label>
            </div>
          </fieldset>

          <button
            onClick={handleCalculate}
            className="w-full bg-[#e2001a] hover:bg-[#c50017] text-white font-bold py-3 rounded-lg transition-colors text-sm tracking-wide"
          >
            Calcular
          </button>
        </div>

        {/* Results panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#e2001a] mb-5">
            Resultados
          </h2>

          {!result ? (
            <div className="flex items-center justify-center h-48 text-gray-300 text-sm">
              Pulsa &quot;Calcular&quot; para ver los resultados
            </div>
          ) : (
            <div className="space-y-6">
              {/* Spine results */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Lomo (mm)
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <ResultCard label="Fresado / PUR" value={result.fresado} raw={result.rawFresado} />
                  <ResultCard label="Rústica Cosida" value={result.rusticaCosida} raw={result.rawRusticaCosida} />
                  <ResultCard label="Tapa Dura" value={result.tapaDura} raw={result.rawTapaDura} />
                </div>
              </div>

              {/* Weight: Rústica */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Peso por ejemplar — Rústica (g)
                </h3>
                <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
                  <Row label="Interiores" value={fmt(result.weightRustica.interior)} />
                  <Row label="Cubierta plastificada" value={fmt(result.weightRustica.cover)} />
                  <TotalRow value={fmt(result.weightRustica.total)} />
                </div>
              </div>

              {/* Weight: Tapa dura */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Peso por ejemplar — Tapa Dura (g)
                </h3>
                <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
                  <Row label="Interiores" value={fmt(result.weightTapaDura.interior)} />
                  <Row label="Forro cubierta" value={fmt(result.weightTapaDura.coverLining)} />
                  <Row label="Cartón bigrís" value={fmt(result.weightTapaDura.cardboard)} />
                  <Row label="Guardas" value={fmt(result.weightTapaDura.endpapers)} />
                  <TotalRow value={fmt(result.weightTapaDura.total)} />
                </div>
              </div>

              {/* Hardcover development */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Desarrollo forro Tapa Dura (mm)
                </h3>
                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Ancho total</span>
                    <span className="font-extrabold text-[#e2001a]">{fmt(result.hardcoverDevelopment.width, 1)}</span>
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-500">Alto total</span>
                    <span className="font-extrabold text-[#e2001a]">{fmt(result.hardcoverDevelopment.height, 1)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-center overflow-x-auto pb-1">
                    <DevBlock label="Pestaña" value={result.hardcoverDevelopment.flap} />
                    <DevBlock label="Contracub." value={result.hardcoverDevelopment.backCover} />
                    <DevBlock label="Franq." value={result.hardcoverDevelopment.hinge} />
                    <DevBlock label="Lomo" value={result.hardcoverDevelopment.spine} accent />
                    <DevBlock label="Franq." value={result.hardcoverDevelopment.hinge} />
                    <DevBlock label="Cubierta" value={result.hardcoverDevelopment.frontCover} />
                    <DevBlock label="Pestaña" value={result.hardcoverDevelopment.flap} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-300 mt-8">Saphir — Cálculo de Lomo v1.0</p>
    </main>
  );
}

function ResultCard({ label, value, raw }: { label: string; value: number; raw: number }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center">
      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-xl font-extrabold text-[#e2001a]">{value}</p>
      <p className="text-[10px] text-gray-300 mt-1">({raw.toFixed(2)} mm)</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function TotalRow({ value }: { value: string }) {
  return (
    <div className="flex justify-between border-t border-gray-200 pt-1 mt-1">
      <span className="font-bold text-[#1a1a2e]">Total</span>
      <span className="font-extrabold text-[#e2001a]">{value}</span>
    </div>
  );
}

function DevBlock({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`flex-shrink-0 rounded px-2 py-1 ${accent ? "bg-[#e2001a]/10 border border-[#e2001a]/30" : "bg-white border border-gray-200"}`}>
      <p className="text-[9px] text-gray-400">{label}</p>
      <p className={`text-xs font-bold ${accent ? "text-[#e2001a]" : "text-gray-700"}`}>{value}</p>
    </div>
  );
}
