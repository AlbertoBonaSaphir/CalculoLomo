# CLAUDE.md — Asistente de Desarrollo

## SOBRE EL USUARIO

- NO es programador. Explicar TODO en lenguaje simple, como si fuera la primera vez.
- Ante cualquier error: explicar QUE fallo, POR QUE, y COMO se soluciona.
- Si el usuario pide algo ambiguo, preguntar antes de asumir.
- Explicaciones y documentacion en español. Codigo en ingles.

---

## ENTORNO Y HERRAMIENTAS

- **Sistema operativo: Windows.** Usar comandos compatibles con Windows. Si un comando es solo para Linux/Mac, buscar el equivalente o explicar la alternativa.
- El usuario tiene Node.js instalado. Es el runtime por defecto para todos los proyectos.
- **Puede que falten herramientas** (git, docker, eslint, etc.). Antes de usarlas, verificar si estan instaladas. Si no lo estan, instalarlas automaticamente o guiar al usuario paso a paso con instrucciones para Windows (instaladores, winget, o npm).
- Antes de instalar cualquier cosa: explicar QUE es, PARA QUE sirve, y si afecta al sistema fuera del proyecto.
- Preferir herramientas que se instalen localmente al proyecto (`npm install -D`) sobre instalaciones globales.
- Usar rutas con barras normales o escapadas (`/` o `\\`). Tener en cuenta que Windows puede dar problemas con rutas largas o permisos.

---

## TIPO DE PROYECTO

Al iniciar un proyecto nuevo:

1. Preguntar al usuario que quiere construir.
2. Recomendar el stack mas simple sobre Node.js que resuelva el problema.
3. Explicar las opciones en lenguaje simple antes de elegir.
4. Crear un `PROJECT_CONTEXT.md` con las decisiones tomadas.

---

## REGLAS UNIVERSALES (TODO PROYECTO)

### Estructura
- Codigo organizado en carpetas con responsabilidad clara. Explicar para que sirve cada carpeta al crearla.
- Un fichero = una responsabilidad. Si supera ~200 lineas, dividir.
- Nunca mezclar logica de negocio con acceso a datos ni con manejo de rutas.

### Seguridad
- Nunca secrets (passwords, API keys, tokens) en el codigo. Siempre en `.env` (y `.env` en `.gitignore`).
- Crear `.env.example` sin valores reales como referencia.
- Si hay base de datos: prepared statements SIEMPRE. Nunca interpolar variables en queries.
- Si hay passwords: hashear con bcrypt o equivalente. Nunca texto plano.
- Si hay inputs de usuario: validar antes de procesar.
- `npm audit` limpio antes de commitear.

### Calidad
- Tests para cada funcionalidad. Sin tests, el cambio esta incompleto.
- Nunca `console.log` como logging definitivo. Usar un logger apropiado (pino).
- Codigo en ingles. Comentarios explican el POR QUE, no el QUE.

### Documentacion (mantener actualizada tras cada cambio)
- `README.md` — que es, como instalar, como usar, como parar.
- `PROJECT_CONTEXT.md` — decisiones tecnicas, estado actual, historial de sesiones.
- `CHANGELOG.md` — que cambio y cuando.
- `docs/api.md` — si hay API, documentar cada endpoint.

### Git
- Commits: `tipo(alcance): descripcion` (feat, fix, docs, refactor, test, chore)
- Nunca commitear: `.env`, `node_modules/`, datos de BD, archivos temporales.

---

## CUANDO SE LEVANTA UN SERVICIO

Siempre explicar al usuario:

1. **Que es:** "Esto arranca un servidor en tu maquina en el puerto 3000"
2. **Como verificar:** "Abre http://localhost:3000 en el navegador"
3. **Como parar:** "Pulsa Ctrl+C en la terminal"
4. **Si el puerto esta ocupado:** explicar como resolver
5. **Si usa Docker:** explicar arranque y parada en terminos simples

---

## COMANDOS PELIGROSOS

Antes de ejecutar cualquiera de estos, **avisar y explicar el riesgo:**

- `rm -rf` / `rmdir /s /q` / `del /s` — borra archivos sin recuperacion
- `npm install -g` — instala global, puede afectar otros proyectos
- `docker compose down -v` — borra volumenes (puede borrar base de datos)
- `git reset --hard` / `git push --force` — puede perder trabajo
- Cualquier cosa con `sudo` o permisos de admin
- Cualquier cosa que abra puertos o modifique firewall/sistema

---

## AL FINALIZAR CADA SESION

Actualizar `PROJECT_CONTEXT.md` con:
- Que se hizo
- Que quedo pendiente
- Decisiones tomadas y por que
