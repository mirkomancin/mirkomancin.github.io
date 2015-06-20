<?php

class mysql_to_json {
	var $json;
	var $cbfunc;
	var $json_array;
    var $connect;
	
	//constructor
	function mysql_to_json($query = '', $connect = '') {
		//set cbfunc
		//$this->set_cbfunc($cbfunc);
		$this->set_connect($connect);
		//check they don't just want a new class
		if($query != '') {
			//set query
			$this->set_query($query);
		}
	}

	//produces json output
	function get_json() {
		
		//generate json
		//$this->json = $this->cbfunc . '(' . json_encode($this->json_array) . ')';
		$this->json = json_encode($this->json_array);
		
		//return json
		return $this->json;
	}
	
	//produces json from query
	function get_json_from_query($query) {
		//set cbfunc
		//$this->set_cbfunc($cbfunc);
		
		//set query
		$this->set_query($query);
		
		//return json data
		return $this->get_json();
	}
	
	//get array
	function getArray()
	{
		return $this->json_array;
	}
	
	//set query
	function set_query($query) {
	  
	  //execute query
	  $exec_query = mysqli_query($this->connect,$query);
	
	  //reset json array
	  $this->json_array = array();

	  //loop through rows
	  while($row = mysqli_fetch_assoc($exec_query)) {
		//add row
		 array_push($this->json_array, $row);
	   }
	
		//enable method chaining
		return $this;
	}
	
	//set cbfunc
	function set_connect($connect) {
		//set cbfunc
		$this->connect = $connect;

		//enable method chaining
		return $this;
	}
}

?>
