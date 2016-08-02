(function() {
  "use strict";

  var ui = require("./ui/ui");
  var SearchData = require("./search_data");

  module.exports = {
    search: search,
    getBeginningMatches: getBeginningMatches
  };

  function search(searchData, searchTerm) {
    if (searchIsEmpty(searchTerm)) {
      return [];
    }

    // TODO: Exact matches
    
    var beginningMatches = getBeginningMatches(searchData, searchTerm);

    // TODO: Matches at the end
    //       Partial beginning of word match
    //       Matches in the middle

    var matches = beginningMatches;

    var mostRelevantSubset = matches.slice(0, 20);

    return mostRelevantSubset;
  }

  function searchIsEmpty(searchTerm) {
    return !searchTerm || searchTerm.length === 0;
  }

  function getBeginningMatches(searchData, searchTerm) {
    var beginningMatches = [];
    var entry;

    for (var i = 0; i < searchData.length; i += 1) {
      entry = SearchData[i];
      if (isBeginningMatch(searchTerm, entry)) {
        beginningMatches.push({value: entry,
                            matches: [{start: 0, end: searchTerm.length}]});
      }
    }
    return beginningMatches;
  }

  function isBeginningMatch(searchTerm, searchDataEntry) {
    var lowerCaseSearchTerm = searchTerm.toLowerCase(),
        lowerCaseSearchDataEntry = searchDataEntry.toLowerCase(),
        entryUpToSearchLength =
          lowerCaseSearchDataEntry.substr(0, searchTerm.length);
    return lowerCaseSearchTerm === entryUpToSearchLength;
  }

  exports.run = function() {
    ui.run(SearchData);
  };
  
}());
