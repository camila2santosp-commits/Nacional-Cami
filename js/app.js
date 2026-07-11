// App Principal
// Orquestador de la aplicación

const App = {

    // Estado
    state: {
        players: [],
        exercises: [],
        groups: [],
        currentPreventivo: null,
        microcycle: {}
    },

    // ========================================
    // INICIALIZACIÓN
    // ========================================

    init() {
        console.log('🚀 Iniciando Planificador de Preventivos...');

        // Cargar datos del almacenamiento local
        this.loadData();

        // Si no hay jugadores, cargar mock data
        if (this.state.players.length === 0) {
            this.state.players = Parser.generateMockPlayers();
            Storage.savePlayers(this.state.players);
            console.log('📊 Datos de prueba cargados');
        }

        // Detectar déficits en todos los jugadores
        this.state.players = this.state.players.map(p => {
            if (!p.detectedDeficits || p.detectedDeficits.length === 0) {
                p.detectedDeficits = Logic.detectDeficits(p.evaluationData || {});
            }
            return p;
        });

        // Configurar event listeners
        this.setupEventListeners();

        // Renderizar vistas iniciales
        this.renderPlayersList();
        this.renderPlayerSelect();
        this.renderExercisesList();
        this.renderMicrocycle();
        this.renderGroupsList();

        // Mostrar estadísticas
        this.updateStats();

        console.log('✓ Aplicación lista');
    },

    loadData() {
        this.state.players = Storage.getPlayers();
        this.state.exercises = Storage.getExercises();
        this.state.groups = Storage.getGroups();
        this.state.microcycle = Storage.getMicrocycle();
    },

    // ========================================
    // EVENT LISTENERS
    // ========================================

    setupEventListeners() {
        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.closest('.tab-btn').dataset.tab));
        });

        // Upload Excel
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleFileUpload(e.dataTransfer.files[0]);
        });

        fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files[0]);
        });

        // Cargar desde Google Drive
        document.getElementById('loadFromDriveBtn')?.addEventListener('click', () => this.loadFromDrive());

        // Preventivos
        document.getElementById('generateBtn').addEventListener('click', () => this.generatePreventivo());
        document.getElementById('exportPdfBtn')?.addEventListener('click', () => this.exportPDF());
        document.getElementById('saveHistoryBtn')?.addEventListener('click', () => this.saveToHistory());

        // Ejercicios
        document.getElementById('addExerciseBtn').addEventListener('click', () => this.openExerciseModal());
        document.getElementById('applyFiltersBtn').addEventListener('click', () => this.filterExercises());
        document.getElementById('exerciseForm').addEventListener('submit', (e) => this.handleExerciseSubmit(e));

        // Config
        document.getElementById('saveMicrocycleBtn').addEventListener('click', () => this.saveMicrocycle());
        document.getElementById('addGroupBtn').addEventListener('click', () => this.addGroupModal());
        document.getElementById('exportDataBtn').addEventListener('click', () => this.exportData());
        document.getElementById('importDataBtn').addEventListener('click', () => this.importData());
        document.getElementById('clearDataBtn').addEventListener('click', () => this.clearAllData());
        document.getElementById('saveConnectorsBtn').addEventListener('click', () => this.saveConnectors());

        // Modal close
        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('exerciseModal').style.display = 'none';
        });
    },

    // ========================================
    // TABS
    // ========================================

    switchTab(tabName) {
        // Ocultar todos los tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Desactivar todos los botones
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Mostrar tab seleccionado
        document.getElementById(tabName)?.classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
    },

    // ========================================
    // CARGA DE DATOS
    // ========================================

    handleFileUpload(file) {
        if (!file) return;

        const statusDiv = document.getElementById('uploadStatus');
        statusDiv.innerHTML = '⏳ Procesando archivo...';

        Parser.parseExcelFile(file)
            .then(players => {
                // Detectar déficits
                players = players.map(p => {
                    p.detectedDeficits = Logic.detectDeficits(p.evaluationData || {});
                    return p;
                });

                // Agregar a estado
                this.state.players = [...this.state.players, ...players];
                Storage.savePlayers(this.state.players);

                // Actualizar UI
                this.renderPlayersList();
                this.renderPlayerSelect();

                statusDiv.innerHTML = `✓ ${players.length} jugador${players.length > 1 ? 'es' : ''} cargados exitosamente`;
                statusDiv.style.color = '#4CAF50';

                this.updateStats();
            })
            .catch(error => {
                console.error('Error al parsear Excel:', error);
                statusDiv.innerHTML = `❌ Error: ${error.message}`;
                statusDiv.style.color = '#F44336';
            });
    },

    loadFromDrive() {
        if (!Auth.isAuthenticated) {
            alert('Por favor, conéctate con Google primero');
            return;
        }

        const folderId = Storage.getConnectors().googleDriveFolderId;
        if (!folderId) {
            alert('❌ ID de carpeta de Google Drive no configurado.\n\nEn Config > Conectores, ingresa el ID de tu carpeta Drive.');
            return;
        }

        alert('🔄 Cargando desde Google Drive...\n(Esta funcionalidad se completará cuando proporciones los conectores)');
    },

    // ========================================
    // GENERADOR DE PREVENTIVOS
    // ========================================

    renderPlayerSelect() {
        const select = document.getElementById('playerSelect');
        select.innerHTML = '<option value="">Selecciona jugador o grupo...</option>';

        // Agregar jugadores
        this.state.players.forEach(p => {
            const opt = document.createElement('option');
            opt.value = JSON.stringify({ type: 'player', id: p.id, ...p });
            opt.textContent = `👤 ${p.nombre} (${p.posicion})`;
            select.appendChild(opt);
        });

        // Agregar grupos
        this.state.groups.forEach(g => {
            const opt = document.createElement('option');
            opt.value = JSON.stringify({ type: 'group', id: g.id, ...g });
            opt.textContent = `👥 ${g.nombre} (${g.playerIds.length} jugadores)`;
            select.appendChild(opt);
        });
    },

    generatePreventivo() {
        const selectValue = document.getElementById('playerSelect').value;
        const day = document.getElementById('daySelect').value;
        const load = document.getElementById('loadSelect').value;

        if (!selectValue) {
            alert('Por favor, selecciona un jugador o grupo');
            return;
        }

        const selection = JSON.parse(selectValue);
        let playerOrGroup = null;

        if (selection.type === 'player') {
            playerOrGroup = this.state.players.find(p => p.id === selection.id);
        } else {
            playerOrGroup = this.state.groups.find(g => g.id === selection.id);
        }

        // Generar
        const preventivo = Logic.generatePreventivo(
            playerOrGroup,
            day,
            load,
            this.state.exercises
        );

        if (!preventivo) {
            alert('Error al generar preventivo');
            return;
        }

        this.state.currentPreventivo = preventivo;

        // Mostrar preview
        const playerInfo = this.state.players.find(p => p.id === preventivo.playersIds[0]);
        document.getElementById('previewName').textContent = preventivo.playersNames.join(', ');
        document.getElementById('previewPos').textContent = playerInfo?.posicion || '';

        const antecedentesHtml = preventivo.commonAntecedents
            .map(a => `<span class="badge badge-amarillo">${a.name}</span>`)
            .join('');
        document.getElementById('previewAntecedentes').innerHTML = antecedentesHtml || 'Sin antecedentes';

        const deficitesHtml = preventivo.commonDeficits
            .map(d => `<span class="badge badge-${d.status}">${d.name}</span>`)
            .join('');
        document.getElementById('previewDeficits').innerHTML = deficitesHtml || 'Sin déficits detectados';

        document.getElementById('playerPreview').style.display = 'block';

        // Mostrar ejercicios
        this.renderPreventivoExercises(preventivo);
    },

    renderPreventivoExercises(preventivo) {
        const container = document.getElementById('exercisesContainer');
        const list = document.getElementById('exercisesList');

        const byCategory = {};
        preventivo.suggestedExercises.forEach(ex => {
            if (!byCategory[ex.categoria]) byCategory[ex.categoria] = [];
            byCategory[ex.categoria].push(ex);
        });

        let html = '';
        Object.entries(byCategory).forEach(([cat, exercises]) => {
            html += `<div style="margin-bottom: 20px;"><h4 style="background: #0A1E4D; color: white; padding: 10px; border-radius: 4px; margin-bottom: 10px; font-family: Oswald;">${cat}</h4>`;

            exercises.forEach((ex, idx) => {
                html += `
                    <div class="exercise-card">
                        <div style="font-weight: 600; margin-bottom: 5px;">${idx + 1}. ${ex.nombre}</div>
                        <div style="font-size: 0.9rem; color: #666; margin-bottom: 5px;">${ex.description || ''}</div>
                        <div class="exercise-tags">
                            ${ex.deficitAplica.map(d => `<span class="exercise-tag">${d}</span>`).join('')}
                            ${ex.antecedenteAplica.map(a => `<span class="exercise-tag" style="background: rgba(200, 16, 46, 0.1); color: #A00D24;">⚠️ ${a}</span>`).join('')}
                        </div>
                        ${ex.youtubeId ? `
                            <div class="exercise-video" style="margin-top: 10px;">
                                <a href="https://youtube.com/watch?v=${ex.youtubeId}" target="_blank" class="exercise-video-btn">
                                    ▶️ Ver video
                                </a>
                            </div>
                        ` : ''}
                    </div>
                `;
            });

            html += '</div>';
        });

        list.innerHTML = html;
        container.style.display = 'block';

        document.getElementById('exercisesInfo').textContent = `${preventivo.suggestedExercises.length} ejercicios sugeridos - ${preventivo.dayOfWeek} (carga ${preventivo.loadIntensity})`;
    },

    exportPDF() {
        if (!this.state.currentPreventivo) {
            alert('Genera un preventivo primero');
            return;
        }

        PDF.generatePreventivoPDF(
            this.state.currentPreventivo,
            this.state.players,
            this.state.exercises
        );
    },

    saveToHistory() {
        if (!this.state.currentPreventivo) {
            alert('Genera un preventivo primero');
            return;
        }

        const saved = Storage.addToHistory(this.state.currentPreventivo);
        alert(`✓ Preventivo guardado en historial (ID: ${saved.id})`);
    },

    // ========================================
    // GESTIÓN DE EJERCICIOS
    // ========================================

    renderExercisesList() {
        const container = document.getElementById('exercisesListContainer');
        container.innerHTML = '';

        this.state.exercises.forEach(ex => {
            const card = document.createElement('div');
            card.className = 'exercise-card';
            card.style.padding = '15px';
            card.innerHTML = `
                <div style="margin-bottom: 10px;">
                    <h4 style="margin-bottom: 5px; color: #0A1E4D; font-family: Oswald;">${ex.nombre}</h4>
                    <p style="font-size: 0.85rem; color: #666; margin: 0; margin-bottom: 8px;">${ex.description || ''}</p>
                    <div style="font-size: 0.8rem; color: #999; margin-bottom: 8px;">
                        <strong>${ex.categoria}</strong> • ${ex.muscleGroup}
                    </div>
                </div>
                <div class="exercise-tags" style="margin-bottom: 10px;">
                    ${ex.deficitAplica.map(d => `<span class="exercise-tag">${d}</span>`).join('')}
                </div>
                ${ex.youtubeId ? `
                    <a href="https://youtube.com/watch?v=${ex.youtubeId}" target="_blank" style="font-size: 0.85rem; color: #C8102E; text-decoration: none;">▶️ Video</a>
                ` : ''}
                <div style="margin-top: 10px; display: flex; gap: 5px;">
                    <button onclick="App.editExercise('${ex.id}')" style="flex: 1; padding: 6px; background: #0A4DA6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">✏️ Editar</button>
                    <button onclick="App.deleteExercise('${ex.id}')" style="flex: 1; padding: 6px; background: #F44336; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">🗑️ Borrar</button>
                </div>
            `;
            container.appendChild(card);
        });
    },

    filterExercises() {
        const category = document.getElementById('categoryFilter').value;
        const muscle = document.getElementById('muscleFilter').value;

        const filtered = this.state.exercises.filter(ex => {
            return (category === '' || ex.categoria === category) &&
                   (muscle === '' || ex.muscleGroup === muscle);
        });

        const container = document.getElementById('exercisesListContainer');
        container.innerHTML = '';

        filtered.forEach(ex => {
            const card = document.createElement('div');
            card.className = 'exercise-card';
            card.style.padding = '15px';
            card.innerHTML = `
                <h4 style="color: #0A1E4D; margin-bottom: 5px;">${ex.nombre}</h4>
                <p style="font-size: 0.85rem; color: #666;">${ex.description || ''}</p>
            `;
            container.appendChild(card);
        });
    },

    openExerciseModal() {
        document.getElementById('modalTitle').textContent = 'Nuevo Ejercicio';
        document.getElementById('exerciseForm').reset();
        document.getElementById('exerciseForm').dataset.id = '';
        document.getElementById('exerciseModal').style.display = 'flex';
        document.getElementById('exerciseModal').style.alignItems = 'center';
        document.getElementById('exerciseModal').style.justifyContent = 'center';
    },

    editExercise(id) {
        const ex = this.state.exercises.find(e => e.id == id);
        if (!ex) return;

        document.getElementById('modalTitle').textContent = 'Editar Ejercicio';
        document.getElementById('exName').value = ex.nombre;
        document.getElementById('exCategory').value = ex.categoria;
        document.getElementById('exMuscle').value = ex.muscleGroup;
        document.getElementById('exDeficits').value = ex.deficitAplica.join(', ');
        document.getElementById('exAntecedentes').value = ex.antecedenteAplica.join(', ');
        document.getElementById('exYoutubeId').value = ex.youtubeId || '';
        document.getElementById('exSvg').value = ex.svg || '';
        document.getElementById('exerciseForm').dataset.id = ex.id;

        document.getElementById('exerciseModal').style.display = 'flex';
        document.getElementById('exerciseModal').style.alignItems = 'center';
        document.getElementById('exerciseModal').style.justifyContent = 'center';
    },

    handleExerciseSubmit(e) {
        e.preventDefault();

        const id = document.getElementById('exerciseForm').dataset.id;
        const exercise = {
            id: id || 'ex_' + Date.now(),
            nombre: document.getElementById('exName').value,
            categoria: document.getElementById('exCategory').value,
            muscleGroup: document.getElementById('exMuscle').value,
            description: '',
            deficitAplica: document.getElementById('exDeficits').value.split(',').map(d => d.trim()).filter(d => d),
            antecedenteAplica: document.getElementById('exAntecedentes').value.split(',').map(a => a.trim()).filter(a => a),
            youtubeId: document.getElementById('exYoutubeId').value,
            svg: document.getElementById('exSvg').value
        };

        if (id) {
            // Editar
            const idx = this.state.exercises.findIndex(e => e.id == id);
            if (idx >= 0) {
                this.state.exercises[idx] = exercise;
            }
        } else {
            // Agregar
            this.state.exercises.push(exercise);
        }

        Storage.saveExercises(this.state.exercises);
        this.renderExercisesList();

        document.getElementById('exerciseModal').style.display = 'none';
        alert('✓ Ejercicio guardado');
    },

    deleteExercise(id) {
        if (!confirm('¿Eliminar este ejercicio?')) return;

        this.state.exercises = this.state.exercises.filter(e => e.id != id);
        Storage.saveExercises(this.state.exercises);
        this.renderExercisesList();
    },

    // ========================================
    // GESTIÓN DE JUGADORES
    // ========================================

    renderPlayersList() {
        const tbody = document.getElementById('playersTableBody');
        tbody.innerHTML = '';

        this.state.players.forEach(p => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${p.nombre}</strong></td>
                <td>${p.posicion}</td>
                <td>${(p.antecedentes || []).map(a => `<span class="badge badge-amarillo">${a}</span>`).join('')}</td>
                <td>${(p.detectedDeficits || []).map(d => `<span class="badge badge-${d.status}">${d.name}</span>`).join('')}</td>
                <td>
                    <button onclick="App.deletePlayer('${p.id}')" style="padding: 4px 8px; background: #F44336; color: white; border: none; border-radius: 3px; cursor: pointer;">🗑️</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    deletePlayer(id) {
        if (!confirm('¿Eliminar este jugador?')) return;

        this.state.players = this.state.players.filter(p => p.id !== id);
        Storage.savePlayers(this.state.players);
        this.renderPlayersList();
        this.renderPlayerSelect();
        this.updateStats();
    },

    // ========================================
    // MICROCICLO
    // ========================================

    renderMicrocycle() {
        const grid = document.getElementById('microcycleGrid');
        grid.innerHTML = '';

        const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        const loads = ['suave', 'media', 'alta', 'partido', 'libre'];

        days.forEach(day => {
            const div = document.createElement('div');
            div.className = 'day-selector';
            div.innerHTML = `
                <h4>${day.charAt(0).toUpperCase() + day.slice(1)}</h4>
                <select data-day="${day}">
                    ${loads.map(l => `<option value="${l}" ${this.state.microcycle[day] === l ? 'selected' : ''}>${l}</option>`).join('')}
                </select>
            `;
            grid.appendChild(div);
        });
    },

    saveMicrocycle() {
        const selects = document.querySelectorAll('[data-day]');
        const microcycle = {};

        selects.forEach(select => {
            microcycle[select.dataset.day] = select.value;
        });

        this.state.microcycle = microcycle;
        Storage.saveMicrocycle(microcycle);
        alert('✓ Microciclo guardado');
    },

    // ========================================
    // GRUPOS
    // ========================================

    renderGroupsList() {
        const container = document.getElementById('groupsList');
        container.innerHTML = '';

        if (this.state.groups.length === 0) {
            container.innerHTML = '<p style="color: #999;">No hay grupos creados aún</p>';
            return;
        }

        this.state.groups.forEach(g => {
            const div = document.createElement('div');
            div.style.padding = '10px';
            div.style.background = '#f9f9f9';
            div.style.borderRadius = '6px';
            div.style.marginBottom = '8px';
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.style.alignItems = 'center';

            const playerNames = g.playerIds
                .map(id => this.state.players.find(p => p.id === id)?.nombre)
                .filter(Boolean)
                .join(', ');

            div.innerHTML = `
                <div>
                    <strong>${g.nombre}</strong>
                    <div style="font-size: 0.85rem; color: #666;">${playerNames}</div>
                </div>
                <button onclick="App.deleteGroup('${g.id}')" style="padding: 4px 8px; background: #F44336; color: white; border: none; border-radius: 3px; cursor: pointer;">🗑️</button>
            `;

            container.appendChild(div);
        });
    },

    addGroupModal() {
        const name = prompt('Nombre del grupo (ej: "Grupo Aquiles"):');
        if (!name) return;

        const group = {
            id: 'group_' + Date.now(),
            nombre: name,
            playerIds: []
        };

        this.state.groups.push(group);
        Storage.saveGroups(this.state.groups);
        this.renderGroupsList();
        this.renderPlayerSelect();
    },

    deleteGroup(id) {
        if (!confirm('¿Eliminar este grupo?')) return;

        this.state.groups = this.state.groups.filter(g => g.id !== id);
        Storage.saveGroups(this.state.groups);
        this.renderGroupsList();
        this.renderPlayerSelect();
    },

    // ========================================
    // CONFIGURACIÓN & BACKUP
    // ========================================

    saveConnectors() {
        const driveId = document.getElementById('driveFolderId').value.trim();
        const youtubeId = document.getElementById('youtubeChannelId').value.trim();

        const connectors = Storage.getConnectors();
        connectors.googleDriveFolderId = driveId;
        connectors.youtubeChannelId = youtubeId;
        Storage.saveConnectors(connectors);

        document.getElementById('connectorsStatus').innerHTML = '✓ Conectores guardados correctamente';
        document.getElementById('connectorsStatus').style.color = '#4CAF50';
    },

    exportData() {
        const data = Storage.exportAll();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_preventivos_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    Storage.importAll(data);
                    this.loadData();
                    alert('✓ Datos restaurados correctamente');
                    location.reload();
                } catch (error) {
                    alert('❌ Error al restaurar datos: ' + error.message);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    },

    clearAllData() {
        if (!confirm('⚠️ ¿Eliminar TODOS los datos? Esta acción no se puede deshacer.')) return;

        Storage.clearAll();
        alert('✓ Datos eliminados. Recargando...');
        location.reload();
    },

    updateStats() {
        const stats = Storage.getStats();
        const statsDiv = document.getElementById('dataStats');

        statsDiv.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                <div style="background: #f0f0f0; padding: 10px; border-radius: 6px; text-align: center;">
                    <div style="font-size: 18px; font-weight: 700; color: #0A1E4D;">${stats.jugadores}</div>
                    <div style="font-size: 0.85rem; color: #666;">Jugadores</div>
                </div>
                <div style="background: #f0f0f0; padding: 10px; border-radius: 6px; text-align: center;">
                    <div style="font-size: 18px; font-weight: 700; color: #0A1E4D;">${stats.ejercicios}</div>
                    <div style="font-size: 0.85rem; color: #666;">Ejercicios</div>
                </div>
                <div style="background: #f0f0f0; padding: 10px; border-radius: 6px; text-align: center;">
                    <div style="font-size: 18px; font-weight: 700; color: #0A1E4D;">${stats.grupos}</div>
                    <div style="font-size: 0.85rem; color: #666;">Grupos</div>
                </div>
                <div style="background: #f0f0f0; padding: 10px; border-radius: 6px; text-align: center;">
                    <div style="font-size: 18px; font-weight: 700; color: #0A1E4D;">${stats.preventivosGenerados}</div>
                    <div style="font-size: 0.85rem; color: #666;">Preventivos</div>
                </div>
            </div>
        `;
    }
};

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
