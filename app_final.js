document.addEventListener("DOMContentLoaded", () => {

  // Cargar proyectos compartidos desde XAMPP
fetch("trabajos.php", { cache: "no-store" })
  .then(respuesta => {
    if (!respuesta.ok) {
      throw new Error("No se pudo consultar el servidor");
    }
    return respuesta.json();
  })
  .then(datos => {
    Object.entries(datos).forEach(([carrera, trabajos]) => {
      if (Array.isArray(trabajos)) {
        localStorage.setItem(
          `unmTrabajos_${carrera}`,
          JSON.stringify(trabajos)
        );
      }
    });

    if (typeof window.renderizarMiniCarruselTrabajos === "function") {
      window.renderizarMiniCarruselTrabajos();
    }

    const galeria = document.getElementById("sec-trabajos-carrera");

    if (galeria && !galeria.classList.contains("hidden")) {
      dibujarTrabajosCarrera(carreraActualSeleccionada);
    }
  })
  .catch(error => {
    console.error("Error al cargar proyectos compartidos:", error);
  });

  // ==========================================
  // 1. CONTROL DE LOGIN E INVITADO
  // ==========================================
  const btnSubmit = document.getElementById("btn-submit");
  const btnInvitado = document.getElementById("btn-invitado");
  const secLogin = document.getElementById("sec-login");
  const appContent = document.getElementById("app-content");
  const msgError = document.getElementById("msg-error");

  const baseUsuarios = [
    { usuario: "nahuelsebastianabate@gmail.com", password: "nahuel", nombre: "Nahuel Sebastian", apellido: "Abate" },
    { usuario: "rayoluzero726@gmail.com", password: "micaela", nombre: "Micaela Raquel", apellido: "Acuña" },
    { usuario: "alonsomatias882@gmail.com", password: "german", nombre: "Germán Matías", apellido: "Alonso" },
    { usuario: "mari.charito20@gmail.com", password: "maria", nombre: "María del Rosario", apellido: "Álvarez Aliaga" },
    { usuario: "juliaalvezz2019@gmail.com", password: "julieta", nombre: "Julieta Abigail", apellido: "Alvez" },
    { usuario: "denisecalancha@hotmail.com", password: "denise", nombre: "Denise Yazmin", apellido: "Calancha" },
    { usuario: "anchabaagustin@gmail.com", password: "isaias", nombre: "Isaías Agustín", apellido: "Anchaba" },
    { usuario: "matiasarguello1996@gmail.com", password: "matias", nombre: "Matias Gabriel", apellido: "Argüello" },
    { usuario: "shirlibannon20@gmail.com", password: "shirley", nombre: "Shirley Agustina", apellido: "Bannon" },
    { usuario: "barabinofederico@gmail.com", password: "federico", nombre: "Federico Hernán", apellido: "Barabino" },
    { usuario: "betlejem96@gmail.com", password: "camila", nombre: "Camila Belén", apellido: "Barrios" },
    { usuario: "bustamantedaniela990@gmail.com", password: "tamara", nombre: "Tamara Daniela", apellido: "Bustamante" },
    { usuario: "brendacarrazana0306@gmail.com", password: "brenda", nombre: "Brenda Ayelen", apellido: "Carrazana" },
    { usuario: "soyramirocastillo@gmail.com", password: "ramiro", nombre: "Ramiro Agustín", apellido: "Castillo" },
    { usuario: "aguscastillo3011@gmail.com", password: "agustina", nombre: "Agustina Belen", apellido: "Castillo" },
    { usuario: "martinaceballos68@gmail.com", password: "martina", nombre: "Martina", apellido: "Ceballos" },
    { usuario: "centenolucianoagustin@gmail.com", password: "luciano", nombre: "Luciano Agustin", apellido: "Centeno Bruno" },
    { usuario: "contardijuan1@gmail.com", password: "juan", nombre: "Juan Pablo", apellido: "Contardi" },
    { usuario: "azul.cordoba.08.10.02@gmail.com", password: "azul", nombre: "Azul Camila", apellido: "Córdoba" },
    { usuario: "camiiyulii66@gmail.com", password: "camila", nombre: "Camila Yuliana", apellido: "Correa" },
    { usuario: "santicortes23@gmail.com", password: "santiago", nombre: "Santiago Benjamin", apellido: "Cortés" },
    { usuario: "evelyn.cremonese@hotmail.com", password: "evelyn", nombre: "Evelyn Micaela", apellido: "Cremonese" },
    { usuario: "candelacuesta13@gmail.com", password: "iara", nombre: "Iara Candela", apellido: "Cuesta" },
    { usuario: "kevanel2001@gmail.com", password: "kevin", nombre: "Kevin Ivan", apellido: "Dall'Anese Dominguez" },
    { usuario: "matias120082@gmail.com", password: "matias", nombre: "Matías Daniel", apellido: "Diaz Salinas" },
    { usuario: "marcosjavierduarte@gmail.com", password: "marcos", nombre: "Marcos Javier", apellido: "Duarte" },
    { usuario: "lisduette2012@gmail.com", password: "lis", nombre: "Lis Maria", apellido: "Duette" },
    { usuario: "esp.estefaniaperez@gmail.com", password: "estefania", nombre: "Estefania Mariel", apellido: "España" },
    { usuario: "fernandezmaite161@gmail.com", password: "maite", nombre: "Maité Lujan", apellido: "Fernandez" },
    { usuario: "fernandezmartina28@gmail.com", password: "martina", nombre: "Martina Beatriz", apellido: "Fernandez" },
    { usuario: "brumasterok@gmail.com", password: "bruno", nombre: "Bruno", apellido: "Fontana" },
    { usuario: "vifontana07@gmail.com", password: "victoria", nombre: "Victoria Micaela", apellido: "Fontana" },
    { usuario: "vbenites423@gmail.com", password: "victoria", nombre: "Victoria Elizabeth", apellido: "García" },
    { usuario: "mg6126496@gmail.com", password: "nadia", nombre: "Nadia Milagro", apellido: "García" },
    { usuario: "agusarena8@gmail.com", password: "enzo", nombre: "Enzo Valentin", apellido: "Gimenez" },
    { usuario: "nachogiorno@gmail.com", password: "ignacio", nombre: "Ignacio", apellido: "Giorno" },
    { usuario: "rodryezegomez360@gmail.com", password: "rodrigo", nombre: "Rodrigo Ezequiel", apellido: "Gomez" },
    { usuario: "aimeeluciana@hotmail.com", password: "aimee", nombre: "Aimee Luciana", apellido: "Gonzalez" },
    { usuario: "rociogonzalez3004@gmail.com", password: "rocio", nombre: "Rocio Annabella", apellido: "González" },
    { usuario: "gonzalezbrian4592@gmail.com", password: "brian", nombre: "Brian Hector", apellido: "Gonzalez Miranda" },
    { usuario: "rociogritti3@gmail.com", password: "rocio", nombre: "Rocio Julieta", apellido: "Gritti Garay" },
    { usuario: "franciscoibarra.b@hotmail.com", password: "francisco", nombre: "Jorge Carlos Francisco", apellido: "Ibarra Betancor" },
    { usuario: "magalijerez45@gmail.com", password: "magali", nombre: "Estefania Magalí", apellido: "Jerez" },
    { usuario: "juncoenzo838@gmail.com", password: "enzo", nombre: "Enzo Agustín", apellido: "Junco" },
    { usuario: "camilamjunco@gmail.com", password: "camila", nombre: "Camila Magali", apellido: "Junco" },
    { usuario: "francoo01@hotmail.com", password: "franco", nombre: "Franco Oscar", apellido: "Marquez" },
    { usuario: "redcuddarks@gmail.com", password: "ian", nombre: "Ian Estaban", apellido: "Martinez" },
    { usuario: "martinezmaxi19h@gmail.com", password: "maximiliano", nombre: "Maximiliano Ariel", apellido: "Martinez" },
    { usuario: "micaelaamartinezz04@gmail.com", password: "micaela", nombre: "Micaela Brisa", apellido: "Martinez" },
    { usuario: "magalimattos3101@gmail.com", password: "magali", nombre: "Magalí Yazmín", apellido: "Mattos" },
    { usuario: "12n.mendoza@gmail.com", password: "noelia", nombre: "Noelia Ayelen", apellido: "Mendoza Lauman" },
    { usuario: "aimeejazmeza@gmail.com", password: "aimee", nombre: "Aimeé Jazmín", apellido: "Meza" },
    { usuario: "jowelwalter@gmail.com", password: "walter", nombre: "Walter Joel", apellido: "Miño" },
    { usuario: "maguiimonzon2.7@gmail.com", password: "magali", nombre: "Magali", apellido: "Monzon" },
    { usuario: "angimoreno6@gmail.com", password: "angeles", nombre: "Angeles Lucia", apellido: "Moreno" },
    { usuario: "mazzurco2015@gmail.com", password: "tobias", nombre: "Tobias Agustín", apellido: "Murphy" },
    { usuario: "camiinari@gmail.com", password: "camila", nombre: "Camila", apellido: "Ñari" },
    { usuario: "navallasagustina@gmail.com", password: "agustina", nombre: "Agustina", apellido: "Navallas" },
    { usuario: "orne285@gmail.com", password: "ornella", nombre: "Ornella Magali", apellido: "Navarrete" },
    { usuario: "deniseojeda2407@gmail.com", password: "evelyn", nombre: "Evelyn Denise", apellido: "Ojeda Rodriguez" },
    { usuario: "vvelstat@gmail.com", password: "facundo", nombre: "Facundo Lihuel", apellido: "Olivera" },
    { usuario: "agustinortiz1881@gmail.com", password: "agustin", nombre: "Agustín Elian", apellido: "Ortiz" },
    { usuario: "misuackermanarts@gmail.com", password: "morena", nombre: "Morena Ayelen", apellido: "Ortiz" },
    { usuario: "osunaluz_12@outlook.com", password: "luz", nombre: "Luz Milena", apellido: "Osuna" },
    { usuario: "guadalupe.paismoreno@gmail.com", password: "guadalupe", nombre: "Guadalupe", apellido: "Pais Moreno" },
    { usuario: "pyngwie@gmail.com", password: "yngwie", nombre: "Yngwie Johann", apellido: "Poirier" },
    { usuario: "pilmayquen.poullion@gmail.com", password: "carla", nombre: "Carla Pilmayquén", apellido: "Poullión" },
    { usuario: "elquirogita99@gmail.com", password: "lucas", nombre: "Lucas", apellido: "Quiroga" },
    { usuario: "paula_abiagail@hotmail.com", password: "paula", nombre: "Paula Abigail", apellido: "Ramirez" },
    { usuario: "mlgbearbon@gmail.com", password: "jonathan", nombre: "Jonathan Javier", apellido: "Ramos Arze" },
    { usuario: "jussonic1991@gmail.com", password: "justine", nombre: "Justine De Los Milagros", apellido: "Roche" },
    { usuario: "namonserrat@gmail.com", password: "natalia", nombre: "Natalia", apellido: "Monserrat Rodriguez" },
    { usuario: "aaye17285@gmail.com", password: "milagros", nombre: "Milagros Ayelen", apellido: "Roen" },
    { usuario: "abiaamaavilu@hotmail.com", password: "abigail", nombre: "Abigail Emilce", apellido: "Rolón" },
    { usuario: "mimu2016vancho11@gmail.com", password: "ivan", nombre: "Ivan Lautaro", apellido: "Ruiz Diaz" },
    { usuario: "saracho.damian@live.com.ar", password: "damian", nombre: "Damián José", apellido: "Saracho" },
    { usuario: "isabellasignorelli2004@gmail.com", password: "isabella", nombre: "Isabella Victoria", apellido: "Signorelli" },
    { usuario: "sabrinarociosilva@hotmail.com", password: "sabrina", nombre: "Sabrina Rocio", apellido: "Silva" },
    { usuario: "aylensosa975@gmail.com", password: "brisa", nombre: "Brisa Aylen", apellido: "Sosa" },
    { usuario: "serennasuarez@gmail.com", password: "serena", nombre: "Serena Agustina", apellido: "Suarez" },
    { usuario: "iriis.anime@hotmail.com", password: "iris", nombre: "Iris Aldana", apellido: "Suarez Pereda" },
    { usuario: "ntanasichuk@outlook.com", password: "nicole", nombre: "Nicole Belen", apellido: "Tanasichuk" },
    { usuario: "eze.tolaba@hotmail.com", password: "alexander", nombre: "Alexander Ezequiel", apellido: "Tolaba" },
    { usuario: "oromaitoo@gmail.com", password: "gonzalo", nombre: "Gonzalo Alejo", apellido: "Uthurry" },
    { usuario: "tomasvalenzuela1235@gmail.com", password: "tomas", nombre: "Tomás Lautaro", apellido: "Valenzuela" },
    { usuario: "marvalvega91@gmail.com", password: "mara", nombre: "Mara Ariadna", apellido: "Vega" },
    { usuario: "brendadaianavicentin@gmail.com", password: "brenda", nombre: "Brenda Daiana", apellido: "Vicentin" },
    { usuario: "emily", password: "emily", nombre: "Emily Gina", apellido: "Villegas Peña" },
    { usuario: "chiaraagustinavitali@gmail.com", password: "agustina", nombre: "Agustina Chiara", apellido: "Vitali" },
    { usuario: "facuzalvania@outlook.com", password: "facundo", nombre: "Facundo Alejandro", apellido: "Zalvania" }
  ];

  function obtenerIniciales(nombre, apellido) {
    if (!nombre || nombre === "Invitado") return "IN";
    let iniciales = nombre.charAt(0).toUpperCase();
    if (apellido && apellido !== "") iniciales += apellido.charAt(0).toUpperCase();
    return iniciales;
  }

  function ingresarAlSistema() {
    if (!secLogin || !appContent) return;

    secLogin.classList.add("hidden");
    appContent.classList.remove("hidden");

    const nombre = sessionStorage.getItem("nombreUser");
    const apellido = sessionStorage.getItem("apellidoUser") || "";

    if (nombre) {
      const textoPerfil = document.getElementById("perfil-nombre") || document.getElementById("nombre-perfil");
      if (textoPerfil) {
        textoPerfil.textContent = nombre + (apellido ? " " + apellido : "");
      }

      const iniciales = obtenerIniciales(nombre, apellido);
      const avatarCirculo = document.querySelector(".avatar-circle");
      if (avatarCirculo) avatarCirculo.textContent = iniciales;

      const avatarGrande = document.querySelector(".avatar-perfil-grande");
      if (avatarGrande) avatarGrande.textContent = iniciales;
    }

    setTimeout(() => {
      try {
        if (typeof window.mostrarLibroAzar === "function") window.mostrarLibroAzar();
        if (typeof window.mostrarUltimosIngresos === "function") window.mostrarUltimosIngresos();
        if (typeof window.renderizarMiniCarruselTrabajos === "function") window.renderizarMiniCarruselTrabajos();
      } catch (err) {
        console.warn("Carga dinámica en progreso...", err);
      }
    }, 200);
  }

  if (sessionStorage.getItem("usuarioLogueado")) {
    ingresarAlSistema();
  }

  if (btnInvitado) {
    btnInvitado.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.setItem("usuarioLogueado", "invitado");
      sessionStorage.setItem("nombreUser", "Invitado");
      sessionStorage.setItem("apellidoUser", "");
      ingresarAlSistema();
    });
  }

  if (btnSubmit) {
    btnSubmit.addEventListener("click", (e) => {
      e.preventDefault();
      const campoUsuario = document.getElementById("input-usuario");
      const campoPassword = document.getElementById("input-password");
      if (!campoUsuario || !campoPassword) return;

      const usuarioInput = campoUsuario.value.trim().toLowerCase();
      const passwordInput = campoPassword.value.trim();

      const usuarioValido = baseUsuarios.find(
        (user) => user.usuario.toLowerCase() === usuarioInput && user.password === passwordInput
      );

      if (usuarioValido) {
        if (msgError) msgError.style.display = "none";
        sessionStorage.setItem("usuarioLogueado", usuarioValido.usuario);
        sessionStorage.setItem("nombreUser", usuarioValido.nombre);
        sessionStorage.setItem("apellidoUser", usuarioValido.apellido);
        ingresarAlSistema();
      } else if (msgError) {
        msgError.style.display = "block";
      }
    });
  }

  const inputUsuario = document.getElementById("input-usuario");
  const inputPassword = document.getElementById("input-password");

  if (inputUsuario && inputPassword && btnSubmit) {
    inputUsuario.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        inputPassword.focus();
      }
    });

    inputPassword.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        btnSubmit.click();
      }
    });
  }

  // ==========================================
  // 2. SISTEMA DE PESTAÑAS Y ANIMACIÓN
  // ==========================================
  const enlacesNavegacion = document.querySelectorAll("[data-target]");
  const secciones = document.querySelectorAll(".tab-content");
  const navMenu = document.getElementById("nav-menu");

  // Cerrar automáticamente el menú al seleccionar una opción en celular
