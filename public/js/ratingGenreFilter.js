
/*
 Constructor
 */
function RatingGenreFilter(movies, interactivity) {
    var self = this;

    self.interactivity = interactivity;
    self.movies = movies;
    self.div = d3.select("#rating_genre_filter_div");

    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
RatingGenreFilter.prototype.init = function(){

    var self = this;

    var selectedGenreRating;
    // select from the chart
    self.interactivity.updatedGenreRatingFilter(selectedGenreRating);

};

/**
 * update the chart according to the new movie set
 */
RatingGenreFilter.prototype.update = function(newMovieSet) {
    var self = this;

};

