<?php
require_once ("config.php");
require_once ("mysql_to_json.class.php");

class M2MConnect {

	public $connect;

	/*##################### COSTRUCTOR #################################*/
	function __construct() {
		$this -> connect = mysql_connect($GLOBALS['db_host'], $GLOBALS['user'], $GLOBALS['pwd']);
		$db_selected = mysql_select_db($GLOBALS['db_name'], $this -> connect);
	}


	function addNewLog($rawData) {
		
		
		$myFile = "sensed_data.txt";
		$fh = fopen($myFile, 'a') or die("can't open file");
		$stringData = $rawData . "\n";
		fwrite($fh, $stringData);
		fclose($fh);
		
		$inputObj = json_decode($rawData);
		
		$response = null;

		if (!is_array($inputObj) && isset($inputObj -> from)) {

			$mac = $inputObj -> from;
			//$timestamp = $inputObj -> timestamp;
			if(isset($inputObj->battery))
				$batteryLevel = $inputObj->battery;
			else{
				$batteryLevel = 100;
			}

			$md5Input = $mac . $GLOBALS['data_checksum_secret'];// . $timestamp;
			$checksum = md5($md5Input);

			$deviceId = $this -> getDeviceIdByMacAddress($mac);

			//$deviceConfiguration = $this -> getArrayDeviceConfiguration($deviceId);

			$query = "INSERT INTO  `sensed_data` (`id_sensed_data` ,`device_mac_address` ,`timestamp` ,`payload`) VALUES (NULL ,  '{$mac}', CURRENT_TIMESTAMP ,  '{$rawData}');";
			mysql_query($query);
			
			echo $query;

			if (mysql_insert_id() > 0)
				$response = array('status' => "200", 'msg' => "Log Correctly Added () !");//,"cfg" => array("updatePeriod"=>$deviceConfiguration['updatePeriod']));
			else
				$response = array('status' => "400", 'msg' => "Log data ERROR ! Insert not completed !");

			
		return $response;
		}
	}

	
	function getLastSensedData4DeviceId($deviceId) { 
		
		//Get Device Info
		$deviceQuery = "SELECT * FROM device WHERE device.id_device = {$deviceId}";
		//echo $deviceQuery . "\n";
		$mtj = new mysql_to_json($deviceQuery);
		$deviceArray = $mtj -> getArray();
		
		$sensorTypeQuery = "SELECT device_type.* FROM device_type, device WHERE device.id_type=device_type.id_type AND device.id_device = {$deviceId}";
		//echo $sensorTypeQuery . "\n";
		$mtj = new mysql_to_json($sensorTypeQuery);
		$sensorTypeArray = $mtj -> getArray();
			
		$dataQuery = "SELECT * FROM (SELECT sensed_data.* FROM sensed_data, network_interface WHERE sensed_data.device_mac_address=network_interface.mac_address AND network_interface.id_device = {$deviceId} ORDER BY timestamp DESC LIMIT 1) as ttbl ORDER BY timestamp ASC";
		//echo $dataQuery . "\n";
		$mtj = new mysql_to_json($dataQuery);
		$dataArray = $mtj -> getArray();
		
		//echo $dataQuery;
		
		$result = array("device" => $deviceArray, "sensorTypes" => $sensorTypeArray, "data"=> $dataArray);

		return json_encode($result);
		
	}
	
	
	function getLatestSensedData4DeviceId($deviceId) { 
		
		//Get Device Info
		$deviceQuery = "SELECT * FROM device WHERE device.id_device = {$deviceId}";
		//echo $deviceQuery . "\n";
		$mtj = new mysql_to_json($deviceQuery);
		$deviceArray = $mtj -> getArray();
		
		$sensorTypeQuery = "SELECT device_type.* FROM device_type, device WHERE device.id_type=device_type.id_type AND device.id_device = {$deviceId}";
		//echo $sensorTypeQuery . "\n";
		$mtj = new mysql_to_json($sensorTypeQuery);
		$sensorTypeArray = $mtj -> getArray();
			
		$dataQuery = "SELECT * FROM (SELECT sensed_data.* FROM sensed_data, network_interface WHERE sensed_data.device_mac_address=network_interface.mac_address AND network_interface.id_device = {$deviceId} ORDER BY timestamp DESC LIMIT 80) as ttbl ORDER BY timestamp ASC";
		//echo $dataQuery . "\n";
		$mtj = new mysql_to_json($dataQuery);
		$dataArray = $mtj -> getArray();
		
		//echo $dataQuery;
		
		$result = array("device" => $deviceArray, "sensorTypes" => $sensorTypeArray, "data"=> $dataArray);

		return json_encode($result);
		
	}


	
	
	
	function getDevicesOfZone($zone){
		$devicesQuery = "SELECT device.*,device_type.*,network_interface.mac_address FROM device, device_type, network_interface WHERE device.id_device = network_interface.id_device AND device.id_type = device_type.id_type AND device.id_zone = {$zone}";	
		$mtj = new mysql_to_json($devicesQuery);
		$deviceArray = $mtj -> getArray();
		
		return json_encode($deviceArray);
	}
	
