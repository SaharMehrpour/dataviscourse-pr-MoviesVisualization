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
RatingGenreFilter.prototype.init = function() {

    var self = this;

    self.MovieGenres = [
        "Romance", "Action", "Adventure", "Comedy", "Crime", "Family", "Fantasy",
        "Thriller", "Sci-fi", "Mystery", "Drama", "Horror", "Other"];


   var tt = [];
    for (var i = 0; i < self.movies.length; i++) {
        tt = tt.concat(self.movies[i]["genres"].split("|"));
    }
    self.AllMovieGenres = tt.filter(function(d, i, self) {
        return self.indexOf(d) == i;
    });


    self.OtherList = self.AllMovieGenres.filter(function(val) {
        return self.MovieGenres.indexOf(val) == -1;
    });


    self.margin = {top: 10, right: 20, bottom: 30, left: 50};
    self.div=self.div .append("div").attr("class","ratingGenreContainer");;
    self.svgBounds = self.div .node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 600;
    self.svg = self.div .append("svg")
        .attr("width", self.svgWidth)
        .attr("height", self.svgHeight)
        .attr("class", "svgratinggenre");



    var x = d3.scaleBand().domain(self.MovieGenres).range([10, self.svgWidth - 50]);
    var xaxis = d3.axisBottom(x);

    self.svg.append("g")
        .attr("transform", "translate(30,480)")
        .call(xaxis)
        .attr("class", "axistext")
        .selectAll("text")
        .attr("transform", function (d) {
            return "rotate(-65)"
        });

    var y = d3.scaleLinear().domain([10, 0]).range([50, self.svgHeight - 120]);
    var yaxis = d3.axisLeft(y).tickFormat(d3.format("d"));

    self.svg.append("g")
        .attr("transform", "translate(40,0)")
        .call(yaxis)
        .attr("class", "axistext");

    self.svg.append("text")
        .attr("transform",
            "translate(" + (self.svgWidth / 2) + " ," +
            (self.svgHeight + self.margin.top - 30) + ")")
        .attr("class", "xlabel")
        .text("Genre (Movies May Contain Multiple Genres)");

    self.svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 45 - self.margin.left)
        .attr("x", 350 - (self.svgHeight ))
        .attr("dy", "0.9em")
        .attr("class", "xlabel")
        .text("Rating");

    /*
    self.svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(30,480)")
        .call(xaxis
            .tickSize(-(self.svgHeight - 170))
            .tickFormat("")
        );
        */

    self.svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(40,0)")
        .call(yaxis //83
            .tickSize(-(self.svgWidth - 60))
            .tickFormat("")
            .ticks(9)
        );


    self.leg = self.svg
        .append("g")
        .attr("class", "legend")
        .style("font-size", 14)
        .attr("transform", "translate(50,10)scale(0.8,0.8)");

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

    var GenresList = new Array(self.MovieGenres.length);
    for (var n = 0; n <= 10; n++) GenresList[n] = new Array(25);

    for (var i = 0; i <= 10; i++)
        for (var j = 0; j < self.MovieGenres.length; j++)
            GenresList[i][j] = 0;

    var temp = data.filter(function (d) {
       for (var i = 0; i < d.values.length; i++) {
                if(d.values[i]["genres"].indexOf("Romance")!=-1) GenresList[d.key][0]++;
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
                if(d.values[i]["genres"].indexOf("Drama")!=-1) GenresList[d.key][10]++;
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
           // }
        }
    });

    var x = d3.scaleBand().domain(self.MovieGenres).range([10, self.svgWidth - 50]);
    var y = d3.scaleLinear().domain([10, 0]).range([50, self.svgHeight - 120]);


    var final = new Array();
    var xscale = 20;
    var yscale = 42;
    var xindex = 69;
    var yindex = 55;
    for (var m = 0; m < self.MovieGenres.length; m++) {
        for (var l = 10; l >= 2; l--) {
            var movie = {};
            movie.genre = self.MovieGenres[m];
            movie.rating = l;
            movie.x = xindex;
            movie.y = yindex;
            yindex = yindex + yscale;
            movie.count = GenresList[l][m];
            final.push(movie);
        }
        xindex = xindex + xscale;
        yindex = 55;
    }

    var min = d3.min(final, function (d) {
        return d.count;
    });

    var max = d3.max(final, function (d) {
        return d.count;
    });


    var color = d3.scaleQuantile()
        .domain([min, max])
        .range(colorbrewer.YlGnBu[8]);

    var size = d3.scaleLinear()
        .domain([min, max])
        .range([Math.log(min + 5) * 3.5, Math.log(y(1)/2)*3.5]);


    var div = self.div.append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    var rating = self.svg.selectAll("circle").filter(function () {
        return d3.select(this).classed("ratinggenre");
    }).data(final);
    rating.exit().remove();
    rating = rating.enter().append("circle").attr("class","ratinggenre").merge(rating);


    rating
        .attr("r", function (d) {
            if (d.count > 5)
                return size(d.count);
        })
        .attr("cy", function (d) {
            //return d.y;
            return y(d["rating"]);
        })
        .attr("cx", function (d) {
            //return d.x;
            //56
            console.log(self.svgWidth/13);
            return x(d["genre"])+56;
        })
        .style("fill", function (d) {
            return color(d.count);
        })
        .style("stroke", "black")
        .on("mouseover", function (d) {

            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("#movies" + "<br/>" + d.count)
               // .style("left", (d3.event.pageX)/2 +200+ "px")
                //.style("top", (d3.event.pageY)/2+150 + "px");
                .style("left", +(d3.select(this).attr("cx"))-20+ "px")
                .style("top", +(d3.select(this).attr("cy"))+200 + "px");

            d3.select(this).style("fill", "#ff6600");

        })
        .on("mouseout", function (d) {

            div.transition()
                .duration(500)
                .style("opacity", 0);

            d3.select(this).style("fill", function (d) {
                return color(d.count);
            });

        })
        .on("click", function (d)
        {
            var check = d3.select(this).classed("selected");
            if (check) {
                d3.select(this).classed("selected", false);
            }
            else {
                d3.select(this).classed("selected", true);
            }

            var selectedRatingGenres = [];
            var selectedCircles = self.svg.selectAll("circle").filter(function(){
                return d3.select(this).classed("selected")
            })
                .each(function(d){
                    var tempRating = d["rating"];

                    if(d["genre"] == 'Other')
                    {
                        for (var i = 0; i < self.OtherList.length; i++)
                        {
                            selectedRatingGenres.push([self.OtherList[i],tempRating]);
                        }
                    }
                    else{
                        selectedRatingGenres.push([d["genre"],tempRating]);
                    }
                });

            self.interactivity.updatedGenreRatingFilter(selectedRatingGenres);

        });



    var legendQuantile = d3.legendColor()
            .labelFormat(d3.format(".2s"))
            .shape('circle')
            .shapePadding(50)
            .orient('horizontal')
            .labelOffset(7)
            .scale(color)
        ;
    self.leg.call(legendQuantile);


};


