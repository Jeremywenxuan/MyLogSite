<?php
$folder = isset($_GET['folder']) ? $_GET['folder'] : 'Doc';
$markdownFiles = glob("$folder/*.md");

$items = array_map(function($file) use ($folder) {
    $filename = basename($file);
    $title = str_replace('_', ' ', pathinfo($filename, PATHINFO_FILENAME));
    return [
        'title' => ucwords($title),
        'file' => $filename
    ];
}, $markdownFiles);

header('Content-Type: application/json');
echo json_encode($items);
