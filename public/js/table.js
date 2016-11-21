
/*
 Constructor
 */
function Table(movies,interactivity) {
    var self = this;

    self.movies = movies;
    self.interactivity = interactivity;

    self.div = d3.select("#table_div");
    self.cellWidth = +(self.div.style("width").split("px")[0])/5;
    self.cellHeight = 40;

    self.xScaleBudget = d3.scaleLog()
        .range([0,90]); // tabelCell2

    self.xScaleGross = d3.scaleLog()
        .range([0,60]); // tabelCell3

    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
Table.prototype.init = function() {
    var self = this;

    self.filters = [["title_year", "Year"], ["country", "Country"], ["imdb_score", "IMDB Score"]];
    self.header = ["", "number Of Movies", "Rating", "Budget", "Gross"];

    self.computeXscales(self.movies);

    self.createSortOptions();

    var header = self.div.append("div").attr("class", "header") // tableRow")
        .selectAll("tableCell")
        .data(self.header)
        .enter()
        .append("div")
        //.attr("class", "tableCell")
        .attr("class", function (d, i) { // Test!
            if (i == 0) return "tableCell1";
            if (i == 1) return "tableCell2";
            if (i == 2) return "tableCell3";
            return "tableCell";
        })
        .html(function (d) {
            return d
        })
        .style("left", function (d, i) {
            return (i * self.cellWidth) + "px"
        });

    header.each(function (d,i) {
        if (i == 3 || i == 4) {
            var scale = i == 3 ? self.xScaleBudget : self.xScaleGross;
            d3.select(this)
                .append("svg")
                .append("g")
                .attr("class", "axis")
                .attr("transform", "translate(5,5)")
                .call(d3.axisBottom()
                    .scale(scale)
                    .ticks(3)
                    .tickFormat(d3.format(".0s")));
        }
    });

    var body = self.div.append("div").attr("class", "tableBody")
        .attr("id", "tableBody");


    self.populateTable("#tableBody", self.nestedData(self.movies, "id", 0));

};

Table.prototype.populateTable = function(parentDivId,data) {
    var self = this;

    var rowsToPopulate = self.div.select(parentDivId)
        .selectAll(".dataRow")
        .data(data)
        .enter()
        .append("div")
        .attr("id", function (d) {
            return "container___" + d["id"];
        })
        .style("top", function (d, i) {
            return (i * self.cellHeight) + "px"
        })
        .attr("class", "box")
        .append("div")
        .attr("id", function (d) {
            return d["id"];
        })
        .attr("class", function (d) {
            return "dataRow summaryRow tableRow level" + d["level"];
        })
        .on("click", function (d) {
            if (d3.select(this).classed("expand") == false) {
                d3.select(this).classed("dataRow", false);
                d3.select(this).classed("expand", true);
                self.expandRows(d["id"], d["level"]);
            }
            else {
                d3.select(this).classed("dataRow", true);
                d3.select(this).classed("expand", false);
                self.shrinkRows(d["id"]);
            }
        })
        .style("top", "0px")
        .transition()
        .duration(2000)
        .style("top", function (d, i) {
            return (i * self.cellHeight) + "px"
        });


    var cells = self.div.select(parentDivId)
        .selectAll(".summaryRow")
        .filter(".dataRow")
        .selectAll(".tableCell")
        .data(function (d) {
            return d3.entries(d["value"])
        })
        .enter()
        .append("div")
        //.attr("class", "tableCell")
        .attr("class", function (d, i) { // Test!
            if (i == 0) return "tableCell1";
            if (i == 1) return "tableCell2";
            if (i == 2) return "tableCell3";
            return "tableCell";
        })
        .each(function (d, i) {
            if (i == 2) { // Stars
                var svg = d3.select(this)
                    .append("svg");
                svg
                    .append("defs")
                    .append('pattern')
                    .attr('id', 'stars')
                    .attr('patternUnits', 'userSpaceOnUse')
                    .attr('width', 100)
                    .attr('height', 35)
                    .append("image")
                    .attr("xlink:href", "data/stars2.png")
                    .attr('width', 100)
                    .attr('height', 35);
                svg
                    .append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", function () {
                        return Math.min(100, d.value * 20);
                    })
                    .attr("height", 17)
                    .attr("fill", "url(#stars)");
                svg
                    .append("rect")
                    .attr("x", 0)
                    .attr("y", 17)
                    .attr("width", function () {
                        return Math.min(100, Math.max(0, (d.value - 5) * 20));
                    })
                    .attr("height", 17)
                    .attr("fill", "url(#stars)");
            }
            else if (i == 3 || i == 4) { // Box Plot for Budget or Gross

                if (d.value.length === 1) {
                    d3.select(this).html(function (d) {
                        return d.value;
                    })
                }
                else {

                    var scale = i == 3 ? self.xScaleBudget : self.xScaleGross;

                    var svg = d3.select(this)
                        .append("svg");

                    //draw vertical line for lowerWhisker
                    svg.append("line")
                        .attr("class", "whisker")
                        .attr("x1", scale(d.value[0]))
                        .attr("x2", scale(d.value[0]))
                        .attr("stroke", "black")
                        .attr("y1", 5)
                        .attr("y2", 25);

                    //draw vertical line for upperWhisker
                    svg.append("line")
                        .attr("class", "whisker")
                        .attr("x1", scale(d.value[4]))
                        .attr("x2", scale(d.value[4]))
                        .attr("stroke", "black")
                        .attr("y1", 5)
                        .attr("y2", 25);

                    //draw horizontal line from lowerWhisker to upperWhisker
                    svg.append("line")
                        .attr("class", "whisker")
                        .attr("x1", scale(d.value[0]))
                        .attr("x2", scale(d.value[4]))
                        .attr("stroke", "black")
                        .attr("y1", 10)
                        .attr("y2", 10);

                    //draw rect for iqr
                    svg.append("rect")
                        .attr("class", "box")
                        .attr("stroke", "black")
                        .attr("fill", "white")
                        .attr("x", scale(d.value[1]))
                        .attr("y", 5)
                        .attr("width", function () {
                            return scale(d.value[3]) - scale(d.value[1]);
                        })
                        .attr("height", 20);

                    //draw vertical line at median
                    svg.append("line")
                        .attr("class", "median")
                        .attr("stroke", "black")
                        .attr("x1", scale(d.value[2]))
                        .attr("x2", scale(d.value[2]))
                        .attr("y1", 5)
                        .attr("y2", 25);
                }
            }
            else {
                d3.select(this).html(function (d) {
                    return d.value;
                })
            }
        })
        .transition()
        .duration(2000)
        .style("left", function (d, i) {
            if (i == 1) return (self.cellWidth + 40) + "px"; // Test!
            if (i == 2) return (2 * self.cellWidth + 20) + "px"; // Test!
            return (i * self.cellWidth) + "px"
        });
};

