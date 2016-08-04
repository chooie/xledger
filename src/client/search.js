(function() {
  "use strict";

  var ui = require("./ui/ui");
  var SearchData = require("./search_data");
  var _ = require("../shared/lodash.js");

  module.exports = {
    search: search,
    getExactMatches: getExactMatches,
    getBeginningMatches: getBeginningMatches,
    getEndingMatches: getEndingMatches,
    getPartialBeginningOfWordsMatches: getPartialBeginningOfWordsMatches,
    getMiddleMatches: getMiddleMatches,
    run: run
  };

  function search(dataToSearch, searchTerm) {
    if (searchIsEmpty(searchTerm)) {
      return [];
    }

    var exactMatches = getExactMatches(dataToSearch, searchTerm);
    var beginningMatches = getBeginningMatches(dataToSearch, searchTerm);
    var endingMatches = getEndingMatches(dataToSearch, searchTerm);
    var partialBeggingsMatches = getPartialBeginningOfWordsMatches(dataToSearch,
                                                                  searchTerm);
    var middleMatches = getMiddleMatches(dataToSearch, searchTerm);

    var matches = _.concat(exactMatches,
                          beginningMatches,
                          endingMatches,
                          partialBeggingsMatches,
                          middleMatches);

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

      var match = getMatchForEntry(entry, searchWords);

      if (match && match.matches.length === searchWords.length) {
        matches.push(match);
      }
    });

    return matches;
  }

  function getMatchForEntry(entry, searchWords) {
    var entryWords = entry.split(" ");
    var match = createWordMatch(entry, []);

    var firstSearchWord = _.head(searchWords);

    var firstMatchingWordIndex = getIndexOfFirstSearchWordMatch(firstSearchWord,
                                                                entryWords);
    if (firstMatchingWordIndex < 0) {
      return;
    }

    var spacesUpToMatchingWord = getIndexesUpToWord(entryWords,
                                                    firstMatchingWordIndex),
        start = spacesUpToMatchingWord,
        end = start + firstSearchWord.length;

    match.matches.push({start: start, end: end});

    var latestIndex = firstMatchingWordIndex;

    var searchWordsExceptFirst = _.tail(searchWords);

    searchWordsExceptFirst.forEach(function(searchWord) {
      var spacesUpToEntryWord,
          start,
          end;
      for (var i = 0; i < entryWords.length; i += 1) {
        if (isBeginningMatch(searchWord, entryWords[i]) &&
            i > latestIndex) {
          spacesUpToEntryWord = getIndexesUpToWord(entryWords, i);
          start = spacesUpToEntryWord;
          end = start + searchWord.length;
          match.matches.push({start: start, end: end});
          latestIndex = i;
          return;
        }
      }
    });

    return match;
  }

  function getIndexOfFirstSearchWordMatch(firstSearchWord, entryWords) {
    for (var i = 0; i < entryWords.length; i += 1) {
      if (isBeginningMatch(firstSearchWord, entryWords[i])) {
        return i;
      }
    }
    return -1;
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

  function getMiddleMatches(searchData, searchWord) {
    var matches = [];

    searchData.forEach(function(entry) {
      var entryUpper = entry.toUpperCase();
      var searchWordUpper = searchWord.toUpperCase();
      var matchIndex = entryUpper.indexOf(searchWordUpper);

      if (matchIndex > 0) {
        matches.push(createWordMatch(entry,
                                     [{start: matchIndex,
                                       end: matchIndex + searchWord.length}]));
      }
    });

    return matches;
  }

  function createWordMatch(wordValue, matchRanges) {
    return {
      value: wordValue,
      matches: matchRanges
    };
  }

  function run() {
    ui.run(SearchData, search);
  }

}());
