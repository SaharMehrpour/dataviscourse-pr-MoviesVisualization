(function(){
    var instance = null;

    function init() {
        //Creating instances for each visualization

        var interactivity = new Interactivity();

        d3.csv("data/movie_metadata_cleared.csv", function (error, movies) {
            d3.csv("data/Oscar_data/actors.csv", function (error, oscarActors) {
                d3.csv("data/Oscar_data/actresses.csv", function (error, oscarActresses) {
                    d3.csv("data/Oscar_data/directors.csv", function (error, oscarDirector) {
                        d3.csv("data/Oscar_data/pictures.csv", function (error, oscarPictures) {

                            var yearFilter = new YearFilter(movies, interactivity);
                            var ratingGenreFilter = new RatingGenreFilter(movies, interactivity);

                            var mapFilter = new MapFilter(movies, interactivity);

                            var table = new Table(interactivity);
                            var information = new Information(movies, oscarActors, oscarActresses,
                                oscarDirector, oscarPictures, interactivity);

                            var graph = new Graph(movies, interactivity);

                            interactivity.init(yearFilter, ratingGenreFilter, mapFilter, table, information, graph, movies);

                        });
                    });
                });
            });
        });

    }

    /**
     *
     * @constructor
     */
    function Main(){
        if(instance  !== null){
            throw new Error("Cannot instantiate more than one Class");
        }
    }

    /**
     *
     * @returns {Main singleton class |*}
     */
    Main.getInstance = function(){
        var self = this;
        if(self.instance == null){
            self.instance = new Main();

            //called only once when the class is initialized
            init();
        }
        return instance;
    };

    Main.getInstance();
})();