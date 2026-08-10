// =====================================================
// CONFIGURACIÓN
// =====================================================

const ANIMALES_POR_PAGINA = 9;

let paginaActual = 1;

// =====================================================
// DATOS
// =====================================================

let mascotas = [
  {
    id: 1,
    nombre: "Tuty",
    tipo: "Gato",
    sexo: "Hembra",
    dueno: "Nathalia Zapata",
    barrio: "Bochalema ",
    fecha: "10/08/2026",
    telefono: "3014672421",
    foto: "./img/tuty.jpg",
    estado: "perdida",
  },

  {
    id: 2,
    nombre: "Zenu",
    tipo: "Perro",
    sexo: "Macho",
    dueno: "Juan Urrea",
    barrio: "Kachipay ",
    fecha: "10/08/2026",
    telefono: "317 3903451",
    foto: "./img/zenu.jpg",
    estado: "perdida",
  },


  {
    id: 3,
    nombre: "Lucio",
    tipo: "Gato",
    sexo: "Macho",
    dueno: "Juan David Velasquez",
    barrio: "Kachipay ",
    fecha: "10/08/2026",
    telefono: "321 7297323",
    foto: "./img/lucio.jpg",
    estado: "perdida",
  }

];

// =====================================================
// ELEMENTOS
// =====================================================

const listaMascotas = document.getElementById("listaMascotas");

const contador = document.getElementById("contador");

const paginacion = document.getElementById("paginacion");

const sinResultados = document.getElementById("sinResultados");

const buscador = document.getElementById("buscador");

const filtroTipo = document.getElementById("filtroTipo");

const filtroEstado = document.getElementById("filtroEstado");

const modalPublicar = document.getElementById("modalPublicar");

const modalDetalles = document.getElementById("modalDetalles");

const formMascota = document.getElementById("formMascota");

// =====================================================
// FILTRAR
// =====================================================

function obtenerMascotasFiltradas() {
  const texto = buscador.value.trim().toLowerCase();

  const tipo = filtroTipo.value;

  const estado = filtroEstado.value;

  return mascotas.filter((mascota) => {
    const nombre = mascota.nombre.toLowerCase();

    const barrio = mascota.barrio.toLowerCase();

    const coincideTexto = nombre.includes(texto) || barrio.includes(texto);

    const coincideTipo = tipo === "todos" || mascota.tipo === tipo;

    const coincideEstado = estado === "todos" || mascota.estado === estado;

    return coincideTexto && coincideTipo && coincideEstado;
  });
}

// =====================================================
// MOSTRAR MASCOTAS
// =====================================================

function mostrarMascotas() {
  const filtradas = obtenerMascotasFiltradas();

  contador.textContent = `${filtradas.length} ${
    filtradas.length === 1 ? "mascota" : "mascotas"
  }`;

  if (filtradas.length === 0) {
    listaMascotas.innerHTML = "";

    paginacion.innerHTML = "";

    sinResultados.style.display = "block";

    return;
  }

  sinResultados.style.display = "none";

  const totalPaginas = Math.ceil(filtradas.length / ANIMALES_POR_PAGINA);

  if (paginaActual > totalPaginas) {
    paginaActual = totalPaginas;
  }

  const inicio = (paginaActual - 1) * ANIMALES_POR_PAGINA;

  const fin = inicio + ANIMALES_POR_PAGINA;

  const mascotasPagina = filtradas.slice(inicio, fin);

  listaMascotas.innerHTML = "";

  mascotasPagina.forEach((mascota) => {
    listaMascotas.appendChild(crearTarjeta(mascota));
  });

  crearPaginacion(totalPaginas);
}

// =====================================================
// CREAR TARJETA
// =====================================================

