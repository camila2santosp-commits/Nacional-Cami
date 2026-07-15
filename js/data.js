// Base de 41 Ejercicios de Preventivo
// Club Nacional de Football

const exercisesDatabase = [
    // MOVILIDAD - TOBILLO
    {
        id: 1,
        nombre: "Movilidad de Tobillo - Dorsiflexión",
        categoria: "Movilidad",
        muscleGroup: "Tobillo",
        description: "Trabajo de dorsiflexión en posición de rodillas",
        deficitAplica: ["Tobillo"],
        antecedenteAplica: ["Esguince de tobillo (antecedente)"],
        youtubeId: "dQw4w9WgXcQ",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    },
    {
        id: 2,
        nombre: "Movilidad de Tobillo - Inversión/Eversión",
        categoria: "Movilidad",
        muscleGroup: "Tobillo",
        description: "Trabajo lateral del tobillo",
        deficitAplica: ["Tobillo"],
        antecedenteAplica: ["Esguince de tobillo (antecedente)"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    },

    // MOVILIDAD - PSOAS
    {
        id: 3,
        nombre: "Estiramiento de Psoas",
        categoria: "Movilidad",
        muscleGroup: "Psoas",
        description: "Estiramiento en estocada para psoas",
        deficitAplica: ["Psoas"],
        antecedenteAplica: [],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    },
    {
        id: 4,
        nombre: "Flexión de Cadera Activa",
        categoria: "Movilidad",
        muscleGroup: "Psoas",
        description: "Flexión de cadera sin apoyo",
        deficitAplica: ["Psoas"],
        antecedenteAplica: [],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    },

    // MOVILIDAD - CADERA / ROTACIÓN
    {
        id: 5,
        nombre: "Rotación Interna de Cadera",
        categoria: "Movilidad",
        muscleGroup: "Cadera",
        description: "Mejora movilidad de rotación interna",
        deficitAplica: ["Rotación Cadera"],
        antecedenteAplica: ["Post-LCA"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    },
    {
        id: 6,
        nombre: "Rotación Externa de Cadera",
        categoria: "Movilidad",
        muscleGroup: "Cadera",
        description: "Mejora movilidad de rotación externa",
        deficitAplica: ["Rotación Cadera"],
        antecedenteAplica: ["Post-LCA"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    },

    // ACTIVACIÓN - GLÚTEOS
    {
        id: 7,
        nombre: "Glute Bridges",
        categoria: "Activación",
        muscleGroup: "Glúteos",
        description: "Activación de glúteos en posición supina",
        deficitAplica: ["Glúteos"],
        antecedenteAplica: ["Post-LCA", "Isquiotibiales (antecedente)"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    },
    {
        id: 8,
        nombre: "Glute Bridges Unilaterales",
        categoria: "Activación",
        muscleGroup: "Glúteos",
        description: "Activación asimétrica de glúteos",
        deficitAplica: ["Glúteos"],
        antecedenteAplica: ["Post-LCA"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    },
    {
        id: 9,
        nombre: "Clamshells",
        categoria: "Activación",
        muscleGroup: "Glúteos",
        description: "Activación de abductores",
        deficitAplica: ["Abductores"],
        antecedenteAplica: [],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    },

    // ACTIVACIÓN - ADUCTORES
    {
        id: 10,
        nombre: "Activación de Aductores",
        categoria: "Activación",
        muscleGroup: "Aductores",
        description: "Ejercicio específico para aductores",
        deficitAplica: ["Aductores"],
        antecedenteAplica: ["Pubalgia/Aductores (antecedente)"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    },

    // ACTIVACIÓN - CUÁDRICEPS
    {
        id: 11,
        nombre: "Quad Sets Bilaterales",
        categoria: "Activación",
        muscleGroup: "Cuádriceps",
        description: "Contracción isométrica de cuádriceps",
        deficitAplica: ["ISO Cuádriceps"],
        antecedenteAplica: ["Post-LCA", "Tendinopatía rotuliana (antecedente)"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    },
    {
        id: 12,
        nombre: "Quad Sets Unilaterales",
        categoria: "Activación",
        muscleGroup: "Cuádriceps",
        description: "Contracción asimétrica de cuádriceps",
        deficitAplica: ["ISO Cuádriceps"],
        antecedenteAplica: ["Post-LCA"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    },

    // FUERZA - ISQUIOTIBIALES
    {
        id: 13,
        nombre: "Nordic Curl",
        categoria: "Fuerza",
        muscleGroup: "Isquiotibiales",
        description: "Ejercicio excéntrico de isquiotibiales (máxima prioridad)",
        deficitAplica: ["Nordic"],
        antecedenteAplica: ["Isquiotibiales (antecedente)"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#C8102E" stroke-width="2"/></svg>'
    },
    {
        id: 14,
        nombre: "RDL Bilateral",
        categoria: "Fuerza",
        muscleGroup: "Isquiotibiales",
        description: "Peso muerto rumano con ambas piernas",
        deficitAplica: ["Isquiotibiales"],
        antecedenteAplica: ["Isquiotibiales (antecedente)"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#C8102E" stroke-width="2"/></svg>'
    },
    {
        id: 15,
        nombre: "RDL Unilateral",
        categoria: "Fuerza",
        muscleGroup: "Isquiotibiales",
        description: "Peso muerto rumano unilateral",
        deficitAplica: ["Isquiotibiales"],
        antecedenteAplica: ["Isquiotibiales (antecedente)"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#C8102E" stroke-width="2"/></svg>'
    },
    {
        id: 16,
        nombre: "Prone Hamstring Curl",
        categoria: "Fuerza",
        muscleGroup: "Isquiotibiales",
        description: "Flexión de rodilla en posición prona",
        deficitAplica: ["Isquiotibiales"],
        antecedenteAplica: ["Isquiotibiales (antecedente)"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#C8102E" stroke-width="2"/></svg>'
    },

    // FUERZA - CUÁDRICEPS
    {
        id: 17,
        nombre: "Leg Press",
        categoria: "Fuerza",
        muscleGroup: "Cuádriceps",
        description: "Prensa de piernas bilateral",
        deficitAplica: ["ISO Cuádriceps"],
        antecedenteAplica: ["Post-LCA"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#C8102E" stroke-width="2"/></svg>'
    },
    {
        id: 18,
        nombre: "Leg Press Unilateral",
        categoria: "Fuerza",
        muscleGroup: "Cuádriceps",
        description: "Prensa de piernas unilateral",
        deficitAplica: ["ISO Cuádriceps"],
        antecedenteAplica: ["Post-LCA"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#C8102E" stroke-width="2"/></svg>'
    },
    {
        id: 19,
        nombre: "Sentadilla Bilateral",
        categoria: "Fuerza",
        muscleGroup: "Cuádriceps",
        description: "Sentadilla con ambas piernas",
        deficitAplica: ["ISO Cuádriceps"],
        antecedenteAplica: ["Post-LCA"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#C8102E" stroke-width="2"/></svg>'
    },
    {
        id: 20,
        nombre: "Sentadilla Unilateral (Pistol)",
        categoria: "Fuerza",
        muscleGroup: "Cuádriceps",
        description: "Sentadilla unilateral avanzada",
        deficitAplica: ["ISO Cuádriceps"],
        antecedenteAplica: ["Post-LCA"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#C8102E" stroke-width="2"/></svg>'
    },

    // FUERZA - ADUCTORES
    {
        id: 21,
        nombre: "Adducción en Máquina",
        categoria: "Fuerza",
        muscleGroup: "Aductores",
        description: "Trabajo específico de aductores",
        deficitAplica: ["Aductores"],
        antecedenteAplica: ["Pubalgia/Aductores (antecedente)"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#C8102E" stroke-width="2"/></svg>'
    },
    {
        id: 22,
        nombre: "Side Plank con Abducción",
        categoria: "Fuerza",
        muscleGroup: "Aductores",
        description: "Trabajo isométrico de aductores",
        deficitAplica: ["Aductores"],
        antecedenteAplica: ["Pubalgia/Aductores (antecedente)"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#C8102E" stroke-width="2"/></svg>'
    },

    // FUERZA - TOBILLO
    {
        id: 23,
        nombre: "Elevación de Talones",
        categoria: "Fuerza",
        muscleGroup: "Tobillo",
        description: "Fortalecimiento de gemelos",
        deficitAplica: ["Tobillo"],
        antecedenteAplica: ["Aquiles (antecedente)", "Esguince de tobillo (antecedente)"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#C8102E" stroke-width="2"/></svg>'
    },
    {
        id: 24,
        nombre: "Isométrico de Gemelos",
        categoria: "Fuerza",
        muscleGroup: "Tobillo",
        description: "Contracción isométrica de gemelos",
        deficitAplica: ["Tobillo"],
        antecedenteAplica: ["Aquiles (antecedente)"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#C8102E" stroke-width="2"/></svg>'
    },

    // PLIOMETRÍA - CMJ LANDING
    {
        id: 25,
        nombre: "Pogo Jumps",
        categoria: "Pliometría-CEA",
        muscleGroup: "Glúteos",
        description: "Saltos pequeños del lugar",
        deficitAplica: ["CMJ Landing"],
        antecedenteAplica: ["Post-LCA"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    },
    {
        id: 26,
        nombre: "Lateral Bounds",
        categoria: "Pliometría-CEA",
        muscleGroup: "Glúteos",
        description: "Saltos laterales",
        deficitAplica: ["CMJ Landing"],
        antecedenteAplica: ["Post-LCA"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    },
    {
        id: 27,
        nombre: "Single Leg Hops",
        categoria: "Pliometría-CEA",
        muscleGroup: "Glúteos",
        description: "Saltos unilaterales",
        deficitAplica: ["CMJ Landing"],
        antecedenteAplica: ["Post-LCA"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    },
    {
        id: 28,
        nombre: "Aterrizaje de Salto - Técnica",
        categoria: "Pliometría-CEA",
        muscleGroup: "Glúteos",
        description: "Trabajo de disminución de aterrizaje",
        deficitAplica: ["CMJ Landing"],
        antecedenteAplica: ["Post-LCA"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    },

    // PLIOMETRÍA - RSI
    {
        id: 29,
        nombre: "Countermovement Jump",
        categoria: "Pliometría-CEA",
        muscleGroup: "Glúteos",
        description: "Salto vertical de contramovimiento",
        deficitAplica: ["RSI"],
        antecedenteAplica: ["Post-LCA"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    },
    {
        id: 30,
        nombre: "Drop Jump",
        categoria: "Pliometría-CEA",
        muscleGroup: "Glúteos",
        description: "Salto desde altura con aterrizaje",
        deficitAplica: ["RSI"],
        antecedenteAplica: [],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    },

    // PLIOMETRÍA - IMPULSO EXCÉNTRICO
    {
        id: 31,
        nombre: "Saltos Profundos Controlados",
        categoria: "Pliometría-CEA",
        muscleGroup: "Isquiotibiales",
        description: "Trabajo de fase excéntrica",
        deficitAplica: ["Impulso Excéntrico"],
        antecedenteAplica: ["Isquiotibiales (antecedente)"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    },

    // CONTROL MOTOR
    {
        id: 32,
        nombre: "Single Leg RDL",
        categoria: "Fuerza",
        muscleGroup: "Glúteos",
        description: "Equilibrio y control unilateral",
        deficitAplica: ["Control Motor"],
        antecedenteAplica: ["Post-LCA"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#C8102E" stroke-width="2"/></svg>'
    },
    {
        id: 33,
        nombre: "Hurdle Hops",
        categoria: "Activación",
        muscleGroup: "Glúteos",
        description: "Saltos sobre vallas pequeñas",
        deficitAplica: ["Control Motor"],
        antecedenteAplica: [],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    },
    {
        id: 34,
        nombre: "Bulgarian Split Squat",
        categoria: "Fuerza",
        muscleGroup: "Cuádriceps",
        description: "Sentadilla búlgara unilateral",
        deficitAplica: ["Control Motor", "ISO Cuádriceps"],
        antecedenteAplica: ["Post-LCA"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#C8102E" stroke-width="2"/></svg>'
    },
    {
        id: 35,
        nombre: "Pallof Press",
        categoria: "Fuerza",
        muscleGroup: "Aductores",
        description: "Anti-rotación del core",
        deficitAplica: ["Control Motor"],
        antecedenteAplica: [],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#C8102E" stroke-width="2"/></svg>'
    },

    // COMPLEMENTARIOS
    {
        id: 36,
        nombre: "Plancha Frontal",
        categoria: "Activación",
        muscleGroup: "Glúteos",
        description: "Estabilidad del core",
        deficitAplica: [],
        antecedenteAplica: [],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    },
    {
        id: 37,
        nombre: "Plancha Lateral",
        categoria: "Activación",
        muscleGroup: "Aductores",
        description: "Estabilidad lateral",
        deficitAplica: [],
        antecedenteAplica: [],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    },
    {
        id: 38,
        nombre: "Bridge Hold",
        categoria: "Activación",
        muscleGroup: "Glúteos",
        description: "Isométrico de glúteos",
        deficitAplica: [],
        antecedenteAplica: [],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    },
    {
        id: 39,
        nombre: "Foam Rolling",
        categoria: "Movilidad",
        muscleGroup: "Isquiotibiales",
        description: "Liberación miofascial",
        deficitAplica: [],
        antecedenteAplica: ["Isquiotibiales (antecedente)"],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    },
    {
        id: 40,
        nombre: "Banda Elástica - Movilidad",
        categoria: "Movilidad",
        muscleGroup: "Cadera",
        description: "Trabajo con banda elástica",
        deficitAplica: [],
        antecedenteAplica: [],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    },
    {
        id: 41,
        nombre: "Estiramiento Dinámico General",
        categoria: "Movilidad",
        muscleGroup: "Glúteos",
        description: "Movilidad general dinámico",
        deficitAplica: [],
        antecedenteAplica: [],
        youtubeId: "",
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#0A4DA6" stroke-width="2"/></svg>'
    }
];

// Antecedentes clínicos disponibles
const clinicalAntecedents = [
    "Post-LCA",
    "Isquiotibiales (antecedente)",
    "Aquiles (antecedente)",
    "Pubalgia/Aductores (antecedente)",
    "Esguince de tobillo (antecedente)",
    "Tendinopatía rotuliana (antecedente)"
];

// Déficits disponibles
const availableDeficits = [
    "Tobillo",
    "Psoas",
    "Rotación Cadera",
    "Glúteos",
    "Abductores",
    "Aductores",
    "ISO Cuádriceps",
    "Nordic",
    "Isquiotibiales",
    "CMJ Landing",
    "Impulso Excéntrico",
    "RSI",
    "Control Motor"
];
