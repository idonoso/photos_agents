# Skill: Evaluación de fotos para portfolio

Cuando el usuario invoque este comando (por ejemplo: "evalua las fotos", "analiza las pendientes", "evaluate photos", "puntua las fotos", "review my photos"), sigue estos pasos exactamente.

## Rutas base

- **Proyecto**: `/Users/ignacio/Sites/fotos/`
- **Pendientes**: `/Users/ignacio/Sites/fotos/pendientes/`
- **Originales**: `/Users/ignacio/Sites/fotos/originales/`
- **JSON de metadatos**: `/Users/ignacio/Sites/fotos/fotos.json`

## Formatos de entrada soportados

JPEG, PNG, WebP, HEIC, TIFF, RAW (CR2, CR3, NEF, ARW, RAF, ORF, DNG, etc.)

Extensiones a buscar: `jpg`, `jpeg`, `png`, `webp`, `heic`, `heif`, `tiff`, `tif`, `cr2`, `cr3`, `nef`, `arw`, `raf`, `orf`, `dng`, `rw2`, `pef`, `srw`.

## Sistema de evaluación

La evaluación consta de **3 partes** con **20 aspectos** en total. Cada aspecto recibe una puntuación de 0.0 a 10.0, un comentario descriptivo y una sugerencia de mejora concreta.

### Escala de puntuación (0.0 – 10.0)

- **0–2**: Significativamente deficiente o ausente
- **3–4**: Por debajo de la media, problemas notables
- **5–6**: Competente, correcta — una foto "normal"
- **7–8**: Buena a muy buena
- **9–10**: Excepcional — reservar 10 para perfección absoluta

Sé honesto y crítico. Un atardecer bonito sin más es un 5–6, no un 8. Un retrato con fondo distraído y ojos fuera de foco no sube de 4 en técnica por muy emotivo que sea.

### Parte 1: Técnica (peso 40% del total)

9 aspectos con peso igual dentro de la parte:

1. **Exposición** (`exposicion`): Evalúa cómo se ha gestionado la cantidad de luz que llega al sensor. Mira el equilibrio del histograma: ¿hay zonas quemadas (blanco puro sin detalle) o empastadas (negro sin información)? Una exposición excelente aprovecha todo el rango dinámico disponible, manteniendo detalle tanto en las luces más brillantes como en las sombras más profundas. En escenas de alto contraste (contraluz, interiores con ventanas), valora si el fotógrafo ha priorizado correctamente qué zona exponer. Una subexposición o sobreexposición intencional y bien ejecutada (clave alta, clave baja) es válida.

2. **Nitidez** (`nitidez`): Evalúa la precisión del enfoque y su adecuación a la intención de la imagen. El sujeto principal debe estar nítido donde el fotógrafo lo pretende (ojos en retratos, cabeza en fauna, punto de interés en paisaje). Valora si la profundidad de campo elegida es apropiada: demasiada puede diluir el sujeto en un fondo caótico, demasiado poca puede dejar fuera elementos importantes. Distingue entre motion blur intencional (barrido creativo, larga exposición de agua o nubes) y accidental (trepidación por velocidad insuficiente). Una imagen ligeramente desenfocada en el sujeto principal no puede superar un 4, por muy buena que sea en otros aspectos.

3. **Color** (`color`): Evalúa la paleta cromática de la imagen en su conjunto. ¿Los colores son precisos y fieles a la escena, o están desviados de forma no intencional? ¿Hay armonía entre los tonos presentes — colores complementarios, análogos, monocromáticos — o compiten entre sí? Valora la coherencia de la saturación: colores sobresaturados que gritan o tan desaturados que la imagen pierde vida. Los colores deben servir a la historia de la imagen, no distraer de ella. Un procesado de color intencional y coherente (teal & orange, desaturado cinematográfico) es válido si funciona con la escena.

4. **Balance de blancos** (`balance_blancos`): Evalúa si la temperatura de color representa fielmente la escena o la intención del fotógrafo. Un tono demasiado azul en un retrato de interior sugiere error; un tono cálido en hora dorada es esperado. Busca consistencia de tinte en toda la imagen: ¿hay zonas con dominante diferente al resto (sombras verdosas, luces amarillentas)? Las fuentes de luz mixta (tungsteno + luz día, fluorescentes) son especialmente problemáticas. Un balance de blancos creativo e intencional (deliberadamente frío para transmitir soledad, cálido para nostalgia) es perfectamente válido si el resultado es coherente y refuerza el mensaje.

5. **Composición** (`composicion`): Evalúa cómo están organizados los elementos dentro del encuadre. ¿La mirada del espectador es guiada de forma natural hacia el sujeto principal? Analiza el uso de regla de tercios, simetría, líneas de fuga, marcos naturales, espacio negativo y distribución del peso visual. ¿El horizonte está nivelado (o intencionalmente inclinado)? ¿Hay elementos que distraen en los bordes o el fondo — ramas cortadas, objetos parciales, elementos brillantes que roban atención? Una composición excelente hace que todo elemento en la imagen tenga un propósito. La rotura intencional de reglas (centrado deliberado, horizonte extremo) es válida si funciona.

6. **Iluminación** (`iluminacion`): Evalúa la calidad, dirección y uso de la luz en la escena. Luz dura (sol directo, flash sin difusor) crea sombras marcadas y alto contraste; luz suave (nublado, difusores, hora dorada) crea transiciones suaves y menor contraste. ¿La dirección de la luz modela bien al sujeto, revela texturas y crea volumen? Valora el ratio de contraste entre luces y sombras: un contraste excesivo pierde detalle, uno insuficiente aplana la imagen. En escenas con luz artificial, evalúa si el fotógrafo ha trabajado la luz (reflectores, relleno) o ha dependido del ambiente. La iluminación es lo que separa una instantánea de una fotografía.

