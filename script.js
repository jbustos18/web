// Variables globales para la clasificación
window.clasificacion = []; // Almacenar datos de clasificación

document.addEventListener('DOMContentLoaded', () => {
    // Ruta del archivo Excel en la carpeta
    const filePath = 'tabla_torneo_domino.xlsx';

    // Cargar el archivo Excel
    fetch(filePath)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });

            // Leer la hoja de clasificación
            const classificationSheetName = workbook.SheetNames.find(name => name === 'Clasificación');
            const classificationSheet = workbook.Sheets[classificationSheetName];
            const classificationData = XLSX.utils.sheet_to_json(classificationSheet);

            // Almacenar los datos de clasificación globalmente
            window.clasificacion = classificationData;

            // Poblar la tabla de clasificación
            if (window.clasificacion.length > 0) {
                populateTable(window.clasificacion);
            } else {
                console.error('No se encontraron datos para la clasificación.');
            }
        })
        .catch(error => console.error('Error al cargar el archivo Excel:', error));
});

// Función para poblar la tabla de clasificación
function populateTable(data) {
    const tableBody = document.querySelector('#classification-table tbody');
    tableBody.innerHTML = '';

    data.forEach((row, index) => {
        const tr = document.createElement('tr');

        // Resaltar las primeras 8 filas (opcional)
        if (index < 8) {
            tr.classList.add('highlight');
        }

        tr.innerHTML = `
            <td>${row['#'] || ''}</td>
            <td>${row['Pareja'] || ''}</td>
            <td>${row['JJ'] || ''}</td>
            <td>${row['G'] || ''}</td>
            <td>${row['P'] || ''}</td>
            <td>${row['PTS(D)'] || ''}</td>
            <td>${row['PTS'] || ''}</td>
        `;
        tableBody.appendChild(tr);
    });
}
