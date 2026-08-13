/**
 * Carrusel del hero — vanilla, sin dependencias.
 *
 * Convive con ClientRouter: monta en `astro:page-load` y desmonta en
 * `astro:before-swap`, para no acumular timers ni listeners entre navegaciones.
 */

const AUTOPLAY_MS = 7000;
const SWIPE_THRESHOLD = 48;

/** Funciones de limpieza de las instancias vivas en la página actual. */
const mounted = new Set<() => void>();

let bound = false;

export function setupHeroCarousel(): void {
  if (bound) return;
  bound = true;

  document.addEventListener('astro:page-load', mountAll);
  document.addEventListener('astro:before-swap', destroyAll);
}

function mountAll(): void {
  document
    .querySelectorAll<HTMLElement>('[data-hero-carousel]')
    .forEach(mount);
}

function destroyAll(): void {
  mounted.forEach((destroy) => destroy());
  mounted.clear();
}

function mount(root: HTMLElement): void {
  if (root.dataset.heroReady) return;

  const track = root.querySelector<HTMLElement>('[data-hero-track]');
  const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-hero-slide]'));

  // Con un solo slide no hay carrusel que montar.
  if (!track || slides.length < 2) return;

  root.dataset.heroReady = 'true';

  const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-hero-dot]'));
  const controls = root.querySelector<HTMLElement>('[data-hero-controls]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const controller = new AbortController();
  const { signal } = controller;

  let index = Math.max(0, slides.findIndex((slide) => slide.hasAttribute('data-active')));
  let timer = 0;
  let held = false;      // cursor encima o foco dentro
  let onScreen = true;   // sección visible en viewport

  function render(): void {
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.toggleAttribute('data-active', active);
      // `inert` saca los CTAs ocultos del orden de tabulación.
      slide.toggleAttribute('inert', !active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    dots.forEach((dot, i) => {
      dot.setAttribute('aria-current', i === index ? 'true' : 'false');
    });
  }

  function stop(): void {
    if (!timer) return;
    clearInterval(timer);
    timer = 0;
  }

  function restart(): void {
    stop();
    if (reducedMotion.matches || held || !onScreen || document.hidden) return;
    timer = window.setInterval(() => goTo(index + 1), AUTOPLAY_MS);
  }

  function goTo(next: number, userInitiated = false): void {
    const total = slides.length;
    index = ((next % total) + total) % total;

    // El anuncio a lectores de pantalla solo se activa tras interacción del
    // usuario: con autoplay sería ruido constante.
    if (userInitiated) track!.setAttribute('aria-live', 'polite');

    render();
    restart();
  }

  // ── Controles ──
  root.querySelector('[data-hero-prev]')
    ?.addEventListener('click', () => goTo(index - 1, true), { signal });

  root.querySelector('[data-hero-next]')
    ?.addEventListener('click', () => goTo(index + 1, true), { signal });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i, true), { signal });
  });

  // Flechas del teclado: solo con el foco dentro de los controles, para no
  // secuestrar las teclas de navegación del resto de la página.
  controls?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(index - 1, true);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(index + 1, true);
    }
  }, { signal });

  // ── Pausa en hover / foco ──
  root.addEventListener('mouseenter', () => { held = true; stop(); }, { signal });
  root.addEventListener('mouseleave', () => { held = false; restart(); }, { signal });
  root.addEventListener('focusin',    () => { held = true; stop(); }, { signal });
  root.addEventListener('focusout', (event) => {
    if (root.contains(event.relatedTarget as Node | null)) return;
    held = false;
    restart();
  }, { signal });

  // ── Swipe táctil ──
  let startX = 0;
  let startY = 0;
  let swiping = false;

  track.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') return;
    swiping = true;
    startX = event.clientX;
    startY = event.clientY;
  }, { signal });

  track.addEventListener('pointerup', (event) => {
    if (!swiping) return;
    swiping = false;

    const dx = event.clientX - startX;
    const dy = event.clientY - startY;

    // Ignora gestos cortos y los que son más verticales que horizontales
    // (esos son scroll, no swipe).
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) <= Math.abs(dy)) return;

    goTo(index + (dx < 0 ? 1 : -1), true);
  }, { signal });

  track.addEventListener('pointercancel', () => { swiping = false; }, { signal });

  // ── Pausa fuera de viewport / pestaña oculta ──
  const observer = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen) restart();
    else stop();
  }, { threshold: 0.2 });

  observer.observe(root);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else restart();
  }, { signal });

  reducedMotion.addEventListener('change', restart, { signal });

  mounted.add(() => {
    stop();
    observer.disconnect();
    controller.abort();
    delete root.dataset.heroReady;
  });

  render();
  restart();
}
