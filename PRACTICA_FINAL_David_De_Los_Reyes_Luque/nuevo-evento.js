"use strict";

//Nodos
let nuevaImagen = document.getElementById("nuevaImagen");
let inputImagen = document.getElementById("imagen");
let formulario = document.getElementById("newEvent");
let nombre = document.getElementById("nombre");
let fecha = document.getElementById("fecha");
let descripcion = document.getElementById("descripcion");
let precio = document.getElementById("precio");

//AddEventListener
inputImagen.addEventListener("change", validarImagen);
formulario.addEventListener("submit", envioFormulario);
nombre.addEventListener("blur", validarNombre);
fecha.addEventListener("blur", validarFecha);
descripcion.addEventListener("blur", validarDescripcion);
precio.addEventListener("keyup", validarPrecio);
precio.addEventListener("blur", validarPrecio);

//Variables
let urlImagen = "";
let eventoGuardar;
let ajax;
let imgBase64;
let eventosString;
let datos;
let str;
let fechaActual = Date.now();
let hoy = new Date(fechaActual);
let diaActual = hoy.getDate();
let mesActual = hoy.getMonth() + 1;
let anyoActual = hoy.getFullYear();
let fechaFormateada;
let listaEventos = [];
let arrayEventos = [];
let object;

window.addEventListener("load",recuperar,false);

console.log(listaEventos.length);

//Envía los datos del form si son correctos.
function envioFormulario(event) { 
  event.preventDefault(); 
  //Ejecuto funciones y compruebo si son válidos los datos introducidos.
  if (validarNombre() && validarFecha() && validarDescripcion() && validarPrecio() && validarImagen()) {
    //Guardo en eventos.json.
    guardar(); 
    const myTimeout = setTimeout(resetearForm, 3000);
  }
  else{
    alert("Los datos no son válidos!!!");
  }
}

//Resetea el form.
function resetearForm(){
  console.log(nuevaImagen);
  nuevaImagen.style.display="none"; 
  imgBase64 = "";
  console.log(nuevaImagen);
  formulario.reset();
}

//valida el nombre.
function validarNombre(){
  let nombreValido = nombre.value != "";
  if (nombreValido) {
    nombre.style.border = "3px solid green";
  } else {
    nombre.style.border = "3px solid red";
  }
  return nombreValido;
}

//Valida la fecha.
function validarFecha(){
  let fechaIntroducida = fecha.value.split("-");
  let diaIntroducido = fechaIntroducida[2];
  let mesIntroducido = fechaIntroducida[1];
  let anyoIntroducido = fechaIntroducida[0];
  fechaFormateada = diaIntroducido + "/" + mesIntroducido + "/" + anyoIntroducido;
  let fechaValida = false;

  fechaValida = diaIntroducido > diaActual && mesIntroducido == mesActual && anyoIntroducido == anyoActual || diaIntroducido < diaActual && mesIntroducido > mesActual && anyoIntroducido == anyoActual || mesIntroducido > mesActual && anyoIntroducido == anyoActual || anyoIntroducido > anyoActual ? true : false;
  
  fechaValida ? fecha.style.border = "3px solid green" : fecha.style.border = "3px solid red";

  return fechaValida;
}

//Valida la descripción.
function validarDescripcion(){
  let descrip = descripcion.value;
  let descripcionValida = descrip != "";
  descripcionValida ? descripcion.style.border = "3px solid green" : descripcion.style.border = "3px solid red";
  return descripcionValida;
}

//Valida el  precio
function validarPrecio(){
  let numero = precio.value;
  let numeroValido = !isNaN(numero) && numero != "";
  //Precio, escuchando evento arriba, con la función validarPrecio.

  if (isNaN(numero)) {
    precio.value = "";
    precio.style.border = "3px solid red";
    console.log("No es numero");
  } else if (numero == "") {
    precio.style.border = "3px solid red";
  } else {
    precio.style.border = "3px solid green";
    if (numero.includes(".")) {
      let enteroDecimal = numero.split(".");
      let entero = enteroDecimal[0];
      let decimal = enteroDecimal[1];

      if (decimal.length < 1) {
        precio.value = entero + "." + decimal;
      } else if (decimal.length > 2) {
        precio.value = entero + "." + decimal.substring(0, 2);
      }
    }
    console.log("Es numero");
  }
  return numeroValido;
}

//Captura la imagen seleccionada en Blob.
function validarImagen(){
  if(inputImagen.files.length) { // Si hemos seleccionado un archivo
    const fichero = inputImagen.files[0];
    console.log(`Archivo: ${fichero.name}, tipo: ${fichero.type}, tamaño: ${fichero.size}bytes`); 
    
    if(fichero.type.startsWith('image')) { 
      let reader = new FileReader(); 
      reader.readAsDataURL(fichero); // Leerlo en base64
      reader.addEventListener('load', e => { 
        // Visualizamos la imagen en un <img> en el HTML
        nuevaImagen.src = reader.result; 
        imgBase64 = reader.result;
      }); 
    }
  }
  urlImagen = imgBase64; 
  //urlImagen = URL.createObjectURL(inputImagen.files[0]); 
  let imagenValida = urlImagen != "";
  //nuevaImagen.src = urlImagen;
  if (!imagenValida) {
    inputImagen.style.border = "3px solid red";
  } else {
    inputImagen.style.border = "3px solid green";
  }
  return imagenValida; 
} 

//Guarda los datos en eventos.json
function guardar(){
  let nuevaFiesta = {"Nombre":nombre.value,"Fecha":fechaFormateada,"Descripcion":descripcion.value,"Precio":precio.value,"Imagen":urlImagen};
  listaEventos.push(nuevaFiesta);
  datos = JSON.stringify(listaEventos);
  console.log(listaEventos.length);
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
}

//Recupera los datos de eventos.json
function recuperar(){  
    ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
         // Si todo esta bien
        if (this.readyState == 4 && this.status == 200) {
            /* if(object!= null || object != undefined){ */  
              object = JSON.parse(this.responseText);
              listaEventos.push(...object);
              console.log(listaEventos.length);
            //} 
            console.log ("Datos parseados: ");
            console.log (object);
            console.log(this.responseText); 
            console.log("_______________________");  
        }            
    };
    ajax.open("GET","eventos.json",true);
    ajax.setRequestHeader("Content-type","application/json");
    ajax.send();
}



