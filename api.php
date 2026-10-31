<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

// devuelve las líneas de texto de la descripción de un item del rss de koha
// soporta el formato actual (html como elementos xml reales) y el anterior (html escapado o cdata)
function lineasDeDescripcion(SimpleXMLElement $desc) {
    if (isset($desc->p[0])) {
        // formato actual: el primer <p> trae los datos del libro y el segundo el link de reserva
        $html = $desc->p[0]->asXML();
    } elseif (count($desc->children()) > 0) {
        // trae otras etiquetas xml reales: usa toda la descripción
        $html = $desc->asXML();
    } else {
        // formato anterior: el html viene como texto (escapado o en cdata) dentro de la descripción
        $html = (string)$desc;
    }

    // une los espacios y saltos de formato, y convierte cada <br/> en un salto de línea real
    $html  = preg_replace('/\s+/u', ' ', $html);
    $html  = preg_replace('#<br\s*/?>#i', "\n", $html);
    $texto = html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8');

    $lineas = [];
    foreach (explode("\n", $texto) as $linea) {
        $linea = trim($linea);
        if ($linea !== '') {
            $lineas[] = $linea;
        }
    }
    return $lineas;
}

$query = isset($_GET['q']) ? trim($_GET['q']) : '';

if (empty($query)) {
    echo json_encode(["status" => "error", "message" => "Término vacío", "libros" => []], JSON_UNESCAPED_UNICODE);
    exit;
}

$koha_url = "https://biblioteca.unm.edu.ar/cgi-bin/koha/opac-search.pl?q=" . urlencode($query) . "&format=rss";

// usa curl en lugar de file_get_contents
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $koha_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");

$respuesta = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($respuesta === false || $http_code !== 200) {
    echo json_encode(["status" => "error", "message" => "El hosting bloquea la conexión externa o la UNM no responde", "libros" => []], JSON_UNESCAPED_UNICODE);
    exit;
}

libxml_use_internal_errors(true);
$xml = simplexml_load_string($respuesta);

if ($xml === false) {
    echo json_encode(["status" => "error", "message" => "Error al procesar el catálogo", "libros" => []], JSON_UNESCAPED_UNICODE);
    exit;
}

$libros = [];
if (isset($xml->channel->item)) {
    foreach ($xml->channel->item as $item) {
        $link = (string)$item->link;
        $biblioId = '';
        if (preg_match('/biblionumber=(\d+)/', $link, $matches)) {
            $biblioId = $matches[1];
        }

        $dc = $item->children('http://purl.org/dc/elements/1.1/');
        $autor = isset($dc->creator) ? (string)$dc->creator : (string)$item->author;

        // lee la descripción como líneas (editorial y año, descripción física, isbn, etc.)
        $lineas = lineasDeDescripcion($item->description);

        // toma como publicación la primera línea que contiene un año
        $publicacion = '';
        foreach ($lineas as $linea) {
            if (preg_match('/\b(1[5-9]\d{2}|20\d{2})\b/', $linea)) {
                $publicacion = $linea;
                break;
            }
        }

        $libros[] = [
            "id"          => $biblioId,
            "titulo"      => rtrim(trim((string)$item->title), " /"), // quita la barra final del formato isbd
            "autor"       => !empty($autor) ? $autor : "Sin autor",
            "descripcion" => implode(" · ", $lineas),
            "publicacion" => $publicacion,
            "reserva_url" => "https://biblioteca.unm.edu.ar/cgi-bin/koha/opac-reserve.pl?biblionumber=" . $biblioId
        ];
    }
}

echo json_encode([
    "status" => "success",
    "total"  => count($libros),
    "libros" => $libros
], JSON_UNESCAPED_UNICODE);