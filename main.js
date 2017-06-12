var canvas = d3.select('#map').append('svg')
	.attr('width', 960)
	.attr('height', 960)

d3.json('../data/buurten_amsterdam_wsg84_stadsdelen.geojson', function (data) {
	// maak groep ('g') en bind data 
	var group = canvas.selectAll('g')
		.data(data.features)
		.enter()
		.append('g');

	var projection = d3.geo.mercator().scale(150000).translate([-12350, 162000]);
	var path = d3.geo.path().projection(projection);

	// color scale
	var color_scale = d3.scale.linear().domain([0, 0.5]).range(['#e5f5f9','#99d8c9', '#2ca25f'])

	var areas = group.append("path")
		.attr('d', path)
		.attr('class', 'area')
		.attr('fill', function(d) {
			var percentage = (d.properties.nietwesters/d.properties.totaal)
			var count = 0
			if (isNaN(percentage)) {
				return 'white'
			} else
			count = count + 1
			console.log(count)
			return(color_scale(percentage))
		})
		.attr('id', function(d){ return d.properties.buurtcom00})
		//.on('click', function(d) { drawPiechart(d.properties)})
})

