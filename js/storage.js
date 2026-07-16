// Sistema de almacenamiento local (localStorage)
// Persiste datos entre sesiones

const Storage = {
    // Prefijo para todas las keys
    PREFIX: 'nacional_preventivos_',

    // Jugadores
    savePlayers(players) {
        localStorage.setItem(
            this.PREFIX + 'players',
            JSON.stringify(players)
        );
    },

    getPlayers() {
        const data = localStorage.getItem(this.PREFIX + 'players');
        return data ? JSON.parse(data) : [];
    },

    // Ejercicios (personalizados / editados)
    saveExercises(exercises) {
        localStorage.setItem(
            this.PREFIX + 'exercises',
            JSON.stringify(exercises)
        );
    },

    getExercises() {
        const data = localStorage.getItem(this.PREFIX + 'exercises');
        return data ? JSON.parse(data) : [...exercisesDatabase];
    },

    // Grupos de preventivo
    saveGroups(groups) {
        localStorage.setItem(
            this.PREFIX + 'groups',
            JSON.stringify(groups)
        );
    },

    getGroups() {
        const data = localStorage.getItem(this.PREFIX + 'groups');
        return data ? JSON.parse(data) : [];
    },

    // Microciclo semanal
    saveMicrocycle(microcycle) {
        localStorage.setItem(
            this.PREFIX + 'microcycle',
            JSON.stringify(microcycle)
        );
    },

    getMicrocycle() {
        const data = localStorage.getItem(this.PREFIX + 'microcycle');
        return data ? JSON.parse(data) : {
            lunes: 'media',
            martes: 'alta',
            miercoles: 'media',
            jueves: 'suave',
            viernes: 'alta',
            sabado: 'media'
        };
    },

    // Historial de preventivos generados
    saveHistory(history) {
        localStorage.setItem(
            this.PREFIX + 'history',
            JSON.stringify(history)
        );
    },

    getHistory() {
        const data = localStorage.getItem(this.PREFIX + 'history');
        return data ? JSON.parse(data) : [];
    },

    addToHistory(preventivo) {
        const history = this.getHistory();
        preventivo.id = Date.now();
        preventivo.fecha = new Date().toLocaleString('es-UY');
        history.unshift(preventivo);
        // Guardar últimos 100
        if (history.length > 100) {
            history.pop();
        }
        this.saveHistory(history);
        return preventivo;
    },

    // Conectores (Google Drive, YouTube)
    saveConnectors(connectors) {
        localStorage.setItem(
            this.PREFIX + 'connectors',
            JSON.stringify(connectors)
        );
    },

    getConnectors() {
        const data = localStorage.getItem(this.PREFIX + 'connectors');
        return data ? JSON.parse(data) : {
            googleDriveFolderId: '',
            youtubeChannelId: '',
            youtubeApiKey: 'AIzaSyAAJmCPj_2tUzuvL7hSKLe7luC5PQpAvuc',
            googleAccessToken: ''
        };
    },

    // Autenticación
    saveAuthToken(token) {
        localStorage.setItem(
            this.PREFIX + 'auth_token',
            token
        );
    },

    getAuthToken() {
        return localStorage.getItem(this.PREFIX + 'auth_token');
    },

    clearAuthToken() {
        localStorage.removeItem(this.PREFIX + 'auth_token');
    },

    // Limpieza completa
    clearAll() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.PREFIX)) {
                localStorage.removeItem(key);
            }
        });
    },

    // Export datos para backup
    exportAll() {
        return {
            jugadores: this.getPlayers(),
            ejercicios: this.getExercises(),
            grupos: this.getGroups(),
            microciclo: this.getMicrocycle(),
            historial: this.getHistory(),
            conectores: this.getConnectors(),
            fecha: new Date().toISOString()
        };
    },

    // Import datos desde backup
    importAll(data) {
        if (data.jugadores) this.savePlayers(data.jugadores);
        if (data.ejercicios) this.saveExercises(data.ejercicios);
        if (data.grupos) this.saveGroups(data.grupos);
        if (data.microciclo) this.saveMicrocycle(data.microciclo);
        if (data.historial) this.saveHistory(data.historial);
        if (data.conectores) this.saveConnectors(data.conectores);
    },

    // Estadísticas
    getStats() {
        return {
            jugadores: this.getPlayers().length,
            ejercicios: this.getExercises().length,
            grupos: this.getGroups().length,
            preventivosGenerados: this.getHistory().length
        };
    }
};
