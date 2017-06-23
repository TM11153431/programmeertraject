// global variabels
var key = 'number_of_reviews'

// SVG variabelen
var svg_kaart = d3.select('#map').append('svg')
	.attr('width', 600)
	.attr('height', 390);

var svg_histogram = d3.select('#histogram').append('svg')
	.attr('width', 400)
	.attr('height', 150);

var show_data = svg_kaart.append('text')
	.attr('x', 500)
	.attr('y', 20)
	.attr('id', 'show_data')
	.text(0)

var svg_piechart1 = d3.select('#bottom').append('svg').attr('id', 'piechart1')
var svg_piechart2 = d3.select('#bottom').append('svg').attr('id', 'piechart2')

var scale = 0.70
var projection = d3.geo.mercator().scale(125800*scale).translate([-10350*scale, 135670*scale]);
var path = d3.geo.path().projection(projection);

// **********
// DRAW FUNCTIONs
// **********

function kaart(data, buurten, key) {

	// verwijder alle buurten
	d3.selectAll('.buurten').remove();

	var color_scale = bereken_kaart_scale(data, key)

	var areas = buurten.append("path")
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
		//.attr('id', function(d){ return d.properties.postcode })
}

function histogram(data,svg_histogram, key) {

	svg_histogram.selectAll('rect').remove()
	svg_histogram.selectAll('g').remove()

	var data_sorted = Object.keys(data).map(function(d) {return [d, data[d][key]]}).sort(function(a,b){return(b[1]-a[1])})
	values = data_sorted.map(function(d){return d[1]})

	// input
	var keys = data_sorted.map(function(d) { return d[0]})
	var values = data_sorted.map(function(d) { return d[1]})

	var height = 75;
	var width = 400;
	var bar_width = width/92;

	var min = d3.min(values)
	var max = d3.max(values)

	//define scales 
	var y_scale = d3.scale.linear().domain([d3.min(values), d3.max(values)]).range([0, height]);
	var x_scale = d3.scale.ordinal().domain(keys).rangeRoundPoints([0,width])
	var color_scale = d3.scale.linear().domain([min, max]).range(['#e5f5f9', '#99d8c9', '#2ca25f'])

	var bars = svg_histogram.selectAll('g')
		.data(Object.keys(data))
		.enter()
		.append('rect')
		.classed('bin', true)
		.attr('position', 'relative')
		.attr('x', function(d) { return x_scale(d)})
		.attr('y', function(d) { return (height - y_scale(data[d][key])) })
		.attr('height', function(d){ return y_scale((data[d][key]))})
		.attr('width', bar_width)
		.attr('fill', function(d) { return( color_scale(data[d][key])) })
		.attr('id', function(d){return('pc'+d)})
	
}

function piechart(data, svg_piechart, key ) {

	// svg_piechart.selectAll().remove()
	var height = 150;
	var width = 300;
	var radius = Math.min(height, width)/2;

	// data
	var data = Object.values(data[key]);

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

// **********
// OTHER FUNCTIONs
// **********

function bereken_kaart_scale(data, key) {
	var values = Object.values(data).map(function(i){return i[key]})
	var max = d3.max(values)
	var min = d3.min(values)
	return d3.scale.linear().domain([min, max]).range(['#e5f5f9', '#99d8c9', '#2ca25f'])
}

// ****************
// CALLBACKs
// *****************


d3.json('../data/buurten_amsterdam_wsg84_stadsdelen_zip.geojson', function (err, data_geo) {
	if(err) console.log("error fetching data");
	// maak groep ('g') en bind data
	var buurten = svg_kaart.selectAll('g')
		.data(data_geo.features)
		.enter()
		.append('g')
		.attr('class', 'buurt')
		//.attr('id', function(d){return(d)})

	d3.json('../data/price_reviews.json', function(data_buurten) {


		d3.json('../data/property_types.json', function(property_types) {

			// Dropdown
			d3.select('#dropdown')
				.on('change', function() {
					var key = d3.select(this)[0][0].value
					kaart(data_buurten, buurten, key);
					histogram(data_buurten, svg_histogram, key);

			});

			// mouseselect buurten
		
			// *******************
			// mouseover show data
			// *******************

			buurten.on('mouseover', function(d) {

				postcode = d.properties.postcode
				data = data_buurten[postcode][key]
				show_data.text(data)
			// link between graphs
				var bin = d3.selectAll('.bin')
				color_scale = bereken_kaart_scale(data_buurten, key)
				d3.select('#pc'+postcode).classed("highlighted", true).attr('fill', '#FF0000')
				d3.select(this).classed("highlighted_kaart", true).select('path').attr('fill', '#FF0000')
			})

			buurten.on("mouseout", function(d) {
				d3.select(".highlighted_kaart").classed("highlighted_kaart", false).select('path').attr('fill', function(d) {return color_scale(data_buurten[d.properties.postcode][key]) })
				d3.select(".highlighted").classed("highlighted", false).attr('fill', function(postcode) { return color_scale(data_buurten[postcode][key])});
			})

			// **********
			// SELECTION
			// ***********

			d3.selectAll('.buurt').on('click', function(data) {


				console.log(postcode)
				// PIECHART
				var postcode = data.properties.postcode;
				piechart(property_types, svg_piechart1, postcode);

				// KLEUR SELECTIE
				var color_scale = bereken_kaart_scale(data_buurten, key);
				d3.select(".selected").classed("selected", false).select('path').attr('fill', function(d) {return color_scale(data_buurten[d.properties.postcode][key]) });
				d3.select(this).classed('selected', true).attr('fill', '#FF5733')


				//d3.select('.selected').select('path').property('__data__').properties.postcode
			});

			// *********
			// Load
			// *********

			kaart(data_buurten, buurten, key);
			histogram(data_buurten, svg_histogram, key);
			piechart(property_types, svg_piechart1, '1017');
			piechart(property_types, svg_piechart2, '1017');

		});

	});

});