if (navMenu) {
  navMenu.addEventListener("click", (e) => {
    const enlace = e.target.closest("a[data-target]");

    if (enlace && window.innerWidth <= 768) {
      navMenu.style.display = "none";
      navMenu.classList.remove("menu-abierto", "activo");
    }
  });
}

  const seccionesPrivadas = ["sec-perfil", "sec-favoritos", "sec-prestamos"];

  function animarBarraCarga() {
    let loader = document.getElementById("app-loader-bar");
    if (!loader) {
      loader = document.createElement("div");
      loader.id = "app-loader-bar";
      document.body.prepend(loader);
    }
    loader.style.width = "40%";
    setTimeout(() => { loader.style.width = "100%"; }, 80);
    setTimeout(() => { loader.style.width = "0%"; }, 350);
  }

  function volverAlLogin() {
    ["usuarioLogueado", "nombreUser", "apellidoUser", "sesionActiva", "sesionInvitado"]
      .forEach((clave) => sessionStorage.removeItem(clave));

    if (inputUsuario) inputUsuario.value = "";
    if (inputPassword) inputPassword.value = "";
    if (msgError) msgError.style.display = "none";

    if (appContent) appContent.classList.add("hidden");
    if (secLogin) secLogin.classList.remove("hidden");
    if (navMenu) navMenu.classList.remove("menu-abierto");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  enlacesNavegacion.forEach((enlace) => {
    enlace.addEventListener("click", (e) => {
      e.preventDefault();
      const objetivo = enlace.getAttribute("data-target");
      if (!objetivo) return;

      if (seccionesPrivadas.includes(objetivo) && sessionStorage.getItem("usuarioLogueado") === "invitado") {
        volverAlLogin();
        return;
      }

      animarBarraCarga();

      secciones.forEach((sec) => {
        sec.classList.add("hidden");
        sec.classList.remove("active");
      });

      const seccionActiva = document.getElementById(objetivo);
      if (seccionActiva) {
        seccionActiva.classList.remove("hidden");
        seccionActiva.classList.add("active");
      }

      if (objetivo === "sec-catalogo" && typeof window.renderizarMiniCarruselTrabajos === "function") {
        window.renderizarMiniCarruselTrabajos();
      }

      if (objetivo === "sec-prestamos" && typeof window.renderizarMisPrestamos === "function") {
        window.renderizarMisPrestamos();
      }

      if (objetivo === "sec-favoritos" && typeof window.renderizarFavoritos === "function") {
        window.renderizarFavoritos();
      }

      if (objetivo === "sec-perfil") {
        actualizarDashboard();
      }

      if (navMenu) {
  navMenu.classList.remove("menu-abierto", "activo");

  if (window.innerWidth <= 768) {
    navMenu.style.display = "none";
  }
}
    });
  });

  // ==========================================
  // 3. MENÚ DE USUARIO
  // ==========================================
  const userMenuBtn = document.getElementById("user-menu-btn");
  const userDropdown = document.getElementById("user-dropdown");

  if (userMenuBtn && userDropdown) {

    // Opción exclusiva para invitados
const opcionLogin = document.createElement("li");

opcionLogin.innerHTML = `
  <a href="#" class="dropdown-link">Iniciar sesión</a>
`;

userDropdown.appendChild(opcionLogin);

// Mostrar las opciones según el tipo de usuario
userMenuBtn.addEventListener("click", () => {
  const esInvitado =
    sessionStorage.getItem("usuarioLogueado") === "invitado";

  Array.from(userDropdown.children).forEach((opcion) => {
    if (opcion === opcionLogin) {
      opcion.style.display = esInvitado ? "" : "none";
    } else {
      opcion.style.display = esInvitado ? "none" : "";
    }
  });
});

// Volver a la pantalla de inicio de sesión
opcionLogin.querySelector("a").addEventListener("click", (e) => {
  e.preventDefault();
  userDropdown.style.display = "none";
  volverAlLogin();
});

    userMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const displayActual = window.getComputedStyle(userDropdown).display;
      userDropdown.style.display = (displayActual === "block") ? "none" : "block";
    });

    document.addEventListener("click", () => {
      userDropdown.style.display = "none";
    });
  }

  const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.removeItem("usuarioLogueado");
      sessionStorage.removeItem("nombreUser");
      sessionStorage.removeItem("apellidoUser");
      window.location.reload();
    });
  }

  // ==========================================
  // 4. ACTUALIZAR DASHBOARD DEL PERFIL
  // ==========================================
  function actualizarDashboard() {
    const correoPerfil = document.getElementById("perfil-correo");
    const usuarioActual = sessionStorage.getItem("usuarioLogueado");
    const nombreCompletoPerfil = document.getElementById("perfil-nombre-completo");

    if (nombreCompletoPerfil) {
      const nombre = sessionStorage.getItem("nombreUser") || "";
      const apellido = sessionStorage.getItem("apellidoUser") || "";
      const avatarCirculo = document.getElementById("perfil-avatar-circulo");
      
      if (usuarioActual && usuarioActual !== "invitado") {
        nombreCompletoPerfil.textContent = `${nombre} ${apellido}`.trim();
        if (avatarCirculo) {
          let iniciales = nombre.charAt(0).toUpperCase();
          if (apellido) iniciales += apellido.charAt(0).toUpperCase();
          avatarCirculo.textContent = iniciales;
        }
      } else {
        nombreCompletoPerfil.textContent = "Usuario Invitado";
        if (avatarCirculo) avatarCirculo.textContent = "IN";
      }
    }

    if (correoPerfil) {
      correoPerfil.textContent = (usuarioActual && usuarioActual !== "invitado") ? usuarioActual : "Cuenta de Invitado";
    }

    const spanFavoritos = document.getElementById("metrica-favoritos");
    if (spanFavoritos) {
      const misFavs = JSON.parse(localStorage.getItem(`unmBibliotecaFavoritos_${usuarioActual || "invitado"}`)) || [];
      spanFavoritos.textContent = misFavs.length;
    }

    const spanPrestamos = document.getElementById("metrica-prestamos");
    if (spanPrestamos) {
      const reservasGlobales = JSON.parse(localStorage.getItem('unmBibliotecaReservas')) || [];
      const misReservas = reservasGlobales.filter(res => res.usuario === usuarioActual);
      spanPrestamos.textContent = misReservas.length;
    }
  }

  actualizarDashboard();

  // ==========================================
  // 5. ALERTAS
  // ==========================================
  const toggleAlertas = document.getElementById("toggle-alertas");
  if (toggleAlertas) {
    const alertasActivadas = localStorage.getItem("alertasBiblioteca") !== "false"; 
    if (!alertasActivadas) toggleAlertas.classList.add("inactivo");

    toggleAlertas.addEventListener("click", () => {
      toggleAlertas.classList.toggle("inactivo");
      localStorage.setItem("alertasBiblioteca", !toggleAlertas.classList.contains("inactivo"));
    });
  }

  // ==========================================
  // 6. TRABAJOS DE ALUMNOS (CARRERAS DE DISEÑO)
  // ==========================================
  const baseTrabajosPredeterminada = {
    "Diseño Multimedial": [
      {
        id: "base_1",
        creador: "nahuelsebastianabate@gmail.com",
        anio: "2026",
        trabajo: "App Accesible Koha UNM",
        alumno: "Nahuel Sebastian Abate",
        materia: "Taller Multimedial IV",
        contacto: "nahuelsebastianabate@gmail.com",
        desc: "Rediseño enfocado en accesibilidad universal, contraste tipográfico y conexión directa con el catálogo de la biblioteca.",
        tipoMedia: "imagen",
        imagenes: ["https://placehold.co/800x500/1885AC/ffffff?text=App+Koha+Pantalla+1"]
      },
      {
        id: "base_2",
        creador: "rayoluzero726@gmail.com",
        anio: "2026",
        trabajo: "Experiencia Interactiva p5.js",
        alumno: "Micaela Raquel Acuña",
        materia: "Programación Creativa",
        contacto: "rayoluzero726@gmail.com",
        desc: "Aplicación generativa reactiva al sensor de luz y audio mediante Canvas.",
        tipoMedia: "imagen",
        imagenes: ["https://placehold.co/800x500/059669/ffffff?text=p5.js+Generativo"]
      },
      {
        id: "base_3",
        creador: "facuzalvania@outlook.com",
        anio: "2025",
        trabajo: "Videojuego 16-bit Semiótica",
        alumno: "Facundo Alejandro Zalvania",
        materia: "Semiótica Visual",
        contacto: "facuzalvania@outlook.com",
        desc: "Prototipo interactivo en 16-bit diseñado a partir del análisis de signos visuales.",
        tipoMedia: "youtube",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      }
    ],
    "Comunicación Visual": [
      {
        id: "base_4",
        creador: "juliaalvezz2019@gmail.com",
        anio: "2026",
        trabajo: "Rediseño Señalética Daract I",
        alumno: "Julieta Abigail Alvez",
        materia: "Morfología y Señalética",
        contacto: "juliaalvezz2019@gmail.com",
        desc: "Sistema integral de wayfinding y señalización para la sala de lectura y aulas.",
        tipoMedia: "imagen",
        imagenes: ["https://placehold.co/800x500/EA8824/ffffff?text=Señalética+Daract+I"]
      }
    ],
    "Diseño de Indumentaria": [
      {
        id: "base_5",
        creador: "bustamantedaniela990@gmail.com",
        anio: "2026",
        trabajo: "Colección Sustentable Cápsula",
        alumno: "Tamara Daniela Bustamante",
        materia: "Diseño Textil",
        contacto: "bustamantedaniela990@gmail.com",
        desc: "Desarrollo de prendas experimentales con moldería zero-waste.",
        tipoMedia: "imagen",
        imagenes: ["https://placehold.co/800x500/8b5cf6/ffffff?text=Colección+Textil"]
      }
    ],
    "Diseño Industrial": [
      {
        id: "base_6",
        creador: "rodryezegomez360@gmail.com",
        anio: "2026",
        trabajo: "Mobiliario Ergonómico Biblioteca",
        alumno: "Rodrigo Ezequiel Gomez",
        materia: "Taller de Ergonomía",
        contacto: "rodryezegomez360@gmail.com",
        desc: "Mesa de estudio modular fabricada con encastres simples e impresión 3D.",
        tipoMedia: "imagen",
        imagenes: ["https://placehold.co/800x500/10b981/ffffff?text=Mobiliario+3D"]
      }
    ]
  };

  let carreraActualSeleccionada = "Diseño Multimedial";
  let indiceTrabajoEnVisor = null;
  let indiceTrabajoEnEdicion = null;

  function esAutorDelTrabajo(item) {
    const usuarioActual = (sessionStorage.getItem("usuarioLogueado") || "").toLowerCase().trim();
    const nombreSesion = (sessionStorage.getItem("nombreUser") || "").toLowerCase().trim();
    const apellidoSesion = (sessionStorage.getItem("apellidoUser") || "").toLowerCase().trim();

    if (!usuarioActual || usuarioActual === "invitado") return false;

    const creadorItem = (item.creador || "").toLowerCase().trim();
    const alumnoItem = (item.alumno || "").toLowerCase().trim();

    if (creadorItem && usuarioActual === creadorItem) return true;
    if (nombreSesion && alumnoItem.includes(nombreSesion)) return true;
    if (apellidoSesion && alumnoItem.includes(apellidoSesion)) return true;
    if (!item.creador) return true;

    return false;
  }

  function comprimirImagen(archivo) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxDim = 1600;

          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL("image/jpeg", 0.92));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(archivo);
    });
  }

  function leerPdfComoBase64(archivo) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(archivo);
    });
  }

  function base64ABlobUrl(base64Data) {
    try {
      const partes = base64Data.split(";base64,");
      const contentType = partes[0].split(":")[1] || "application/pdf";
      const raw = window.atob(partes[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      const blob = new Blob([uInt8Array], { type: contentType });
      return URL.createObjectURL(blob);
    } catch (e) {
      return base64Data;
    }
  }

  function obtenerTrabajos(carrera) {
    const guardados = JSON.parse(localStorage.getItem(`unmTrabajos_${carrera}`)) || [];
    const base = baseTrabajosPredeterminada[carrera] || [];
    return [...guardados, ...base];
  }

  function eliminarTrabajoPorIndice(indiceGlobal) {
    const lista = obtenerTrabajos(carreraActualSeleccionada);
    const item = lista[indiceGlobal];
    if (!item) return;

    const confirmar = confirm(`¿Deseás eliminar el proyecto "${item.trabajo}"?`);
    if (!confirmar) return;

    const clave = `unmTrabajos_${carreraActualSeleccionada}`;
    let guardados = JSON.parse(localStorage.getItem(clave)) || [];

    if (indiceGlobal < guardados.length) {
      guardados.splice(indiceGlobal, 1);
      localStorage.setItem(clave, JSON.stringify(guardados));
    } else {
      const idxBase = indiceGlobal - guardados.length;
      if (baseTrabajosPredeterminada[carreraActualSeleccionada]) {
        baseTrabajosPredeterminada[carreraActualSeleccionada].splice(idxBase, 1);
      }
    }

    const modalVisor = document.getElementById("modal-visor-trabajo");
    if (modalVisor) modalVisor.classList.add("hidden");
    dibujarTrabajosCarrera(carreraActualSeleccionada);
    if (typeof window.renderizarMiniCarruselTrabajos === "function") {
      window.renderizarMiniCarruselTrabajos();
    }
    alert("El trabajo seleccionado fue eliminado.");
  }

  function iniciarEdicionTrabajo(item, indiceGlobal) {
    indiceTrabajoEnEdicion = indiceGlobal;

    document.getElementById("nuevo-trabajo-titulo").value = item.trabajo;
    document.getElementById("nuevo-trabajo-alumno").value = item.alumno;
    document.getElementById("nuevo-trabajo-anio").value = item.anio;
    document.getElementById("nuevo-trabajo-materia").value = item.materia || "";
    document.getElementById("nuevo-trabajo-contacto").value = item.contacto || "";
    document.getElementById("nuevo-trabajo-desc").value = item.desc || "";

    if (bloqueFoto) bloqueFoto.classList.add("hidden");
    if (bloquePdf) bloquePdf.classList.add("hidden");
    if (bloqueYoutube) bloqueYoutube.classList.add("hidden");

    if (item.tipoMedia === "youtube") {
      if (selectTipoMedia) selectTipoMedia.value = "youtube";
      if (bloqueYoutube) bloqueYoutube.classList.remove("hidden");
      document.getElementById("nuevo-trabajo-url-video").value = item.videoUrl || "";
    } else if (item.tipoMedia === "pdf") {
      if (selectTipoMedia) selectTipoMedia.value = "pdf";
      if (bloquePdf) bloquePdf.classList.remove("hidden");
    } else {
      if (selectTipoMedia) selectTipoMedia.value = "imagen";
      if (bloqueFoto) bloqueFoto.classList.remove("hidden");
    }

    const modalVisor = document.getElementById("modal-visor-trabajo");
    if (modalVisor) modalVisor.classList.add("hidden");
    if (modalTrabajo) modalTrabajo.classList.remove("hidden");
  }

  function abrirVisorDetalle(item, indiceGlobal) {
    indiceTrabajoEnVisor = indiceGlobal;
    const modalVisor = document.getElementById("modal-visor-trabajo");
    if (!modalVisor) return;

    document.getElementById("visor-anio-materia").textContent = `Año ${item.anio} · ${item.materia || "Materia no especificada"}`;
    document.getElementById("visor-titulo").textContent = item.trabajo;
    document.getElementById("visor-autor").innerHTML = `Realizado por: <strong>${item.alumno}</strong>`;
    document.getElementById("visor-descripcion").textContent = item.desc || "El alumno no incluyó una memoria descriptiva adicional.";

    const contenedorMedia = document.getElementById("visor-multimedia-contenedor");
    contenedorMedia.innerHTML = "";

    if (item.tipoMedia === "youtube" && item.videoUrl) {
      contenedorMedia.innerHTML = `<iframe class="visor-video-frame" src="${item.videoUrl}" allowfullscreen></iframe>`;
    } else if (item.tipoMedia === "pdf" && item.pdfSrc) {
      const urlBlobPdf = item.pdfSrc.startsWith("data:") ? base64ABlobUrl(item.pdfSrc) : item.pdfSrc;

      contenedorMedia.innerHTML = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.5rem;">📄</span>
            <span style="font-size: 0.9rem; font-weight: bold; color: #1e293b;">Lámina / Memoria en PDF</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <a href="${urlBlobPdf}" target="_blank" rel="noopener noreferrer" style="background: white; border: 1px solid #cbd5e0; color: #1885AC; text-decoration: none; padding: 7px 12px; border-radius: 4px; font-weight: bold; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 5px;">
              Ver pantalla completa ↗
            </a>
            <a href="${urlBlobPdf}" download="${item.trabajo}.pdf" style="background: #1885AC; color: white; text-decoration: none; padding: 7px 14px; border-radius: 4px; font-weight: bold; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 5px;">
              📥 Descargar
            </a>
          </div>
        </div>

        <object data="${urlBlobPdf}" type="application/pdf" class="visor-pdf-frame" style="width: 100%; height: 500px; border-radius: 8px; border: 1px solid #cbd5e0;">
          <iframe src="${urlBlobPdf}" style="width: 100%; height: 500px; border: none;">
            <p style="padding: 20px; text-align: center; color: #64748b;">
              Tu navegador no soporta la previsualización directa. 
              <a href="${urlBlobPdf}" target="_blank" style="color: #1885AC; font-weight: bold;">Hacé clic acá para abrir el PDF</a>.
            </p>
          </iframe>
        </object>
      `;
    } else if (item.imagenes && item.imagenes.length > 0) {
  const galeria = document.createElement("div");
  galeria.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 18px;
    width: 100%;
  `;

  item.imagenes.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = item.trabajo;
    img.style.cssText = `
      width: 100%;
      height: auto;
      object-fit: contain;
      display: block;
      border-radius: 8px;
      background: #f8fafc;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    `;
    galeria.appendChild(img);
  });

  contenedorMedia.appendChild(galeria);
} else {
      contenedorMedia.innerHTML = `<p style="color: #666; text-align: center; padding: 25px; background: #f8fafc; border-radius: 8px;">Sin archivos adjuntos.</p>`;
    }

    const textoContacto = document.getElementById("visor-contacto-texto");
    const btnContacto = document.getElementById("visor-contacto-btn");
    const contacto = item.contacto ? item.contacto.trim() : "";

    if (contacto) {
      textoContacto.textContent = contacto;
      if (contacto.includes("@") && !contacto.startsWith("@")) {
        btnContacto.href = `mailto:${contacto}?subject=Consulta sobre tu proyecto: ${encodeURIComponent(item.trabajo)}`;
        btnContacto.textContent = "Enviar Correo ✉️";
      } else {
        const usuarioLimpio = contacto.replace("@", "");
        btnContacto.href = `https://instagram.com/${usuarioLimpio}`;
        btnContacto.textContent = "Ver Perfil ↗";
      }
      btnContacto.style.display = "inline-block";
    } else {
      textoContacto.textContent = "No especificado";
      btnContacto.style.display = "none";
    }

    const barraAutor = document.getElementById("visor-acciones-autor");
    if (barraAutor) {
      if (esAutorDelTrabajo(item)) {
        barraAutor.classList.remove("hidden");
      } else {
        barraAutor.classList.add("hidden");
      }
    }

    modalVisor.classList.remove("hidden");
  }

  function dibujarTrabajosCarrera(carrera) {
    const contenedor = document.getElementById("contenedor-proyectos-alumnos");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    const lista = obtenerTrabajos(carrera);
    if (lista.length === 0) {
      contenedor.innerHTML = "<p style='color: #666; padding: 20px;'>No hay proyectos cargados para esta carrera aún.</p>";
      return;
    }

    lista.forEach((item, index) => {
      const cardTrabajo = document.createElement("div");
      cardTrabajo.className = "trabajo-card";

      let bloqueMedia = "";
      if (item.tipoMedia === "youtube" && item.videoUrl) {
        bloqueMedia = `
          <div class="trabajo-media-container" style="position: relative; width: 100%; height: 160px; border-radius: 6px; overflow: hidden; margin-bottom: 12px; background: #000;">
            <iframe src="${item.videoUrl}" title="${item.trabajo}" style="width: 100%; height: 100%; border: none; pointer-events: none;"></iframe>
          </div>`;
      } else if (item.tipoMedia === "pdf") {
        bloqueMedia = `
          <div class="tarjeta-media-pdf">
            <span style="font-size: 2.2rem;">📄</span>
            <span style="font-weight: bold; font-size: 0.85rem;">Documento PDF</span>
          </div>`;
      } else if (item.imagenes && item.imagenes.length > 0) {
        const cantFotos = item.imagenes.length;
        const indicadorFotos = cantFotos > 1 ? `<span class="badge-fotos-multiples">📷 ${cantFotos} fotos</span>` : "";
        bloqueMedia = `
          <div class="trabajo-media-container" style="position: relative; width: 100%; height: 160px; border-radius: 6px; overflow: hidden; margin-bottom: 12px;">
            <img src="${item.imagenes[0]}" alt="${item.trabajo}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.src='https://placehold.co/400x250/e9ecef/666666?text=Sin+Imagen'">
            ${indicadorFotos}
          </div>`;
      }

      const esPropio = esAutorDelTrabajo(item);
      const barraAccionesRapidas = esPropio ? `
        <div style="display: flex; gap: 8px; margin-top: 10px; border-top: 1px solid #edf2f7; padding-top: 8px;" onclick="event.stopPropagation();">
          <button type="button" class="btn-card-editar" style="flex: 1; background: #e0f2fe; color: #0284c7; border: none; padding: 5px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; cursor: pointer;">✏️ Editar</button>
          <button type="button" class="btn-card-eliminar" style="flex: 1; background: #fee2e2; color: #dc2626; border: none; padding: 5px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; cursor: pointer;">🗑️ Borrar</button>
        </div>
      ` : "";

      cardTrabajo.innerHTML = `
        ${bloqueMedia}
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="background: #e6f4ea; color: #1e8e3e; font-size: 0.75rem; font-weight: bold; padding: 3px 8px; border-radius: 4px;">Año ${item.anio}</span>
            <span style="font-size: 0.75rem; color: #6b7280; font-weight: 500;">${item.materia || "Materia no especificada"}</span>
          </div>
          <h3 style="font-size: 1.05rem; color: #1885AC; margin: 6px 0;">${item.trabajo}</h3>
        </div>
        <div style="border-top: 1px solid #eee; padding-top: 8px; margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
          <p style="font-size: 0.85rem; color: #555; margin: 0;"><strong>Alumno:</strong> ${item.alumno}</p>
          <span style="font-size: 0.8rem; color: #1885AC; font-weight: bold;">Ver más 🔍</span>
        </div>
        ${barraAccionesRapidas}
      `;

      cardTrabajo.addEventListener("click", () => abrirVisorDetalle(item, index));

      if (esPropio) {
        const btnCardEdit = cardTrabajo.querySelector(".btn-card-editar");
        const btnCardDel = cardTrabajo.querySelector(".btn-card-eliminar");
        if (btnCardEdit) btnCardEdit.addEventListener("click", () => iniciarEdicionTrabajo(item, index));
        if (btnCardDel) btnCardDel.addEventListener("click", () => eliminarTrabajoPorIndice(index));
      }

      contenedor.appendChild(cardTrabajo);
    });
  }

  const modalVisor = document.getElementById("modal-visor-trabajo");
  const btnCerrarVisor = document.getElementById("btn-cerrar-visor");
  if (btnCerrarVisor && modalVisor) {
    btnCerrarVisor.addEventListener("click", () => modalVisor.classList.add("hidden"));
    modalVisor.addEventListener("click", (e) => {
      if (e.target === modalVisor) modalVisor.classList.add("hidden");
    });
  }

  const btnEliminar = document.getElementById("btn-eliminar-trabajo");
  if (btnEliminar) {
    btnEliminar.addEventListener("click", () => {
      if (indiceTrabajoEnVisor !== null) eliminarTrabajoPorIndice(indiceTrabajoEnVisor);
    });
  }

  const modalTrabajo = document.getElementById("modal-subir-trabajo");
  const selectTipoMedia = document.getElementById("nuevo-trabajo-tipo-media");
  const bloqueFoto = document.getElementById("bloque-campo-foto");
  const bloquePdf = document.getElementById("bloque-campo-pdf");
  const bloqueYoutube = document.getElementById("bloque-campo-youtube");

  const btnEditar = document.getElementById("btn-editar-trabajo");
  if (btnEditar) {
    btnEditar.addEventListener("click", () => {
      if (indiceTrabajoEnVisor !== null) {
        const lista = obtenerTrabajos(carreraActualSeleccionada);
        iniciarEdicionTrabajo(lista[indiceTrabajoEnVisor], indiceTrabajoEnVisor);
      }
    });
  }

  const tarjetasCarrera = document.querySelectorAll("#sec-trabajos .coleccion-card");
  tarjetasCarrera.forEach(card => {
    const btn = card.querySelector("button");
    const titulo = card.querySelector("h3") ? card.querySelector("h3").textContent.trim() : "";

    if (btn) {
      btn.addEventListener("click", () => {
        animarBarraCarga();
        carreraActualSeleccionada = titulo;

        const secTrabajos = document.getElementById("sec-trabajos");
        const secGaleria = document.getElementById("sec-trabajos-carrera");
        if (secTrabajos) secTrabajos.classList.add("hidden");
        if (!secGaleria) return;

        secGaleria.classList.remove("hidden");
        secGaleria.classList.add("active");

        const elTitulo = document.getElementById("titulo-carrera-trabajos");
        if (elTitulo) elTitulo.textContent = `Trabajos de Alumnos - ${titulo}`;

        dibujarTrabajosCarrera(carreraActualSeleccionada);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  });

  const btnVolverTrabajos = document.querySelector(".btn-volver-trabajos");
  if (btnVolverTrabajos) {
    btnVolverTrabajos.addEventListener("click", () => {
      animarBarraCarga();
      const secGaleria = document.getElementById("sec-trabajos-carrera");
      const secTrabajos = document.getElementById("sec-trabajos");
      if (secGaleria) secGaleria.classList.add("hidden");
      if (secTrabajos) {
        secTrabajos.classList.remove("hidden");
        secTrabajos.classList.add("active");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Modal y formulario de subida
  const btnAbrirModal = document.getElementById("btn-abrir-subir-trabajo");
  const btnCerrarModal = document.getElementById("btn-cerrar-modal-trabajo");
  const formNuevoTrabajo = document.getElementById("form-nuevo-trabajo");

  if (btnAbrirModal && modalTrabajo) {
    btnAbrirModal.addEventListener("click", () => {
      indiceTrabajoEnEdicion = null;
      if (formNuevoTrabajo) formNuevoTrabajo.reset();

      const inputAlumno = document.getElementById("nuevo-trabajo-alumno");
      const inputContacto = document.getElementById("nuevo-trabajo-contacto");
      const nombreSesion = sessionStorage.getItem("nombreUser");
      const apellidoSesion = sessionStorage.getItem("apellidoUser");
      const mailSesion = sessionStorage.getItem("usuarioLogueado");

      if (inputAlumno && nombreSesion && nombreSesion !== "Invitado") {
        inputAlumno.value = `${nombreSesion} ${apellidoSesion || ""}`.trim();
      }
      if (inputContacto && mailSesion && mailSesion !== "invitado") {
        inputContacto.value = mailSesion;
      }
      modalTrabajo.classList.remove("hidden");
    });
  }

  if (btnCerrarModal && modalTrabajo) {
    btnCerrarModal.addEventListener("click", () => modalTrabajo.classList.add("hidden"));
  }

  if (selectTipoMedia) {
    selectTipoMedia.addEventListener("change", (e) => {
      if (bloqueFoto) bloqueFoto.classList.add("hidden");
      if (bloquePdf) bloquePdf.classList.add("hidden");
      if (bloqueYoutube) bloqueYoutube.classList.add("hidden");

      if (e.target.value === "youtube") {
        if (bloqueYoutube) bloqueYoutube.classList.remove("hidden");
      } else if (e.target.value === "pdf") {
        if (bloquePdf) bloquePdf.classList.remove("hidden");
      } else {
        if (bloqueFoto) bloqueFoto.classList.remove("hidden");
      }
    });
  }

  function convertirUrlYoutube(url) {
    if (!url) return "";
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return (match && match[1]) ? `https://www.youtube.com/embed/${match[1]}` : url;
  }

  if (formNuevoTrabajo) {
    formNuevoTrabajo.addEventListener("submit", async (e) => {
      e.preventDefault();

      const titulo = document.getElementById("nuevo-trabajo-titulo").value.trim();
      const alumno = document.getElementById("nuevo-trabajo-alumno").value.trim();
      const anio = document.getElementById("nuevo-trabajo-anio").value.trim();
      const materia = document.getElementById("nuevo-trabajo-materia").value.trim();
      const contacto = document.getElementById("nuevo-trabajo-contacto").value.trim();
      const desc = document.getElementById("nuevo-trabajo-desc").value.trim();
      const tipoMedia = selectTipoMedia ? selectTipoMedia.value : "imagen";

      const inputArchivos = document.getElementById("nuevo-trabajo-archivo");
      const inputPdf = document.getElementById("nuevo-trabajo-pdf");
      const inputVideo = document.getElementById("nuevo-trabajo-url-video");

      const urlVideo = inputVideo ? inputVideo.value.trim() : "";
      const archivoPdf = inputPdf && inputPdf.files ? inputPdf.files[0] : null;
      const archivosFotos = inputArchivos && inputArchivos.files ? Array.from(inputArchivos.files) : [];
      const usuarioCreador = sessionStorage.getItem("usuarioLogueado") || "invitado";

      let imagenesComprimidas = [];
      let pdfBase64 = "";

      if (tipoMedia === "imagen" && archivosFotos.length > 0) {
        for (const arch of archivosFotos.slice(0, 4)) {
          const b64 = await comprimirImagen(arch);
          imagenesComprimidas.push(b64);
        }
      } else if (tipoMedia === "pdf" && archivoPdf) {
        if (archivoPdf.size > 4 * 1024 * 1024) {
          alert("El archivo PDF supera los 4 MB. Intentá con un PDF más liviano.");
          return;
        }
        pdfBase64 = await leerPdfComoBase64(archivoPdf);
      }

      try {
        const clave = `unmTrabajos_${carreraActualSeleccionada}`;
        let guardados = JSON.parse(localStorage.getItem(clave)) || [];

        if (indiceTrabajoEnEdicion !== null) {
          if (indiceTrabajoEnEdicion < guardados.length) {
            guardados[indiceTrabajoEnEdicion].trabajo = titulo;
            guardados[indiceTrabajoEnEdicion].alumno = alumno;
            guardados[indiceTrabajoEnEdicion].anio = anio;
            guardados[indiceTrabajoEnEdicion].materia = materia;
            guardados[indiceTrabajoEnEdicion].contacto = contacto;
            guardados[indiceTrabajoEnEdicion].desc = desc;
            guardados[indiceTrabajoEnEdicion].tipoMedia = tipoMedia;
            guardados[indiceTrabajoEnEdicion].creador = usuarioCreador;

            if (tipoMedia === "youtube") {
              guardados[indiceTrabajoEnEdicion].videoUrl = convertirUrlYoutube(urlVideo);
            } else if (tipoMedia === "pdf" && pdfBase64) {
              guardados[indiceTrabajoEnEdicion].pdfSrc = pdfBase64;
            } else if (imagenesComprimidas.length > 0) {
              guardados[indiceTrabajoEnEdicion].imagenes = imagenesComprimidas;
            }
          }
          alert("¡Proyecto modificado con éxito!");
        } else {
          const nuevo = {
            id: "trabajo_" + Date.now(),
            creador: usuarioCreador,
            anio,
            trabajo: titulo,
            alumno,
            materia,
            contacto,
            desc,
            tipoMedia,
            imagenes: imagenesComprimidas.length > 0 ? imagenesComprimidas : ["https://placehold.co/800x500/1885AC/ffffff?text=UNM+" + encodeURIComponent(carreraActualSeleccionada)],
            pdfSrc: pdfBase64,
            videoUrl: tipoMedia === "youtube" ? convertirUrlYoutube(urlVideo) : ""
          };
          guardados.unshift(nuevo);
          const modal = document.createElement("dialog");

modal.style.cssText = `
  position: fixed;
  inset: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  width: min(420px, calc(100% - 40px));
  max-height: 90vh;
  overflow-y: auto;
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
    ¡Proyecto publicado!
  </h2>

  <p style="color: #6c757d; margin-bottom: 20px;">
    Tu proyecto se agregó correctamente a la galería de trabajos de alumnos.
  </p>

  <div style="background: #eaf5f9; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
    <p style="font-size: 0.95rem; color: #126b8a;">
      Podés encontrarlo en la sección Trabajos de Alumnos.
    </p>
  </div>

  <button id="cerrar-modal-publicacion"
    style="background: #1885AC; color: white; border: none;
    border-radius: 8px; padding: 12px 20px; font-size: 1rem;
    font-family: 'Lato', sans-serif; font-weight: bold;
    cursor: pointer; width: 100%;">
    Ver galería
  </button>
`;

modal.style.setProperty("z-index", "10010");

document.body.appendChild(modal);

modal.querySelector("#cerrar-modal-publicacion").onclick = () => {
  modal.close();
};

modal.addEventListener("close", () => modal.remove());

modal.showModal();
        }

        localStorage.setItem(clave, JSON.stringify(guardados));
        indiceTrabajoEnEdicion = null;
        formNuevoTrabajo.reset();
        if (modalTrabajo) modalTrabajo.classList.add("hidden");
        dibujarTrabajosCarrera(carreraActualSeleccionada);
        if (typeof window.renderizarMiniCarruselTrabajos === "function") {
          window.renderizarMiniCarruselTrabajos();
        }
      } catch (err) {
        alert("El archivo seleccionado supera el límite de memoria del navegador.");
      }
    });
  }

  // ==========================================
  // MINI CARRUSEL DE TRABAJOS EN EL INICIO
  // ==========================================
  let indiceMiniCarrusel = 0;
  let trabajosMiniCarrusel = [];

  function obtenerUltimosTrabajosGlobales() {
    const carreras = ["Diseño Multimedial", "Comunicación Visual", "Diseño de Indumentaria", "Diseño Industrial"];
    let todos = [];

    carreras.forEach(carrera => {
      try {
        const guardados = JSON.parse(localStorage.getItem(`unmTrabajos_${carrera}`)) || [];
        const base = baseTrabajosPredeterminada[carrera] || [];
        const combinados = [...guardados, ...base].map(item => ({ ...item, carrera }));
        todos = [...todos, ...combinados];
      } catch (e) {
        console.error("Error al leer proyectos de", carrera, e);
      }
    });

    todos.sort((a, b) => Number(b.anio || 0) - Number(a.anio || 0));
    return todos.slice(0, 5);
  }

  window.renderizarMiniCarruselTrabajos = function() {
    const contenedor = document.getElementById("mini-carrusel-trabajos");
    if (!contenedor) return;

    trabajosMiniCarrusel = obtenerUltimosTrabajosGlobales();

    if (trabajosMiniCarrusel.length === 0) {
      contenedor.innerHTML = "<p style='color: #666; text-align: center; padding: 20px;'>No hay proyectos cargados actualmente.</p>";
      return;
    }

    if (indiceMiniCarrusel >= trabajosMiniCarrusel.length) indiceMiniCarrusel = 0;
    if (indiceMiniCarrusel < 0) indiceMiniCarrusel = trabajosMiniCarrusel.length - 1;

    const item = trabajosMiniCarrusel[indiceMiniCarrusel];

    let miniaturaHtml = "";
    if (item.tipoMedia === "pdf") {
      miniaturaHtml = `<div style="display:flex;align-items:center;justify-content:center;background:#fef2f2;color:#dc2626;font-size:1.8rem;width:100px;height:100px;border-radius:6px;border:1px solid #cbd5e0;flex-shrink:0;">📄</div>`;
    } else if (item.tipoMedia === "youtube") {
      miniaturaHtml = `<div style="display:flex;align-items:center;justify-content:center;background:#000;color:white;font-size:1.6rem;width:100px;height:100px;border-radius:6px;flex-shrink:0;">▶️</div>`;
    } else if (item.imagenes && item.imagenes.length > 0) {
      miniaturaHtml = `<img src="${item.imagenes[0]}" alt="${item.trabajo}" style="width:100px;height:100px;object-fit:cover;border-radius:6px;border:1px solid #cbd5e0;flex-shrink:0;" onerror="this.src='https://placehold.co/100x100/e9ecef/666666?text=UNM'">`;
    } else {
      miniaturaHtml = `<img src="https://placehold.co/100x100/1885AC/ffffff?text=UNM" style="width:100px;height:100px;object-fit:cover;border-radius:6px;border:1px solid #cbd5e0;flex-shrink:0;">`;
    }

    contenedor.innerHTML = `
      <div id="card-mini-trabajo" style="display: flex; gap: 15px; align-items: center; cursor: pointer; min-height: 120px;">
        ${miniaturaHtml}
        <div style="display: flex; flex-direction: column; justify-content: center; flex: 1;">
          <span style="font-size: 0.72rem; color: #1e8e3e; font-weight: bold; background: #e6f4ea; padding: 2px 6px; border-radius: 4px; align-self: flex-start; margin-bottom: 4px;">
            ${item.carrera} · Año ${item.anio}
          </span>
          <h4 style="margin: 2px 0 4px 0; color: #1885AC; font-size: 0.95rem; line-height: 1.2;">${item.trabajo}</h4>
          <p style="margin: 0; font-size: 0.8rem; color: #4a5568;"><strong>Por:</strong> ${item.alumno}</p>
          <span style="font-size: 0.75rem; color: #718096; margin-top: 2px;">${item.materia || ""}</span>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 10px; border-top: 1px solid #f1f5f9;">
        <button type="button" id="btn-mini-prev" style="background:none; border:1px solid #cbd5e0; color:#1885AC; border-radius:4px; padding:3px 8px; font-size:0.8rem; font-weight:bold; cursor:pointer;">◀ Anterior</button>
        <span style="font-size: 0.75rem; color: #718096;">Proyecto ${indiceMiniCarrusel + 1} de ${trabajosMiniCarrusel.length}</span>
        <button type="button" id="btn-mini-next" style="background:none; border:1px solid #cbd5e0; color:#1885AC; border-radius:4px; padding:3px 8px; font-size:0.8rem; font-weight:bold; cursor:pointer;">Siguiente ▶</button>
      </div>
    `;

    document.getElementById("card-mini-trabajo").addEventListener("click", () => {
      carreraActualSeleccionada = item.carrera;
      abrirVisorDetalle(item, indiceMiniCarrusel);
    });

    document.getElementById("btn-mini-prev").addEventListener("click", (e) => {
      e.stopPropagation();
      indiceMiniCarrusel--;
      renderizarMiniCarruselTrabajos();
    });

    document.getElementById("btn-mini-next").addEventListener("click", (e) => {
      e.stopPropagation();
      indiceMiniCarrusel++;
      renderizarMiniCarruselTrabajos();
    });
  };

  // ==========================================
  // 7. PRÉSTAMOS, FORMULARIOS Y VOLVER
  // ==========================================
  window.renderizarMisPrestamos = function() {
    const contenedor = document.getElementById("contenedor-mis-prestamos");
    if (!contenedor) return;

    const usuarioActual = sessionStorage.getItem("usuarioLogueado");
    const reservasGlobales = JSON.parse(localStorage.getItem('unmBibliotecaReservas')) || [];
    const misPrestamos = reservasGlobales.filter(res => !usuarioActual || res.usuario === usuarioActual);

    if (misPrestamos.length === 0) {
      contenedor.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #e9ecef; width: 100%; max-width: 900px; margin: 0 auto;">
          <p style="color: #666; margin: 0; font-size: 0.95rem;">No tenés préstamos activos en este momento.</p>
        </div>`;
      return;
    }

    contenedor.innerHTML = "";
    misPrestamos.forEach(prestamo => {
      const titulo = prestamo.titulo || (prestamo.libroCompleto && prestamo.libroCompleto.titulo) || "Libro sin título";
      const autor = prestamo.autor || (prestamo.libroCompleto && prestamo.libroCompleto.autor) || "Autor no especificado";
      const libroId = prestamo.libroId || prestamo.id || "";

      contenedor.innerHTML += `
        <div class="prestamo-card">
          <img src="https://biblioteca.unm.edu.ar/cgi-bin/koha/opac-image.pl?biblionumber=${libroId}" 
               onerror="this.src='portada_no_disponible.png'" 
               alt="Tapa" class="prestamo-img">
          <div class="prestamo-info">
            <div>
              <h4 class="prestamo-titulo">${titulo}</h4>
              <p class="prestamo-autor">${autor}</p>
            </div>
            <div style="background-color: #e6f4ea; color: #059669; padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 0.85rem; display: inline-block; margin-top: 8px;">
              ⏳ Préstamo activo (14 días)
            </div>
          </div>
        </div>
      `;
    });
  };

  const formLibreDeuda = document.getElementById("form-libre-deuda");
  if (formLibreDeuda) {
    formLibreDeuda.addEventListener("submit", (e) => {
      e.preventDefault();
      const nombre = document.getElementById("ld-nombre").value.trim();
      const dni = document.getElementById("ld-dni").value.trim();
      const claustro = document.getElementById("ld-claustro").value;
      const asunto = `Solicitud de Libre Deuda - ${nombre} - DNI: ${dni}`;
      const cuerpo = `Estimada Biblioteca de la UNM,%0D%0A%0D%0APor medio de la presente solicito mi certificado de Libre Deuda.%0D%0A%0D%0ANombre: ${nombre}%0D%0ADNI: ${dni}%0D%0AClaustro: ${claustro}%0D%0A%0D%0AGracias.`;
      window.location.href = `mailto:biblioteca@unm.edu.ar?subject=${asunto}&body=${cuerpo}`;
    });
  }

  const formSugerencia = document.getElementById("form-sugerencia");
  if (formSugerencia) {
    formSugerencia.addEventListener("submit", (e) => {
      e.preventDefault();
      const titulo = document.getElementById("sug-titulo").value.trim();
      alert(`¡Gracias! Tu sugerencia para "${titulo}" fue enviada a la biblioteca.`);
      formSugerencia.reset();
      const secSugerencia = document.getElementById("sec-sugerencia");
      const secInicio = document.getElementById("sec-catalogo") || document.getElementById("sec-inicio");
      if (secSugerencia) secSugerencia.classList.add("hidden");
      if (secInicio) {
        secInicio.classList.remove("hidden");
        secInicio.classList.add("active");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const botonesVolver = document.querySelectorAll(".btn-volver-catalogo, .btn-volver-inicio, #btn-volver-perfil, .btn-volver-ficha");
  botonesVolver.forEach(boton => {
    boton.addEventListener("click", () => {
      animarBarraCarga();
      document.querySelectorAll(".tab-content").forEach(sec => {
        sec.classList.add("hidden");
        sec.classList.remove("active");
      });
      const secInicio = document.getElementById("sec-catalogo") || document.getElementById("sec-inicio");
      if (secInicio) {
        secInicio.classList.remove("hidden");
        secInicio.classList.add("active");
      }
      if (typeof window.renderizarMiniCarruselTrabajos === "function") {
        window.renderizarMiniCarruselTrabajos();
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

});