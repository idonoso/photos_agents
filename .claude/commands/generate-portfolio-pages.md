# Skill: Generación de páginas del portfolio

Cuando el usuario invoque este comando (por ejemplo: "genera las páginas del portfolio", "regenera portfolio-pages", "actualiza el portfolio", "reordena las páginas de la web", "rehaz el índice con las fotos nuevas"), sigue estos pasos exactamente.

## Rutas base

- **Proyecto**: `/Users/ignacio/Sites/fotos/`
- **JSON de metadatos**: `/Users/ignacio/Sites/fotos/fotos.json`
- **Script generador**: `/Users/ignacio/Sites/fotos/scripts/build-portfolio-pages.mjs`
- **Salida horneada**: `/Users/ignacio/Sites/fotos/portfolio-pages.json`
- **Assets WebP**: `/Users/ignacio/Sites/fotos/assets/webp/` y `/Users/ignacio/Sites/fotos/assets/fondo/`

## Qué hace este comando

Reparte todas las fotos del portfolio (sin filtro de puntuación mínima — da igual la nota) entre las 20 recetas de maquetación del motor de `index.html`, y escribe el resultado en `portfolio-pages.json`. El navegador no vuelve a calcular este reparto — lo consume ya resuelto.

Si en `portfolio-pages.json` ya existen páginas marcadas como `"pinned": true` (ajustadas a mano en una ejecución anterior — ver Paso 5), el script las respeta tal cual: mismo tipo de receta, mismas fotos y misma posición. Solo las páginas NO fijadas se recalculan libremente cada vez.

## Paso 1: Verificar que hay fotos elegibles

1. Lee `/Users/ignacio/Sites/fotos/fotos.json`.
2. Todas las fotos con `evaluacion.puntuacion_total` son elegibles (no hay umbral mínimo).
3. Si hay menos de 2 fotos elegibles, informa al usuario y detente: no hay suficiente material para portada + páginas.

## Paso 2: Comprobar que existen los WebP

1. Para cada foto elegible, deriva el nombre base a partir de `path` (ej. `originales/2400.jpeg` → `2400`).
2. Comprueba si existe `assets/webp/<nombre>.webp`.
3. Si faltan uno o más, informa al usuario cuántos faltan y pregunta con AskUserQuestion si quiere que se genere ahora invocando el skill **generate-web-assets** antes de continuar, o seguir de todas formas (las páginas se generarán igual, pero el `index.html` mostrará huecos hasta que existan los WebP).

## Paso 3: Elegir la foto de portada

1. Por defecto, la portada es la foto elegible con mayor `puntuacion_total` (empate → la de ratio más cercano a 1.6, empate → la más reciente).
2. Pregunta al usuario con AskUserQuestion, mostrando la foto propuesta (título + puntuación): **"¿Uso esta foto como portada del portfolio?"** con opciones "Sí, usar esta" / "Elegir otra" (si elige otra, lista las 5 fotos con mayor puntuación como opciones).
3. Guarda el nombre de archivo elegido (campo `nombre`) — se pasará como argumento al script (`--cover=<nombre>`).

## Paso 4: Ejecutar el script generador

```bash
node /Users/ignacio/Sites/fotos/scripts/build-portfolio-pages.mjs --cover="<nombre_elegido>"
```

El script:
- Antes de repartir, lee las páginas marcadas `"pinned": true` en el `portfolio-pages.json` existente (si lo hay) y reserva su `position` y sus fotos; esas fotos quedan excluidas del reparto automático y de la selección de portada (no se duplican), incluso si su puntuación está por debajo del `--min` actual.
- Si alguna foto fijada ya no existe en `fotos.json`, o si una página fijada usa un tipo de receta que exige un número exacto de fotos y no lo cumple, el script avisa por consola para que lo revises antes de publicar.
- Incluye todas las demás fotos (sin filtro de puntuación mínima), conservando el orden en que aparecen en `fotos.json` (no se reordena por puntuación).
- Extrae la foto de portada indicada (o la de mayor puntuación si no se pasa `--cover`), sin reordenar el resto de la cola.
- Recorre las 20 recetas en bucle (`recipes[pageIdx % recipes.length]`), repartiendo las fotos de la cola en orden secuencial — no se busca la receta "ideal" según el tamaño/ratio de cada foto ni de cada grupo. Las páginas fijadas se intercalan en su `position` guardada sin afectar a este ciclo (el contador de recetas avanza igual para las páginas automáticas, ignorando los huecos que dejan las fijadas).
- Si al final del ciclo sobran menos fotos de las que pide una receta, usa todas las que queden; si el recuento final queda muy por debajo del nominal de la receta, la reclasifica a la receta hermana de ese tamaño exacto (1→singleStacked, 2→duo, 3→trio, 4→grid2x2) — esto es solo para no dejar una página sin fotos suficientes para renderizar, no una optimización de encaje.
- Escribe `/Users/ignacio/Sites/fotos/portfolio-pages.json` con indentación de 2 espacios.

