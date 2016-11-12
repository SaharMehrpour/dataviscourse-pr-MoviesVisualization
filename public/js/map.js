


function drawMap(world) {

    //(note that projection is global!
    // updateMap() will need it to add the winner/runner_up markers.)

    projection = d3.geoEquirectangular().scale(150).translate([500, 400]);


    // ******* TODO: PART IV *******
    //var path = d3.geoPath()
    //    .projection(projection);
    //svg.selectAll("path")
      //  .data(json.features)
        //.enter()
        //.append("path")
    //.attr("d", path);
   var svg = d3.select("#map").classed("content",true).append("svg");//.attr("width","800").attr("height","700")
    var path = d3.geoPath().projection(projection)
    d3.json("data/world.json",function(json){
        var map=svg.selectAll("path")
            .data(topojson.feature(json, json.objects.countries).features)
          map.exit().remove
          map.enter()
            .append("path")
            .attr("id",function(d){return d.id})
            .attr("d",path)
            .attr("stroke","black")
            .attr("fill", "none")
            .classed('countries',true);


    


    })
    // Draw the background (country outlines; hint: use #map)
    // Make sure and add gridlines to the map
    // Hint: assign an id to each country path to make it easier to select afterwards
    // we suggest you use the variable in the data element's .id field to set the id

    // Make sure and give your paths the appropriate class (see the .css selectors at
    // the top of the provided html file)


}



d3.json("data/world.json", function (error, world) {
    if (error) throw error;
    drawMap(world);
});