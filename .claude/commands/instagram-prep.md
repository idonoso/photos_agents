# Skill: Preparación de fotos para Instagram

Cuando el usuario invoque este comando (por ejemplo: "prepara para instagram", "instagram esta foto", "exportar a instagram", "preparar instagram", "hashtags para", "qué formato instagram", "prepara la foto para redes"), sigue estos pasos exactamente.

## Rutas base

- **Proyecto**: `/Users/ignacio/Sites/fotos/`
- **Pendientes**: `/Users/ignacio/Sites/fotos/pendientes/`
- **Originales**: `/Users/ignacio/Sites/fotos/originales/`
- **JSON de metadatos**: `/Users/ignacio/Sites/fotos/fotos.json`
- **Galería de Instagram (HTML del proyecto)**: `/Users/ignacio/Sites/fotos/instagram/index.html`
- **Previsualizaciones persistentes**: `/Users/ignacio/Sites/fotos/instagram/previews/`

## Paso 0: Selección de foto

1. Lista los archivos de imagen en ambas carpetas:
   ```bash
   ls /Users/ignacio/Sites/fotos/originales/
   ls /Users/ignacio/Sites/fotos/pendientes/
   ```

2. Lee `/Users/ignacio/Sites/fotos/fotos.json` para cruzar nombres de archivo con sus títulos.

3. Si el usuario ya indicó la foto al invocar el skill (ej: "prepara para instagram DSC_2400.jpeg"), busca ese archivo en `originales/` primero y luego en `pendientes/`. Si lo encuentras, pasa directamente al Paso 1.

4. Si no hay nombre explícito, pregunta con AskUserQuestion mostrando una lista combinada:
   - Fotos de `originales/` con su título del JSON si lo tienen (ej: "2400.jpeg — Desde su trono de granito")
   - Fotos de `pendientes/` marcadas como "(pendiente, sin evaluar)"

5. Si la foto seleccionada está en `pendientes/`, informa al usuario: "Esta foto aún no tiene evaluación en el portfolio. Puedes prepararla para Instagram igualmente — recuerda evaluarla después con el comando `evaluate-photos`."

## Paso 1: Análisis visual de la foto

Usa la herramienta **Read** para leer el archivo de imagen directamente desde su ruta. Claude es multimodal y analiza imágenes visualmente.

Analiza la foto en tres dimensiones:

### A. Composición y formato
- Orientación actual: retrato, cuadrado o paisaje
- Posición del sujeto principal en el encuadre (centrado, tercio superior, lateral, etc.)
- Espacios en los bordes aprovechables o prescindibles
- Si hay elementos de interés en los extremos que se perderían con ciertos recortes

### B. Contenido para hashtags
- Sujeto principal y secundarios (especie de ave, tipo de fauna, tipo de paisaje, etc.)
- Entorno o ambiente (naturaleza, urbano, agua, bosque, etc.)
- Condiciones de luz (hora dorada, mediodía, contraluz, nublado, nocturna)
- Técnicas fotográficas visibles (bokeh pronunciado, barrido, larga exposición, macro, teleobjetivo)
- Colores dominantes
- Emoción o atmósfera predominante (calma, dinamismo, intimidad, drama, etc.)

### C. Técnica para ajustes
Evalúa visualmente si la foto necesita ajustes antes de publicar en Instagram:
- **Brillo**: Instagram se ve en pantallas de móvil que tienden a sobreexponer — fotos oscuras deben subirse ligeramente
- **Contraste**: Instagram comprime JPEG y aplana el contraste — fotos de bajo contraste quedan planas
- **Saturación**: colores muy apagados o demasiado saturados
- **Nitidez**: Instagram aplica compresión — fotos ligeramente sobreagudizadas aguantan mejor

## Paso 2: Cruce con fotos.json

El JSON ya está leído del paso anterior. Busca la entrada de la foto por nombre de archivo.

Si existe, extrae:
- `categorias` y `etiquetas` — base para hashtags
- `titulo` y `descripcion` — base para el caption
- `lugar` y `ubicacion` — para hashtags de localización
- `datos_toma.camara` y `datos_toma.focal` — para hashtags de equipo y técnica
- `evaluacion.puntuacion_total` — referencia interna, no se incluye en Instagram

Si la foto no está en el JSON, los hashtags y caption se generan únicamente del análisis visual.

## Paso 3: Preguntas interactivas

Usa **dos** AskUserQuestion (tres si la foto está en el JSON):

### AskUserQuestion 1 — Formato y destino de exportación

