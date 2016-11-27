
/*
 Constructor
 */
function Table(movies,interactivity) {
    var self = this;

    self.movies = movies;
    self.interactivity = interactivity;

    self.div = d3.select("#table_div");
    self.cellHeight = 40;

    self.tableDivsWidth = parseInt(window.getComputedStyle(document.getElementById("table_div"),null).getPropertyValue("width"),10);

    self.xScaleBudget = d3.scaleLinear()
        .range([0,0.18 * self.tableDivsWidth]); // headerCell2

    self.xScaleGross = d3.scaleLog()
        .range([0,0.18 * self.tableDivsWidth]); // headerCell3

    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
Table.prototype.init = function() {
    var self = this;

    self.sortOptions = [{"Option": "title_year", "Text": "Year", "Order": 0},
        {"Option": "country", "Text": "Country", "Order": 1},
        {"Option": "imdb_score", "Text": "IMDB Score", "Order": 2},
        {"Option": "alph", "Text": "Alphabetical", "Order": 3},
        {"Option" : "gross", "Text" : "Gross", "Order": 4},
        {"Option" : "budget", "Text" : "Budget", "Order": 5},
        {"Option" : "content_rating", "Text" : "Content Rating", "Order": 6}];


    self.optionWidth = self.tableDivsWidth / (self.sortOptions.length + 3); // 80
    self.optionPadding = self.optionWidth / 10; // 10

    self.optionLocation = {
        "minAllowedX": 0,
        "maxAllowedX": (self.optionWidth + self.optionPadding) * self.sortOptions.length + self.optionPadding,
        "textX": 5,
        "textY": 25 // rectHeight / 2
    };

    self.createSortOptions();

    self.header = ["number Of Movies", "Rating", "Budget", "Gross"];

    self.computeXscales(self.movies);

    var header = self.div.append("div").attr("class", "header") // tableRow")
        .selectAll("tableCell")
        .data(self.header)
        .enter()
        .append("div")
        .attr("class", function (d, i) {
            return "headerCell headerCell" + i;
        })
        .html(function (d) {
            return d
        });

    header.each(function (d, i) {
        if (i == 2 || i == 3) {
            var scale = (i == 2) ? self.xScaleBudget : self.xScaleGross;
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
        .style("top", function (d, i) {
            return (i * self.cellHeight) + "px"
        });

    var cellLeft = 0;

    var cells = self.div.select(parentDivId)
        .selectAll(".summaryRow")
        .filter(".dataRow")
        .selectAll(".tableCell")
        .data(function (d) {
            return d3.entries(d["value"])
        })
        .enter()
        .append("div")
        .attr("class", function (d, i) {
            return "tableCell tableCell" + i;
        })
        .each(function (d, i) {
            if (i == 2) { // Stars
                var svg = d3.select(this)
                    .append("svg");

                var thisCellWidth = parseInt(d3.select(this).style("width"),10);

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
                        return Math.min(100, d.value * 10);
                    })
                    .attr("height", 35)
                    .attr("fill", "url(#stars)");
                /*
                svg
                    .append("rect")
                    .attr("x", 0)
                    .attr("y", 17)
                    .attr("width", function () {
                        return Math.min(100, Math.max(0, (d.value - 5) * 20));
                    })
                    .attr("height", 17)
                    .attr("fill", "url(#stars)");
                    */
            }
            else if (i == 3 || i == 4) { // Box Plot for Budget or Gross

                if (d.value.length === 1) {
                    d3.select(this).html(function (d) {
                        return d.value;
                    })
                }
                else {

                    var scale = i == 3 ? self.xScaleBudget : self.xScaleGross;

                    svg = d3.select(this)
                        .append("svg");

                    //draw vertical line for lowerWhisker
                    svg.append("line")
                        .attr("class", "whisker")
                        .attr("x1", scale(d.value[0]))
                        .attr("x2", scale(d.value[0]))
                        .attr("stroke", "black")
                        .attr("y1", 5)
                        .attr("y2", 15);

                    //draw vertical line for upperWhisker
                    svg.append("line")
                        .attr("class", "whisker")
                        .attr("x1", scale(d.value[4]))
                        .attr("x2", scale(d.value[4]))
                        .attr("stroke", "black")
                        .attr("y1", 5)
                        .attr("y2", 15);

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
                        .attr("height", 10);

                    //draw vertical line at median
                    svg.append("line")
                        .attr("class", "median")
                        .attr("stroke", "black")
                        .attr("x1", scale(d.value[2]))
                        .attr("x2", scale(d.value[2]))
                        .attr("y1", 5)
                        .attr("y2", 15);
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
            var thisLocation = cellLeft;
            if(i==4)
                cellLeft = 0;
            else
                cellLeft += parseInt(d3.select(this).style("width"),10) + 0.03 * self.tableDivsWidth; //(2 * padding)

            return thisLocation + "px"
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
            self.interactivity.updatedTable(d.data);
        })
        .style("top", function (d, i) {
            return (i * self.cellHeight) + "px"
        });

    var cellLeft = 0;
    var format = d3.format(",d");

    var cells = self.div.select(parentDivId)
        .selectAll(".summaryRow")
        .filter(".dataRow")
        .selectAll(".tableCell")
        .data(function (d) {
            return d3.entries(d["value"])
        })
        .enter()
        .append("div")
        .attr("class",function (d,i) {
            if(i==0) return "tableCell movieCell0";
            return "tableCell tableCell" + (i+1);
        })
        .html(function (d,i) {
            if (i == 2 || i == 3)
                return format(d.value);
            return d.value
        })
        .transition()
        .duration(2000)
        .style("left", function (d, i) {
            var thisLocation = cellLeft;
            if(i==3)
                cellLeft = 0;
            else
                cellLeft += parseInt(d3.select(this).style("width"),10) + 0.03 * self.tableDivsWidth; //(2 * padding)
            return thisLocation + "px"
        });
};

Table.prototype.nestedData = function(data,id,level) {

    var self = this;

    var formatGrossBudget = d3.format(".4s");

    var rawData = d3.nest()
        .key(function (d) {

            if (d[self.sortOptions[level].Option] == " ")
                return 'unknown';

            switch (self.sortOptions[level].Option) {
                case "alph" :
                    var reg = /[^A-Za-z0-9 ]/;
                    if (reg.test(d["movie_title"].charAt(0)))
                        return "special";
                    return d["movie_title"].charAt(0);
                case "gross" :
                    return Math.round(+d["gross"] / 1000000);// * 1000000;
                case "budget" :
                    return Math.round(+d["budget"] / 1000000);// * 1000000;
                case "country" :
                    return d["country"].replace(/\s/g, '_');
                case "imdb_score" :
                    return Math.round(+d["imdb_score"]);
                default:
                    return d[self.sortOptions[level].Option].replace(/\s/g, '_');
            }
        })
        .rollup(function (leaves) {

            if (leaves[0][self.sortOptions[level].Option] == " ")
                var key = 'unknown';
            else {
                switch (self.sortOptions[level].Option) {
                    case "alph" :
                        var reg = /[^A-Za-z0-9 ]/;
                        if (reg.test(leaves[0]["movie_title"].charAt(0))) {
                            key = "Special Characters";
                            break;
                        }
                        key = leaves[0]["movie_title"].charAt(0);
                        break;
                    case "gross" :
                        key = formatGrossBudget(Math.round(+leaves[0]["gross"] / 1000000) * 1000000);
                        break;
                    case "budget" :
                        key = formatGrossBudget(Math.round(+leaves[0]["budget"] / 1000000) * 1000000);
                        break;
                    case "country" :
                        key = leaves[0]["country"];
                        break;
                    case "imdb_score" :
                        key = Math.round(+leaves[0]["imdb_score"]);
                        break;
                    default:
                        key = leaves[0][self.sortOptions[level].Option];
                }
            }

            return {
                "key": self.sortOptions[level].Text + ": " + key,
                "numberOfMovies": leaves.length,
                "averageRating": computeMean(leaves, 'imdb_score'),
                "averageBudget": computeQuartiles(leaves, 'budget'),// give min,Q25,median,Q75,max
                "averageGross": computeQuartiles(leaves, 'gross') // give min,Q25,median,Q75,max
            };
        })
        .entries(data);

    rawData.sort(function (a,b) {
        if (d3.select("#sortCheckbox").property("checked")) {
            switch (self.sortOptions[level].Option) {
                case "gross" :
                    return d3.descending(+a.key, +b.key);
                case "budget" :
                    return d3.descending(+a.key, +b.key);
                case "imdb_score" :
                    return d3.descending(+a.key, +b.key);
                default:
                    return d3.descending(a.key, b.key);
            }
        }
        else {
            switch (self.sortOptions[level].Option) {
                case "gross" :
                    return d3.ascending(+a.key, +b.key);
                case "budget" :
                    return d3.ascending(+a.key, +b.key);
                case "imdb_score" :
                    return d3.ascending(+a.key, +b.key);
                default:
                    return d3.ascending(a.key, b.key);
            }
        }
    });

    var newData = [];
    for(var t=0; t<rawData.length; t++) {
        newData.push({
            "level": level,
            "value": rawData[t].value,
            "id": id + "___" + self.sortOptions[level].Option + "__" + rawData[t].key
        });
    }
    return newData;
};

Table.prototype.movieData = function(data,level){

    var self = this;

    var movieInfo = [];
    for (var j = 0; j < data.length; j++) {
        movieInfo.push({
            "level": level,
            "value": {
                "title": data[j]["movie_title"],
                "rating": data[j]["imdb_score"],
                "budget": data[j]["budget"],
                "gross": data[j]["gross"]
            },
            "id": 0,
            "data": data[j]
        })
    }

    return movieInfo;
};

Table.prototype.expandRows = function(id,level) {

    var self = this;

    var filters = id.split("___");
    var subset = clone(self.movies);

    for (var t = 1; t < filters.length; t++) {
        var filter = filters[t].split("__");

        subset = subset.filter(function (d) {
            if (filter[1] == 'unknown')
                return d[filter[0]] == " ";

            switch (filter[0]) {
                case "alph" :
                    var reg = /[^A-Za-z0-9 ]/;
                    if (reg.test(d["movie_title"].charAt(0)))
                        return "special" == filter[1];
                    return d["movie_title"].charAt(0) == filter[1];
                case "gross" :
                    return Math.round(+d["gross"] / 1000000) == filter[1];
                case "budget" :
                    return Math.round(+d["budget"] / 1000000) == filter[1];
                case "country" :
                    return d["country"].replace(/\s/g, '_') == filter[1];
                case "imdb_score" :
                    return Math.round(+d["imdb_score"]) == filter[1];
                default:
                    return d[filter[0]].replace(/\s/g, '_') == filter[1];
            }
        });
    }

    if (level == self.sortOptions.length - 1 || subset.length == 1) {
        var movieInfo = self.movieData(subset,level+1);
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

    var sortDiv = self.div.append("div"); // div for sort options and button

    sortDiv.append("div")
        .style("padding", "12px")
        .append("span")
        .text("Drag grouping options to order, " +
            "drag them to the left side to deactivate, " +
            "drag them to right to activate. " +
            "Steelblue options are active options");

    var sortOptionsDiv = sortDiv
        .append("div")
        .attr("id", "sort_options");

    var group = sortOptionsDiv
        .append("svg")
        .attr("class", "sortOptionSVG") // all filters are active
        .selectAll('g')
        .data(self.sortOptions)
        .enter().append("g")
        .attr("class", "activeFilter")
        .attr("data-order", function (d, i) {
            return i;
        })
        .call(d3.drag()
            .subject(this)
            .on("start", function () {
                self.dragstarted(this)
            })
            .on("drag", function (d) {
                self.dragged(this, d)
            })
            .on("end", function () {
                self.dragended(this)
            })
        );

    group.append("rect")
        .attr("y", 0)
        .attr("x", function (d, i) {
            return i * (self.optionWidth + self.optionPadding);
        })
        .attr("rx",10)
        .attr("class", "sortOptionRect")
        .attr("width", self.optionWidth);

    group.append("text")
        .attr("x", function (d, i) {
            return i * (self.optionWidth + self.optionPadding) + self.optionLocation.textX;
        })
        .attr("y", self.optionLocation.textY)
        .attr("class", "textFilter")
        .text(function (d) {
            return d.Text;
        });

    var buttonDiv = sortDiv
        .append("div");

    var checkBox = buttonDiv.append("input")
        .attr("type","checkbox")
        .attr("id","sortCheckbox")
        .attr("checked",true);

    buttonDiv.append("text")
        .text("Descending");

    var buttonSvg = buttonDiv
        .append("svg")
        .attr("class", "sortOptionSVG")
        .append("g")
        .on("click", function () {
            // update self.filters!
            self.updateFiltersOrder();
        });

    buttonSvg
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("rx",10)
        .attr("class", "sortButton");

    buttonSvg
        .append("text")
        .attr("class", "buttonText")
        .attr("x", self.optionLocation.textX)
        .attr("y", self.optionLocation.textY)
        .text("Apply");
};

Table.prototype.dragstarted = function(draggingElement) {
    var self = this;

    d3.select(draggingElement)
        .select("rect")
        .classed("moving", true);
};

Table.prototype.dragended = function(draggingElement) {

    var self = this;
    var movingFilter = d3.select(draggingElement);

    movingFilter.select("rect")
        .classed("moving", false)
        .transition()
        .duration(100)
        .attr("x", function () {
            if (movingFilter.classed("activeFilter"))
                return Number(movingFilter.attr("data-order")) * (self.optionWidth + self.optionPadding);
            else
                return (Number(movingFilter.attr("data-order")) + 1) * (self.optionWidth + self.optionPadding);
        });
    movingFilter.select("text")
        .transition()
        .duration(100)
        .attr("x", function () {
            if (movingFilter.classed("activeFilter"))
                return Number(movingFilter.attr("data-order")) * (self.optionWidth + self.optionPadding) + self.optionLocation.textX;
            else
                return (Number(movingFilter.attr("data-order")) + 1) * (self.optionWidth + self.optionPadding) + self.optionLocation.textX;
        });
};

Table.prototype.dragged = function(draggingElement,d) {
    var self = this;

    var newX = Math.abs(Math.max(self.optionLocation.minAllowedX, Math.min(self.optionLocation.maxAllowedX, d3.event.x)));
    var oldX = d3.select(draggingElement).attr("data-order")*(self.optionWidth + self.optionPadding);
    if (d3.select(draggingElement).classed("activeFilter") == false)
        oldX += (self.optionWidth + self.optionPadding);

    d3.select(draggingElement).select("text")
        .attr("x", d.x = newX + self.optionLocation.textX);
    d3.select(draggingElement).select("rect")
        .attr("x", d.x = newX);

    if (Math.abs(newX - oldX) >= (self.optionWidth + self.optionPadding)) {
        if (newX > oldX) {
            var filters = self.div.select("#sort_options")
                .selectAll('g')
                .filter(function () {
                    return d3.select(this).attr("data-order") > d3.select(draggingElement).attr("data-order")
                        && Number(d3.select(this).attr("data-order")) * (self.optionWidth + self.optionPadding) <= newX
                        && d3.select(this).classed("activeFilter");
                });

            if (filters.size() != 0) {
                // Update
                filters.attr("data-order", function () {
                    return Number(d3.select(this).attr("data-order")) - 1;
                });
                filters.select("rect")
                    .transition()
                    .duration(100)
                    .attr("x", function () {
                        return Number(d3.select(this).attr("x")) - (self.optionWidth + self.optionPadding);
                    });
                filters.select("text")
                    .transition()
                    .duration(100)
                    .attr("x", function () {
                        return Number(d3.select(this).attr("x")) - (self.optionWidth + self.optionPadding);
                    });

                d3.select(draggingElement).attr("data-order", function () {
                    return Number(d3.select(this).attr("data-order")) + filters.size();
                });
            }
            else {
                d3.select(draggingElement).classed("activeFilter", false);
            }
        }
        else {
            var numbersToMove = Math.floor(Math.abs(newX - oldX) / (self.optionWidth + self.optionPadding)); // possibly unnecessary always > 0

            if (numbersToMove > 0) {
                // update
                var toMove = self.div.select("#sort_options")
                    .selectAll('g')
                    .filter(function () {
                        return d3.select(this).attr("data-order") < d3.select(draggingElement).attr("data-order") &&
                            Number(d3.select(this).attr("data-order")) * (self.optionWidth + self.optionPadding) >= newX;
                    })
                    .attr("data-order", function () {
                        return Number(d3.select(this).attr("data-order")) + 1;
                    });

                toMove.select("rect")
                    .transition()
                    .duration(100)
                    .attr("x", function () {
                        return Number(d3.select(this).attr("x")) + (self.optionWidth + self.optionPadding);
                    });
                toMove.select("text")
                    .transition()
                    .duration(100)
                    .attr("x", function () {
                        return Number(d3.select(this).attr("x")) + (self.optionWidth + self.optionPadding);
                    });

                d3.select(draggingElement)

                    .classed("activeFilter", function () {
                        return toMove.size() < numbersToMove;
                    })
                    .attr("data-order", function () {
                        return Number(d3.select(this).attr("data-order")) - toMove.size();
                    });
            }

        }
    }
};

Table.prototype.updateFiltersOrder = function() {
    var self = this;

    var newOrder = [];
    var filters = self.div.select("#sort_options")
        .selectAll('g')
        .filter(function () {
            return d3.select(this).classed("activeFilter");
        })
        .each(function (d) {
            newOrder.push({
                "Option": d.Option,
                "Text": d.Text,
                "Order": d3.select(this).attr("data-order")
            });
        });

    newOrder.sort(function (a, b) {
        return d3.ascending(a["Order"], b["Order"]);
    });

    if (newOrder.length == 0) {
        var newMovieList = self.movieData(self.movies, 0);
        if (newMovieList.length > 200) {
            alert("Too many movies to populate");
            return;
        }
        self.sortOptions = newOrder;
        self.div.select("#tableBody").selectAll("div").remove();
        self.populateMovie("#tableBody", newMovieList, 0);
    }
    else {
        self.sortOptions = newOrder;
        self.div.select("#tableBody").selectAll("div").remove();
        self.populateTable("#tableBody", self.nestedData(self.movies, "id", 0));
    }
};

Table.prototype.update = function(newMovies) {

    var self = this;

    self.movies = newMovies;

    if (newMovies.length <= 50) {
        var allFilters = self.div.select("#sort_options")
            .selectAll('g')
            .classed("activeFilter",false);
    }
    else {
        var inactiveOrder = self.sortOptions.length - 1;

        var filters = self.div.select("#sort_options")
            .selectAll('g')
            .classed("activeFilter", true);

        filters = self.div.select("#sort_options")
            .selectAll('g')
            .each(function (d) {

                var thisElement = d3.select(this);
                //var order = thisElement.attr("data-order");
                var option = d.Option;

                if (option == 'title_year' || option == 'imdb_score' || option == 'country') {

                    if (self.interactivity.filters[option].length > 0) { // used filter

                        var swapElements = self.div.select("#sort_options")
                            .selectAll('g').filter(function () {
                                return d3.select(this).attr("data-order") != thisElement.attr("data-order")
                                    && d3.select(this).classed("activeFilter");
                            })
                            .attr("data-order", function (d, i) {
                                return d3.select(this).attr("data-order") - 1;
                            });

                        thisElement
                            .attr("data-order", inactiveOrder)
                            .classed("activeFilter", false);

                        inactiveOrder -= 1;
                    }
                }
            });
    }

    filters.each(function () {
        var thisElement = d3.select(this);

        thisElement.select("rect")
            .transition()
            .duration(2000)
            .attr("x", function () {
                if (thisElement.classed("activeFilter"))
                    return Number(thisElement.attr("data-order")) * (self.optionWidth + self.optionPadding);
                else
                    return (Number(thisElement.attr("data-order")) + 1) * (self.optionWidth + self.optionPadding);
            });
        thisElement.select("text")
            .transition()
            .duration(2000)
            .attr("x", function () {
                if (thisElement.classed("activeFilter"))
                    return Number(thisElement.attr("data-order")) * (self.optionWidth + self.optionPadding) + self.optionLocation.textX;
                else
                    return (Number(thisElement.attr("data-order")) + 1) * (self.optionWidth + self.optionPadding) + self.optionLocation.textX;
            });
    });

    // Update table
    self.updateFiltersOrder();

};

Table.prototype.computeXscales = function (movies) {
    var self = this;

    self.xScaleBudget
        .domain([d3.min(movies
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

    var format = d3.format(",d");

    if (attr == "imdb_score") {
        return Math.round(d3.mean(leaves, function (g) {
                return g[attr] * 10
            })) / 10;
    }
    return format(Math.round(d3.mean(leaves, function (g) {
        return g[attr]
    })));
}
