(function() {
  "use strict";

  var ui = require("./ui/ui");
  var SearchData = require("./search_data");

  exports.hello = function hello() {
    return "Hello";
  };

  exports.search = function(searchTerm) {
    if (searchIsEmpty(searchTerm)) {
      return [];
    }
    
    // Sample implemention, only respecting rule 2 : Matches at the beginning  
    var i,
        entry,
        searchDataLength = SearchData.length, 
        ret = [];
    
    for (i = 0; i < searchDataLength; i += 1) {
      entry = SearchData[i];
      if (entry.substr(0, searchTerm.length).toLowerCase() === searchTerm.toLowerCase()) {
        ret.push({value: entry, matches: [{start: 0, end: searchTerm.length}]});
      }
    }
    return ret.slice(0, 20);
  };

  function searchIsEmpty(searchTerm) {
    return !searchTerm || searchTerm.length === 0;
  }

  exports.run = function() {
    ui.run();
  };
  
}());