Dos preguntas en un solo bloque:

1. "¿A qué formato quieres exportar para Instagram?"
   - "4:5 Retrato (1080×1350) — máxima presencia en el feed (Recomendado)"
   - "1:1 Cuadrado (1080×1080) — formato clásico"
   - "1.91:1 Paisaje (1080×566) — para panorámicas"
   - "9:16 Stories/Reels (1080×1920)"
   - "Recomiéndame tú el óptimo"

2. "¿Dónde guardar el archivo exportado?"
   - "Escritorio (/Users/ignacio/Desktop/)"
   - "Descargas (/Users/ignacio/Downloads/)"
   - "En la misma carpeta que el original"
   - "Introducir ruta manualmente"

Si el usuario elige "Recomiéndame tú el óptimo", aplica las reglas del Paso 4 y muestra la recomendación con su justificación antes de continuar.

### AskUserQuestion 2 — Idioma y contexto del caption

Tres preguntas en un solo bloque:

1. "¿En qué idioma quieres el caption?"
   - "Español"
   - "Inglés"
   - "Ambos (español primero, inglés después)"

2. "¿Tienes ya alguna idea o frase para el pie de foto?"
   - "No, genéralo tú"
   - "Sí" — si el usuario elige esta opción, pide que escriba su idea en texto libre

3. "¿Incluir hashtags de ubicación?"
   - "Sí (Madrid, España, etc.)"
   - "Solo internacionales"
   - "No"

### AskUserQuestion 3 — Guardar en fotos.json (solo si la foto tiene entrada en el JSON)

Una sola pregunta: "¿Quieres guardar los datos de Instagram en tu portfolio (fotos.json)?"
- "Sí, guardar"
- "No, solo mostrar"

## Paso 4: Recomendación de formato

Si el usuario eligió "Recomiéndame tú el óptimo" (o para confirmar internamente el formato más adecuado), aplica estas reglas de decisión:

| Tipo de foto | Formato recomendado |
|---|---|
| Aves o fauna con sujeto centrado y bokeh de fondo | 4:5 retrato (o 1:1 si el sujeto llena el encuadre) |
| Fauna mirando a un lado con espacio de dirección | 4:5 retrato |
| Paisaje muy horizontal con horizonte amplio | 1.91:1 (o 4:5 si el cielo o primer plano protagonizan) |
| Arquitectura vertical (torres, fachadas altas) | 4:5 retrato |
| Retrato de persona | 4:5 siempre |
| Macro de sujeto simétrico | 1:1 |
| Macro con sujeto alargado en vertical | 4:5 |
| Nocturna con cielo protagonista | 4:5 |
| Astrofotografía / Vía Láctea panorámica | 1.91:1 |
| Stories o Reels | 9:16 solo si se solicita explícitamente |

La recomendación incluye:
- Formato recomendado con dimensiones exactas en píxeles
- Justificación en 1-2 frases basada en la composición observada
- Zona de recorte sugerida (ej: "centrar en el sujeto y eliminar 12% del borde inferior")
- Si hay formato alternativo viable, mencionarlo

## Paso 5: Generación de hashtags

Genera entre 20 y 28 hashtags totales organizados en 5 capas. No superes nunca 30 (límite efectivo de Instagram).

### Capa 1 — Sujeto principal (5-6 hashtags)
Hashtags directos sobre el contenido. Mezcla español e inglés.

Ejemplos por categoría del JSON:
- **Aves**: `#birdphotography` `#wildbirds` `#birdsofinstagram` `#aves` `#fotografiaaves` `#pajaros`
- **Fauna** (no aves): `#wildlife` `#wildlifephotography` `#fauna` `#naturewildlife` `#fotografianaturaleza`
- **Paisaje**: `#landscapephotography` `#landscape` `#paisaje` `#naturaleza` `#scenery`
- **Ciudad**: `#streetphotography` `#urban` `#architecture` `#citylife` `#arquitectura`
- **Retrato**: `#portrait` `#portraitphotography` `#retrato` `#faces`
- **Macro**: `#macrophotography` `#macro` `#closeup` `#macroworld`
- **Nocturna**: `#nightphotography` `#nightsky` `#fotografianocturna`
- **Flora**: `#botanicalphotography` `#flowers` `#flora` `#plantlife`

Adapta los hashtags al sujeto específico identificado visualmente (ej: si es una garza → añadir `#heron`, si es un zorro → añadir `#fox`).

