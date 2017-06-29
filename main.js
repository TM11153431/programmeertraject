// Naam: Sjoerd Paardekooper
// Studend-id: 10278397
// Vak: Programmeerproject aan de Universiteit van Amsterdam
// Docent: drs. M.S. Stegeman (coördinator)

// Naam file: main.js
// Beschrijving file: hierin staat alle javascript vernatwoordelijk voor de d3 visualisatie. Wordt aangeroepen vanuit de index file. 

// ---------------------------------------------------------


// ********************
// Global variables
// ********************

data_type = 'number_of_reviews'
selected = 0

// variabelen voor de grootte van de kaart
var scale = 0.80
var projection = d3.geo.mercator().scale(125800*scale).translate([-10350*scale, 135670*scale]);
var path = d3.geo.path().projection(projection);

// ********************
// SVG variables
// ********************
var svg_kaart = d3.select('#map').append('svg')
	.attr('width', 800)
	.attr('height', 800);

var svg_histogram = d3.select('#histogram').append('svg')
	.attr('width', 500)
	.attr('height', 150)
	.style('padding-left', '50px')
	.style('padding-right', '50px')
	.style('padding-top', '20px');

var show_data = d3.select('.container').append('text')
	.attr('x', 500)
	.attr('y', 50)
	.attr('id', 'show_data')
	.text(' ')

var show_buurt = d3.select('.container').append('text')
	.attr('x', 500)
	.attr('y', 400)
	.attr('id', 'show_buurt')
	.text(' ')

var svg_piechart1 = d3.select('#piechart').append('svg').attr('id', 'piechart1')
var svg_piechart2 = d3.select('#piechart').append('svg').attr('id', 'piechart2')


// **********
// DRAW FUNCTIONs
// **********

// Tekent een kaart van Amsterdam Mercator style aan de hand van een geojson file. 
function kaart(data, buurten, data_type, leegstand_data) {

	// verwijder alle buurten
	d3.selectAll('.buurt').selectAll('path').remove();

	var color_scale = bereken_scale(data, data_type)

	// teken alle buurten
	var areas = buurten.append("path")
		.attr('d', path)
		.attr('class', 'area')
		.attr('id', function(d){return(d.properties.postcode)})
		.attr('fill', function(d) {
			postcode_geo_data = d.properties.postcode
			data_per_buurt = data[postcode_geo_data]
			// als er een plek is zonder postcode

			console.log(data_per_buurt)
			if (data_per_buurt === undefined) {
				console.log('hello')
				var background_color = '#ffffff'
				return background_color
			} else {
			// als er een plek is met postcode
				value = data_per_buurt[data_type]
				return color_scale(value)
			}
		});
};

// teken gebouwen met leegstand 
function teken_leegstand(data_leegstand, svg_kaart) {

	var g_leegstand = svg_kaart.append('g')
		.attr('class', 'leegstand_container')

	var vloeroppervlak = Object.values(data_leegstand).map(function(d){return d.Bruto_vloeroppervlak})
	var scale = d3.scale.sqrt().domain([0, d3.max(vloeroppervlak)]).range([0,6])

	// teken alle lege bouwen op de kaart in de vorm van circles
	leegstand = d3.select('.leegstand_container').selectAll('g')
		.data(data_leegstand)
		.enter()
		.append('circle')
		.attr('cx', function(d){
			lat = parseFloat((d.LAT).replace(',', '.'))
			lng = parseFloat((d.LNG).replace(',', '.'))
			return projection([lng, lat])[0]
		})
		.attr('cy',  function(d){
			lat = parseFloat((d.LAT).replace(',', '.'))
			lng = parseFloat((d.LNG).replace(',', '.'))
			return projection([lng, lat])[1]
		})
		.attr('fill', '#FF0000')
		.attr("r", function(d){return(scale(d.Bruto_vloeroppervlak))})
		.style('z-index', 99999)
		.style('opacity', 0.5)
		.attr('class', 'leegstand')
}

