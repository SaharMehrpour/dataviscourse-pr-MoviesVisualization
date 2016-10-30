
/*
 Constructor
 */
function Graph(movies, interactivity) {
    var self = this;

    self.interactivity = interactivity;
    self.movies = movies;

    self.div = d3.select("#graph_div");

    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
Graph.prototype.init = function() {

    var self = this;

};

/*
 Build the graph
 */
Graph.prototype.update = function(selectedMovie) {
    var self = this;

};

