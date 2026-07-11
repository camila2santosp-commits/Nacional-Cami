# Planificador de Preventivos - Club Nacional de Football

Una aplicación web para generar preventivos (entrenamientos de pre-entrenamiento) personalizados cruzando automáticamente datos de evaluaciones físicas, antecedentes clínicos y una base de ejercicios clasificada.

## ✨ Características

- 📊 **Gestión de datos**: Carga evaluaciones desde Excel o Google Drive
- 🎯 **Generador automático**: Sugiere ejercicios basado en déficits y antecedentes
- 💪 **Base de 41 ejercicios**: Clasificados por categoría, grupo muscular y aplicabilidad
- 📅 **Microciclo semanal**: Modula ejercicios según carga del día (suave/media/alta/partido/libre)
- 📄 **Exportación PDF**: Genera fichas imprimibles con identidad del club
- 👥 **Grupos de preventivo**: Agrupa jugadores por objetivo común
- 💾 **Backup local**: Toda la información se guarda en localStorage
- 🎬 **Integración YouTube**: Embebe videos de ejercicios desde tu canal

## 🚀 Instalación

### Opción 1: Usar directamente (sin servidor)
```bash
1. Clona o descarga este repositorio
2. Abre index.html en tu navegador (Ctrl+O o doble-click)
3. ¡Listo! La app funciona completamente offline
```

### Opción 2: Con servidor local (recomendado para desarrollo)
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (si tienes http-server instalado)
npx http-server

# Luego accede a: http://localhost:8000
```

## 📋 Cómo usar

### Primer inicio
1. La app carga con 3 jugadores de prueba
2. Todos los datos se guardan automáticamente en localStorage del navegador

### Cargar datos reales
**TAB "DATOS":**
1. **Carga local**: Arrastra un archivo Excel con evaluaciones
2. **Google Drive**: Cuando configures los conectores, podrás descargar automáticamente

**Formato Excel esperado** (ajustable en `js/parser.js`):
```
Nombre | Posición | WBLT D | WBLT I | Psoas D | ... | CMJ Landing % | Nordic % | ...
Jugador 1 | Delantero | 10.5 | 10.8 | 3 | ... | 8 | 11 | ...
```

### Generar preventivos
**TAB "PREVENTIVOS":**
1. Selecciona jugador o grupo
2. Elige día de la semana y carga del día
3. Click "Generar"
4. Ajusta ejercicios manualmente si es necesario
5. Exporta a PDF

### Gestionar ejercicios
**TAB "EJERCICIOS":**
- Ver los 41 ejercicios base
- Filtrar por categoría o grupo muscular
- Agregar nuevos ejercicios (se guardan en localStorage)
- Asignar videos de YouTube
- Editar o eliminar ejercicios

### Configuración
**TAB "CONFIG":**
- Definir microciclo semanal (carga por día)
- Crear grupos de jugadores
- Exportar/importar datos (backup JSON)
- Configurar conectores de Google Drive y YouTube

## 🔌 Conectores (Google Drive + YouTube)

### Google Drive
Para que la app lea tus Excels de evaluaciones desde Drive:

1. **Crear proyecto en Google Cloud Console** (gratis)
   - Ve a https://console.cloud.google.com
   - Crea un nuevo proyecto: "Nacional Preventivos"

2. **Habilitar APIs**
   - Busca "Google Drive API" → Habilitar
   - Busca "YouTube Data API v3" → Habilitar

3. **Crear credenciales OAuth**
   - Credenciales → Crear OAuth 2.0 Client ID
   - Tipo: "Aplicación web"
   - JavaScript origins: `http://localhost:8000`
   - Copia el **Client ID**

4. **En la app** (TAB "Config" → "Conectores")
   - Ingresa tu Client ID
   - Ingresa el ID de tu carpeta Drive (está en la URL: `drive.google.com/drive/folders/1a2b3c...`)
   - Click "Guardar conectores"

5. **Conectar Google**
   - Botón azul en el header
   - Autoriza la app
   - TAB "Datos" → "Cargar desde Drive"

### YouTube
Para videos de ejercicios desde tu canal privado:

1. En tu canal YouTube, obtén el ID: `youtube.com/channel/UCxxxxxxx...`
2. TAB "Config" → "Conectores" → Ingresa el ID
3. Sube videos a tu canal privado
4. Asigna video IDs a ejercicios (TAB "Ejercicios" → "Agregar Ejercicio")

