var map;
var locId = -1;
var m2mLocation = null;
var deviceList = null;
var graphData = [];
var plot = null;
var updateInterval = 30000;


//---GRAFICI---

var gauges = [];

function initializeGraph()
{
	id = getUrlVars()["id"];
	
	$("#rawData").html("<a href=\"csv.html?id="+id+"\" target=\"_new\">Salva dati con nome</a>");
	
	//alert(id);
	$("#gauge_click_thermometry").off("click");
	$("#gauge_click_igrometry").off("click");
	$("#gauge_click_anemometry").off("click");
	$("#gauge_click_pluviometry").off("click");
	$("#gauge_click_status").off("click");
	
	createGauges(id);
	updateGauges(id); 
	updateTherm(id);
	updateHum(id);
	setInterval(updateGauges(id), 5000);
	setInterval(updateTherm(id), 5000);
	setInterval(updateHum(id), 5000);
}
			
			
function tempVisualization(name, label, min, max){
	$('#'+name + 'GaugeContainer').html("");
}

function humVisualization(name, label, min, max){
	$('#'+name + 'GaugeContainer').html("");
}


function createGauge(name, label, min, max)
{
	var type_name = name;
	
	//create dedicated Div	
	if(name=="temp")
		label = "°C";
	else if(name=="hum")
		label = "%";
	else if(name=="lux")
		label = "lux";
	else if(name=="rpm")
		label = "rpm";				
    	else if(name=="pp_count")
		label = "rpm";
	else if(name=="volt")
		label = "V";
	else if(name=="lipo")
		label = "V";
	else if(name=="moisture")
		label = "%";
   	else if(name=="waterTemp")
		label = "°C";
	else if(name=="remoteTemp")
		label = "°C";
	else if(name=="remotePresence")
		label = "";
	else if(name=="remoteVolt")
		label = "V";
				
	var config = 
	{
		size: 120,
		label: label,
		min: undefined != min ? min : 0,
		max: undefined != max ? max : 100,
		minorTicks: 5
	}
	
	var range = config.max - config.min;
	config.yellowZones = [{ from: config.min + range*0.75, to: config.min + range*0.9 }];
	config.redZones = [{ from: config.min + range*0.9, to: config.max }];
	
	gauges[type_name] = new Gauge(type_name + "GaugeContainer", config);
	gauges[type_name].render();
}

