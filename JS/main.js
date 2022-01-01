const baseDeDatos = [
    {
        id: 1,
        nombre: "Abrigo Rosa",
        precio: 300,
        imagen: "./media/img1.jpeg"
    },{
        id: 2,
        nombre: "Abrigo Naranja",
        precio: 300,
        imagen: "./media/img2.jpeg"
    },{
        id: 3,
        nombre: "conjunto Blanco y Negro",
        precio: 800,
        imagen: "./media/img3.jpeg"
    },{
        id: 4,
        nombre: "Abrigo Bordo",
        precio: 300,
        imagen: "./media/img4.jpeg"
    },{
        id:5,
        nombre: "Top Negro Largo",
        precio: 400,
        imagen: "./media/img5.jpeg"
    },{
        id: 6,
        nombre: "Top Negro Corto",
        precio: 400,
        imagen:"./media/img6.jpeg"
    },{
        id: 7,
        nombre: "top Blanco Largo",
        precio: 400,
        imagen: "./media/img7.jpeg"
    },{
        id: 8,
        nombre: "Top Blanco Corto",
        precio: 400,
        imagen: "./media/img8.jpeg"
    },{
        id: 9,
        nombre: "Top Corto Amarillo",
        precio: 400,
        imagen: "./media/img9.jpeg"
    }
];


let carrito = [];
let total = 0;
const DOMitems = document.querySelector('#items');
const DOMcarrito = document.querySelector('#carrito');
const DOMtotal = document.querySelector('#total');
const DOMbotonVaciar = document.querySelector('#boton-vaciar');
const DOMbotonEnviar = document.querySelector('#boton-enviar');



//funciones

/* estructura de los items a partir de la base de datos */

function escribirProductos(){
    baseDeDatos.forEach((info) => {
        const nodo = document.createElement('div');
        nodo.classList.add('card', 'col-sm-4');

        const nodoCardBody = document.createElement('div');
        nodoCardBody.classList.add('card-body');

        const nodoTitulo = document.createElement('h5');
        nodoTitulo.classList.add('card-title');
        nodoTitulo.textContent = info.nombre;

        const nodoImagen = document.createElement('img');
        nodoImagen.classList.add('img-fluid');
        nodoImagen.setAttribute('src', info.imagen);

        const nodoPrecio = document.createElement('p');
        nodoPrecio.classList.add('card-text');
        nodoPrecio.textContent = "$" + info.precio;

        const nodoBoton = document.createElement('button');
        nodoBoton.classList.add('btn', 'btn-primary');
        nodoBoton.textContent = '+';
        nodoBoton.setAttribute('marcador', info.id);
        nodoBoton.addEventListener('click', anyadirProductoAlCarrito);

        nodoCardBody.appendChild(nodoImagen);
        nodoCardBody.appendChild(nodoTitulo);
        nodoCardBody.appendChild(nodoPrecio);
        nodoCardBody.appendChild(nodoBoton);
        nodo.appendChild(nodoCardBody);
        DOMitems.appendChild(nodo);
    });
}

/* añadir cosas al carrito */

function anyadirProductoAlCarrito(evento) {
    carrito.push(evento.target.getAttribute('marcador'));
    calcularTotal();
    elCarrito();
}

/* dibujar el carrito en si */
function elCarrito() {
    DOMcarrito.textContent = '';
    const carritoSinDup = [...new Set(carrito)];
    carritoSinDup.forEach((item) => {
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
        });
        const unidades = carrito.reduce((total, itemId) => {
            return itemId === item ? total += 1 : total;
        },0);
        const nuevoNodo = document.createElement('li');
        nuevoNodo.classList.add('list-group-item', 'text-right', 'mx-2', 'lista-carrito');
        nuevoNodo.textContent = `${unidades} x ${miItem[0].nombre} - ${miItem[0].precio}$`;

        const elBoton = document.createElement('button');
        elBoton.classList.add('btn', 'btn-danger', 'mx-5');
        elBoton.textContent = 'X';
        elBoton.style.marginLeft = '1rem';
        elBoton.dataset.item = item;
        elBoton.addEventListener('click', borrarItemCarrito);

        nuevoNodo.appendChild(elBoton);
        DOMcarrito.appendChild(nuevoNodo);
    });
}

/* borrar un item del carrito */
function borrarItemCarrito(evento) {
    const id = evento.target.dataset.item;
    carrito = carrito.filter((carritoId) => {
        return carritoId !== id;
    });
    elCarrito();
    calcularTotal();
}

/* calcula el total a pagar */
function calcularTotal() {
    total = 0;
    carrito.forEach((item) => {
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
        });
        total = total + miItem[0].precio;
    });
    DOMtotal.textContent = total.toFixed(2);
}

/* vacia el carrito de compras */
function vaciarCarrito(){
    carrito = [];
    elCarrito();
    calcularTotal();
}

/* verifica que los campos del formulario esten llenos */
function formulario(){
    $("#EM").html("");
    $("#DI").html("");
    if($("#email").val() == ""){
        $("#EM").html("Este campo no puede estar vacio");
        $("#email").focus();
        return false;
    }
    if($("#direccion").val() == ""){
        $("#DI").html("Este campo no puede estar vacio");
        $("#direccion").focus();
        return false;
    }
    return true;
}

/* vacia totalmente el carrito de compras */
$("#boton-vaciar").click(function(){
    vaciarCarrito();
    $("#cuerpo-carro").html("  ");
})

$(document).ready(function () {
    $("#boton-enviar").click(function() {
        if (formulario()){
            $.get("envio.php", {
                informaicio: $("#formdata").serialize(),
                carTotal: carrito
            }, function(res){
                $("#formulario").fadeOut("slow");
                console.log(res);
                if (res == 1){
                    $("#cuerpo-carro").html("Se ha enviado su pedido").delay(500).fadeIn("slow");
                } else {
                    $("#cuerpo-carro").html("Ha ocurrido un error").delay(500).fadeIn("slow");
                }
            });
        }
        vaciarCarrito();
        return false;
    }); 
});


escribirProductos();