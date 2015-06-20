<?php
ini_set("display_errors", 1);
require_once ("../lib/php/util.php");
header('Content-type: application/json');

$m2mConnect = new M2MConnect();

if ($_SERVER['REQUEST_METHOD'] == "GET") {

	if (isset($_GET['q'])) {

		$req = $_GET['q'];
		
		if ($req == 'ins') {
			if(isset($_GET['d']))
			$response = $m2mConnect -> addNewLog(stripslashes($_GET['d']));
			echo $response;
		} 
		
		
		//LOGS				
		else if ($req == 'all_logs') {
			if (isset($_GET['deviceId'])) {
				$deviceId = $_GET['deviceId'];
				$response = $m2mConnect -> getAllSensedData4DeviceId($deviceId);
			} else
				$response = json_encode(array('status' => "404", 'msg' => "Request Params Error !"));
		} else if ($req == 'last_log') {
			if (isset($_GET['deviceId'])) {
				$deviceId = $_GET['deviceId'];
				$response = $m2mConnect -> getLastSensedData4DeviceId($deviceId);
			} else
				$response = json_encode(array('status' => "404", 'msg' => "Request Params Error !"));
				
		}
		else if ($req == 'devices_zone') {
			if (isset($_GET['zone'])) {
				$zone = $_GET['zone'];	
				$response = $m2mConnect -> getDevicesOfZone($zone);
			}else	
				$response = json_encode(array('status' => "404", 'msg' => "Request Params Error !"));					
		}
		else if ($req == 'latest_log') {
			if (isset($_GET['deviceId'])) {
				$deviceId = $_GET['deviceId'];
				$response = $m2mConnect -> getLatestSensedData4DeviceId($deviceId);
			} else
				$response = json_encode(array('status' => "404", 'msg' => "Request Params Error !"));
		}
		else if ($req == 'deviceInfo') {
			if (isset($_GET['idDevice'])) {
				$idDevice = $_GET['idDevice'];
				$response = $m2mConnect -> getDeviceInfoWithId($idDevice);
			} else
				$response = json_encode(array('status' => "404", 'msg' => "Request Params Error !"));
		}	
		else if ($req == 'location') {
				$response = $m2mConnect -> getLocations();			
		}
		else if ($req == 'locationInfo') {
			if (isset($_GET['idLocation'])) {
				$locationId = $_GET['idLocation'];
				$response = $m2mConnect -> getLocationInfoWithId($locationId);
			} else
				$response = json_encode(array('status' => "404", 'msg' => "Request Params Error !"));
		}
				
				
		else
			$response = json_encode(array('status' => "404", 'msg' => "Command not found !"));

	} else
		$response = json_encode(array('status' => "404", 'msg' => "URL parameters ERROR !"));

	echo $response;
	
} else { //POST

	$data = @file_get_contents('php://input');
	
	if (isset($data)){
		if(isset($_GET['q'])){
			$req = $_GET['q'];
			
			if($req == "new_log"){	
				$response = $m2mConnect -> addNewLog(stripslashes($data));
				echo $response;
			}			
			else{
				$response = array('status' => "404", 'msg' => "BAD REQUEST!");
			}
		}		
	}
	else
		$response = array('status' => "404", 'msg' => "POST parameter ERROR !");

	echo json_encode($response);
}
?>