/*
 self.div.select(".legend").selectAll("text").html(function(){
 var temp= d3.select(this).text();
 var split=temp.split(" ");
 console.log(split);

 // temp.html()
 // var format=d3.format(".3")
 //d3.select(this).text("Sahar");
 // div.html("#movies" + "<br/>" + d.count)
 return split[0]+ "<br/>" + split[2];

 })
 */
/*
 d3.nest().key (function (d) {
 return d["imdb_score"]
 })
 .rollup(function(leaves){
 var countGenres = [];
 for(var genre in self.MovieGenres) {
 var tmp = 0;
 for (var l in leaves) {
 if (l["genres"].indexOf(genre) != -1)
 tmp++;
 countGenres.append({"genre": genre, "value": tmp});
 }
 }
 }).entries(newMovieset);
 */


/*
 *  Add three buttons to the view: Select All, Clear All, Apply
 *
 *  "Select All".on("click", function(){
 *      self.svg.selectAll("circle").filter(function(){
 *          return d3.select(this).classed("ratinggenre")
 *          })
 *          .classed("selected",true);
 *      })
 *
 *  "Clear All".on("click", function(){
 *      self.svg.selectAll("circle").filter(function(){
 *          return d3.select(this).classed("ratinggenre")
 *          })
 *          .classed("selected",false);
 *      })
 *
 *
 *   "Apply".on("click", function(){
 *      var selectedRating = [];
 *      var selectedGenres = []
 *      var selectedCircles = self.svg.selectAll("circle").filter(function(){
 *          return d3.select(this).classed("selected")
 *          })
 *          .each(function(d){
 *              if(d["genre"] == 'Other'){
 *                  selectedRating.push(OtherList);
 *              }
 *              else{
 *                  selectedRating.push(d["genre"]);
 *              }
 *              selectedGenres.push(d["rating"]);
 *          });
 *
 *          self.interactivity.updatedGenreRatingFilter([selectedRating,selectedGenres]);
 *      })
 */