Table.prototype.populateMovie = function(parentDivId,data,level) {
    var self = this;

    var rowsToPopulate = self.div.select(parentDivId)
        .selectAll(".dataRow")
        .data(data)
        .enter()
        .append("div")
        .attr("id", function (d) {
            return "container___" + d["id"];
        })
        .style("top", function (d, i) {
            return (i * self.cellHeight) + "px"
        })
        .append("div")
        .attr("id", function (d) {
            return d["id"];
        })
        .attr("class", function (d) {
            return "dataRow summaryRow tableRow movieRow level" + d["level"];
        })
        .on("click", function (d) {
            // Interactivity
        })
        .style("top", function (d, i) {
            return (i * self.cellHeight) + "px"
        });

    var cells = self.div.select(parentDivId)
        .selectAll(".summaryRow")
        .filter(".dataRow")
        .selectAll(".tableCell")
        .data(function (d) {
            return d3.entries(d["value"])
        })
        .enter()
        .append("div")
        //.attr("class", "tableCell")
        .attr("class",function (d,i) { // Test!
            if(i==0) return "tableCell2";
            if(i==1) return "tableCell1";
            if(i==2) return "tableCell3";
            return "tableCell";
        })
        .html(function (d) {
            return d.value
        })
        .transition()
        .duration(2000)
        .style("left", function (d, i) {
            if (i==1) return 20 + "px"; // Test!
            if (i==2) return (2*self.cellWidth + 20) + "px"; // Test!
            return (i * self.cellWidth) + "px"
        });
};

Table.prototype.nestedData = function(data,id,level) {

    var self = this;
    var rawData = d3.nest()
        .key(function (d) {
            var replaced = d[self.filters[level][0]].replace(/\s/g, 'unknown');
            return replaced.replace(/\./g,'_');
        })
        .rollup(function (leaves) {
            var key = (leaves[0][self.filters[level][0]]) !== " " ? leaves[0][self.filters[level][0]] : "Unknown";
            return {
                "key": self.filters[level][1] + ": " + key,
                "numberOfMovies": leaves.length,
                "averageRating": computeMean(leaves, 'imdb_score'),
                "averageBudget": computeQuartiles(leaves, 'budget'),// give min,Q25,median,Q75,max
                "averageGross": computeQuartiles(leaves, 'gross') // give min,Q25,median,Q75,max
            };
        })
        .entries(data);

    rawData.sort(function (a,b) {
        return d3.descending(a.key,b.key);
    });

    var newData = [];
    for(var t=0; t<rawData.length; t++) {
        newData.push({
            "level": level,
            "value": rawData[t].value,
            "id": id + "___" + self.filters[level][0] + "__" + rawData[t].key
        });
    }
    return newData;
};

