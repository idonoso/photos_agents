// portfolio-data.jsx — carga fotos reales desde fotos.json
// Ordena por puntuacion_total (mayor primero) y mapea al formato PHOTOS.
window.PHOTOS = [];
window.PHOTOS_READY = fetch('../fotos.json')
  .then(r => r.json())
  .then(fotos => {
    const mapped = fotos
      .sort((a, b) => (b.evaluacion?.puntuacion_total || 0) - (a.evaluacion?.puntuacion_total || 0))
      .map(f => ({
        src: 'assets/webp/' + f.path.replace('originales/', '').replace(/\.jpeg$/, '.webp'),
        srcThumb: 'assets/fondo/' + f.path.replace('originales/', '').replace(/\.jpeg$/, '.webp'),
        w: 1920, h: 1280,
        series: f.categorias?.[0] || 'Sin categoría',
        title: f.titulo,
        desc: f.descripcion,
        dom: '#888888',
        meta: {
          aperture: f.datos_toma?.diafragma || '',
          shutter: f.datos_toma?.obturador || '',
          iso: f.datos_toma?.iso ? `ISO ${f.datos_toma.iso}` : '',
          focal: f.datos_toma?.focal || '',
          date: f.fecha
            ? new Date(f.fecha + 'T12:00:00').toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })
            : '',
          location: [f.lugar, f.ubicacion].filter(Boolean).join(', '),
        },
      }));
    window.PHOTOS = mapped;
    return mapped;
  });
