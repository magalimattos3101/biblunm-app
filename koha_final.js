const PROXY_KOHA_URL = "api.php";
/**
 * koha_final.js
 * módulo de integración que consulta el catálogo de koha unm
 */
(() => {
  "use strict";

  const elementos = {
    btnBuscar: document.getElementById("btn-buscar"),
    inputBusqueda: document.getElementById("input-busqueda"),
    seccionesInicio: document.getElementById("secciones-inicio"),
    loading: document.getElementById("loading"),
    listaLibros: document.getElementById("lista-libros"),
    secCatalogo: document.getElementById("sec-catalogo"),
    secDetalle: document.getElementById("sec-detalle"),

    detalleTitulo: document.getElementById("detalle-titulo"),
    detalleAutor: document.getElementById("detalle-autor"),
    detalleDescripcion: document.getElementById("detalle-descripcion"),
    detallePortada: document.getElementById("detalle-portada"),
    detalleBtnReservar: document.getElementById("btn-detalle-reservar"),
    detalleTablaBody: document.getElementById("detalle-tabla-body"),

    listaHistorial: document.getElementById("lista-historial")
  };

  const LIBROS_RESPALDO_UNM = [
    {
      id: "10521",
      titulo: "Diseño y comunicación visual: contribución a una metodología proyectual",
      autor: "Munari, Bruno",
      descripcion: "Barcelona: Gustavo Gili, 2016 · 365 p. : il. ; 20 cm. · ISBN 9788425229048",
      reserva_url: "https://biblioteca.unm.edu.ar/cgi-bin/koha/opac-reserve.pl?biblionumber=10521"
    },
    {
      id: "11240",
      titulo: "Introducción a los sistemas interactivos y diseño multimedia",
      autor: "Lowe, David; Hall, Wendy",
      descripcion: "Buenos Aires: Alfaomega, 2019 · 280 p. : gráfs. ; 24 cm.",
      reserva_url: "https://biblioteca.unm.edu.ar/cgi-bin/koha/opac-reserve.pl?biblionumber=11240"
    },
    {
      id: "9842",
      titulo: "La sintaxis de la imagen: introducción al alfabeto visual",
      autor: "Dondis, Donis A.",
      descripcion: "Barcelona: Gustavo Gili, 2014 · 211 p. : il. ; 21 cm.",
      reserva_url: "https://biblioteca.unm.edu.ar/cgi-bin/koha/opac-reserve.pl?biblionumber=9842"
    },
    {
      id: "12310",
      titulo: "Metodología de la investigación",
      autor: "Hernández Sampieri, Roberto",
      descripcion: "México: McGraw-Hill, 2018 · 710 p. ; 27 cm. · ISBN 9781456223960",
      reserva_url: "https://biblioteca.unm.edu.ar/cgi-bin/koha/opac-reserve.pl?biblionumber=12310"
    },
    {
      id: "8750",
      titulo: "Principios del diseño en la era digital",
      autor: "Bonsiepe, Gui",
      descripcion: "Buenos Aires: Infinito, 2015 · 190 p. : il. ; 23 cm.",
      reserva_url: "https://biblioteca.unm.edu.ar/cgi-bin/koha/opac-reserve.pl?biblionumber=8750"
    },
    {
      id: "10115",
      titulo: "Pensar con tipos: una guía clave para diseñadores, editores y escritores",
      autor: "Lupton, Ellen",
      descripcion: "Barcelona: Gustavo Gili, 2015 · 184 p. : il. ; 21 cm.",
      reserva_url: "https://biblioteca.unm.edu.ar/cgi-bin/koha/opac-reserve.pl?biblionumber=10115"
    }
  ];

  function leerStorage(clave, porDefecto) {
    try {
      const valor = JSON.parse(localStorage.getItem(clave));
      return valor ?? porDefecto;
    } catch (e) {
      return porDefecto;
    }
  }

  function escaparHtml(texto) {
    return String(texto ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function mezclar(arreglo) {
    const copia = [...arreglo];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  function recortar(texto, largo) {
    return texto.length > largo ? texto.substring(0, largo) + "..." : texto;
  }

  function urlPortada(id) {
    return `https://biblioteca.unm.edu.ar/cgi-bin/koha/opac-image.pl?biblionumber=${encodeURIComponent(id)}`;
  }

  function urlFallback() {
    return "portada_no_disponible.png";
  }

  async function consultarApi(termino) {
    try {
      const respuesta = await fetch(`api.php?q=${encodeURIComponent(termino)}`);
      if (!respuesta.ok) throw new Error("HTTP Status " + respuesta.status);
      const datos = await respuesta.json();
      if (datos.status === "success" && Array.isArray(datos.libros) && datos.libros.length > 0) {
        return datos.libros;
      }
    } catch (err) {
      console.warn("Koha API en vivo no disponible. Activando catálogo local de contingencia:", err);
    }

    const busq = termino.toLowerCase();
    const filtrados = LIBROS_RESPALDO_UNM.filter(b => 
      b.titulo.toLowerCase().includes(busq) || 
      b.autor.toLowerCase().includes(busq) ||
      b.descripcion.toLowerCase().includes(busq)
    );
    return filtrados.length > 0 ? filtrados : LIBROS_RESPALDO_UNM;
  }

  let registrosObtenidos = [];

  function claveFavoritos() {
    const usuario = sessionStorage.getItem("usuarioLogueado") || "invitado";
    return `unmBibliotecaFavoritos_${usuario}`;
  }

  function cargarFavoritos() {
    return leerStorage(claveFavoritos(), []);
  }

  function guardarFavoritos(lista) {
    localStorage.setItem(claveFavoritos(), JSON.stringify(lista));
  }

  let historialVistos = leerStorage("historialVistos", []);

  async function mostrarLibroAzar() {
    const contenedor = document.getElementById("libro-azar");
    if (!contenedor) return;

    contenedor.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 180px; color: #1885AC; font-weight: 500;">
        <span style="display: inline-block; width: 18px; height: 18px; border: 3px solid #1885AC; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite"></span>
        Cargando recomendación...
      </div>
    `;

    const palabrasSeguras = ["diseño", "arte", "multimedia", "comunicacion", "historia", "teoria"];
    const palabra = palabrasSeguras[Math.floor(Math.random() * palabrasSeguras.length)];
    let librosObtenidos = await consultarApi(palabra);

    if (!librosObtenidos || librosObtenidos.length === 0) {
      librosObtenidos = LIBROS_RESPALDO_UNM;
    }

    const libro = librosObtenidos[Math.floor(Math.random() * librosObtenidos.length)];
    const titulo = escaparHtml(libro.titulo);

    contenedor.innerHTML = `
      <div style="display: flex; gap: 20px; align-items: center; text-align: left; background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <div style="flex: 0 0 100px;">
          <img
            src="${urlPortada(libro.id)}"
            onerror="this.onerror=null; this.src='${urlFallback()}';"
            alt="Portada de ${titulo}"
            style="width: 100px; height: 140px; object-fit: cover; border-radius: 6px; border: 1px solid #cbd5e0; background-color: #f1f5f9;"
          >
        </div>
        <div style="flex: 1;">
          <span style="background: #1885AC; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; display: inline-block; margin-bottom: 6px;">Recomendación del día</span>
          <h4 style="margin: 0 0 6px 0; color: #2c3e50; font-size: 1.1rem; font-weight: 700;">${titulo}</h4>
          <p style="margin: 0 0 6px 0; color: #4a5568; font-size: 0.85rem;"><strong>Autor:</strong> ${escaparHtml(libro.autor || "No especificado")}</p>
          <p style="margin: 0 0 12px 0; color: #6c757d; font-size: 0.85rem; line-height: 1.4;">${libro.descripcion ? escaparHtml(recortar(libro.descripcion, 120)) : "Sin descripción disponible."}</p>
          <button type="button" id="btn-consultar-azar" style="display: inline-block; padding: 6px 14px; background: #1885AC; color: white; border: none; text-decoration: none; border-radius: 4px; font-size: 0.85rem; font-weight: bold; cursor: pointer;">
            Consultar libro
          </button>
        </div>
      </div>
    `;

    const btnConsultar = document.getElementById("btn-consultar-azar");
    if (btnConsultar) {
      btnConsultar.addEventListener("click", () => mostrarFichaDetallada(libro));
    }
  }

  async function mostrarUltimosIngresos() {
    const contenedor = document.getElementById("carrusel-novedades");
    if (!contenedor) return;

    contenedor.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 200px; color: #ffffff; font-weight: 500; text-shadow: 1px 1px 3px rgba(0,0,0,0.5);">
        <span style="display: inline-block; width: 18px; height: 18px; border: 3px solid #ffffff; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite;"></span>
        Cargando últimos ingresos...
      </div>
    `;

    let libros = await consultarApi("diseño");

    if (libros.length <= 3) {
      libros = LIBROS_RESPALDO_UNM;
    }
    if (!libros || libros.length === 0) libros = LIBROS_RESPALDO_UNM;

    const librosCarrusel = mezclar(libros).slice(0, 8);

    let htmlCarrusel = `
      <div style="position: relative; display: flex; align-items: center; width: 100%;">
        <button type="button" id="btn-carrusel-prev" aria-label="Anterior" style="position: absolute; left: -15px; z-index: 10; background: #1885AC; color: white; border: none; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: all 0.2s;">&#10094;</button>
        <div id="track-carrusel" style="display: flex; gap: 15px; overflow: hidden; padding: 10px 0 20px 20px; scroll-behavior: smooth; width: 100%; box-sizing: border-box;">
    `;

    librosCarrusel.forEach((libro, indice) => {
      const titulo = escaparHtml(libro.titulo);
      const autor = escaparHtml(libro.autor || "No especificado");

      htmlCarrusel += `
        <div style="flex: 0 0 calc((100% - 75px) / 6); min-width: 0; background: white; border: 1px solid #e9ecef; border-radius: 8px; padding: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); text-align: center; display: flex; flex-direction: column;">
          <img src="${urlPortada(libro.id)}" onerror="this.onerror=null; this.src='${urlFallback()}';" alt="${titulo}" loading="lazy" style="width: 100px; height: 140px; object-fit: cover; border-radius: 4px; margin: 0 auto 10px auto; display: block; border: 1px solid #cbd5e0;">
          <h5 style="font-size: 0.85rem; margin: 0 0 5px 0; color: #2c3e50; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;" title="${titulo}">${titulo}</h5>
          <p style="font-size: 0.75rem; color: #6c757d; margin: 0 0 10px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${autor}">${autor}</p>
          <button type="button" class="btn-ficha-carrusel" data-idx="${indice}" style="margin-top: auto; display: block; width: 100%; padding: 6px; background: #1885AC; color: white; border: none; border-radius: 4px; font-size: 0.75rem; font-weight: bold; cursor: pointer;">
            Ver ficha
          </button>
        </div>
      `;
    });

    htmlCarrusel += `
        </div>
        <button type="button" id="btn-carrusel-next" aria-label="Siguiente" style="position: absolute; right: -15px; z-index: 10; background: #1885AC; color: white; border: none; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: all 0.2s;">&#10095;</button>
      </div>
    `;

    contenedor.innerHTML = htmlCarrusel;

    contenedor.querySelectorAll(".btn-ficha-carrusel").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-idx"), 10);
        mostrarFichaDetallada(librosCarrusel[idx]);
      });
    });

    const track = document.getElementById("track-carrusel");
    const btnPrev = document.getElementById("btn-carrusel-prev");
    const btnNext = document.getElementById("btn-carrusel-next");

    if (track && btnPrev && btnNext) {
      const scrollAmount = 165;
      let isMoving = false;

      btnNext.addEventListener("click", () => {
        if (isMoving) return;
        isMoving = true;
        track.scrollBy({ left: scrollAmount, behavior: "smooth" });
        setTimeout(() => {
          track.style.scrollBehavior = "auto";
          track.appendChild(track.firstElementChild);
          track.scrollLeft -= scrollAmount;
          track.style.scrollBehavior = "smooth";
          isMoving = false;
        }, 350);
      });

      btnPrev.addEventListener("click", () => {
        if (isMoving) return;
        isMoving = true;
        track.style.scrollBehavior = "auto";
        track.prepend(track.lastElementChild);
        track.scrollLeft += scrollAmount;
        void track.offsetWidth;
        track.style.scrollBehavior = "smooth";
        track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        setTimeout(() => {
          isMoving = false;
        }, 350);
      });
    }
  }

  async function buscarEnCatalogo() {
    if (!elementos.inputBusqueda) return;
    const termino = elementos.inputBusqueda.value.trim();

    if (termino.length < 2) {
      if (elementos.seccionesInicio) elementos.seccionesInicio.style.display = "none";
      if (elementos.listaLibros) {
        elementos.listaLibros.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 30px; color: #c0392b;">
            <p style="font-weight: bold; font-size: 1rem;">Ingresá al menos 2 letras para realizar la búsqueda.</p>
          </div>
        `;
      }
      return;
    }

    if (elementos.seccionesInicio) elementos.seccionesInicio.style.display = "none";
    if (elementos.loading) elementos.loading.classList.remove("hidden");
    if (elementos.listaLibros) elementos.listaLibros.innerHTML = "";

    try {
      const libros = await consultarApi(termino);
      if (elementos.loading) elementos.loading.classList.add("hidden");

      registrosObtenidos = libros;
      dibujarResultados(registrosObtenidos);
    } catch (error) {
      if (elementos.loading) elementos.loading.classList.add("hidden");
      dibujarResultados(LIBROS_RESPALDO_UNM);
    }
  }

  function dibujarResultados(libros) {
    if (!elementos.listaLibros) return;

    elementos.listaLibros.innerHTML = libros.map((libro, indice) => {
      const titulo = escaparHtml(libro.titulo);

      return `
        <article style="display: flex; gap: 20px; background: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <div style="flex: 0 0 120px;">
            <img src="${urlPortada(libro.id)}"
                 onerror="this.onerror=null; this.src='${urlFallback()}';"
                 alt="Portada de ${titulo}"
                 loading="lazy"
                 style="width: 100%; height: 160px; object-fit: cover; border-radius: 6px; border: 1px solid #cbd5e0; background-color: #f1f5f9;">
          </div>
          <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-start;">
            <h3 style="margin: 0 0 10px 0; font-size: 1.25rem; color: #2c3e50;">${titulo}</h3>
            <div style="font-size: 0.9rem; color: #4a5568; line-height: 1.6; margin-bottom: 10px;">
              <p style="margin: 0;"><strong>Autor:</strong> ${escaparHtml(libro.autor)}</p>
              <p style="margin: 0;"><strong>Descripción:</strong> ${libro.descripcion ? escaparHtml(recortar(libro.descripcion, 100)) : "Sin descripción"}</p>
              <p style="margin: 0;"><strong>Ubicación:</strong> Sede Daract I - UNM</p>
            </div>
            <div style="margin-bottom: 15px;">
              <span style="background: #d1fae5; color: #065f46; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">Disponible en Sala</span>
            </div>
            <div style="display: flex; gap: 10px; margin-top: auto;">
              <button type="button" class="btn-ver-detalle" data-idx="${indice}" style="padding: 8px 16px; background: white; border: 1px solid #cbd5e0; border-radius: 4px; cursor: pointer; font-size: 0.9rem; color: #2c3e50; font-weight: bold;">Ver ficha</button>
            </div>
          </div>
        </article>
      `;
    }).join("");

    elementos.listaLibros.querySelectorAll(".btn-ver-detalle").forEach(btn => {
      btn.addEventListener("click", () => {
        const indice = parseInt(btn.getAttribute("data-idx"), 10);
        mostrarFichaDetallada(registrosObtenidos[indice]);
      });
    });
  }

  function mostrarFichaDetallada(libro) {
    if (!libro) return;

    if (elementos.detalleTitulo) elementos.detalleTitulo.textContent = libro.titulo;
    if (elementos.detalleAutor) elementos.detalleAutor.textContent = libro.autor;
    if (elementos.detalleDescripcion) {
      elementos.detalleDescripcion.textContent = libro.descripcion || "Ejemplar catalogado en la Biblioteca UNM.";
    }

    if (elementos.detallePortada) {
      elementos.detallePortada.onerror = () => {
        elementos.detallePortada.onerror = null;
        elementos.detallePortada.src = urlFallback();
      };
      elementos.detallePortada.src = urlPortada(libro.id);
    }

    const usuarioActual = sessionStorage.getItem("usuarioLogueado");
    const reservasGlobales = leerStorage("unmBibliotecaReservas", []);
    const reservaExistente = reservasGlobales.find(res => res.libroId === libro.id);

    if (elementos.detalleTablaBody) {
      const estadoTexto = reservaExistente ? "Prestado / Reservado" : "Disponible en sala";
      const estadoColor = reservaExistente ? "#dc3545" : "#059669";

      elementos.detalleTablaBody.innerHTML = `
        <tr style="border-bottom: 1px solid #dee2e6;">
          <td style="padding: 10px;">Sede Daract I - UNM</td>
          <td style="padding: 10px;">Colección General</td>
          <td style="padding: 10px;"><span id="span-estado-libro" style="color: ${estadoColor}; font-weight: bold;">${estadoTexto}</span></td>
        </tr>
      `;
    }

    historialVistos = historialVistos.filter(item => item.libro.id !== libro.id);
    historialVistos.unshift({ libro: libro, fecha: new Date() });
    if (historialVistos.length > 20) historialVistos.pop();
    localStorage.setItem("historialVistos", JSON.stringify(historialVistos));
    renderizarHistorial();

    const solicitarLogin = () => {
  const modal = document.createElement("dialog");

  modal.style.cssText = `
    position: fixed;
    inset: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
    width: min(420px, calc(100% - 40px));
    border: none;
    border-radius: 16px;
    padding: 35px 30px;
    text-align: center;
    font-family: 'Lato', sans-serif;
    color: #2c3e50;
    box-shadow: 0 15px 50px rgba(0,0,0,0.25);
  `;

  modal.innerHTML = `
    <div style="font-size: 45px; color: #EA8824; margin-bottom: 12px;">
      !
    </div>

    <h2 style="color: #1885AC; font-size: 1.5rem; margin-bottom: 15px;">
      ¡Iniciá sesión!
    </h2>

    <p style="color: #6c757d; margin-bottom: 20px;">
      Para utilizar esta función, necesitás ingresar con tu cuenta de la biblioteca.
    </p>

    <div style="background: #eaf5f9; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
      <p style="font-size: 0.95rem; color: #126b8a;">
        Ingresá con tu usuario y contraseña institucional para acceder a todas las funcionalidades.
      </p>
    </div>

    <div style="display: flex; flex-direction: column; gap: 10px;">

  <button id="ir-a-login"
    style="background: #1885AC; color: white; border: none;
    border-radius: 8px; padding: 12px 20px; font-size: 1rem;
    font-family: 'Lato', sans-serif; font-weight: bold;
    cursor: pointer; width: 100%;">
    Iniciar sesión
  </button>

  <button id="seguir-invitado"
    style="background: white; color: #EA8824;
    border: 1.5px solid #EA8824;
    border-radius: 8px; padding: 12px 20px; font-size: 1rem;
    font-family: 'Lato', sans-serif; font-weight: bold;
    cursor: pointer; width: 100%;">
    Continuar como invitado
  </button>

</div>
  `;

  const estiloModal = document.createElement("style");
  estiloModal.textContent = `
    dialog.modal-login::backdrop {
      background: rgba(15, 35, 50, 0.65);
      backdrop-filter: blur(3px);
    }
  `;

  modal.classList.add("modal-login");
  document.head.appendChild(estiloModal);
  document.body.appendChild(modal);

  // Iniciar sesión: mostrar la portada de ingreso
modal.querySelector("#ir-a-login").onclick = () => {
  modal.close();

  const portada = document.getElementById("sec-login");

  portada.classList.remove("hidden");
  portada.style.display = "flex";

  window.scrollTo(0, 0);
};

// Continuar como invitado: regresar al mismo libro
modal.querySelector("#seguir-invitado").onclick = () => {
  modal.close();
};

  modal.addEventListener("close", () => {
    modal.remove();
    estiloModal.remove();
  });

  modal.showModal();
};
    const esUsuarioReal = () => {
      const u = sessionStorage.getItem("usuarioLogueado");
      return u && u !== "invitado";
    };

    // BOTÓN HACER RESERVA (Con imagen hacer_reserva.png)
    if (elementos.detalleBtnReservar) {
      if (reservaExistente) {
        if (reservaExistente.usuario === usuarioActual) {
          elementos.detalleBtnReservar.innerHTML = `<img src="hacer_reserva.png" class="icono-btn-accion"> <span>Lo tenés reservado</span>`;
          elementos.detalleBtnReservar.style.backgroundColor = "#28a745";
          elementos.detalleBtnReservar.style.borderColor = "#28a745";
        } else {
          elementos.detalleBtnReservar.innerHTML = `<img src="hacer_reserva.png" class="icono-btn-accion"> <span>No disponible (Reservado)</span>`;
          elementos.detalleBtnReservar.style.backgroundColor = "#6c757d";
          elementos.detalleBtnReservar.style.borderColor = "#6c757d";
        }
        elementos.detalleBtnReservar.style.color = "white";
        elementos.detalleBtnReservar.style.pointerEvents = "none";
        elementos.detalleBtnReservar.onclick = null;
      } else {
        elementos.detalleBtnReservar.innerHTML = `<img src="hacer_reserva.png" class="icono-btn-accion"> <span>Hacer reserva</span>`;
        elementos.detalleBtnReservar.style.backgroundColor = "#1885AC";
        elementos.detalleBtnReservar.style.borderColor = "#1885AC";
        elementos.detalleBtnReservar.style.color = "white";
        elementos.detalleBtnReservar.style.pointerEvents = "auto";

        elementos.detalleBtnReservar.onclick = () => {
          if (!esUsuarioReal()) return solicitarLogin();

          reservasGlobales.push({
            libroId: libro.id,
            id: libro.id,
            titulo: libro.titulo,
            autor: libro.autor,
            libroCompleto: libro,
            usuario: usuarioActual,
            fecha: new Date().toLocaleDateString("es-AR")
          });
          localStorage.setItem("unmBibliotecaReservas", JSON.stringify(reservasGlobales));

          const modal = document.createElement("dialog");

              modal.style.cssText = `
                width: min(420px, calc(100% - 40px));
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                inset: auto;
                top: 50%;
                left: 50%;
                margin: 0;
                border: none;
                border-radius: 16px;
                padding: 35px 30px;
                text-align: center;
                font-family: 'Lato', sans-serif;
                color: #2c3e50;
                box-shadow: 0 15px 50px rgba(0,0,0,0.25);
              `;

              modal.innerHTML = `
                <div style="font-size: 45px; color: #EA8824; margin-bottom: 12px;">
                  ✓
                </div>

                <h2 style="color: #1885AC; font-size: 1.5rem; margin-bottom: 15px;">
                  ¡Reserva confirmada!
                </h2>

                <p style="color: #6c757d; margin-bottom: 8px;">
                  Reservaste el siguiente libro:
                </p>

                <p id="titulo-libro-reservado"
                  style="font-size: 1.1rem; font-weight: bold; margin-bottom: 20px;">
                </p>

                <div style="background: #eaf5f9; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
                  <p style="font-size: 0.95rem; color: #126b8a;">
                    Tenés 14 días para retirarlo por la biblioteca.
                  </p>
                </div>

                <button id="cerrar-modal-reserva"
                  style="background: #1885AC; color: white; border: none;
                  border-radius: 8px; padding: 12px 35px; font-size: 1rem;
                  font-family: 'Lato', sans-serif; font-weight: bold;
                  cursor: pointer; width: 100%;">
                  Entendido
                </button>
              `;

              modal.querySelector("#titulo-libro-reservado").textContent = libro.titulo;

              const estiloModal = document.createElement("style");
              estiloModal.textContent = `
                dialog.modal-reserva::backdrop {
                  background: rgba(15, 35, 50, 0.65);
                  backdrop-filter: blur(3px);
                }
              `;

              modal.classList.add("modal-reserva");
              document.head.appendChild(estiloModal);
              document.body.appendChild(modal);

              modal.querySelector("#cerrar-modal-reserva").onclick = () => modal.close();

              modal.addEventListener("close", () => {
                modal.remove();
                estiloModal.remove();
              });

              modal.showModal();

            elementos.detalleBtnReservar.innerHTML = `<img src="hacer_reserva.png" class="icono-btn-accion"> <span>Lo tenés reservado</span>`;
            elementos.detalleBtnReservar.style.backgroundColor = "#28a745";
            elementos.detalleBtnReservar.style.borderColor = "#28a745";
            elementos.detalleBtnReservar.style.pointerEvents = "none";

            const spanEstado = document.getElementById("span-estado-libro");
            if (spanEstado) {
              spanEstado.textContent = "Prestado / Reservado";
              spanEstado.style.color = "#dc3545";
            }
        };
      }
    }

    // BOTÓN GUARDAR EN LISTA (Con imagen guardarenlista.png)
    const btnGuardar = document.getElementById("btn-detalle-guardar");
    if (btnGuardar) {
      const marcarGuardado = () => {
        btnGuardar.innerHTML = `<img src="guardarenlista.png" class="icono-btn-accion"> <span>Guardado en lista</span>`;
        btnGuardar.style.backgroundColor = "#e6f4ea";
        btnGuardar.style.color = "#1e8e3e";
        btnGuardar.style.borderColor = "#1e8e3e";
      };
      const marcarNoGuardado = () => {
        btnGuardar.innerHTML = `<img src="guardarenlista.png" class="icono-btn-accion"> <span>Guardar en lista</span>`;
        btnGuardar.style.backgroundColor = "white";
        btnGuardar.style.color = "#2c3e50";
        btnGuardar.style.borderColor = "#cbd5e0";
      };

      if (cargarFavoritos().some(fav => fav.id === libro.id)) {
        marcarGuardado();
      } else {
        marcarNoGuardado();
      }

      btnGuardar.onclick = () => {
        if (!esUsuarioReal()) return solicitarLogin();
        const favoritos = cargarFavoritos();
        const index = favoritos.findIndex(fav => fav.id === libro.id);
        if (index === -1) {
          favoritos.push(libro);
          marcarGuardado();
          
          const modal = document.createElement("dialog");

modal.style.cssText = `
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  inset: auto;
  top: 50%;
  left: 50%;
  margin: 0;
  width: min(420px, calc(100% - 40px));
  border: none;
  border-radius: 16px;
  padding: 35px 30px;
  text-align: center;
  font-family: 'Lato', sans-serif;
  color: #2c3e50;
  box-shadow: 0 15px 50px rgba(0,0,0,0.25);
`;

modal.innerHTML = `
  <div style="font-size: 45px; color: #EA8824; margin-bottom: 12px;">
    ♥
  </div>

  <h2 style="color: #1885AC; font-size: 1.5rem; margin-bottom: 15px;">
    ¡Agregado a favoritos!
  </h2>

  <p style="color: #6c757d; margin-bottom: 8px;">
    Guardaste el siguiente libro:
  </p>

  <p id="titulo-favorito-modal"
     style="font-size: 1.1rem; font-weight: bold; margin-bottom: 20px;">
  </p>

  <div style="background: #eaf5f9; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
    <p style="font-size: 0.95rem; color: #126b8a;">
      Podés encontrarlo cuando quieras en la sección Mis Favoritos.
    </p>
  </div>

  <button id="cerrar-modal-favorito"
    style="background: #1885AC; color: white; border: none;
    border-radius: 8px; padding: 12px 35px; font-size: 1rem;
    font-family: 'Lato', sans-serif; font-weight: bold;
    cursor: pointer; width: 100%;">
    Entendido
  </button>
`;

modal.querySelector("#titulo-favorito-modal").textContent = libro.titulo;

const estiloModal = document.createElement("style");
estiloModal.textContent = `
  dialog.modal-favorito::backdrop {
    background: rgba(15, 35, 50, 0.65);
    backdrop-filter: blur(3px);
  }
`;

modal.classList.add("modal-favorito");
document.head.appendChild(estiloModal);
document.body.appendChild(modal);

modal.querySelector("#cerrar-modal-favorito").onclick = () => modal.close();

modal.addEventListener("close", () => {
  modal.remove();
  estiloModal.remove();
});

modal.showModal();
          
        } else {
          favoritos.splice(index, 1);
          marcarNoGuardado();
        }
        guardarFavoritos(favoritos);
        renderizarFavoritos();
      };
    }

    // Compartir e imprimir
    const btnCompartir = document.getElementById("btn-detalle-compartir");
    if (btnCompartir) {
      btnCompartir.onclick = () => {
        const mensaje = `¡Mirá este material en la biblioteca de la UNM!\n\n📚 *Título:* ${libro.titulo}\n✍️ *Autor:* ${libro.autor}`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(mensaje)}`, "_blank");
      };
    }
    const btnImprimir = document.getElementById("btn-detalle-imprimir");
    if (btnImprimir) btnImprimir.onclick = () => window.print();

    if (elementos.secCatalogo) {
      elementos.secCatalogo.classList.add("hidden");
      elementos.secCatalogo.classList.remove("active");
    }
    if (elementos.secDetalle) {
      elementos.secDetalle.classList.remove("hidden");
      elementos.secDetalle.classList.add("active");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderizarHistorial() {
    const lista = document.getElementById("lista-historial");
    if (!lista) return;
    lista.innerHTML = "";

    if (historialVistos.length === 0) {
      lista.innerHTML = `<li style="padding: 20px; text-align: center; color: #6c757d;">Tu historial está vacío. Los libros que abras aparecerán acá.</li>`;
      return;
    }

    historialVistos.forEach(item => {
      const li = document.createElement("li");
      li.style.cssText = "padding: 15px 20px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; cursor: pointer;";
      li.onclick = () => mostrarFichaDetallada(item.libro);
      li.innerHTML = `
        <span style="color: #2c3e50;">Visto: <em>${escaparHtml(item.libro.titulo)}</em></span>
        <span style="color: #adb5bd; font-size: 0.85rem;">${new Date(item.fecha).toLocaleDateString()}</span>
      `;
      lista.appendChild(li);
    });
  }

  function renderizarFavoritos() {
    const contenedor = document.getElementById("contenedor-favoritos");
    const misFavoritos = cargarFavoritos();
    if (!contenedor) return;
    contenedor.innerHTML = "";

    if (misFavoritos.length === 0) {
      contenedor.innerHTML = `<p style="text-align: center; color: #6c757d; width: 100%; padding: 20px;">No tenés libros guardados en tu lista.</p>`;
      return;
    }

    misFavoritos.forEach(libro => {
      const card = document.createElement("div");
      card.style.cssText = "border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; text-align: center; background: #fff;";
      card.innerHTML = `
        <img src="${urlPortada(libro.id)}" onerror="this.onerror=null; this.src='${urlFallback()}'" alt="${escaparHtml(libro.titulo)}" style="width:100%; height:200px; object-fit:cover; border-radius:4px; margin-bottom:12px;">
        <h4 style="margin:0 0 8px 0; font-size:0.95rem; color:#2c3e50; white-space: nowrap; overflow:hidden; text-overflow: ellipsis;">${escaparHtml(libro.titulo)}</h4>
        <button type="button" class="btn-ver-fav" style="width:100%; padding:8px; background:#1885AC; color:white; border:none; border-radius:4px; font-weight:bold; cursor:pointer; margin-bottom:6px;">Ver detalle</button>
        <button type="button" class="btn-quitar-fav" style="width:100%; padding:6px; background:white; color:#dc3545; border:1px solid #dc3545; border-radius:4px; cursor:pointer;">Quitar</button>
      `;
      card.querySelector(".btn-ver-fav").onclick = () => mostrarFichaDetallada(libro);
      card.querySelector(".btn-quitar-fav").onclick = () => {
        guardarFavoritos(cargarFavoritos().filter(fav => fav.id !== libro.id));
        renderizarFavoritos();
      };
      contenedor.appendChild(card);
    });
  }

  window.buscarPorTema = async function (tema) {
    const contenedorResultados = document.getElementById("resultados-tema");
    if (!contenedorResultados) return;

    contenedorResultados.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 150px; color: #1885AC; font-weight: 500;">
        <span style="display: inline-block; width: 18px; height: 18px; border: 3px solid #1885AC; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite;"></span>
        Buscando material sobre ${escaparHtml(tema)}...
      </div>
    `;

    let libros = await consultarApi(tema);
    if (!libros || libros.length === 0) libros = LIBROS_RESPALDO_UNM;

    let html = `
      <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; border: 1px solid #e9ecef;">
        <h4 style="color: #1885AC; margin-top: 0; margin-bottom: 15px; border-bottom: 2px solid #1885AC; padding-bottom: 5px; display: inline-block; text-transform: uppercase; font-size: 1rem;">Resultados para: ${escaparHtml(tema)}</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
    `;

    libros.slice(0, 6).forEach((libro, idx) => {
      html += `
        <div class="tarjeta-libro" style="background: white !important;">
          <img src="${urlPortada(libro.id)}" onerror="this.onerror=null; this.src='${urlFallback()}';" alt="${escaparHtml(libro.titulo)}" style="width: 100px; height: 140px; object-fit: cover; border-radius: 4px; margin: 0 auto 10px auto; display: block; border: 1px solid #cbd5e0;">
          <h5 style="font-size: 0.85rem; margin: 0 0 5px 0; color: #2c3e50; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${escaparHtml(libro.titulo)}</h5>
          <button type="button" class="btn-ficha-tema" data-idx="${idx}" style="margin-top: auto; display: block; width: 100%; padding: 6px; background: #1885AC; color: white; border: none; border-radius: 4px; font-size: 0.75rem; font-weight: bold; cursor: pointer;">Ver ficha</button>
        </div>
      `;
    });

    html += `</div></div>`;
    contenedorResultados.innerHTML = html;

    contenedorResultados.querySelectorAll(".btn-ficha-tema").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-idx"), 10);
        mostrarFichaDetallada(libros[idx]);
      });
    });
  };

  function inicializar() {
    if (elementos.btnBuscar) elementos.btnBuscar.addEventListener("click", buscarEnCatalogo);
    if (elementos.inputBusqueda) {
      elementos.inputBusqueda.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          buscarEnCatalogo();
        }
      });
    }

    renderizarHistorial();
    renderizarFavoritos();
    mostrarLibroAzar();
  }

  window.mostrarLibroAzar = mostrarLibroAzar;
  window.mostrarUltimosIngresos = mostrarUltimosIngresos;
  window.renderizarFavoritos = renderizarFavoritos;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializar);
  } else {
    inicializar();
  }
})();