### Capa 2 — Técnica fotográfica (3-4 hashtags)
Basados en lo visible en la imagen:
- Bokeh pronunciado: `#bokeh` `#depthoffield` `#shallowdof`
- Teleobjetivo: `#telephoto`
- Hora dorada: `#goldenhour` `#goldenlight`
- Contraluz / silueta: `#backlight` `#silhouette`
- Larga exposición: `#longexposure` `#slowshutter`
- Blanco y negro: `#blackandwhite` `#bnw` `#monochrome`
- Acción congelada: `#actionphotography` `#freezeframe`
- Macro extremo: `#extrememacro` `#macroshot`

### Capa 3 — Ubicación (3-4 hashtags)
Basados en `lugar` y `ubicacion` del JSON, o deducidos visualmente. Ajusta al idioma elegido si el usuario no quiere hashtags de ubicación:

- Madrid: `#madrid` `#madridphoto` `#spain` `#españa`
- Casa de Campo: `#casadecampo` `#madrid` `#spain`
- Retiro: `#parquedelretiro` `#madrid` `#spain`
- Córdoba: `#cordoba` `#andalucia` `#spain`
- Genérico España: `#spain` `#españa` `#visitspain`
- Si el usuario eligió "Solo internacionales": usar solo `#spain` o el país, sin ciudad

Si no hay ubicación identificable, omite esta capa o usa solo 1-2 hashtags genéricos de entorno.

### Capa 4 — Comunidad fotográfica (4-5 hashtags)
Hashtags de comunidad estables e independientes del sujeto:
`#photography` `#photographer` `#foto` `#fotografia`

Añadir la marca de cámara si aparece en `datos_toma.camara` del JSON:
- Nikon: `#nikon` `#nikoncreators`
- Canon: `#canon` `#canonphotography`
- Sony: `#sony` `#sonyalpha`

Añadir `#natgeo` solo si la foto es de fauna/naturaleza de puntuación alta (≥ 7.0 en el JSON) o de calidad visual excepcional.

### Capa 5 — Nicho y descubribilidad (5-6 hashtags)
Hashtags de tamaño medio (100K–2M posts) con mayor probabilidad de aparecer en el top. Se generan combinando sujeto + lugar o sujeto + contexto:

- Aves en Madrid: `#birdsofmadrid` `#avesmadrid` `#madridbirds` `#spanishwildlife`
- Fauna general: `#wildlifeofinstagram` `#animalsofinstagram` `#naturegram`
- Aves en España: `#birdsofspain` `#spanishbirds` `#birdwatchingspain`
- Paisaje: `#earthpix` `#landscapelover` `#naturephotographer`
- Ciudad: `#streetphoto` `#urbanphotography` `#architecturelovers`
- Macro: `#macroofinstagram` `#macrolove` `#macroworld`
- Fauna nocturna: `#nightwildlife` `#nocturnalphotography`

Inventa combinaciones coherentes si no hay una predefinida — lo importante es que sean plausibles y específicas al sujeto y lugar.

### Presentación de hashtags

Muestra los hashtags organizados por capa con una etiqueta visual, seguido del bloque unificado listo para copiar y pegar:

```
📸 Sujeto:     #birdphotography #wildbirds #birdsofinstagram #aves #fotografiaaves #pajaros
🔧 Técnica:    #bokeh #telephoto #goldenhour
📍 Ubicación:  #madrid #spain #españa #madridphoto
👥 Comunidad:  #photography #photographer #foto #nikon #nikoncreators
🎯 Nicho:      #birdsofmadrid #avesmadrid #spanishwildlife #wildlifeofinstagram #naturegram

── BLOQUE PARA COPIAR EN INSTAGRAM ──
#birdphotography #wildbirds #birdsofinstagram #aves #fotografiaaves #pajaros #bokeh #telephoto #goldenhour #madrid #spain #españa #madridphoto #photography #photographer #foto #nikon #nikoncreators #birdsofmadrid #avesmadrid #spanishwildlife #wildlifeofinstagram #naturegram
```

## Paso 6: Caption (pie de foto)

Genera el caption en el/los idioma/s elegidos por el usuario. El objetivo es que suene a una persona real contando su propia foto — no a una cuenta de marca de fotografía de naturaleza escribiendo copy. Esto significa variar la estructura de un caption a otro, no solo el contenido: si dos captions seguidos "se sienten" igual en su forma aunque hablen de fotos distintas, está mal.

### Tono

