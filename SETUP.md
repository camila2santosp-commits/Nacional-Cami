# Guía de Setup - Planificador de Preventivos

## 🎯 Primeros pasos

### 1. Abrir la app

**Opción A: Directamente (sin servidor - más simple)**
```bash
# Windows: doble-click en index.html
# Mac/Linux: abrir index.html en navegador (Ctrl+O)
```

**Opción B: Con servidor local (recomendado)**
```bash
# En la carpeta del proyecto:
./run-local.sh

# O manualmente:
python3 -m http.server 8000
# Accede a: http://localhost:8000
```

### 2. Primer vistazo

La app carga automáticamente con **3 jugadores de prueba**:
- Verónica Lupi (Mediocampista)
- Juan Pérez (Delantero)  
- Carlos Rodríguez (Defensa)

**TAB "Datos"**: Verás a los 3 jugadores con sus déficits detectados
**TAB "Preventivos"**: Prueba generar un preventivo para uno de ellos
**TAB "Ejercicios"**: Explora la base de 41 ejercicios
**TAB "Config"**: Ve las opciones disponibles

---

## 🔧 Configuración de Conectores (Google Drive + YouTube)

### Sin conectores, la app funciona 100% offline
- Cargar Excel manualmente
- Todos los datos se guardan en localStorage
- Exportar a PDF sin conexión

### Con conectores, puedes:
- 📁 Descargar automáticamente Excels desde Google Drive
- 🎬 Embeber videos de tu canal privado de YouTube

---

## 📊 Configurar Google Drive

### Paso 1: Crear proyecto en Google Cloud Console
```
1. Ve a: https://console.cloud.google.com
2. Clic en "Crear proyecto"
3. Nombre: "Nacional Preventivos"
4. Espera a que se cree (1-2 min)
```

### Paso 2: Habilitar APIs
```
1. En Google Cloud Console, busca: "Google Drive API"
2. Haz clic en "Habilitar"
3. Busca: "YouTube Data API v3"
4. Haz clic en "Habilitar"
```

### Paso 3: Crear credenciales OAuth2
```
1. En el menú izquierdo: "Credenciales"
2. Click: "Crear credencial" → "OAuth 2.0 Client ID"
3. Selecciona: "Aplicación web"
4. En "JavaScript origins", agrega:
   - http://localhost:8000 (para pruebas locales)
   - https://tudominio.com (cuando despliegues)
5. Haz clic en "Crear"
6. Copia el "Client ID" (algo como: xxx.apps.googleusercontent.com)
```

### Paso 4: Obtener ID de tu carpeta Drive
```
1. Ve a Google Drive
2. Crea una carpeta: "Nacional - Evaluaciones"
3. Abre esa carpeta
4. En la URL, copia el ID (después de /folders/):
   https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0j
   El ID es: 1a2b3c4d5e6f7g8h9i0j
```

### Paso 5: Configurar en la app
```
TAB "Config" → "Conectores"
1. ID Google Drive: pega tu Client ID
2. ID Carpeta Drive: pega el ID de la carpeta
3. Click "Guardar"

Luego:
TAB "Datos" → "Cargar desde Drive" 
(Se deshabilitará si falta config)
```

---

## 📹 Configurar YouTube

### Obtener ID del canal
```
1. Ve a: https://youtube.com/@tuCanal
2. En la URL, busca el ID o ve a "Acerca de"
3. ID formato: UC... (ej: UCdQw4w9WgXcQ)
```

### Configurar en la app
```
TAB "Config" → "Conectores"
1. ID Canal YouTube: pega tu ID
2. Click "Guardar"
```

### Agregar videos a ejercicios
```
TAB "Ejercicios" → "Agregar Ejercicio"
1. Completa datos del ejercicio
2. En "Video YouTube ID": pega el ID (ej: dQw4w9WgXcQ)
3. Guardar

Ahora ese ejercicio tendrá un botón "▶️ Ver video"
```

---

## 📝 Cargar evaluaciones (Excel)

### Formato esperado
La app espera un Excel con estas columnas:
```
Nombre | Posición | WBLT D | WBLT I | Psoas D | Psoas I | ... | CMJ Landing % | Nordic %
Jugador 1 | Delantero | 10.5 | 10.8 | 3 | 3 | ... | 8 | 11
```

