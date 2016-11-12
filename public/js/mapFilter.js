
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
	self.drawMap();
}
/**
 * Initializes the svg elements required for this chart
 */
MapFilter.prototype.drawMap = function(){

    // Draw map
    var self = this;

    projection = d3.geoMercator().scale(70).translate([250, 200]);
//This will not be the final projection. Just using this as a rough draft.


    var svg = self.div.append("g").append("svg").attr('height',700).attr('width',900)//.attr("width","800").attr("height","700")
    var path = d3.geoPath().projection(projection)

    d3.json("data/world.json",function(json){
        var map=svg.selectAll("path")
            .data(topojson.feature(json, json.objects.countries).features)
        map.exit().remove
        map.enter()
            .append("path")
            .attr("id",function(d){return d.id})
            .attr("d",path)
            .attr("stroke","white")
            .attr("fill", "black")
            .attr("opacity",0.75)



    })

};


