document.addEventListener('DOMContentLoaded', () => {
    const torneoSetup = document.getElementById('torneo-setup');
    const parejasLista = document.getElementById('parejas-lista');
    const encuentrosDiv = document.getElementById('encuentros');
    const liguillaDiv = document.getElementById('liguilla-rapida');
    const parejasForm = document.getElementById('parejas-form');
    const encuentrosBody = document.getElementById('encuentros-body');
    const liguillaEncuentros = document.getElementById('liguilla-encuentros');
    let parejas = [];
    let encuentros = [];

    // Configurar número de parejas
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

    // Generar encuentros
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

        // Crear todos los encuentros posibles
        encuentros = [];
        for (let i = 0; i < parejas.length; i++) {
            for (let j = i + 1; j < parejas.length; j++) {
                encuentros.push({ local: parejas[i], visitante: parejas[j], ptsLocal: 0, ptsVisitante: 0 });
            }
        }

        // Mostrar los encuentros en la tabla
        encuentrosBody.innerHTML = '';
        encuentros.forEach((encuentro, index) => {
            encuentrosBody.innerHTML += `
                <tr>
                    <td>${encuentro.local}</td>
                    <td>${encuentro.visitante}</td>
                    <td><input type="number" id="pts-local-${index}" min="0" placeholder="PTS"></td>
                    <td><input type="number" id="pts-visitante-${index}" min="0" placeholder="PTS"></td>
                </tr>
            `;
        });

        encuentrosDiv.classList.remove('hidden');
    });

    // Generar liguilla
    document.getElementById('btn-generar-liguilla').addEventListener('click', () => {
        // Leer resultados
        encuentros.forEach((encuentro, index) => {
            encuentro.ptsLocal = parseInt(document.getElementById(`pts-local-${index}`).value) || 0;
            encuentro.ptsVisitante = parseInt(document.getElementById(`pts-visitante-${index}`).value) || 0;
        });

        // Calcular puntos totales por pareja
        const puntosParejas = parejas.map((pareja) => ({
            nombre: pareja,
            puntos: 0,
            diferencia: 0,
            ganados: 0, // Contar los juegos ganados
        }));

        encuentros.forEach(({ local, visitante, ptsLocal, ptsVisitante }) => {
            const parejaLocal = puntosParejas.find((p) => p.nombre === local);
            const parejaVisitante = puntosParejas.find((p) => p.nombre === visitante);

            if (ptsLocal > ptsVisitante) {
                parejaLocal.puntos += 3;
                parejaLocal.ganados += 1;
            } else if (ptsVisitante > ptsLocal) {
                parejaVisitante.puntos += 3;
                parejaVisitante.ganados += 1;
            } else {
                parejaLocal.puntos += 1;
                parejaVisitante.puntos += 1;
            }

            parejaLocal.diferencia += ptsLocal - ptsVisitante;
            parejaVisitante.diferencia += ptsVisitante - ptsLocal;
        });

        // Ordenar por puntos, luego por diferencia
        puntosParejas.sort((a, b) => b.puntos - a.puntos || b.diferencia - a.diferencia);

        // Verificar si alguna pareja ganó todos los encuentros
        const totalPartidosPorPareja = parejas.length - 1;
        const parejaInvicta = puntosParejas.find((p) => p.ganados === totalPartidosPorPareja);

        liguillaEncuentros.innerHTML = '';

        if (parejaInvicta) {
            // Caso especial: pareja invicta va directo a la final
            liguillaEncuentros.innerHTML += `
                <div class="finalista-directo">
                    <h4>Finalista Directo: ${parejaInvicta.nombre}</h4>
                </div>
                <div class="semifinal">
                    <h4>Semifinal</h4>
                    <p>${puntosParejas[1].nombre} vs ${puntosParejas[2].nombre}</p>
                </div>
            `;
        } else {
            // Generar semifinales normales
            liguillaEncuentros.innerHTML += `
                <div class="semifinal">
                    <h4>Semifinales</h4>
                    <p>${puntosParejas[0].nombre} vs ${puntosParejas[3].nombre}</p>
                    <p>${puntosParejas[1].nombre} vs ${puntosParejas[2].nombre}</p>
                </div>
            `;
        }

        liguillaDiv.classList.remove('hidden');
    });
});