function crearTarjeta(mascota) {
  const tarjeta = document.createElement("article");

  tarjeta.className = "card";

  const perdida = mascota.estado === "perdida";

  tarjeta.innerHTML = `





        <img
    class="card-image"
    src="${escapeHTML(mascota.foto)}"
    alt="${escapeHTML(mascota.nombre)}"
    onclick="verDetalles(${mascota.id})"
>






        <div class="card-body">

            <span class="badge ${
              perdida ? "badge-perdida" : "badge-encontrada"
            }">

                ${perdida ? "🔴 Perdida" : "🟢 Encontrada"}

            </span>


            <h3 class="card-title">

                ${escapeHTML(mascota.nombre)}

            </h3>


            <div class="card-info">

                <div>
                    🐾
                    <strong>Tipo:</strong>
                    ${escapeHTML(mascota.tipo)}
                </div>

                <div>
                    👤
                    <strong>Dueño:</strong>
                    ${escapeHTML(mascota.dueno)}
                </div>

                <div>
                    📍
                    <strong>Barrio:</strong>
                    ${escapeHTML(mascota.barrio)}
                </div>

                <div>
                    📅
                    <strong>Fecha:</strong>
                    ${formatearFecha(mascota.fecha)}
                </div>

            </div>

    

        </div>

    `;

  return tarjeta;
}

// =====================================================
// PAGINACIÓN
// =====================================================

function crearPaginacion(totalPaginas) {
  paginacion.innerHTML = "";

  if (totalPaginas <= 1) {
    return;
  }

  const anterior = document.createElement("button");

  anterior.textContent = "‹";

  anterior.disabled = paginaActual === 1;

  anterior.addEventListener("click", () => {
    paginaActual--;

    mostrarMascotas();

    desplazarseListado();
  });

  paginacion.appendChild(anterior);

  for (let i = 1; i <= totalPaginas; i++) {
    const boton = document.createElement("button");

    boton.textContent = i;

    if (i === paginaActual) {
      boton.classList.add("activa");
    }

    boton.addEventListener("click", () => {
      paginaActual = i;

      mostrarMascotas();

      desplazarseListado();
    });

    paginacion.appendChild(boton);
  }

  const siguiente = document.createElement("button");

  siguiente.textContent = "›";

  siguiente.disabled = paginaActual === totalPaginas;

  siguiente.addEventListener("click", () => {
    paginaActual++;

    mostrarMascotas();

    desplazarseListado();
  });

  paginacion.appendChild(siguiente);
}

// =====================================================
// DETALLES
// =====================================================

function verDetalles(id) {
  const mascota = mascotas.find((mascota) => mascota.id === id);

  if (!mascota) {
    return;
  }

  const perdida = mascota.estado === "perdida";

  const detalle = document.getElementById("detalleMascota");

  detalle.innerHTML = `

        <img
            class="detalle-imagen"
            src="${escapeHTML(mascota.foto)}"
            alt="${escapeHTML(mascota.nombre)}"
        >


        <span class="badge ${perdida ? "badge-perdida" : "badge-encontrada"}">

            ${perdida ? "🔴 Mascota perdida" : "🟢 Mascota encontrada"}

        </span>


        <h2 class="detalle-titulo">

            ${escapeHTML(mascota.nombre)}

        </h2>


        <div class="detalle-info">

            <div>
                🐾
                <strong>Tipo:</strong>
                ${escapeHTML(mascota.tipo)}
            </div>

            <div>
                👤
                <strong>Dueño:</strong>
                ${escapeHTML(mascota.dueno)}
            </div>

            <div>
                📍
                <strong>Barrio:</strong>
                ${escapeHTML(mascota.barrio)}
            </div>

            <div>
                📅
                <strong>Fecha:</strong>
                ${formatearFecha(mascota.fecha)}
            </div>

            <div>
                📞
                <strong>Contacto:</strong>
                ${escapeHTML(mascota.telefono)}
            </div>

        </div>


        <div class="detalle-descripcion">

            <strong>
                Descripción
            </strong>

            <p>
                ${escapeHTML(mascota.descripcion || "Sin descripción.")}
            </p>

        </div>


    `;

  modalDetalles.style.display = "block";
}

// =====================================================
// MARCAR ENCONTRADA
// =====================================================

