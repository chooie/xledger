(function () {
  "use strict";

  var search = require("./search.js");

  var React = require("react");

  React.render(React.createElement(SearchBox, {searchFn: search.search}), 
               document.getElementById("app"));
}());
