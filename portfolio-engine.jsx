// portfolio-engine.jsx — motor de layout: fitBox + las 20 recetas de maquetación + <App/>.
// Traducción de Portafolio de fotografía personal/Portfolio v2.dc.html (bloque renderVals()).

const SITE_TITLE = 'Portfolio';
const SITE_TAGLINE = 'Fotografía';
const INFO_STYLE = 'overlay'; // 'overlay' | 'panel' | 'tap-reveal'

const PALETTE = ['#f4f0e8', '#262220', '#8a8175'];
const FG = PALETTE[1];
const MUTED = PALETTE[2];
// SANS_FONT y SERIF_FONT ya están declaradas por portfolio-lightbox.jsx
// (todos los .jsx se concatenan en el mismo script, ver index.html).

const CARD_W = 1200;
const CARD_H = 1200;
const PAD_X = 60;
const PAD_Y = 52;
const CONTENT_W = CARD_W - PAD_X * 2;
const CONTENT_H = CARD_H - PAD_Y * 2;

function fitBox(ratio, maxWBox, maxHBox) {
  let tw = maxHBox * ratio, th = maxHBox;
  if (tw > maxWBox) { tw = maxWBox; th = tw / ratio; }
  return { w: Math.round(tw), h: Math.round(th) };
}

function MetaLine({ photo, style }) {
  const text = [photo.place, photo.date].filter(Boolean).join(' · ');
  if (!text) return null;
  return <div style={style}>{text}</div>;
}

// -- carga progresiva: srcBlur (400px) -> src (1920px) al entrar en viewport --
function ProgressiveImg({ photo, fit }) {
  const [src, setSrc] = React.useState(photo.srcBlur);
  const ref = React.useRef(null);
  React.useEffect(() => {
    let cancelled = false;
    const obs = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      const img = new Image();
      img.onload = () => { if (!cancelled) setSrc(photo.src); };
      img.src = photo.src;
    }, { rootMargin: '200px' });
    if (ref.current) obs.observe(ref.current);
    return () => { cancelled = true; obs.disconnect(); };
  }, [photo.src]);
  return (
    <img
      ref={ref}
      src={src}
      alt={photo.title || ''}
      style={{ width: '100%', height: '100%', objectFit: fit || 'cover', display: 'block' }}
      decoding="async"
    />
  );
}

// -- responsive: escala la tarjeta 1200x675 completa según el viewport --
function useScale() {
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    const compute = () => {
      const avail = Math.min(window.innerWidth * 0.94, CARD_W);
      setScale(Math.min(1, avail / CARD_W));
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);
  return scale;
}

function PageFrame({ cardStyle, children, onClick }) {
  const scale = useScale();
  return (
    <div style={{ marginBottom: 'clamp(28px, 6vw, 56px)', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: CARD_W * scale, height: CARD_H * scale }}>
        <div style={{ ...cardStyle, transform: `scale(${scale})`, transformOrigin: 'top left' }} onClick={onClick}>
          {children}
        </div>
      </div>
    </div>
  );
}

const CARD_BASE_STYLE = {
  border: '1px solid rgba(30,26,18,0.1)',
  boxShadow: '0 26px 56px rgba(30,26,18,0.18), 0 4px 12px rgba(30,26,18,0.09)',
  borderRadius: 8,
  width: CARD_W,
  height: CARD_H,
  boxSizing: 'border-box',
  padding: `${PAD_Y}px ${PAD_X}px`,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  overflow: 'hidden',
  position: 'relative',
};

function cardStyleFor(pageIdx) {
  const angle = 145 + ((pageIdx * 23) % 60);
  return { ...CARD_BASE_STYLE, background: `linear-gradient(${angle}deg, #faf6ec 0%, #f1ead6 100%)` };
}

