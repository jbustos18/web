let torneoIdCounter = 1;
let parejasPorTorneo = {};
let resultadosPorTorneo = {};

function crearTorneo() {
    const torneosContainer = document.getElementById('torneos');
    const torneoId = `torneo${torneoIdCounter++}`;

    const torneoDiv = document.createElement('div');
    torneoDiv.className = 'torneo';
    torneoDiv.id = `container-${torneoId}`;

    torneoDiv.innerHTML = `
        <h3>Torneo ${torneoIdCounter - 1}</h3>
        <div class="button-group">
            <div class="plus-button" onclick="expandirTorneo('${torneoId}')">
                <span class="material-symbols-outlined">add</span>
            </div>
        </div>
    `;

    const configuracionDiv = document.createElement('div');
    configuracionDiv.id = torneoId;
    configuracionDiv.className = 'configuracion';
    configuracionDiv.innerHTML = `
        <h3>Configuración del Torneo</h3>
        <label for="${torneoId}-equipos">Número de equipos:</label>
        <input type="number" id="${torneoId}-equipos" min="2" max="20" value="4"><br><br>
        <label for="${torneoId}-puntos">Puntos para ganar:</label>
        <input type="number" id="${torneoId}-puntos" min="50" max="500" value="100"><br><br>
        <div class="boton-container">
            <button class="boton" onclick="crearParejas('${torneoId}-equipos', '${torneoId}-lista-parejas')">Agregar Parejas</button>
        </div>
        <div id="${torneoId}-lista-parejas"></div>
        <div class="boton-container" style="display: none;">
            <button class="boton" onclick="generarEncuentros('${torneoId}-lista-parejas', '${torneoId}-tabla-encuentros', '${torneoId}-puntos')">Generar Encuentros</button>
        </div>
        <div id="${torneoId}-tabla-encuentros"></div>
        <div class="boton-container" style="display: none;">
            <button class="boton" onclick="generarLiguilla('${torneoId}-lista-parejas', '${torneoId}-tabla-liguilla', '${torneoId}-puntos')">Generar Liguilla</button>
        </div>
        <div id="${torneoId}-tabla-liguilla"></div>
    `;

    torneosContainer.appendChild(torneoDiv);
    torneosContainer.appendChild(configuracionDiv);
}

function expandirTorneo(id) {
    const config = document.getElementById(id);
    const buttonGroup = document.querySelector(`#container-${id} .button-group`);

    config.style.display = 'block';

    buttonGroup.innerHTML = `
        <div class="delete-button" onclick="eliminarTorneo('${id}')">
            <span class="material-symbols-outlined">close</span>
        </div>
        <div class="minimize-button" onclick="minimizarTorneo('${id}')">
            <span class="material-symbols-outlined">remove</span>
        </div>
    `;
}

function minimizarTorneo(id) {
    const config = document.getElementById(id);
    const buttonGroup = document.querySelector(`#container-${id} .button-group`);

    config.style.display = 'none';

    buttonGroup.innerHTML = `
        <div class="plus-button" onclick="expandirTorneo('${id}')">+</div>
    `;
}

function eliminarTorneo(id) {
    const torneoContainer = document.getElementById(`container-${id}`);
    const configuracionDiv = document.getElementById(id);

    torneoContainer.remove();
    configuracionDiv.remove();

    delete parejasPorTorneo[id];
    delete resultadosPorTorneo[id];
}

function crearParejas(equiposId, listaId) {
    const numEquipos = document.getElementById(equiposId).value;
    const lista = document.getElementById(listaId);
    lista.innerHTML = '';
    parejasPorTorneo[listaId] = [];
    resultadosPorTorneo[listaId] = {};

    for (let i = 1; i <= numEquipos; i++) {
        const parejaDiv = document.createElement('div');
        parejaDiv.className = 'pareja-item';
        parejaDiv.innerHTML = `
            <label for="${listaId}-pareja${i}">Pareja ${i}:</label>
            <input type="text" id="${listaId}-pareja${i}" placeholder="Nombre de la pareja">
        `;
        lista.appendChild(parejaDiv);
        const parejaNombre = `Pareja ${i}`;
        parejasPorTorneo[listaId].push(parejaNombre);
        resultadosPorTorneo[listaId][parejaNombre] = 0;
    }

    // Mostrar el botón "Generar Encuentros"
    const botonGenerarEncuentros = lista.nextElementSibling;
    if (botonGenerarEncuentros) {
        botonGenerarEncuentros.style.display = 'block';
    }
}

function generarEncuentros(listaId, tablaId, puntosId) {
    const tabla = document.getElementById(tablaId);
    tabla.innerHTML = '';

    const parejas = parejasPorTorneo[listaId];
    if (!parejas || parejas.length < 2) {
        alert('Debe agregar al menos 2 parejas para generar encuentros.');
        return;
    }

    const jornadas = [];
    const numEquipos = parejas.length;

    for (let jornada = 0; jornada < numEquipos - 1; jornada++) {
        const juegos = [];
        for (let i = 0; i < numEquipos / 2; i++) {
            const local = parejas[(jornada + i) % numEquipos];
            const visitante = parejas[(numEquipos - 1 - i + jornada) % numEquipos];
            juegos.push({ local, visitante });
        }
        jornadas.push(juegos);
    }

    jornadas.forEach((juegos, index) => {
        const jornadaDiv = document.createElement('div');
        jornadaDiv.innerHTML = `<h4>Jornada ${index + 1}</h4>`;
        const table = document.createElement('table');
        table.innerHTML = `
            <tr>
                <th>Pareja</th>
                <th>Pareja</th>
                <th>PTS</th>
                <th>PTS</th>
            </tr>
        `;
        juegos.forEach(juego => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${juego.local}</td>
                <td>${juego.visitante}</td>
                <td><input type="number" class="puntos-input" data-pareja="${juego.local}" min="0"></td>
                <td><input type="number" class="puntos-input" data-pareja="${juego.visitante}" min="0"></td>
            `;
            table.appendChild(row);
        });
        jornadaDiv.appendChild(table);
        tabla.appendChild(jornadaDiv);
    });

    // Mostrar el botón "Generar Liguilla"
    const botonGenerarLiguilla = tabla.nextElementSibling;
    if (botonGenerarLiguilla) {
        botonGenerarLiguilla.style.display = 'block';
    }
}

function generarLiguilla(listaId, tablaId, puntosId) {
    const tabla = document.getElementById(tablaId);
    tabla.innerHTML = '';

    const parejas = parejasPorTorneo[listaId];
    if (!parejas || parejas.length < 4) {
        alert('Debe haber al menos 4 parejas para generar la liguilla.');
        return;
    }

    const equiposConResultados = Object.entries(resultadosPorTorneo[listaId])
        .map(([pareja, puntos]) => ({ pareja, puntos }))
        .sort((a, b) => b.puntos - a.puntos);

    const semifinalistas = equiposConResultados.slice(0, 4);
    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Semifinal</th>
            <th>Pareja</th>
            <th>Pareja</th>
        </tr>
        <tr>
            <td>1</td>
            <td>${semifinalistas[0].pareja}</td>
            <td>${semifinalistas[3].pareja}</td>
        </tr>
        <tr>
            <td>2</td>
            <td>${semifinalistas[1].pareja}</td>
            <td>${semifinalistas[2].pareja}</td>
        </tr>
    `;
    tabla.appendChild(table);
}
