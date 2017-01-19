<?php
ini_set( 'display_errors', 1 );

$coreFolderName2 = "practice";
$maxFolderNum2 = 50;

$folderName2 = "";

for($j = 0; $j < $maxFolderNum2; $j++){
    $checkFolderName2 = "data/" . $coreFolderName2 . $j;
    $oldNum2 = $j - 1;

    if(!file_exists($checkFolderName2)) {
        $folderName2 = "data/" . $coreFolderName2 . $oldNum2;
        break;
    }
}

foreach(array('video', 'audio') as $type) {
    if (isset($_FILES["${type}-blob"])) {
        $fileName = $_POST["${type}-filename"];
        $uploadDirectory = $folderName2 . "/" . $fileName;

        if (!move_uploaded_file($_FILES["${type}-blob"]["tmp_name"], $uploadDirectory)) {
            echo(" problem moving uploaded file");
        }
        chmod($uploadDirectory, 0644);
    }
}

?>