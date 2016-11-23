
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

    self.nodeData = [];
    self.linkData = [];
    self.fixedNodesIndices = [];
    self.fixedNodeCoordinates = [];


    self.margin = {top: 30, right: 20, bottom: 30, left: 50};
    var divvotesPercentage = d3.select("#graph_div").classed("content", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divvotesPercentage.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 800;

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

Graph.prototype.generateNodeData = function() {

    var self = this;


    console.log(self);
    var selectedMovie = self.selectedMovie;

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

Graph.prototype.addGenreNodes = function(selectedMovie, index) {

    var self = this;

    var genres = selectedMovie.data.genres.split('|');

    //console.log(self.nodeData);

    genres.forEach(function (obj) {

        var genre = {"type":"g", "data":selectedMovie.data, "id":obj, "children": [], "parents":[selectedMovie]};

        self.nodeData.push(genre);

        self.linkData.push({"source":index, "target":self.nodeData.length - 1});

    });

    self.addFixedNode(index);

    self.simulation.stop();

    self.refresh();


};

Graph.prototype.removeGenreNodes = function(d,i) {

    var self = this;

    self.removeFixedNode(i);

    self.linkData = self.linkData.filter (function(obj) {
        return obj.target.type != "g";
    });

    self.nodeData = self.nodeData.filter (function(d) {
        return d.type != "g";
    });

    self.simulation.stop();

    self.refresh();

};

Graph.prototype.addFixedNode = function (index) {

    var self = this;

    self.fixedNodesIndices.push(index);
    self.fixedNodeCoordinates.push({'x':self.nodeData[index].x, 'y':self.nodeData[index].y});


};

Graph.prototype.removeFixedNode = function(index) {

    var self = this;

    var idx = self.fixedNodesIndices.indexOf(index);

    self.fixedNodesIndices.splice(idx,1);
    self.fixedNodeCoordinates.splice(idx,1);

};

Graph.prototype.refresh = function () {

    var self = this;

    var selectedMovie = self.selectedMovie;

    var index = self.nodeData.indexOf(self.nodeData.find(x => x.id === selectedMovie.movie_title));

    self.nodeData[index].fx = self.svgWidth/2;
    self.nodeData[index].fy = self.svgHeight/2;

    var radius = 7.5;

    var distanceFactor = 75;

    // NOTE: Take care of duplicates in data
    // console.log(self.nodeData.filter(function(d){
    //
    //     return (d.parents.length > 1);
    //
    // }));



    var linkGroups = self.svg.selectAll("g.links")
        .data(self.linkData);

    linkGroups.exit().remove();

    var linkGroupEnter = linkGroups.enter().append("g")
        .attr("class","links");

    //linkGroupEnter.append("line");
    linkGroupEnter.append("path");

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

    // nodeGroups
    //     .select('image')
    //     //.attr('class', 'pico')
    //     .attr('height', '10')
    //     .attr('width', '10')
    //     // .select("circle")
    // .attr("r",radius);

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

    var imageHeight = imageWidth = 50;

    nodeGroupEnter
        .append('image')
        .attr('xlink:href',function(d) {
            if (d.type == 'm')
                return 'images/movie.png';
            else if (d.type === 'd')
                return 'images/director.png';
            else if (d.type === 'g')
                return 'images/' + d.id + '.png';
            else
                return 'images/actor.png'
        })
        //.attr('class', 'pico')
        .attr('height', function (d) {
            if (d.id === selectedMovie.movie_title)
                return imageHeight * 1.5;
            else
                return imageHeight;
        })
        .attr('width', function(d) {
            if (d.id === selectedMovie.movie_title)
                return imageWidth * 1.5;
            else
                return imageWidth;
        })
        .attr('x', function(d) {
            if (d.id === selectedMovie.movie_title)
                return imageWidth * -1.5 / 2;
            else
                return imageWidth / -2;
        })
        .attr('y', function(d) {
            if (d.id === selectedMovie.movie_title)
                return imageHeight * -1.5 / 2;
            else
                return imageHeight / -2;
        })
        // .append("circle")
        // .attr("r",radius)
        .on("click",function(d) {
            if (d.type === 'm')
                self.update(self.movies.find(x=> x.movie_title === d.id));
        })
        .on("mouseenter", function(d) {

            d3.select(this.parentNode).select("text")
                .style("visibility","visible");

            // if(d.type == "m")
            //     if (self.fixedNodesIndices.length == 0)
            //         self.addGenreNodes(d, self.nodeData.indexOf(d));
        })
        .on("mouseleave", function(d) {
            if (d3.select(this.parentNode).classed("selectedMovie"))
                d3.select(this.parentNode).select("text")
                    .style("visibility", "visible");
            else
                d3.select(this.parentNode).select("text")
                    .style("visibility","hidden");

            // if(d.type == "m")
            //     if (self.fixedNodesIndices.length != 0 && self.fixedNodesIndices.indexOf(self.nodeData.indexOf(d)) != -1)
            //         self.removeGenreNodes(d, self.nodeData.indexOf(d));
        });

    nodeGroupEnter.append("text")
        .attr("x",10)
        .attr("y",-10)
        .text(function(d) {
            return d.id;
        })
        .style("visibility",function(d) {
            if (d.id === selectedMovie.movie_title)
                return "visible";
            else
                return "hidden";
        });

    // self.fixedNodesIndices.forEach(function(d,i) {
    //
    //     self.nodeData[d].x = self.fixedNodeCoordinates[i].x;
    //     self.nodeData[d].y = self.fixedNodeCoordinates[i].y;
    //
    // });


    nodeGroups = nodeGroups.merge(nodeGroupEnter);

    self.simulation
        .nodes(self.nodeData)
        .on("tick", ticked);

    self.simulation
        .force("link")
        .links(self.linkData);

    self.simulation.restart();

    function ticked() {

        // self.nodeData[index].x = self.svgWidth/2;
        // self.nodeData[index].y = self.svgHeight/2;


        // linkGroups.select("line")
        //     .attr("x1", function(d) { return d.source.x; })
        //     .attr("y1", function(d) { return d.source.y; })
        //     .attr("x2", function(d) { return d.target.x; })
        //     .attr("y2", function(d) { return d.target.y; });

        linkGroups.select("path")
            .attr("d", function (d) {
                return "M" + d.source.x + "," + d.source.y
                    + " " + d.target.x + "," + d.target.y;
                //+ " " + d[2].x + "," + d[2].y;
            });

        nodeGroups.attr("transform", function(d) { return "translate("+d.x+"," + d.y+")";});

    }

    function dragstarted(d) {
        if (!d3.event.active) self.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) self.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
};

/*
 Build the graph
 */
Graph.prototype.update = function(selectedMovie) {
    var self = this;


    var radius = 7.5;
    self.selectedMovie = selectedMovie;

    self.generateNodeData();

    self.simulation = d3.forceSimulation()
        .force("charge", d3.forceManyBody())
        .force("link", d3.forceLink().distance (function(d) {
            if (d.type == "g")
                return 50;
            else return 30;
        }))
        .force("collide",d3.forceCollide( function(d){
            if (d.type == "m") {
                if (d.id === selectedMovie.movie_title)
                    return radius * 20;

                return radius + (20 * d.parents.length);
            }
            else if (d.type == "g")
                return radius + 20;
            else
                return radius * 10;
        }).strength(0.2).iterations(1) )
        .force("x",d3.forceX())
        .force("y",d3.forceY())
        .force("center", d3.forceCenter(self.svgWidth / 2, self.svgHeight / 2));

    self.refresh();
};