Es determinista: mismos datos de entrada, misma portada y mismas páginas fijadas en la salida previa ⇒ mismo resultado exacto, ejecútalo las veces que haga falta.

## Paso 5: Revisar el resultado

1. Lee el `portfolio-pages.json` generado.
2. Muestra al usuario una tabla resumen, incluyendo la columna `position` (el índice de la página dentro del array `pages`, SIN contar la portada — para evitar el desfase de +1 con la columna "#"):

   | # | position | Receta | Fotos | Título(s) | Fijada |
   |---|----------|--------|-------|-----------|--------|
   | 0 | — | cover | 1 | Gaviota cazando al vuelo | — |
   | 1 | 0 | singleStacked | 1 | ... | |
   | 2 | 1 | grid2x2 | 4 | ..., ..., ..., ... | 📌 |

3. Señala explícitamente cualquier página cuyo nº de fotos sea menor que el nominal de su receta (el propio script las lista en su salida por consola bajo "Páginas reclasificadas"), así como cualquier aviso de consola sobre páginas fijadas (fotos ya inexistentes, conteo incorrecto de receta, colisiones de posición, duplicados).
4. Pregunta con AskUserQuestion si el usuario quiere ajustar manualmente alguna página (cambiar el orden, mover una foto de una página a otra, cambiar el tipo de receta de una página concreta). Si acepta cambios:
   - Edita `portfolio-pages.json` directamente con Read + Edit, respetando la estructura de cada página: `{type, textLevel, photos: [...]}`, cada foto con `id, title, place, date, notes, ratio, aperture, shutter, focal, iso, score, src, srcBlur, globalIndex`.
   - **Añade además `"pinned": true` y `"position": <N>`** a esa página, donde `<N>` es el valor de la columna `position` de la tabla (no la columna "#", que cuenta la portada como fila 0).
   - Esto es lo que hace que la página sobreviva intacta la próxima vez que se regenere el portfolio: el script detecta `"pinned": true`, respeta su `type`, sus fotos y su `position`, y reparte el resto de páginas a su alrededor. Los metadatos de cada foto (título, notas, rutas, puntuación...) se refrescan siempre desde `fotos.json` en cada regeneración — lo único "congelado" es qué fotos van en esa página, con qué receta y en qué posición.
   - Si el tipo de receta elegido exige un número exacto de fotos (`singleStacked`, `singleSide`, `textForward`, `fullBleedSingle`, `centeredMinimal`, `circleFocus`: 1 foto; `diptychText`, `asymmetricPair`: 2 fotos; `gridOffset3`: 3 fotos; `heroWithStrip`: al menos 1) y el número de fotos de la página no coincide, avisa explícitamente al usuario de que puede romper el renderizado.
   - Para "despinnear" una página (que vuelva a auto-generarse en la siguiente regeneración), basta con quitarle `"pinned"` (o ponerlo `false`) y volver a ejecutar el script.

## Paso 6: Confirmar assets pendientes

Si en el Paso 2 quedaron WebP pendientes de generar y el usuario no los generó entonces, recuérdaselo ahora: "Recuerda ejecutar generate-web-assets antes de publicar — faltan N imágenes en assets/webp/."

## Notas importantes

- Nunca escribas `portfolio-pages.json` a mano ni le pidas a Claude que reparta fotos página por página "a ojo" — el reparto lo hace el script para que sea reproducible; el criterio humano se aplica solo en el Paso 3 (portada) y el Paso 5 (ajustes puntuales, marcados con `pinned`).
- El script nunca debe dejar una página sin fotos ni con menos fotos de las que su plantilla React necesita para renderizar sin errores — si `photos.length` es menor que el nominal de la receta, el propio script la reclasifica, no la deja tal cual (esto no aplica a páginas fijadas: esas se avisan por consola, pero no se corrigen solas).
- Las rutas `src`/`srcBlur` en `portfolio-pages.json` son relativas a la raíz del repo (`assets/webp/...`), igual que las usa `index.html`.
- Si `fotos.json` cambia (nuevas fotos evaluadas, cambios de puntuación), vuelve a ejecutar este skill completo. Las páginas normales (sin `"pinned": true`) se recalculan siempre desde cero, igual que antes; las páginas fijadas a mano en un Paso 5 anterior se conservan tal cual, en la misma posición, con el mismo tipo y las mismas fotos.
- Si una foto de una página fijada ya no existe en `fotos.json` (se borró o renombró), el script la retira de esa página y avisa por consola; si la página se queda sin ninguna foto válida, se descarta el pin entero y vuelve a auto-generarse.
- Si el usuario acaba de ejecutar `evaluate-photos` y evaluó fotos nuevas, sugiérele ejecutar este skill a continuación para que el portfolio las incluya.
