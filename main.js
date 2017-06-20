var svg_kaart = d3.select('#map').append('svg')
	.attr('width', 600)
	.attr('height', 390);

var svg_histogram = d3.select('#histogram').append('svg')
	.attr('width', 400)
	.attr('height', 150);

var svg_piechart1 = d3.select('#bottom').append('svg').attr('id', 'piechart1')
var svg_piechart2 = d3.select('#bottom').append('svg').attr('id', 'piechart2')

var scale = 0.70
var projection = d3.geo.mercator().scale(125800*scale).translate([-10350*scale, 135670*scale]);
var path = d3.geo.path().projection(projection);

// **********
// FUNCTIONs
// **********

function kaart(data, data_geo, svg_kaart, key) {
	// maak groep ('g') en bind data
	var group = svg_kaart.selectAll('g')
		.data(data_geo.features)
		.enter()
		.append('g');

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

function histogram(data, svg_histogram, key) {

	svg_histogram.selectAll('rect').remove()
	svg_histogram.selectAll('g').remove()

		// input
	var data_sorted = Object.keys(data).map(function(d) {return [d, data[d][key]]})
	.sort(function(a,b){return(b[1]-a[1])})
	var keys = data_sorted.map(function(d) { return d[0]})
	var values = data_sorted.map(function(d) { return d[1]})

	var height = 75;
	var width = 400;
	var bar_width = width/92;

	//define scales 
	var y_scale = d3.scale.linear().domain([d3.min(values), d3.max(values)]).range([0, height]);
	var x_scale = d3.scale.ordinal().domain(keys).rangeRoundPoints([0,width])

	var bars = svg_histogram.selectAll('g')
		.data(Object.keys(data))
		.enter()
		.append('rect')
		.classed('bin', true)
		.style('position', 'relative')
		.style('x', function(d) { return x_scale(d)})
		.style('y', function(d) { return (height - y_scale(data[d][key])) })
		.style('height', function(d){ return y_scale((data[d][key]))})
		.style('width', bar_width)
		.style('color', 'black')
	
}

function piechart(data, svg_piechart, key ) {

	// svg_piechart.selectAll().remove()
	var height = 150;
	var width = 300;
	var radius = Math.min(height, width)/2;

	// data
	var data = [34,64,22];

	var length = Math.min(data);

	// color scale
	var color_scale = d3.scale.ordinal().range([1, 64]).range(["#FF0000", "#009933" , "#0000FF"]);

	var color = d3.scale.linear().domain([1,length])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);

	// define areas
	var arc = d3.svg.arc()
		.innerRadius(0)
		.outerRadius(radius - 10)

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d){ return(d)})
	
	var svg_piechart = svg_piechart.append('g')
		.attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')')
		.attr('width', width)
		.attr('height', height)
		.attr('class', 'piechart_container')

	var g = svg_piechart.selectAll('.arc')
		.data(pie(data))
		.enter()
		.append('g')
		.attr('class', 'arc')

	g.append('path')
	.attr('d', arc)
	.style("fill", function(d) { return(color_scale(d.data)); });
		
}

// ****************
// CALLBACKs
// *****************


d3.json('../data/buurten_amsterdam_wsg84_stadsdelen_zip.geojson', function (data_geo) {

	d3.json('../data/price_reviews.json', function(data_buurten) {


		d3.json('../data/property_types.json', function(property_types) {

			// Dropdown
			d3.select('#dropdown')
				.on('change', function() {
					var key = d3.select(this)[0][0].value

					kaart(data_buurten, data_geo, svg_kaart, key);
					histogram(data_buurten,svg_histogram, key);

			});

			// Load
			kaart(data_buurten, data_geo, svg_kaart, 'price');
			histogram(data_buurten, svg_histogram, 'price');
			piechart(data_buurten, property_types, 'price');
			piechart(data_buurten, property_types, 'price');

	});

});



