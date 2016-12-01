


/*
 Constructor
 */
function MapFilter(movies, interactivity) {
    var self = this;

    self.interactivity = interactivity;
    self.movies = movies;

    self.div = d3.select("#map_filter_div");

    self.init();
};

MapFilter.prototype.init = function(){
	var self = this;
	d3.csv("data/movie_metadata.csv", function (error, data)

    {movies=data
	d3.csv("data/countrycode.csv",function(error,data){country=data
	
	//console.log(self.svg)
	
	self.div.append('input').attr('width',100).attr('height',100).attr('fill','blue').attr('type','submit').on ('click', function () {
	
		return search(d3.select(this.parentNode).select("#myVal").property("value"));
	})
	self.div.append('input').attr('width',100).attr('height',100).attr("type","text").attr("id","myVal").on('keyup',function () { 

		if (d3.event.keyCode == 13)
		
			
			//console.log(d3.select(this).property("value"));
			return search(d3.select(this).property("value"));
			
	
	});
	
    self.svg = self.div.append("svg").attr('height',400).attr('width',1000).attr('id','map');//.call(d3.zoom().on("zoom", function () {
    //self.svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
 // })).append('g')

	self.svg.append('g');
	
	function search(text) {
	self.drawMap(movies,country,text)
	//console.log(text);
	}
	
	
	function handleClick(){
		console.log("here")
		//console.log(document.getElementById("myVal").value)
		//draw(document.getElementById("myVal").value)
		return false;
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

	cList=[];
	//.attr("width","800").attr("height","700")
		var path = d3.geoPath().projection(projection)
	var count=0


    d3.json("data/world.json",function(json){//console.log(json)
    
    tooltip_render = function (tooltip_data) {
    var self = this;
    //var text = "<h2 class ="  + (tooltip_data) + " >" + tooltip_data.state + "</h2>";
    // text +=  "Electoral Votes: " + tooltip_data.electoralVotes;
//     text += "<ul>"
//     text += "</ul>";
	console.log(tooltip_data)
	var text = tooltip_data.state;
    return text;
}
    
        tip = d3.tip().attr('class', 'd3-tip')
        .direction('se')
        .offset(function() {
            return [0,0];
        })
        .html(function(d) {
        	 console.log(d)
           //  populate data in the following format
              tooltip_data = {
              "state": d.id
              }
             // pass this as an argument to the tooltip_render function then,
             // return the HTML content returned from that method.
             
            return tooltip_render(tooltip_data);
        });
    
		self.svg.call(tip);
    
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
            
            .on("mouseover",function(d){
            	d3.select(this).attr('stroke','#000099').attr('stroke-width',0.6);
            	
            	return tip.show;
            })       
            .on("mouseout",function(){d3.select(this).attr('stroke','white').attr('stroke-width',0.5);tip.hide})
			.on("click", function(d){d3.select(this).attr('stroke','white').attr('stroke-width',0.5);
			mList=[];//x= IList.includes('"'+d.id+'"'); 
			
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

			listed(IList,mList)

//call the year filter and genre and rating and table

//console.log(mList)

/*else if ('fill'=='green')
{d3.select(this).style('fill',function(d){ console.log('yes'); for (var j=0; j<countryList.length; j++){
c=countryList[j].key.split(',')
if (d.id==c[1]){console.log('yes');return colorScale(nested_data[j].values.length)}


}})}*/
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
	var zoom = d3.zoom()
		.translateExtent([150, 450])
		.scaleExtent([1, 100])
		.on("zoom", zoomed);
	
	self.svg.select('g')
// 		.call(zoom.translateBy, 150,450)
// 		.call(zoom.scaleBy, 200)
		.call(zoom);
	function listed(IList,mList){

        for (var i=0; i<IList.length; i++){for (var j=0; j<countryList.length; j++){
			c=countryList[j].key.split(',')
			if (IList[i]==c[1]){for (var k=0;k<movieList.length;k++){if (movieList[k].country==c[0]){mList.push(movieList[k])}}}}}
	console.log(mList)
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
		}
	function zoomed() {

//	console.log("here");	
	//console.log(d3.event);

// 	  self.svg
// 		  .call(zoom.translateBy, 10,10)
// 		  .call(zoom.scaleBy, 50);

	self.svg.select('g')
	.attr("transform", "translate(" + d3.event.transform.x + "," + d3.event.transform.y + ") scale(" + d3.event.transform.k + ")");

// 	  g.selectAll("path")
// 		  .attr("d", path);
	}

})


};


MapFilter.prototype.updateMap = function(movieList,country){
var self=this

/*var colorScale = d3.scaleQuantile()
			//.domain([20,1500]).range(['#ccebff','#0000b3'])
        .domain([10,20,50,120,130,1000])
        .range(['#ccebff','#99d6ff','#4db8ff','#0099ff','#3385ff','#005ce6'])

var nested_data= d3.nest().key(function(d){//console.log('yes')
return d.country}).entries(movieList)

var countryList=d3.nest().key(function(d){//console.log(d.code)
return [d.name,d.code]}).entries(country)

//console.log(nested_data[4].values.length)
//var hashMap={}
//forEach
list=[]
for (var i = 0; i < nested_data.length; i++) {
//console.log(nested_data[i].key)
for (var j=0; j<countryList.length; j++){
c=countryList[j].key.split(',')
//console.log(c[0])
if (nested_data[i].key==c[0]){d3.select('#'+c[1]).attr('fill',colorScale(nested_data[i].values.length))}

}

}
  
  //console.log(list)
    /*list.forEach(function(d){
		//console.log(d)
        d3.select('#map_filter_div').selectAll('#'+ d)
            .attr('fill','steelblue');

    })*/



}

    //Do something
    