- Primera persona del fotógrafo, como si le contaras la foto a tus seguidores de forma espontánea, no como una descripción publicitaria en tercera persona velada.
- Se permite el coloquialismo, la frase corta o incompleta, alguna contracción natural, y el humor cuando el tema lo permite.
- No todo caption necesita una "gran frase" de apertura poética. Muchas veces es mejor arrancar con un dato concreto, una anécdota, o incluso una frase sencilla y directa.
- La imperfección está bien: no busques que cada frase suene pulida o "citable". Suena más humano si no lo es.

### Evita esto (patrones prohibidos)

No reutilices estas construcciones ni otras con la misma lógica retórica:

- Aperturas con la fórmula **"En + [abstracción], ..."**, **"Una mirada que..."**, **"Entre X y X, un instante que..."**, o cualquier variante de "[sustantivo abstracto] + que + verbo grandilocuente".
- Metáforas grandiosas de repertorio: "un instante que no se repite", "la vida depende de un milisegundo", "un instante que dura menos de un parpadeo", "un momento que quedará grabado", y similares. Si la frase te suena a que podría ir en un calendario de National Geographic, descártala.
- Aplicar siempre la misma plantilla de tres bloques (frase de impacto → narrativa → pregunta de cierre) igual en todos los captions. Es la estructura fija, no una frase concreta, lo que delata que es generado por IA.
- Cerrar siempre con una pregunta retórica de fórmula: "¿Alguna vez has sido testigo de...?", "¿Cuántas veces...?", "¿Te habías fijado alguna vez en...?". Si usas pregunta de cierre, que suene a algo que preguntarías de verdad a un amigo ("¿vosotros habéis visto algo así?", "¿alguien más se ha cruzado con uno?"), y solo cuando encaje — no por rellenar un hueco.
- Describir la foto en un registro técnico o de catálogo ("captura el comportamiento de...", "un instante decisivo capturado con precisión milimétrica"). Eso es lenguaje de ficha, no de alguien compartiendo su foto.

### Variedad de estructura

No hay una plantilla única con espacios en blanco. Antes de escribir, elige (mentalmente, según lo que mejor encaje con la foto y con lo que el usuario haya contado) una de estas formas de arrancar y de cerrar — y procura no repetir la misma combinación que usaste en el caption anterior de la sesión:

- **Anécdota concreta primero**: empieza directamente en la acción o el dato ("Llevaba 20 minutos parado sin moverme cuando...", "Esto pasó en menos de dos segundos:"). Sin frase de impacto separada.
- **Dato o curiosidad como gancho**: abre con algo informativo sobre la especie, el lugar o el fenómeno, y de ahí pasa a la experiencia personal.
- **Directo y corto**: 2-3 líneas en total, sin desarrollo narrativo largo ni pregunta de cierre. Útil cuando la foto ya lo dice todo.
- **Pensamiento suelto**: una frase de apertura sencilla y personal (no necesariamente "poética") seguida de un comentario breve, casi como una nota rápida.
- **Historia con dos tiempos**: cuando hay contexto real de que la escena se repitió o evolucionó (dos fotos relacionadas, un seguimiento en el tiempo), cuéntalo como progresión narrativa en primera persona, no como reflexión abstracta.

La línea de apertura (lo que se ve antes de "ver más", máx. 125 caracteres) puede ser una frase de intriga cuando encaje de forma natural, pero no tiene que serlo — puede ser perfectamente una frase de apertura normal, informativa o anecdótica, mientras entre en el límite de caracteres. El límite es una restricción real de Instagram, no una excusa para forzar una frase grandilocuente.

### Contenido e integración

- Si la foto tiene `descripcion` y `lugar` en el JSON, úsalos como base factual — pero cuéntalos con tu propia voz, no reutilices su redacción técnica/descriptiva tal cual.
- Si el usuario dio su propia idea o frase para el caption (Paso 3), esa idea es la columna vertebral del texto: constrúyelo alrededor de ella en vez de insertarla como un fragmento suelto dentro de una estructura ya decidida.
- La longitud total es variable: a veces 2-3 líneas bastan, otras veces vale la pena un párrafo más. No alargues por sistema.
- La pregunta de cierre es opcional y nunca obligatoria — sáltala sin problema si no aporta nada.

### Ejemplos nuevos (nótese que cada uno tiene una forma distinta, no solo un tema distinto)

**Ejemplo 1 — ave en vuelo, anécdota directa, sin pregunta de cierre, corto (español):**
```
Llevaba rato con la cámara lista sin que pasara nada, y de repente esta gaviota pasó a menos de 10 metros con la presa ya en el pico.

No me dio ni tiempo a pensar el encuadre — fue disparar y ya está. La Casa de Campo en invierno tiene estas sorpresas si te quedas quieto el tiempo suficiente.
```

