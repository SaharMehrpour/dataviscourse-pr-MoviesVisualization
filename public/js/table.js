
/*
 Constructor
 */
function Table(movies,interactivity) {
    var self = this;

    self.movies = movies;
    self.interactivity = interactivity;

    self.div = d3.select("#table_div");
    self.cellWidth = +(self.div.style("width").split("px")[0])/5;

    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
Table.prototype.init = function() {
    var self = this;

    self.levels = ["title_year", "country", "imdb_score"];
    self.header = ["key", "numberOfMovies", "averageRating", "averageBudget", "averageGross"];

    self.div
        .append("div")
        .attr("class", "table");

    self.displayedData = self.nestedData(self.movies, "", 0);
    self.populateTable(self.displayedData);

    d3.select("div.table")
        .append("div")
        .attr("class", "head")
        .selectAll("div.data")
        .data(self.header)
        .enter()
        .append("div")
        .attr("class", "data")
        .html(function (d) {
            return d
        })
        .style("left", function (d, i) {
            return (i * self.cellWidth) + "px"
        });

};

Table.prototype.populateTable = function(nestedData) {

    var self = this;

    var rows = d3.select("div.table")
        .selectAll("div.datarow")
        .data(nestedData);
    var enterRows = rows
        .enter()
        .append("div")
        .merge(rows)
        .attr("class", function (d) {
            return "datarow " + "level" + d.level;
        })
        .attr("id", function (d) {
            return d["id"];
        })
        .on("click", function (d, i) {
            self.expandRows(d["id"], d["level"], i);
        })
        .transition()
        .duration(2000)
        .style("top", function (d, i) {
            return (40 + (i * 40)) + "px"
        });

    var cells = d3.selectAll("div.datarow")
        .selectAll("div.data")
        .data(function (d) {
            return d3.entries(d["value"])
        });

    var enterCells = cells
        .enter()
        .append("div")
        .attr("class", "data")
        .merge(cells)
        .html(function (d) {
            return d.value
        })
        .transition()
        .duration(2000)
        .style("left", function (d, i) {
            return (i * self.cellWidth) + "px"
        });

    //var selectedMovie;
    //self.interactivity.updatedTable(selectedMovie);

};

Table.prototype.nestedData = function(data,id,level) {

    var self = this;

    var cellData = d3.nest()
        .key(function (d) {
            return d[self.levels[level]];
        })
        .rollup(function (leaves) {
            return {
                "key" : self.levels[level] + ": " + leaves[0][self.levels[level]],
                "numberOfMovies" : leaves.length,
                "averageRating" : computeMean(leaves,"imdb_score"),
                "averageBudget" : computeMean(leaves,"budget"),
                "averageGross" : computeMean(leaves,"gross")
            };
        })
        .entries(data);

    cellData.sort(function (a,b) {
        return d3.descending(a.key,b.key);
    });

    var newData = [];
    for(var t=0; t<cellData.length; t++) {
        newData.push({
            "level": level,
            "value": cellData[t].value,
            "id": id + ";" + self.levels[level] + "_" + cellData[t].key
        });
    }

    return newData;
};


Table.prototype.expandRows = function(id,level,rowIndex) {

    var self = this;

    var filters = id.split(";");
    var subset = clone(self.movies);

    for (var t = 0; t < filters.length; t++) {
        var filter = filters[t].split(" ");
        subset = subset.filter(function (d) {
            return d[filter[0]] == filter[1];
        });
    }

    var addedData = self.nestedData(subset,id,level+1);

    var beforeAddedData = self.displayedData.slice(0,rowIndex+1);
    var afterAddedData = self.displayedData.slice(rowIndex+1,self.displayedData.length);

    self.displayedData = beforeAddedData.concat(addedData).concat(afterAddedData);
    self.populateTable(self.displayedData);
};

// Got help from http://stackoverflow.com/questions/3774008/cloning-a-javascript-object
var clone = (function(){
    return function (obj) { Clone.prototype=obj; return new Clone() };
    function Clone(){}
}());

function computeMean(leaves,attr){
    return Math.round(d3.mean(leaves,function (g) {
        return g[attr]}));
}

Table.prototype.update = function(newMovies) {

    var self = this;

};
