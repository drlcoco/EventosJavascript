<?php 
//Capturamos el datos que viene del formulario con $_POST de php.
$contenido = file_get_contents('php://input');
$f = fopen('eventos.json', 'w+b');
fwrite($f,$contenido);
fclose($f);
?>