	function getLocations(){
		$devicesQuery = "SELECT * FROM zone";	
		$mtj = new mysql_to_json($devicesQuery);
		$deviceArray = $mtj -> getArray();
		
		return json_encode($deviceArray);
	}
	
	function getDeviceInfoWithId($idDevice) {

		//Get Device Info
		/*
		$deviceQuery = "SELECT * FROM device WHERE id_device = {$idDevice}";
		$mtj = new mysql_to_json($deviceQuery);
		$deviceArray = $mtj -> getArray();
		
		$sensorTypeQuery = "SELECT device_type.* FROM device_type,device WHERE device.id_type=device_type.id_type AND id_device = {$idDevice}";
		$mtj = new mysql_to_json($sensorTypeQuery);
		$sensorTypeArray = $mtj -> getArray();

		$resultLocation = array("device" => $deviceArray, "sensorTypes" => $sensorTypeArray);

		return json_encode($resultLocation);
		*/
		
		$deviceQuery = "SELECT * FROM device, device_type, network_interface WHERE device.id_device = network_interface.id_device AND device.id_type = device_type.id_type AND device.id_device = {$idDevice}";
		$mtj = new mysql_to_json($deviceQuery);
		$deviceArray = $mtj -> getArray(); 	 
		
		return json_encode($deviceArray);
		 
	}
	
	function getDeviceActuatorWithId($idDevice) {

		//Get Device Info
		$deviceQuery = "SELECT * FROM device WHERE device.idDevice = {$idDevice}";
		$mtj = new mysql_to_json($deviceQuery);
		$deviceArray = $mtj -> getArray();
		
		$sensorTypeQuery = "SELECT * FROM actuatorType WHERE idDevice = {$idDevice}";
		$mtj = new mysql_to_json($sensorTypeQuery);
		$sensorTypeArray = $mtj -> getArray();

		$resultLocation = array("device" => $deviceArray, "actuatorTypes" => $sensorTypeArray);

		return json_encode($resultLocation);
	}

	function getArrayDevicesForLocationId($m2mLocationId) {
		$query = "SELECT device.* FROM device WHERE m2mLocation_idLocation={$m2mLocationId}";
		$mtj = new mysql_to_json($query);
		return $mtj -> getArray();
	}

	function getJSONDevicesForLocationId($m2mLocationId) {
		$query = "SELECT device.* FROM device WHERE m2mLocation_idLocation={$m2mLocationId}";
		$mtj = new mysql_to_json($query);
		return $mtj -> get_json();
	}

	
	