**Columnas reconocidas automáticamente:**
- `Nombre`, `nombre`, `Jugador`
- `Posición`, `posicion`, `Pos`
- `WBLT D`, `Tobillo D` (en cm)
- `WBLT I`, `Tobillo I` (en cm)
- `Psoas D`, `Psoas I` (score 1-3)
- `Rot Cadera D`, `Hip Rot D` (score 1-3)
- `Rot Cadera I`, `Hip Rot I` (score 1-3)
- `CMJ Height` (cm)
- `CMJ Landing %` (asimetría)
- `CMJ Impulso Exc %` (asimetría)
- `CMJ Impulso Conc %` (asimetría)
- `RSI Mod` (ms)
- `ISO Cuad %`, `Asimetría Cuad` (asimetría)
- `ISO Isquios %`, `Asimetría Isquios` (asimetría)
- `Nordic %`, `Asimetría Nordic` (asimetría)
- `Aductores %`, `Asimetría Aductores` (asimetría)
- `Abductores %`, `Asimetría Abductores` (asimetría)
- `Antecedentes`, `IDP` (para etiquetas clínicas)

### Cómo cargar
```
TAB "Datos" → "Carga Local"
1. Arrastra tu Excel aquí (o haz click "Seleccionar archivo")
2. La app automáticamente:
   - Parsea los datos
   - Detecta déficits
   - Calcula semáforo
3. ✓ Los jugadores aparecen en la tabla
```

---

## 🎯 Usar el generador de preventivos

### Paso a paso
```
TAB "Preventivos"
1. Selecciona: Jugador o Grupo
2. Selecciona: Día de la semana
3. Selecciona: Carga del día (suave/media/alta/partido/libre)
4. Click: "Generar"
5. Aparece:
   - Perfil del jugador (con antecedentes y déficits)
   - Ejercicios sugeridos (automáticamente filtrados)
6. Puedes:
   - Editar ejercicios manualmente
   - Click "▶️ Ver video" para cada ejercicio
   - "📄 Exportar a PDF" → descarga ficha imprimible
   - "💾 Guardar en Historial" → guarda para referencia
```

### Cómo funciona la sugerencia automática
1. La app detecta déficits de cada jugador
2. Si seleccionas un GRUPO, agrega los déficits comunes
3. Busca ejercicios que apliquen a:
   - Los déficits detectados
   - Los antecedentes clínicos
   - La carga del día (ej: sin pliometría en carga alta)
4. Los ejercicios se ordenan por relevancia

---

## 📅 Configurar microciclo semanal

El microciclo modula qué ejercicios se sugieren:
```
TAB "Config" → "Microciclo Semanal"
1. Cada día: selecciona carga (suave/media/alta/partido/libre)
2. Ejemplo:
   - Lunes: Media
   - Martes: Alta
   - Miércoles: Media
   - Jueves: Suave
   - Viernes: Alta
   - Sábado: Media
3. Click "Guardar Microciclo"
```

**Efecto en ejercicios sugeridos:**
- **Días de carga suave/libre**: Más movilidad y activación
- **Días de carga media**: Balance de todo
- **Días de carga alta/partido**: Menos pliometría intensa

---

## 👥 Crear grupos de jugadores

```
TAB "Config" → "Gestión de Grupos"
1. Click: "+ Nuevo Grupo"
2. Ingresa nombre: ej "Grupo Aquiles", "Grupo Post-LCA"
3. En "Preventivos", selecciona el grupo
4. La app muestra: ejercicios comunes a TODOS del grupo
```

---

## 💾 Backup y exportar datos

### Exportar (descarga local)
```
TAB "Config" → "Datos & Backup"
1. Click: "📥 Exportar Datos"
2. Descarga un archivo .json con TODO:
   - Jugadores
   - Ejercicios personalizados
   - Grupos
   - Microciclo
   - Historial de preventivos
```

### Importar (restaurar desde backup)
```
TAB "Config" → "Datos & Backup"
1. Click: "📤 Importar Datos"
2. Selecciona un archivo .json
3. ✓ Se restauran todos los datos
```

### Limpiar todo
```
TAB "Config" → "Datos & Backup"
1. Click: "🗑️ Limpiar Todo"
2. ⚠️ ADVERTENCIA: No se puede deshacer
3. Se borran: jugadores, ejercicios, grupos, todo
```

---

