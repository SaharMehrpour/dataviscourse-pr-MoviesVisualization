
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

    var dropShadowFilter = self.svg.append("defs")
        .append("filter")
        .attr('id', 'dropShadow')
        .attr('filterUnits', "userSpaceOnUse")
        .attr('width', '250%')
        .attr('height', '250%');
    dropShadowFilter.append('svg:feGaussianBlur')
        .attr('in', 'SourceGraphic')
        .attr('stdDeviation', 2)
        .attr('result', 'blur-out');
    dropShadowFilter.append('svg:feColorMatrix')
        .attr('in', 'blur-out')
        .attr('type', 'hueRotate')
        .attr('values', 180)
        .attr('result', 'color-out');
    dropShadowFilter.append('svg:feOffset')
        .attr('in', 'color-out')
        .attr('dx', 3)
        .attr('dy', 3)
        .attr('result', 'the-shadow');
    dropShadowFilter.append('svg:feBlend')
        .attr('in', 'SourceGraphic')
        .attr('in2', 'the-shadow')
        .attr('mode', 'normal');

    //placeholder for testing
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

    var selectedMovie = self.selectedMovie;

    var selectedDirector = selectedMovie.director_name;
    var selectedActors = [selectedMovie.actor_1_name,selectedMovie.actor_2_name,selectedMovie.actor_3_name];

    self.nodeData = [];

    self.nodeData.push({"type":"d", "data":selectedMovie, "id":selectedMovie.director_name, "children":self.artistMovies(selectedMovie.director_name), "parents":[], "index":0});
    self.nodeData.push({"type":"a", "data":selectedMovie, "id":selectedMovie.actor_1_name,  "children":self.artistMovies(selectedMovie.actor_1_name),  "parents":[], "index":1});
    self.nodeData.push({"type":"a", "data":selectedMovie, "id":selectedMovie.actor_2_name,  "children":self.artistMovies(selectedMovie.actor_2_name),  "parents":[], "index":2});
    self.nodeData.push({"type":"a", "data":selectedMovie, "id":selectedMovie.actor_3_name,  "children":self.artistMovies(selectedMovie.actor_3_name),  "parents":[], "index":3});

    self.nodeData = self.nodeData.concat(self.nodeData[0].children);
    self.nodeData = self.nodeData.concat(self.nodeData[1].children);
    self.nodeData = self.nodeData.concat(self.nodeData[2].children);
    self.nodeData = self.nodeData.concat(self.nodeData[3].children);

    var nodeData_temp = [];

    var index = 4;

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

                var movie = {"type": "m", "data": movies[0].data, "id": movie_name, "children": [], "parents": parents, "index": index++};


                nodeData_temp.push(movie);
            }

        } else {
            nodeData_temp.push(element);
        }
    });

    self.nodeData = nodeData_temp;

    self.linkData = [];

    var artistInfo = self.nodeData.slice(0,4);

    artistInfo.forEach(function(obj,idx) {

        obj.children.forEach(function(element) {

            self.linkData.push({"source": idx, "target": self.nodeData.find(x => x.id === element.id).index});
        });

    });

    self.linkedByIndex = {};
    self.linkData.forEach(function(d) {
        self.linkedByIndex[d.source + "," + d.target] = 1;
    });
};

Graph.prototype.addGenreNodes = function(selectedMovie, node) {

    var self = this;

    selectedMovie.fy = selectedMovie.y;
    selectedMovie.fx = selectedMovie.x;


    var genres = selectedMovie.data.genres.split('|');

    //console.log(self.nodeData);

    genres.forEach(function (obj) {

        var genre = {"type":"g", "data":selectedMovie.data, "id":obj, "children": [], "parents":[selectedMovie], "index" : self.nodeData.length};

        self.nodeData.push(genre);

        self.linkData.push({"source":selectedMovie.index, "target":genre.index});

        self.linkedByIndex[selectedMovie.index + "," + genre.index] = 1;

    });

    self.refresh();

    self.fade(selectedMovie,0.1);
};

Graph.prototype.removeGenreNodes = function(d) {

    var self = this;

    self.linkData = self.linkData.filter (function(obj) {

        return obj.target.type != "g";
    });

    self.nodeData = self.nodeData.filter (function(obj) {
        return obj.type != "g";
    });

    self.refresh();

};

// Graph.prototype.addFixedNode = function (index) {
//
//     var self = this;
//
//     self.fixedNodesIndices.push(index);
//     self.fixedNodeCoordinates.push({'x':self.nodeData[index].x, 'y':self.nodeData[index].y});
//
//
// };
//
// Graph.prototype.removeFixedNode = function(index) {
//
//     var self = this;
//
//     var idx = self.fixedNodesIndices.indexOf(index);
//
//     self.fixedNodesIndices.splice(idx,1);
//     self.fixedNodeCoordinates.splice(idx,1);
//
// };

