// Generador de PDF
// Exporta preventivos en formato PDF imprimible

const PDF = {

    // Genera PDF de preventivo
    generatePreventivoPDF(preventivo, players, exercises) {
        // Usar html2canvas + jsPDF para mejor control de diseño
        const content = this.createHTMLContent(preventivo, players, exercises);
        const element = document.createElement('div');
        element.innerHTML = content;
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        element.style.width = '210mm'; // A4
        element.style.fontSize = '12px';
        element.style.fontFamily = 'Inter, sans-serif';
        document.body.appendChild(element);

        html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jspdf.jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 210; // A4 width
            const pageHeight = 297; // A4 height
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            const filename = `Preventivo_${preventivo.playersNames.join('_')}_${preventivo.date.split(' ')[0]}.pdf`;
            pdf.save(filename);

            document.body.removeChild(element);
        });
    },

    // Crea HTML del preventivo (estilo ficha de rendimiento)
    createHTMLContent(preventivo, players, exercises) {
        const playerInfo = players.find(p => p.id === preventivo.playersIds[0]);
        const exercisesByCategory = this.groupExercisesByCategory(preventivo.suggestedExercises);

        return `
            <div style="font-family: Inter, sans-serif; padding: 20px; background: #f5f5f5;">

                <!-- HEADER -->
                <div style="background: linear-gradient(135deg, #0A1E4D 0%, #001845 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; font-family: Oswald, sans-serif; margin-bottom: 10px;">CLUB NACIONAL</div>
                    <div style="font-size: 18px; font-weight: 600;">Ficha de Preventivo</div>
                    <div style="font-size: 12px; opacity: 0.9; margin-top: 5px;">${preventivo.date}</div>
                </div>

                <!-- INFORMACIÓN DEL JUGADOR -->
                <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #C8102E;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                        <div>
                            <div style="font-size: 10px; color: #666; text-transform: uppercase; margin-bottom: 5px;">Nombre</div>
                            <div style="font-size: 16px; font-weight: 700; font-family: Oswald, sans-serif; color: #0A1E4D;">${preventivo.playersNames.join(', ')}</div>
                        </div>
                        <div>
                            <div style="font-size: 10px; color: #666; text-transform: uppercase; margin-bottom: 5px;">Posición</div>
                            <div style="font-size: 14px; font-weight: 600; color: #333;">${playerInfo?.posicion || 'N/A'}</div>
                        </div>
                        <div>
                            <div style="font-size: 10px; color: #666; text-transform: uppercase; margin-bottom: 5px;">Carga del Día</div>
                            <div style="font-size: 14px; font-weight: 600; color: #C8102E;">${this.getLoadLabel(preventivo.loadIntensity)}</div>
                        </div>
                    </div>
                </div>

                <!-- DÉFICITS DETECTADOS -->
                ${preventivo.commonDeficits.length > 0 ? `
                <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; font-family: Oswald, sans-serif; color: #0A1E4D; margin-bottom: 10px;">DÉFICITS DETECTADOS</div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                        ${preventivo.commonDeficits.map(d => `
                            <div style="padding: 8px; background: ${this.getStatusColor(d.status)}; border-radius: 4px; font-size: 12px; color: white; font-weight: 600;">
                                ${d.name} (${d.count} jugador${d.count > 1 ? 'es' : ''})
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- ANTECEDENTES CLÍNICOS -->
                ${preventivo.commonAntecedents.length > 0 ? `
                <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <div style="font-size: 14px; font-weight: 700; font-family: Oswald, sans-serif; color: #0A1E4D; margin-bottom: 10px;">⚠️ ANTECEDENTES CLÍNICOS</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${preventivo.commonAntecedents.map(a => `
                            <div style="padding: 6px 12px; background: rgba(200, 16, 46, 0.1); border: 1px solid #C8102E; border-radius: 4px; font-size: 11px; color: #A00D24; font-weight: 600;">
                                ${a.name}
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- EJERCICIOS POR CATEGORÍA -->
                ${Object.entries(exercisesByCategory).map(([category, exercises]) => `
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <div style="background: #0A1E4D; color: white; padding: 10px; border-radius: 4px; margin-bottom: 10px; font-weight: 700; font-family: Oswald, sans-serif;">
                            ${category}
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            ${exercises.map((ex, idx) => `
                                <div style="border-left: 3px solid #0A4DA6; padding: 10px; background: #f9f9f9; border-radius: 4px;">
                                    <div style="font-weight: 600; font-size: 13px; margin-bottom: 3px;">${idx + 1}. ${ex.nombre}</div>
                                    <div style="font-size: 11px; color: #666; margin-bottom: 5px;">${ex.description || ''}</div>
                                    <div style="font-size: 10px; color: #999;">
                                        ${ex.deficitAplica.length > 0 ? `<strong>Aplica a:</strong> ${ex.deficitAplica.join(', ')}` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}

                <!-- FOOTER -->
                <div style="text-align: center; font-size: 10px; color: #999; margin-top: 20px; padding-top: 10px; border-top: 1px solid #ccc;">
                    <div>Generado automáticamente por Planificador de Preventivos - Club Nacional</div>
                    <div>${new Date().toLocaleString('es-UY')}</div>
                </div>

            </div>
        `;
    },

    // Agrupa ejercicios por categoría
    groupExercisesByCategory(exercises) {
        return exercises.reduce((acc, ex) => {
            if (!acc[ex.categoria]) {
                acc[ex.categoria] = [];
            }
            acc[ex.categoria].push(ex);
            return acc;
        }, {});
    },

    getStatusColor(status) {
        switch (status) {
            case 'rojo': return '#F44336';
            case 'amarillo': return '#FFC107';
            case 'verde': return '#4CAF50';
            default: return '#999';
        }
    },

    getLoadLabel(load) {
        const labels = {
            suave: '🟢 Suave',
            media: '🟡 Media',
            alta: '🔴 Alta',
            partido: '⚫ Partido',
            libre: '⚪ Día Libre'
        };
        return labels[load] || load;
    }
};
