import Juego from './classJuego.js';
import { sumarioValidacionJuego } from './validacionJuego.js';

//variables globales
let listaJuegos = JSON.parse(localStorage.getItem('listaJuegos')) || [];
//saber si el array esta no vacio
if (listaJuegos.length !== 0) {
  //objecto Juego
  listaJuegos = listaJuegos.map(
    (juego) =>
      new Juego(
        juego.nombre,
        juego.precio,
        juego.categoria,
        juego.descripcion,
        juego.imagen,
        juego.requisitosSistema,
        juego.desarrollador,
        juego.reseniaVoto,
        juego.reseniaDescripcion
      )
  );
}
console.log(listaJuegos);

//variables del objeto Juego del modal Juego
let formularioAdminJuego = document.getElementById('formJuego');
console.log(formularioAdminJuego);
let codigo = document.getElementById('codigo'),
  nombre = document.getElementById('nombre'),
  precio = document.getElementById('precio'),
  categoria = document.getElementById('categoria'),
  descripcion = document.getElementById('descripcion'),
  imagen = document.getElementById('imagen'),
  requisitosSistema = document.getElementById('requisitosSistema'),
  desarrollador = document.getElementById('desarrollador');
let modalFormJuego = new bootstrap.Modal(document.getElementById('modalJuego'));
console.log(modalFormJuego);
let btnCrearJuego = document.getElementById('btnCrearJuego');
let alerta = document.getElementById('alerta');

//manejadores de eventos
formularioAdminJuego.addEventListener('submit', prepararFormularioJuego);
btnCrearJuego.addEventListener('click', mostrarFormularioJuego);
document
  .getElementById('modalJuego')
  .addEventListener('hidden.bs.modal', function () {
    //cerrar el modal con el formulario
    limpiarFormulario();
    //se limpia el resumen de la alerta
    cambiarContenidoAlerta('', '');
  });

cargaInicial();

function cargaInicial() {
  if (listaJuegos.length > 0) {
    //dibujo una fila en la tabla
    listaJuegos.map((juego) => crearFila(juego));
  }
}

function crearFila(juego) {
  let tbody = document.querySelector('#tablaJuego');
  tbody.innerHTML += `<tr>
  <td scope="col">1</td>
  <td>${juego.nombre}</td>
  <td>
    ${juego.precio}
  </td>
  <td class="tamanioCelda text-truncate">
    ${juego.categoria}
  </td>
  <td class="tamanioCelda text-truncate">${juego.imagen}</td>
  <td>
    <button class="btn btn-primary">
    <i class="bi bi-search"></i>
    </button>
    <button class="btn btn-warning my-2 my-md-0">
    <i class="bi bi-pencil"></i>
    </button>
    <button class="btn btn-danger">
    <i class="bi bi-x-lg"></i>
    </button>
  </td>
</tr>`;
}

function prepararFormularioJuego(e) {
  e.preventDefault();
  console.log('aqui creo el juego');
  crearJuego();
}

function crearJuego() {
  //validar los datos del formulario
  let resumen = sumarioValidacionJuego(
    nombre.value,
    precio.value,
    categoria.value,
    descripcion.value,
    imagen.value,
    requisitosSistema.value,
    desarrollador.value
  );

  if (resumen.length === 0) {
    // los datos son validos
    //se crea el objeto
    const juegoNuevo = new Juego(
      nombre.value,
      precio.value,
      categoria.value,
      descripcion.value,
      imagen.value,
      requisitosSistema.value,
      desarrollador.value,
      0, //reseniaVoto
      '' //reseniaDescripcion
    );
    console.log(juegoNuevo);
    //la voy agregar en un array
    listaJuegos.push(juegoNuevo);
    console.log(listaJuegos);
    //almacenar el array de pelis en localsotarge
    guardarEnLocalstorage();
    //cerrar el modal con el formulario
    limpiarFormulario();
    //dibujar la fila nueva en la tabla
    crearFila(juegoNuevo, listaJuegos.length);
    //avisar con una alerta que se grabó un nuevo juego
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Se guardó correctamente el nuevo juego',
      showConfirmButton: false,
      timer: 2000,
    });

    //se limpia el resumen de la alerta
    cambiarContenidoAlerta('', '');
    //se oculta el modal
    modalFormJuego.hide();
  } else {
    //mostrar al usuario el cartel de error
    cambiarContenidoAlerta(resumen, 'alert alert-danger mt-3');
  }
}

function guardarEnLocalstorage() {
  localStorage.setItem('listaJuegos', JSON.stringify(listaJuegos));
}

function limpiarFormulario() {
  formularioAdminJuego.reset();
  //reiniciar los estilos de validaciones de los campos del formulario Juego
  let formControls = formularioAdminJuego.querySelectorAll('.form-control');
  // Eliminar las clases de validación
  formControls.forEach(function (element) {
    element.classList.remove('is-valid', 'is-invalid');
  });
}

function mostrarFormularioJuego() {
  modalFormJuego.show();
}

function cambiarContenidoAlerta(texto, clases) {
  alerta.innerHTML = texto;
  alerta.className = clases;
}
