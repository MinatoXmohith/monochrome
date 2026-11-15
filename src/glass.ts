/**
 * Runtime support for the Liquid Glass themes ('glass', 'glass-light').
 *
 * - Mounts the ambient backdrop layer and keeps it in sync with the current
 *   track's cover art (through the `--glass-art` custom property).
 * - Toggles `body.glass-scrolled` so the header turns to glass once content
 *   scrolls under it.
 * - On Chromium, adds an SVG displacement filter and the `glass-refraction`
 *   class so the player pill bends the content behind it.
 *
 * Everything here is inert for other themes: the CSS only styles these hooks
 * under the glass themes.
 */

const GLASS_THEMES = new Set(['glass', 'glass-light']);

function isGlassTheme(): boolean {
    return GLASS_THEMES.has(document.documentElement.getAttribute('data-theme') ?? '');
}

function mountAmbient(): void {
    if (document.getElementById('glass-ambient')) return;
    const ambient = document.createElement('div');
    ambient.id = 'glass-ambient';
    ambient.setAttribute('aria-hidden', 'true');
    ambient.innerHTML = '<div class="glass-ambient-art"></div><div class="glass-ambient-glow"></div>';
    document.body.prepend(ambient);
}

function syncArtwork(): void {
    const bar = document.querySelector<HTMLElement>('.now-playing-bar');
    if (!bar) return;

    let lastSrc: string | null = null;
    const apply = () => {
        // The app swaps the cover element (image vs. animated video cover), so
        // look it up each time instead of holding a reference.
        const cover = bar.querySelector<HTMLImageElement | HTMLVideoElement>('.cover');
        // `src` updates synchronously; `currentSrc` lags until the new image loads.
        const src = cover instanceof HTMLVideoElement ? cover.poster : cover?.src || '';
        if (src === lastSrc) return;
        lastSrc = src;
        // The placeholder app icon makes a poor backdrop; keep the accent glows only.
        if (!src || src.includes('/assets/appicon')) {
            document.documentElement.style.removeProperty('--glass-art');
            return;
        }
        document.documentElement.style.setProperty('--glass-art', `url("${src.replace(/"/g, '\\"')}")`);
    };

    apply();
    new MutationObserver(apply).observe(bar, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['src', 'poster'],
    });
}

function trackHeaderScroll(): void {
    const scroller = document.querySelector<HTMLElement>('.main-content');
    if (!scroller) return;
    let ticking = false;
    scroller.addEventListener(
        'scroll',
        () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                document.body.classList.toggle('glass-scrolled', scroller.scrollTop > 8);
                ticking = false;
            });
        },
        { passive: true }
    );
}

function isChromium(): boolean {
    const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands;
    return !!brands?.some((b) => b.brand === 'Chromium');
}

function mountRefraction(): void {
    if (!isChromium() || document.getElementById('glass-refract-defs')) return;
    if (window.matchMedia('(prefers-reduced-transparency: reduce)').matches) return;

    // A smooth noise map gently displaces the backdrop; the lens strength stays
    // low so text behind the glass is bent, not scrambled.
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'glass-refract-defs';
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.innerHTML = `
        <filter id="glass-refract" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.02" numOctaves="2" seed="7" result="noise" />
            <feGaussianBlur in="noise" stdDeviation="2" result="softNoise" />
            <feDisplacementMap in="SourceGraphic" in2="softNoise" scale="38" xChannelSelector="R" yChannelSelector="G" />
        </filter>`;
    document.body.appendChild(svg);
    document.documentElement.classList.add('glass-refraction');
}

export function initLiquidGlass(): void {
    mountAmbient();
    syncArtwork();
    trackHeaderScroll();
    mountRefraction();

    // Reset the scrolled state when switching away and back so the header is correct.
    window.addEventListener('theme-changed', () => {
        if (!isGlassTheme()) document.body.classList.remove('glass-scrolled');
    });
}