function marcarEncontrada(id) {
  const mascota = mascotas.find((mascota) => mascota.id === id);

  if (!mascota) {
    return;
  }

  if (!confirm(`¿Confirmas que ${mascota.nombre} fue encontrada?`)) {
    return;
  }

  mascota.estado = "encontrada";

  mostrarMascotas();
}

// =====================================================
// PUBLICAR MASCOTA
// =====================================================

formMascota.addEventListener("submit", function (event) {
  event.preventDefault();

  const archivo = document.getElementById("foto").files[0];

  if (!archivo) {
    alert("Selecciona una fotografía.");

    return;
  }

  const lector = new FileReader();

  lector.onload = function (evento) {
    const mascota = {
      id: Date.now(),

      nombre: document.getElementById("nombre").value.trim(),

      tipo: document.getElementById("tipo").value,

      dueno: document.getElementById("dueno").value.trim(),

      barrio: document.getElementById("barrio").value.trim(),

      fecha: document.getElementById("fecha").value,

      telefono: document.getElementById("telefono").value.trim(),

      descripcion: document.getElementById("descripcion").value.trim(),

      foto: evento.target.result,

      estado: "perdida",
    };

    mascotas.unshift(mascota);

    formMascota.reset();

    document.getElementById("previewContainer").style.display = "none";

    modalPublicar.style.display = "none";

    paginaActual = 1;

    mostrarMascotas();

    alert("La mascota fue publicada correctamente.");
  };

  lector.readAsDataURL(archivo);
});

// =====================================================
// PREVISUALIZACIÓN
// =====================================================

document.getElementById("foto").addEventListener("change", function (event) {
  const archivo = event.target.files[0];

  if (!archivo) {
    return;
  }

  const lector = new FileReader();

  lector.onload = function (evento) {
    document.getElementById("preview").src = evento.target.result;

    document.getElementById("previewContainer").style.display = "block";
  };

  lector.readAsDataURL(archivo);
});

// =====================================================
// MODAL PUBLICAR
// =====================================================

document.getElementById("btnPublicar").addEventListener("click", () => {
  modalPublicar.style.display = "block";
});

// =====================================================
// CERRAR MODAL PUBLICAR
// =====================================================

document.getElementById("cerrarModal").addEventListener("click", () => {
  modalPublicar.style.display = "none";
});

// =====================================================
// CERRAR MODAL DETALLES
// =====================================================

document.getElementById("cerrarDetalles").addEventListener("click", () => {
  modalDetalles.style.display = "none";
});

// =====================================================
// CERRAR AL HACER CLICK AFUERA
// =====================================================

window.addEventListener("click", function (event) {
  if (event.target === modalPublicar) {
    modalPublicar.style.display = "none";
  }

  if (event.target === modalDetalles) {
    modalDetalles.style.display = "none";
  }
});

// =====================================================
// BUSCADOR
// =====================================================

buscador.addEventListener("input", () => {
  paginaActual = 1;

  mostrarMascotas();
});

// =====================================================
// FILTROS
// =====================================================

filtroTipo.addEventListener("change", () => {
  paginaActual = 1;

  mostrarMascotas();
});

filtroEstado.addEventListener("change", () => {
  paginaActual = 1;

  mostrarMascotas();
});

// =====================================================
// FECHA
// =====================================================

function formatearFecha(fecha) {
  if (!fecha) {
    return "No especificada";
  }

  const partes = fecha.split("-");

  if (partes.length !== 3) {
    return fecha;
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// =====================================================
// SEGURIDAD HTML
// =====================================================

function escapeHTML(texto) {
  const elemento = document.createElement("div");

  elemento.textContent = texto ?? "";

  return elemento.innerHTML;
}

// =====================================================
// SCROLL
// =====================================================

function desplazarseListado() {
  const seccion = document.querySelector(".mascotas-section");

  if (!seccion) {
    return;
  }

  seccion.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

// =====================================================
// INICIAR
// =====================================================

mostrarMascotas();
