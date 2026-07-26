// portfolio-lightbox.jsx — visor a pantalla completa: navegación, teclado, swipe,
// y 3 modos de info (overlay / panel / tap-reveal). Traducción del bloque
// sc-if="{{ isOpen }}" de Portafolio de fotografía personal/Portfolio v2.dc.html.
const LB_FG = '#f5f2ec';
const LB_MUTED = '#cfc9be';
const SANS_FONT = "'Work Sans', sans-serif";
const SERIF_FONT = "'Playfair Display', serif";

const LB_STYLES = {
  backdropStyle: { position: 'fixed', inset: 0, background: 'rgba(5,5,5,0.97)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'lbFadeIn .2s ease' },
  closeBtnStyle: { position: 'absolute', top: 22, right: 26, width: 40, height: 40, border: 'none', background: 'transparent', color: LB_FG, fontSize: 30, lineHeight: 1, cursor: 'pointer', zIndex: 5 },
  arrowLeftStyle: { position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, border: 'none', background: 'transparent', color: LB_FG, fontSize: 40, cursor: 'pointer', zIndex: 5, opacity: 0.75 },
  arrowRightStyle: { position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, border: 'none', background: 'transparent', color: LB_FG, fontSize: 40, cursor: 'pointer', zIndex: 5, opacity: 0.75 },
  imageWrapStyle: { width: '86vw', height: '82vh', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'lbZoomIn .25s ease' },
  overlayInfoStyle: { position: 'absolute', left: 28, bottom: 26, maxWidth: 420, padding: '16px 20px', background: 'rgba(0,0,0,0.6)', borderRadius: 6, backdropFilter: 'blur(3px)' },
  lbTitleStyle: { fontFamily: SERIF_FONT, fontSize: 22, color: '#f5f2ec', marginBottom: 4 },
  lbMetaStyle: { fontFamily: SANS_FONT, fontSize: 14, color: '#cfc9be', letterSpacing: '.02em' },
  lbNotesStyle: { fontFamily: SANS_FONT, fontStyle: 'italic', fontSize: 14, color: '#cfc9be', marginTop: 8, lineHeight: 1.4 },
  exifRowStyle: { fontFamily: SANS_FONT, fontSize: 13, color: '#cfc9be', marginTop: 5, letterSpacing: '.03em' },
  exifLabelStyle: { fontFamily: SANS_FONT, fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', color: LB_MUTED, marginTop: 14, marginBottom: 6, opacity: 0.7 },
  panelDividerStyle: { height: 1, background: 'rgba(255,255,255,0.12)', margin: '14px 0 0' },
  panelStyle: { position: 'absolute', top: 0, right: 0, height: '100%', width: 300, background: 'rgba(8,8,8,0.88)', padding: '32px 26px', boxSizing: 'border-box', overflowY: 'auto' },
  tapHintStyle: { position: 'absolute', left: 20, bottom: 20, width: 30, height: 30, borderRadius: '50%', border: '1px solid ' + LB_MUTED, color: LB_FG, fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0.85 },
  counterStyle: { position: 'absolute', top: 26, left: 28, fontFamily: SANS_FONT, fontSize: 11, letterSpacing: '.08em', color: LB_MUTED },
};

function Lightbox({ allPhotos, activeIndex, onClose, onPrev, onNext, infoStyle }) {
  const [infoVisible, setInfoVisible] = React.useState(true);
  const touchXRef = React.useRef(null);
  const isOpen = activeIndex != null;
  const photo = isOpen ? allPhotos[activeIndex] : null;

  React.useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  React.useEffect(() => {
    setInfoVisible(true);
  }, [activeIndex]);

  if (!isOpen) return null;

  const stop = (e) => e.stopPropagation();
  const handleImageClick = (e) => {
    stop(e);
    if (infoStyle === 'tap-reveal') setInfoVisible((v) => !v);
  };
  const handleTouchStart = (e) => { touchXRef.current = e.changedTouches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchXRef.current == null) return;
    const dx = e.changedTouches[0].clientX - touchXRef.current;
    if (Math.abs(dx) > 50) (dx > 0 ? onPrev : onNext)();
  };

  const InfoOverlay = () => (
    <div style={LB_STYLES.overlayInfoStyle} onClick={stop}>
      <div style={LB_STYLES.lbTitleStyle}>{photo.title}</div>
      <div style={LB_STYLES.lbMetaStyle}>{[photo.place, photo.date].filter(Boolean).join(' · ')}</div>
      {photo.notes && <div style={LB_STYLES.lbNotesStyle}>{photo.notes}</div>}
      <div style={LB_STYLES.exifRowStyle}>
        {photo.aperture && <>ƒ/{photo.aperture} &nbsp;·&nbsp; </>}
        {photo.shutter && <>{photo.shutter}s &nbsp;·&nbsp; </>}
        {photo.focal && <>{photo.focal}mm &nbsp;·&nbsp; </>}
        {photo.iso !== '' && <>ISO {photo.iso}</>}
      </div>
    </div>
  );

  return (
    <div
      style={LB_STYLES.backdropStyle}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button style={LB_STYLES.closeBtnStyle} onClick={(e) => { stop(e); onClose(); }} aria-label="Cerrar">&times;</button>
      <button style={LB_STYLES.arrowLeftStyle} onClick={(e) => { stop(e); onPrev(); }} aria-label="Anterior">&#8249;</button>
      <button style={LB_STYLES.arrowRightStyle} onClick={(e) => { stop(e); onNext(); }} aria-label="Siguiente">&#8250;</button>

      <div style={LB_STYLES.imageWrapStyle} onClick={handleImageClick}>
        <img
          src={photo.src}
          alt={photo.title}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
        />
      </div>

      {infoStyle === 'overlay' && <InfoOverlay />}

      {infoStyle === 'tap-reveal' && infoVisible && <InfoOverlay />}
      {infoStyle === 'tap-reveal' && !infoVisible && (
        <div style={LB_STYLES.tapHintStyle} onClick={stop}>i</div>
      )}

      {infoStyle === 'panel' && (
        <div style={LB_STYLES.panelStyle} onClick={stop}>
          <div style={LB_STYLES.lbTitleStyle}>{photo.title}</div>
          <div style={LB_STYLES.lbMetaStyle}>{[photo.place, photo.date].filter(Boolean).join(' · ')}</div>
          {photo.notes && <div style={LB_STYLES.lbNotesStyle}>{photo.notes}</div>}
          <div style={LB_STYLES.panelDividerStyle} />
          <div style={LB_STYLES.exifLabelStyle}>Datos técnicos</div>
          {photo.aperture && <div style={LB_STYLES.exifRowStyle}>Apertura&nbsp;&nbsp;ƒ/{photo.aperture}</div>}
          {photo.shutter && <div style={LB_STYLES.exifRowStyle}>Velocidad&nbsp;&nbsp;{photo.shutter}s</div>}
          {photo.focal && <div style={LB_STYLES.exifRowStyle}>Focal&nbsp;&nbsp;{photo.focal}mm</div>}
          {photo.iso !== '' && <div style={LB_STYLES.exifRowStyle}>ISO&nbsp;&nbsp;{photo.iso}</div>}
        </div>
      )}

      <div style={LB_STYLES.counterStyle}>{activeIndex + 1} / {allPhotos.length}</div>
    </div>
  );
}

window.Lightbox = Lightbox;
