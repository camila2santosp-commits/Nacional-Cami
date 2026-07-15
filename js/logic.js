// Lógica de negocio
// Semáforo, cruce de déficits, generación de preventivos

const Logic = {

    // ========================================
    // REGLAS DE SEMÁFORO
    // ========================================

    evaluateAsimetry(value) {
        // Asimetrías: <10% verde, 10-15% amarillo, >15% rojo
        if (value < 10) return { status: 'verde', label: 'Normal' };
        if (value < 15) return { status: 'amarillo', label: 'Vigilar' };
        return { status: 'rojo', label: 'Déficit' };
    },

    evaluateMobility(score) {
        // Scores: 3=verde, 2=amarillo, 1=rojo
        if (score === 3) return { status: 'verde', label: 'Óptimo' };
        if (score === 2) return { status: 'amarillo', label: 'Leve restricción' };
        return { status: 'rojo', label: 'Severo' };
    },

    evaluateAnkleBLT(value) {
        // Tobillo WBLT: >10cm normal, profesional ~9.7cm
        if (value > 10) return { status: 'verde', label: 'Normal' };
        if (value > 9.5) return { status: 'amarillo', label: 'Vigilar' };
        return { status: 'rojo', label: 'Déficit' };
    },

    // ========================================
    // DETECCIÓN DE DÉFICITS
    // ========================================

    detectDeficits(playerData) {
        const deficits = [];

        // Tobillo
        if (playerData.tobilloD_cm && playerData.tobilloI_cm) {
            const tobilloDiff = Math.abs(playerData.tobilloD_cm - playerData.tobilloI_cm);
            const evaluation = this.evaluateAnkleBLT(playerData.tobilloD_cm);
            if (evaluation.status !== 'verde') {
                deficits.push({
                    name: 'Tobillo',
                    value: tobilloDiff,
                    status: evaluation.status,
                    label: evaluation.label
                });
            }
        }

        // Psoas
        if (playerData.psoasD_puntaje || playerData.psoasI_puntaje) {
            const maxPsoas = Math.max(playerData.psoasD_puntaje, playerData.psoasI_puntaje);
            const evaluation = this.evaluateMobility(maxPsoas);
            if (evaluation.status !== 'verde') {
                deficits.push({
                    name: 'Psoas',
                    value: maxPsoas,
                    status: evaluation.status,
                    label: evaluation.label
                });
            }
        }

        // Rotación de cadera
        if (playerData.rotCaderaD_puntaje || playerData.rotCaderaI_puntaje) {
            const maxRot = Math.max(playerData.rotCaderaD_puntaje, playerData.rotCaderaI_puntaje);
            const evaluation = this.evaluateMobility(maxRot);
            if (evaluation.status !== 'verde') {
                deficits.push({
                    name: 'Rotación Cadera',
                    value: maxRot,
                    status: evaluation.status,
                    label: evaluation.label
                });
            }
        }

        // CMJ Landing (asimetría)
        if (playerData.cmjLanding_pctAsimetria) {
            const evaluation = this.evaluateAsimetry(playerData.cmjLanding_pctAsimetria);
            if (evaluation.status !== 'verde') {
                deficits.push({
                    name: 'CMJ Landing',
                    value: playerData.cmjLanding_pctAsimetria,
                    status: evaluation.status,
                    label: evaluation.label
                });
            }
        }

        // Impulso Excéntrico (asimetría)
        if (playerData.cmjImpulsoExcentrico_pctAsimetria) {
            const evaluation = this.evaluateAsimetry(playerData.cmjImpulsoExcentrico_pctAsimetria);
            if (evaluation.status !== 'verde') {
                deficits.push({
                    name: 'Impulso Excéntrico',
                    value: playerData.cmjImpulsoExcentrico_pctAsimetria,
                    status: evaluation.status,
                    label: evaluation.label
                });
            }
        }

        // Impulso Concéntrico (asimetría)
        if (playerData.cmjImpulsoConcentrico_pctAsimetria) {
            const evaluation = this.evaluateAsimetry(playerData.cmjImpulsoConcentrico_pctAsimetria);
            if (evaluation.status !== 'verde') {
                deficits.push({
                    name: 'Impulso Concéntrico',
                    value: playerData.cmjImpulsoConcentrico_pctAsimetria,
                    status: evaluation.status,
                    label: evaluation.label
                });
            }
        }

        // RSI (Reactive Strength Index)
        if (playerData.rsiMod_ms) {
            // Menor es mejor; <0.5 es déficit
            if (playerData.rsiMod_ms < 0.5) {
                deficits.push({
                    name: 'RSI',
                    value: playerData.rsiMod_ms,
                    status: 'rojo',
                    label: 'Déficit'
                });
            }
        }

        // ISO Cuádriceps (asimetría)
        if (playerData.isoCuadriceps_pctAsimetria) {
            const evaluation = this.evaluateAsimetry(playerData.isoCuadriceps_pctAsimetria);
            if (evaluation.status !== 'verde') {
                deficits.push({
                    name: 'ISO Cuádriceps',
                    value: playerData.isoCuadriceps_pctAsimetria,
                    status: evaluation.status,
                    label: evaluation.label
                });
            }
        }

        // ISO Prono Isquios (asimetría)
        if (playerData.isoPronoIsquios_pctAsimetria) {
            const evaluation = this.evaluateAsimetry(playerData.isoPronoIsquios_pctAsimetria);
            if (evaluation.status !== 'verde') {
                deficits.push({
                    name: 'Isquiotibiales',
                    value: playerData.isoPronoIsquios_pctAsimetria,
                    status: evaluation.status,
                    label: evaluation.label
                });
            }
        }

        // Nordic (asimetría)
        if (playerData.nordic_pctAsimetria) {
            const evaluation = this.evaluateAsimetry(playerData.nordic_pctAsimetria);
            if (evaluation.status !== 'verde') {
                deficits.push({
                    name: 'Nordic',
                    value: playerData.nordic_pctAsimetria,
                    status: evaluation.status,
                    label: evaluation.label
                });
            }
        }

        // Aductores (asimetría)
        if (playerData.aductores_pctAsimetria) {
            const evaluation = this.evaluateAsimetry(playerData.aductores_pctAsimetria);
            if (evaluation.status !== 'verde') {
                deficits.push({
                    name: 'Aductores',
                    value: playerData.aductores_pctAsimetria,
                    status: evaluation.status,
                    label: evaluation.label
                });
            }
        }

        // Abductores (asimetría)
        if (playerData.abductores_pctAsimetria) {
            const evaluation = this.evaluateAsimetry(playerData.abductores_pctAsimetria);
            if (evaluation.status !== 'verde') {
                deficits.push({
                    name: 'Abductores',
                    value: playerData.abductores_pctAsimetria,
                    status: evaluation.status,
                    label: evaluation.label
                });
            }
        }

        // Control Motor
        if (playerData.controlMotor) {
            const values = Object.values(playerData.controlMotor);
            const hasDeficit = values.some(v => v < 3);
            if (hasDeficit) {
                deficits.push({
                    name: 'Control Motor',
                    value: 'variable',
                    status: 'amarillo',
                    label: 'Evaluar'
                });
            }
        }

        return deficits;
    },

    // ========================================
    // GENERADOR DE PREVENTIVO
    // ========================================

    generatePreventivo(playerOrGroup, dayOfWeek, loadIntensity, allExercises) {
        // Determinar si es jugador individual o grupo
        const isGroup = playerOrGroup.isGroup;
        let playersToProcess = [];

        if (isGroup) {
            playersToProcess = playerOrGroup.playerIds.map(id => {
                const players = Storage.getPlayers();
                return players.find(p => p.id === id);
            }).filter(p => p);
        } else {
            playersToProcess = [playerOrGroup];
        }

        if (playersToProcess.length === 0) return null;

        // Agregar déficits detectados a cada jugador
        playersToProcess = playersToProcess.map(p => {
            if (!p.detectedDeficits) {
                p.detectedDeficits = this.detectDeficits(p.evaluationData || {});
            }
            return p;
        });

        // Recopilar todos los déficits y antecedentes del grupo
        const commonDeficits = this.getGroupDeficits(playersToProcess);
        const commonAntecedents = this.getGroupAntecedents(playersToProcess);

        // Filtrar ejercicios según déficits, antecedentes y carga del día
        const suggestedExercises = this.filterExercises(
            allExercises,
            commonDeficits,
            commonAntecedents,
            loadIntensity
        );

        return {
            id: Date.now(),
            playersIds: playersToProcess.map(p => p.id),
            playersNames: playersToProcess.map(p => p.nombre),
            isGroup: isGroup,
            groupName: isGroup ? playerOrGroup.nombre : null,
            date: new Date().toLocaleString('es-UY'),
            dayOfWeek: dayOfWeek,
            loadIntensity: loadIntensity,
            commonDeficits: commonDeficits,
            commonAntecedents: commonAntecedents,
            suggestedExercises: suggestedExercises,
            customExercises: []
        };
    },

    getGroupDeficits(players) {
        const deficitMap = {};
        players.forEach(p => {
            (p.detectedDeficits || []).forEach(d => {
                if (!deficitMap[d.name]) {
                    deficitMap[d.name] = { count: 0, status: d.status };
                }
                deficitMap[d.name].count++;
            });
        });
        return Object.entries(deficitMap)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.count - a.count);
    },

    getGroupAntecedents(players) {
        const antecedentMap = {};
        players.forEach(p => {
            (p.antecedentes || []).forEach(a => {
                if (!antecedentMap[a]) {
                    antecedentMap[a] = 0;
                }
                antecedentMap[a]++;
            });
        });
        return Object.entries(antecedentMap)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    },

    filterExercises(allExercises, deficits, antecedents, loadIntensity) {
        const deficitNames = deficits.map(d => d.name);
        const antecedentNames = antecedents.map(a => a.name);

        // Reglas por carga del día
        const isHighLoad = loadIntensity === 'alta' || loadIntensity === 'partido';
        const isFreeDay = loadIntensity === 'libre';

        return allExercises.filter(ex => {
            // Excluir pliometría en días de carga alta o partido
            if (isHighLoad && ex.categoria === 'Pliometría-CEA') {
                return false;
            }

            // En día libre, priorizar movilidad
            if (isFreeDay && ex.categoria !== 'Movilidad') {
                return false;
            }

            // Coincidir con déficits
            const matchesDeficit = ex.deficitAplica.length === 0 ||
                ex.deficitAplica.some(d => deficitNames.includes(d));

            // Coincidir con antecedentes
            const matchesAntecedent = ex.antecedenteAplica.length === 0 ||
                ex.antecedenteAplica.some(a => antecedentNames.includes(a));

            // Ejercicios generales (sin déficit específico) siempre se incluyen
            const isGeneral = ex.deficitAplica.length === 0 && ex.antecedenteAplica.length === 0;

            return isGeneral || (matchesDeficit && matchesAntecedent);
        });
    },

    // ========================================
    // UTILIDADES
    // ========================================

    getExercisePriority(exercise, commonDeficits) {
        // Prioridad según déficit
        for (const deficit of commonDeficits) {
            if (exercise.deficitAplica.includes(deficit.name)) {
                if (deficit.status === 'rojo') return 1; // Máxima prioridad
                if (deficit.status === 'amarillo') return 2;
                return 3;
            }
        }
        return 4; // Baja prioridad
    }
};
