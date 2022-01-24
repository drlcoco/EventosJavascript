"use strict";

//Variables
let select = document.getElementById("select");
select.addEventListener("change", ordenar);
let contenedor = document.querySelector("#eventos");
let object = [];
let ajax;
let data;
let input = document.getElementById("input");
let filtrar = document.getElementById("filtrar");
let card;
let numeroEntrada = Math.floor(Math.random() * 10000000) + 1000000;

//Al cargar la página
window.addEventListener("load",inicio);
function inicio() {
    recuperar();
    mostrarEventos();
    filtrar.addEventListener("click", mostrarFiltro);
}

//Recupera los eventos creados del JSON.
function recuperar() {
  ajax = new XMLHttpRequest();
  ajax.onreadystatechange = function () {
    console.log("ReadyState: " + this.readyState + " Status: " + this.status);
    // Si todo esta bien
    if (this.readyState == 4 && this.status == 200) {
      object = JSON.parse(this.responseText);
      console.log("Datos parseados: ");
      console.log(object);
      mostrarEventos(object);
    }
  };
  ajax.open("GET", "eventos.json", true);
  ajax.send();
}

//Borra el evento seleccionado tras confirmación del usuario.
function borrarCookie(e) {
  if(confirm("Está seguro que desea borrar este evento?")){
    let boton = e.target;
    let carta = boton.parentElement;
    let titulo = carta.querySelector(".titulo").innerText;
    let fecha = carta.querySelector(".fecha").innerText;
    object = object.filter((element) => element.Nombre !== titulo);
    console.log(object);
    let datos = JSON.stringify(object);
    let xmlh=new XMLHttpRequest();
    xmlh.onreadystatechange=function(){
        console.log("ReadyState: " + this.readyState + " Status: " + this.status);
        if(this.readyState==4 && this.status==200){
            console.log("ReadyState: " + this.readyState + " Status: " + this.status); 
        }
    };
    xmlh.open("POST", "index.php", true);
    xmlh.setRequestHeader("Content-type","application/json");
    xmlh.send(datos);
    console.log(object);
    mostrarEventos(object);
  }
  else{
    return;
  }
}

//Compra una entrada y la descarga.
function compra(event){
    let boton = event.target;
    let carta = boton.parentElement;
    let titulo = carta.querySelector(".titulo").innerText;
    let fecha = carta.querySelector(".fecha").innerText;
    object = object.filter((element) => element.Nombre === titulo);
    for(let obj of object){
      if(confirm("PAGAR "+ obj.Precio +"€")){
        mostrarEventos();
        contenedor.innerHTML += `<div class="col mt-3"><h2>***PAGO DE ${obj.Precio}€ REALIZADO CORRECTAMENTE</h2>
        <h2>***EVENTO: ${obj.Nombre.toUpperCase()}</h2>
        <h2>***FECHA: ${obj.Fecha}</h2>
        <h2>***HORA: 22:00</h2>
        <h2>***NÚMERO DE ENTRADA: ${numeroEntrada}</h2>
        <h2>--------------------------------------</h2>
        <h2>***GRACIAS POR SU COMPRA!!!</h2></div>`;
        let imagen = obj.Imagen;
        const button = document.createElement('button');
        button.type = 'button';
        button.id = 'descargar';
        button.className = 'col-12 btn-lg d-flex mt-5 justify-content-center btn btn-primary';
        button.innerText = 'Descargar';
        document.body.appendChild(button);
        let descargar = document.getElementById("descargar");
        descargar.addEventListener("click", () => {
          if(confirm(" DESCARGAR ")){
            const link = document.createElement('a');
            link.href = imagen;
            link.setAttribute('download',obj.Nombre.toUpperCase()+" "+numeroEntrada);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } 
        })
        const button2 = document.createElement('button');
        button2.type = 'button';
        button2.id = 'continuar';
        button2.className = 'row mt-5 mr-5 float-right justify-content-center  btn btn-secondary';
        button2.innerText = 'Continuar';
        document.body.appendChild(button2);
        let continuar = document.getElementById("continuar");
        continuar.addEventListener("click", () => {
          const link2 = document.createElement('a');
          link2.href = "index.html";
          document.body.appendChild(link2);
          link2.click();
          document.body.removeChild(link2);
        })
      }
      else{location.reload();}
      console.log(object.Nombre);
    }
}

