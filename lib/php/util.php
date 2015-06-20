<?php
require_once ("config.php");
require_once ("mysql_to_json.class.php");

/* server timezone */
define('CONST_SERVER_TIMEZONE', 'UTC');
 
/* server dateformat */
define('CONST_SERVER_DATEFORMAT', 'Y-m-d H:i:s');


class M2MConnect {

	public $connect;

	/*##################### COSTRUCTOR #################################*/
	function __construct() {
		$this -> connect = mysqli_connect($GLOBALS['db_host'], $GLOBALS['user'], $GLOBALS['pwd'], $GLOBALS['db_name']);
	}

/*
    function addNewLog($rawData) {
    	
		//ID:N0,t1,h1,t2,h2,v,lx,rpm,pp,m,st1,st2:N1......
		$array = explode(':',$rawData);
		
		$ID = $array[0];
		//echo $ID;
		//ZANZARINO
		if($ID == "013227005465715"){
				$temp = count($array)-2;
				$counter = 0;
				for ($i = 1; $i < count($array); $i++) {
						
					$sense = explode(',',$array[$i]);
					
		    		$N = $sense[0];
					$tempDevice = $sense[1];
					$humDevice = $sense[2];
					$temp1 = $sense[3];
					$hum1 = $sense[4];
					$volt = $sense[5];
					$lux = $sense[6];
					$RPMTops = $sense[7];			
					$pp_count = $sense[8];
					$pH = $sense[9];
					$soilTemp1 = $sense[10];
					$soilTemp2 = $sense[11];	
					$remoteTemp	= $sense[12];	
					$remotePresence = $sense[13];
					$remoteVolt = $sense[14];
					
					$rawJSON = "{\"mac\":\"". $ID ."\",\"N\":\"". $N ."\",\"tempDevice\":\"". $tempDevice ."\",\"humDevice\":\"". $humDevice ."\",\"temp1\":\"". $temp1 ."\",\"hum1\":\"". $hum1 ."\",\"lux\":\"". $lux ."\",\"battery\":\"". $volt ."\",\"rpm\":\"". $RPMTops ."\",\"pp_count\":\"". $pp_count ."\",\"pH\":\"". $pH ."\",\"soilTemp1\":\"". $soilTemp1 ."\",\"soilTemp2\":\"". $soilTemp2 ."\",\"remoteTemp\":\"". $remoteTemp ."\",\"remotePresence\":\"". $remotePresence ."\",\"remoteVolt\":\"". $remoteVolt ."\"}";
				
					//echo $rawJSON;
				
					$inputObj = json_decode($rawJSON);
					$response = null;
			    
			    	if (!is_array($inputObj) && isset($inputObj -> mac)) {
			
						$mac = $inputObj -> mac;
						$batteryLevel = $volt;
			
						$md5Input = $mac . $GLOBALS['data_checksum_secret'];
						$checksum = md5($md5Input);
			
						$deviceId = $this -> getDeviceIdByMacAddress($mac);
						
						$time = date('Y-m-d H:i:s');
						$date = new DateTime($time);
						
						//ora legale
						//$date->add(new DateInterval('PT2H'));
						//$date->add(new DateInterval('PT1H'));
						
						$date->sub(new DateInterval('PT'.($temp*15).'M'));
						$temp--;
										
						$time = $date->format('Y-m-d H:i');
						
						$query = "INSERT INTO  `sensedData` (`idSensedData` ,`deviceMacAddress` ,`timestamp` ,`payload`) VALUES (NULL ,  '{$mac}', '{$time}' ,  '{$rawJSON}');";
						mysql_query($query);
			
						if (mysql_insert_id() > 0)
							$response = array('status' => "200", 'msg' => "Log Correctly Added () !");
						else
							$response = array('status' => "400", 'msg' => "Log data ERROR ! Insert not completed !");
			
						$deviceId = $this -> getDeviceIdByMacAddress($mac);
						$this -> updateBatteryLevelForDevice($deviceId, $batteryLevel);
						
					}
					else
					{
						$response = array('status' => "404", 'msg' => "POST Arguments ERROR !");			
					}
				 
								
				}	
		}
		//ZECCHINO
		else if($ID == "013226003537905"){
				$temp = count($array)-2;
				$counter = 0;
				for ($i = 1; $i < count($array); $i++) {
						
					$sense = explode(',',$array[$i]);
					
		    		$N = $sense[0];
					$tempDevice = $sense[1];
					$humDevice = $sense[2];
					$temp1 = $sense[3];
					$hum1 = $sense[4];
					$volt = $sense[5];
					$lux = $sense[6];
					$RPMTops = $sense[7];			
					$pp_count = $sense[8];
					$moisture = $sense[9];
					$soilTemp1 = $sense[10];
					$soilTemp2 = $sense[11];	
							
					
					$rawJSON = "{\"mac\":\"". $ID ."\",\"N\":\"". $N ."\",\"tempDevice\":\"". $tempDevice ."\",\"humDevice\":\"". $humDevice ."\",\"temp1\":\"". $temp1 ."\",\"hum1\":\"". $hum1 ."\",\"lux\":\"". $lux ."\",\"battery\":\"". $volt ."\",\"rpm\":\"". $RPMTops ."\",\"pp_count\":\"". $pp_count ."\",\"moisture\":\"". $moisture ."\",\"soilTemp1\":\"". $soilTemp1 ."\",\"soilTemp2\":\"". $soilTemp2 ."\"}";
				
					//echo $rawJSON;
				
					$inputObj = json_decode($rawJSON);
					$response = null;
			    
			    	if (!is_array($inputObj) && isset($inputObj -> mac)) {
			
						$mac = $inputObj -> mac;
						$batteryLevel = $volt;
			
						$md5Input = $mac . $GLOBALS['data_checksum_secret'];
						$checksum = md5($md5Input);
			
						$deviceId = $this -> getDeviceIdByMacAddress($mac);
						
						$time = date('Y-m-d H:i:s');
						$date = new DateTime($time);
						
						//ora legale
						//$date->add(new DateInterval('PT2H'));
						//$date->add(new DateInterval('PT1H'));
						
						$date->sub(new DateInterval('PT'.($temp*15).'M'));
						$temp--;
										
						$time = $date->format('Y-m-d H:i');
						
						$query = "INSERT INTO  `sensedData` (`idSensedData` ,`deviceMacAddress` ,`timestamp` ,`payload`) VALUES (NULL ,  '{$mac}', '{$time}' ,  '{$rawJSON}');";
						mysql_query($query);
			
						if (mysql_insert_id() > 0)
							$response = array('status' => "200", 'msg' => "Log Correctly Added () !");
						else
							$response = array('status' => "400", 'msg' => "Log data ERROR ! Insert not completed !");
			
						$deviceId = $this -> getDeviceIdByMacAddress($mac);
						$this -> updateBatteryLevelForDevice($deviceId, $batteryLevel);
						
					}
					else
					{
						$response = array('status' => "404", 'msg' => "POST Arguments ERROR !");			
					}
				 
								
				}
		}
		//$respone = array('status' => "200", 'msg' => "POST Arguments ERROR !");
		//print_r($response);
		return json_encode($response);
	}
*/