## 📊 Estructura de datos

### Jugador
```javascript
{
  id: "player_...",
  nombre: "Verónica Lupi",
  posicion: "Mediocampista",
  antecedentes: ["Post-LCA", "Aquiles (antecedente)"],
  evaluationData: {
    tobilloD_cm: 8.5,
    tobilloI_cm: 9.2,
    cmjLanding_pctAsimetria: 12,
    nordic_pctAsimetria: 16,
    // ... más métricas
  },
  detectedDeficits: [
    { name: "Tobillo", status: "rojo", label: "Déficit" }
  ]
}
```

### Ejercicio
```javascript
{
  id: "ex_1",
  nombre: "Nordic Curl",
  categoria: "Fuerza",
  muscleGroup: "Isquiotibiales",
  description: "Ejercicio excéntrico de isquiotibiales",
  deficitAplica: ["Nordic"],
  antecedenteAplica: ["Isquiotibiales (antecedente)"],
  youtubeId: "dQw4w9WgXcQ"
}
```

### Preventivo (generado)
```javascript
{
  playersIds: ["player_1", "player_2"],
  playersNames: ["Juan Pérez", "Carlos Rodríguez"],
  date: "11/07/2026 14:30",
  dayOfWeek: "viernes",
  loadIntensity: "media",
  commonDeficits: [
    { name: "Nordic", count: 2, status: "rojo" }
  ],
  commonAntecedents: [
    { name: "Post-LCA", count: 2 }
  ],
  suggestedExercises: [ /* ... */ ]
}
```

## 🎨 Identidad Visual

- **Colores**: Navy (#0A1E4D, #001845), Rojo Nacional (#C8102E), Blanco
- **Tipografía**: Oswald (títulos), Inter (cuerpo)
- **Semáforo**: Verde (<10%), Amarillo (10-15%), Rojo (>15%)
- **Estructura**: Estilo ficha de rendimiento deportivo con números grandes

## 📦 Almacenamiento

Todos los datos se guardan en `localStorage` del navegador:
- Jugadores
- Ejercicios
- Grupos
- Microciclo
- Historial de preventivos
- Conectores

Para hacer backup: TAB "Config" → "Exportar Datos" → descarga JSON
Para restaurar: TAB "Config" → "Importar Datos" → sube el JSON

## 🔒 Privacidad

- ✓ Todo se procesa localmente en tu navegador
- ✓ Sin servidor externo (excepto Google Drive/YouTube si configuras)
- ✓ Los datos no se envían a terceros

## 🛠️ Desarrollo

### Estructura de carpetas
```
nacional-cami/
├── index.html              # Única página
├── css/styles.css          # Estilos (identidad Nacional)
├── js/
│   ├── data.js            # Base de 41 ejercicios
│   ├── storage.js         # localStorage
│   ├── logic.js           # Lógica de semáforo y generador
│   ├── parser.js          # Parsear Excel (SheetJS)
│   ├── pdf.js             # Exportar PDF (html2canvas + jsPDF)
│   ├── auth.js            # OAuth2 con Google
│   └── app.js             # Orquestador principal
├── assets/
│   └── logo-nacional.svg  # Logo del club
└── README.md              # Este archivo
```

### Librerías (vía CDN)
- **SheetJS**: Parsear Excel
- **jsPDF + html2canvas**: Exportar PDF
- **Google APIs**: OAuth2 y acceso a Drive/YouTube

### Próximas mejoras
- [ ] Subir Excel desde la app a Google Drive
- [ ] Integración más completa con YouTube (playlist de canal)
- [ ] Más gráficos y análisis de datos
- [ ] Exportar a otros formatos (Excel, Notion)
- [ ] Aplicación mobile (React Native)

## 📞 Soporte

**Problemas comunes:**

❌ "Conectores no configurados"
→ TAB Config → ingresa Client ID de Google y IDs de Drive/YouTube

❌ "Error al parsear Excel"
→ Verifica que el formato coincida con lo esperado
→ Ajusta los nombres de columnas en `js/parser.js`

❌ Los datos no se guardan
→ Verifica que localStorage esté habilitado en el navegador
→ En navegación privada/incógnito NO se persisten datos

## 📄 Licencia

Uso personal - Club Nacional de Football

---

**Versión**: 1.0
**Última actualización**: Julio 2026
**Desarrollado por**: Claude Code con ❤️