	function getLastHourSensedData4DeviceId($deviceId) {
		
		//Get Device Info
		$deviceQuery = "SELECT * FROM device WHERE device.idDevice = {$deviceId}";
		$mtj = new mysql_to_json($deviceQuery);
		$deviceArray = $mtj -> getArray();
		
		$sensorTypeQuery = "SELECT * FROM sensorType WHERE device_idDevice = {$deviceId}";
		$mtj = new mysql_to_json($sensorTypeQuery);
		$sensorTypeArray = $mtj -> getArray();
			
		$dataQuery = "SELECT sensedData.* FROM sensedData, networkInterface WHERE sensedData.deviceMacAddress=networkInterface.macAddress AND networkInterface.device_idDevice = {$deviceId} AND sensedData.timestamp BETWEEN (NOW() - INTERVAL 4 HOUR) AND NOW() ORDER BY timestamp ASC";
		$mtj = new mysql_to_json($dataQuery);
		$dataArray = $mtj -> getArray();
		
		//echo $dataQuery;
		
		$result = array("device" => $deviceArray, "sensorTypes" => $sensorTypeArray, "data"=> $dataArray);

		return json_encode($result);	
		
	}
	
	function getLastMinutesSensedData4DeviceId($deviceId,$minutes) {
		$query = "SELECT sensedData.* FROM sensedData, networkInterface WHERE sensedData.deviceMacAddress=networkInterface.macAddress AND networkInterface.device_idDevice = {$deviceId} AND sensedData.timestamp BETWEEN (NOW() - INTERVAL {$minutes} MINUTE) AND NOW() ORDER BY timestamp ASC";
		$mtj = new mysql_to_json($query);
		return $mtj -> get_json();
	}
	
	
	function updateBatteryLevelForDevice($deviceId, $batteryLevel) {
		$query = "UPDATE device SET batteryLevel='$batteryLevel' WHERE idDevice=$deviceId";
		mysql_query($query);
	}
	
	function getBatteryLevelForDevice($deviceId) {
		$query = "SELECT batteryLevel FROM device WHERE idDevice={$deviceId}";
		$mtj = new mysql_to_json($query);
		//echo $mtj -> get_json();
		//while ($row = mysql_fetch_array($result)) {
		//	$level = $row['batteryLevel'];
		//}
		
		return $mtj -> get_json();
	}

	function getDeviceConfiguration($deviceId)
	{
		$query = "SELECT * FROM deviceConfiguration WHERE device_idDevice = {$deviceId}";
		$mtj = new mysql_to_json($query);
		return $mtj -> get_json();
	}
	
	function getArrayDeviceConfiguration($deviceId)
	{
		$query = "SELECT * FROM deviceConfiguration WHERE device_idDevice = {$deviceId}";
		$mtj = new mysql_to_json($query);
		$array = $mtj -> getArray();
		return $array[0];
	}

