let usuarioActual = null;
let fotoPerfilURL = null;
let adopcionesTotales = 0;

// nav y menu
function irASeccion(id) {
    if ((id === 'login' || id === 'registro') && usuarioActual) {
        id = 'inicio';
    }
    document.querySelectorAll('main > section').forEach(sec => sec.classList.add('oculto'));
    const target = document.getElementById(id);
    if (target) {
        target.classList.remove('oculto');
        target.scrollIntoView({ behavior: "smooth" });
    }
    const menu = document.getElementById('menuUsuario');
    if (menu) menu.classList.add('oculto');
}

function toggleMenuUsuario(e) {
    e.stopPropagation();
    const menu = document.getElementById('menuUsuario');
    if (menu) menu.classList.toggle('oculto');
}

document.addEventListener('click', () => {
    const menu = document.getElementById('menuUsuario');
    if (menu) menu.classList.add('oculto');
});

// inicio
function registrarUsuario() {
    const nombre = document.getElementById('nombreUsuario').value.trim();
    const email = document.getElementById('emailUsuario').value.trim();
    const telefono = document.getElementById('telUsuario').value.trim();
    const direccion = document.getElementById('direccionUsuario').value.trim();
    const edad = parseInt(document.getElementById('edadUsuario').value);

    if (!nombre || !email || !direccion || isNaN(edad) || edad < 18) {
        document.getElementById('mensajeLogin').textContent = "Completa todos los campos y recuerda que debes ser mayor de 18 años.";
        document.getElementById('mensajeLogin').style.color = "red";
        return;
    }

    usuarioActual = {
        nombre, email, telefono, direccion, edad,
        foto: fotoPerfilURL || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    };

    localStorage.setItem('usuarioHuellitas', JSON.stringify(usuarioActual));

    document.getElementById('mensajeLogin').textContent = `¡Bienvenido/a, ${nombre}! Ya puedes adoptar`;
    document.getElementById('mensajeLogin').style.color = "green";

    actualizarAvatarYMenu();
    irASeccion('adopta');
}

function cargarUsuario() {
    const guardado = localStorage.getItem('usuarioHuellitas');
    if (guardado) {
        usuarioActual = JSON.parse(guardado);
        fotoPerfilURL = usuarioActual.foto;
        actualizarAvatarYMenu();
    }
}

function actualizarAvatarYMenu() {
    if (usuarioActual) {
        document.getElementById('avatarNav').src = usuarioActual.foto || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
        document.getElementById('nombreNav').textContent = usuarioActual.nombre.split(' ')[0];
        document.getElementById('nombreMenu').textContent = usuarioActual.nombre;
        document.getElementById('btnEditarPerfil').style.display = "block"; 
    } else {
        document.getElementById('avatarNav').src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
        document.getElementById('nombreNav').textContent = "Iniciar sesión";
        document.getElementById('nombreMenu').textContent = "Invitado";
        document.getElementById('btnEditarPerfil').style.display = "none"; 
    }
}

function cerrarSesion() {
    usuarioActual = null;
    fotoPerfilURL = null;
    localStorage.removeItem('usuarioHuellitas');
    actualizarAvatarYMenu();
    irASeccion('inicio');
}

// perfil
document.getElementById('fotoUsuario')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            fotoPerfilURL = event.target.result;
            document.getElementById('previewFoto').src = fotoPerfilURL;
        }
        reader.readAsDataURL(file);
    }
});

// sonido
function reproducirMaullido() {
    const audio = document.getElementById('sonidoMaullido');
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }
}

function reproducirLadrido() {
    const audio = document.getElementById('sonidoLadrido');
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }
}

// adopcion
function adoptar(nombreMascota) {
    if (!usuarioActual) {
        alert(`Para adoptar a ${nombreMascota}, primero debes iniciar sesión.`);
        irASeccion('login');
        return;
    }

    const mensaje = `
¡Hola, ${usuarioActual.nombre}!

¿Confirmas que quieres adoptar a ${nombreMascota}?

Tus datos:
• Edad: ${usuarioActual.edad} años
• Dirección: ${usuarioActual.direccion}
• Correo: ${usuarioActual.email}
${usuarioActual.telefono ? '• Teléfono: ' + usuarioActual.telefono : ''}

¡Gracias por darle un hogar lleno de amor!
    `;

    if (confirm(mensaje)) {
        adopcionesTotales++;
        document.getElementById('counter').textContent = adopcionesTotales;

        const counter = document.getElementById('counter');
        counter.style.color = "#00b38f";
        setTimeout(() => counter.style.color = "#684eea", 1000);

        if (nombreMascota.toLowerCase().includes('luna') || 
            nombreMascota.toLowerCase().includes('pantera') || 
            nombreMascota.toLowerCase().includes('bigotes')) {
            reproducirMaullido();
        } else {
            reproducirLadrido();
        }

        alert(`¡FELICIDADES!\n${nombreMascota} ahora tiene un hogar contigo, ${usuarioActual.nombre}. Pronto nos pondremos en contacto contigo.`);
    }
}

// donar
function iniciarFormulario() {
    if (!usuarioActual) {
        alert("Para donar, primero inicia sesión");
        irASeccion('login');
        return;
    }
    alert(`¡Gracias por querer ayudar, ${usuarioActual.nombre}! Pronto tendremos el formulario de donación listo.`);
}

function crearParticula() {
    const animacion = document.getElementById('headerAnimacion');
    if (!animacion) return;

    const particle = document.createElement('div');
    particle.classList.add('particle');
    const icon = document.createElement('i');
    icon.classList.add('material-icons');

    const iconos = [
        'pets',           
        'cruelty_free',   
        'paw_print',      
        'favorite',       
        'flutter_dash',   
        'bug_report',           
    ];

    const iconoElegido = iconos[Math.floor(Math.random() * iconos.length)];
    icon.textContent = iconoElegido;
    particle.appendChild(icon);
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.animationDuration = 12 + Math.random() * 12 + 's';
    particle.style.fontSize = (30 + Math.random() * 30) + 'px';
    particle.style.color = ['#ff9eb5', '#c084fc', '#5eead4', '#ffb6c1', '#fa7b9f'][Math.floor(Math.random() * 5)]; // 
    animacion.appendChild(particle);

    setTimeout(() => {
        if (particle.parentNode) particle.remove();
    }, 25000);

}

