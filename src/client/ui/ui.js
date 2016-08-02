(function () {
  "use strict";

  var search = require("../search.js");
  var SearchBox = require("./search_box");

  var React = require("../../shared/react");

  exports.run = function(searchData) {
    var searchFn = search.search.bind(null, searchData);
    React.render(React.createElement(SearchBox, {searchFn: searchFn}),
                    document.getElementById("app"));
  };
}());