	function getDeviceIdByMacAddress($macAddress) {

		$query = "SELECT device.idDevice FROM device, networkInterface WHERE networkInterface.device_idDevice = device.idDevice AND macAddress='{$macAddress}'";

		$result = mysql_query($query) or die(mysql_error());

		$id = -1;

		while ($row = mysql_fetch_array($result)) {
			$id = $row['idDevice'];
		}

		return $id;
	}

    function updateBatteryLevelForDevice($deviceId, $batteryLevel) {
		$query = "UPDATE device SET batteryLevel='$batteryLevel' WHERE idDevice=$deviceId";
		mysql_query($query);
	}

	
	function getLatestSensedData4DeviceId($deviceId) {
		
		//Get Device Info
		$deviceQuery = "SELECT * FROM device WHERE device.idDevice = {$deviceId}";
		$mtj = new mysql_to_json($deviceQuery, $this->connect);
		$deviceArray = $mtj -> getArray();
		
		$sensorTypeQuery = "SELECT * FROM sensorType WHERE device_idDevice = {$deviceId}";
		$mtj = new mysql_to_json($sensorTypeQuery, $this->connect);
		$sensorTypeArray = $mtj -> getArray();
			
		//$dataQuery = "SELECT sensedData.* FROM sensedData, networkInterface WHERE sensedData.deviceMacAddress=networkInterface.macAddress AND networkInterface.device_idDevice = {$deviceId} ORDER BY timestamp DESC LIMIT 0,80";
		$dataQuery = "SELECT * FROM (SELECT sensedData.* FROM sensedData, networkInterface WHERE sensedData.deviceMacAddress=networkInterface.macAddress AND networkInterface.device_idDevice = {$deviceId} ORDER BY `sensedData`.`timestamp` DESC LIMIT 80) as ttbl ORDER BY timestamp ASC";
		$mtj = new mysql_to_json($dataQuery, $this->connect);
		$dataArray = $mtj -> getArray();
		
		$result = array("device" => $deviceArray, "sensorTypes" => $sensorTypeArray, "data"=> $dataArray);

		return json_encode($result);	
		
	}
	
	function getLastSensedData4DeviceId($deviceId) {
		$query = "SELECT sensedData.* FROM sensedData, networkInterface WHERE sensedData.deviceMacAddress=networkInterface.macAddress AND networkInterface.device_idDevice = {$deviceId} ORDER BY timestamp DESC LIMIT 1";
		$mtj = new mysql_to_json($query, $this->connect);
		return $mtj -> get_json();
	}
	