function createGauges(id)
{
	var deviceId=id;
	
	
	$('#gauge_ex_status').html("");	
	$('#gauge_ex_igrometry').html("");
	$('#gauge_ex_anemometry').html("");
	$('#gauge_ex_pluviometry').html("");
	
	$.get('http://149.139.8.55/tigermonitor/api/m2m.php?q=deviceInfo&idDevice='+deviceId, function(data) {

		$('#gauge_click_status').html("<img class=\"dashboard-icon\" src=\"images/dashboard/device.png\" /><div>Status of device:</div>");
		$('#gauge_click_thermometry').html("<img class=\"dashboard-icon\" src=\"images/dashboard/thermometer.png\" /><div>Thermometry sensors:</div>");
		$('#gauge_click_igrometry').html("<img class=\"dashboard-icon\" src=\"images/dashboard/humidity.png\" /><div>Hygrmometry sensors:</div>");
		$('#gauge_click_anemometry').html("<img class=\"dashboard-icon\" src=\"images/dashboard/wind.png\" /><div>Anemometry sensors:</div>");
		$('#gauge_click_pluviometry').html("<img class=\"dashboard-icon\" src=\"images/dashboard/rain.png\" /><div>Pluviometry sensors:</div>");

		var sensorTypes = data['sensorTypes'];
		
		var termometria = 0;
		
		for(index in sensorTypes){
						
			var name = sensorTypes[index]['name'];
			
			//create dedicated Div	
			if(name=="temp")
				name = "Temperature";
			else if(name=="hum")
				name = "Humidity";
			else if(name=="lux")
				name = "Light";
			else if(name=="rpm")
				name = "RPM Anemometer";				
		    	else if(name=="pp_count")
				name = "Pluviometer";
			else if(name=="volt")
				name = "Battery level";
			else if(name=="lipo")
				name = "LiPo level";
			else if(name=="waterTemp")
				name = "Water Temp";
		   	else if(name=="remoteTemp")
				name = "Remote Temp";
			else if(name=="remotePresence")
				name = "Water presence";
			else if(name=="remoteVolt")
				name = "Remote battery level";
			
			
			if(sensorTypes[index]['type']=="status"){
				$('#gauge_ex_status').append("<div id=\"col\" onclick=\"graphClick('"+ sensorTypes[index]['name'] + "','" + deviceId + "','" + sensorTypes[index]['rangeMin'] + "','" + sensorTypes[index]['rangeMax'] + "','" + sensorTypes[index]['units'] + "');\"><span id=\"" + sensorTypes[index]['name'] + "GaugeContainer\"></span><h3>"+name+"</h3></div>");
				createGauge(sensorTypes[index]['name'],"", parseInt(sensorTypes[index]['rangeMin']), parseInt(sensorTypes[index]['rangeMax']));
			}
			else
			if(sensorTypes[index]['type']=="termometria"){
				if(termometria==0)
					$('#gauge_ex_thermometry_c').html("<div style=\"padding-right: 2%;\"id=\"colTemp\" onclick=\"graphClick('"+ sensorTypes[index]['name'] + "','" + deviceId + "','" + sensorTypes[index]['rangeMin'] + "','" + sensorTypes[index]['rangeMax'] + "','" + sensorTypes[index]['units'] + "');\"><span id=\"" + sensorTypes[index]['name'] + "GaugeContainer\"></span><h3>"+name+"</h3></div>");
				else
					$('#gauge_ex_thermometry_c').append("<div style=\"padding-right: 2%;\"id=\"colTemp\" onclick=\"graphClick('"+ sensorTypes[index]['name'] + "','" + deviceId + "','" + sensorTypes[index]['rangeMin'] + "','" + sensorTypes[index]['rangeMax'] + "','" + sensorTypes[index]['units'] + "');\"><span id=\"" + sensorTypes[index]['name'] + "GaugeContainer\"></span><h3>"+name+"</h3></div>");
				//createGauge(sensorTypes[index]['name'],"", parseInt(sensorTypes[index]['rangeMin']), parseInt(sensorTypes[index]['rangeMax']));
				tempVisualization(sensorTypes[index]['name'],"", parseInt(sensorTypes[index]['rangeMin']), parseInt(sensorTypes[index]['rangeMax']));
				termometria++;
			}
			else
			if(sensorTypes[index]['type']=="igrometria"){
				$('#gauge_ex_igrometry').append("<div id=\"col\" onclick=\"graphClick('"+ sensorTypes[index]['name'] + "','" + deviceId + "','" + sensorTypes[index]['rangeMin'] + "','" + sensorTypes[index]['rangeMax'] + "','" + sensorTypes[index]['units'] + "');\"><span id=\"" + sensorTypes[index]['name'] + "GaugeContainer\"></span><h3>"+name+"</h3></div>");
				//createGauge(sensorTypes[index]['name'],"", parseInt(sensorTypes[index]['rangeMin']), parseInt(sensorTypes[index]['rangeMax']));	
				humVisualization(sensorTypes[index]['name'],"", parseInt(sensorTypes[index]['rangeMin']), parseInt(sensorTypes[index]['rangeMax']));
			}
			else
			if(sensorTypes[index]['type']=="anemometria"){
				$('#gauge_ex_anemometry').append("<div id=\"col\" onclick=\"graphClick('"+ sensorTypes[index]['name'] + "','" + deviceId + "','" + sensorTypes[index]['rangeMin'] + "','" + sensorTypes[index]['rangeMax'] + "','" + sensorTypes[index]['units'] + "');\"><span id=\"" + sensorTypes[index]['name'] + "GaugeContainer\"></span><h3>"+name+"</h3></div>");
				createGauge(sensorTypes[index]['name'],"", parseInt(sensorTypes[index]['rangeMin']), parseInt(sensorTypes[index]['rangeMax']));
			}
			else
			if(sensorTypes[index]['type']=="pluviometria"){
				$('#gauge_ex_pluviometry').append("<div id=\"col\" onclick=\"graphClick('"+ sensorTypes[index]['name'] + "','" + deviceId + "','" + sensorTypes[index]['rangeMin'] + "','" + sensorTypes[index]['rangeMax'] + "','" + sensorTypes[index]['units'] + "');\"><span id=\"" + sensorTypes[index]['name'] + "GaugeContainer\"></span><h3>"+name+"</h3></div>");
				createGauge(sensorTypes[index]['name'],"", parseInt(sensorTypes[index]['rangeMin']), parseInt(sensorTypes[index]['rangeMax']));
			}
			
		}
		
		$("#gauge_click_thermometry").click(function () {
		    $header = $(this);
		    //getting the next element
		    $content = $header.next();
		    $content = $header.next();
		    //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
		    $content.slideToggle(500, function () {
		        //execute this after slideToggle is done
		        //change text of header based on visibility of content div		        
		    });
		
		});
		
		
			$("#gauge_click_igrometry").click(function () {
		    $header = $(this);
		    //getting the next element
		    $content = $header.next();
		    $content = $header.next();
		    //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
		    $content.slideToggle(500, function () {
		        //execute this after slideToggle is done
		        //change text of header based on visibility of content div
		        $header.text(function () {
		            //change text based on condition
		            return;
		        });
		    });
		
		});
		
		$("#gauge_click_anemometry").click(function () {
		    $header = $(this);
		    //getting the next element
		    $content = $header.next();
		    $content = $header.next();
		    //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
		    $content.slideToggle(500, function () {
		        //execute this after slideToggle is done
		        //change text of header based on visibility of content div
		        $header.text(function () {
		            //change text based on condition
		            return;
		        });
		    });
		
		});
		
		$("#gauge_click_pluviometry").click(function () {
		    $header = $(this);
		    //getting the next element
		    $content = $header.next();
		    $content = $header.next();
		    //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
		    $content.slideToggle(500, function () {
		        //execute this after slideToggle is done
		        //change text of header based on visibility of content div
		        $header.text(function () {
		            //change text based on condition
		            return;
		        });
		    });
		
		});
		
		$("#gauge_click_status").click(function () {
		    $header = $(this);
		    //getting the next element
		    $content = $header.next();
		    $content = $header.next();
		    //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
		    
		    $content.slideToggle(500, function () {
		        //execute this after slideToggle is done
		        //change text of header based on visibility of content div
		        		        
		    });
		
		});
		
		// $('#gauge_igrometry').append("<div id=\"gauge_ex_igrometry\">");
		// $('#gauge_anemometry').append("<div id=\"gauge_ex_anemometry\">");
		// $('#gauge_pluviometry').append("<div id=\"gauge_ex_pluviometry\">");
		//$('#gauge_status').append("</div>");
		//$('#gauge_thermometry').append("</div>");
		//$('#gauge_igrometry').append("</div>");
		//$('#gauge_anemometry').append("</div>");
		//$('#gauge_pluviometry').append("</div>");
	
	});		
	
			
}