7. **Enfoque y profundidad** (`enfoque_profundidad`): Evalúa el uso creativo y técnico de la profundidad de campo. ¿El sujeto está bien aislado del fondo cuando es deseable? ¿La calidad del desenfoque (bokeh) es agradable — suave y cremoso, o nervioso y distractor? Valora las capas de profundidad: primer plano, sujeto, fondo — ¿cada capa aporta a la imagen? En paisajes, ¿hay hiperfocal o enfoque apilado cuando se necesita nitidez de cerca a infinito? Una apertura muy abierta (f/1.4-2.8) con bokeh cremoso que separa limpiamente al sujeto es un recurso poderoso. Una profundidad de campo inadecuada (todo nítido cuando el fondo distrae, o sujeto parcialmente fuera de foco) penaliza.

8. **Ruido y limpieza** (`ruido_limpieza`): Evalúa la limpieza técnica de la imagen. ¿Hay ruido ISO visible — luminancia (grano) o cromático (puntos de color)? El ruido en sombras es normal a ISOs altos, pero ¿está controlado o es excesivo? Busca artefactos de compresión JPEG, bandas de posterización en gradientes (cielos especialmente), distorsión geométrica de lente (líneas curvas que deberían ser rectas), aberración cromática (halos púrpura/verde en bordes de alto contraste). Manchas de sensor, reflejos de lente no intencionales y aberraciones ópticas también penalizan. Un grano intencional con fines estéticos (estilo analógico) es aceptable si es coherente.

9. **Procesado** (`procesado`): Evalúa la calidad de la post-producción y el revelado digital. ¿Las transiciones tonales son suaves y naturales, o se notan artefactos de edición agresiva (halos HDR, sombras artificialmente abiertas con aspecto grisáceo, saturación excesiva)? ¿El retoque es invisible o se nota? Valora la coherencia del tratamiento: una foto con cielo sobreprocesado pero primer plano sin tocar delata mala edición. La clave es que el procesado sea invisible — que parezca que la foto "salió así" de la cámara, incluso si hubo trabajo considerable detrás. Un procesado minimalista bien ejecutado es preferible a una edición agresiva que se nota. Un estilo de edición intencional y coherente (desaturado, alto contraste, tono cinematográfico) es válido si está bien aplicado.

### Parte 2: Artística (peso 40% del total)

7 aspectos con peso igual dentro de la parte:

1. **Emoción** (`emocion`): Evalúa la respuesta emocional que la imagen provoca en el espectador. ¿Sientes algo al mirarla — calma, tensión, alegría, melancolía, asombro, inquietud, ternura? La emoción no necesita ser intensa para puntuar alto: una serenidad sutil bien transmitida vale tanto como un drama potente. Lo que importa es que la emoción sea clara y genuina, no forzada ni ausente. Una foto técnicamente impecable que no te hace sentir absolutamente nada es una postal, no una fotografía. Nota: la emoción es lo que tú sientes como espectador; la atmósfera (aspecto separado) es lo que la escena proyecta visualmente.

2. **Narrativa** (`narrativa`): Evalúa si la imagen cuenta o sugiere una historia. ¿Hay un antes y un después implícito? ¿El espectador se pregunta qué pasó justo antes de la foto o qué pasará después? Busca elementos que construyan contexto: expresiones faciales, gestos, relaciones entre sujetos, objetos que implican acción, contrastes temáticos (viejo/nuevo, natural/artificial, soledad/multitud). Una foto con narrativa fuerte genera preguntas y no las responde todas — deja espacio para la imaginación. Un paisaje vacío tiene poca narrativa; ese mismo paisaje con un camino que desaparece en la niebla la tiene.

3. **Momento** (`momento`): Evalúa el timing — cuán preciso fue el instante de captura. El "instante decisivo" de Cartier-Bresson: la milésima de segundo en que la acción, la expresión, la geometría y la luz convergen perfectamente. ¿La foto captura el pico de la acción, la cima de la expresión, el punto exacto de equilibrio visual? En fotografía de acción, fauna o street, el momento lo es todo. En paisaje o arquitectura pesa menos pero sigue importando: ¿esperó el fotógrafo a la luz perfecta, a que se despejara la gente, a que las nubes formaran el patrón adecuado? Un momento perfecto eleva una foto mediocre; un momento perdido arruina una escena extraordinaria.

4. **Intención** (`intencion`): Evalúa si se percibe una visión clara del fotógrafo detrás de la imagen. ¿Las decisiones técnicas — ángulo elegido, distancia focal, apertura, velocidad, momento del disparo — parecen deliberadas y coherentes con lo que la imagen comunica? ¿O parece que el fotógrafo simplemente apuntó y disparó sin pensar? Un retrato a ras de suelo comunica algo diferente que uno desde arriba; un gran angular distorsiona intencionalmente; una larga exposición borra el tiempo a propósito. La intención se nota cuando todas las decisiones apuntan en la misma dirección. Si el ángulo dice una cosa y la focal otra, la intención es confusa.

5. **Originalidad** (`originalidad`): Evalúa cuán fresca y única es la perspectiva del fotógrafo. ¿Ha encontrado un ángulo, momento, tratamiento o enfoque que no se ve todos los días? El mundo está saturado de atardeceres centrados, cafés con latte art, y la Torre Eiffel desde el Trocadero. La originalidad no requiere temas exóticos — una farola bajo la lluvia puede ser extraordinariamente original si la perspectiva, la luz o el momento son únicos. Penaliza los clichés fotográficos sin valor añadido. Premia las visiones que hacen ver algo cotidiano de una forma nueva, o que presentan algo extraordinario desde un ángulo inesperado.

6. **Atmósfera** (`atmosfera`): Evalúa el ambiente visual que la escena proyecta independientemente de la emoción que provoque. La atmósfera es lo que se *ve*: niebla que envuelve un bosque, la calima de un mediodía de verano, la penumbra de una catedral, el bullicio visual de un mercado, el vacío de un desierto, la calidez de una ventana iluminada en la noche. ¿Los elementos visuales — luz, color, textura, clima, hora del día — construyen un ambiente coherente y envolvente? Una atmósfera potente transporta al espectador al lugar. Diferencia clave con Emoción: una foto de niebla en un puerto tiene atmósfera fuerte (visual) pero podría no generar emoción (sentimiento) en todos los espectadores, y viceversa.

