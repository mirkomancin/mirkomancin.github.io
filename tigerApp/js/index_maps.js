function initMaps(){
	$.get('http://149.139.8.55/tigermonitor/api/m2m.php?q=location', function(data) {

			var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
			var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
			
			var osmMap = L.tileLayer(osmUrl, {attribution: osmAttrib});
			
			var map = L.map('map', {
			    layers: [osmMap] // only add one!
		    })
		    .setView([43.8487, 10.5747], 11);

			var baseLayers = {
				"OSM Map": osmMap
				  
			};

			var overlays = {
				"Layer di Interesse ": redlavplaces,
							"Aedes Albopictus Eggs  Actual": eggsMap
	 
			};

		 
		 L.control.layers(baseLayers,osmMap).addTo(map);
			
			

			
			for(index in data){
				var latlng = L.latLng([ parseFloat(data[index]['lat']) , parseFloat(data[index]['lng']) ]);
				// add a marker in the given location, attach some popup content to it and open the popup
				L.marker(latlng).addTo(map)
				    .bindPopup('<a href="graphs.html?id=' + data[index]['idLocation'] + '">' + data[index]['note'] + '</a>')
				    .openPopup();	
			}
		}); 	
}