//Muestra todos los eventos.
function mostrarEventos() {
  console.log(object.length);
  contenedor.innerHTML = "";
  mostrar(object);
  clickBotones(); 
}

//Ordena los eventos.
function ordenar() {
  let output;
  switch (select.value) {
    case "alfabetNombre":
      object.sort((a, b) => {
        let txtA = a.Nombre.toUpperCase();
        let txtB = b.Nombre.toUpperCase();
        if (txtA < txtB) {
          output = -1;
        } else {
          if (txtB < txtA) {
            output = 1;
          } else {
            output = 0;
          }
        }
        return output;
      });
      break;

    case "alfabetDescripcion":
      object.sort((a, b) => {
        let txtA = a.Descripcion.toUpperCase();
        let txtB = b.Descripcion.toUpperCase();
        if (txtA < txtB) {
          output = -1;
        } else {
          if (txtB < txtA) {
            output = 1;
          } else {
            output = 0;
          }
        }
        return output;
      });
      break;

    case "fecha":
      object = object.sort((a, b) => {
        let arrayFecha = a.Fecha.split("/");
        let dia = arrayFecha[0];
        let mes = arrayFecha[1];
        let anyo = arrayFecha[2];
        let aFechaCompleta = new Date(anyo, mes, dia);
        arrayFecha = b.Fecha.split("/");
        dia = arrayFecha[0];
        mes = arrayFecha[1];
        anyo = arrayFecha[2];
        let bFechaCompleta = new Date(anyo, mes, dia);
        return aFechaCompleta.getTime() - bFechaCompleta.getTime();
      });
      break;

    case "precioAscendente":
      object = object.sort((a, b) => a.Precio - b.Precio);
      break;

    case "precioDescendente":
      object = object.sort((a, b) => b.Precio - a.Precio);
      console.log(object);
      break;
  }
  //Muestro los eventos ordenados.
  mostrarEventos(object);
}

//Muestra el evento filtrado.
function mostrarFiltro() {
  let texto = input.value.toUpperCase();
  let eventosFiltrados = [];
  console.log(texto);
  if (texto !== "") { 
      for (let obj of object) {
        let nombre = obj.Nombre.toUpperCase();
        if(nombre.indexOf(texto) !== -1){
          eventosFiltrados.push(obj);
        }  
      }
      mostrar(eventosFiltrados);
      clickBotones();
      input.value = "";
  }
  else{
    mostrarEventos(object);
  }
} 

//Muestra uno o varios eventos.
function mostrar(listaEventos){
  console.log(listaEventos);
  contenedor.innerHTML = "";
  for (let evento of listaEventos) {
    contenedor.innerHTML += `
        <div class="card p-2 ml-2 mb-2" style="width: 23rem;">
          <img class="card-img-top" style="height: 14rem;" src="${evento.Imagen}" alt="Card image cap">
          <div class="card-body">
            <h3 class="card-title titulo">${evento.Nombre}</h3>
            <p class="card-text descripcion">${evento.Descripcion}</p>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <span class="card-text fecha"><small class="text-muted">${evento.Fecha}</small></span>
            <span class="card-text precio"><small class="text-muted border-right">${evento.Precio}€</small></span>
          </div>
            <a href="#" class= "btn btn-primary btn-lg btn-block" id="comprar">Comprar</a>
            <a href="#" class= "btn btn-danger btn-lg btn-block">Borrar</a>
        </div>`;
  }
}

function clickBotones(){
  let botonesBorrar = document.querySelectorAll(".btn-danger");
  //Recorrremos los botones borrar y los ponemos en escucha.
  if (botonesBorrar != null || botonesBorrar != undefined) {
    for (let j = 0; j < botonesBorrar.length; j++) {
      let botonBorrar = botonesBorrar[j];
      botonBorrar.addEventListener("click", borrarCookie);
    }
  }
  
  let botonComprar = document.querySelectorAll(".btn-primary");
  //Recorrremos los botones comprar y los ponemos en escucha.
  if (botonComprar != null || botonComprar != undefined) {
    for (let c = 0; c < botonComprar.length; c++) {
      let comprar = botonComprar[c];
      comprar.addEventListener("click", compra);
    }
  }
}

  



