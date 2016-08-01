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
        searchMatches = [];
    
    for (i = 0; i < searchDataLength; i += 1) {
      entry = SearchData[i];
      if (isBeginningMatch(searchTerm, entry)) {
        searchMatches.push({value: entry,
                            matches: [{start: 0, end: searchTerm.length}]});
      }
    }

    var mostRelevantSubset = searchMatches.slice(0, 20);

    return mostRelevantSubset;
  };

  function searchIsEmpty(searchTerm) {
    return !searchTerm || searchTerm.length === 0;
  }

  function isBeginningMatch(searchTerm, searchDataEntry) {
    var lowerCaseSearchTerm = searchTerm.toLowerCase(),
        lowerCaseSearchDataEntry = searchDataEntry.toLowerCase(),
        entryUpToSearchLength =
          lowerCaseSearchDataEntry.substr(0, searchTerm.length);
    return lowerCaseSearchTerm === entryUpToSearchLength;
  }

  exports.run = function() {
    ui.run();
  };
  
}());