## 🖨️ Exportar preventivo a PDF

```
TAB "Preventivos"
1. Genera un preventivo (paso anterior)
2. Click: "📄 Exportar a PDF"
3. Se descarga un PDF con:
   - Header con logo Nacional
   - Nombre del jugador/grupo
   - Antecedentes clínicos (con ⚠️)
   - Déficits detectados (con semáforo)
   - Ejercicios por categoría
   - Footer con fecha
4. Imprime o comparte
```

---

## 🔍 Solucionar problemas

### ❌ "La app carga en blanco"
**Solución:**
- Verifica que abras `index.html`, no otra carpeta
- Usa un servidor local: `python3 -m http.server 8000`
- Abre la consola del navegador (F12) y busca errores rojos

### ❌ "Los datos se pierden al recargar"
**Solución:**
- localStorage solo funciona en navegadores modernos
- Si usas navegación privada/incógnito, no persiste
- Usa la misma pestaña (no abras en incógnito)

### ❌ "No puedo conectar con Google Drive"
**Solución:**
- Verifica que tengas la configuración:
  - TAB Config → Conectores → Client ID y Carpeta ID
- Haz click el botón "Conectar Google" en el header
- Si sale error, verifica que `localhost:8000` esté en Google Cloud Console

### ❌ "Los videos no se cargan"
**Solución:**
- Verifica que el YouTube ID sea correcto (formato: dQw4w9WgXcQ)
- Si es un video privado, debe estar en tu canal o compartido
- Verifica que la URL sea: `youtube.com/watch?v={ID}`

### ❌ "El PDF se ve roto o mal formateado"
**Solución:**
- Prueba con otro navegador
- Verifica que tengas internet (para cargar Oswald + Inter)
- Si no funciona, la exportación PDF es la utilidad menos crítica

---

## 🎓 Tips avanzados

### Personalizar la base de ejercicios
```
TAB "Ejercicios" → "+ Agregar Ejercicio"
1. Nombre: ej "Nordic Curl Modificado"
2. Categoría: Fuerza
3. Grupo Muscular: Isquiotibiales
4. Deficits Aplicables: Nordic, Isquiotibiales
5. Antecedentes: Isquiotibiales (antecedente)
6. Video YouTube ID: dQw4w9WgXcQ
7. Guardar

✓ El nuevo ejercicio aparece en sugerencias automáticas
```

### Editar ejercicio existente
```
TAB "Ejercicios" → Encuentra el ejercicio → "✏️ Editar"
1. Cambia lo que necesites
2. Guardar
✓ Los cambios se aplican a todos los preventivos futuros
```

### Ajustar parser de Excel
Si tu Excel tiene columnas diferentes, edita `js/parser.js`:
```javascript
// En la función convertToPlayers():
tobilloD_cm: this.parseFloat(row['TU_NOMBRE_COLUMNA_AQUI'])
```

---

## 📚 Referencia de estructura

### Categorías de ejercicios
- **Movilidad**: Estiramiento, rango de movimiento
- **Activación**: Calentamiento, preparación
- **Fuerza**: Trabajo de potencia, control
- **Pliometría-CEA**: Saltos, explosividad

### Grupos musculares
- Tobillo
- Psoas
- Cadera
- Glúteos
- Cuádriceps
- Isquiotibiales
- Aductores
- Abductores

### Antecedentes clínicos
- Post-LCA
- Isquiotibiales (antecedente)
- Aquiles (antecedente)
- Pubalgia/Aductores (antecedente)
- Esguince de tobillo (antecedente)
- Tendinopatía rotuliana (antecedente)

### Reglas de semáforo
| Métrica | Verde | Amarillo | Rojo |
|---------|-------|----------|------|
| Asimetría | <10% | 10-15% | >15% |
| Movilidad (score) | 3 | 2 | 1 |
| Tobillo WBLT | >10cm | 9.5-10cm | <9.5cm |

---

## 🚀 Próximo: Integración con Google Drive

Cuando hayas configurado los conectores:

1. **Subir Excels a tu carpeta Drive** con datos de evaluaciones
2. **TAB "Datos" → "Cargar desde Drive"** descarga automáticamente
3. Los datos se parsean igual que carga local
4. Historial de qué Excel se cargó cuándo

---

¡Listo! Ya tienes todo configurado. Comienza generando preventivos. 🎯