Table.prototype.expandRows = function(id,level) {

    var self = this;

    var filters = id.split("___");
    var subset = clone(self.movies);

    for (var t = 1; t < filters.length; t++) {
        var filter = filters[t].split("__");
        console.log(filter);
        subset = subset.filter(function (d) {
            var replaced = (filter[0] == "imdb_score") ? filter[1].replace(/_/g, '.') : filter[1].replace('unknown', ' ');
            return d[filter[0]] == replaced;
        });
    }

    if (level == self.filters.length - 1 || subset.length == 1) {
        var movieInfo = [{
            "level": level + 1,
            "value": {
                "key": "",
                "title": subset[0]["movie_title"],
                "rating": subset[0]["imdb_score"],
                "budget": subset[0]["budget"],
                "gross": subset[0]["gross"]
            },
            "id": 0,
            "data": subset[0]
        }];
        self.populateMovie("#container___" + id, movieInfo, level + 1);
    }
    else {
        var nestedData = self.nestedData(subset, id, level + 1);
        self.populateTable("#container___" + id, nestedData);
    }
};

Table.prototype.shrinkRows = function(id) {
    var self = this;

    var c_id = "#container___" + id + ">div";

    var sel = self.div.selectAll(c_id)
        .filter(function (d,i) {
            return i > 0;
        })
        .remove();
};

Table.prototype.createSortOptions = function() {
    var self = this;

    var prefixedFilterLocation = [5,115,225];
    var locations = {
        "minAllowedX": 0,
        "maxAllowedX": 230,
        "textX": 10,
        "textY": 25,
        "rectWidth": 100,
        "rectHeight": 50,
        "rectSpacing": 10
    };


    var globalDiv = self.div.append("div"); // div for sort options and button

    var sortOptions = globalDiv
        .append("div")
        .attr("class","leftColumn")
        .attr("id","sort_options");

    var button = globalDiv
        .append("div")
        .attr("class","rightColumn")
        .append("svg")
        .attr("class","sortOptionSvg")
        .append("g")
        .on("click",function () {
            // update self.filters!
            self.updateFiltersOrder();
        });
    button
        .append("rect")
        .attr("x",0)
        .attr("y",0)
        .attr("class","button");
    button
        .append("text")
        .attr("class","buttonText")
        .attr("x",locations.textX)
        .attr("y",locations.textY)
        .text("Button");

    var group = sortOptions
        .append("svg")
        .attr("class","sortOptionSvg")
        .selectAll('g')
        .data(self.filters)
        .enter().append("g")
        .attr("data-order", function (d, i) {
            return i;
        })
        .attr("data-filter", function (d,i) {
            return self.filters[i][0];
        })
        .attr("data-filterTitle", function (d,i) {
            return self.filters[i][1];
        })
        .call(d3.drag()
            .subject(this)
                .on("start", self.dragstarted)
                .on("drag", self.dragged)
                .on("end", self.dragended)
        );

    group.append("rect")
        .attr("y", 0)
        .attr("x", function (d, i) {
            return prefixedFilterLocation[i];//110 * i + 5;
        })
        .attr("class", "sortOption");

    group.append("text")
        .attr("x", function (d, i) {
            return prefixedFilterLocation[i] + locations.textX;//110 * i + 10;
        })
        .attr("y", locations.textY)
        .style("class", "textFilter")
        .text(function (d) {
            return d[1];
        });

};

Table.prototype.dragstarted = function(d) {
    d3.select(this)
        .attr("z-index",3)
        .select("rect")
        .classed("active", true);
};

Table.prototype.dragended = function(d) {

    var prefixedFilterLocation = [5,115,225];
    var locations = {
        "minAllowedX": 0,
        "maxAllowedX": 230,
        "textX": 10,
        "textY": 25,
        "rectWidth": 100,
        "rectHeight": 50,
        "rectSpacing": 10
    };

    var movingFilter = d3.select(this)
        .attr("z-index",null);

    movingFilter.select("rect")
        .classed("active", false);

    movingFilter.select("rect")
        .transition()
        .duration(100)
        .attr("x", function () {
            return prefixedFilterLocation[movingFilter.attr("data-order")];
        });
    movingFilter.select("text")
        .transition()
        .duration(100)
        .attr("x", function () {
            return prefixedFilterLocation[movingFilter.attr("data-order")] + locations.textX;
        });

};

