window.addEventListener("load", iniciar);

function iniciar() {
    document.querySelector("select").addEventListener("change", obtenerCasas);
}

function obtenerCasas(event) {
    // Evita que el formulario se envíe y recargue la página
    event.preventDefault();

    // Obtenemos la region seleccionada 
    let region = document.getElementById("region").value;

    // Creamos el objeto XMLHttpRequest
    let xhr = new XMLHttpRequest();
    let url = "https://www.anapioficeandfire.com/api/houses?region=" + encodeURIComponent(region) + "&pageSize=20";

    xhr.open("GET", url, true);
    xhr.addEventListener("readystatechange", mostrarCasas);
    xhr.send();
}

function mostrarCasas() {
    if (this.readyState === 4) {
        if (this.status === 200) {
            let respuesta = this.responseText; // Guardamos la respuesta en formato texto
            
            let datos = JSON.parse(respuesta);
            //console.log(datos)

            // Limpiamos el contenedor anterior
            document.getElementById("demo").innerHTML = "";

            // Creamos la tabla llamando a la función
            let tabla = crearTabla(datos);
        
            document.getElementById("demo").appendChild(tabla);

        } else { // Si se ha producido algún error
            document.getElementById("demo").innerHTML = "";

            let parrafoError = document.createElement("p");
            parrafoError.innerHTML = "Se ha producido un error al cargar los datos. Inténtalo más tarde.";
            parrafoError.className = "error";
            document.getElementById("demo").appendChild(parrafoError);
        }
    }
}

// Funcion para crear una tabla dinámicamente
function crearTabla(datos) {
    let tabla = document.createElement("table");

    // Encabezados de la tabla
    let encabezados = [
        "Nombre",
        "Región",
        "Escudo de armas",
        "Lemas",
        "Títulos",
        "Sedes",
    ]

    let filaEncabezado = document.createElement("tr");

    // Creamos las celdas del encabezado
    encabezados.forEach((texto) => {
        let th = document.createElement("th");
        th.textContent = texto;
        filaEncabezado.appendChild(th);
    })

    tabla.appendChild(filaEncabezado);

    // Recorremos las casas y creamos las filas
    datos.forEach((casa) => {
        crearFila(casa, tabla);
    })

    return tabla;
}

// Funcion para crear una fila y añadirla a la tabla
function crearFila(casa, tabla) {
    let fila = document.createElement("tr");

    // Datos que queremos mostrar en la tabla
    let nombre = casa["name"];
    let region = casa["region"];
    let escudo = casa["coatOfArms"] || "Sin escudo";
    let lemas = casa["words"] || "Sin lema";
    let titulos = casa["titles"].length > 0 ? casa["titles"].join(", ") : "Sin títulos";
    let sedes = casa["seats"].length > 0 ? casa["seats"].join(", ") : "Sin sede conocida";

    let camposTabla = [nombre, region, escudo, lemas, titulos, sedes];

    // Creamos las celdas de cada fila
    camposTabla.forEach((valor) => {
        crearCelda(valor, fila);
    })

    tabla.appendChild(fila);
}

// Funcion para crear una celda y añadirla a la fila
function crearCelda(value, fila) {
    let celda = document.createElement("td");
    celda.textContent = value;
    fila.appendChild(celda);
}
