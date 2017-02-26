<?php
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);
$out= new stdClass();
$log ="\n\r".date("Y-m-d h:i:s")."\n\r";
//$log .= file_get_contents('php://input');
//$log .= shell_exec('git fetch 2>&1');
//sleep(5);
//$log .= shell_exec('git reset --hard origin/master 2>&1');
//$log .= shell_exec('git reset --hard HEAD 2>&1');
//sleep(2);
$log .= "end pull";
$log .=  shell_exec('git pull 2>&1');
$out->log = $log;
header('Content-Type: application/json');
echo json_encode($out);
error_log($log, 3, "pull.log");
?>