**Ejemplo 2 — retrato de ave, pensamiento suelto, muy corto, con pregunta conversacional simple (español):**
```
Este petirrojo se quedó mirándome más tiempo del que esperaba.

Con el frío que hacía en El Pardo esa mañana, ese pecho naranja fue lo único que calentaba la vista. ¿Vosotros tenéis algún ave "de la suerte" que se os cruza siempre?
```

**Ejemplo 3 — paisaje/fenómeno natural, dato curioso como gancho (español):**
```
En primavera, la Casa de Campo tiene su propia nevada — solo que no es nieve, son las pelusas de los chopos.

Esta lavandera blanca caminaba entre ellas con un insecto en el pico, y un rayo de luz lateral la recortó justo en el momento en que pasé por ahí con la cámara. Cosas que solo duran unas semanas al año y que casi nadie mira dos veces.
```

**Ejemplo 4 — historia con dos tiempos (dos fotos relacionadas), narrativa en primera persona (español):**
```
A este agateador lo pillé primero en el Parque del Sureste, subiendo por un tronco lleno de líquenes buscando material para el nido.

Semanas después, ya en El Pardo, me lo volví a encontrar en un tronco parecido — pero esta vez con una larva en el pico. De construir la casa a alimentar lo que vive dentro, en dos visitas separadas.
```

*Nota sobre inglés: cuando el usuario pida caption en inglés (o en ambos idiomas), traduce respetando el mismo tono casual y la misma variedad de estructura elegida para el español — no traduzcas literalmente frases que en español sonaban naturales pero en inglés caen en el mismo tipo de cliché ("the exact instant when...", "a look that...").*

## Paso 7: Alt text para accesibilidad

Genera el texto alternativo que Instagram permite en "Opciones avanzadas" al publicar. Útil para personas con discapacidad visual y para SEO. Máx. 100 palabras. Sin hashtags.

Descripción factual y específica: qué se ve, dónde está el sujeto, qué está haciendo, cómo es la luz, qué hay en el fondo.

Ejemplo: "Gaviota juvenil en pleno vuelo con las alas extendidas en horizontal, captada de lado mientras sostiene algo en el pico. El fondo muestra un bosque invernal difuminado en tonos marrones y grises. La luz difusa de un día nublado ilumina uniformemente el plumaje moteado del ave, que ocupa el tercio superior del encuadre."

## Paso 8: Ajustes técnicos recomendados

Indica ajustes solo si el análisis visual del Paso 1 detecta problemas reales. Si la foto está bien preparada para Instagram, dilo explícitamente.

Formato cuando hay ajustes:
```
Ajustes recomendados antes de publicar:
- Brillo: +5  (la foto se verá algo oscura en pantallas de móvil)
- Contraste: +10  (Instagram aplana el JPEG — un toque compensa la pérdida)
- Saturación: sin cambios  (la paleta desaturada es intencional y funciona)
- Nitidez de salida: +15  (output sharpening para web en Lightroom, compensa la compresión)
```

Formato cuando no hay ajustes:
```
La foto está bien preparada para Instagram. No se recomiendan ajustes adicionales.
```

## Paso 9: Comando sips para exportar

Genera el comando exacto de macOS para redimensionar y recortar la foto.

**CRÍTICO:** En sips, el argumento `-c` recibe primero el alto y luego el ancho (orden inverso al convencional). No lo inviertas nunca.

Flujo de dos pasos:
1. Redimensionar para que el lado que va a quedar completo alcance el tamaño objetivo
2. Recortar al tamaño exacto (centrado geométricamente por sips)

**Comandos según formato:**

Retrato 4:5 (1080×1350):
```bash
sips -Z 1350 "/Users/ignacio/Sites/fotos/originales/NOMBRE.jpeg" --out "/DESTINO/NOMBRE_ig.jpeg"
sips -c 1350 1080 "/DESTINO/NOMBRE_ig.jpeg"
```

Cuadrado 1:1 (1080×1080):
```bash
sips -Z 1080 "/Users/ignacio/Sites/fotos/originales/NOMBRE.jpeg" --out "/DESTINO/NOMBRE_ig.jpeg"
sips -c 1080 1080 "/DESTINO/NOMBRE_ig.jpeg"
```

Paisaje 1.91:1 (1080×566):
```bash
sips -Z 1080 "/Users/ignacio/Sites/fotos/originales/NOMBRE.jpeg" --out "/DESTINO/NOMBRE_ig.jpeg"
sips -c 566 1080 "/DESTINO/NOMBRE_ig.jpeg"
```

