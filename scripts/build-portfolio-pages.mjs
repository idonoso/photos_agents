#!/usr/bin/env node
// build-portfolio-pages.mjs — reparte las fotos de fotos.json entre las 20 recetas
// de maquetación del motor de index.html y escribe portfolio-pages.json.
//
// Uso: node scripts/build-portfolio-pages.mjs [--cover="nombre-archivo.jpeg"] [--min=6.0]
//
// Por defecto se incluyen todas las fotos, sin importar su puntuación (--min=0).
//
// Determinista: mismos datos de entrada + misma portada + mismas páginas fijadas
// ("pinned": true) en el portfolio-pages.json previo ⇒ mismo resultado exacto.
// Las páginas fijadas a mano (ver skill generate-portfolio-pages, Paso 5) se
// respetan tal cual entre regeneraciones; el resto se recalcula desde cero.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const FOTOS_JSON = path.join(ROOT, 'fotos.json');
const OUTPUT_JSON = path.join(ROOT, 'portfolio-pages.json');

// -- Las 20 recetas de layout del motor, en el mismo orden que Portfolio v2.dc.html --
const RECIPES = [
  { type: 'singleStacked', textLevel: 'full', count: 1 },
  { type: 'duo', textLevel: 'meta', count: 2 },
  { type: 'grid2x2', textLevel: 'minimal', count: 4 },
  { type: 'textForward', textLevel: 'full', count: 1 },
  { type: 'trio', textLevel: 'minimal', count: 3 },
  { type: 'fullBleedSingle', textLevel: 'full', count: 1 },
  { type: 'singleSide', textLevel: 'full', count: 1 },
  { type: 'diptychText', textLevel: 'meta', count: 2 },
  { type: 'duo', textLevel: 'full', count: 2 },
  { type: 'filmstrip', textLevel: 'minimal', count: 5 },
  { type: 'singleStacked', textLevel: 'full', count: 1 },
  { type: 'trio', textLevel: 'minimal', count: 3 },
  { type: 'centeredMinimal', textLevel: 'none', count: 1 },
  { type: 'letterboxStack', textLevel: 'minimal', count: 2 },
  { type: 'heroWithStrip', textLevel: 'meta', count: 4 },
  { type: 'polaroidTrio', textLevel: 'minimal', count: 3 },
  { type: 'asymmetricPair', textLevel: 'meta', count: 2 },
  { type: 'gridOffset3', textLevel: 'minimal', count: 3 },
  { type: 'circleFocus', textLevel: 'meta', count: 1 },
  { type: 'roundedTriptych', textLevel: 'minimal', count: 3 },
];

// Receta hermana para cuando al final del ciclo sobran menos fotos de las
// que pide la receta nominal — nunca se deja una página con huecos.
const FALLBACK_BY_COUNT = {
  1: { type: 'singleStacked', textLevel: 'full' },
  2: { type: 'duo', textLevel: 'meta' },
  3: { type: 'trio', textLevel: 'minimal' },
  4: { type: 'grid2x2', textLevel: 'minimal' },
};

// Tipos cuyo componente React del motor destructura posicionalmente
// (photos[0], [left, right] = photos, etc.) y puede crashear si el
// número de fotos de una página fijada no coincide.
const EXACT_COUNT_BY_TYPE = {
  singleStacked: 1,
  singleSide: 1,
  textForward: 1,
  fullBleedSingle: 1,
  centeredMinimal: 1,
  circleFocus: 1,
  diptychText: 2,
  asymmetricPair: 2,
  gridOffset3: 3,
};
// Tipos que solo exigen un mínimo (el resto se reparte con .map()/rest).
const MIN_COUNT_BY_TYPE = { heroWithStrip: 1 };

function ratioOf(f) {
  const [w, h] = (f.dimensiones || '1x1').split('x').map(Number);
  return w && h ? w / h : 1;
}

