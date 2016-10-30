
/*
 Constructor
 */
function Interactivity() {
    var self = this;

};


Interactivity.prototype.init = function(yearFilter, ratingGenreFilter, mapFilter, table, information, graph, movies){

    var self = this;

    self.yearFilter = yearFilter;
    self.ratingGenreFilter = ratingGenreFilter;
    self.mapFilter = mapFilter;
    self.table = table;
    self.information = information;
    self.graph = graph;
    self.movies = movies;
    self.filters = {'years':[], 'genres':[], 'ratings':[], 'countries':[]};

};


Interactivity.prototype.updatedYearFilter = function(selectedYears) {
    var self = this;

    // update self.filter
    // filteredMovies = self.movies.filter(function(d){based on self.filters})

    // update the rest of the visualization

    /**
     * e.g.
     * self.ratingGenreFilter.update(filteredMovies);
     * self.mapFilter.update(filteredMovies);
     */

};


Interactivity.prototype.updatedGenreRatingFilter = function(selectedGenreRating) {
    var self = this;

    // update self.filter
    // filteredMovies = self.movies.filter(function(d){based on self.filters})

    // update the rest of the visualization
};

Interactivity.prototype.updatedMapFilter = function(selectedCountries) {
    var self = this;

    // update self.filter
    // filteredMovies = self.movies.filter(function(d){based on self.filters})

    // update the rest of the visualization
};


Interactivity.prototype.updatedTable = function(selectedMovie) {
    var self = this;

    // update the rest of the visualization
};