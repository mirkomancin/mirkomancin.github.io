<?php
$myFile = "sensed_data.txt";
$fh = fopen($myFile, 'a') or die("can't open file");
$stringData = $_GET['msg'];
fwrite($fh, $stringData);
fclose($fh);
?>