Graph.prototype.refresh = function () {

    var self = this;

    var selectedMovie = self.selectedMovie;

    var index = self.nodeData.find(x => x.id === selectedMovie.movie_title).index;

    self.nodeData[index].fx = self.svgWidth/2;
    self.nodeData[index].fy = self.svgHeight/2;

    // NOTE: Take care of duplicates in data
    // console.log(self.nodeData.filter(function(d){
    //
    //     return (d.parents.length > 1);
    //
    // }));



    var linkGroups = self.svg.selectAll("g.links")
        .data(self.linkData);

    linkGroups.exit().remove();

    var linkGroupEnter = linkGroups.enter().insert("g",":first-child")
        .attr("class","links");

    linkGroupEnter.append("path");

    linkGroups = linkGroups.merge(linkGroupEnter);

    self.linkGroups = linkGroups;

    var nodeGroups = self.svg.selectAll("g.nodes")
        .data(self.nodeData);

    nodeGroups.exit().remove();

    nodeGroups.classed("nodes",true)
        .classed("artist", function(d) {
            if(d.type == "a" || d.type == "d") return true;
            return false;
        })
        .classed("movie", function(d) {
            if (d.type == "m") return true;
            return false;
        })
        .classed("selectedMovie", function(d) {
            if (d.id == selectedMovie.movie_title) return true;
            return false;
        })
        .classed("genre", function(d) {
            if (d.type == "g") return true;
            return false;
        });

    var imageHeight = imageWidth = 50;

    nodeGroups.select('image')
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
        });
        //.attr("filter","url(#dropShadow)");

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
        .classed("nodes",true)
        .classed("artist", function(d) {
            if(d.type == "a" || d.type == "d") return true;
            return false;
        })
        .classed("movie", function(d) {
            if (d.type == "m") return true;
            return false;
        })
        .classed("selectedMovie", function(d) {
            if (d.id == selectedMovie.movie_title) return true;
            return false;
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));


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
        .on("click",function(d) {
            if (d.type === 'm') {
                self.update(self.movies.find(x => x.movie_title === d.id));

                window.clearTimeout(this.hoverTimeout);

                if (d.fx != null)
                    self.removeGenreNodes(d);

                d.fx = null;
                d.fy = null;

                self.fade(d,1);
            }
        })
        .on("mouseover", function(d,i) {


            if (d.type == "m") {
                this.hoverTimeout = window.setTimeout(self.addGenreNodes.bind(self), 1000, d, this);
            }


            self.fade(d,0.1);

        })
        .on("mouseout", function(d) {



            if(d.type == "m") {
                var tm = window.clearTimeout(this.hoverTimeout);

                if (d.fx != null)
                    self.removeGenreNodes(d);

                d.fx = null;
                d.fy = null;
            }

            self.fade(d,1);

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

    nodeGroups = nodeGroups.merge(nodeGroupEnter);

    self.nodeGroups = nodeGroups;

    self.simulation
        .nodes(self.nodeData)
        .on("tick", ticked);

    self.simulation
        .force("link")
        .links(self.linkData);

    this.simulation.alpha(0.1).restart();

    function ticked() {

        linkGroups.select("path")
            .attr("d", function (d) {

                var  dx = d.target.x - d.source.x;
                var dy = d.target.y - d.source.y;

                var dr = Math.sqrt(dx*dx + dy*dy);

                return "M" + d.source.x + "," + d.source.y
                    + "A" + dr + "," + dr + " 0 0,1 "
                    + d.target.x + "," + d.target.y;
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

Graph.prototype.isConnected = function (a, b) {

    var self = this;

    return self.linkedByIndex[a.index + "," + b.index] || self.linkedByIndex[b.index + "," + a.index] || a.index == b.index;
};

Graph.prototype.fade = function (d,opacity) {

    var self = this;

    self.nodeGroups.select("image")
        .style("opacity", function(o) {

            if (self.isConnected(d,o)) {

                thisOpacity = 1;

                if (opacity == 1) {
                    if (!d3.select(this.parentNode).classed("selectedMovie"))
                        d3.select(this.parentNode).select("text")
                            .style("visibility", "hidden");
                } else
                    d3.select(this.parentNode).select("text")
                        .style("visibility", "visible");

            } else thisOpacity = opacity;



            return thisOpacity;
        });

    self.linkGroups.style("stroke-opacity", function(o) {
        return o.source === d || o.target === d ? 1 : opacity;
    }).style("stroke-width", function(o) {
        return o.source === d || o.target === d ? opacity == 1 ? "0.2px" : "1px" :  "0.2px";
    })
}

function measureText(pText, pFontSize, pStyle) {
    var lDiv = document.createElement('lDiv');

    document.body.appendChild(lDiv);

    if (pStyle != null) {
        lDiv.style = pStyle;
    }
    lDiv.style.fontSize = "" + pFontSize + "px";
    lDiv.style.position = "absolute";
    lDiv.style.left = -1000;
    lDiv.style.top = -1000;

    lDiv.innerHTML = pText;

    var lResult = {
        width: lDiv.clientWidth,
        height: lDiv.clientHeight
    };

    document.body.removeChild(lDiv);
    lDiv = null;

    return lResult;
}

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
        .force("link", d3.forceLink())
        .force("collide",d3.forceCollide( function(d){
            if (d.type == "m") {
                if (d.id === selectedMovie.movie_title)
                    return radius * 20;

                return radius + (20 * d.parents.length);
            }
            else if (d.type == "g")
                return radius + 50;
            else
                return radius * 10;
        }).strength(0.2).iterations(1) )
        .force("x",d3.forceX().x(function (d) {
            if (d.type == "g")
                return d.parents[0].x;
            else return 0;
        }))
        .force("y",d3.forceY().y(function (d) {
            if (d.type == "g")
                return d.parents[0].y;
            else return 0;
        }))
        .force("center", d3.forceCenter(self.svgWidth / 2, self.svgHeight / 2));

    self.refresh();
};



