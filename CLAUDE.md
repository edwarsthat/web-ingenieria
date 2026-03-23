# CLAUDE.md — Proyecto Web INGENIERA

Guía de contexto persistente para sesiones de desarrollo y diseño.

---

## Stack Técnico

- **Framework:** Astro ^6.0.4 (SSG, view transitions con ClientRouter)
- **Estilos:** Tailwind CSS v4 via `@tailwindcss/vite` — sintaxis CSS-first (`@import "tailwindcss"`)
- **Validación:** Zod ^3.25.76 (content collections)
- **i18n:** Astro i18n integrado — `es` (default) + `en`
- **Contenido:** Astro Content Collections en `src/content/`

### Sintaxis Tailwind v4 importante
- Variables CSS: `bg-(--color-primary)` no `bg-[var(--color-primary)]`
- Gradientes: `bg-linear-to-b` no `bg-gradient-to-b`
- Duraciones: `duration-240` no `duration-[240ms]`
- Rotaciones: `rotate-120` no `rotate-[120deg]`
- Arbitrary values con `color-mix`: `border-[color-mix(in_srgb,var(--color-primary)_12%,transparent)]`

---

## Paleta de Colores

Definida en `src/styles/global.css`:

```
--color-base:       #ffffff   → fondo principal, superficies de tarjetas
--color-primary:    #2563EB   → azul — botones, bordes, acentos principales
--color-contrast:   #38BDF8   → azul eléctrico — badges, iconos secundarios
--color-green:      #22C55E   → verde — CTAs primarios, energía, positivo
--color-green-soft: #16A34A   → verde oscuro — hover de CTAs
--color-text:       #000000   → texto principal
```

**Colores directos en componentes:**
- `#080c10` — fondo hero y footer (casi negro)
- `#1E3A8A`, `#0369A1` — variantes de azul en tarjetas de servicios

**Regla 60-30-10:** Fondo blanco (60%) · Azul en estructura/bordes (30%) · Verde solo en CTAs y acentos clave (10%)

---

## Tipografía

**Estado actual:** Fuentes del sistema (sin imports personalizados)
**Dirección elegida:** Fuente técnica y moderna — **Plus Jakarta Sans** o **Outfit**

**Escala tipográfica en uso:**
| Rol | Tamaño | Peso |
|-----|--------|------|
| Hero H1 | `clamp(2.25rem, 5vw, 3rem)` | 800 extrabold |
| Section H2 | `clamp(1.8rem, 3.5vw, 2.8rem)` | 800 extrabold |
| Card H3 | `0.9375rem` | 700 bold |
| Body | `1.05rem` | 400–500 |
| Secondary | `0.875rem` | 400 |
| Badges/Tags | `0.72rem` | 700 bold, uppercase |
| Specialty tags | `0.6875rem` | 600 semibold, uppercase |

---

## Design Context

### Usuarios
Tomadores de decisiones técnicas en industria colombiana: ingenieros de planta, gerentes de operaciones, directores de proyectos. Llegan al sitio buscando credenciales, claridad de proceso y evidencia de resultados medibles. El contexto es evaluativo — comparan proveedores, buscan confianza antes de contactar.

### Personalidad de Marca
**Técnica · Sólida · Moderna**

Voz directa y rigurosa. No es una marca que "vende" — es una marca que *demuestra*. El tono es el de un experto que no necesita exagerar: cifras concretas, procesos documentados, equipo visible. La modernidad no es decorativa sino funcional — indica que los métodos y herramientas están al día.

### Dirección Estética
Referencias principales: **Stripe.com** (limpieza, jerarquía visual fuerte, secciones bien delimitadas) + **Linear.app** (minimalismo premium, spacing generoso, sensación de producto bien construido).

**Tono visual:** Refinado y contenido. Azul como base estructural, verde como acción, mucho espacio en blanco. Animaciones sutiles que comunican precisión, no espectacularidad.

**Anti-referencias:**
- Sin dark mode full (hero y footer ya cubren el contraste oscuro)
- Sin glassmorphism ni efectos decorativos sin propósito
- Sin gradientes de texto en headings
- Sin iconos enormes con border-radius grueso sobre cada sección
- Sin grids de tarjetas idénticas sin variación de jerarquía
- Sin cyan-on-dark / purple-to-blue — esos son clichés de IA

### Principios de Diseño

1. **Precisión sobre decoración.** Cada elemento visual debe justificar su presencia. Si no aporta jerarquía, información o guía al usuario, se elimina.

2. **El espacio es estructura.** El spacing generoso y consistente *es* el diseño — no relleno. Usar ritmo vertical basado en la escala de Tailwind, con variación intencional entre secciones.

3. **Azul confía, verde actúa.** El azul domina la estructura (bordes, iconos, acentos), el verde aparece únicamente donde el usuario debe hacer algo. No usar verde como decoración.

4. **Movimiento que informa.** Las transiciones comunican estado: hover revela disponibilidad, scale-y revela jerarquía activa, rotate en el avatar comunica energía técnica. Siempre `transform` + `opacity`, nunca propiedades de layout. Respetar `prefers-reduced-motion`.

5. **Credibilidad visible.** El diseño debe sostener el mensaje: empresa con procesos, equipo real, números concretos. Evitar patrones genéricos que hacen el sitio indistinguible de plantillas SaaS.

---

## Estructura de Páginas

```
/es/           → Homepage español (default)
/en/           → Homepage inglés
/es/contacto   → Formulario de contacto
/en/contacto
/es/servicios/[slug]  → Detalle de servicio
/en/servicios/[slug]
```

**Secciones del homepage (orden):**
`Navbar` → `Hero (#inicio)` → `ComoTrabajamos (#como-trabajamos)` → `Servicios (#servicios)` → `Nosotros (#nosotros)` → `Equipo (#equipo)` → `Footer`

---

## Patrones de Componentes

### Tarjetas de contenido
- `rounded-2xl` (16px), fondo `--color-base`, borde `color-mix(primary 12%, transparent)`
- Hover: `border-color` → 32%, `box-shadow` sutil azul, `translateY(-3px)`
- Transición: `duration-240 ease-[cubic-bezier(0.25,1,0.5,1)]`

### Badges de sección
- `text-[0.72rem] font-bold tracking-[0.12em] uppercase`
- Border `--color-contrast/30`, `rounded-full`, `px-3.5 py-1.5`

### Botón primario (CTA)
- `bg-(--color-green)`, texto blanco, `px-7 py-3`, `rounded-lg`, `font-semibold`
- Hover: `bg-(--color-green-soft)`, texto negro, `-translate-y-px`

### Tags de especialidad
- `text-[0.6875rem] font-semibold tracking-[0.025em] uppercase`
- `px-2.5 py-1 rounded-full`
- Color/bg/border usando `color-mix(primary X%, transparent)`
