// portfolio.jsx — portfolio fotográfico a pantalla completa
const { useState, useEffect, useRef } = React;

// El preview autoriza recursos con un token en la query del documento.
// Las URLs relativas lo pierden, así que lo reañadimos a cada imagen.
const withQ = (s) => s + (window.__PF_Q || '');

/* ── color helpers ─────────────────────────────────────────── */
function hexToRgb(hex) {
  const m = hex.replace('#', '');
  return { r: parseInt(m.slice(0, 2), 16), g: parseInt(m.slice(2, 4), 16), b: parseInt(m.slice(4, 6), 16) };
}
const rgb = (c) => `rgb(${c.r}, ${c.g}, ${c.b})`;
const rgba = (c, a) => `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`;
const darken = (c, f) => ({ r: Math.round(c.r * f), g: Math.round(c.g * f), b: Math.round(c.b * f) });
const mix = (c, t, f) => ({ // mix c toward target t by f
  r: Math.round(c.r + (t.r - c.r) * f), g: Math.round(c.g + (t.g - c.g) * f), b: Math.round(c.b + (t.b - c.b) * f),
});

/* ── extrae el color dominante de cada imagen ──────────────── */
function useDominants(photos) {
  const [doms, setDoms] = useState({});
  useEffect(() => {
    photos.forEach((p, i) => {
      const img = new Image();
      img.onload = () => {
        try {
          const s = 44, cv = document.createElement('canvas');
          cv.width = s; cv.height = s;
          const cx = cv.getContext('2d');
          cx.drawImage(img, 0, 0, s, s);
          const d = cx.getImageData(0, 0, s, s).data;
          let r = 0, g = 0, b = 0, n = 0;
          for (let k = 0; k < d.length; k += 4) { r += d[k]; g += d[k + 1]; b += d[k + 2]; n++; }
          setDoms((prev) => ({ ...prev, [i]: { r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n), dataUrl: cv.toDataURL('image/jpeg', 0.8) } }));
        } catch (e) { /* fallback used */ }
      };
      img.src = withQ(p.srcumb || p.src);
    });
  }, [photos.length]);
  return doms;
}

/* ── temas estéticos ───────────────────────────────────────── */
const THEMES = {
  editorial: {
    base: '#f4f3f0', text: '#191a1d', secondary: '#6f6e72', subtle: '#9b9a9e',
    card: 'rgba(252,251,249,0.78)', hairline: 'rgba(20,20,25,0.10)',
    panel: '#efeeea', photoBorder: 'rgba(20,20,25,0.08)',
    photoShadow: '0 34px 90px -36px rgba(30,30,40,0.55)',
  },
  galeria: {
    base: '#0d0e10', text: '#f3f2f3', secondary: '#a4a3aa', subtle: '#6e6d75',
    card: 'rgba(22,23,27,0.62)', hairline: 'rgba(255,255,255,0.14)',
    panel: '#131418', photoBorder: 'rgba(255,255,255,0.10)',
    photoShadow: '0 40px 110px -30px rgba(0,0,0,0.8)',
  },
  calido: {
    base: '#ece3d4', text: '#2c2317', secondary: '#7d7160', subtle: '#a89a85',
    card: 'rgba(253,249,242,0.76)', hairline: 'rgba(90,68,42,0.14)',
    panel: '#e6dccb', photoBorder: 'rgba(90,68,42,0.12)',
    photoShadow: '0 34px 90px -36px rgba(80,60,35,0.5)',
  },
};

/* ── fondo del escenario según estética + modo ─────────────── */
function stageBg(aesthetic, fondo, dom, theme) {
  if (fondo === 'negro') return { background: '#08090a' };
  if (fondo === 'neutro') {
    if (aesthetic === 'galeria') return { background: 'radial-gradient(130% 120% at 50% 30%, #16181c 0%, #0c0d0f 80%)' };
    return { background: `radial-gradient(130% 120% at 50% 28%, ${theme.panel} 0%, ${theme.base} 78%)` };
  }
  if (fondo === 'borroso') return { background: theme.base }; // blurred layer drawn on top
  // dominante
  if (aesthetic === 'galeria') {
    const a = darken(dom, 0.62), b = darken(dom, 0.26);
    return { background: `radial-gradient(125% 115% at 50% 32%, ${rgb(a)} 0%, ${rgb(b)} 42%, #0a0b0d 88%)` };
  }
  if (aesthetic === 'calido') {
    return { background: `radial-gradient(125% 115% at 64% 24%, ${rgba(dom, 0.34)} 0%, ${rgba(dom, 0.12)} 52%, ${theme.base} 84%)` };
  }
  // editorial
  return { background: `radial-gradient(125% 115% at 68% 22%, ${rgba(dom, 0.55)} 0%, ${rgba(dom, 0.22)} 52%, ${theme.base} 86%)` };
}

