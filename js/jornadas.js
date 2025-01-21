// Variables globales para las jornadas
let currentJornada = 1;
window.jornadas = []; // Almacenar datos de jornadas

document.addEventListener('DOMContentLoaded', () => {
    // Ruta del archivo Excel en la carpeta
    const filePath = 'tabla_torneo_domino.xlsx';

    // Cargar el archivo Excel
    fetch(filePath)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });

            // Leer la hoja de jornadas
            const jornadasSheetName = workbook.SheetNames.find(name => name === 'Jornadas');
            const jornadasSheet = workbook.Sheets[jornadasSheetName];
            const jornadasData = XLSX.utils.sheet_to_json(jornadasSheet);

            // Almacenar los datos de jornadas globalmente
            window.jornadas = jornadasData;

            // Cargar la Jornada 1 directamente
            if (window.jornadas.length > 0) {
                loadJornada(currentJornada);
            } else {
                console.error('No se encontraron datos para las jornadas.');
            }
        })
        .catch(error => console.error('Error al cargar el archivo Excel:', error));
});

// Función para cargar una jornada específica
function loadJornada(jornadaNumber) {
    const tbody = document.getElementById('jornadasTableBody');
    const jornadaTitle = document.getElementById('jornada-title');

    // Reiniciar contenido de la tabla
    tbody.innerHTML = '';
    jornadaTitle.textContent = `Jornada ${jornadaNumber}`;

    // Filtrar las filas de la jornada seleccionada
    const jornada = window.jornadas.filter(j => parseInt(j.Jornada) === jornadaNumber);

    if (jornada.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2">No hay datos disponibles para esta jornada.</td></tr>';
        return;
    }

    jornada.forEach(match => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${match["Pareja Local"] || ''}</td>
            <td>${match["Pareja Visitante"] || ''}</td>
        `;
        tbody.appendChild(row);
    });
}

// Función para avanzar a la siguiente jornada
function nextJornada() {
    currentJornada++;
    const maxJornada = Math.max(...window.jornadas.map(j => parseInt(j.Jornada)));

    if (currentJornada > maxJornada) {
        currentJornada = maxJornada;
    }

    loadJornada(currentJornada);
}

// Función para retroceder a la jornada anterior
function previousJornada() {
    currentJornada--;
    if (currentJornada < 1) {
        currentJornada = 1;
    }
    loadJornada(currentJornada);
}
