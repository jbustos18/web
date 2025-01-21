// Variables globales para los resultados
window.resultados = []; // Almacenar datos de resultados

document.addEventListener('DOMContentLoaded', () => {
    // Ruta del archivo Excel en la carpeta
    const filePath = 'tabla_torneo_domino.xlsx';

    // Cargar el archivo Excel
    fetch(filePath)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });

            // Leer la hoja de resultados
            const resultadosSheetName = workbook.SheetNames.find(name => name === 'Resultados');
            const resultadosSheet = workbook.Sheets[resultadosSheetName];
            const resultadosData = XLSX.utils.sheet_to_json(resultadosSheet);

            // Almacenar los datos de resultados globalmente
            window.resultados = resultadosData;

            // Poblar la tabla de resultados
            if (window.resultados.length > 0) {
                populateResultadosTable(window.resultados);
            } else {
                console.error('No se encontraron datos para los resultados.');
            }
        })
        .catch(error => console.error('Error al cargar el archivo Excel:', error));
});

// Función para poblar la tabla de resultados
function populateResultadosTable(data) {
    const tableBody = document.querySelector('#resultados-table tbody');
    tableBody.innerHTML = '';

    data.forEach((row) => {
        const tr = document.createElement('tr');

        // Comparar los puntos para determinar el ganador
        const ptsLocal = parseInt(row['PTS']) || 0;
        const ptsVisitante = parseInt(row['PTS V']) || 0;

        // Generar el contenido de la fila
        tr.innerHTML = `
            <td>${row['Jornada'] || ''}</td>
            <td>${row['Pareja'] || ''}</td>
            <td>${ptsLocal}</td>
            <td>${row['Pareja V'] || ''}</td>
            <td>${ptsVisitante}</td>
            <td>${row['Resultado'] || ''}</td>
        `;

        // Aplicar la clase 'winner' al ganador
        if (ptsLocal > ptsVisitante) {
            tr.children[1].classList.add('winner'); // Pareja Local
        } else if (ptsVisitante > ptsLocal) {
            tr.children[3].classList.add('winner'); // Pareja Visitante
        }

        tableBody.appendChild(tr);
    });
}