const TITLE_STYLE = { fontFamily: SERIF_FONT, fontSize: 36, color: FG, margin: 0, lineHeight: 1.15 };
const META_STYLE = { fontFamily: SANS_FONT, fontSize: 15, letterSpacing: '.02em', color: MUTED, marginTop: 9 };
const NOTES_STYLE = { fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: 17, color: FG, opacity: 0.82, marginTop: 14, lineHeight: 1.5 };

// ---------- portada ----------

function CoverPage({ photo }) {
  const coverCardStyle = {
    ...CARD_BASE_STYLE,
    background: '#12100c',
    padding: 0,
    justifyContent: 'flex-start',
  };
  return (
    <PageFrame cardStyle={coverCardStyle}>
      <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <ProgressiveImg photo={photo} fit="cover" />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,8,6,0.05) 0%, rgba(10,8,6,0.18) 45%, rgba(10,8,6,0.65) 100%)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: '10%', textAlign: 'center', padding: '0 32px' }}>
        <div style={{ fontFamily: SERIF_FONT, fontStyle: 'italic', fontWeight: 500, fontSize: 68, color: '#f8f5ee', textShadow: '0 4px 24px rgba(0,0,0,0.35)', letterSpacing: '.01em' }}>{SITE_TITLE}</div>
        <div style={{ fontFamily: SANS_FONT, fontSize: 14, letterSpacing: '.24em', textTransform: 'uppercase', color: '#f0ece0', opacity: 0.88, marginTop: 12 }}>{SITE_TAGLINE}</div>
      </div>
    </PageFrame>
  );
}

// ---------- singleStacked / singleSide / textForward ----------

function SingleStacked({ photo, showMeta, showNotes, onOpen }) {
  const box = fitBox(photo.ratio, CONTENT_W, Math.round(CONTENT_H * 0.75));
  const imgWrapStyle = { width: box.w, height: box.h, margin: '0 auto', position: 'relative', overflow: 'hidden', background: 'rgba(20,16,10,0.045)', cursor: 'pointer', flex: 'none' };
  const textWrapStyle = { textAlign: 'center', marginTop: 22, maxWidth: 680, marginLeft: 'auto', marginRight: 'auto', flex: 'none' };
  return (
    <>
      <div style={imgWrapStyle} onClick={onOpen}><ProgressiveImg photo={photo} fit="cover" /></div>
      <div style={textWrapStyle}>
        <div style={TITLE_STYLE}>{photo.title}</div>
        {showMeta && <MetaLine photo={photo} style={META_STYLE} />}
        {showNotes && photo.notes && <div style={NOTES_STYLE}>{photo.notes}</div>}
      </div>
    </>
  );
}

function SingleSide({ photo, showMeta, showNotes, onOpen }) {
  const box = fitBox(photo.ratio, Math.round(CONTENT_W * 0.56), Math.round(CONTENT_H * 0.82));
  const imgWrapStyle = { width: box.w, height: box.h, position: 'relative', overflow: 'hidden', background: 'rgba(20,16,10,0.045)', cursor: 'pointer', flex: 'none' };
  const sideRowStyle = { display: 'flex', flexDirection: 'row', gap: 48, alignItems: 'center', flex: 'none' };
  const sideTextStyle = { flex: 1, textAlign: 'left' };
  return (
    <div style={sideRowStyle}>
      <div style={imgWrapStyle} onClick={onOpen}><ProgressiveImg photo={photo} fit="cover" /></div>
      <div style={sideTextStyle}>
        <div style={TITLE_STYLE}>{photo.title}</div>
        {showMeta && <MetaLine photo={photo} style={META_STYLE} />}
        {showNotes && photo.notes && <div style={NOTES_STYLE}>{photo.notes}</div>}
      </div>
    </div>
  );
}

