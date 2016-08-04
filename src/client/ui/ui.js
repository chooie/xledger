(function () {
  "use strict";

  var SearchBox = require("./search_box");

  var React = require("../../shared/react");

  exports.run = function(searchData, searchFunction) {
    var searchFn = searchFunction.bind(null, searchData);
    React.render(React.createElement(SearchBox, {searchFn: searchFn}),
                    document.getElementById("app"));
  };
}());
