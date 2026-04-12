# PROJECT_CONTEXT.md

## Qué es este proyecto

Calculadora de lomo para encuadernación, replicando la lógica del Excel "CALCULO DE LOMOv2.xlsx" en una aplicación web.

## Decisiones técnicas

| Decisión | Motivo |
|----------|--------|
| **Next.js + TypeScript** | Stack más simple sobre Node.js para una app web sin backend. El usuario ya conoce Next.js de otro proyecto. |
| **Sin base de datos** | No se necesita persistencia — todo el cálculo es en el navegador. |
| **Sin API routes** | La lógica de cálculo se ejecuta en el cliente (instantáneo). |
| **Lógica separada en `lib/`** | CLAUDE.md requiere separar lógica de negocio de la UI. |
| **Tailwind CSS** | Incluido por defecto en Next.js, rápido para estilar. |

## Estructura de carpetas

```
lib/                → Lógica de negocio (cálculos)
  spine-calculator.ts  → Motor de cálculo de lomo y peso
app/                → Páginas de la aplicación
  page.tsx             → Página principal (calculadora)
  layout.tsx           → Layout global
  globals.css          → Estilos globales
```

## Historial de sesiones

### 2026-04-12 — Sesión 1: Creación inicial
- Proyecto creado desde cero con Next.js + TypeScript + Tailwind
- Lógica del Excel extraída y replicada en `lib/spine-calculator.ts`
- UI de calculadora completa con inputs y resultados
- Conectado al repo GitHub: AlbertoBonaSaphir/Calculo-Lomo