7. **Conexión con el sujeto** (`conexion`): Evalúa si el espectador siente empatía, curiosidad o cercanía hacia el sujeto de la foto. ¿El retrato te hace querer conocer a esa persona? ¿La mirada del animal te atrapa? ¿Sientes que podrías estar ahí, en ese lugar? La conexión depende de la distancia emocional que el fotógrafo logra reducir entre espectador y sujeto. Contacto visual directo, expresiones reveladoras, posturas vulnerables, momentos íntimos — todo genera conexión. Una foto de fauna donde el animal mira directamente al objetivo conecta más que una de perfil. En paisaje, la conexión viene del "quiero estar ahí". Una foto que te deja indiferente ante el sujeto puntúa bajo aquí, incluso si es técnicamente perfecta.

### Parte 3: Excepcional (peso 20% del total)

4 aspectos con peso igual dentro de la parte. Esta parte es deliberadamente difícil: la mayoría de fotos puntúan 2–5 aquí. Un 7+ requiere algo genuinamente extraordinario.

1. **Técnica + Emoción** (`tecnica_emocion`): Evalúa si la maestría técnica y la fuerza emocional se amplifican mutuamente en la imagen. No se trata de sumar técnica buena + emoción buena, sino de que la técnica esté al servicio del sentimiento de forma inseparable. Un barrido perfecto que transmite velocidad y vértigo. Una larga exposición que convierte el mar en niebla y transmite eternidad. Un enfoque selectivo que aísla una lágrima. Cuando la técnica desaparece como herramienta y se funde con la emoción, la imagen trasciende. Si puedes imaginar la misma foto con técnica diferente y la emoción no cambia, la fusión es débil.

2. **Momento irrepetible** (`momento_irrepetible`): Evalúa si la foto captura algo que no se puede volver a fotografiar. Un rayo cayendo exactamente detrás de un faro. Un gesto fugaz entre dos desconocidos. Un animal en el instante exacto del salto. Un eclipse con las nubes formando un patrón irrepetible. La clave es: ¿puedes volver mañana, al mismo sitio, con el mismo equipo, y repetir esta foto? Si sí, puntúa bajo (máximo 4). Si necesitarías una coincidencia improbable de factores, puntúa medio (5–7). Si es literalmente irrepetible — el momento existió una vez y nunca volverá — puntúa alto (8–10).

3. **Estilo e impacto** (`estilo_impacto`): Evalúa si la imagen tiene voz autoral propia y capacidad de detener al espectador. ¿Podrías reconocer al fotógrafo por su estilo si vieras esta foto sin crédito? ¿La imagen te hace parar el scroll, detenerte en una exposición, volver a mirarla? El impacto no es solo "wow" inicial — es la capacidad de la imagen de permanecer en tu memoria, de hacerte volver a ella. Un estilo propio se construye con decisiones consistentes: paleta de color, tipo de luz, perspectiva, temas, tratamiento. Una foto genérica bien ejecutada no tiene estilo; una foto con decisiones arriesgadas y coherentes sí, aunque no sea perfecta.

4. **Trascendencia** (`trascendencia`): Evalúa si la imagen va más allá de lo que muestra y dice algo universal sobre la experiencia humana o la naturaleza. ¿La foto de un anciano en un banco habla sobre la soledad en general, no solo sobre ese anciano? ¿El paisaje devastado habla sobre la fragilidad del planeta? ¿El niño riendo habla sobre la inocencia universal? Las fotos trascendentes funcionan como metáforas visuales: muestran lo particular pero comunican lo universal. Son atemporales — funcionarán igual dentro de 50 años. Son las fotos que terminan en libros, exposiciones y memorias colectivas. Muy pocas imágenes alcanzan esto. La mayoría de fotos puntúan 1–3 aquí, y está bien — la trascendencia no es un requisito, es un regalo.

### Cálculo de puntuaciones

- **Puntuación de parte**: media aritmética de sus aspectos (redondear a 1 decimal)
- **Puntuación total**: `(técnica × 0.40) + (artística × 0.40) + (excepcional × 0.20)` (redondear a 1 decimal)

## Categorías

Cada foto recibe un **array de 1 a 3 categorías** en el campo `"categorias"`. La primera categoría del array es la más dominante o específica.

**Categorías predefinidas (18)**:

| Sujeto/Tema | Género/Técnica |
|---|---|
| `Aves` — aves específicamente | `Viaje` — fotos de viajes fuera de Madrid/España |
| `Fauna` — animales no aves | `Macro` — fotografía de primer plano extremo |
| `Flora` — plantas, flores, árboles | `Nocturna` — fotografía nocturna |
| `Paisaje` — paisajes naturales | `Documental` — documentalismo, storytelling |
| `Ciudad` — escenas urbanas, arquitectura, callejera | `Astrofotografía` — estrellas, Vía Láctea, cuerpos celestes |
| `Retrato` — retratos de personas | `Aérea` — fotografía con dron/aérea |
| `Deportes` — deportes, acción atlética | `Submarina` — fotografía subacuática |
| `Eventos` — eventos, celebraciones, festivales | `Abstracta` — composiciones abstractas, patrones |
| `Gastronomía` — comida y bebida | `Otra` — solo si ninguna otra encaja |

**Reglas de asignación:**
- Mínimo 1, máximo 3 categorías por foto.
- La primera del array es la más dominante/específica.
- **`Viaje` solo aplica a fotos tomadas fuera de Madrid y alrededores** (preferiblemente fuera de España). Si la ubicación es Madrid o cercanías, NO asignar Viaje. **Preguntar siempre al usuario con AskUserQuestion si la foto es de un viaje** antes de asignar esta categoría.
- `Viaje` se combina con categorías de sujeto (ej: `["Viaje", "Paisaje"]`, `["Viaje", "Ciudad"]`).
- No combinar `Fauna` + `Aves` (`Aves` ya es subconjunto de `Fauna`).
- `Otra` solo se usa sola, nunca combinada.

**Categorías nuevas:** Antes de asignar categorías, revisa las ya existentes en fotos.json (puede haber categorías nuevas creadas anteriormente). Si la foto no encaja en ninguna categoría existente, sugiere una nueva al usuario con AskUserQuestion. El usuario puede aceptarla, elegir una existente, o proponer otra distinta. Las categorías aceptadas quedan disponibles para futuras fotos.

