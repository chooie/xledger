(function() {
  "use strict";

  var ui = require("./ui/ui");
  var SearchData = require("./search_data");

  module.exports = {
    search: search,
    getExactMatches: getExactMatches,
    getBeginningMatches: getBeginningMatches,
    getEndingMatches: getEndingMatches,
    getPartialBeginningOfWordsMatches: getPartialBeginningOfWordsMatches
  };

  function search(dataToSearch, searchTerm) {
    if (searchIsEmpty(searchTerm)) {
      return [];
    }

    // TODO: Exact matches
    
    var beginningMatches = getBeginningMatches(dataToSearch, searchTerm);

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

  function getExactMatches(dataToSearch, searchTerm) {
    var exactMatches = [];

    dataToSearch.forEach(function(entry) {
      var match;
      if (isExactMatch(searchTerm, entry)) {
        match = createWordMatch(entry, [{start: 0,
                                         end: searchTerm.length}]);
        exactMatches.push(match);
      }
    });

    return exactMatches;
  }

  function isExactMatch(searchTerm, dataToSearchEntry) {
    var lowerCaseSearchTerm = searchTerm.toLowerCase(),
        lowerCaseSearchDataEntry = dataToSearchEntry.toLowerCase();

    return lowerCaseSearchTerm === lowerCaseSearchDataEntry;
  }

  function getBeginningMatches(dataToSearch, searchTerm) {
    var beginningMatches = [];

    dataToSearch.forEach(function(entry) {
      if (isBeginningMatch(searchTerm, entry)) {
        beginningMatches.push(createWordMatch(entry,
                                              [{start: 0,
                                                end: searchTerm.length}]));
      }
    });

    return beginningMatches;
  }

  function isBeginningMatch(searchTerm, dataToSearchEntry) {
    var lowerCaseSearchTerm = searchTerm.toLowerCase(),
        lowerCaseSearchDataEntry = dataToSearchEntry.toLowerCase(),
        entryUpToSearchLength =
        lowerCaseSearchDataEntry.substr(0, searchTerm.length);
    return lowerCaseSearchTerm === entryUpToSearchLength;
  }

  function getEndingMatches(dataToSearch, searchTerm) {
    var endingMatches = [];

    dataToSearch.forEach(function(entry) {
      if (isEndingMatch(searchTerm, entry)) {
        endingMatches.push(createEndingMatch(searchTerm, entry));
      }
    });

    return endingMatches;
  }

  function isEndingMatch(searchTerm, dataToSearchEntry) {
    if (searchTerm.length > dataToSearchEntry.length) {
      return false;
    }

    var lowerCaseSearchTerm = searchTerm.toLowerCase(),
        lowerCaseSearchDataEntry = dataToSearchEntry.toLowerCase(),
        entryEnding = lowerCaseSearchDataEntry.slice(-(searchTerm.length));

    return entryEnding === lowerCaseSearchTerm;
  }

  function createEndingMatch(searchTerm, dataToSearchEntry) {
    var startRange = dataToSearchEntry.length - searchTerm.length,
        endRange = dataToSearchEntry.length,
        rangeArr = [{start: startRange, end: endRange}];
    return createWordMatch(dataToSearchEntry, rangeArr);
  }

  function getPartialBeginningOfWordsMatches(dataToSearch, searchTerm) {
    var searchWords = searchTerm.split(" ");

    if (!containsMultipleWords(searchWords)) {
      return [];
    }

    var matches = [];

    dataToSearch.forEach(function(entry) {
      var entryWords = entry.split(" ");

      if (!containsMultipleWords(entryWords)) {
        return;
      }

      var match = createWordMatch(entry, []);

      searchWords.forEach(function(searchWord, i) {
        var equivalentEntryWord = entryWords[i],
            spacesUpToEntryWord = getIndexesUpToWord(entryWords, i),
            start = spacesUpToEntryWord,
            end = start + searchWord.length;
        
        if (isBeginningMatch(searchWord, equivalentEntryWord)) {
          
          match.matches.push({start: start, end: end});
        }
      });

      if (match.matches.length === searchWords.length) {
        matches.push(match);
      }
    });

    return matches;
  }

  function getIndexesUpToWord(entryWords, index) {
    var indexes = 0;

    for (var i = 0; i < index; i += 1) {
      indexes += entryWords[i].length + 1;
    }

    return indexes;
  }

  function containsMultipleWords(arr) {
    return arr.length > 1;
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
