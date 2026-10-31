<?php
// donacion.php

// 1. Verificamos que los datos vengan del formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 2. Recolectamos la información
    $titulo  = $_POST['titulo'] ?? 'Sin título';
    $autor   = $_POST['autor'] ?? 'Sin autor';
    $anio    = $_POST['anio'] ?? 'Sin año';
    $edicion = $_POST['edicion'] ?? 'Sin edición';
    $estado  = $_POST['estado'] ?? 'No especificado';
    
    // 3. Manejo de la foto subida
    $mensaje_foto = "El usuario no adjuntó ninguna fotografía.";
    
    // Verificamos si se subió un archivo y si no hubo errores
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
        $carpeta_destino = 'uploads/';
        
        // Si la carpeta uploads no existe, la creamos
        if (!file_exists($carpeta_destino)) {
            mkdir($carpeta_destino, 0777, true);
        }
        
        // Le ponemos un número único adelante para que no se pisen fotos con el mismo nombre
        $nombre_archivo = time() . "_" . basename($_FILES['foto']['name']);
        $ruta_final = $carpeta_destino . $nombre_archivo;
        
        // Movemos el archivo temporal a nuestra carpeta
        if (move_uploaded_file($_FILES['foto']['tmp_name'], $ruta_final)) {
            $mensaje_foto = "El usuario adjuntó una foto. Se guardó en el servidor como: $nombre_archivo";
        }
    }

    // 4. Preparamos el Mail
    $destinatario = "biblioteca@unm.edu.ar";
    $asunto       = "Nueva propuesta de donacion: $titulo";
    
    $cuerpo_mail  = "Has recibido una nueva propuesta de donación de material.\n\n";
    $cuerpo_mail .= "-------------------------------------------\n";
    $cuerpo_mail .= "Libro: $titulo\n";
    $cuerpo_mail .= "Autor/Editorial: $autor\n";
    $cuerpo_mail .= "Año: $anio\n";
    $cuerpo_mail .= "Edición: $edicion\n";
    $cuerpo_mail .= "Estado físico: $estado\n";
    $cuerpo_mail .= "-------------------------------------------\n\n";
    $cuerpo_mail .= $mensaje_foto;

    // Intentamos enviar el correo
    $headers = "From: sistema@biblioteca-unm.local\r\n";
    @mail($destinatario, $asunto, $cuerpo_mail, $headers);

    // 5. Le mostramos un mensaje de éxito al usuario
    echo "<!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <title>Propuesta Enviada</title>
        <style>
            body { font-family: 'Lato', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f8f9fa; }
            .mensaje { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
            h2 { color: #059669; margin-top: 0; }
            a { display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #1885AC; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class='mensaje'>
            <h2>¡Gracias por tu propuesta!</h2>
            <p>Hemos registrado tu intención de donar <strong>$titulo</strong>.</p>
            <p style='font-size: 0.9em; color: #6c757d;'>Los datos fueron enviados a $destinatario.</p>
            <a href='index.html'>Volver a la biblioteca</a>
        </div>
    </body>
    </html>";
    
} else {
    // Si alguien entra a donacion.php directo sin pasar por el formulario, lo devolvemos al inicio
    header("Location: index.html");
}
?>