Stories/Reels 9:16 (1080×1920):
```bash
sips -Z 1920 "/Users/ignacio/Sites/fotos/originales/NOMBRE.jpeg" --out "/DESTINO/NOMBRE_ig.jpeg"
sips -c 1920 1080 "/DESTINO/NOMBRE_ig.jpeg"
```

Sustituye `NOMBRE` por el nombre real del archivo y `DESTINO` por la ruta elegida por el usuario.

El nombre del archivo exportado siempre lleva el sufijo `_ig` antes de la extensión: `foto_ig.jpeg`.

**Si el sujeto no está centrado:** sips recorta desde el centro geométrico. Si en el análisis visual detectas que el sujeto está descentrado y el recorte centrado lo dejaría fuera, advierte al usuario y añade la variante con `--cropOffset`:

```bash
# Ajusta offsetY (desde arriba) y offsetX (desde la izquierda) según la posición del sujeto
sips -c 1350 1080 --cropOffset OFFSET_Y OFFSET_X "/DESTINO/NOMBRE_ig.jpeg"
# Ejemplo: sujeto en tercio superior → offsetY 0 (no desplazar hacia abajo); sujeto a la derecha → offsetX mayor
```

**Si la foto fuente es más pequeña que el formato objetivo:** advierte que escalar hacia arriba introduce pérdida de calidad y sugiere publicar en un tamaño reducido proporcional.

**Para verificar las dimensiones del exportado:**
```bash
sips -g pixelWidth -g pixelHeight "/DESTINO/NOMBRE_ig.jpeg"
```

## Paso 10: Guardar en fotos.json (solo si el usuario aceptó en AskUserQuestion 3)

1. Haz backup del JSON antes de escribir:
   ```bash
   cp /Users/ignacio/Sites/fotos/fotos.json /Users/ignacio/Sites/fotos/fotos.json.bak
   ```

2. Lee el JSON actual, localiza la entrada de la foto por nombre de archivo, y añade el campo `instagram` al mismo nivel que `evaluacion` y `repetir`:

```json
"instagram": {
  "fecha_prep": "2026-05-24",
  "formato_recomendado": "4:5",
  "dimensiones": "1080x1350",
  "justificacion_formato": "El sujeto ocupa la zona central-superior; el retrato maximiza la presencia en el feed y permite mantener el bokeh del fondo sin perder información importante.",
  "zona_recorte": "Centrado horizontal; eliminar 10% del borde inferior donde el interés visual es menor.",
  "caption": {
    "es": "En el instante exacto en que la vida depende de un milisegundo.\n\n[resto del caption...]",
    "en": "The exact instant when life depends on a millisecond.\n\n[rest of caption...]"
  },
  "alt_text": "Gaviota juvenil en pleno vuelo con las alas extendidas, captada de lado...",
  "hashtags": {
    "sujeto": ["#birdphotography", "#wildbirds", "#birdsofinstagram", "#aves", "#fotografiaaves", "#pajaros"],
    "tecnica": ["#bokeh", "#telephoto", "#goldenhour"],
    "ubicacion": ["#madrid", "#spain", "#españa", "#madridphoto"],
    "comunidad": ["#photography", "#photographer", "#foto", "#nikon", "#nikoncreators"],
    "nicho": ["#birdsofmadrid", "#avesmadrid", "#spanishwildlife", "#wildlifeofinstagram", "#naturegram"],
    "bloque_completo": "#birdphotography #wildbirds #birdsofinstagram #aves ..."
  },
  "ajustes_tecnicos": {
    "brillo": "sin cambios",
    "contraste": "+10",
    "saturacion": "sin cambios",
    "nitidez_salida": "+15"
  },
  "comando_sips": "sips -Z 1350 \"/Users/ignacio/Sites/fotos/originales/2400.jpeg\" --out \"/Users/ignacio/Desktop/2400_ig.jpeg\" && sips -c 1350 1080 \"/Users/ignacio/Desktop/2400_ig.jpeg\"",
  "recorte": {
    "resample_flag": "-Z",
    "resample_valor": 1350,
    "crop_alto": 1350,
    "crop_ancho": 1080,
    "centrado": true,
    "offset_y": null,
    "offset_x": null
  }
}
```

