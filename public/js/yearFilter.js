
/*
Constructor
 */
function YearFilter(movies, interactivity) {
    var self = this;

    self.interactivity = interactivity;
    self.movies = movies;

    self.div = d3.select("#year_filter_div");

    self.init();
};

/**
 * Initializes the chart
 */
YearFilter.prototype.init = function(){

    var self = this;

    var selectedYears;
    // select based on brush
    self.interactivity.updatedYearFilter(selectedYears);

};

/**
 * update the chart according to the new movie set
 */
YearFilter.prototype.update = function (newMovieSet) {

    var self = this;

    // update the chart based on newMovieSet

};