function TextForward({ photo, showMeta, onOpen }) {
  const box = fitBox(photo.ratio, Math.round(CONTENT_W * 0.3), Math.round(CONTENT_H * 0.47));
  const imgWrapStyle = { width: box.w, height: box.h, position: 'relative', overflow: 'hidden', background: 'rgba(20,16,10,0.045)', cursor: 'pointer', flex: 'none' };
  const tfRowStyle = { display: 'flex', flexDirection: 'row-reverse', gap: 48, alignItems: 'center', flex: 'none' };
  const sideTextStyle = { flex: 1, textAlign: 'left' };
  const tfQuoteStyle = { fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: 24, color: FG, lineHeight: 1.5, marginBottom: 16 };
  return (
    <div style={tfRowStyle}>
      <div style={imgWrapStyle} onClick={onOpen}><ProgressiveImg photo={photo} fit="cover" /></div>
      <div style={sideTextStyle}>
        {photo.notes && <div style={tfQuoteStyle}>{photo.notes}</div>}
        <div style={TITLE_STYLE}>{photo.title}</div>
        {showMeta && <MetaLine photo={photo} style={META_STYLE} />}
      </div>
    </div>
  );
}

// ---------- fullBleedSingle ----------

function FullBleedSingle({ photo, showMeta, showNotes, onOpen }) {
  const fbTitleStyle = { fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: 38, color: '#faf6ef', textShadow: '0 3px 16px rgba(0,0,0,0.35)' };
  const fbMetaStyle = { fontFamily: SANS_FONT, fontSize: 14, letterSpacing: '.06em', color: '#e7e0d2', marginTop: 6, opacity: 0.9 };
  const fbNotesStyle = { fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: 17, color: '#f2ede2', opacity: 0.92, marginTop: 14, lineHeight: 1.55, maxWidth: 520, textShadow: '0 2px 10px rgba(0,0,0,0.3)' };
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'pointer' }} onClick={onOpen}>
        <ProgressiveImg photo={photo} fit="cover" />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,8,6,0) 55%, rgba(10,8,6,0.6) 100%)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '0 44px 34px', textAlign: 'left' }}>
        <div style={fbTitleStyle}>{photo.title}</div>
        {showMeta && <MetaLine photo={photo} style={fbMetaStyle} />}
        {showNotes && photo.notes && <div style={fbNotesStyle}>{photo.notes}</div>}
      </div>
    </>
  );
}

// ---------- grid2x2 ----------

function Grid2x2({ photos, onOpen }) {
  const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 16, width: CONTENT_W, height: Math.round(CONTENT_H * 0.82) };
  const cellStyle = { position: 'relative', overflow: 'hidden', background: 'rgba(20,16,10,0.045)', cursor: 'pointer' };
  const cellScrimStyle = { position: 'absolute', left: 0, right: 0, bottom: 0, height: '46%', background: 'linear-gradient(180deg, rgba(10,8,6,0) 0%, rgba(10,8,6,0.55) 100%)' };
  const cellTitleStyle = { position: 'absolute', left: 14, bottom: 12, fontFamily: SERIF_FONT, fontSize: 18, color: '#faf6ef', textShadow: '0 2px 10px rgba(0,0,0,0.3)' };
  return (
    <div style={gridStyle}>
      {photos.map((p) => (
        <div key={p.id} style={cellStyle} onClick={() => onOpen(p)}>
          <ProgressiveImg photo={p} fit="cover" />
          <div style={cellScrimStyle} />
          <div style={cellTitleStyle}>{p.title}</div>
        </div>
      ))}
    </div>
  );
}

// ---------- diptychText ----------

