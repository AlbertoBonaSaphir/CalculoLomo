# Cálculo de Lomo

Calculadora web de lomo para encuadernación profesional. Calcula el grosor del lomo para tres tipos de encuadernación: **Fresado/PUR**, **Rústica Cosida** y **Tapa Dura**, además del peso por ejemplar y el desarrollo del forro.

## Qué hace

Introduces los datos del libro (tamaño, páginas, tipo de papel, gramaje...) y la app calcula automáticamente:

- **Lomo** en mm para cada tipo de encuadernación
- **Peso por ejemplar** en gramos (rústica y tapa dura)
- **Desarrollo del forro** para tapa dura (desglose de medidas)

## Cómo instalar

1. Necesitas tener **Node.js** instalado (v18 o superior)
2. Abre una terminal en la carpeta del proyecto
3. Ejecuta:

```bash
npm install
```

## Cómo usar

Arranca el servidor de desarrollo:

```bash
npm run dev
```

Esto levanta un servidor local. Abre **http://localhost:3000** en el navegador para usar la calculadora.

Para parar el servidor: pulsa `Ctrl+C` en la terminal.

## Tecnologías

- **Next.js** — Framework web sobre Node.js
- **TypeScript** — JavaScript con tipos para menos errores
- **Tailwind CSS** — Estilos rápidos y consistentes
