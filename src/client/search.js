(function() {
  "use strict";

  var ui = require("./ui/ui");
  var SearchData = require("./search_data");

  module.exports = {
    search: search,
    getExactMatches: getExactMatches,
    getBeginningMatches: getBeginningMatches,
    getEndingMatches: getEndingMatches
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

  function getExactMatches(searchData, searchTerm) {
    var exactMatches = [];
    var entry;

    for (var i = 0; i < searchData.length; i += 1) {
      entry = searchData[i];

      if (isExactMatch(searchTerm, entry)) {
        exactMatches.push(createWordMatch(entry, [{start: 0,
                                                   end: searchTerm.length}]));
      }
    }
    return exactMatches;
  }

  function isExactMatch(searchTerm, searchDataEntry) {
    var lowerCaseSearchTerm = searchTerm.toLowerCase(),
        lowerCaseSearchDataEntry = searchDataEntry.toLowerCase();

    return lowerCaseSearchTerm === lowerCaseSearchDataEntry;
  }

  function getBeginningMatches(searchData, searchTerm) {
    var beginningMatches = [];
    var entry;

    for (var i = 0; i < searchData.length; i += 1) {
      entry = searchData[i];
      if (isBeginningMatch(searchTerm, entry)) {
        beginningMatches.push(createWordMatch(entry,
                                              [{start: 0,
                                                end: searchTerm.length}]));
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

  function getEndingMatches(searchData, searchTerm) {
    var endingMatches = [];
    var entry;

    for (var i = 0; i < searchData.length; i += 1) {
      entry = searchData[i];
      if (isEndingMatch(searchTerm, entry)) {
        endingMatches.push(createEndingMatch(searchTerm, entry));
      }
    }
    return endingMatches;
  }

  function isEndingMatch(searchTerm, searchDataEntry) {
    if (searchTerm.length > searchDataEntry.length) {
      return false;
    }

    var lowerCaseSearchTerm = searchTerm.toLowerCase(),
        lowerCaseSearchDataEntry = searchDataEntry.toLowerCase(),
        entryEnding = lowerCaseSearchDataEntry.slice(-(searchTerm.length));

    return entryEnding === lowerCaseSearchTerm;
  }

  function createEndingMatch(searchTerm, searchDataEntry) {
    var startRange = searchDataEntry.length - searchTerm.length,
        endRange = searchDataEntry.length,
        rangeArr = [{start: startRange, end: endRange}];
    return createWordMatch(searchDataEntry, rangeArr);
  }

 function createWordMatch(wordValue, matchRanges) {
   return {
     value: wordValue,
     matches: matchRanges
   };
 }

  exports.run = function() {
    ui.run(SearchData);
  };
  
}());
