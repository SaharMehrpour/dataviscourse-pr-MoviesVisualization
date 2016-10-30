
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

};

/*
 Fill the form
 */
Information.prototype.update = function(selectedMovie) {
    var self = this;

};