## Paso 1: Verificar carpetas y listar pendientes

1. Crea las carpetas si no existen:
   ```bash
   mkdir -p /Users/ignacio/Sites/fotos/pendientes /Users/ignacio/Sites/fotos/originales
   ```

2. Lista las imágenes en `pendientes/`:
   ```bash
   ls /Users/ignacio/Sites/fotos/pendientes/
   ```

3. Si no hay imágenes, informa al usuario y termina: "No hay imágenes en `pendientes/`. Coloca tus fotos ahí e invoca el comando de nuevo."

## Paso 2: Leer JSON existente

Lee el archivo `/Users/ignacio/Sites/fotos/fotos.json` con la herramienta Read. Si no existe, inicializa un array vacío `[]` en memoria.

Extrae de las entradas existentes:
- Los nombres (`nombre`) para detectar duplicados
- Las categorías únicas (`categorias`) para mantener coherencia
- Las etiquetas existentes para reutilizar vocabulario

## Paso 3: Procesar cada imagen

Para CADA imagen encontrada en `pendientes/`, ejecuta estos sub-pasos:

### 3a. Determinar nombre y comprobar duplicados

- Toma el nombre base del archivo (sin extensión) como nombre de referencia.
- El nombre original completo (con extensión) se conserva tal cual para `originales/`.
- **Si ya existe una entrada con ese `nombre` en el JSON**, pregunta al usuario con AskUserQuestion:
  - **"Actualizar existente"**: El usuario ha editado o mejorado la foto. Se reemplaza la evaluación de la entrada existente con una nueva. Se sobrescribe el archivo en `originales/`. Se actualiza `fecha_evaluacion` y toda la sección `evaluacion`.
  - **"Foto nueva, renombrar"**: Es una foto diferente con el mismo nombre. Pide al usuario que renombre el archivo en `pendientes/` y **salta esta imagen** (continúa con las demás).

  Ejemplo: *"Ya existe `gaviota.jpg` en el portfolio. ¿Esta foto es una versión mejorada de la existente, o es una foto completamente nueva que necesita otro nombre?"*

### 3b. Analizar visualmente la imagen

Usa la herramienta **Read** para leer el archivo de imagen directamente desde `pendientes/`. Claude es multimodal y puede analizar imágenes visualmente. A partir del análisis, genera:

#### Metadatos

- **titulo**: Título descriptivo y evocador para la foto (3–8 palabras). No uses el nombre del archivo — crea algo que capture la esencia de la imagen.
- **descripcion**: Qué se ve en la foto — escena, elementos principales, atmósfera. 2–3 frases.
- **lugar**: Lugar específico donde se tomó la foto (monumento, parque, calle, edificio). Antes de asignar, revisa los valores de `lugar` existentes en fotos.json para reutilizar vocabulario. Si hay dudas, pregunta al usuario con AskUserQuestion sugiriendo lugares anteriores como opciones. Si no se puede determinar: `"Desconocida"`.
- **ubicacion**: Ubicación genérica (ciudad, país o región). Antes de asignar, revisa los valores de `ubicacion` existentes en fotos.json. Ofrece como opciones los valores anteriores (ej: "Madrid", "Córdoba", "Egipto") más "Otro". Si no se puede determinar: `"Desconocida"`. Preguntar `lugar` y `ubicacion` juntos en un solo AskUserQuestion con 2 preguntas.
- **categorias**: Array de 1–3 categorías siguiendo las reglas de la sección "Categorías".
- **etiquetas**: Array de 5–15 palabras clave en minúsculas. Antes de asignar, revisa las etiquetas existentes en el JSON para reutilizar vocabulario (ej: si ya existe `"atardecer"`, no crear `"puesta de sol"`).
- **fecha**: Pregunta SIEMPRE al usuario con AskUserQuestion. Opciones: fecha de hoy, "No recuerdo", u "Otra fecha". Si no recuerda, usa `null`. Formato: `YYYY-MM-DD`.

#### Datos de toma

Pregunta al usuario los datos técnicos de la toma **campo por campo** usando AskUserQuestion. **Todos son opcionales** — el usuario puede no recordarlos o no tenerlos. Si no los sabe, usa `null`.

**Preparación — extraer datos anteriores para sugerencias:**

Antes de preguntar, revisa las entradas existentes en `fotos.json` y extrae:
- Las combinaciones únicas de `datos_toma.camara` y `datos_toma.objetivo` que no sean `null`.
- Una vez que el usuario elija cámara+objetivo, filtra las fotos anteriores que usen esa misma combinación y extrae los valores únicos de cada campo técnico (ISO, diafragma, velocidad, focal, compensación EV, medición, balance de blancos). Estos valores se ofrecerán como opciones en las preguntas siguientes.

**Pregunta 1 — Cámara y objetivo:**

Si hay combinaciones previas en el JSON, pregunta con AskUserQuestion ofreciendo como opciones:
- Cada combinación anterior (ej: "Nikon Z6 III + Nikkor Z 180-600mm f/5.6-6.3 VR")
- "Otro equipo" — para introducir cámara y/o objetivo nuevos

Si no hay datos previos, pregunta directamente como texto libre.

- **Cámara** (`camara`): Modelo del cuerpo. Ej: "Canon R7", "Sony A7IV", "Nikon Z50". Permite saber si es crop o full frame.
- **Objetivo** (`objetivo`): Modelo o descripción de la lente. Ej: "100-400mm f/4.5-5.6", "50mm f/1.4", "24-70 f/2.8". Permite conocer calidad óptica y apertura máxima.

**Pregunta 2 — ISO:**

Pregunta con AskUserQuestion. Si hay fotos anteriores con el mismo equipo, ofrece como opciones los valores de ISO usados anteriormente (ej: "560", "1250", "2000") más "Otro valor" y "No recuerdo".
- **ISO** (`iso`): Sensibilidad. Número entero. Si no lo sabe, `null`.

**Pregunta 3 — Diafragma:**

Pregunta con AskUserQuestion. Si hay fotos anteriores con el mismo equipo, ofrece como opciones los valores de diafragma usados anteriormente (ej: "f/6", "f/7.1") más "Otro valor" y "No recuerdo".
- **Diafragma** (`diafragma`): Apertura. Formato con "f/" delante. Si no lo sabe, `null`.

