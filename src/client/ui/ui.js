(function () {
  "use strict";

  var search = require("../search.js");
  var SearchBox = require("./search_box");

  var React = require("react");
  var ReactDOM = require("react-dom");

  exports.run = function() {
    ReactDOM.render(React.createElement(SearchBox, {searchFn: search.search}), 
                    document.getElementById("app"));
  };
}());