	function getDeviceIdByMacAddress($macAddress) {

		$query = "SELECT device.id_device FROM device, network_interface WHERE network_interface.id_device = device.id_device AND mac_address='{$macAddress}'";

		$result = mysql_query($query) or die(mysql_error());

		$id = -1;

		while ($row = mysql_fetch_array($result)) {
			$id = $row['id_device'];
		}

		return $id;
	}
	
	
	
	
	
	
	/*
	function getAllSensedData4DeviceId($deviceId) {
		$query = "SELECT sensed_data.* FROM sensed_data, network_interface WHERE sensed_data.device_mac_address=network_interface.mac_address AND network_interface.id_device = {$deviceId} ORDER BY timestamp ASC";
		//echo $query;
		
		$mtj = new mysql_to_json($query);
		return $mtj -> get_json();
	}

	function getLatestSensedData4DeviceId($deviceId) { 
		
		//Get Device Info
		$deviceQuery = "SELECT * FROM device WHERE device.id_device = {$deviceId}";
		echo $deviceQuery . "\n";
		$mtj = new mysql_to_json($deviceQuery);
		$deviceArray = $mtj -> getArray();
		
		$sensorTypeQuery = "SELECT * FROM device_type WHERE id_type = {$deviceId}";
		echo $sensorTypeQuery . "\n";
		$mtj = new mysql_to_json($sensorTypeQuery);
		$sensorTypeArray = $mtj -> getArray();
			
		$dataQuery = "SELECT * FROM (SELECT sensed_data.* FROM sensed_data, network_interface WHERE sensed_data.device_mac_address=network_interface.mac_address AND network_interface.id_device = {$deviceId} ORDER BY timestamp DESC LIMIT 80) as ttbl ORDER BY timestamp ASC";
		echo $dataQuery . "\n";
		$mtj = new mysql_to_json($dataQuery);
		$dataArray = $mtj -> getArray();
		
		//echo $dataQuery;
		
		$result = array("device" => $deviceArray, "sensorTypes" => $sensorTypeArray, "data"=> $dataArray);

		return json_encode($result);	
		
	}










	function sendMessageToPhone($deviceToken, $collapseKey, $messageText)  {
		$yourKey = 'AIzaSyA2bsWYZBSZqPukfp1mGdRwWd2djbrGuJA';
		   
	    $headers = array('Authorization:key=' . $yourKey);  
	    $data = array(  
	        'registration_id' => $deviceToken,  
	        //'message_id' => $collapseKey,  
	        'data.message' => $messageText);
	    
	    $ch = curl_init();  
	  
	    curl_setopt($ch, CURLOPT_URL, "https://android.googleapis.com/gcm/send");  
	    if ($headers)  
	        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);  
	    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);  
	    curl_setopt($ch, CURLOPT_POST, true);  
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  
	    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);  
	  
	    $response = curl_exec($ch);  
	    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);  
	    if (curl_errno($ch)) {  
	        //request failed  
	        return false;//probably you want to return false  
	    }  
	    if ($httpCode != 200) {  
	        //request failed  
	        return false;//probably you want to return false  
	    }  
	    curl_close($ch);  
		echo "<br>MESSAGE: ".$messageText."<br>";
	    return $response;  
	}
	
	function doHttpRequest($url, $headers, $params) {
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		if ($headers != null) {
			curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		}	
		if ($params != null && count($params) > 0) {
			$params_str = '';
			foreach ($params as $key => $value) {
				if (strlen($params_str) > 0) {
					$params_str .= '&';
				}
				$params_str .= urldecode($key) . '=' . urldecode($value);
			}
			curl_setopt($ch, CURLOPT_POST, count($params));
			curl_setopt($ch, CURLOPT_POSTFIELDS, $params_str);
		}	
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
		$result = curl_exec($ch);
		curl_close($ch);
		return $result;
	}

    function sendNotificationAtAll($messageText){    	
		$file = "../gcm/data/ids.txt";
		$lines = file($file);
		$message_id = uniqid();
		
		foreach($lines as $line_num => $line){			
			$this -> sendMessageToPhone($line, $message_id, $messageText);			
		}
    }
	
	function addBNRawData($type, $value)
	{
		$query = "INSERT INTO  `BNRawEvent` VALUES (NULL , 1, '{$type}',CURRENT_TIMESTAMP,{$value});";
		mysql_query($query);

		return mysql_insert_id();
	}

	
	function getLastAndroidData() {

		//Get Device Info
		$deviceQuery = "SELECT DISTINCT(payload), timestamp FROM `sensedData` WHERE payload LIKE '%PIR%' AND timestamp > NOW() - INTERVAL 15 MINUTE ORDER BY timestamp DESC LIMIT 1";
		$mtj = new mysql_to_json($deviceQuery);
		$pirArray = $mtj -> getArray();
		
		$sensorTypeQuery = "SELECT DISTINCT(payload), timestamp FROM `sensedData` WHERE payload LIKE '%RFID%' AND timestamp > NOW() - INTERVAL 15 MINUTE ORDER BY timestamp DESC LIMIT 1";
		$mtj = new mysql_to_json($sensorTypeQuery);
		$rfidArray = $mtj -> getArray();
		
		$sensorTypeQuery = "SELECT DISTINCT(payload), timestamp FROM `sensedData` WHERE payload LIKE '%temperature%' AND timestamp > NOW() - INTERVAL 15 MINUTE ORDER BY timestamp DESC LIMIT 1";
		$mtj = new mysql_to_json($sensorTypeQuery);
		$ambientArray = $mtj -> getArray();		

		$sensorTypeQuery = "SELECT DISTINCT(payload), timestamp FROM `sensedData` WHERE payload LIKE '%sound%' AND timestamp > NOW() - INTERVAL 15 MINUTE ORDER BY timestamp DESC LIMIT 1";
		$mtj = new mysql_to_json($sensorTypeQuery);
		$soundArray = $mtj -> getArray();		
		
		$locationList = array();

		$query = "SELECT t.* FROM `BNTopEvent` t INNER JOIN 
				  (
				    SELECT type, MAX(timestamp) as latest, value
				    FROM `BNTopEvent`  
				    GROUP BY type
				    ORDER BY latest DESC LIMIT 1
				  )  grouppedt ON t.type = grouppedt.type AND t.timestamp = grouppedt.latest AND t.timestamp > NOW() - INTERVAL 15 MINUTE";

		$mtj = new mysql_to_json($query);
		$statusArray = $mtj -> getArray();
		
		$resultLocation = array("ambientale" => $ambientArray, "PIR" => $pirArray, "RFID" => $rfidArray, "sound" => $soundArray, "status" => $statusArray);

		return json_encode($resultLocation);
	}
	
	function getLastBNTopData() {

		$locationList = array();

		$query = "SELECT t.* FROM `BNTopEvent` t INNER JOIN 
				  (
				    SELECT type, MAX(timestamp) as latest, value
				    FROM `BNTopEvent`  
				    GROUP BY type
				    ORDER BY latest DESC LIMIT 1
				  )  grouppedt ON t.type = grouppedt.type AND t.timestamp = grouppedt.latest AND t.timestamp > NOW() - INTERVAL 15 MINUTE";

		$mtj = new mysql_to_json($query);

		return $mtj -> get_json();
	}

	function getLastBNRawData() {

		$locationList = array();

		$query = "SELECT t.* FROM `BNRawEvent` t INNER JOIN 
				  (
				    SELECT type, MAX(timestamp) as latest, value
				    FROM `BNRawEvent`  
				    GROUP BY type
				  )  grouppedt ON t.type = grouppedt.type AND t.timestamp = grouppedt.latest AND t.timestamp > NOW() - INTERVAL 15 MINUTE";

		$mtj = new mysql_to_json($query);

		return $mtj -> get_json();
	}
	
	function setActuators($action){
		$fp = fsockopen("160.78.27.202", 8080, $errno, $errstr, 30);
		if (!$fp) {
    		echo "$errstr ($errno)<br />\n";
		} else {			
    		$out = "GET " . $action . " HTTP/1.0\r\n\r\n";
    		echo $out;   		
    		fwrite($fp, $out);
    		while (!feof($fp)) {
        		echo fgets($fp, 128);
    		}
    		fclose($fp);
		}					
	}
	
	function getAllM2MLocationsAndDevices() {

		$locationList = array();

		$query = "SELECT * FROM m2mLocation";

		$result = mysql_query($query);

		while ($row = mysql_fetch_assoc($result)) {
			array_push($locationList, array("location" => array("idLocation" => $row['idLocation'], "name" => $row['name'], "lat" => $row['lat'], "lng" => $row['lng'], "alt" => $row['alt'], "nasID" => $row['nasID'], "ssid" => $row['ssid'], "ownerName" => $row['ownerName'], "note" => $row['note']), "devices" => $this -> getArrayDevicesForLocationId($row['idLocation'])));
		}

		return json_encode($locationList);
	}

	function getLocationInfoWithId($idLocation) {

		$query = "SELECT * FROM m2mLocation WHERE idLocation={$idLocation}";

		$result = mysql_query($query);

		$resultLocation = null;

		while ($row = mysql_fetch_assoc($result)) {
			$resultLocation = array("location" => array("idLocation" => $row['idLocation'], "name" => $row['name'], "lat" => $row['lat'], "lng" => $row['lng'], "alt" => $row['alt'], "nasID" => $row['nasID'], "ssid" => $row['ssid'], "ownerName" => $row['ownerName'], "note" => $row['note']), "devices" => $this -> getArrayDevicesForLocationId($row['idLocation']));
		}

		return json_encode($resultLocation);
	}	
	*/
	
	
    
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