El campo `recorte` guarda los parámetros exactos usados en el Paso 9 (incluida la orientación del resize: `-Z`, `--resampleWidth` o `--resampleHeight` según corresponda) para que el Paso 12 pueda regenerar la previsualización de esta foto en cualquier momento futuro sin tener que volver a deducir el encuadre. Si el recorte no fue centrado (Paso 9, variante `--cropOffset`), pon `"centrado": false` y rellena `offset_y`/`offset_x` con los valores usados.

3. Escribe el array JSON completo con la herramienta Write, con indentación de 2 espacios.

## Paso 11: Resumen final

Muestra un panel estructurado con todo lo generado:

```
───────────────────────────────────────────────────────
INSTAGRAM PREP — "Título de la foto"
───────────────────────────────────────────────────────

FORMATO RECOMENDADO
  4:5 Retrato · 1080×1350 px
  Recorte: centrado horizontal, eliminar 10% borde inferior.

CAPTION (español)
  En el instante exacto en que la vida depende de un milisegundo.

  La Casa de Campo en invierno esconde una naturaleza que pocos ven.
  Esta gaviota juvenil pasó a menos de 10 metros de mí...

  ¿Alguna vez has visto algo así en plena ciudad?

ALT TEXT
  Gaviota juvenil en pleno vuelo con las alas extendidas...

HASHTAGS
  📸 Sujeto:    #birdphotography #wildbirds #birdsofinstagram #aves #fotografiaaves #pajaros
  🔧 Técnica:   #bokeh #telephoto #goldenhour
  📍 Ubicación: #madrid #spain #españa #madridphoto
  👥 Comunidad: #photography #photographer #foto #nikon #nikoncreators
  🎯 Nicho:     #birdsofmadrid #avesmadrid #spanishwildlife #wildlifeofinstagram #naturegram

  ── COPIAR ──
  #birdphotography #wildbirds #birdsofinstagram #aves #fotografiaaves #pajaros #bokeh #telephoto ...

AJUSTES ANTES DE PUBLICAR
  Brillo: sin cambios · Contraste: +10 · Saturación: sin cambios · Nitidez output: +15

COMANDO SIPS
  sips -Z 1350 "/Users/ignacio/Sites/fotos/originales/2400.jpeg" \
    --out "/Users/ignacio/Desktop/2400_ig.jpeg"
  sips -c 1350 1080 "/Users/ignacio/Desktop/2400_ig.jpeg"

  Verificar: sips -g pixelWidth -g pixelHeight "/Users/ignacio/Desktop/2400_ig.jpeg"

✓ Datos guardados en fotos.json
───────────────────────────────────────────────────────
```

Si el usuario no guardó en fotos.json, omite la última línea del panel.

Si el Paso 12 se completa con éxito, añade una línea final adicional al panel:
```
📱 Galería de Instagram actualizada: instagram/index.html (se abre en el navegador)
```
Si el Paso 12 se omitió (porque el usuario no guardó en fotos.json, o por un fallo de sips), no añadas esta línea.

## Paso 12: Actualizar la galería de Instagram (página HTML del proyecto)

Este paso **solo se ejecuta si el usuario guardó los datos en fotos.json en el Paso 10** — la galería se construye a partir de lo guardado allí, así que una foto que no se guardó no puede aparecer en ella.

A diferencia de una vista previa puntual, este paso mantiene una única página HTML persistente dentro del proyecto que reúne **todas** las fotos que tengan campo `instagram` en `fotos.json`, no solo la actual.

### 12.1 — Generar y persistir la previsualización recortada de la foto actual

```bash
mkdir -p /Users/ignacio/Sites/fotos/instagram/previews
```

Reutiliza los parámetros de recorte ya calculados en el Paso 9 (los mismos que acabas de guardar en `instagram.recorte`), pero con salida permanente en `instagram/previews/<NOMBRE_SIN_EXTENSION>_ig.jpeg`:

```bash
sips <resample_flag> <resample_valor> "<ruta_original_o_pendiente>" --out "/Users/ignacio/Sites/fotos/instagram/previews/<NOMBRE_SIN_EXTENSION>_ig.jpeg"
sips -c <crop_alto> <crop_ancho> [--cropOffset <offset_y> <offset_x> si no está centrado] "/Users/ignacio/Sites/fotos/instagram/previews/<NOMBRE_SIN_EXTENSION>_ig.jpeg"
```

A diferencia de versiones anteriores de este skill, este archivo **no se borra** — es el que alimentará la galería cada vez que se regenere, y se sobrescribe si vuelves a preparar la misma foto.

Si `sips` falla (formato no soportado, archivo no encontrado, etc.): omite la previsualización de esta foto (la card usará la imagen original sin recortar como respaldo, ver 12.3) y continúa con el resto del paso sin bloquear el flujo.

