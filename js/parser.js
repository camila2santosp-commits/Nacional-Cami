// Parser de Excel
// Convierte archivos .xlsx de evaluaciones a estructura de datos

const Parser = {

    // Lee un archivo Excel y retorna información de las hojas disponibles
    parseExcelFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });

                    // Retornar información de todas las hojas
                    const sheetsInfo = workbook.SheetNames.map(sheetName => ({
                        name: sheetName,
                        workbook: workbook
                    }));

                    resolve({
                        file: file,
                        workbook: workbook,
                        sheets: workbook.SheetNames,
                        sheetsInfo: sheetsInfo
                    });
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = (error) => {
                reject(error);
            };

            reader.readAsArrayBuffer(file);
        });
    },

    // Parsea una hoja específica del workbook
    parseSheet(workbook, sheetName) {
        try {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            const players = this.convertToPlayers(jsonData);
            return players;
        } catch (error) {
            throw error;
        }
    },

    // Convierte datos de Excel a estructura de jugador
    convertToPlayers(rawData) {
        return rawData.map((row, index) => {
            // Adaptable a tu formato específico
            // Ajusta los nombres de columnas según tu Excel

            const player = {
                id: this.generatePlayerId(),
                nombre: row['Nombre'] || row['nombre'] || row['Jugador'] || `Jugador ${index + 1}`,
                posicion: row['Posición'] || row['posicion'] || row['Pos'] || 'N/A',
                equipo: row['Equipo'] || 'Nacional',
                nCamiseta: row['Nº'] || row['nCamiseta'] || '',

                // Evaluación física
                evaluationData: {
                    // Tobillo WBLT (cm)
                    tobilloD_cm: this.parseFloat(row['WBLT D (cm)']) || this.parseFloat(row['Tobillo D']),
                    tobilloI_cm: this.parseFloat(row['WBLT I (cm)']) || this.parseFloat(row['Tobillo I']),

                    // Psoas (score 1-3)
                    psoasD_puntaje: this.parseInt(row['Psoas D']) || this.parseInt(row['Psoas D score']),
                    psoasI_puntaje: this.parseInt(row['Psoas I']) || this.parseInt(row['Psoas I score']),

                    // Rotación de cadera (score 1-3)
                    rotCaderaD_puntaje: this.parseInt(row['Rot Cadera D']) || this.parseInt(row['Hip Rot D']),
                    rotCaderaI_puntaje: this.parseInt(row['Rot Cadera I']) || this.parseInt(row['Hip Rot I']),

                    // Control Motor (objeto con scores)
                    controlMotor: {
                        isquiosD: this.parseInt(row['CM Isquios D']),
                        isquiosI: this.parseInt(row['CM Isquios I']),
                        squat: this.parseInt(row['CM Squat']),
                        illD: this.parseInt(row['CM ILL D']),
                        illI: this.parseInt(row['CM ILL I']),
                        hurdleD: this.parseInt(row['CM Hurdle D']),
                        hurdleI: this.parseInt(row['CM Hurdle I'])
                    },

                    // CMJ (Countermovement Jump)
                    cmjJumpHeight_cm: this.parseFloat(row['CMJ Height (cm)']) || this.parseFloat(row['CMJ Alt']),
                    cmjLanding_pctAsimetria: this.parseFloat(row['CMJ Landing %']) || this.parseFloat(row['CMJ Asimetría Landing']),
                    cmjImpulsoExcentrico_pctAsimetria: this.parseFloat(row['CMJ Impulso Exc %']) || this.parseFloat(row['CMJ Asimetría Exc']),
                    cmjImpulsoConcentrico_pctAsimetria: this.parseFloat(row['CMJ Impulso Conc %']) || this.parseFloat(row['CMJ Asimetría Conc']),

                    // RSI Mod
                    rsiMod_ms: this.parseFloat(row['RSI Mod (ms)']) || this.parseFloat(row['RSI']),

                    // ActivForce2 - ISO Cuádriceps a 60°
                    isoCuadriceps_pctAsimetria: this.parseFloat(row['ISO Cuad %']) || this.parseFloat(row['Asimetría Cuad']),

                    // NordBord - ISO Prono Isquios
                    isoPronoIsquios_pctAsimetria: this.parseFloat(row['ISO Isquios %']) || this.parseFloat(row['Asimetría Isquios']),

                    // NordBord - Nordic
                    nordic_pctAsimetria: this.parseFloat(row['Nordic %']) || this.parseFloat(row['Asimetría Nordic']),

                    // ForceFrame - Aductores/Abductores
                    aductores_pctAsimetria: this.parseFloat(row['Aductores %']) || this.parseFloat(row['Asimetría Aductores']),
                    abductores_pctAsimetria: this.parseFloat(row['Abductores %']) || this.parseFloat(row['Asimetría Abductores'])
                },

                // Antecedentes clínicos
                antecedentes: this.parseAntecedents(row['Antecedentes'] || row['IDP'] || ''),

                // Fecha de carga
                fechaCarga: new Date().toLocaleString('es-UY'),

                // Déficits detectados (se calculan al cargar)
                detectedDeficits: []
            };

            return player;
        });
    },

    parseFloat(value) {
        if (value === null || value === undefined || value === '') return null;
        const parsed = parseFloat(value);
        return isNaN(parsed) ? null : parsed;
    },

    parseInt(value) {
        if (value === null || value === undefined || value === '') return null;
        const parsed = parseInt(value);
        return isNaN(parsed) ? null : parsed;
    },

    parseAntecedents(text) {
        if (!text) return [];

        const antecedents = [];
        const knownAntecedents = [
            "Post-LCA",
            "Isquiotibiales (antecedente)",
            "Aquiles (antecedente)",
            "Pubalgia/Aductores (antecedente)",
            "Esguince de tobillo (antecedente)",
            "Tendinopatía rotuliana (antecedente)"
        ];

        knownAntecedents.forEach(ant => {
            if (text.toLowerCase().includes(ant.toLowerCase())) {
                antecedents.push(ant);
            }
        });

        return antecedents;
    },

    generatePlayerId() {
        return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // Mock data para desarrollo
    generateMockPlayers() {
        return [
            {
                id: 'player_mock_1',
                nombre: 'Verónica Lupi',
                posicion: 'Mediocampista',
                equipo: 'Nacional',
                nCamiseta: '7',
                evaluationData: {
                    tobilloD_cm: 8.5,
                    tobilloI_cm: 9.2,
                    psoasD_puntaje: 2,
                    psoasI_puntaje: 3,
                    rotCaderaD_puntaje: 2,
                    rotCaderaI_puntaje: 3,
                    controlMotor: { isquiosD: 2, isquiosI: 3, squat: 2, illD: 2, illI: 3, hurdleD: 2, hurdleI: 3 },
                    cmjJumpHeight_cm: 38,
                    cmjLanding_pctAsimetria: 12,
                    cmjImpulsoExcentrico_pctAsimetria: 14,
                    cmjImpulsoConcentrico_pctAsimetria: 8,
                    rsiMod_ms: 0.45,
                    isoCuadriceps_pctAsimetria: 11,
                    isoPronoIsquios_pctAsimetria: 13,
                    nordic_pctAsimetria: 16,
                    aductores_pctAsimetria: 9,
                    abductores_pctAsimetria: 7
                },
                antecedentes: ['Post-LCA', 'Aquiles (antecedente)'],
                fechaCarga: new Date().toLocaleString('es-UY'),
                detectedDeficits: []
            },
            {
                id: 'player_mock_2',
                nombre: 'Juan Pérez',
                posicion: 'Delantero',
                equipo: 'Nacional',
                nCamiseta: '9',
                evaluationData: {
                    tobilloD_cm: 10.5,
                    tobilloI_cm: 10.8,
                    psoasD_puntaje: 3,
                    psoasI_puntaje: 3,
                    rotCaderaD_puntaje: 3,
                    rotCaderaI_puntaje: 2,
                    controlMotor: { isquiosD: 3, isquiosI: 3, squat: 3, illD: 3, illI: 2, hurdleD: 3, hurdleI: 3 },
                    cmjJumpHeight_cm: 42,
                    cmjLanding_pctAsimetria: 8,
                    cmjImpulsoExcentrico_pctAsimetria: 9,
                    cmjImpulsoConcentrico_pctAsimetria: 7,
                    rsiMod_ms: 0.62,
                    isoCuadriceps_pctAsimetria: 7,
                    isoPronoIsquios_pctAsimetria: 9,
                    nordic_pctAsimetria: 11,
                    aductores_pctAsimetria: 8,
                    abductores_pctAsimetria: 6
                },
                antecedentes: ['Esguince de tobillo (antecedente)'],
                fechaCarga: new Date().toLocaleString('es-UY'),
                detectedDeficits: []
            },
            {
                id: 'player_mock_3',
                nombre: 'Carlos Rodríguez',
                posicion: 'Defensa',
                equipo: 'Nacional',
                nCamiseta: '3',
                evaluationData: {
                    tobilloD_cm: 9.0,
                    tobilloI_cm: 9.5,
                    psoasD_puntaje: 2,
                    psoasI_puntaje: 2,
                    rotCaderaD_puntaje: 2,
                    rotCaderaI_puntaje: 2,
                    controlMotor: { isquiosD: 2, isquiosI: 2, squat: 2, illD: 2, illI: 2, hurdleD: 2, hurdleI: 2 },
                    cmjJumpHeight_cm: 35,
                    cmjLanding_pctAsimetria: 18,
                    cmjImpulsoExcentrico_pctAsimetria: 16,
                    cmjImpulsoConcentrico_pctAsimetria: 12,
                    rsiMod_ms: 0.38,
                    isoCuadriceps_pctAsimetria: 18,
                    isoPronoIsquios_pctAsimetria: 17,
                    nordic_pctAsimetria: 20,
                    aductores_pctAsimetria: 14,
                    abductores_pctAsimetria: 12
                },
                antecedentes: ['Post-LCA', 'Isquiotibiales (antecedente)', 'Pubalgia/Aductores (antecedente)'],
                fechaCarga: new Date().toLocaleString('es-UY'),
                detectedDeficits: []
            }
        ];
    }
};
