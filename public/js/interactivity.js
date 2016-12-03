
/*
 Constructor
 */
function Interactivity() {
    var self = this;

};


Interactivity.prototype.init = function(yearFilter, ratingGenreFilter, mapFilter, table, information, graph, movies) {

    var self = this;

    self.yearFilter = yearFilter;
    self.ratingGenreFilter = ratingGenreFilter;
    self.mapFilter = mapFilter;
    self.table = table;
    self.information = information;
    self.graph = graph;
    self.movies = movies;
    self.filters = {'title_year': [], 'imdb_score': [], 'country': [], 'genres': []};
    self.genresRatingFilter = [];

};


Interactivity.prototype.updatedYearFilter = function(selectedYears) {
    var self = this;

    self.filters["title_year"] = selectedYears;

    var filteredMovie = self.movies.filter(function (d) {

        var yearCheck = (self.filters["title_year"].length != 0 ? (d["title_year"] <= self.filters["title_year"][self.filters["title_year"].length - 1])
            && (d["title_year"] >= self.filters["title_year"][0]) : true );
        var countryCheck = (self.filters["country"].length != 0 ? (self.filters["country"].indexOf(d["country"]) !== -1) : true);

        var genresRatingCheck = self.genresRatingFilter.length == 0 ;
        var tmpGenres = d["genres"].split("|");
        for (var j = 0; j < self.genresRatingFilter.length; j++) {
            if (tmpGenres.indexOf(self.genresRatingFilter[j][0]) !== -1) {
                if (self.genresRatingFilter[j][1] == String(Math.round(d["imdb_score"]))) {
                    genresRatingCheck = true;
                    break;
                }
            }
        }

        return yearCheck && countryCheck && genresRatingCheck;
    });

    self.yearFilter.update(filteredMovie);
    self.mapFilter.updateMap(filteredMovie);
    self.ratingGenreFilter.update(filteredMovie);
    self.table.update(filteredMovie);

};


Interactivity.prototype.updatedGenreRatingFilter = function(genresRatings) {
    var self = this;

    self.filters["genres"] = ['genres'];
    self.filters["imdb_score"] = ['ratings'];
    self.genresRatingFilter = genresRatings;

    var filteredMovie = self.movies.filter(function (d) {

        var yearCheck = (self.filters["title_year"].length != 0 ? (d["title_year"] <= self.filters["title_year"][self.filters["title_year"].length - 1])
            && (d["title_year"] >= self.filters["title_year"][0]) : true );
        var countryCheck = (self.filters["country"].length != 0 ? (self.filters["country"].indexOf(d["country"]) !== -1) : true);

        var genresRatingCheck = self.genresRatingFilter.length == 0 ;
        var tmpGenres = d["genres"].split("|");
        for (var j = 0; j < self.genresRatingFilter.length; j++) {
            if (tmpGenres.indexOf(self.genresRatingFilter[j][0]) !== -1) {
                if (self.genresRatingFilter[j][1] == String(Math.round(d["imdb_score"]))) {
                    genresRatingCheck = true;
                    break;
                }
            }
        }

        return yearCheck && countryCheck && genresRatingCheck;
    });

    console.log(filteredMovie.length);


    self.mapFilter.updateMap(filteredMovie);
    self.table.update(filteredMovie);
    self.yearFilter.update(filteredMovie);
};

Interactivity.prototype.updatedMapFilter = function(selectedCountries) {
    var self = this;

    self.filters["country"] = selectedCountries;

    var filteredMovie = self.movies.filter(function (d) {

        var yearCheck = (self.filters["title_year"].length != 0 ? (d["title_year"] <= self.filters["title_year"][self.filters["title_year"].length - 1])
            && (d["title_year"] >= self.filters["title_year"][0]) : true );
        var countryCheck = (self.filters["country"].length != 0 ? (self.filters["country"].indexOf(d["country"]) !== -1) : true);

        var genresRatingCheck = self.genresRatingFilter.length == 0 ;
        var tmpGenres = d["genres"].split("|");
        for (var j = 0; j < self.genresRatingFilter.length; j++) {
            if (tmpGenres.indexOf(self.genresRatingFilter[j][0]) !== -1) {
                if (self.genresRatingFilter[j][1] == String(Math.round(d["imdb_score"]))) {
                    genresRatingCheck = true;
                    break;
                }
            }
        }

        return yearCheck && countryCheck && genresRatingCheck;
    });

    self.ratingGenreFilter.update(filteredMovie);
    self.table.update(filteredMovie);
    self.yearFilter.update(filteredMovie);
};


Interactivity.prototype.updatedTable = function(selectedMovie) {
    var self = this;

    self.information.update(selectedMovie);
    self.graph.update(selectedMovie);

    var ele = document.getElementById("graph_div");

    closeNav();

    ele.scrollIntoView({block: "end", behavior: "smooth"});
};


Interactivity.prototype.updatedGraph = function(selectedMovie) {
    var self = this;

    self.information.update(selectedMovie);

};

