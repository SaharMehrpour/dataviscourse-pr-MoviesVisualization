


/*
 Constructor
 */
function MapFilter(movies, interactivity) {
    var self = this;

    self.interactivity = interactivity;
    self.movies = movies;

    self.div = d3.select("#map_filter_div").append('div').style('padding','25px');

    self.init();
};

MapFilter.prototype.init = function(){
	var self = this;
	d3.csv("data/movie_metadata.csv", function (error, data)

    {movies=data
	d3.csv("data/countrycode.csv",function(error,data){country=data
	
	//console.log(self.svg)
	

	self.div.append('input').attr('width',100).attr('height',100).attr("type","text").attr("id","myVal").on('keyup',function () { 

		if (d3.event.keyCode == 13)
		
			
			//console.log(d3.select(this).property("value"));
			return search(d3.select(this).property("value"));
			
	
	});
		self.div.append('input').attr('width',100).attr('height',100).attr('fill','blue').attr('type','submit').on ('click', function () {
	
		return search(d3.select(this.parentNode).select("#myVal").property("value"));
	})
	
    self.svg = self.div.append("svg").attr('padding','10').attr('height',400).attr('width',1000).attr('id','map');//.call(d3.zoom().on("zoom", function () {
    //self.svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
 // })).append('g')
	//self.svg=self.div.append("svg").
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
	var colorScale = d3.scaleQuantile()
				//.domain([20,1500]).range(['#ccebff','#0000b3'])
			.domain([10,20,50,120,130,1000])
			.range(['#ccebff','#99d6ff','#4db8ff','#0099ff','#3385ff','#005ce6'])

	var nested_data= d3.nest().key(function(d){//console.log('yes')
	return d.country}).entries(movieList)


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


    d3.json("data/world.json",function(json){//console.log(json)
    
   //  tooltip_render = function (tooltip_data) {
//     var self = this;
//     //var text = "<h2 class ="  + (tooltip_data) + " >" + tooltip_data.state + "</h2>";
//     // text +=  "Electoral Votes: " + tooltip_data.electoralVotes;
// //     text += "<ul>"
// //     text += "</ul>";
// 	console.log(tooltip_data)
// 	var text = tooltip_data.state;
//     return text;
// }
//     
//         tip = d3.tip().attr('class', 'd3-tip')
//         .direction('se')
//         .offset(function() {
//             return [0,0];
//         })
//         .html(function(d) {
//         	 console.log("yes")
//            //  populate data in the following format
//               tooltip_data = {
//               "state": 'yes'
//               }
//              // pass this as an argument to the tooltip_render function then,
//              // return the HTML content returned from that method.
//              
//             return tooltip_render(tooltip_data);
//         });
//     
// 		self.svg.select('g').call(tip);

// var tip = d3.tip()
//       .attr("class", "d3-tip")
//       .offset([-8, 0])
//       .html(function(d) { console.log(d.id);return "Radius: " + d.id; });
//     self.svg.select('g').call(tip);
//         var div = self.div.append("div")
//         .attr("class", "tooltip")
//         .style("opacity", function(d){//console.log("yes; I exist");
//         return 0});

        var tooltip = d3.select('#map_filter_div').append('div')
            .style('display', 'none');
        var map=self.svg.select('g').selectAll("path")
            .data(topojson.feature(json, json.objects.countries).features)
        map.exit().remove
        map.enter()
            .append("path")
            .attr('id',function(d){//console.log(movieList[6].country)
            return d.id})
            .attr("d",path)
            .attr("stroke","white")
            .attr("stroke-width",0.5)
            .attr('transform','translate(20,60)')
            .attr("fill", "whitesmoke")
            .attr("opacity",0.75)
            //#000099
            .on("mouseover",function(d){
             var mouse = d3.mouse(svg.node()).map(function(d) {//console.log(parseInt(d))
                        return parseInt(d);
                    });
            tooltip//classed('hidden', false)
            		.attr('color', '#222')
        			.attr('background-color', '#fff')
        //padding: .5em;
        //text-shadow: #f5f5f5 0 1px 0;
        //border-radius: 2px;
        			.attr('opacity', 0.9)
       				.attr('position', 'absolute')
                    .attr('style', 'left:' + (mouse[0] + 15) +
                         'px; top:' + (mouse[1] - 35) + 'px')
                    .html("yes");
            
// 			div.transition()
//                 .duration(5)
//                 .style("opacity", .9);
//             div.html("#movies" + "<br/>" + d.id)
//                // .style("left", (d3.event.pageX)/2 +200+ "px")
//                 //.style("top", (d3.event.pageY)/2+150 + "px");
//                 .style("left", +(d3.select(this).attr("cx"))-20+ "px")
//                 .style("top", +(d3.select(this).attr("cy"))+20 + "px");
// 					//.classed('yearText',true)
					
				d3.select(this).attr('stroke','black').attr('stroke-width',0.6);
            })       
            .on("mouseout",function(){
            tooltip.style('display','none');
//              div.transition()
         //        .duration(5)
//                 .style("opacity", 0);
            d3.select(this).attr('stroke','white').attr('stroke-width',0.5);
            //tip.hide
            })
			
			.on("click", function(d){d3.selectAll(this).attr('stroke','white').attr('stroke-width',0.5);
			cList=[];//x= IList.includes('"'+d.id+'"'); 
			
			if ((IList.includes(d.id))==true){
				var ind=IList.indexOf(d.id);console.log(ind);IList.splice(ind,1);d3.select(this).style('fill',function(d){ 
				for (var j=0; j<countryList.length; j++){
					c=countryList[j].key.split(',')
					if (d.id==c[1]){for (var k=0;k<nested_data.length;k++){if (c[0]==nested_data.key){return colorScale(nested_data[i].values.length)}}}


			}})}
			else

				{d3.select(this).style("fill","#ff6600");
				for (var j=0; j<countryList.length; j++){
			c=countryList[j].key.split(',')
			if (d.id==c[1]){IList.push(d.id);
			}}}

			listed(IList,cList)

// //call the year filter and genre and rating and table
// 
// //console.log(mList)
// 
// /*else if ('fill'=='green')
// {d3.select(this).style('fill',function(d){ console.log('yes'); for (var j=0; j<countryList.length; j++){
// c=countryList[j].key.split(',')
// if (d.id==c[1]){console.log('yes');return colorScale(nested_data[j].values.length)}
// 
// 
// }})}*/
 })

//console.log(nested_data[4].values.length)
//var hashMap={}
//forEach
	list=[]
	for (var i = 0; i < nested_data.length; i++) {
	//console.log(nested_data[i].key)
	for (var j=0; j<countryList.length; j++){
	c=countryList[j].key.split(',')
	//console.log(c[0])
	if (nested_data[i].key==c[0]){d3.select('#'+c[1]).attr('fill',colorScale(nested_data[i].values.length))}}}

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
        d3.select('#'+c[1]).attr('stroke','orange').attr('stroke-width',1)
       // mList=[]
        //listed(IList,mList)
   		 }
   		 else {d3.select('#'+c[1]).attr('stroke','white').attr('stroke-width',0.5)}
		}
		var zoom = d3.zoom()
		.translateExtent([150, 450])
		.scaleExtent([1, 100])
		.on("zoom", zoomed);
	
	self.svg.select('g')
// 		.call(zoom.translateBy, 150,450)
// 		.call(zoom.scaleBy, 200)
		.call(zoom);
	function zoomed() {

//	console.log("here");	
	//console.log(d3.event);

// 	  self.svg
// 		  .call(zoom.translateBy, 10,10)
// 		  .call(zoom.scaleBy, 50);

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
// var drag=d3.drag()
// 	.origin(function(d) { return d; })
//     .on("dragstart", dragstarted)
//     .on("drag", dragged)
//     .on("dragend", dragended);
// // 	  g.selectAll("path")
// self.svg.select('g').call(drag)
// function dragstarted(d) {
//   d3.event.sourceEvent.stopPropagation();
//   d3.select(this).classed("dragging", true);
// }
// 
// function dragged(d) {
//   d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
// }
// 
// function dragended(d) {
//   d3.select(this).classed("dragging", false);
// }
// 		  .attr("d", path);
	}

})
var quantize = d3.scaleQuantize()
  .domain([ 0, d3.max(nested_data, function (d){
//			console.log(d.values["length"]);
            return d.values["length"]
            }) ])
  .range(['whitesmoke','#ccebff','#99d6ff','#4db8ff','#0099ff','#3385ff','#005ce6']);

var svg = d3.select("#map");

svg.append("g")
  .attr("class", "legendQuant")
  .attr("transform", "translate(0,270)");

var legend = d3.legendColor()
.labels(["0-20", "20-50", "50-120", "120-150","150-500","500-1000", ">1000"])
  //.labelFormat(d3.format("%"))
  //.useClass(true)
  .scale(quantize)

 // .orient('horizontal');

svg.select(".legendQuant")
  .call(legend);

};


MapFilter.prototype.updateMap = function(movieList){
var self=this

d3.csv("data/countrycode.csv", function(error,data){country=data;

self.drawMap(movieList,country,'none')})



}

    //Do something
    