**Pregunta 4 — Velocidad de obturación:**

Pregunta con AskUserQuestion. Si hay fotos anteriores con el mismo equipo, ofrece como opciones las velocidades usadas anteriormente (ej: "1/2000s", "1/650s") más "Otro valor" y "No recuerdo".
- **Velocidad de obturación** (`obturador`): Tiempo de exposición. Formato fracción + "s". Si no lo sabe, `null`.

**Pregunta 5 — Distancia focal:**

Pregunta con AskUserQuestion. Si hay fotos anteriores con el mismo equipo, ofrece como opciones las focales usadas anteriormente (ej: "390mm", "600mm") más "Otro valor" y "No recuerdo".
- **Distancia focal** (`focal`): Focal utilizada. Ej: "200mm", "600mm". Si no recuerda la exacta y da el rango del zoom, aceptar. Si no lo sabe, `null`.

**Pregunta 6 — Compensación EV, medición y balance de blancos (agrupados):**

Estos tres campos se pueden preguntar juntos en un solo AskUserQuestion con preguntas múltiples, ya que cambian menos entre fotos:
- **Compensación de exposición** (`compensacion_ev`): Ofrecer valores anteriores del mismo equipo (ej: "0") más "Otro valor". Si no se usó, "0".
- **Modo de medición** (`medicion`): Ofrecer modos anteriores del mismo equipo más las opciones estándar: "Matricial/Evaluativa", "Ponderada al centro", "Puntual", "Parcial". Si no lo sabe, `null`.
- **Balance de blancos** (`balance_blancos`): Ofrecer valores anteriores del mismo equipo más las opciones estándar: "Automático", "Luz día", "Nublado", "Sombra", "Tungsteno", "Fluorescente", "Flash", "Personalizado", o un valor en Kelvin (ej: "5500K"). Si no lo sabe, `null`.

**Nota sobre AskUserQuestion:** Las preguntas 2–5 se pueden agrupar en un solo AskUserQuestion con 4 preguntas simultáneas, y la pregunta 6 en otro AskUserQuestion con 3 preguntas. Esto reduce el número de interacciones a 3 en total (equipo, datos principales, datos secundarios). Si AskUserQuestion no soporta más de 4 preguntas, dividir en bloques de máximo 4.

Los datos se guardan en el campo `datos_toma` del JSON (ver paso 3d).

#### Cómo usar los datos de toma en la evaluación técnica

Cuando el usuario proporcione datos de toma, úsalos para contextualizar y ser más preciso en la evaluación de los aspectos técnicos:

- **Exposición**: La compensación EV revela si la exposición fue una decisión consciente. El modo de medición explica por qué puede haber sobre/subexposición (matricial en contraluz tiende a subexponer el sujeto, puntual indica decisión deliberada sobre qué zona exponer).
- **Nitidez**: A f/1.4–2.8 es normal algo de suavidad por aberraciones; a f/5.6–11 se espera máxima nitidez del objetivo. Velocidad baja + focal larga = riesgo de trepidación (regla: velocidad ≥ 1/focal, o 1/(focal×1.5) en crop). Si hay motion blur con velocidad alta, el problema es enfoque, no movimiento.
- **Enfoque y profundidad**: El diafragma explica directamente la profundidad de campo. En sensor crop, f/2.8 equivale a ~f/4.2 en full frame en DoF. Un f/1.4 en full frame tiene DoF mínima — el enfoque crítico es un logro.
- **Ruido y limpieza**: ISO alto en crop es más problemático que en full frame. ISO 6400 en APS-C genera más ruido que en full frame. Si el ISO es alto pero la imagen está limpia, es mérito del procesado o de un sensor excelente.
- **Procesado**: Si el ISO es alto, una reducción de ruido más agresiva es justificable. Si es bajo y hay ruido, el procesado tiene un problema.
- **Iluminación**: Velocidad lenta o ISO alto indican poca luz disponible — contextualiza las limitaciones del fotógrafo.
- **Balance de blancos**: Si fue automático y hay dominante de color, es un fallo del auto-WB que podría haberse corregido. Si fue manual (Kelvin, preajuste), es una decisión creativa consciente — evalúa si funciona, no si es "correcta".
- **Color**: El balance de blancos afecta directamente a la paleta cromática. Un WB intencional puede crear paletas frías o cálidas deliberadas.

Si no hay datos de toma disponibles, evalúa normalmente basándote solo en lo que se observa en la imagen.

#### Evaluación completa

Evalúa los 20 aspectos de las 3 partes. Para cada aspecto genera:
- `puntuacion`: nota 0.0–10.0 siguiendo la escala definida
- `comentario`: qué observas en la imagen respecto a este aspecto (1–2 frases, sé específico)
- `mejora`: cómo mejorar concretamente este aspecto (1–2 frases, sé práctico y accionable)

Después genera para **cada parte** (tecnica, artistica, excepcional):
- `puntuacion_parte`: media aritmética de sus aspectos (redondear a 1 decimal)
- `lo_bueno`: 2–3 frases describiendo las fortalezas de la foto en esta parte. ¿Qué funciona bien? ¿Qué destaca? Sé concreto y referencia los aspectos que más puntúan.
- `lo_mejorable`: 2–3 frases describiendo las debilidades y el camino de mejora en esta parte. ¿Qué lastra la puntuación? ¿Qué acciones concretas subirían la nota? Referencia los aspectos que menos puntúan.

Después calcula a **nivel general**:
- `puntuacion_total` con la fórmula ponderada
- `lo_bueno`: 2–3 frases con una visión global de las fortalezas de la foto. No repitas lo de cada parte — sintetiza lo que hace que esta foto funcione en su conjunto, cruzando técnica y arte.
- `lo_mejorable`: 2–3 frases con una visión global de las áreas de mejora. Identifica el patrón general que conecta las debilidades de las distintas partes y qué dirección debería tomar el fotógrafo.
- `potencial`: puntuación estimada (0.0–10.0) si se aplican las mejoras más impactantes. Debe ser mayor que `puntuacion_total` salvo que la foto ya sea excelente. Sé realista.

