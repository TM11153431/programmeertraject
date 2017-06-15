var canvas = d3.select('#map').append('svg')
	.attr('width', 900)
	.attr('id', 'svg_kaart')

var projection = d3.geo.mercator().scale(125800).translate([-10370, 135700]);
var path = d3.geo.path().projection(projection);

// **********
// FUNCTIONs
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

function histogram(data, group, key) {

	// [key, value] --> sorted + show only top 20 values
	var values = Object.keys(data).map(function(sleutel){return [sleutel, data[sleutel][key]]})
		.sort(function(a,b) { return a[1] - b[1]});
	
	var values_keys = values.map(function(i){ return i[0]}).slice(0, 30);
	var values_values = values.map(function(i){ return i[1]}).slice(0, 30);
	
	// margins
	var margin = {top:10, left: 20, right:20, bottom: 20};
	var height = 500;
	var width = 870;

	var y_scale = d3.scale.linear().domain([d3.min(values_values), d3.max(values_values)]).range([0, height]);
	var x_scale = d3.scale.ordinal().domain(values_keys).rangeRoundPoints([0,width])


	//define svg & g 
	var svg = d3.select('#histogram')
		.append('svg')
		.attr('width', width)
		.attr('height', height)
	var g = svg.append('g')

	var bars = g.selectAll('g')
		.data(values_keys)
		.enter()
		.append('div')
		.classed('bin', true)
		.style('position', 'relative')
		.style('x', function(key) { return x_scale(key)})
		.style('width', 20)
		.style('color', 'black')
		.style('height', function(d){return y_scale(data[d])})
		.style('height', function(key){ return y_scale(data[key])})
		.attr('transform', "translate('0', '0')")
		.attr('transform-origin', '50% 50%')

}

// ****************
// CALLBACKs
// *****************


d3.json('../data/buurten_amsterdam_wsg84_stadsdelen_zip.geojson', function (data_geo) {
	// maak groep ('g') en bind data 
	var group = canvas.selectAll('g')
		.data(data_geo.features)
		.enter()
		.append('g');

	d3.json('../data/price_reviews.json', function(data_buurten) {

		// KAART
		updateData(data_buurten, group, 'price');
		d3.select('#dropdown')
			.on('change', function() {
				var key = d3.select(this)[0][0].value
				updateData(data_buurten, group, key);

		});

		// HISTOGRAM
		histogram(data_buurten, group, 'price');

	});

});