// Histogram functie gemaakt aan de hand van buurten data
function histogram(data,svg_histogram, data_type) {

	svg_histogram.selectAll('rect').remove()
	svg_histogram.selectAll('g').remove()

	var data_sorted = Object.keys(data).map(function(d) {return [d, data[d][data_type]]}).sort(function(a,b){return(b[1]-a[1])})
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
	var color_scale = bereken_scale(data, data_type)

	var y_scale_axis = d3.scale.linear().domain([d3.min(values), d3.max(values)]).range([height, 0]);

	//define y-axis
	var yAxis = d3.svg.axis()
		.scale(y_scale_axis)
		.orient('left')
		.tickValues([d3.max(values)])

	// append y axis
	svg_histogram.append('g')
		.attr('class', 'y axis')
	 	.call(yAxis)

	var bars = svg_histogram.selectAll('bar')
		.data(Object.keys(data))
		.enter()
		.append('rect')
		.classed('bin', true)
		.attr('position', 'relative')
		.attr('x', function(d) { return x_scale(d)})
		.attr('y', function(d) { return (height - y_scale(data[d][data_type])) })
		.attr('height', function(d){ return y_scale((data[d][data_type]))})
		.attr('width', bar_width)
		.attr('fill', function(d) { return( color_scale(data[d][data_type])) })
		.attr('id', function(d){return('pc'+d)})
	
}

function piechart(data, svg_piechart, data_type ) {

	svg_piechart.select('g').remove()

	// svg_piechart.selectAll().remove()
	var height = 200;
	var width = 200;
	var radius = Math.min(height, width)/2;

	// data alle buurtcombina's filteren naar één buurtcombinatie
	var values = Object.values(data[data_type])
	var keys = Object.keys(data[data_type])
	var data = keys.map(function(d){return {label: d, value:data[data_type][d]}})


	var length = Math.min(values);

	// color scale
	var color_scale = d3.scale.ordinal().range([1, 64]).range(["#007bff", "#00FFFF", "#ee82ee", "#ffff00", "#ff0000", "#00cc00"]);

	var color = d3.scale.linear().domain([1,length])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);

	// define areas
	var arc = d3.svg.arc()
		.outerRadius(radius * 0.8)
		.innerRadius(radius * 0.4);

	var outerArc = d3.svg.arc()
		.innerRadius(radius * 0.9)
		.outerRadius(radius * 0.9);

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d){ return(d.value)})
	
	var container = svg_piechart.append('g')
		.attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')')
		.attr('width', width)
		.attr('height', height)
		.attr('class', 'piechart_container')

	var label = function(d){ return d.data.label; };

	var arc_container = container.append('g')
		.attr('class', 'arc_container')

	var charts = arc_container.selectAll('.arc')
		.data(pie(data))
		.enter()
		.append('g')
		.attr('class', 'arc')

	var lines = container.append('g')
		.attr('class', 'lines_container')

	var labels = container.append('g')
		.attr('class', 'labels')


	var polylines = lines.selectAll('polyline')
		.data(pie(data), label)
		.enter()
		.append('polyline')
		.attr('class', 'polylines');

	// Source: http://bl.ocks.org/dbuezas/9306799 (het tekenen van de lijnen bij de chart )

	var text = labels.selectAll("text")
		.data(pie(data), label);

	text.enter()
		.append("text")
		.attr("dy", ".35em")
		.text(function(d) {
			return d.data.label;
		});
	
	function midAngle(d){
		return d.startAngle + (d.endAngle - d.startAngle)/2;
	}

	text.transition().duration(1000)
		.attrTween("transform", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
				return "translate("+ pos +")";
			};
		})
		.styleTween("text-anchor", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start":"end";
			};
		});

	polylines.transition().duration(1000)
	.attrTween("points", function(d){
		this._current = this._current || d;
		var interpolate = d3.interpolate(this._current, d);
		this._current = interpolate(0);
		return function(t) {
			var d2 = interpolate(t);
			var pos = outerArc.centroid(d2);
			pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
			return [arc.centroid(d2), outerArc.centroid(d2), pos];
		};
	});

	charts.append('path')
	.attr('d', arc)
	.style("fill", function(d) { return(color_scale(d.data.value)); });
		
}

// ****************
// OTHER FUNCTIONs
// ****************

function bereken_scale(data, data_type) {
	var values = Object.values(data).map(function(i){return i[data_type]})
	var max = d3.max(values)
	var min = d3.min(values)
	return d3.scale.linear().domain([min, max]).range(['#f6faff', '#007bff'])
}