### 12.2 — Recolectar todas las fotos con datos de Instagram

1. Lee `/Users/ignacio/Sites/fotos/fotos.json` completo.
2. Filtra las entradas que tengan el campo `instagram` (incluida la que acabas de guardar).
3. Ordénalas por `instagram.fecha_prep` descendente (la más reciente primero).
4. Para cada entrada, resuelve la imagen a mostrar:
   - Si existe `/Users/ignacio/Sites/fotos/instagram/previews/<NOMBRE_SIN_EXTENSION>_ig.jpeg`, úsala (ruta relativa `previews/<NOMBRE_SIN_EXTENSION>_ig.jpeg` desde `instagram/index.html`).
   - Si no existe pero la entrada tiene `instagram.recorte`, regénerala ahora con los mismos comandos del Paso 12.1 usando esos parámetros guardados (busca el archivo origen primero en `originales/<nombre>`, luego en `pendientes/<nombre>`).
   - Si no existe el archivo ni hay `instagram.recorte` guardado (entradas de versiones anteriores de este skill, antes de que existiera este campo), usa la imagen original sin recortar como respaldo (ruta relativa `../originales/<nombre>` o `../pendientes/<nombre>`) y añade una nota discreta en la card: "Vista previa sin recorte (datos guardados antes de esta función)".

### 12.3 — Construir la página de galería

Escribe con **Write** el archivo `/Users/ignacio/Sites/fotos/instagram/index.html` (sobrescribiéndolo si ya existía) con:

- Una cabecera de página: título, número total de fotos listadas, fecha de generación.
- Una tarjeta por foto, en formato de feed apilado verticalmente, cada una con el mismo diseño usado hasta ahora:
  - **Mockup de Instagram**: cabecera con avatar y usuario **"WildLensProject"** + el lugar de la foto, imagen (con `aspect-ratio` según `instagram.formato_recomendado`), fila de iconos decorativos, etiqueta neutra de estado (nunca likes/comentarios inventados), caption (respeta `\n` con `white-space: pre-wrap`; si hay `caption.es` y `caption.en` apila ambos con etiquetas "ES"/"EN") seguido de los hashtags (`instagram.hashtags.bloque_completo`) en gris claro, y la fecha de `instagram.fecha_prep`.
  - **Datos técnicos** debajo, con estilo más sobrio: `alt_text`, formato/dimensiones + `justificacion_formato`, `ajustes_tecnicos`, y el `comando_sips` (bloque monoespaciado).
- Las imágenes se referencian con rutas de archivo relativas normales (`<img src="...">`) — al ser una página local del proyecto, no hace falta incrustarlas en base64 como en un Artifact con CSP.
- Mantén un diseño limpio y coherente (tipografía de sistema, paleta neutra con un acento, separación clara entre tarjetas) — no necesitas cargar ninguna skill de diseño para esto, es una página interna de revisión, no una pieza editorial.

### 12.4 — Abrir la galería

```bash
open "/Users/ignacio/Sites/fotos/instagram/index.html"
```

Esto abre el archivo en el navegador por defecto de macOS. Si el comando falla (entorno sin GUI), omítelo sin bloquear el flujo y simplemente indica la ruta del archivo al usuario.

## Notas importantes

- Lee siempre el JSON antes de escribirlo. Nunca sobreescribas sin leer primero.
- El backup del JSON (`fotos.json.bak`) solo es necesario si el usuario decide guardar.
- Si la foto está en `pendientes/`, la ruta del comando sips usa `pendientes/NOMBRE` en lugar de `originales/NOMBRE`.
- No ejecutes el comando sips de exportación final automáticamente — solo muéstralo para que el usuario lo copie y ejecute cuando quiera. La única excepción son las previsualizaciones del Paso 12, que sí se generan y persisten en `instagram/previews/` porque alimentan la galería, no la publicación real.
- Si el usuario proporciona una idea de caption, intégrala como columna vertebral del texto, en la forma que mejor encaje según la estructura elegida para ese caption.
- Los hashtags en el bloque para copiar deben ir todos en una sola línea, sin saltos, para que Instagram los procese correctamente.
- `instagram/index.html` se regenera por completo cada vez que se ejecuta el Paso 12 — siempre refleja el estado actual de `fotos.json`, nunca acumules HTML manualmente entre ejecuciones.
- Si `sips` no puede procesar el formato original de la foto actual (p. ej. algunos RAW), omite su previsualización pero sigue regenerando la galería con el resto de fotos.
