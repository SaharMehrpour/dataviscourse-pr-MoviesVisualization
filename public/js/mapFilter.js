
/*
 Constructor
 */
function MapFilter(movies, interactivity) {
	var self = this;

	self.interactivity = interactivity;
	self.movies = movies;

	self.div = d3.select("#map_filter_div").append('div').style('padding','25px 25px 25px 25px');
	//console.log(self.div.width)
	self.init();
};

MapFilter.prototype.init = function(){
	var self = this;
	self.svgBounds = self.div.classed('content',true).node().getBoundingClientRect();
	self.svgWidth = self.svgBounds.width-50
	self.svgHeight = 1000;
	//console.log(self.svgHeight)

	d3.csv("data/movie_metadata.csv", function (error, data)

	{movies=data
		d3.csv("data/countrycode.csv",function(error,data){country=data

			//console.log(self.svg)

			self.div.append('input').attr('width',100).attr('height',100).attr('fill','blue').attr('type','submit')
				.attr('value','Help Me Locate')
				.on ('click', function () {

					return search(d3.select(this.parentNode).select("#myVal").property("value"));
				})
			self.div.append('input').attr('width',100).attr('height',100).style('border','1px dotted').attr("type","text").attr("id","myVal").on('keyup',function () {

				if (d3.event.keyCode == 13)


					return search(d3.select(this).property("value"));


			});


			self.svg = self.div.append("svg").attr('padding','10').attr('height',400).attr('width',self.svgWidth).attr('id','map');//.call(d3.zoom().on("zoom", function () {
			self.tooltip = self.div
				.append("div")
				.style("position", "absolute")
				.style("z-index", "10")
				.style("visibility", "hidden")
				.style("background", "#000")
				.text("a simple tooltip");

			self.svg.append('g');

			function search(text) {
				self.drawMap(movies,country,text)
				//console.log(text);
			}


			var text1='none'


			self.drawMap(movies,country,text1)})
//var countryLisT=d3.nest().key(function(d){console.log(d.Capital)}).entries(country)
//console.log(countryList)

	})
	//self.drawMap();
}
/**
 * Initializes the svg elements required for this chart
 */