	/*
	function getLatestSensedData4DeviceId($deviceId) {
		$query = "SELECT sensedData.* FROM sensedData, networkInterface WHERE sensedData.deviceMacAddress=networkInterface.macAddress AND networkInterface.device_idDevice = {$deviceId} ORDER BY timestamp ASC LIMIT 0,80";
		$mtj = new mysql_to_json($query);
		return $mtj -> get_json();
	}*/
	
		
	function getDevicesOfZone($m2mLocationId) {
		$query = "SELECT device.* FROM device WHERE m2mLocation_idLocation={$m2mLocationId}";
		$mtj = new mysql_to_json($query, $this->connect);
		return $mtj -> getArray();
	}
	/*
	function getDevicesOfZone($zone){
		$devicesQuery = "SELECT device.*,deviceType.*,networkInterface.macAddress FROM device, deviceType, networkInterface WHERE device.idDevice = networkInterface.device_idDevice AND device.idType = deviceType.idType AND device.id_zone = {$zone}";	
		$mtj = new mysql_to_json($devicesQuery);
		$deviceArray = $mtj -> getArray();
		
		return json_encode($deviceArray);
	}*/
	
	function getLocations(){
		$devicesQuery = "SELECT * FROM m2mLocation";	
		$mtj = new mysql_to_json($devicesQuery, $this->connect);
		$deviceArray = $mtj -> getArray();
		
		return json_encode($deviceArray);
	}

	function getLocationInfoWithId($idLocation) {

		$query = "SELECT * FROM m2mLocation WHERE idLocation={$idLocation}";

		$result = mysqli_query($this->connect,$query);

		$resultLocation = null;

		while ($row = mysqli_fetch_assoc($result)) {
			$resultLocation = array("location" => array("idLocation" => $row['idLocation'], "name" => $row['name'], "lat" => $row['lat'], "lng" => $row['lng'], "alt" => $row['alt'], "nasID" => $row['nasID'], "ssid" => $row['ssid'], "ownerName" => $row['ownerName'], "note" => $row['note']), "devices" => $this -> getArrayDevicesForLocationId($row['idLocation']));
		}

		return json_encode($resultLocation);
	}
	
	function getArrayDevicesForLocationId($m2mLocationId) {
		$query = "SELECT device.* FROM device WHERE m2mLocation_idLocation={$m2mLocationId}";
		$mtj = new mysql_to_json($query, $this->connect);
		return $mtj -> getArray();
	}
	
    function getDeviceInfoWithId($idDevice) {

		//Get Device Info
		$deviceQuery = "SELECT * FROM device WHERE device.idDevice = {$idDevice}";
		$mtj = new mysql_to_json($deviceQuery, $this->connect);
		$deviceArray = $mtj -> getArray();
		
		$sensorTypeQuery = "SELECT * FROM sensorType WHERE device_idDevice = {$idDevice}";
		$mtj = new mysql_to_json($sensorTypeQuery, $this->connect);
		$sensorTypeArray = $mtj -> getArray();

		$resultLocation = array("device" => $deviceArray, "sensorTypes" => $sensorTypeArray);

		return json_encode($resultLocation);
	}
	/*	
	function getDeviceInfoWithId($idDevice) {
		$deviceQuery = "SELECT * FROM device, device_type, network_interface WHERE device.id_device = network_interface.id_device AND device.id_type = device_type.id_type AND device.id_device = {$idDevice}";
		$mtj = new mysql_to_json($deviceQuery);
		$deviceArray = $mtj -> getArray(); 	 
		
		return json_encode($deviceArray);
		 
	}*/
	
	
	function getBatteryLevelForDevice($deviceId) {
		$query = "SELECT batteryLevel FROM device WHERE idDevice={$deviceId}";
		$mtj = new mysql_to_json($query, $this->connect);
		//echo $mtj -> get_json();
		//while ($row = mysql_fetch_array($result)) {
		//	$level = $row['batteryLevel'];
		//}
		
		return $mtj -> get_json();
	}

	
	
		
	/////////// LOGIN MANAGEMENT ////////////////
	/*
	 Validate Logged User using Php session
	 */
	function validateUser($nickname, $idUser) {
		setcookie("valid", 1, time() + 3600);
		setcookie("nickname", $nickname, time() + 3600);
		setcookie("idUser", $idUser, time() + 3600);
	}

	/*
	 Return ID of Logged User
	 */
	function getIdLoggedUser() {
		//return $_SESSION['idUser'];
		return $_COOKIE['idUser'];
	}

	/*
	 Return nickname of Logged User
	 */
	function getNickLoggedUser() {
		//return $_SESSION['nickname'];
		return $_COOKIE['nickname'];
	}

	/*
	 Check if the user
	 */
	function isLoggedIn() {
		if (isset($_COOKIE['valid']) == "1")
			return true;
		else
			return false;
	}

	/*
	 Logout user
	 */
	function logout() {
		setcookie("valid", "", time() - 3600);
		setcookie("nickname", "", time() - 3600);
		setcookie("idUser", "", time() - 3600);
	}

}
?>