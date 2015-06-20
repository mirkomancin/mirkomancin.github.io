function initMaps(){
    $.ajax({
		type: 'GET',
		url: 'http://149.139.8.55/redlav/json/location.json',
		dataType: 'json',
		success: function (data) {
		//$.get('http://149.139.8.55/redlav/json/location.json', function(data) {

			var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
			var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
			
		    var osm   = L.tileLayer(osmUrl, {id: 'examples.map-20v6611k', attribution: osmAttrib});
			
			
			var owmUrl = 'http://{s}.tile.openweathermap.org/map/rain/{z}/{x}/{y}.png';
			var owmAttrib = 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>';
			
			var owm  = L.tileLayer(owmUrl, {id: 'examples.map-i875mjb7',   attribution: owmAttrib, opacity: 0.5});
	
			var map = L.map('map', {
				center: [43.843287,10.49263],
				zoom: 15,
				layers: [osm, owm]
			});
	
			var baseLayers = {
				"OpenStreetMap": osm,
				"OpenWheater": owm
			};
	
			L.control.layers(baseLayers, osm).addTo(map);

			
			for(index in data){
				var latlng = L.latLng([ parseFloat(data[index]['lat']) , parseFloat(data[index]['lng']) ]);
				// add a marker in the given location, attach some popup content to it and open the popup
				L.marker(latlng).addTo(map)
				    .bindPopup('<a href="graphs.php?id=' + data[index]['idLocation'] + '">' + data[index]['note'] + '</a>')
				    .openPopup();	
			}
		}
	}); 	
}
