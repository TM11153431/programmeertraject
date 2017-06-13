var canvas = d3.select('#map').append('svg')
	.attr('width', 1170)
	.attr('id', 'kaart')

var projection = d3.geo.mercator().scale(150000).translate([-12350, 162000]);
var path = d3.geo.path().projection(projection);

// **********
// FUNCTIONS
// **********

function updateData(data, group, key) {
	array_key_data = Object.values(data).map(function(i){return i[key]})
	var max = Math.max.apply(Math, array_key_data)
	var min = Math.min.apply(Math, array_key_data)
	var color_scale = d3.scale.linear().domain([min, max]).range(['#e5f5f9','#99d8c9', '#2ca25f'])
	var areas = group.append("path")
		.attr('d', path)
		.attr('class', 'area')
		.attr('fill', function(d) {
			postcode_geo_data = d.properties.postcode
			data_per_buurt = data[postcode_geo_data]
			console.log(data_per_buurt)
			console.log(key)
			// als er een plek is zonder postcode
			if (data_per_buurt === undefined) {
				var red = '#FF0000'
				return red
			} else {
				// als er een plek is met postcode
				value = data_per_buurt[key]
				return color_scale(value)

			}
		})
		.attr('id', function(d){ return d.properties.buurtcom00})
}


d3.json('../data/buurten_amsterdam_wsg84_stadsdelen_zip.geojson', function (data_geo) {
	// maak groep ('g') en bind data 
	var group = canvas.selectAll('g')
		.data(data_geo.features)
		.enter()
		.append('g');

	d3.json('../data/price_reviews.json', function(data_buurten) {
		d3.select('#dropdown')
			.on('change', function() {
				var key = d3.select(this)[0][0].value
				console.log(key)
				updateData(data_buurten, group, key);

		});

	});

});