function DiptychText({ photos, showMeta, onOpen }) {
  const [left, right] = photos;
  const gap = 40;
  const dtBox = fitBox(0.72, Math.round((CONTENT_W - gap) / 2), Math.round(CONTENT_H * 0.72));
  const dtBoxH = dtBox.h;
  const dtColW = dtBox.w;
  const rowStyle = { display: 'flex', flexDirection: 'row', gap, alignItems: 'flex-start', justifyContent: 'center', flex: 'none' };
  const dtColStyle = { width: dtColW, textAlign: 'center' };
  const dtImgStyle = { height: dtBoxH, width: dtColW, flex: 'none', position: 'relative', overflow: 'hidden', background: 'rgba(20,16,10,0.045)', cursor: 'pointer' };
  const dtTitleStyle = { fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: 22, color: FG, lineHeight: 1.3, marginTop: 16 };
  const dtLabelStyle = { fontFamily: SANS_FONT, fontSize: 12, letterSpacing: '.04em', color: MUTED, marginTop: 6 };
  const dtNotesStyle = { fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: 14, color: FG, opacity: 0.75, marginTop: 10, lineHeight: 1.5 };
  return (
    <div style={rowStyle}>
      {[left, right].map((p) => (
        <div key={p.id} style={dtColStyle}>
          <div style={dtImgStyle} onClick={() => onOpen(p)}><ProgressiveImg photo={p} fit="cover" /></div>
          <div style={dtTitleStyle}>{p.title}</div>
          {showMeta && p.place && <div style={dtLabelStyle}>{p.place}</div>}
          {p.notes && <div style={dtNotesStyle}>{p.notes}</div>}
        </div>
      ))}
    </div>
  );
}

// ---------- filmstrip ----------

function Filmstrip({ photos, onOpen }) {
  const filmHeaderStyle = { fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: 26, color: FG, textAlign: 'center', marginBottom: 26, flex: 'none' };
  const gap = 20;
  const thumbSize = Math.min(Math.round(CONTENT_H * 0.62), Math.floor((CONTENT_W - gap * (photos.length - 1)) / photos.length));
  const filmRowStyle = { display: 'flex', justifyContent: 'center', gap, flex: 'none' };
  const thumbStyle = { width: thumbSize, height: thumbSize, position: 'relative', overflow: 'hidden', background: 'rgba(20,16,10,0.045)', cursor: 'pointer' };
  return (
    <>
      <div style={filmHeaderStyle}>Cuaderno de campo</div>
      <div style={filmRowStyle}>
        {photos.map((p) => (
          <div key={p.id} style={thumbStyle} onClick={() => onOpen(p)}>
            <ProgressiveImg photo={p} fit="cover" />
          </div>
        ))}
      </div>
    </>
  );
}

// ---------- centeredMinimal ----------

function CenteredMinimal({ photo, onOpen }) {
  const box = fitBox(photo.ratio, Math.round(CONTENT_W * 0.42), Math.round(CONTENT_H * 0.72));
  const cmImgWrapStyle = { width: box.w, height: box.h, margin: '0 auto', position: 'relative', overflow: 'hidden', background: 'rgba(20,16,10,0.045)', cursor: 'pointer' };
  const cmTitleStyle = { fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: 26, color: FG, textAlign: 'center', marginTop: 24 };
  return (
    <>
      <div style={cmImgWrapStyle} onClick={onOpen}><ProgressiveImg photo={photo} fit="contain" /></div>
      <div style={cmTitleStyle}>{photo.title}</div>
    </>
  );
}

// ---------- letterboxStack ----------

