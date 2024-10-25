<?php
$imageDir = 'images/';  // 改为相对路径
$allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

$images = array_filter(scandir($imageDir), function($file) use ($allowedExtensions) {
    $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    return in_array($extension, $allowedExtensions);
});

header('Content-Type: application/json');
echo json_encode(array_values($images));