Table.prototype.dragged = function(d) {

    var prefixedFilterLocation = [5, 115, 225];
    var locations = {
        "minAllowedX": 0,
        "maxAllowedX": 230,
        "textX": 10,
        "textY": 25,
        "rectWidth": 100,
        "rectHeight": 50,
        "rectSpacing": 10
    };

    d3.select(this).select("text")
        .attr("x", d.x = Math.max(locations.minAllowedX, Math.min(locations.maxAllowedX, d3.event.x)) + locations.textX)
        .attr("y", locations.textY);
    d3.select(this).select("rect")
        .attr("x", d.x = Math.max(locations.minAllowedX, Math.min(locations.maxAllowedX, d3.event.x)));

    var oldDO = Number(d3.select(this).attr("data-order"));
    var oldX = prefixedFilterLocation[oldDO];
    var newX = Math.abs(Math.max(locations.minAllowedX, Math.min(locations.maxAllowedX, d3.event.x)));
    var mustMove = Math.abs(newX - oldX) >= locations.rectWidth + locations.rectSpacing;
    var movingDirection = Math.sign(newX - oldX);

    if (mustMove) {

        var numbersToMove = Math.floor(Math.abs(newX - oldX) / (locations.rectWidth + locations.rectSpacing));

        var filtersToMove = d3.select("#table_div").select("#sort_options")
            .selectAll('g')
            .filter(function () {
                return Number(d3.select(this).attr("data-order")) != oldDO &&
                    Number(d3.select(this).attr("data-order")) >= Math.min(oldDO, oldDO + movingDirection * numbersToMove) &&
                    Number(d3.select(this).attr("data-order")) <= Math.max(oldDO, oldDO + movingDirection * numbersToMove);
            });

        d3.select(this).attr("data-order", function () {
            return Number(d3.select(this).attr("data-order")) + movingDirection * numbersToMove;
        });

        filtersToMove.attr("data-order", function () {
            return Number(d3.select(this).attr("data-order")) - movingDirection;
        })
            .select("rect")
            .transition()
            .duration(100)
            .attr("x", function () {
                return d3.select(this).attr("x") - movingDirection * (locations.rectWidth + locations.rectSpacing);
            });
        filtersToMove.select("text")
            .transition()
            .duration(100)
            .attr("x", function () {
                return d3.select(this).attr("x") - movingDirection * (locations.rectWidth + locations.rectSpacing);
            });
    }
};

Table.prototype.updateFiltersOrder = function() {
    var self = this;

    var newOrder = [];
    var filters = d3.select("#table_div").select("#sort_options")
        .selectAll('g')
        .each(function () {
            newOrder.push({
                "filter": d3.select(this).attr("data-filter"),
                "title": d3.select(this).attr("data-filterTitle"),
                "order": d3.select(this).attr("data-order")
            });
        });

    newOrder.sort(function (a, b) {
        return d3.ascending(a["order"], b["order"]);
    });

    var newFilter = [];
    for (var i in newOrder)
        newFilter.push([newOrder[i]["filter"],newOrder[i]["title"]]);

    self.filters = newFilter;
    self.div.select("#tableBody").selectAll("div").remove();
    self.populateTable("#tableBody", self.nestedData(self.movies, "id", 0));
};

Table.prototype.update = function(newMovies) {
    var self = this;

};

Table.prototype.computeXscales = function (movies) {
    var self = this;

    self.xScaleBudget.domain([d3.min(movies
        .filter(function (d) {
            if (d['budget'] !== " ")
                return typeof d['budget'];
        })
        .map(function (d) {
            return +d['budget'];
        }))
        ,
        d3.max(self.movies
            .map(function (d) {
                if (d['budget'] !== " ")
                    return +d["budget"];
            }))]);

    self.xScaleGross.domain([d3.min(movies
        .filter(function (d) {
            if (d['gross'] !== " ")
                return typeof d['gross'];
        })
        .map(function (d) {
            return +d['gross'];
        }))
        ,
        d3.max(self.movies
            .map(function (d) {
                if (d['gross'] !== " ")
                    return +d["gross"];
            }))]);

};

// Got help from http://stackoverflow.com/questions/3774008/cloning-a-javascript-object
var clone = (function(){
    return function (obj) { Clone.prototype=obj; return new Clone() };
    function Clone(){}
}());

function computeQuartiles(leaves,attr) {

    var array = leaves
        .filter(function (d) {
            return d[attr] !== " ";
        })
        .map(function (d) {
            return +d[attr];
        });
    array.sort(function (a, b) {
        return d3.ascending(a, b);
    });

    var format = d3.format(",d");

    if (array.length == 0)
        return ["Unknown"];
    if (array.length == 1)
        return [format(array[0])];

    return [d3.quantile(array, 0), d3.quantile(array, 0.25), d3.quantile(array, 0.5), d3.quantile(array, 0.75), d3.quantile(array, 1)]
}

function computeMean(leaves,attr) {
    if (attr == "imdb_score") {
        return Math.round(d3.mean(leaves, function (g) {
                return g[attr] * 10
            })) / 10;
    }
    var format = d3.format(",d");
    return format(Math.round(d3.mean(leaves, function (g) {
        return g[attr]
    })));
}
