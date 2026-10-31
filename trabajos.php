<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$archivo = dirname($_SERVER['DOCUMENT_ROOT']) . '/unm_trabajos.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo file_exists($archivo) ? file_get_contents($archivo) : '{}';
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

$datos = json_decode(file_get_contents('php://input'), true);

if (
    !is_array($datos) ||
    !isset($datos['carrera'], $datos['trabajos']) ||
    !is_string($datos['carrera']) ||
    !is_array($datos['trabajos'])
) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos inválidos']);
    exit;
}

$fp = fopen($archivo, 'c+');

if (!$fp || !flock($fp, LOCK_EX)) {
    http_response_code(500);
    echo json_encode(['error' => 'No se pudo guardar']);
    exit;
}

$actuales = json_decode(stream_get_contents($fp), true);
if (!is_array($actuales)) $actuales = [];

$actuales[$datos['carrera']] = $datos['trabajos'];

rewind($fp);
ftruncate($fp, 0);
$guardado = fwrite(
    $fp,
    json_encode($actuales, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
);

fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);

if ($guardado === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al escribir']);
    exit;
}

echo json_encode(['ok' => true]);