MapFilter.prototype.drawMap = function(movieList,country,text){
//console.log(movieList[5].country)
	// Draw map
	var self = this;
	//console.log(movieList)
	self.div.selectAll('path').attr('fill','whitesmoke')
	var colorScale = d3.scaleQuantile()
	//.domain([20,1500]).range(['#ccebff','#0000b3'])
		.domain([10,20,50,120,130,1000])
		.range(colorbrewer.GnBu[6])

	var nested_data= d3.nest().key(function(d){//console.log('yes')
		return d.country}).entries(movieList)

//console.log(nested_data.length)

	var countryList=d3.nest().key(function(d){//console.log(d.code)
		return [d.name,d.code]}).entries(country)

	var projection = d3.geoMercator().scale(70).translate([250, 200]);
	//This will not be the final projection. Just using this as a rough draft.
	IList=[];
	var text=text
	regex = new RegExp('^' + text + '$', 'i')
	//console.log(text)

	//cList=[];
	//.attr("width","800").attr("height","700")
	var path = d3.geoPath().projection(projection)
	var count=0
	var div = self.div.append("div")
		.style("opacity", 0);

	d3.json("data/world.json",function(json){//console.log(json)





		var map=self.svg.select('g').selectAll("path")
			.data(topojson.feature(json, json.objects.countries).features)
		map.exit().remove
		map.enter()
			.append("path")
			.attr('id',function(d){
				return d.id})
			.attr("d",path)
			.attr("stroke","gray")
			.attr("stroke-width",0.5)
			.attr('transform','translate(20,60)')
			.attr("fill", "whitesmoke")
			.attr("opacity",0.75)
			.on("mouseover",function(d){
				d3.select(this).attr('stroke','black').attr('stroke-width',1);
				div.transition()
				//.duration(20)
					.style("opacity", .9);
				div.html(function(){for (var j=0; j<countryList.length; j++){
					c=countryList[j].key.split(',')
					if (d.id==c[1]) {//item=c[0];return "This is " + c[0]}
						for (var k=0; k<nested_data.length;k++){
							if (c[0]==nested_data[k].key){console.log(nested_data[k].values.length);return c[0] +
								"</br>"+ "Click to know what movies it made with your selected features! "
								break}}
						return  c[0] + " : Sorry, no movies to show here with given selection"
					}}})


			})
			.on("mouseout",function(){
				div.transition()
					.duration(500)
					.style("opacity", 0);
				d3.select(this).attr('stroke','gray').attr('stroke-width',1);
				//tip.hide
			})

			.on("click", function(d){d3.selectAll(this).attr('stroke','gray').attr('stroke-width',0.5);
				cList=[];//x= IList.includes('"'+d.id+'"');

				if ((IList.includes(d.id))==true){
					var ind=IList.indexOf(d.id);console.log(ind);IList.splice(ind,1);d3.select(this).style('fill',function(d){
						for (var j=0; j<countryList.length; j++){
							c=countryList[j].key.split(',')
							if (d.id==c[1]){for (var k=0;k<nested_data.length;k++){if (c[0]==nested_data[k].key){return colorScale(nested_data[k].values.length)}}}


						}})}
				else

				{d3.select(this).style("fill","#ff6600");
					for (var j=0; j<countryList.length; j++){
						c=countryList[j].key.split(',')
						if (d.id==c[1]){IList.push(d.id);
						}}}

				listed(IList,cList)


			})



		list=[]
		for (var i = 0; i < nested_data.length; i++) {
			//console.log(nested_data[i].key)
			for (var j=0; j<countryList.length; j++){

				c=countryList[j].key.split(',')

				if (nested_data[i].key==c[0]){d3.select('#'+c[1]).attr('fill',colorScale(nested_data[i].values.length));
					list.push(c[1])}}}
// 	for (var m=0;m<countryList.length;m++){count=countryList[m].key.split(',')
// 	for (var entry=0;entry<list.length;entry++){if (list[entry]!=countryList[m]){d3.select('#'+c[1])
// 	.attr('fill','whitesmoke')}}}


		//map.on("click",function(d){console.log(d);d3.select(this).classed('mapover',true)})

		function listed(IList,cList){

			for (var i=0; i<IList.length; i++){for (var j=0; j<countryList.length; j++){
				c=countryList[j].key.split(',')
				if (IList[i]==c[1]){cList.push(c[0])}}}
			//console.log(cList)
			self.interactivity.updatedMapFilter(cList)

		}

		for (var i=0; i<countryList.length; i++){
			//d3.select()
			c=countryList[i].key.split(',')
			if (regex.test(c[0])) {
				//console.log("true");
				item=c[1]

				//IList.push(item)
				d3.select('#'+c[1]).attr('stroke','orange').attr('stroke-width',1.2)
				// mList=[]
				//listed(IList,mList)
			}
			else {d3.select('#'+c[1]).attr('stroke','gray').attr('stroke-width',0.5)}
		}
		var zoom = d3.zoom()
			.translateExtent([150, 450])
			.scaleExtent([1, 100])
			.on("zoom", zoomed);

		self.svg.select('g')

			.call(zoom);
		function zoomed() {



			self.svg.select('g')
				.attr("transform", "translate(" + d3.event.transform.x + "," + d3.event.transform.y + ") scale(" + d3.event.transform.k + ")");

			self.svg.call(d3.drag()
				.on("start", dragstarted)
				.on("drag", dragged)
				.on("end", dragended));

			function dragstarted(d) {
				d3.event.sourceEvent.stopPropagation();
				d3.select(this).classed("dragging", true);
			}

			function dragged(d) {
				d3.select(this).attr("x", d.x = d3.event.x).attr("y", d.y = d3.event.y);
			}

			function dragended(d) {
				d3.select(this).classed("dragging", false);
			}

		}

	})
	var quantize = d3.scaleQuantize()
		.domain([ 0, d3.max(nested_data, function (d){
//			console.log(d.values["length"]);
			return d.values["length"]
		}) ])
		.range(colorbrewer.GnBu[6])
//  .range(['whitesmoke','#ccebff','#99d6ff','#4db8ff','#0099ff','#3385ff','#005ce6']);

	var svg = d3.select("#map");

	svg.append("g")
		.attr("class", "legendQuant")
		.attr("transform", "translate(0,270)");

	var legend = d3.legendColor()
		.labels(["0-10", "10-20", "20-50", "50-120","120-130",">130"])
		.scale(quantize)

	// .orient('horizontal');

	svg.select(".legendQuant")
		.call(legend);

};


MapFilter.prototype.updateMap = function(movieList){
	var self=this
	var movieList=movieList
	d3.csv("data/countrycode.csv", function(error,data){country=data;

		self.drawMap(movieList,country,'none')})



}

//Do something