/* ── foto: thumbnail inmediato → full al entrar en pantalla ─── */
function Photo({ p, style, frame }) {
  const [src, setSrc] = useState(p.srcThumb || p.src);
  const [fading, setFading] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      setFading(true);
      const img = new Image();
      img.onload = () => { setSrc(p.src); setFading(false); };
      img.src = withQ(p.src);
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <img ref={ref} src={withQ(src)} alt={p.title} decoding="async"
      style={{ objectFit: 'contain', objectPosition: 'top center', ...frame, ...style, opacity: fading ? 0.6 : 1, transition: 'opacity 0.4s' }}
    />
  );
}

/* ── datos técnicos (chips) ────────────────────────────────── */
function MetaTags({ meta, theme, dense }) {
  const order = ['aperture', 'shutter', 'iso', 'focal', 'date', 'location'];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: dense ? '6px' : '8px', marginTop: dense ? 14 : 20 }}>
      {order.map((k) => (
        <span key={k} style={{
          fontFamily: 'var(--font-sans)', fontSize: dense ? 11 : 12, lineHeight: 1, letterSpacing: '0.02em',
          color: theme.secondary, padding: dense ? '6px 9px' : '7px 11px',
          border: `1px solid ${theme.hairline}`, borderRadius: 8, whiteSpace: 'nowrap',
        }}>{meta[k]}</span>
      ))}
    </div>
  );
}

/* ── bloque de texto (título, serie, descripción, datos) ───── */
function Caption({ p, i, total, theme, accent, variant }) {
  const dense = variant === 'corner' || variant === 'hover';
  return (
    <React.Fragment>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12 }}>
        <span style={{
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: dense ? 11 : 12,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: accent,
        }}>{p.series}</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, letterSpacing: '0.1em', color: theme.subtle }}>
          {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: dense ? 'clamp(24px, 2.4vw, 34px)' : 'clamp(30px, 3.4vw, 52px)',
        lineHeight: 1.04, letterSpacing: '-0.02em', color: theme.text, margin: 0, textWrap: 'balance',
      }}>{p.title}</h2>
      <p style={{
        fontFamily: 'var(--font-sans)', fontSize: dense ? 14 : 16, lineHeight: 1.5,
        color: theme.secondary, margin: '14px 0 0', maxWidth: 440, textWrap: 'pretty',
      }}>{p.desc}</p>
      <MetaTags meta={p.meta} theme={theme} dense={dense} />
    </React.Fragment>
  );
}

/* ── una sección (foto a pantalla completa) ────────────────── */
function Slide({ p, i, total, theme, aesthetic, fondo, dataPos, accent }) {
  const dom = p._dom || hexToRgb(p.dom);
  const bg = stageBg(aesthetic, fondo, dom, theme);
  const showBlur = fondo === 'borroso';

  const cardStyle = {
    background: theme.card, backdropFilter: 'blur(18px) saturate(1.1)', WebkitBackdropFilter: 'blur(18px) saturate(1.1)',
    border: `1px solid ${theme.hairline}`, borderRadius: 18, padding: '22px 26px',
    boxShadow: '0 18px 50px -28px rgba(0,0,0,0.4)',
  };
  const photoFrame = {
    border: `1px solid ${theme.photoBorder}`, boxShadow: theme.photoShadow,
    background: aesthetic === 'galeria' ? '#000' : '#fff', display: 'block',
  };

  const blurLayer = showBlur && (
    <React.Fragment>
      <div style={{
        position: 'absolute', inset: '-8%', backgroundImage: `url("${p._dom?.dataUrl || withQ(p.srcThumb || p.src)}")`,
        backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(46px) saturate(1.15)', transform: 'scale(1.12)',
      }} />
      <div style={{ position: 'absolute', inset: 0, background: rgba(hexToRgb(theme.base.length === 7 ? theme.base : '#101012'), aesthetic === 'galeria' ? 0.5 : 0.6) }} />
    </React.Fragment>
  );

  /* ---- PANEL LATERAL ---- */
  if (dataPos === 'panel') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 34%) 1fr', width: '100%', height: '100%' }}>
        <aside style={{
          background: theme.panel, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(40px, 5vw, 80px)', borderRight: `1px solid ${theme.hairline}`,
        }}>
          <Caption p={p} i={i} total={total} theme={theme} accent={accent} variant="panel" />
        </aside>
        <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', ...bg }}>
          {blurLayer}
          <Photo p={p} style={{ height: '94vh', maxWidth: '50vw' }} frame={photoFrame} />
        </div>
      </div>
    );
  }

  /* ---- PIE DE FOTO ---- */
  if (dataPos === 'pie') {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...bg }}>
        {blurLayer}
        <div style={{
          position: 'relative', height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 28, padding: '6vh 6vw',
        }}>
          <Photo p={p} style={{ maxHeight: '54vh', maxWidth: '82vw', height: '54vh' }} frame={photoFrame} />
          <div style={{ ...cardStyle, maxWidth: 720, width: 'auto', textAlign: 'left' }}>
            <Caption p={p} i={i} total={total} theme={theme} accent={accent} variant="pie" />
          </div>
        </div>
      </div>
    );
  }

  /* ---- ESQUINA / AL PASAR EL RATÓN ---- */
  const hover = dataPos === 'hover';
  return (
    <div className={hover ? 'pf-hovergroup' : ''} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...bg }}>
      {blurLayer}
      <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '3vh 4vw' }}>
        <Photo p={p} style={{ height: '94vh', maxWidth: '92vw' }} frame={photoFrame} />
      </div>
      <div className={hover ? 'pf-caption-hover' : ''} style={{
        position: 'absolute', left: 'clamp(24px, 3.5vw, 56px)', bottom: 'clamp(24px, 3.5vw, 56px)',
        maxWidth: 'min(440px, 80vw)', ...cardStyle,
      }}>
        <Caption p={p} i={i} total={total} theme={theme} accent={accent} variant={hover ? 'hover' : 'corner'} />
      </div>
      {hover && (
        <div className="pf-hint" style={{
          position: 'absolute', left: 'clamp(24px, 3.5vw, 56px)', bottom: 'clamp(24px, 3.5vw, 56px)',
          fontFamily: 'var(--font-sans)', fontSize: 12, letterSpacing: '0.04em', color: theme.text,
          background: theme.card, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          border: `1px solid ${theme.hairline}`, borderRadius: 999, padding: '9px 16px',
        }}>{p.series} · pasa el ratón</div>
      )}
    </div>
  );
}

