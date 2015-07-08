var map;
var locId = 1;
var m2mLocation = null;
var deviceList = null;
var graphData = [];
var plot = null;
var updateInterval = 30000;

function initMaps() {
	
	//locId = getUrlVars()["id"];

	$.get('http://149.139.8.55/tigermonitor/api/m2m.php?q=locationInfo&idLocation=' + locId, function(data) {
		
		m2mLocation = data['location'];
		deviceList = data['devices'];
		
		loadMap(data['location']['lat'],data['location']['lng']);
		
		for(index in data['devices'])
		{
			//createDeviceListElement(data['devices'][index]);
			createM2MDeviceMarker(data['devices'][index]);	
		}
		$('#locationName').html(m2mLocation['name']);

		
	});
}

function loadMap(lat,lng)
{
	
	imageBounds = L.latLngBounds([[38.73847, 7.419861],[44.58014, 12.31153]]);
     
     var osmLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        
    
   // var southWest = new L.LatLng(38.73847, 7.419861),northEast = new L.LatLng(44.58014, 12.31153), bounds = new L.LatLngBounds(southWest, northEast);

     var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
         osmAttrib = '&copy; ' + osmLink + ' Contributors';

     var osmMap = L.tileLayer(osmUrl, {attribution: osmAttrib});
	
	map = L.map('map', {
			    layers: [osmMap] // only add one!
		    })
		    .setView([43.8487, 10.5747], 9);

		var baseLayers = {
			"OSM Mapnik": osmMap			  
		};

		var overlays = { 
		};

     
     L.control.layers(baseLayers,overlays).addTo(map);
	/*		
	// add an OpenStreetMap tile layer
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
	*/
}

function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
		vars[key] = value;
	});
	return vars;
}


function popup(url) 
{
	 params  = 'width='+screen.width;
	 params += ', height='+screen.height;
	 params += ', top=0, left=0'
	 params += ', fullscreen=yes';
	
	 windowname = '';
	 
	 newwin=window.open(url,windowname, params);
	 if (window.focus) {newwin.focus()}
	 return false;
}


function createM2MDeviceMarker(data) {
		
	var latlng = L.latLng([ parseFloat(data['lat']) , parseFloat(data['lng']) ]);
	// add a marker in the given location, attach some popup content to it and open the popup
	L.marker(latlng).addTo(map) 
	    //.bindPopup('<a target="_blank" href="data/gauge.php?id=' + data['idDevice'] + '">' + data['type'] +' '+ data['idDevice'] + '</a>')
	    .bindPopup($('<a href="graphs.html?id='+data['idDevice']+'">' + data['note'] +' - '+ data['idDevice'] + '</a>').click(function(){
	    	//initializeGraph(data['idDevice']);
	    })[0]);
		//.openPopup();	
	
}