### 3c. Mover original a originales/

```bash
mv "/Users/ignacio/Sites/fotos/pendientes/NOMBRE_ARCHIVO" "/Users/ignacio/Sites/fotos/originales/NOMBRE_ARCHIVO"
```

Si es una actualización (detectada en 3a), sobrescribe el existente en `originales/`.

Obtén las dimensiones en píxeles del archivo ya movido:

```bash
sips -g pixelWidth -g pixelHeight "/Users/ignacio/Sites/fotos/originales/NOMBRE_ARCHIVO"
```

Guarda el resultado como `"ANCHOxALTO"` (ej: `"3406x3406"`, `"6048x4024"`) en el campo `dimensiones` del paso 3d. Si `sips` no puede leer el archivo (algunos RAW no soportados), usa `null` en ese campo y continúa sin bloquear el flujo.

### 3d. Crear entrada JSON

Crea un objeto con esta estructura exacta:

```json
{
  "titulo": "Gaviota al vuelo",
  "nombre": "gaviota-vuelo.jpg",
  "descripcion": "Una gaviota capturada en pleno vuelo sobre el mar al atardecer, con las alas extendidas y el sol dorando su plumaje.",
  "lugar": "Playa de la Caleta",
  "ubicacion": "Cádiz",
  "categorias": ["Aves"],
  "etiquetas": ["gaviota", "vuelo", "atardecer", "mar", "costa", "ave marina"],
  "fecha": "2026-03-15",
  "path": "originales/gaviota-vuelo.jpg",
  "dimensiones": "6048x4024",
  "datos_toma": {
    "camara": "Canon R7",
    "objetivo": "100-400mm f/4.5-5.6 L IS II",
    "iso": 1600,
    "diafragma": "f/5.6",
    "obturador": "1/2000s",
    "focal": "400mm",
    "compensacion_ev": "+0.3",
    "medicion": "Puntual",
    "balance_blancos": "Automático"
  },
  "evaluacion": {
    "fecha_evaluacion": "2026-04-11",
    "tecnica": {
      "exposicion": {
        "puntuacion": 8.0,
        "comentario": "Exposición bien equilibrada, buen rango dinámico en cielo y plumaje.",
        "mejora": "Usar compensación de exposición +0.3 para evitar subexposición en plumaje blanco."
      },
      "nitidez": {
        "puntuacion": 7.5,
        "comentario": "Enfoque preciso en el ojo de la gaviota, ligera suavidad en las puntas de las alas por movimiento.",
        "mejora": "Subir velocidad de obturación a 1/2000s para congelar completamente las alas."
      },
      "color": {
        "puntuacion": 8.5,
        "comentario": "Paleta cálida coherente con tonos dorados del atardecer.",
        "mejora": "Un leve split-toning con sombras azuladas aumentaría la profundidad cromática."
      },
      "balance_blancos": {
        "puntuacion": 7.0,
        "comentario": "Ligeramente cálido, aceptable para la hora dorada.",
        "mejora": "Ajustar temperatura -200K para neutralizar dominante ámbar en sombras del mar."
      },
      "composicion": {
        "puntuacion": 8.0,
        "comentario": "Gaviota en el tercio superior, buena dirección de vuelo hacia espacio abierto.",
        "mejora": "Incluir más espacio por delante de la dirección de vuelo para aumentar la sensación de movimiento."
      },
      "iluminacion": {
        "puntuacion": 9.0,
        "comentario": "Luz lateral dorada excelente, sombras suaves en el cuerpo, contraluz en las alas.",
        "mejora": "Sin mejoras significativas — la iluminación es óptima para esta escena."
      },
      "enfoque_profundidad": {
        "puntuacion": 7.5,
        "comentario": "Buena separación sujeto-fondo, bokeh del mar agradable.",
        "mejora": "Abrir medio punto más para mayor separación del fondo."
      },
      "ruido_limpieza": {
        "puntuacion": 7.0,
        "comentario": "Ruido visible en las sombras del agua, aceptable para la hora.",
        "mejora": "Aplicar reducción de ruido selectiva en las zonas oscuras del mar."
      },
      "procesado": {
        "puntuacion": 7.5,
        "comentario": "Revelado natural sin artefactos, transiciones tonales suaves. Leve exceso de claridad en el cielo.",
        "mejora": "Reducir claridad/definición en el cielo con máscara de luminosidad para evitar halos."
      },
      "puntuacion_parte": 7.7,
      "lo_bueno": "Excelente aislamiento del sujeto con bokeh cremoso y enfoque preciso en el ave. La imagen es muy limpia, sin ruido ni artefactos, y el revelado desaturado mantiene coherencia sin perder naturalidad. La exposición conserva detalle tanto en plumaje claro como en alas oscuras.",
      "lo_mejorable": "La iluminación difusa de día nublado, aunque buena para textura, no aporta drama ni volumen al sujeto. El balance de blancos es correcto pero plano. Buscar luz lateral o contraluz en hora dorada elevaría significativamente la parte técnica."
    },
    "artistica": {
      "emocion": {
        "puntuacion": 8.0,
        "comentario": "Transmite libertad y serenidad, la gaviota en vuelo evoca calma contemplativa.",
        "mejora": "Un segundo elemento (otra ave, un barco lejano) podría añadir escala emocional."
      },
      "narrativa": {
        "puntuacion": 6.5,
        "comentario": "Escena de vuelo bonita pero sin tensión narrativa clara.",
        "mejora": "Capturar el momento de la gaviota pescando o interactuando con otra ave añadiría historia."
      },
      "momento": {
        "puntuacion": 7.0,
        "comentario": "Buena extensión de alas, buen timing en la posición del vuelo.",
        "mejora": "Esperar al instante de máxima extensión o al momento justo antes de un picado."
      },
      "intencion": {
        "puntuacion": 7.5,
        "comentario": "Se nota la intención de capturar el ave en su elemento con luz dorada.",
        "mejora": "Definir si el protagonista es la gaviota o el atardecer — enfocar las decisiones en uno."
      },
      "originalidad": {
        "puntuacion": 5.5,
        "comentario": "Gaviota en vuelo es un tema muy fotografiado, composición clásica.",
        "mejora": "Buscar un ángulo desde abajo, un contraluz extremo, o un momento de acción inusual."
      },
      "atmosfera": {
        "puntuacion": 7.5,
        "comentario": "La luz dorada y el mar en calma crean un ambiente cálido y contemplativo. Se percibe la brisa costera.",
        "mejora": "Esperar a condiciones atmosféricas más dramáticas (bruma marina, nubes bajas) para intensificar el ambiente."
      },
      "conexion": {
        "puntuacion": 5.0,
        "comentario": "La gaviota está demasiado lejana y de perfil para generar conexión directa con el espectador.",
        "mejora": "Acercarse más o usar teleobjetivo largo, buscar contacto visual directo con el ave."
      },
      "puntuacion_parte": 6.4,
      "lo_bueno": "El momento de caza capturado con timing excelente construye una narrativa inmediata que el espectador entiende sin palabras. Se percibe intención clara del fotógrafo en las decisiones técnicas y el resultado transmite la energía primitiva del instante.",
      "lo_mejorable": "La originalidad es el punto débil: aves en vuelo es un género saturado y la perspectiva es convencional. La conexión con el sujeto se resiente porque el ave no mira al espectador. Buscar ángulos inusuales y contacto visual transformaría la parte artística."
    },
    "excepcional": {
      "tecnica_emocion": {
        "puntuacion": 6.0,
        "comentario": "Técnica sólida que acompaña la emoción, pero no la amplifica de forma extraordinaria.",
        "mejora": "Buscar momentos donde la técnica (barrido, silueta, contraluz) intensifique la emoción."
      },
      "momento_irrepetible": {
        "puntuacion": 3.0,
        "comentario": "Escena reproducible cualquier tarde despejada en la costa.",
        "mejora": "Esperar a condiciones extraordinarias: tormenta acercándose, bandada masiva, presa en el pico."
      },
      "estilo_impacto": {
        "puntuacion": 4.5,
        "comentario": "Imagen agradable pero no detiene al espectador ni tiene firma personal reconocible.",
        "mejora": "Desarrollar un tratamiento (color, composición extrema, procesado) que sea tu sello."
      },
      "trascendencia": {
        "puntuacion": 2.0,
        "comentario": "Foto de una gaviota al atardecer — bonita pero no comunica nada universal más allá de la escena.",
        "mejora": "Buscar momentos donde el ave simbolice algo mayor: libertad contra adversidad, soledad, supervivencia."
      },
      "puntuacion_parte": 3.9,
      "lo_bueno": "Hay sinergia entre técnica y emoción: la velocidad de obturación y el bokeh amplifican la intensidad del momento. El tratamiento desaturado empieza a definir una voz visual propia.",
      "lo_mejorable": "La escena es reproducible con paciencia, lo que limita la irrepetibilidad. La imagen no trasciende hacia lo universal ni tiene aún una firma estilística consolidada. Esperar a momentos genuinamente únicos y desarrollar el estilo personal con consistencia."
    },
    "puntuacion_total": 6.3,
    "lo_bueno": "Foto que combina solidez técnica con un momento de acción bien capturado. El dominio del equipo es evidente: enfoque preciso, aislamiento perfecto y procesado coherente. La narrativa de caza funciona y transmite energía real.",
    "lo_mejorable": "El conjunto se queda en 'buena foto de naturaleza' sin alcanzar lo memorable. Le falta una perspectiva que sorprenda, un momento verdaderamente irrepetible, y un estilo visual más definido. La dirección es correcta — necesita atrevimiento en encuadres y paciencia para condiciones extraordinarias.",
    "resumen": "Foto técnicamente competente con excelente iluminación natural. La gaviota está bien capturada pero el tema es común y le falta un elemento narrativo fuerte que la distinga. El mayor potencial está en capturar un momento más decisivo o una perspectiva menos convencional.",
    "potencial": 8.2,
    "mejora_prioritaria": "Esperar a un momento de acción (picado, pesca, interacción) con la misma luz dorada para combinar técnica con narrativa."
  }
}
```

