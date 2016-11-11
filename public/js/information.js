
/*
 Constructor
 */
function Information(movies, oscarActors, oscarActresses, oscarDirector, oscarPictures, interactivity) {
    var self = this;

    self.interactivity = interactivity;
    self.movies = movies;
    self.oscarActors = oscarActors;
    self.oscarActresses = oscarActresses;
    self.oscarDirector = oscarDirector;
    self.oscarPictures = oscarPictures;

    self.div = d3.select("#information_div");

    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
Information.prototype.init = function() {

    var self = this;

    self.div.append("h1")
        .attr("id", "info_movie_title");
    self.div.append("span")
        .attr("id", "academy_logo");
    self.div.append("h2")
        .attr("id", "director");
    self.div.append("h2")
        .attr("id", "actor_1");
    self.div.append("h2")
        .attr("id", "actor_2");
    self.div.append("h2")
        .attr("id", "actor_3");
    self.div.append("h3")
        .attr("id", "gross");
    self.div.append("h3")
        .attr("id", "budget");
    self.div.append("p")
        .attr("id","plot");
    self.div.append("img")
        .attr("id", "poster");

    var data = d3.nest().key(function (d) {
        return d["country"]
    }).rollup(function (leaves) {
        return d3.nest().key(function (g) {
            return g["title_year"];
        }).entries(leaves);
    })
        .entries(self.movies);
    data.sort(function (a,b) {
        return d3.descending(a.key,b.key);
    });


// Update

    var selectedMovie = self.movies[35];

    // Data Binding

    var nestedDataDirector = d3.nest().key(function (d) {
        return d["director_name"];
    }).entries(self.movies);

    var directorMovie = nestedDataDirector.filter(function (d) {
        return d.key === selectedMovie["director_name"];
    })[0];


    var nestedDataActor1 = d3.nest().key(function (d) {
        return d["actor_1_name"];
    }).entries(self.movies);

    var actor1Movie = nestedDataActor1.filter(function (d) {
        return d.key === selectedMovie["actor_1_name"];
    })[0];

    var nestedDataActor2 = d3.nest().key(function (d) {
        return d["actor_2_name"];
    }).entries(self.movies);

    var actor2Movie = nestedDataActor2.filter(function (d) {
        return d.key === selectedMovie["actor_2_name"];
    })[0];

    var nestedDataActor3 = d3.nest().key(function (d) {
        return d["actor_3_name"];
    }).entries(self.movies);

    var actor3Movie = nestedDataActor3.filter(function (d) {
        return d.key === selectedMovie["actor_3_name"];
    })[0];

    // Updating the div

    self.div.select("#info_movie_title")
        .text(selectedMovie["movie_title"] + " (" + selectedMovie["title_year"] + ")");

    self.div.select("#director")
        .text(selectedMovie["director_name"] + " (" + directorMovie.values.length + " movies)");
    self.div.select("#actor_1")
        .text(selectedMovie["actor_1_name"] + " (" + actor1Movie.values.length + " movies)");
    self.div.select("#actor_2")
        .text(selectedMovie["actor_2_name"] + " (" + actor2Movie.values.length + " movies)");
    self.div.select("#actor_3")
        .text(selectedMovie["actor_3_name"] + " (" + actor3Movie.values.length + " movies)");
    self.div.select("#gross")
        .text("Gross: " + d3.format(',')(+selectedMovie["gross"]));
    self.div.select("#budget")
        .text("Budget: " + d3.format(',')(+selectedMovie["budget"]));

    var posterURL = self.getPosterAndPlot(selectedMovie["movie_imdb_link"]);
    self.getAcademyInfo(selectedMovie);

};

/*
 Fill the form
 */
Information.prototype.update = function(selectedMovie) {
    var self = this;



};

Information.prototype.getPosterAndPlot = function (imdbURL) {

    var self = this;
    var splittedHash = imdbURL.split("/");

    var jsonSite = "http://www.omdbapi.com/?i=" + splittedHash[4];

    d3.json(jsonSite,function (json) {
        //console.log(json);

        self.div.select("#poster")
            .attr("src", json["Poster"]);

        self.div.select("#plot")
            .text(json["Plot"]);
    });

};

Information.prototype.getAcademyInfo = function (selectedMovie) {

    var self = this;

    var academyPicture = self.oscarPictures
        .filter(function (d) {
            return (d["name"].indexOf(selectedMovie["movie_title"]) !== -1
            || selectedMovie["movie_title"].indexOf(d["name"]) !== -1)
        });

    var academyActor = self.oscarActors
        .filter(function (d) {
            return (d["name"].indexOf(selectedMovie["movie_title"]) !== -1
            || selectedMovie["movie_title"].indexOf(d["name"]) !== -1)
        });

    var academyActress = self.oscarActresses
        .filter(function (d) {
            return (d["name"].indexOf(selectedMovie["movie_title"]) !== -1
            || selectedMovie["movie_title"].indexOf(d["name"]) !== -1)
        });

    var academyDirector = self.oscarDirector
        .filter(function (d) {
            return (d["name"].indexOf(selectedMovie["movie_title"]) !== -1
            || selectedMovie["movie_title"].indexOf(d["name"]) !== -1)
        });

    var oscars = [];
    if (academyPicture.length === 1)
        oscars.push(1);
    if (academyActor.length === 1)
        oscars.push(1);
    if (academyActress.length === 1)
        oscars.push(1);
    if (academyDirector.length === 1)
        oscars.push(1);


    self.div.select("#academy_logo")
        .selectAll("img")
        .data(oscars)
        .enter()
        .append("img")
        .attr("src","data/academy.jpg")


};

