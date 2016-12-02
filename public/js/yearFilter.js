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

    var self = this;

    self.movies.forEach(function (d)
    {
        d.year = +d.title_year;
    });

    self.margin = {top: 10, right: 20, bottom: 30, left: 50};
    self.div=self.div.append("div").attr("class","yearFilterContainer");
    self.svgBounds = self.div.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 150;
    self.svg = self.div.append("svg")
        .attr("width", self.svgWidth)
        .attr("height", self.svgHeight)
        .attr("class","yearFilterSvg")
    ;

    var xscale=30;
    var x = d3.scaleTime().domain([1916, 2016]).range([0, self.svgWidth - xscale]);
    var xaxis = d3.axisBottom(x).tickFormat(d3.format("d"));

    self.svg.append("g")
        .attr("transform", "translate(0 ," + (self.svgHeight / 2) + ")")
        .call(xaxis)
        .attr("class","Year_xaxis_Text")
    ;



    var years=[1916,2016];
    var yearselcted = self.svg.selectAll(".text_year_selcted").data(years);
    yearselcted.exit().remove();
    yearselcted = yearselcted.enter().append("text").classed("text_year_selcted", "true").merge(yearselcted);
    yearselcted
        .text(function(d)
        {
        return years[0]+" - "+years[1];
        })
        .attr("x", self.svgWidth / 2 - 40)
        .attr("y", self.svgHeight / 2 - 60)

    ;


    function brushed()
    {

      var extent = brush.extent();

        //console.log(self.)
        var scale = -3;
       // var interval = 67;
        var interval=Math.floor(self.svgWidth/10+scale);
        var start = d3.event.selection[0] + scale;
        var end = d3.event.selection[1] + scale;
        firstyear = 1916 + (Math.floor(start / interval) * 10) + Math.floor((10 * (start % interval)) / interval);
        lastyear = 1916 + (Math.floor(end / interval) * 10) + Math.floor((10 * (end % interval)) / interval);

        yearselcted.text(firstyear + " - " + lastyear);
        self.interactivity.updatedYearFilter([firstyear,lastyear]);

    };

    self.svg.append("path")
        .attr("id", "yearPath");

    self.svg.append("path")
        .attr("id","yearLine");

    self.update(self.movies);


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

    var brush = d3.brushX().extent([[7, self.svgHeight / 2 - 70], [self.svgWidth-xscale, self.svgHeight / 2 + 20]])
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



};

/**
 * update the chart according to the new movie set
 */
YearFilter.prototype.update = function (newMovieSet) {

    var self = this;

    var x = d3.scaleTime().domain([1916, 2016]).range([0, self.svgWidth-30 ]);

    newMovieSet = newMovieSet.filter(function(d){
        return d.year>0;
    });

    var data = d3.nest().key(function (d) {
        return d.year;
    }).sortKeys(d3.ascending).rollup(function (leaves) {
        return leaves.length;
    }).entries(newMovieSet);

    var areaFn = d3.area()
        .x(function (d) {
            return x(d.key);
        })
        .y0(self.svgHeight / 2)
        .y1(function (d) {

                return -Math.log(d.value) * 10 + self.svgHeight / 2;
        });

    self.div.select("#yearPath")
        .attr("d", areaFn(data))
    ;

    var lineFn = d3.line()
        .x(function (d) {
            return x(d.key);
        })
        .y(function (d) {
            return -Math.log(d.value) * 10 + self.svgHeight / 2;
        });

    self.div.select("#yearLine")
        .attr("d", lineFn(data))
    ;

};

