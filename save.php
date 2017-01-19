<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
error_reporting(-1);

$coreFolderName = "practice";
$maxFolderNum = 50;

$folderName = "";

for($i = 0; $i < $maxFolderNum; $i++){
    $checkFolderName = "data/" . $coreFolderName . $i;

    if(!file_exists($checkFolderName)) {
        $folderName = $checkFolderName;
        break;
    }
}

$oldmask = umask(0);
mkdir($folderName, 0755, true);
umask($oldmask);


// transcription
$transcript = $_POST["posttext"];
$transcriptPath = $folderName . '/transcription.json';

$transcriptJSON = fopen($transcriptPath, 'w');
fwrite($transcriptJSON, json_encode($transcript));
fclose($transcriptJSON);
chmod($transcriptPath, 0644);


// volume
$volume = $_POST['postvolume'];
$volumePath = $folderName . '/volume.json';

$volumeDecoded = json_decode($volume, true);

$volumeJSON = fopen($volumePath, 'w');
fwrite($volumeJSON, json_encode($volumeDecoded));
fclose($volumeJSON);
chmod($volumePath, 0644);


// pitch
$pitch = $_POST["postpitch"];
$pitchPath = $folderName . '/pitch.json';

$pitchDecoded = json_decode($pitch, true);

$pitchJSON = fopen($pitchPath, 'w');
fwrite($pitchJSON, json_encode($pitchDecoded));
fclose($pitchJSON);
chmod($pitchPath, 0644);


// emotion
$emotion = $_POST['postemotion'];
$emotionPath = $folderName . '/emotion.json';

$emotionDecoded = json_decode($emotion, true);

$emotionJSON = fopen($emotionPath, 'w');
fwrite($emotionJSON, json_encode($emotionDecoded));
fclose($emotionJSON);
chmod($emotionPath, 0644);


// face direction
$direction = $_POST['postdirection'];
$directionPath = $folderName . '/direction.json';

$directionDecoded = json_decode($direction, true);

$directionJSON = fopen($directionPath, 'w');
fwrite($directionJSON, json_encode($directionDecoded));
fclose($directionJSON);
chmod($directionPath, 0644);

// update overview

$ov = $_POST['postoverview'];
$dStr = json_decode($ov, true);
$overviewPath = 'data/overview.json';

$newOverview = $dStr[0];

$jsonString = file_get_contents($overviewPath);
$data = json_decode($jsonString, true);

$newdata = $newOverview;
if($newdata != null){
    array_push($data, $newdata);
}
$newJsonString = json_encode($data);
file_put_contents($overviewPath, $newJsonString);

?>
