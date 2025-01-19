// Variables globales para la clasificación y la liguilla
window.liguilla = []; // Almacenar los datos de los mejores 8 parejas

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

            // Seleccionar los mejores 8 parejas
            const top8 = classificationData
                .sort((a, b) => b.PTS - a.PTS) // Ordenar por puntos (de mayor a menor)
                .slice(0, 8); // Tomar los primeros 8

            // Almacenar los datos de la liguilla globalmente
            window.liguilla = top8;

            // Poblar la tabla de liguilla
            if (window.liguilla.length > 0) {
                populateLiguillaTable(window.liguilla);
            } else {
                console.error('No se encontraron suficientes datos para la liguilla.');
            }
        })
        .catch(error => console.error('Error al cargar el archivo Excel:', error));
});

// Función para poblar la tabla de liguilla
function populateLiguillaTable(data) {
    const tableBody = document.querySelector('#liguilla-table tbody');
    tableBody.innerHTML = '';

    // Definir los enfrentamientos (1° vs 8°, 2° vs 7°, etc.)
    const matches = [
        [0, 7], // 1° vs 8°
        [1, 6], // 2° vs 7°
        [2, 5], // 3° vs 6°
        [3, 4]  // 4° vs 5°
    ];

    matches.forEach(([pos1, pos2]) => {
        const pareja1 = data[pos1];
        const pareja2 = data[pos2];

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${pos1 + 1}</td>
            <td>${pareja1['Pareja'] || ''}</td>
            <td>VS</td>
            <td>${pareja2['Pareja'] || ''}</td>
            <td>${pos2 + 1}</td>
        `;

        tableBody.appendChild(tr);
    });
}