/*
 
 function createGauges(id)
{
	var deviceId=id;
	
	$.get('api/m2m.php?q=deviceInfo&idDevice='+deviceId, function(data) {

		$('#graphList').html("");
		
		var sensorTypes = data['sensorTypes'];

		var i=0;
		
		$('#graphList').append("<div id=\"row\">");
		
		for(index in sensorTypes){
			if(i % 4 == 0){
				$('#graphList').append("</div><div id=\"row\">");
			}
			
			var name = sensorTypes[index]['name'];
			
			//create dedicated Div	
			if(name=="temp1")
				name = "Temperature 1";
			else if(name=="hum1")
				name = "Humidity 1";
			else if(name=="tempDevice")
				name = "Temperature Device";
			else if(name=="humDevice")
				name = "Humidity Device";
			else if(name=="lux")
				name = "Light";
			else if(name=="rpm")
				name = "RPM Anemometer";				
		    else if(name=="pp_count")
				name = "Pluviometer";
			else if(name=="battery")
				name = "Battery level";
			else if(name=="moisture")
				name = "Moisture";
		   	else if(name=="soilTemp1")
				name = "Soil Temperature 1";
			else if(name=="soilTemp2")
				name = "Soil Temperature 2";
			
			
			$('#graphList').append("<div id=\"col\"><h3>"+name+"</h3><span id=\"" + sensorTypes[index]['name'] + "GaugeContainer\"></span></div><div id=\"col2\"><img id=\"graph\"src=\"images/gauge_img/graph.png\" onclick=\"graphClick('"+ sensorTypes[index]['name'] + "','" + deviceId + "','" + sensorTypes[index]['rangeMin'] + "','" + sensorTypes[index]['rangeMax'] + "','" + sensorTypes[index]['units'] + "');\"/><br><img id=\"details\"src=\"images/gauge_img/details.png\" onclick=\"detailsClick('"+ sensorTypes[index]['name'] + "','" + deviceId + "')\"/></div>");
			
			createGauge(sensorTypes[index]['name'],"", parseInt(sensorTypes[index]['rangeMin']), parseInt(sensorTypes[index]['rangeMax']));
			i++;
		}
		
		if(i%3==0) $('#graphList').append("</div>");
		
	});				
}
 
 * */

