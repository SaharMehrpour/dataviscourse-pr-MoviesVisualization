
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
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};
    var divvotesPercentage = d3.select("#graph_div").classed("content", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divvotesPercentage.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 500;

    //creates svg element within the div
    self.svg = divvotesPercentage.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight);

    //placeholder for testing
    //self.update(self.movies.find(x => x.movie_title === "The Departed "));

    var movie = self.movies.find(x => x.movie_title.trim() === "The Departed");

    self.update(movie);
};

Graph.prototype.artistMovies = function(artistName) {

    var self = this;

    var children = [];

    self.movies.forEach(function (obj) {

        if (obj.actor_1_name == artistName || obj.actor_2_name == artistName || obj.actor_3_name == artistName || obj.director_name == artistName)
            children.push({"type":"m", "data":obj, "id":obj.movie_title, "children":[], "parents":artistName});
    });

    return children;
};

Graph.prototype.generateNodeData = function(selectedMovie) {

    var self = this;

    var selectedDirector = selectedMovie.director_name;
    var selectedActors = [selectedMovie.actor_1_name,selectedMovie.actor_2_name,selectedMovie.actor_3_name];

    self.nodeData = [];

    self.nodeData.push({"type":"d", "data":selectedMovie, "id":selectedMovie.director_name, "children":self.artistMovies(selectedMovie.director_name), "parents":[]});
    self.nodeData.push({"type":"a", "data":selectedMovie, "id":selectedMovie.actor_1_name,  "children":self.artistMovies(selectedMovie.actor_1_name),  "parents":[]});
    self.nodeData.push({"type":"a", "data":selectedMovie, "id":selectedMovie.actor_2_name,  "children":self.artistMovies(selectedMovie.actor_2_name),  "parents":[]});
    self.nodeData.push({"type":"a", "data":selectedMovie, "id":selectedMovie.actor_3_name,  "children":self.artistMovies(selectedMovie.actor_3_name),  "parents":[]});

    self.nodeData = self.nodeData.concat(self.nodeData[0].children);
    self.nodeData = self.nodeData.concat(self.nodeData[1].children);
    self.nodeData = self.nodeData.concat(self.nodeData[2].children);
    self.nodeData = self.nodeData.concat(self.nodeData[3].children);

    var nodeData_temp = [];

    self.nodeData.forEach(function (element) {


        if (element.type == "m") {

            if (element.parents != null) {
                //console.log(element.parents);


                var movie_name = element.id;

                var movies = self.nodeData.filter(function (movie) {

                    return (movie.type == "m" && movie.id == movie_name);

                });

                var parents = [];

                movies.forEach(function (obj) {

                    parents.push(self.nodeData.find(x => x.id === obj.parents));
                    obj.parents = null;
                });

                //console.log(parents);
                //console.log(movie_name);

                var movie = {"type": "m", "data": movies[0].data, "id": movie_name, "children": [], "parents": parents};


                nodeData_temp.push(movie);
            }

        } else {
            nodeData_temp.push(element);
        }
    });

    self.nodeData = nodeData_temp;

    self.linkData = [];

    var artistInfo = self.nodeData.slice(0,4);

    //console.log(artistInfo);

    artistInfo.forEach(function(obj,idx) {

        obj.children.forEach(function(element) {

            self.linkData.push({"source": idx, "target": self.nodeData.indexOf(self.nodeData.find(x => x.id === element.id))});
        });

    });


    //console.log(self.linkData);
};

/*
 Build the graph
 */
Graph.prototype.update = function(selectedMovie) {
    var self = this;

    self.generateNodeData(selectedMovie);

    console.log(self.nodeData.length);


    // NOTE: Take care of duplicates in data
    // console.log(self.nodeData.filter(function(d){
    //
    //     return (d.parents.length > 1);
    //
    // }));

    var simulation = d3.forceSimulation()
        .force("charge", d3.forceManyBody())
        .force("link", d3.forceLink().distance(function(d) {
            return 25 * (d.target.parents.length);
        }).strength(1))
        .force("x",d3.forceX())
        .force("y",d3.forceY())
        .force("center", d3.forceCenter(self.svgWidth / 2, self.svgHeight / 2));

    var linkGroups = self.svg.selectAll("g.links")
        .data(self.linkData);

    linkGroups.exit().remove();

    var linkGroupEnter = linkGroups.enter().append("g")
        .attr("class","links");

    linkGroupEnter.append("line");

    linkGroups = linkGroups.merge(linkGroupEnter);

    var nodeGroups = self.svg.selectAll("g.nodes")
        .data(self.nodeData);

    nodeGroups.exit().remove();

    nodeGroups.attr("class", function (d) {
            if(d.type == "a" || d.type == "d")
                return "nodes artist";
            else if (d.id == selectedMovie.movie_title)
                return "nodes selectedMovie";
            else
                return "nodes movie";

        });

    nodeGroups.select("circle")
        .attr("r",3);

    nodeGroups.select("text")
        .text(function(d) {
            return d.id;
        })
        .style("visibility",function(d) {
            if (d.id === selectedMovie.movie_title)
                return "visible";
            else
                return "hidden";
        });



    var nodeGroupEnter = nodeGroups.enter().append("g")
        .attr("class", function (d) {
            if(d.type == "a" || d.type == "d")
                return "nodes artist";
            else if (d.id == selectedMovie.movie_title)
                return "nodes selectedMovie";
            else
                return "nodes movie";

        }).call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    nodeGroupEnter.append("circle")
        .attr("r",3)
        .on("click",function(d) {
            self.update(self.movies.find(x=> x.movie_title === d.id));
        })
        .on("mouseenter", function(d) {
            d3.select(this.parentNode).select("text")
                .style("visibility","visible");
        })
        .on("mouseleave", function(d) {
            if (d.id === selectedMovie.movie_title)
                return "visible";
            else
                d3.select(this.parentNode).select("text")
                    .style("visibility","hidden");
        });

    nodeGroupEnter.append("text")
        .text(function(d) {
            return d.id;
        })
        .style("visibility",function(d) {
            if (d.id === selectedMovie.movie_title)
                return "visible";
            else
                return "hidden";
        });


    nodeGroups = nodeGroups.merge(nodeGroupEnter);

    simulation
        .nodes(self.nodeData)
        .on("tick", ticked);

    simulation
        .force("link")
        .links(self.linkData);

    function ticked() {
        linkGroups.select("line")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });



        nodeGroups.attr("transform", function(d) { return "translate("+d.x+"," + d.y+")";})

    }

    function dragsubject() {
        return simulation.find(d3.event.x - self.svgWidth / 2, d3.event.y - self.svgHeight / 2);
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
         d.fx = d.x;
         d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

};

