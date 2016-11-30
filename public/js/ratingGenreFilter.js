var MovieGenres = [
    "Drama","Action","Adventure","Comedy","Crime","Family","Fantasy",
    "Thriller","Sci-fi","Mystery","Romance","Horror","Other"];

var genresvg;
var leg;
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

    self.margin = {top: 10, right: 20, bottom: 30, left: 50};
    var divyearChart = d3.select("#rating_genre_filter_div");
    self.svgBounds = divyearChart.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 600;
    self.svg = divyearChart.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
        .attr("class","svgratinggenre");


    genresvg=self.svg;


    var x =  d3.scaleBand().domain(MovieGenres).range([10,self.svgWidth-50]);

    var xaxis=d3.axisBottom(x);

    self.svg.append("g")
        .attr("transform", "translate(30,480)")
        .call(xaxis)
        .attr("class","axistext")
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
        .attr("class","axistext")

    ;

    self.svg.append("text")
        .attr("transform",
            "translate(" + (self.svgWidth/2) + " ," +
            (self.svgHeight + self.margin.top - 30) + ")")
        .attr("class","xlabel")
        .text("Genre (Movies May Contain Multiple Genres)");

    self.svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 45 - self.margin.left)
        .attr("x", 350-(self.svgHeight ))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size","20px")
        .style("font-weight", "bold")
        .style("font-family", "Times New Roman")
        .text("Rating");


    self.svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(30,480)")
        .call(xaxis
            .tickSize(-(self.svgHeight-170))
            .tickFormat("")
        );

    self.svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(40,0)")
        //-43
        .call(yaxis
            .tickSize(-(self.svgWidth-80))
            .tickFormat("")
            .ticks(9)
        );


    leg=self.svg.append("g")
        .attr("class", "legend")
        .style("font-size",14)
        .attr("transform","translate(70,15)")
    ;
  /*  d3.csv("data/movie_metadata.csv", function (error, movies)
    {

        var data = d3.nest().key(function (d) {
            return Math.round(d["imdb_score"]);
        }).entries(movies);

        var filter=data.filter(function(d){
                return d.key>8;

        });

        console.log("filter2",filter);

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


        var color = d3.scaleQuantile().domain([min, max]).range(colorbrewer.Reds[8]);

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




       var linearSize = d3.scaleLinear().domain([min, max]).range([7,20]);
        var colorleg = d3.scaleLinear().domain([min, max]).range(colorbrewer.Reds[8]);


        leg = self.svg.append("g")
            .attr("class", "legendSize")
            .attr("transform", "translate(850, 70)");

        var legendSize = d3.legendSize()
            .scale(linearSize)
            .shape('circle')
            .shapePadding(15)
            .labelOffset(20)
           // .orient('horizontal')
        ;

        leg.call(legendSize);






    })*/

self.update(self.movies);



};

/**
 * update the chart according to the new movie set
 */
RatingGenreFilter.prototype.update = function(newMovieset) {

    var self = this;

    var data = d3.nest().key(function (d) {
        return Math.round(d["imdb_score"]);
    }).entries(newMovieset);

    self.svg=genresvg;

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
        var xscale = 51;
        var yscale = 42;
        var xindex=69;
        var yindex=55;
        for(i =0;i<=12;i++)
        {
            for(j =10;j>=2;j--)
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

    var min = d3.min(final, function (d)
        {
            return d.count;
        });

    var max = d3.max(final, function (d)
        {
            return d.count;
        });



    var color = d3.scaleQuantile()
                .domain([min, max])
                .range(colorbrewer.PuRd[8])
        ;

    var size = d3.scaleLinear()
            .domain([min, max])
            .range([Math.log(min+5)*3.5, Math.log(max)*3.5]);



    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    rating = self.svg.selectAll("circle").data(final);
    rating.exit().remove();
    rating = rating.enter().append("circle").classed("ratinggenre","true").merge(rating);


    rating
        .attr("r",function(d)
            {
                if(d.count>5)
                return size(d.count);
            })
        .attr("cy",function(d)
            {
                return d.y;
            })
        .attr("cx",function(d)
            {
                return d.x;
            })
        .style("fill", function (d)
            {
                return color(d.count);
            })
        .style("stroke","black")
        .on("mouseover", function(d)
        {

                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                 div.html("#movies" + "<br/>"  +d.count)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");

                 d3.select(this).style("fill","red");

        })
        .on("mouseout", function(d)
        {

                div.transition()
                .duration(500)
                .style("opacity", 0);

             d3.select(this).style("fill", function (d)
             {
                return color(d.count);
             });

        })
    ;


   // d3.selectAll(".legend").remove();

    var legendQuantile = d3.legendColor()
       .labelFormat(d3.format(",.0f"))
       .shape('circle')
       .shapePadding(60)
       .orient('horizontal')
       .labelOffset(7)
       .scale(color)
    ;
    leg.call(legendQuantile)
        //.selectAll("text")
        //.html( + "<br/>"  +"color")
       // .attr("transform", function(d) {return "rotate(-90)"})

    ;





    /*  var linearSize = d3.scaleLinear().domain([min, max]).range([7,20]);


         leg = self.svg.append("g")
             .attr("class", "legendSize")
             .attr("transform", "translate(40, 25)");

         var legendSize = d3.legendSize()
                 .scale(size)
                 .shape('circle')
                 .shapePadding(15)
                 .labelOffset(20)
                 .orient('horizontal')
             ;

         leg.call(legendSize);

 */





};