/* ── app ───────────────────────────────────────────────────── */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "aesthetic": "editorial",
  "dataPos": "corner",
  "fondo": "dominante",
  "accent": "#FF7D06",
  "snap": true,
  "signature": false,
  "name": "Mara Solís"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [photos, setPhotos] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const theme = THEMES[t.aesthetic] || THEMES.editorial;

  useEffect(() => {
    (window.PHOTOS_READY || Promise.resolve([])).then(p => {
      setPhotos(p);
      setLoaded(true);
    });
  }, []);

  const doms = useDominants(photos);
  const enriched = photos.map((p, i) => ({ ...p, _dom: doms[i] }));

  if (!loaded) return (
    <div style={{ height: '100%', background: theme.base, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'var(--font-sans)', color: theme.secondary, fontSize: 14, letterSpacing: '0.08em' }}>Cargando…</span>
    </div>
  );

  return (
    <div style={{ height: '100%', background: theme.base }}>
      <div className="pf-scroll" style={{ scrollSnapType: t.snap ? 'y mandatory' : 'none' }}>
        {enriched.map((p, i) => (
          <section key={i} className="pf-sec" data-screen-label={`Foto ${String(i + 1).padStart(2, '0')}`}>
            <Slide p={p} i={i} total={enriched.length} theme={theme}
              aesthetic={t.aesthetic} fondo={t.fondo} dataPos={t.dataPos} accent={t.accent} />
          </section>
        ))}
      </div>

      {t.signature && (
        <div style={{
          position: 'fixed', right: 'clamp(20px,3vw,44px)', bottom: 'clamp(20px,3vw,44px)', zIndex: 40,
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em',
          color: theme.text, mixBlendMode: t.aesthetic === 'galeria' ? 'normal' : 'normal', pointerEvents: 'none',
          textShadow: t.aesthetic === 'galeria' ? '0 1px 12px rgba(0,0,0,0.6)' : '0 1px 10px rgba(255,255,255,0.5)',
        }}>{t.name}</div>
      )}

      <TweaksPanel>
        <TweakSection label="Estética" />
        <TweakRadio label="Estilo" value={t.aesthetic}
          options={[{ value: 'editorial', label: 'Editorial' }, { value: 'galeria', label: 'Galería' }, { value: 'calido', label: 'Cálido' }]}
          onChange={(v) => setTweak('aesthetic', v)} />
        <TweakSelect label="Fondo" value={t.fondo}
          options={[{ value: 'dominante', label: 'Color dominante' }, { value: 'borroso', label: 'Foto desenfocada' }, { value: 'neutro', label: 'Neutro' }, { value: 'negro', label: 'Negro' }]}
          onChange={(v) => setTweak('fondo', v)} />
        <TweakColor label="Acento" value={t.accent}
          options={['#FF7D06', '#FD367E', '#028EE0', '#1F8A5B', '#191a1d']}
          onChange={(v) => setTweak('accent', v)} />

        <TweakSection label="Datos de la foto" />
        <TweakSelect label="Posición" value={t.dataPos}
          options={[{ value: 'corner', label: 'Esquina (superpuesto)' }, { value: 'panel', label: 'Panel lateral' }, { value: 'pie', label: 'Pie de foto' }, { value: 'hover', label: 'Al pasar el ratón' }]}
          onChange={(v) => setTweak('dataPos', v)} />

        <TweakSection label="Página" />
        <TweakToggle label="Ajuste a pantalla (snap)" value={t.snap} onChange={(v) => setTweak('snap', v)} />
        <TweakToggle label="Mostrar firma" value={t.signature} onChange={(v) => setTweak('signature', v)} />
        {t.signature && (
          <TweakText label="Nombre" value={t.name} onChange={(v) => setTweak('name', v)} />
        )}
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
