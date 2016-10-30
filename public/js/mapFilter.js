
/*
 Constructor
 */
function MapFilter(movies, interactivity) {
    var self = this;

    self.interactivity = interactivity;
    self.movies = movies;

    self.div = d3.select("#map_filter_div");

    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
MapFilter.prototype.init = function() {

    var self = this;

    d3.csv("data/iso.csv", function (error, iso) {
        d3.json("data/world.json", function (error, world) {
            self.drawMap(world, iso);
        });
    });

    // draw elements on the map

    var selectedCountries;
    self.interactivity.updatedMapFilter(selectedCountries);

};

/**
 * update the map according to the new movie set
 */
MapFilter.prototype.update = function(newMovieSet) {
    var self = this;

};

/*
Draw Map
*/
MapFilter.prototype.drawMap = function(world,iso) {

    // Draw map

};

