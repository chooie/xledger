(function () {
  "use strict";

  var search = require("../search.js");
  var SearchBox = require("./search_box");

  var React = require("react");

  React.render(React.createElement(SearchBox, {searchFn: search.search}), 
               document.getElementById("app"));
}());