function LetterboxStack({ photos, onOpen }) {
  const gap = 22;
  const captionH = 40;
  const n = photos.length;
  const boxH = Math.min(520, Math.floor((CONTENT_H * 0.92 - (n - 1) * gap - n * captionH) / n));
  const lsColStyle = { display: 'flex', flexDirection: 'column', gap, flex: 'none' };
  const lsFrameStyle = { position: 'relative', width: CONTENT_W, height: boxH, overflow: 'hidden', background: 'rgba(20,16,10,0.045)', cursor: 'pointer' };
  const lsCapStyle = { display: 'flex', justifyContent: 'space-between', padding: '10px 2px 0' };
  const lsTitleStyle = { fontFamily: SERIF_FONT, fontSize: 20, color: FG, margin: 0 };
  const lsMetaStyle = { fontFamily: SANS_FONT, fontSize: 12.5, color: MUTED, letterSpacing: '.02em' };
  return (
    <div style={lsColStyle}>
      {photos.map((p) => (
        <div key={p.id}>
          <div style={lsFrameStyle} onClick={() => onOpen(p)}><ProgressiveImg photo={p} fit="cover" /></div>
          <div style={lsCapStyle}>
            <div style={lsTitleStyle}>{p.title}</div>
            <MetaLine photo={p} style={lsMetaStyle} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- heroWithStrip ----------

function HeroWithStrip({ photos, showMeta, onOpen }) {
  const [hero, ...thumbs] = photos;
  const heroBox = fitBox(hero.ratio, CONTENT_W, Math.round(CONTENT_H * 0.56));
  const hwHeroWrapStyle = { width: heroBox.w, height: heroBox.h, margin: '0 auto', position: 'relative', overflow: 'hidden', background: 'rgba(20,16,10,0.045)', cursor: 'pointer', flex: 'none' };
  const hwTextStyle = { textAlign: 'center', marginTop: 16, marginBottom: 20, flex: 'none' };
  const hwTitleStyle = { fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: 28, color: FG };
  const hwMetaStyle = { fontFamily: SANS_FONT, fontSize: 14, color: MUTED, marginTop: 6, letterSpacing: '.02em' };
  const hwStripStyle = { display: 'flex', gap: 14, width: CONTENT_W, margin: '0 auto', flex: 'none' };
  const hwThumbStyle = { position: 'relative', height: Math.round(CONTENT_H * 0.2), flex: 1, overflow: 'hidden', background: 'rgba(20,16,10,0.045)', cursor: 'pointer' };
  return (
    <>
      <div style={hwHeroWrapStyle} onClick={() => onOpen(hero)}><ProgressiveImg photo={hero} fit="cover" /></div>
      <div style={hwTextStyle}>
        <div style={hwTitleStyle}>{hero.title}</div>
        {showMeta && <MetaLine photo={hero} style={hwMetaStyle} />}
      </div>
      <div style={hwStripStyle}>
        {thumbs.map((t) => (
          <div key={t.id} style={hwThumbStyle} onClick={() => onOpen(t)}><ProgressiveImg photo={t} fit="cover" /></div>
        ))}
      </div>
    </>
  );
}

// ---------- polaroidTrio ----------

function PolaroidTrio({ photos, onOpen }) {
  const rotations = [-4, 3, -2];
  const gap = 30;
  const cardPad = 28;
  const n = photos.length;
  const frameSize = Math.min(Math.round(CONTENT_H * 0.5), Math.floor((CONTENT_W - gap * (n - 1)) / n) - cardPad);
  const ptRowStyle = { display: 'flex', justifyContent: 'center', gap, flex: 'none' };
  const ptFrameStyle = { position: 'relative', width: frameSize, height: frameSize, overflow: 'hidden', background: 'rgba(20,16,10,0.06)', cursor: 'pointer' };
  const ptCapStyle = { fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: 15, color: '#3a332b', textAlign: 'center', marginTop: 10 };
  return (
    <div style={ptRowStyle}>
      {photos.map((p, k) => {
        const ptCardStyle = { background: '#fffdf8', padding: '14px 14px 20px', boxShadow: '0 12px 24px rgba(30,26,18,0.2)', transform: `rotate(${rotations[k % rotations.length]}deg)`, width: frameSize + cardPad };
        return (
          <div key={p.id} style={ptCardStyle}>
            <div style={ptFrameStyle} onClick={() => onOpen(p)}><ProgressiveImg photo={p} fit="cover" /></div>
            <div style={ptCapStyle}>{p.title}</div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- asymmetricPair ----------

function AsymmetricPair({ photos, showMeta, onOpen }) {
  const [big, small] = photos;
  const bigBox = fitBox(big.ratio, Math.round(CONTENT_W * 0.6), Math.round(CONTENT_H * 0.82));
  const smallBox = fitBox(small.ratio, Math.round(CONTENT_W * 0.32), Math.round(CONTENT_H * 0.6));
  const apRowStyle = { display: 'flex', flexDirection: 'row', gap: 40, alignItems: 'flex-end', justifyContent: 'center', flex: 'none' };
  const apBigWrapStyle = { width: bigBox.w, height: bigBox.h, position: 'relative', overflow: 'hidden', background: 'rgba(20,16,10,0.045)', cursor: 'pointer', flex: 'none' };
  const apSmallWrapStyle = { width: smallBox.w, height: smallBox.h, position: 'relative', overflow: 'hidden', background: 'rgba(20,16,10,0.045)', cursor: 'pointer', flex: 'none' };
  const apTitleStyle = { fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: 24, color: FG, marginTop: 14 };
  const apMetaStyle = { fontFamily: SANS_FONT, fontSize: 13, color: MUTED, marginTop: 6, letterSpacing: '.02em' };
  return (
    <div style={apRowStyle}>
      <div>
        <div style={apBigWrapStyle} onClick={() => onOpen(big)}><ProgressiveImg photo={big} fit="cover" /></div>
        <div style={apTitleStyle}>{big.title}</div>
        {showMeta && <MetaLine photo={big} style={apMetaStyle} />}
      </div>
      <div style={{ flex: 'none' }}>
        <div style={apSmallWrapStyle} onClick={() => onOpen(small)}><ProgressiveImg photo={small} fit="cover" /></div>
      </div>
    </div>
  );
}

// ---------- gridOffset3 ----------

function GridOffset3({ photos, onOpen }) {
  const [big, s1, s2] = photos;
  const gap = 20;
  const maxRowH = Math.round(CONTENT_H * 0.82);
  const bigBox = fitBox(big.ratio, Math.round(CONTENT_W * 0.5), maxRowH);
  const smallH = Math.round((bigBox.h - gap) / 2);
  const maxSmallColW = CONTENT_W - bigBox.w - gap;
  const goRowStyle = { display: 'flex', flexDirection: 'row', gap, justifyContent: 'center', flex: 'none' };
  const goBigWrapStyle = { width: bigBox.w, height: bigBox.h, position: 'relative', overflow: 'hidden', background: 'rgba(20,16,10,0.045)', cursor: 'pointer', flex: 'none' };
  const goSmallColStyle = { display: 'flex', flexDirection: 'column', gap, flex: 'none', width: Math.min(Math.round(smallH * s1.ratio), maxSmallColW) };
  const goSmallWrapStyle = { width: '100%', height: smallH, position: 'relative', overflow: 'hidden', background: 'rgba(20,16,10,0.045)', cursor: 'pointer' };
  return (
    <div style={goRowStyle}>
      <div style={goBigWrapStyle} onClick={() => onOpen(big)}><ProgressiveImg photo={big} fit="cover" /></div>
      <div style={goSmallColStyle}>
        <div style={goSmallWrapStyle} onClick={() => onOpen(s1)}><ProgressiveImg photo={s1} fit="cover" /></div>
        <div style={goSmallWrapStyle} onClick={() => onOpen(s2)}><ProgressiveImg photo={s2} fit="cover" /></div>
      </div>
    </div>
  );
}

// ---------- circleFocus ----------

function CircleFocus({ photo, showMeta, onOpen }) {
  const d = Math.min(Math.round(CONTENT_H * 0.6), Math.round(CONTENT_W * 0.55));
  const cfWrapStyle = { width: d, height: d, margin: '0 auto', position: 'relative', overflow: 'hidden', borderRadius: '50%', background: 'rgba(20,16,10,0.045)', cursor: 'pointer', boxShadow: '0 16px 32px rgba(30,26,18,0.18)' };
  const cfTitleStyle = { fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: 26, color: FG, textAlign: 'center', marginTop: 26 };
  const cfMetaStyle = { fontFamily: SANS_FONT, fontSize: 13.5, color: MUTED, textAlign: 'center', marginTop: 6, letterSpacing: '.02em' };
  return (
    <>
      <div style={cfWrapStyle} onClick={onOpen}><ProgressiveImg photo={photo} fit="cover" /></div>
      <div style={cfTitleStyle}>{photo.title}</div>
      {showMeta && <MetaLine photo={photo} style={cfMetaStyle} />}
    </>
  );
}

// ---------- roundedTriptych ----------

function RoundedTriptych({ photos, onOpen }) {
  const gap = 34;
  const n = photos.length;
  const size = Math.min(Math.round(CONTENT_H * 0.55), Math.floor((CONTENT_W - gap * (n - 1)) / n));
  const rtRowStyle = { display: 'flex', justifyContent: 'center', gap, flex: 'none' };
  const rtWrapStyle = { width: size, height: size, position: 'relative', overflow: 'hidden', borderRadius: 18, background: 'rgba(20,16,10,0.045)', cursor: 'pointer' };
  const rtTitleStyle = { fontFamily: SERIF_FONT, fontSize: 17, color: FG, textAlign: 'center', marginTop: 12 };
  return (
    <div style={rtRowStyle}>
      {photos.map((p) => (
        <div key={p.id}>
          <div style={rtWrapStyle} onClick={() => onOpen(p)}><ProgressiveImg photo={p} fit="cover" /></div>
          <div style={rtTitleStyle}>{p.title}</div>
        </div>
      ))}
    </div>
  );
}

// ---------- duo / trio (fila justificada) ----------

function MultiRow({ photos, textLevel, onOpen }) {
  const n = photos.length;
  const baseRowH = Math.round(CONTENT_H * (n === 2 ? 0.62 : 0.42));
  const gap = 22;
  const totalNaturalW = photos.reduce((s, p) => s + baseRowH * p.ratio, 0);
  const totalGap = gap * Math.max(0, photos.length - 1);
  const scale = Math.min(1, (CONTENT_W - totalGap) / totalNaturalW);
  const rowH = Math.round(baseRowH * scale);
  const rowStyle = { display: 'flex', flexWrap: 'nowrap', alignItems: 'flex-start', justifyContent: 'center', gap: `${gap}px`, flex: 'none' };
  const showMeta = textLevel !== 'none';
  const showNotes = textLevel === 'full';
  return (
    <div style={rowStyle}>
      {photos.map((p) => {
        const itemW = Math.round(rowH * p.ratio);
        const itemStyle = { width: itemW, flex: 'none', display: 'flex', flexDirection: 'column', cursor: 'pointer' };
        const frameStyle = { position: 'relative', height: rowH, width: '100%', overflow: 'hidden', background: 'rgba(20,16,10,0.045)' };
        const itemTitleStyle = { fontFamily: SERIF_FONT, fontSize: n === 2 ? 24 : 19, color: FG, margin: 0, lineHeight: 1.25 };
        const itemMetaStyle = { fontFamily: SANS_FONT, fontSize: 12.5, letterSpacing: '.02em', color: MUTED, marginTop: 5 };
        const itemNotesStyle = { fontFamily: SANS_FONT, fontStyle: 'italic', fontSize: 12.5, color: MUTED, marginTop: 6, lineHeight: 1.45 };
        return (
          <div key={p.id} style={itemStyle} onClick={() => onOpen(p)}>
            <div style={frameStyle}><ProgressiveImg photo={p} fit="cover" /></div>
            <div style={{ padding: '10px 2px 0' }}>
              <div style={itemTitleStyle}>{p.title}</div>
              {showMeta && <MetaLine photo={p} style={itemMetaStyle} />}
              {showNotes && p.notes && <div style={itemNotesStyle}>{p.notes}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- despachador de recetas ----------

const RECIPE_COMPONENTS = {
  singleStacked: (page, onOpen) => (
    <SingleStacked photo={page.photos[0]} showMeta={page.textLevel !== 'none'} showNotes={page.textLevel === 'full'} onOpen={() => onOpen(page.photos[0])} />
  ),
  singleSide: (page, onOpen) => (
    <SingleSide photo={page.photos[0]} showMeta={page.textLevel !== 'none'} showNotes={page.textLevel === 'full'} onOpen={() => onOpen(page.photos[0])} />
  ),
  textForward: (page, onOpen) => (
    <TextForward photo={page.photos[0]} showMeta={page.textLevel !== 'none'} onOpen={() => onOpen(page.photos[0])} />
  ),
  fullBleedSingle: (page, onOpen) => (
    <FullBleedSingle photo={page.photos[0]} showMeta={page.textLevel !== 'none'} showNotes={page.textLevel === 'full'} onOpen={() => onOpen(page.photos[0])} />
  ),
  grid2x2: (page, onOpen) => <Grid2x2 photos={page.photos} onOpen={onOpen} />,
  diptychText: (page, onOpen) => <DiptychText photos={page.photos} showMeta={page.textLevel !== 'none'} onOpen={onOpen} />,
  filmstrip: (page, onOpen) => <Filmstrip photos={page.photos} onOpen={onOpen} />,
  centeredMinimal: (page, onOpen) => <CenteredMinimal photo={page.photos[0]} onOpen={() => onOpen(page.photos[0])} />,
  letterboxStack: (page, onOpen) => <LetterboxStack photos={page.photos} onOpen={onOpen} />,
  heroWithStrip: (page, onOpen) => <HeroWithStrip photos={page.photos} showMeta={page.textLevel !== 'none'} onOpen={onOpen} />,
  polaroidTrio: (page, onOpen) => <PolaroidTrio photos={page.photos} onOpen={onOpen} />,
  asymmetricPair: (page, onOpen) => <AsymmetricPair photos={page.photos} showMeta={page.textLevel !== 'none'} onOpen={onOpen} />,
  gridOffset3: (page, onOpen) => <GridOffset3 photos={page.photos} onOpen={onOpen} />,
  circleFocus: (page, onOpen) => <CircleFocus photo={page.photos[0]} showMeta={page.textLevel !== 'none'} onOpen={() => onOpen(page.photos[0])} />,
  roundedTriptych: (page, onOpen) => <RoundedTriptych photos={page.photos} onOpen={onOpen} />,
  duo: (page, onOpen) => <MultiRow photos={page.photos} textLevel={page.textLevel} onOpen={onOpen} />,
  trio: (page, onOpen) => <MultiRow photos={page.photos} textLevel={page.textLevel} onOpen={onOpen} />,
};

function RecipePage({ page, pageIdx, onOpen }) {
  const render = RECIPE_COMPONENTS[page.type];
  if (!render) return null;
  return <PageFrame cardStyle={cardStyleFor(pageIdx)}>{render(page, onOpen)}</PageFrame>;
}

// ---------- App ----------

function App() {
  const [data, setData] = React.useState(window.PORTFOLIO_DATA);
  const [activeIndex, setActiveIndex] = React.useState(null);

  React.useEffect(() => {
    if (data) return;
    window.PORTFOLIO_READY.then(setData);
  }, [data]);

  const allPhotos = React.useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((p) => p.photos);
  }, [data]);

  if (!data) return null;

  const openPhoto = (photo) => setActiveIndex(allPhotos.findIndex((p) => p.id === photo.id));
  const closePhoto = () => setActiveIndex(null);
  const nextPhoto = () => setActiveIndex((i) => (i + 1) % allPhotos.length);
  const prevPhoto = () => setActiveIndex((i) => (i - 1 + allPhotos.length) % allPhotos.length);

  return (
    <div style={{ background: '#e7e2d6', minHeight: '100vh' }}>
      <div style={{ background: '#e7e2d6', padding: '72px 32px 140px' }}>
        <CoverPage photo={data.cover} />
        {data.pages.map((page, pageIdx) => (
          <RecipePage key={pageIdx} page={page} pageIdx={pageIdx} onOpen={openPhoto} />
        ))}
      </div>
      <Lightbox
        allPhotos={allPhotos}
        activeIndex={activeIndex}
        onClose={closePhoto}
        onPrev={prevPhoto}
        onNext={nextPhoto}
        infoStyle={INFO_STYLE}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