## Paso 4: Actualizar fotos.json

1. Combina las entradas existentes del JSON con las nuevas.
2. Para actualizaciones, reemplaza la entrada existente con la nueva.
3. Escribe el array completo en `/Users/ignacio/Sites/fotos/fotos.json` con la herramienta Write. El JSON debe estar formateado con indentación de 2 espacios.

## Paso 5: Mostrar resumen

Muestra una tabla con el resumen de todas las imágenes evaluadas:

| Foto | Categorías | Técnica | Artística | Excepcional | Total | Potencial |
|------|------------|---------|-----------|-------------|-------|-----------|
| gaviota-vuelo.jpg | Aves | 7.8 | 6.9 | 4.5 | 6.8 | 8.2 |
| piramides-guiza.jpg | Viaje, Paisaje | 7.2 | 6.8 | 5.0 | 6.6 | 8.0 |

Después de la tabla, para cada foto muestra:
- **Resumen**: el texto del resumen de evaluación
- **Mejora prioritaria**: la acción más impactante

Al final:
- Cuántas fotos se evaluaron
- Si hubo algún problema o advertencia
- Las fotos con mayor potencial de mejora (mayor diferencia entre `puntuacion_total` y `potencial`)

**Sección en el portfolio:** Para cada foto evaluada, indica en qué sección del gallery aparecerá y si entrará en el mosaico. La sección se determina truncando `puntuacion_total` a la baja (`Math.floor()`). Formato:

`📍 "Gaviota al vuelo" (6.3) → sección **6** del portfolio · aparece en el mosaico`
`📍 "Foto borrosa" (5.1) → sección **5** del portfolio · no aparece en el mosaico (mínimo 6.0)`

Ejemplos: 7.8 → sección 7; 7.0 → sección 7; 8.9 → sección 8. El mosaico (`mosaico.html`) muestra solo fotos con `puntuacion_total ≥ 6.0`, ordenadas de mayor a menor, con tamaño proporcional a la puntuación (8+ grande, 7 mediano, 6 pequeño).

## Paso 6: Plan de repetición