function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
		vars[key] = value;
	});
	return vars;
}

function updateGauges(id)
{
	//locId = getUrlVars()["id"];
	
	$.get('http://149.139.8.55/tigermonitor/api/m2m.php?q=last_log&deviceId=' + id, function(data) {
		
		//alert(JSON.stringify(data[0]));
		var json = JSON.parse(JSON.stringify(data[0]));
		var payload = json.payload;
		var json_pay = JSON.parse(payload);
		
		var deviceId=id;
		$.get('http://149.139.8.55/tigermonitor/api/m2m.php?q=deviceInfo&idDevice='+deviceId, function(data) {

			//$('#graphList').html("");

			var sensorTypes = data['sensorTypes']; 
	
			for(index in sensorTypes){
				if( (sensorTypes[index]['type'] != "light") && (sensorTypes[index]['type'] != "termometria") && (sensorTypes[index]['type'] != "igrometria") ){
					gauges[sensorTypes[index]['name']].redraw(json_pay[sensorTypes[index]['name']]);
				}
			}
		});					
	});
	
}

function updateTherm(id)
{
	//locId = getUrlVars()["id"];
	
	$.get('http://149.139.8.55/tigermonitor/api/m2m.php?q=last_log&deviceId=' + id, function(data) {
		
		//alert(JSON.stringify(data[0]));
		var json = JSON.parse(JSON.stringify(data[0]));
		var payload = json.payload;
		var json_pay = JSON.parse(payload);
		
		var deviceId=id;
		$.get('http://149.139.8.55/tigermonitor/api/m2m.php?q=deviceInfo&idDevice='+deviceId, function(data) {

			//$('#graphList').html("");

			var sensorTypes = data['sensorTypes'];
	
			for(index in sensorTypes){
				if(sensorTypes[index]['type'] == "termometria"){
				    var value = json_pay[sensorTypes[index]['name']];
				    
				    var color;
				    if(value<-10)
				    	color = 'verycold';
				    else if(value>=-10 && value <10)
				    	color = 'cold';
				    else if(value>=10 && value <25)
				    	color = 'normal';
				    else if(value>=25 && value <40)
				    	color = 'hot';
				    else if(value>=40)
				    	color = 'veryhot';
						
					var icon='15';
					
					$('#' + sensorTypes[index]['name'] + 'GaugeContainer').html("<button class=\"temp-button-"+color+"\" style=\"background-color: "+color+"\">"+ value + " °" + sensorTypes[index]['units'] + "</h2>");
				}
			}
		});					
	});
	
}

function updateHum(id)
{
	//locId = getUrlVars()["id"];
	
	$.get('http://149.139.8.55/tigermonitor/api/m2m.php?q=last_log&deviceId=' + id, function(data) {
		
		//alert(JSON.stringify(data[0]));
		var json = JSON.parse(JSON.stringify(data[0]));
		var payload = json.payload;
		var json_pay = JSON.parse(payload);
		
		var deviceId=id;
		$.get('http://149.139.8.55/tigermonitor/api/m2m.php?q=deviceInfo&idDevice='+deviceId, function(data) {

			//$('#graphList').html("");

			var sensorTypes = data['sensorTypes'];
	
			for(index in sensorTypes){
				if(sensorTypes[index]['type'] == "igrometria"){
				    var value = json_pay[sensorTypes[index]['name']];
				    
				    var status;
				    if(value<33)
				    	status = 'dry';
				    else if(value>=33 && value <66)
				    	status = 'normal';
				    else if(value>=66)
				    	status = 'wet'; 
						
					$('#' + sensorTypes[index]['name'] + 'GaugeContainer').html("<div id=\"hum-button\"><img src=\"images/dashboard/hum-"+status+".png\"><h2>"+ value + sensorTypes[index]['units'] + "</h2></div>");
				}
			}
		});					
	});
	
}