function formatDate(fecha) {
  if (!fecha) return '';
  return new Date(fecha + 'T12:00:00').toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function mapPhoto(f) {
  const base = f.path.replace(/^originales\//, '').replace(/\.[^.]+$/, '');
  return {
    id: f.nombre,
    title: f.titulo,
    place: [f.lugar, f.ubicacion].filter(Boolean).join(', '),
    date: formatDate(f.fecha),
    notes: f.descripcion || '',
    ratio: ratioOf(f),
    aperture: (f.datos_toma?.diafragma || '').replace(/^f\//, ''),
    shutter: (f.datos_toma?.obturador || '').replace(/s$/, ''),
    focal: (f.datos_toma?.focal || '').replace(/mm$/, ''),
    iso: f.datos_toma?.iso ?? '',
    score: f.evaluacion?.puntuacion_total ?? 0,
    src: `assets/webp/${base}.webp`,
    srcBlur: `assets/fondo/${base}.webp`,
  };
}

function parseArgs(argv) {
  const args = {};
  for (const arg of argv) {
    const m = arg.match(/^--([^=]+)=(.*)$/);
    if (m) args[m[1]] = m[2];
  }
  return args;
}

// Lee el portfolio-pages.json existente (si lo hay) y extrae las páginas
// marcadas "pinned": true, validándolas contra el fotos.json actual.
// No falla nunca: si el archivo no existe o está corrupto, se comporta
// como si no hubiera páginas fijadas (arranque desde cero, igual que hoy).
function readPinnedPages(fotosByNombre) {
  let existing;
  try {
    existing = JSON.parse(readFileSync(OUTPUT_JSON, 'utf-8'));
  } catch {
    return { pins: [], warnings: [] };
  }

  const rawPages = Array.isArray(existing.pages) ? existing.pages : [];
  const warnings = [];
  const pins = [];

  rawPages.forEach((page, fileIdx) => {
    if (page.pinned !== true) return;

    let position;
    if (Number.isInteger(page.position) && page.position >= 0) {
      position = page.position;
    } else {
      if (page.position !== undefined) {
        warnings.push(
          `Página fijada (índice de archivo ${fileIdx}): "position" inválida (${JSON.stringify(page.position)}); se usa ${fileIdx}.`
        );
      }
      position = fileIdx;
    }

    const ids = (page.photos || []).map((p) => p.id);
    const survivingIds = ids.filter((id) => fotosByNombre.has(id));
    const missingIds = ids.filter((id) => !fotosByNombre.has(id));
    if (missingIds.length) {
      warnings.push(
        `Página fijada (posición pedida ${position}): fotos ya inexistentes en fotos.json: ${missingIds.join(', ')} — se retiran.`
      );
    }
    if (survivingIds.length === 0) {
      warnings.push(
        `Página fijada (posición pedida ${position}): sin fotos válidas — se descarta el pin, la página se auto-generará de nuevo.`
      );
      return;
    }

    const exact = EXACT_COUNT_BY_TYPE[page.type];
    const min = MIN_COUNT_BY_TYPE[page.type];
    if (exact !== undefined && survivingIds.length !== exact) {
      warnings.push(
        `Página fijada (posición ${position}, tipo "${page.type}"): espera ${exact} foto(s) exactas, tiene ${survivingIds.length} — puede romper el render.`
      );
    } else if (min !== undefined && survivingIds.length < min) {
      warnings.push(
        `Página fijada (posición ${position}, tipo "${page.type}"): necesita al menos ${min} foto(s), tiene ${survivingIds.length} — puede romper el render.`
      );
    }

    pins.push({
      requestedPosition: position,
      originalFileIdx: fileIdx,
      type: page.type,
      textLevel: page.textLevel,
      photoIds: survivingIds,
    });
  });

  const idCount = new Map();
  for (const pin of pins) {
    for (const id of pin.photoIds) idCount.set(id, (idCount.get(id) || 0) + 1);
  }
  for (const [id, count] of idCount) {
    if (count > 1) {
      warnings.push(
        `Aviso: la foto "${id}" está pinneada en ${count} páginas distintas — aparecerá duplicada. Revísalo a mano.`
      );
    }
  }

  return { pins, warnings };
}

// Reconstruye el array final de páginas intercalando las fijadas (en su
// "position" guardada) con páginas auto-generadas repartidas cíclicamente
// sobre RECIPES. El contador de recetas avanza de forma continua e
// independiente de los huecos que dejan los pins, para no perder la
// variedad visual del ciclo original.
function assemblePages({ pins, queue, fotosByNombre }) {
  const byPosition = new Map();
  const pending = [];

  const sorted = [...pins].sort(
    (a, b) => a.requestedPosition - b.requestedPosition || a.originalFileIdx - b.originalFileIdx
  );
  for (const pin of sorted) {
    if (byPosition.has(pin.requestedPosition)) pending.push(pin);
    else byPosition.set(pin.requestedPosition, pin);
  }

  const toPage = (pin, position) => ({
    pinned: true,
    position,
    type: pin.type,
    textLevel: pin.textLevel,
    photos: pin.photoIds.map((id) => mapPhoto(fotosByNombre.get(id))),
  });

  const pages = [];
  const reclassified = [];
  const relocations = [];
  let recipeCounter = 0;
  let index = 0;

  while (queue.length > 0 || byPosition.has(index)) {
    if (byPosition.has(index)) {
      pages.push(toPage(byPosition.get(index), index));
      byPosition.delete(index);
    } else {
      const recipe = RECIPES[recipeCounter % RECIPES.length];
      const photos = queue.splice(0, recipe.count);

      let type = recipe.type;
      let textLevel = recipe.textLevel;
      if (photos.length < recipe.count) {
        const fallback = FALLBACK_BY_COUNT[photos.length];
        if (fallback && fallback.type !== recipe.type) {
          reclassified.push({ pageIdx: index, from: recipe.type, to: fallback.type, count: photos.length });
          type = fallback.type;
          textLevel = fallback.textLevel;
        }
      }

      pages.push({ type, textLevel, photos });
      recipeCounter++;
    }
    index++;
  }

  // -- Pins que colisionaron o cuya "position" nunca se alcanzó -- se añaden al final --
  const collisionSet = new Set(pending);
  const leftover = [...byPosition.values(), ...pending].sort(
    (a, b) => a.requestedPosition - b.requestedPosition || a.originalFileIdx - b.originalFileIdx
  );
  for (const pin of leftover) {
    const finalPosition = pages.length;
    const reason = collisionSet.has(pin) ? 'colisión de posición' : 'posición fuera de rango';
    relocations.push({ type: pin.type, from: pin.requestedPosition, to: finalPosition, reason });
    pages.push(toPage(pin, finalPosition));
  }

  return { pages, reclassified, relocations };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const minScore = args.min ? Number(args.min) : 0;

  const fotos = JSON.parse(readFileSync(FOTOS_JSON, 'utf-8'));
  const fotosByNombre = new Map(fotos.map((f) => [f.nombre, f]));

  const { pins, warnings: pinWarnings } = readPinnedPages(fotosByNombre);
  const pinnedIds = new Set(pins.flatMap((p) => p.photoIds));

  // Se conserva el orden en que aparecen en fotos.json — no se reordena por puntuación.
  // Las fotos pinneadas quedan excluidas del pool auto-asignable (y de la portada),
  // aunque su puntuación esté por debajo de minScore.
  let eligible = fotos.filter(
    (f) => (f.evaluacion?.puntuacion_total ?? 0) >= minScore && !pinnedIds.has(f.nombre)
  );

  if (eligible.length < 2) {
    console.error(
      `Solo hay ${eligible.length} foto(s) con puntuacion_total >= ${minScore} sin pinnear. Hacen falta al menos 2 (portada + contenido).`
    );
    process.exit(1);
  }

  // -- Elegir portada --
  let coverSource;
  if (args.cover) {
    if (pinnedIds.has(args.cover)) {
      console.error(`"${args.cover}" está pinneada en una página; quita el pin o elige otra portada.`);
      process.exit(1);
    }
    const idx = eligible.findIndex((f) => f.nombre === args.cover);
    if (idx === -1) {
      console.error(`No se encontró ninguna foto elegible con nombre "${args.cover}".`);
      process.exit(1);
    }
    coverSource = eligible.splice(idx, 1)[0];
  } else {
    // Por defecto, la foto con mayor puntuación (sin reordenar el resto de la cola).
    const bestIdx = eligible.reduce(
      (best, f, i) => ((f.evaluacion?.puntuacion_total ?? 0) > (eligible[best].evaluacion?.puntuacion_total ?? 0) ? i : best),
      0
    );
    coverSource = eligible.splice(bestIdx, 1)[0];
  }
  const cover = mapPhoto(coverSource);

  // -- Repartir el resto en las 20 recetas, cíclicamente, intercalando páginas fijadas --
  const queue = eligible.map(mapPhoto);
  const { pages, reclassified, relocations } = assemblePages({ pins, queue, fotosByNombre });

  // -- Índice global (para el lightbox) — siempre derivado, nunca persistido --
  let globalIndex = 0;
  for (const page of pages) {
    for (const photo of page.photos) {
      photo.globalIndex = globalIndex++;
    }
  }

  const totalEligible = pages.reduce((sum, p) => sum + p.photos.length, 0) + 1;

  const output = {
    generated_at: new Date().toISOString(),
    min_score: minScore,
    total_eligible: totalEligible,
    cover,
    pages,
  };

  writeFileSync(OUTPUT_JSON, JSON.stringify(output, null, 2) + '\n');

  console.log(`Portada: ${cover.title} (${coverSource.nombre})`);
  console.log(`Páginas generadas: ${pages.length} (+ portada)`);
  console.log(`Fotos totales usadas: ${output.total_eligible}`);
  if (pins.length) {
    console.log(`Páginas fijadas ("pinned") respetadas: ${pins.length}`);
  }
  if (reclassified.length) {
    console.log('\nPáginas reclasificadas por falta de material al final del ciclo:');
    for (const r of reclassified) {
      console.log(`  - página ${r.pageIdx}: ${r.from} → ${r.to} (${r.count} foto${r.count === 1 ? '' : 's'})`);
    }
  }
  if (relocations.length) {
    console.log('\nPáginas fijadas reubicadas (colisión o posición fuera de rango):');
    for (const r of relocations) {
      console.log(`  - tipo "${r.type}": posición pedida ${r.from} → posición final ${r.to} (${r.reason})`);
    }
  }
  if (pinWarnings.length) {
    console.log('\nAvisos sobre páginas fijadas:');
    for (const w of pinWarnings) {
      console.log(`  - ${w}`);
    }
  }
  console.log(`\nEscrito en ${OUTPUT_JSON}`);
}

main();
