
/*
Constructor
 */
function YearFilter(movies, interactivity) {
    var self = this;

    self.interactivity = interactivity;
    self.movies = movies;

    self.div = d3.select("#year_filter_div").classed("content",true);

    self.init();
};

/**
 * Initializes the chart
 */
YearFilter.prototype.init = function(){

   // var self = this;

   // var selectedYears;
    // select based on brush
  //  self.interactivity.updatedYearFilter(selectedYears);

    var self = this;
    self.margin = {top: 10, right: 20, bottom: 30, left: 50};
    var divyearChart = d3.select("#year_filter_div");
    self.svgBounds = divyearChart.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 100;
    self.svg = divyearChart.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight);


    var x =  d3.scaleLinear().domain([1910,2020]).range([10,self.svgWidth-30]);
    var xaxis=d3.axisBottom(x).tickFormat(d3.format("d"));

    self.svg.append("g")
        .attr("transform", "translate(10,40)")
        .call(xaxis)
        .style("font-size","20px")
        .style("font-weight", "bold")
        .style("font-family", "Times New Roman")
     ;

    function brushed() {
        var extent = brush.extent();
        var scale=-17;
        var interval=82;
        var start=d3.event.selection[0]+scale;
        var end=d3.event.selection[1]+scale;
        //console.log(d3.event.selection[0],d3.event.selection[1]);
       console.log(1910+(Math.floor(start/interval)*10)+Math.floor((10*(start%interval))/interval),
           1910+(Math.floor(end/interval)*10)+Math.floor((10*(end%interval))/interval));

    };

    var brush = d3.brushX().extent([[0,0],[self.svgWidth,self.svgHeight-50]])
        .on("end", brushed);

    self.svg.append("g")
        .attr("transform", "translate(0,20)")
        .attr("class", "brush").call(brush);




};

/**
 * update the chart according to the new movie set
 */
YearFilter.prototype.update = function (newMovieSet) {

    var self = this;

    // update the chart based on newMovieSet

};