function getRandomValue(gauge)
{
	var overflow = 0; //10;
	return gauge.config.min - overflow + (gauge.config.max - gauge.config.min + overflow*2) *  Math.random();
}


var plot = null;
			
function graphClick(name, id, min, max, units) {
	//alert (id + ": show graph " + name);
	$('#graphDevice').html("");
	document.getElementById('graphDevice').style.display = "none";				
	$('#graphDevice').fadeIn(200);
	document.getElementById('graphDevice').style.display = "block";   
	$('#graphDevice').html("");
	//$('#graphDevice').append("Grafico - ID: " + id + ", NAME: " + name);
						
	loadGraphData(id,name, name+'Placeholder',name,min,max,units);

};

function detailsClick(name, id) {
	alert (id + ": open details " + name );    	
};


function loadGraphData(deviceId,type, placeholder, sensorType,min,max,unita) {

    var graphTitle;
    
	//create dedicated Div	
	if(type=="temp")
		graphTitle = "Temperature";
	else if(type=="hum")
		graphTitle = "Humidity";
	else if(type=="lux")
		graphTitle = "Light";
	else if(type=="rpm")
		graphTitle = "RPM Anemometer";				
    	else if(type=="pp_count")
		graphTitle = "Pluviometer";
	else if(type=="volt")
		graphTitle = "Battery level";
	else if(type=="lipo")
		graphTitle = "LiPo level";
   	else if(type=="waterTemp")
		graphTitle = "Water Temperature";
	else if(name=="remoteTemp")
		graphTitle = "Remote Temperature";
	else if(name=="remotePresence")
		graphTitle = "Water Presence";
	else if(name=="remoteVolt")
		graphTitle = "Remote battery level";


	var html = '<div><p style="margin-bottom: 0;">'+graphTitle+' ('+unita+') </p><div id="'+placeholder+'" style="width:100%;height:400px;"></div></div>';

	$('#graphDevice').append(html);

	$.get('http://149.139.8.55/tigermonitor/api/m2m.php?q=latest_log&deviceId='+deviceId, function(dataArray) {

		var data = dataArray['data'];

		var res = [];
		var avgData = [];
		var xTicksArray = [];
		var maxValue = 0.0;
		var minValue = 100000.0;

		var average = 0.0;
		var totalSum = 0.0;
		var count = 0;
	
		
		
		for(index in data) {
			var payloadString = data[index]['payload'];
			var payloadObj = JSON.parse(payloadString);
			res.push([index, payloadObj[sensorType]]);

			if(payloadObj[sensorType] > maxValue)
				maxValue = payloadObj[sensorType];

			if(payloadObj[sensorType] < minValue)
				minValue = payloadObj[sensorType];

			if(index % 10 == 1){
				var time = new Date(data[index]['timestamp']);
				var mins = time.getMinutes();
				var quarterHours = Math.round(mins/15);
				if (quarterHours == 4)
				{
				    time.setHours(time.getHours()+1);
				}
				var rounded = (quarterHours*15)%60;
				
				time.setSeconds(0);
				time.setMinutes(rounded);
				
				var dateStr = padStr(time.getFullYear()) + "-" +
			                  padStr(1 + time.getMonth()) + "-" +
			                  padStr(time.getDate()) + " " +
			                  padStr(time.getHours()) + ":" + 
			                  padStr(time.getMinutes()) + ":" + 
			                  padStr(time.getSeconds());
				
				xTicksArray.push([index, dateStr]);
			}
			totalSum += payloadObj[sensorType];
			count++;
		}
		
		graphData = res;
		
		average = totalSum / count;
		for(var i = 0; i < count; i++) {
			avgData.push([i,average]);
		}

		var updateInterval = 500;
					
		// setup plot
		var options = {
			series : {
				shadowSize : 0
			}, // drawing is faster without shadows
			yaxis : {
				min : minValue - 2,
				max : parseFloat(maxValue) + (0.1 * maxValue) + 2	 							
			},
			xaxis : {
				show : true,
				ticks : xTicksArray				
			},
			lines : {
				show : true
			},
			points : {
				show : true
			},
			grid: {
				hoverable: true,
				clickable: true
			}
		};
		
		console.log("placeholder: " + placeholder);
		
		var plot = $.plot($('#' + placeholder), [{
			data : graphData//,
			//label : "Data (" + unita + ")"
		}/*, {
			data : avgData,
			label : "AVG"
		}*/], options);

		function update() {
			
			
			$.get('http://149.139.8.55/tigermonitor/api/m2m.php?q=latest_log&deviceId='+deviceId, function(data_) {

					data = data_['data'];
			
					var graph = [];
					var avg = [];
					res = [];
					xTicksArray = [];
					maxValue = 0.0;
					minValue = 100000.0;
			
					average = 0.0;
					totalSum = 0.0;
					count = 0;					
					
					for(index in data) {
						var payloadString = data[index]['payload'];
						var payloadObj = JSON.parse(payloadString);
						res.push([index, payloadObj[sensorType]]);
			
						if(payloadObj[sensorType] > maxValue)
							maxValue = payloadObj[sensorType];
			
						if(payloadObj[sensorType] < minValue)
							minValue = payloadObj[sensorType];
			
						if(index % 10 == 1){
							var time = new Date(data[index]['timestamp']);
							var mins = time.getMinutes();
							var quarterHours = Math.round(mins/15);
							if (quarterHours == 4)
							{
							    time.setHours(time.getHours()+1);
							}
							var rounded = (quarterHours*15)%60;
							
							time.setSeconds(0);
							time.setMinutes(rounded);
							
							var dateStr = padStr(time.getFullYear()) + "-" +
						                  padStr(1 + time.getMonth()) + "-" +
						                  padStr(time.getDate()) + " " +
						                  padStr(time.getHours()) + ":" + 
						                  padStr(time.getMinutes()) + ":" + 
						                  padStr(time.getSeconds());
							
							//alert(dateStr);
							xTicksArray.push([index, dateStr]);
						}
						totalSum += payloadObj[sensorType];
						count++;
					}
					
					graph = res;
					
					average = totalSum / count;
					for(var i = 0; i < count; i++) {
						avg.push([i,average]);
						$("#avg").text(average);
					}				
					
					var options = {
						series : {
							shadowSize : 0
						}, // drawing is faster without shadows
						yaxis : {
							min : minValue -2,
							max : parseFloat(maxValue) + (0.1 * maxValue) + 2								
						},
						xaxis : {
							show : true,
							ticks : xTicksArray				
						},
						lines : {
							show : true
						},
						points : {
							show : true
						},
						grid: {
							hoverable: true,
							clickable: true
						}
					};
				
					plot = $.plot($('#' + placeholder), [{
						data : graph//,
						//label : "Data (" + unita + ")"
						}/*, {
							data : avgData,
							label : "AVG"
						}*/], options);
					//plot.draw();
					
					setTimeout(update, updateInterval);
			
			});
		}

		update();
		
		
		function showTooltip(x, y, contents) {
			$("<div id='tooltip'>" + contents + "</div>").css({
				position: "absolute",
				display: "none",
				top: y + 5,
				left: x + 5,
				border: "1px solid #fdd",
				padding: "2px",
				"background-color": "#fee",
				opacity: 0.80
			}).appendTo("body").fadeIn(200);
		}

		var previousPoint = null;
		$('#' + placeholder).bind("plothover", function (event, pos, item) {

			var str = "(" + pos.x.toFixed(2) + ", " + pos.y.toFixed(2) + ")";
			$("#hoverdata").text(str);
			
			if (item) {
					if (previousPoint != item.dataIndex) {

						previousPoint = item.dataIndex;

						$("#tooltip").remove();
						var x = item.datapoint[0],
						y = item.datapoint[1].toFixed(2);

						showTooltip(item.pageX, item.pageY,
						    "Value: " + y + " " + unita);// + " - AVG = " + average.toFixed(2));
					}
			} else {
					$("#tooltip").remove();
						previousPoint = null;            
				}
				
			});

	});
		
}


function padStr(i) {
    return (i < 10) ? "0" + i : "" + i;
}
