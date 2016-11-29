
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

    self.movieDataTemplate = [
        {
            "divName": "directorDivInfo",
            "info": [
                {"value0": {"value": "Director", "class": "title", "id": ""}},
                {"value1": {"value": "", "class": "info", "id": "directorInfo"}}]
        },
        {
            "divName": "actor1DivInfo",
            "info": [
                {"value0": {"value": "First Actor", "class": "title", "id": ""}},
                {"value1": {"value": "", "class": "info", "id": "actor1Info"}}]
        },
        {
            "divName": "actor2DivInfo",
            "info": [
                {"value0": {"value": "Second Actor", "class": "title", "id": ""}},
                {"value1": {"value": "", "class": "info", "id": "actor2Info"}}]
        },
        {
            "divName": "actor3DivInfo",
            "info": [
                {"value0": {"value": "Third Actor", "class": "title", "id": ""}},
                {"value1": {"value": "", "class": "info", "id": "actor3Info"}}]
        },
        {
            "divName": "countryDivInfo",
            "info": [
                {"value0": {"value": "Country", "class": "title", "id": ""}},
                {"value1": {"value": "", "class": "info", "id": "countryInfo"}}]
        },
        {
            "divName": "genresDivInfo",
            "info": [
                {"value0": {"value": "Genres", "class": "title", "id": ""}},
                {"value1": {"value": "", "class": "info", "id": "genresInfo"}}]
        },
        {
            "divName": "contentDivInfo",
            "info": [
                {"value0": {"value": "Content Rating", "class": "title", "id": ""}},
                {"value1": {"value": "", "class": "info", "id": "contentInfo"}}]
        },
        {
            "divName": "grossDivInfo",
            "info": [
                {"value0": {"value": "Gross", "class": "title", "id": ""}}, {
                "value1": {"value": "", "class": "info", "id": "grossInfo"}
            }]
        },
        {
            "divName": "budgetDivInfo",
            "info": [
                {"value0": {"value": "Budget", "class": "title", "id": ""}},
                {"value1": {"value": "", "class": "info", "id": "budgetInfo"}}]
        },
        {
            "divName": "plotDivInfo",
            "info": [
                {"value0": {"value": "Plot", "class": "title", "id": ""}},
                {"value1": {"value": "", "class": "info", "id": "plotInfo"}}]
        },
        {
            "divName": "academyDivInfo",
            "info": [
                {"value0": {"value": "Awards", "class": "title", "id": ""}},
                {"value1": {"value": "", "class": "info statueDiv", "id1": "academyInfo", "id2": "awardsInfo"}}]
        }
    ];

    var titleText = self.div.append("div")
        .attr("class", "titleDiv")
        .append("text")
        .attr("id", "titleInfo");

    var infoContainerDiv = self.div
        .append("div")
        .attr("class","infoContainerDiv");

    var ratingDiv = infoContainerDiv
        .append("div")
        .attr("class","ratingInfoDiv");

    var ratingTitle = ratingDiv
        .append("div")
        .attr("class","title")
        .append("text")
        .text("IMDB Rating");

    var ratingSVG = ratingDiv
        .append("div")
        .attr("class","info")
        .append("svg")
        .attr("id", "ratingStarSvg")
        .append("defs")
        .append('pattern')
        .attr('id', 'infoStars')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 200)
        .attr('height', 39)
        .append("image")
        .attr("xlink:href", "data/tenStars.png")
        .attr('width', 200)
        .attr('height', 39);

    var infoDivs = infoContainerDiv
        .selectAll(".infoDiv")
        .data(self.movieDataTemplate)
        .enter().append("div")
        .attr("class", "infoDiv");

    var smallDivs = self.div
        .selectAll(".infoDiv")
        .selectAll(".smallDiv")
        .data(function (d) {
            return d["info"];
        })
        .enter()
        .append("div")
        .each(function (d, i) {
            if (d["value" + i]["id1"] == "academyInfo") {
                d3.select(this)
                    .append("text")
                    .attr("id", d["value" + i]["id2"]);
                d3.select(this)
                    .attr("class", d["value" + i]["class"])
                    .append("span")
                    .attr("id", d["value" + i]["id1"]);
            }
            else {
                d3.select(this)
                    .attr("class", d["value" + i]["class"])
                    .append("text")
                    .attr("id", d["value" + i]["id"])
                    .text(d["value" + i]["value"]);
            }
        });

    var posterDiv = self.div.append("div")
        .attr("class", "posterDiv")
        .append("img")
        .attr("id", "posterInfo")
        .on("error",function () {
            d3.select(this)
                .attr("src","data/loading-failed.png");
        });

    self.update(self.movies[2607]);

};