//source: https://bl.ocks.org/guilhermesimoes/e6356aa90a16163a6f917f53600a2b4a
function buildLinearScaleValueToArea(data) {
	var maxValue, maxCircleRadius, maxCircleArea, circleAreaScale;

    maxValue = d3.max(data);
    maxCircleRadius = d3.min([this.scales.y.bandwidth(), this.scales.x.step()]) / 2;
    maxCircleArea = Math.PI * Math.pow(maxCircleRadius, 2);
    circleAreaScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, maxCircleArea]);

    return function circleRadius (d) {
      var area;

      area = circleAreaScale(d);
      return Math.sqrt(area / Math.PI);
    };
  }

// ****************
// CALLBACKs
// *****************

d3.json('../data/buurten_amsterdam_wsg84_stadsdelen_zip.geojson', function (err, data_geo) {
	if(err) console.log("error fetching data");

	d3.json('../data/price_reviews.json', function(data_buurten) {

		d3.json('../data/property_types.json', function(property_types) {

			d3.json('../data/leegstand.json', function(data_leegstand) {

				d3.json('../data/leegstand_per_postcode.json', function(leegstand_per_postcode) {

					// maak groep ('g') en bind data
					buurten = svg_kaart.selectAll('g')
						.data(data_geo.features)
						.enter()
						.append('g')
						.attr('class', 'buurt')

				// ********************
				// dropdown
				// ********************

					d3.select('#dropdown')
						.on('change', function() {
							data_type = d3.select(this)[0][0].value;
							kaart(data_buurten, buurten, data_type);
							histogram(data_buurten, svg_histogram, data_type);
							Buurten()

					});
				
				// ********************
				// mouseover show data
				// ********************

					buurten.on("mouseout", function(d) {
						d3.select(".highlighted_kaart").classed("highlighted_kaart", false).select('path').attr('fill', function(d) {return color_scale(data_buurten[d.properties.postcode][data_type]) })
						d3.select(".highlighted_histogram").classed("highlighted_histogram", false).attr('fill', function(postcode) { return color_scale(data_buurten[postcode][data_type])});
						show_buurt.text(' ')
						show_data.text(' ')
					})

					buurten.on('mouseover', function(d) {
						postcode = d.properties.postcode

					// verander data tekst
						data = data_buurten[postcode][data_type]
						show_data.text(data)
					// verander buurt tekst
						buurt_tekst = d.properties.buurtcom00
						show_buurt.text(buurt_tekst)
					// kaart & histogram highlights
						var bin = d3.selectAll('.bin')
						color_scale = bereken_scale(data_buurten, data_type)
						d3.select('#pc'+postcode).classed("highlighted_histogram", true).attr('fill', '#FF0000')
						var red = d3.select(this).classed("highlighted_kaart", true).select('path').attr('fill', '#FF0000')


					});

				// ********************
				// Laat leegstand zien door middel van muisclick
				// ********************

					var house_icon = d3.selectAll('.selectbox')
					.on('click', function(d) {
						var leegstand = d3.selectAll('.leegstand')
						if (leegstand.attr('display') == 'none') {
							leegstand.attr('display', 'show')
						} else {
							leegstand.attr('display', 'none')
						};
					})


				// **********
				// SELECTION
				// ***********

					d3.selectAll('.buurt').on('click', function(data) {

						// PIECHART
						var postcode = data.properties.postcode;
						piechart(property_types, svg_piechart1, postcode);
						piechart(leegstand_per_postcode, svg_piechart2, postcode);

						// KLEUR SELECTIE
						if (selected != 0) {
							// kleur de graph weer terug naar blauw. 
							if (postcode == selected) {
								// Dubbel muisklik a.k.a. selectie is hetzelfde
								d3.select(".selected").classed("selected", false).select('path').attr('fill', function(d) {return color_scale(data_buurten[d.properties.postcode][data_type]) });
								selected = 0
							} else {
								// selectie is niet hetzelfde 
								
							}
						} else {
							// zet de variabele terug naar 0 als er twee keer geklikt is. 
							selected = 0
						}
						var color_scale = bereken_scale(data_buurten, data_type);
						d3.select(".selected").classed("selected", false).select('path').attr('fill', function(d) {return color_scale(data_buurten[d.properties.postcode][data_type]) });
						selected = d3.select(this).classed('selected', true).attr('fill', '#00FF00').select('path')[0][0].id

					});

					// *********
					// Load
					// *********
					kaart(data_buurten, buurten, data_type);
					histogram(data_buurten, svg_histogram, data_type);
					teken_leegstand(data_leegstand, svg_kaart);

					// default value leegstand: none
					leegstand.attr('display', 'none')
				});
			});

		});

	});

});



