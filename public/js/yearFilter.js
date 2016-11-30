var genredata;
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
YearFilter.prototype.init = function() {
    // var selectedYears;
    // select based on brush
    //  self.interactivity.updatedYearFilter(selectedYears);

    var self = this;

    self.margin = {top: 10, right: 20, bottom: 30, left: 50};
    var divyearChart = d3.select("#year_filter_div");
    self.svgBounds = divyearChart.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 200;
    self.svg = divyearChart.append("svg")
        .attr("width", self.svgWidth)
        .attr("height", self.svgHeight);


    movies = self.movies
    genredata = movies;
    var data = d3.nest().key(function (d) {
        return Math.round(d["imdb_score"]);
    }).entries(movies);


    //genredata=data;
    //RatingGenreFilter.prototype.update(data);

    movies.forEach(function (d) {
        d.year = +d.title_year;
    });

    var data = d3.nest().key(function (d) {
        return d.year;
    }).sortKeys(d3.ascending).rollup(function (leaves) {
        return leaves.length;
    }).entries(movies);


    var x = d3.scaleTime().domain([1916, 2016]).range([0, self.svgWidth - 30]);
    var xaxis = d3.axisBottom(x).tickFormat(d3.format("d"));


    var areaFn = d3.area()
        .x(function (d) {
            return x(d.key);
        })
        .y0(self.svgHeight / 2)
        .y1(function (d) {
            return -Math.log(d.value) * 10 + self.svgHeight / 2;
        });

    self.svg.append("path")
        .attr("fill", "pink")
        .attr("d", areaFn(data))
    ;

    var lineFn = d3.line()
        .x(function (d) {
            return x(d.key);
        })
        .y(function (d) {
            return -Math.log(d.value) * 10 + self.svgHeight / 2;
        });

    var line = self.svg.append("path")
            .attr("fill", "none")
            .style("stroke", "darkmagenta")
            .style("stroke-width", "3px")
            .attr("d", lineFn(data))
        ;

    self.svg.append("g")
        .attr("transform", "translate(" + (0) + " ," +
            (self.svgHeight / 2) + ")")
        .call(xaxis)
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .style("font-family", "Times New Roman")
    ;


    var firstyear = 1916;
    var lastyear = 2016;
    startyear = self.svg.selectAll(".startyear").data([1]);
    startyear.exit().remove();
    startyear = startyear.enter().append("text").classed("startyear", "true").merge(startyear);
    startyear.text(firstyear + " - " + lastyear).attr("x", self.svgWidth / 2 - 40).attr("y", self.svgHeight / 2 - 70);


    function brushed() {


        var extent = brush.extent();
        var scale = -3;
        var interval = 69;
        var start = d3.event.selection[0] + scale;
        var end = d3.event.selection[1] + scale;
        firstyear = 1916 + (Math.floor(start / interval) * 10) + Math.floor((10 * (start % interval)) / interval);
        lastyear = 1916 + (Math.floor(end / interval) * 10) + Math.floor((10 * (end % interval)) / interval);

        //console.log(1910+(Math.floor(start/interval)*10)+Math.floor((10*(start%interval))/interval),
        //1910+(Math.floor(end/interval)*10)+Math.floor((10*(end%interval))/interval));
        //console.log(start,end);
        startyear.text(firstyear + " - " + lastyear).attr("x", self.svgWidth / 2 - 40).attr("y", self.svgHeight / 2 - 70);

/*
        var filterdata = genredata.filter(function (d) {
            return d.title_year > firstyear &&
                d.title_year < lastyear;
        });
        //console.log(filterdata);
        var updateddata = d3.nest().key(function (d) {
            return Math.round(d["imdb_score"]);
        }).entries(filterdata);
   */
        //(updateddata);


    };

    var leftHandle = self.svg.append("image")
        .attr("width", 25)
        .attr("height", 90)
        .attr("x", -100)
        .attr("xlink:href", 'images/yearFilter/left-handle.png');

    var rightHandle = self.svg.append("image")
        .attr("width", 25)
        .attr("height", 90)
        .attr("x", -100)
        .attr("xlink:href", 'images/yearFilter/right-handle.png');

    var brush = d3.brushX().extent([[8, self.svgHeight / 2 - 70], [self.svgWidth - 30, self.svgHeight / 2 + 20]])
        .on("end", brushed)
        .on("brush", function () {
            leftHandle.attr("x", d3.event.selection[0] - 16);
            leftHandle.attr("y", self.svgHeight / 2 - 60);
            rightHandle.attr("x", d3.event.selection[1] - 10);
            rightHandle.attr("y", self.svgHeight / 2 - 60);


        });


    var brushg = self.svg.append("g")
            .attr("transform", "translate(0,10)")
            .attr("class", "brush")
            .call(brush)
        ;

    resetBrush = function () {
        //console.log("za");
        // brushg.call(brush.extent([[0,0],[0,0]]));
        d3.select("brush").call(brush.extent([[0, 0], [0, 0]]));
    }


};

/**
 * update the chart according to the new movie set
 */
YearFilter.prototype.update = function (newMovieSet) {

    var self = this;

    // update the chart based on newMovieSet

};

