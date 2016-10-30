
/*
 Constructor
 */
function Table(interactivity) {
    var self = this;

    self.interactivity = interactivity;

    self.div = d3.select("#table_div");

    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
Table.prototype.init = function() {

    var self = this;

    var selectedMovie;
    self.interactivity.updatedTable(selectedMovie);

};


Table.prototype.update = function(newMovies) {

    var self = this;

};

