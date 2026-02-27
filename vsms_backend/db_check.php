<?php
$conn = new mysqli("127.0.0.1", "root", "", "rbs_vsms");
$res = $conn->query("SELECT id, make, model FROM vehicles");
$out = "";
while ($row = $res->fetch_assoc()) {
    $out .= $row['id'] . " - " . $row['make'] . " " . $row['model'] . PHP_EOL;
}
file_put_contents("vehicles_list.txt", $out);
