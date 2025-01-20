document.addEventListener('DOMContentLoaded', () => {
    const parejasForm = document.getElementById('parejas-form');
    const encuentrosBody = document.getElementById('encuentros-body');
    const liguillaEncuentros = document.getElementById('liguilla-encuentros');
    const liguillaDiv = document.getElementById('liguilla-rapida');
    const parejasLista = document.getElementById('parejas-lista');
    const encuentrosDiv = document.getElementById('encuentros');
    let parejas = [];
    let encuentrosPorJornada = [];

    // Configurar número de parejas y mostrar formulario para nombres
    document.getElementById('btn-agregar-parejas').addEventListener('click', () => {
        const numParejas = parseInt(document.getElementById('num-parejas').value);
        if (numParejas >= 3 && numParejas <= 10) {
            parejasLista.classList.remove('hidden');
            parejasForm.innerHTML = '';
            for (let i = 0; i < numParejas; i++) {
                parejasForm.innerHTML += `
                    <div>
                        <label>Pareja ${i + 1}:</label>
                        <input type="text" id="pareja-${i}" placeholder="Nombre de la Pareja ${i + 1}" required>
                    </div>
                `;
            }
        } else {
            alert('Ingrese un número de parejas entre 3 y 10.');
        }
    });

    // Generar encuentros por jornada
    document.getElementById('btn-generar-encuentros').addEventListener('click', () => {
        parejas = [];
        const inputs = parejasForm.querySelectorAll('input');
        inputs.forEach((input) => {
            parejas.push(input.value.trim());
        });

        if (parejas.length < 3) {
            alert('Debe ingresar al menos 3 parejas.');
            return;
        }

        // Ajustar para número impar de parejas
        if (parejas.length % 2 !== 0) {
            parejas.push("Bye");
        }

        // Generar jornadas usando Round Robin
        encuentrosPorJornada = [];
        const totalJornadas = parejas.length - 1;
        const totalParejas = parejas.length;

        for (let jornada = 0; jornada < totalJornadas; jornada++) {
            const encuentrosDeEstaJornada = [];

            for (let i = 0; i < totalParejas / 2; i++) {
                const local = parejas[i];
                const visitante = parejas[totalParejas - 1 - i];

                if (local !== "Bye" && visitante !== "Bye") {
                    encuentrosDeEstaJornada.push({
                        jornada: jornada + 1,
                        local,
                        visitante,
                        ptsLocal: 0,
                        ptsVisitante: 0,
                        hecho: false,
                    });
                }
            }

            encuentrosPorJornada.push(encuentrosDeEstaJornada);

            // Rotar parejas para la siguiente jornada
            const fixed = parejas[0];
            const rotables = parejas.slice(1);
            const last = rotables.pop();
            rotables.unshift(last);
            parejas = [fixed, ...rotables];
        }

        // Mostrar jornadas
        encuentrosBody.innerHTML = '';
        encuentrosPorJornada.forEach((encuentrosDeJornada, jornadaIndex) => {
            encuentrosBody.innerHTML += `
                <tr class="jornada-header">
                    <td colspan="5">Jornada ${jornadaIndex + 1}</td>
                </tr>
            `;
            encuentrosDeJornada.forEach((encuentro, index) => {
                encuentrosBody.innerHTML += `
                    <tr>
                        <td>${encuentro.local}</td>
                        <td>${encuentro.visitante}</td>
                        <td><input type="number" id="pts-local-${jornadaIndex}-${index}" min="0" placeholder="PTS"></td>
                        <td><input type="number" id="pts-visitante-${jornadaIndex}-${index}" min="0" placeholder="PTS"></td>
                        <td><button id="hecho-${jornadaIndex}-${index}" class="btn-hecho">Hecho</button></td>
                    </tr>
                `;
            });
        });

        encuentrosDiv.classList.remove('hidden');

        // Agregar funcionalidad a los botones "Hecho"
        document.querySelectorAll('.btn-hecho').forEach((button) => {
            button.addEventListener('click', (event) => {
                const [jornadaIndex, index] = event.target.id.split('-').slice(1).map(Number);
                const encuentro = encuentrosPorJornada[jornadaIndex][index];

                // Bloquear inputs
                const ptsLocalInput = document.getElementById(`pts-local-${jornadaIndex}-${index}`);
                const ptsVisitanteInput = document.getElementById(`pts-visitante-${jornadaIndex}-${index}`);

                ptsLocalInput.setAttribute('readonly', true);
                ptsVisitanteInput.setAttribute('readonly', true);

                // Cambiar estilo del botón
                event.target.textContent = 'Listo';
                event.target.disabled = true;

                // Actualizar estado
                encuentro.ptsLocal = parseInt(ptsLocalInput.value) || 0;
                encuentro.ptsVisitante = parseInt(ptsVisitanteInput.value) || 0;
                encuentro.hecho = true;
            });
        });
    });

    // Generar liguilla
    document.getElementById('btn-generar-liguilla').addEventListener('click', () => {
        const puntosPorPareja = parejas.map((pareja) => ({
            nombre: pareja,
            puntos: 0,
            diferencia: 0,
            ganados: 0,
        }));

        encuentrosPorJornada.forEach((encuentrosDeJornada) => {
            encuentrosDeJornada.forEach((encuentro) => {
                const local = puntosPorPareja.find((p) => p.nombre === encuentro.local);
                const visitante = puntosPorPareja.find((p) => p.nombre === encuentro.visitante);

                if (encuentro.ptsLocal > encuentro.ptsVisitante) {
                    local.puntos += 3;
                    local.ganados += 1;
                } else if (encuentro.ptsVisitante > encuentro.ptsLocal) {
                    visitante.puntos += 3;
                    visitante.ganados += 1;
                } else {
                    local.puntos += 1;
                    visitante.puntos += 1;
                }

                local.diferencia += encuentro.ptsLocal - encuentro.ptsVisitante;
                visitante.diferencia += encuentro.ptsVisitante - encuentro.ptsLocal;
            });
        });

        puntosPorPareja.sort((a, b) => b.puntos - a.puntos || b.diferencia - a.diferencia);

        // Verificar si hay una pareja invicta
        const totalJornadas = parejas.length - 1;
        const parejaInvicta = puntosPorPareja.find((p) => p.ganados === totalJornadas);

        liguillaEncuentros.innerHTML = '';

        if (parejaInvicta) {
            liguillaEncuentros.innerHTML += `
                <div class="finalista-directo">
                    <h4>Finalista Directo: ${parejaInvicta.nombre}</h4>
                </div>
                <div class="semifinal">
                    <h4>Semifinal</h4>
                    <p>${puntosPorPareja[1].nombre} vs ${puntosPorPareja[2].nombre}</p>
                </div>
            `;
        } else {
            liguillaEncuentros.innerHTML += `
                <div class="semifinal">
                    <h4>Semifinales</h4>
                    <p>${puntosPorPareja[0].nombre} vs ${puntosPorPareja[3].nombre}</p>
                    <p>${puntosPorPareja[1].nombre} vs ${puntosPorPareja[2].nombre}</p>
                </div>
            `;
        }

        liguillaDiv.classList.remove('hidden');
    });
});
