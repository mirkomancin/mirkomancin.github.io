function initMaps(){
	$.get('http://149.139.8.55/tigermonitor/api/m2m.php?q=location', function(data) {

			var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
			var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
			
		    var osm   = L.tileLayer(osmUrl, {id: 'examples.map-20v6611k', attribution: osmAttrib});
			
			var map = L.map('map', {
				center: [43.843287,10.49263],
				zoom: 15,
				layers: [osm]
			});
	
			var baseLayers = {
				"OpenStreetMap": osm
			};
	
			L.control.layers(baseLayers, osm).addTo(map);

			
			for(index in data){
				var latlng = L.latLng([ parseFloat(data[index]['lat']) , parseFloat(data[index]['lng']) ]);
				// add a marker in the given location, attach some popup content to it and open the popup
				L.marker(latlng).addTo(map)
				    .bindPopup('<a href="graphs.html?id=' + data[index]['idLocation'] + '">' + data[index]['note'] + '</a>')
				    .openPopup();	
			}
		}); 	
}
