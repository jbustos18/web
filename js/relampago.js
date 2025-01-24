document.getElementById("crearTorneo").addEventListener("click", () => {
    const torneoTemplate = document.getElementById("torneoTemplate").content.cloneNode(true);
    const torneoDiv = torneoTemplate.querySelector(".torneo");

    // Botón de configuración
    const configurarButton = torneoDiv.querySelector(".btn-configurar");
    const configDiv = torneoDiv.querySelector(".config");
    configurarButton.addEventListener("click", () => {
        configDiv.style.display = configDiv.style.display === "none" ? "block" : "none";
    });

    // Botón de minimizar y expandir
    const minimizarButton = torneoDiv.querySelector(".btn-minimizar");
    const icon = document.createElement("span");
    icon.classList.add("material-symbols-outlined");
    icon.innerText = "arrow_drop_down";
    minimizarButton.appendChild(icon);

    minimizarButton.addEventListener("click", () => {
        if (configDiv.style.display !== "none") {
            configDiv.style.display = "none";
            icon.classList.add("rotate");
        } else {
            configDiv.style.display = "block";
            icon.classList.remove("rotate");
        }
    });

    // Botón de eliminar
    const eliminarButton = torneoDiv.querySelector(".btn-eliminar");
    eliminarButton.addEventListener("click", () => {
        torneoDiv.remove();
    });

    // Botón de agregar parejas
    const agregarParejasButton = torneoDiv.querySelector(".btn-agregar-parejas");
    const parejasDiv = torneoDiv.querySelector(".parejas");
    agregarParejasButton.addEventListener("click", () => {
        parejasDiv.innerHTML = "";
        const numEquipos = parseInt(torneoDiv.querySelector(".num-equipos").value);
        for (let i = 1; i <= numEquipos; i++) {
            const parejaInput = document.createElement("input");
            parejaInput.type = "text";
            parejaInput.placeholder = `Nombre de Pareja ${i}`;
            parejaInput.dataset.parejaId = i;
            parejasDiv.appendChild(parejaInput);
        }
    });

    // Botón de generar encuentros
    const generarEncuentrosButton = torneoDiv.querySelector(".btn-generar-encuentros");
    const jornadasDiv = torneoDiv.querySelector(".jornadas");
    generarEncuentrosButton.addEventListener("click", () => {
        jornadasDiv.innerHTML = "";
        const equipos = Array.from(parejasDiv.querySelectorAll("input")).map(input => input.value);

        if (equipos.length % 2 !== 0) equipos.push("Descanso");

        const totalJornadas = equipos.length - 1;
        const mitad = equipos.length / 2;

        for (let i = 0; i < totalJornadas; i++) {
            const jornadaTemplate = document.getElementById("jornadaTemplate").content.cloneNode(true);
            const jornadaDiv = jornadaTemplate.querySelector(".jornada");
            jornadaDiv.querySelector("h3").textContent = `Jornada ${i + 1}`;
            const tbody = jornadaDiv.querySelector("tbody");

            for (let j = 0; j < mitad; j++) {
                const local = equipos[j];
                const visitante = equipos[equipos.length - 1 - j];
                if (local !== "Descanso" && visitante !== "Descanso") {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${local}</td>
                        <td>${visitante}</td>
                        <td><input type="number" class="puntosLocal" placeholder="PTS"></td>
                        <td><input type="number" class="puntosVisitante" placeholder="PTS"></td>
                    `;
                    tbody.appendChild(row);
                }
            }

            jornadasDiv.appendChild(jornadaDiv);

            const ultimo = equipos.pop();
            equipos.splice(1, 0, ultimo);
        }
    });

    // Botón de generar liguilla
    const generarLiguillaButton = torneoDiv.querySelector(".btn-generar-liguilla");
    const liguillaDiv = torneoDiv.querySelector(".liguilla");
    generarLiguillaButton.addEventListener("click", () => {
        liguillaDiv.innerHTML = "";
        const puntosPorEquipo = {};

        jornadasDiv.querySelectorAll(".jornada").forEach(jornada => {
            jornada.querySelectorAll("tbody tr").forEach(row => {
                const local = row.cells[0].textContent;
                const visitante = row.cells[1].textContent;
                const puntosLocal = parseInt(row.querySelector(".puntosLocal").value) || 0;
                const puntosVisitante = parseInt(row.querySelector(".puntosVisitante").value) || 0;

                if (!puntosPorEquipo[local]) puntosPorEquipo[local] = 0;
                if (!puntosPorEquipo[visitante]) puntosPorEquipo[visitante] = 0;

                if (puntosLocal > puntosVisitante) puntosPorEquipo[local]++;
                else if (puntosVisitante > puntosLocal) puntosPorEquipo[visitante]++;
            });
        });

        const equiposOrdenados = Object.keys(puntosPorEquipo).sort((a, b) => puntosPorEquipo[b] - puntosPorEquipo[a]);

        if (equiposOrdenados.length > 0 && puntosPorEquipo[equiposOrdenados[0]] === jornadasDiv.querySelectorAll(".jornada").length) {
            // Crear tabla para el finalista directo
            const tablaFinalista = document.createElement("table");
            const encabezadoFinalista = tablaFinalista.insertRow();
            encabezadoFinalista.insertCell().textContent = "Ronda";
            encabezadoFinalista.insertCell().textContent = "Equipo";
            encabezadoFinalista.style.backgroundColor = "#343a40";
            encabezadoFinalista.style.color = "white";
        
            const filaFinalista = tablaFinalista.insertRow();
            filaFinalista.insertCell().textContent = "Finalista";
            filaFinalista.insertCell().textContent = equiposOrdenados[0];
        
            liguillaDiv.innerHTML = ""; // Limpiar contenido previo
            liguillaDiv.appendChild(tablaFinalista);
        
            // Crear tabla para la semifinal
            const tablaSemifinal = document.createElement("table");
            const encabezadoSemifinal = tablaSemifinal.insertRow();
            encabezadoSemifinal.insertCell().textContent = "Ronda";
            encabezadoSemifinal.insertCell().textContent = "Partido";
            encabezadoSemifinal.style.backgroundColor = "#343a40";
            encabezadoSemifinal.style.color = "white";
        
            const filaSemifinal = tablaSemifinal.insertRow();
            filaSemifinal.insertCell().textContent = "Semifinal";
            filaSemifinal.insertCell().textContent = `${equiposOrdenados[1]} vs ${equiposOrdenados[2]}`;
        
            liguillaDiv.appendChild(tablaSemifinal);
        } else {
            // Crear tabla para las semifinales
            const tablaSemifinales = document.createElement("table");
            const encabezadoSemifinales = tablaSemifinales.insertRow();
            encabezadoSemifinales.insertCell().textContent = "Ronda";
            encabezadoSemifinales.insertCell().textContent = "Partido";
            encabezadoSemifinales.style.backgroundColor = "#343a40";
            encabezadoSemifinales.style.color = "white";
        
            let filaSemifinal1 = tablaSemifinales.insertRow();
            filaSemifinal1.insertCell().textContent = "Semifinal";
            filaSemifinal1.insertCell().textContent = `${equiposOrdenados[0]} vs ${equiposOrdenados[3]}`;
        
            let filaSemifinal2 = tablaSemifinales.insertRow();
            filaSemifinal2.insertCell().textContent = "Semifinal";
            filaSemifinal2.insertCell().textContent = `${equiposOrdenados[1]} vs ${equiposOrdenados[2]}`;
        
            liguillaDiv.innerHTML = ""; // Limpiar contenido previo
            liguillaDiv.appendChild(tablaSemifinales);
        }
    });

    document.getElementById("torneosContainer").appendChild(torneoDiv);
});
