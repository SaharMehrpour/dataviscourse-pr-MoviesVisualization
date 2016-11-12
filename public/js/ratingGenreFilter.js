
/*
 Constructor
 */
function RatingGenreFilter(movies, interactivity) {
    var self = this;

    self.interactivity = interactivity;
    self.movies = movies;
    self.div = d3.select("#rating_genre_filter_div").classed("content",true);

    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
RatingGenreFilter.prototype.init = function(){

    var self = this;

    // var selectedGenreRating;
    // select from the chart
    // self.interactivity.updatedGenreRatingFilter(selectedGenreRating);

    var self = this;
    self.margin = {top: 10, right: 20, bottom: 30, left: 50};
    var divyearChart = d3.select("#rating_genre_filter_div");
    self.svgBounds = divyearChart.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 600;
    self.svg = divyearChart.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
        .style("background-color", "Tan");

//"Action","Adventure","Animation","Comedy","Crime","Family","Fantasy","Thriller","Sci-Fi","Drama","Mystery"
    // ,"Romance","Biography","History"," War","Horror","Sport","Western","Documentary","Music/Musical","Short","Film-Noir"
    //,"News","Reality-TV","Game-Show"

    var MovieGenres = [
        "Drama","Action","Adventure","Comedy","Crime","Family","Fantasy","Thriller","Sci-fi","Mystery","Romance","Horror","Other"
    ];

    var x =  d3.scaleBand().domain(MovieGenres).range([10,self.svgWidth-50]);

    var xaxis=d3.axisBottom(x);

    self.svg.append("g")
        .attr("transform", "translate(30,480)")
        .call(xaxis)
        .style("font-size","15px")
        .style("font-weight", "bold")
        .style("font-family", "Times New Roman")
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-65)"
        });

    var y =  d3.scaleLinear().domain([10,0]).range([50,self.svgHeight-120]);
    var yaxis=d3.axisLeft(y).tickFormat(d3.format("d"));

    self.svg.append("g")
        .attr("transform", "translate(40,0)")
        .call(yaxis)
        .style("font-size","17px")
        .style("font-weight", "bold")
        .style("font-family", "Times New Roman")
    ;

    d3.csv("data/movie_metadata.csv", function (error, movies)
    {
        //console.log(movies);
        var data = d3.nest().key(function (d) {
            return Math.round(d["imdb_score"]);
        }).entries(movies);

        //   console.log(data);
        var GenresList = new Array(13);
        for (i=0; i<=10; i++) GenresList[i]=new Array(25);

        for(i=0;i<=10;i++)
            for(j=0;j<=12;j++)
                GenresList[i][j]=0;

        var temp = data.filter(function (d)
        {
            for( i=0;i<d.values.length;i++)
            {

                if(d.values[i]["genres"].indexOf("Drama")!=-1) GenresList[d.key][0]++;
                if(d.values[i]["genres"].indexOf("Action")!=-1) GenresList[d.key][1]++;
                if(d.values[i]["genres"].indexOf("Adventure")!=-1) GenresList[d.key][2]++;
                if(d.values[i]["genres"].indexOf("Animation")!=-1) GenresList[d.key][12]++;
                if(d.values[i]["genres"].indexOf("Comedy")!=-1) GenresList[d.key][3]++;
                if(d.values[i]["genres"].indexOf("Crime")!=-1) GenresList[d.key][4]++;
                if(d.values[i]["genres"].indexOf("Family")!=-1) GenresList[d.key][5]++;
                if(d.values[i]["genres"].indexOf("Fantasy")!=-1) GenresList[d.key][6]++;
                if(d.values[i]["genres"].indexOf("Thriller")!=-1) GenresList[d.key][7]++;
                if(d.values[i]["genres"].indexOf("Sci")!=-1) GenresList[d.key][8]++;
                if(d.values[i]["genres"].indexOf("Mystery")!=-1) GenresList[d.key][9]++;
                if(d.values[i]["genres"].indexOf("Romance")!=-1) GenresList[d.key][10]++;
                if(d.values[i]["genres"].indexOf("Biography")!=-1) GenresList[d.key][12]++;
                if(d.values[i]["genres"].indexOf("History")!=-1) GenresList[d.key][12]++;
                if(d.values[i]["genres"].indexOf("War")!=-1) GenresList[d.key][12]++;
                if(d.values[i]["genres"].indexOf("Horror")!=-1) GenresList[d.key][11]++;
                if(d.values[i]["genres"].indexOf("Sport")!=-1) GenresList[d.key][12]++;
                if(d.values[i]["genres"].indexOf("Western")!=-1) GenresList[d.key][12]++;
                if(d.values[i]["genres"].indexOf("Documentary")!=-1) GenresList[d.key][12]++;
                if(d.values[i]["genres"].indexOf("Music")!=-1) GenresList[d.key][12]++;
                if(d.values[i]["genres"].indexOf("Musical")!=-1) GenresList[d.key][12]++;
                if(d.values[i]["genres"].indexOf("Short")!=-1) GenresList[d.key][12]++;
                if(d.values[i]["genres"].indexOf("Film-Noir")!=-1) GenresList[d.key][12]++;
                if(d.values[i]["genres"].indexOf("News")!=-1) GenresList[d.key][12]++;
                if(d.values[i]["genres"].indexOf("Reality-TV")!=-1) GenresList[d.key][12]++;
                if(d.values[i]["genres"].indexOf("Game-Show")!=-1) GenresList[d.key][12]++;
            }

            return null;
        });


        var final = new Array();
        var xscale = 60;
        var yscale = 42;
        var xindex=70;
        var yindex=55;
        for(i =0;i<=12;i++)
        {
            for(j =2;j<=10;j++)
            {
                var movie ={};
                movie.name = MovieGenres[i] + " " +j;
                movie.x = xindex;
                movie.y = yindex;
                yindex=yindex+yscale;
                movie.count = GenresList[j][i];
                final.push(movie);
            }
            xindex=xindex+xscale;
            yindex=55;
        }

        var min = d3.min(final, function (d) {
            return d.count;
        });

        var max = d3.max(final, function (d) {
            return d.count;
        });

        var range = ["#0066CC", "#0080FF", "#3399FF", "#66B2FF", "#99ccff", "#CCE5FF", "#ffcccc", "#ff9999", "#ff6666", "#ff3333", "#FF0000", "#CC0000"];
        var color = d3.scaleQuantile().domain([min, max]).range(range);

            //d3.scaleLinear().domain([min, max]).range(["yellow", "green"]);

        var size = d3.scaleLinear()
            .domain([min, max])
            .range([7, 20]);

        self.svg.selectAll("circle").data(final)
            .enter().append("circle")
            .attr("r",function(d)
            {
                if(d.count<15) return 0;
                else return size(d.count);
            })
            .attr("cy",function(d)
            {
                return d.y;
            })
            .attr("cx",function(d)
            {
                return d.x;
            })
            .style("fill", function (d) {
                return color(d.count);
            })

        leg=self.svg.append("g")
            .attr("class", "legendQuantile")
            .style("font-size",10)
            .attr("transform","translate(50,20)");

        var legendQuantile = d3.legendColor()
                .shapeWidth(70)
                .cells(10)
                .orient('horizontal')
                .scale(color)
            ;

        leg.call(legendQuantile);







    })





};

/**
 * update the chart according to the new movie set
 */
RatingGenreFilter.prototype.update = function(newMovieSet) {
    var self = this;

};