Para CADA foto evaluada en esta sesión, después de mostrar el resumen:

### 6a. Preguntar si la foto es repetible

Usa AskUserQuestion para preguntar al usuario:

**"¿Podrías volver a hacer esta foto? [título de la foto]"**

Opciones:
- **"Sí, puedo volver"** — el usuario puede regresar al lugar (ej: un parque de Madrid, un monumento local)
- **"No, fue irrepetible"** — viaje único, evento puntual, momento irrecuperable
- **"Ya no me interesa"** — el usuario no quiere repetirla

Si la respuesta es "Sí, puedo volver", continúa con 6b. Si no, salta a la siguiente foto (o termina si era la última).

Si la foto ya tiene un campo `repetir` (por una evaluación anterior), preguntar si desea actualizarlo con la nueva evaluación.

### 6b. Recoger notas de acceso

Usa AskUserQuestion para preguntar:

**"¿Alguna nota sobre cómo llegar o cuándo ir? (horarios, acceso, aparcamiento, época del año...)"**

El usuario puede dar texto libre o responder "Nada en particular". Si da información, se guarda en `notas_acceso`. Si no aporta nada, genera una nota básica a partir de la ubicación conocida.

### 6c. Generar el plan de repetición

Analiza TODOS los campos `mejora` de los 20 aspectos, los campos `lo_mejorable` de las 3 partes, el `lo_mejorable` general, la `mejora_prioritaria` y el `potencial`. Consolida todo en un plan coherente y accionable.

**Estructura del campo `repetir`:**

```json
"repetir": {
  "fecha_plan": "2026-04-12",
  "notas_acceso": "Texto libre del usuario",
  "puntuacion_actual": 6.8,
  "potencial_estimado": 8.2,
  "margen": 1.4,
  "meses": ["dic", "ene"],
  "condiciones_ideales": {
    "momento_dia": "Hora dorada (7:00-8:30 o 18:30-20:00)",
    "estacion": "Invierno (nov-mar)",
    "clima": "Nubes parciales o niebla",
    "luz": "Lateral baja, contraluz"
  },
  "plan_tecnico": {
    "equipo": "Cámara + objetivo recomendado",
    "ajustes_clave": "Velocidad, apertura, ISO, medición",
    "enfoque": "Modo AF, zona, detección"
  },
  "plan_composicion": "Síntesis de mejoras de composición, enfoque, conexión, originalidad",
  "plan_momento": "Síntesis de mejoras de momento, momento_irrepetible, narrativa, emoción",
  "plan_artistico": "Síntesis de mejoras de intención, originalidad, estilo, trascendencia, atmósfera",
  "plan_procesado": "Síntesis de mejoras de procesado, color, balance_blancos, ruido",
  "resumen_plan": "2-3 frases ejecutivas — lo que leer antes de salir de casa"
}
```

**Campo `meses`:** Array con los meses ideales para repetir la foto, usando códigos de 3 letras: `"ene"`, `"feb"`, `"mar"`, `"abr"`, `"may"`, `"jun"`, `"jul"`, `"ago"`, `"sep"`, `"oct"`, `"nov"`, `"dic"`. Si la foto se puede repetir en cualquier momento del año, usar `["todos"]`. Determina los meses ideales a partir de las condiciones de luz, estacionalidad del sujeto (fauna migratoria, flora en flor, etc.) y restricciones del lugar. Ejemplos:
- Guardia del Palacio Real con sol bajo invernal → `["dic", "ene"]`
- Aves acuáticas en un parque → `["oct", "nov", "dic", "ene", "feb", "mar"]`
- Libélulas en verano → `["jun", "jul", "ago", "sep"]`
- Monumento accesible siempre → `["todos"]`

**Reglas de consolidación:**
- **NO copies las 20 mejoras individualmente.** Sintetiza y agrupa por área temática.
- Prioriza las mejoras con mayor impacto en la puntuación. Los aspectos con puntuación < 5.0 son prioritarios.
- Sé específico al lugar: si la foto es de la Casa de Campo, menciona el lago, la hora del sol en esa orientación, la época en que las aves están activas.
- Los campos `puntuacion_actual`, `potencial_estimado` se copian de `evaluacion.puntuacion_total` y `evaluacion.potencial`. El `margen` = `potencial_estimado` - `puntuacion_actual`.
- El `resumen_plan` debe ser una guía ejecutable de 2-3 frases que el fotógrafo pueda leer antes de salir de casa.

### 6d. Guardar en el JSON

Añade el campo `repetir` al objeto de la foto en el array JSON (mismo nivel que `evaluacion`). Luego lee el JSON actual con Read, actualiza la entrada correspondiente, y escribe el JSON completo con Write.

Si el usuario indica que la foto NO es repetible, NO añadas el campo `repetir` a esa foto.

## Notas importantes

- Lee la imagen directamente desde `pendientes/` con la herramienta Read — Claude es multimodal y analiza imágenes visualmente.
- Si Read falla con un formato RAW específico, informa al usuario y sugiere convertir manualmente a JPEG antes de evaluar.
- Nunca sobrescribas archivos en `originales/` sin preguntar primero (paso 3a).
- El JSON debe ser la fuente de verdad. Siempre lee el JSON existente antes de escribir.
- Las rutas en `path` son relativas al proyecto (`originales/foto.jpg`), no absolutas.
- El campo `dimensiones` guarda el tamaño real en píxeles del archivo en `originales/` (formato `"ANCHOxALTO"`), obtenido con `sips -g pixelWidth -g pixelHeight`. Es el tamaño original, no el de ninguna exportación posterior (eso ya lo guarda `instagram.dimensiones` cuando aplica).
- **Coherencia de puntuación**: antes de evaluar una nueva foto, revisa las puntuaciones de las fotos existentes en el JSON para mantener la escala relativa. Si la foto nueva es claramente mejor que una existente con 7.0, debe puntuar por encima. Si es peor, por debajo.
- **Mejoras accionables**: cada sugerencia de mejora debe ser algo que el fotógrafo pueda hacer concretamente — no generalidades vagas como "mejorar la composición", sino instrucciones específicas como "incluir más cielo por encima del sujeto para dar espacio de respiro".