/*
 Fill the form
 */
Information.prototype.update = function(selectedMovie) {
    var self = this;

    // Data Binding

    // Director
    var nestedDataDirector = d3.nest().key(function (d) {
        return d["director_name"];
    }).entries(self.movies);

    var directorMovie = nestedDataDirector.filter(function (d) {
        return d.key === selectedMovie["director_name"];
    })[0];

    // Actor1
    var nestedDataActor1 = d3.nest().key(function (d) {
        return d["actor_1_name"];
    }).entries(self.movies);

    var actor1Movie = nestedDataActor1.filter(function (d) {
        return d.key === selectedMovie["actor_1_name"];
    })[0];

    // Actor 2
    var nestedDataActor2 = d3.nest().key(function (d) {
        return d["actor_2_name"];
    }).entries(self.movies);

    var actor2Movie = nestedDataActor2.filter(function (d) {
        return d.key === selectedMovie["actor_2_name"];
    })[0];

    // Actor 3
    var nestedDataActor3 = d3.nest().key(function (d) {
        return d["actor_3_name"];
    }).entries(self.movies);

    var actor3Movie = nestedDataActor3.filter(function (d) {
        return d.key === selectedMovie["actor_3_name"];
    })[0];

    // Updating the divs

    var title = self.div.select("#titleInfo")
        .text(selectedMovie["movie_title"]
            + " (" + selectedMovie["title_year"] + ")");

    var directorDiv = self.div.select("#directorInfo")
        .text(selectedMovie["director_name"]
            + " (" + directorMovie.values.length + " movies)");

    var actor1Div = self.div.select("#actor1Info")
        .text(selectedMovie["actor_1_name"]
            + " (" + actor1Movie.values.length + " movies)"); // call tool tip

    var actor2Div = self.div.select("#actor2Info")
        .text(selectedMovie["actor_2_name"]
            + " (" + actor2Movie.values.length + " movies)"); // call tool tip

    var actor3Div = self.div.select("#actor3Info")
        .text(selectedMovie["actor_3_name"]
            + " (" + actor3Movie.values.length + " movies)"); // call tool tip

    var countryDiv = self.div.select("#countryInfo")
        .text(selectedMovie["country"]);

    var genresDiv = self.div.select("#genresInfo")
        .text(selectedMovie["genres"].replace(/\|/g, ', ')); // decompose them

    var contentInfoDiv = self.div.select("#contentInfo")
        .text(selectedMovie["content_rating"]);

    var grossDiv = self.div.select("#grossInfo")
        .text(d3.format(',')(+selectedMovie["gross"]));

    var budgetDiv = self.div.select("#budgetInfo")
        .text(d3.format(',')(+selectedMovie["budget"]));


    self.div.select("#posterInfo")
        .attr("src", "data/loading.gif");

    var rects = self.div.select("#ratingStarSvg")
        .selectAll("rect")
        .data([selectedMovie["imdb_score"]]);

    rects.exit().remove();
    rects.enter()
        .append("rect")
        .merge(rects)
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", 39)
        .attr("fill", "url(#infoStars)")
        .transition()
        .duration(1000)
        .attr("width", function (d) {
            return d * 20;
        });

    self.getAcademyInfo(selectedMovie);
    self.getPosterAndPlot(selectedMovie);

};

Information.prototype.getPosterAndPlot = function (selectedMovie) {

    var self = this;
    var splittedHash = selectedMovie["movie_imdb_link"].split("/");

    var jsonSite = "https://www.omdbapi.com/?i=" + splittedHash[4];
    d3.json(jsonSite,function (error,json) {

        self.div.select("#posterInfo")
            .attr("src", json["Poster"]);

        self.div.select("#plotInfo")
            .text(json["Plot"]);

        self.div.select("#awardsInfo")
            .text(json["Awards"])
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
        oscars.push("academyPicture");
    if (academyActor.length === 1)
        oscars.push("academyActor");
    if (academyActress.length === 1)
        oscars.push("academyActress");
    if (academyDirector.length === 1)
        oscars.push("academyDirector");

    var statues = self.div.select("#academyInfo")
        .selectAll("img")
        .data(oscars);

    statues.enter()
        .append("img")
        .merge(statues)
        .attr("src", "data/academy.jpg");

    statues.exit()
        .remove();

};
