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
    sortByWordLength: sortByWordLength,
    combineDuplicateMatchesForValue: combineDuplicateMatchesForValue,
    consolidateDuplicates: consolidateDuplicates,
    prepareMatches: prepareMatches,
    run: run
  };

  function search(dataToSearch, searchTerm) {

    var matches = getSearchResultsForWholeTerm(dataToSearch, searchTerm);

    var desiredResultCount = 20;

    var mostRelevantSubset = matches.slice(0, desiredResultCount);

    var searchTermWords = searchTerm.split(" ");

    if (mostRelevantSubset.length === desiredResultCount ||
        searchTermWords.length === 1) {
      return mostRelevantSubset;
    }

    var searchTermWordsByLength = sortByWordLength(searchTermWords);

    var matchesForEachWord = searchTermWordsByLength.map(function(word) {
      return getSearchResultsForWholeTerm(dataToSearch, word);
    });

    matches = _.concat(matches, _.flatten(matchesForEachWord));

    var matchesLessDuplicates = consolidateDuplicates(matches);

    mostRelevantSubset = matchesLessDuplicates.slice(0, desiredResultCount);

    return mostRelevantSubset;
  }

  function sortByWordLength(words) {
    var wordsAsc =  _.sortBy(words, function(word) {
      return word.length;
    });

    return _.reverse(wordsAsc);
  }

  function getSearchResultsForWholeTerm(dataToSearch, searchTerm) {
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
    return matches;
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

  function consolidateDuplicates(matches) {
    var matchesLessDuplicates = [];
    var matchesWithDuplicates = matches;
    var currentMatch;
    var currentValueMatches;
    var consolidatedMatch;

    while (!_.isEmpty(matchesWithDuplicates)) {
      currentMatch = _.first(matchesWithDuplicates);
      currentValueMatches = _.filter(matchesWithDuplicates,
                                     {value: currentMatch.value});
      consolidatedMatch =
        combineDuplicateMatchesForValue(matchesWithDuplicates,
                                        currentMatch.value);
      matchesLessDuplicates.push(consolidatedMatch);
      matchesWithDuplicates = _.xor(currentValueMatches, matchesWithDuplicates);
    }
    return matchesLessDuplicates;
  }

  function combineDuplicateMatchesForValue(matches, value) {
    var filtered = _.filter(matches, {value: value});
    var consolidatedMatch =  _.reduce(filtered, function(accMatch, item) {
      var unorderedMatches = _.concat(accMatch.matches, item.matches);
      var handledMatches = prepareMatches(unorderedMatches);
      accMatch.matches = handledMatches;
      return accMatch;
    }, {value: filtered[0].value, matches: []});
    consolidatedMatch.matches = _.uniqWith(consolidatedMatch.matches,
                                           _.isEqual);
    return consolidatedMatch;
  }

  function prepareMatches(matches) {
    var orderedMatches = _.orderBy(matches, "start");
    
    var orderedMatchesLessUnnecessaryMatches =
        _.reduce(orderedMatches, function(accumMatches, match) {
          if (matchNotInRangeOfOtherMatches(orderedMatches, match)) {
            return _.concat(accumMatches, match);
          }
          return accumMatches;
        }, []);
    return orderedMatchesLessUnnecessaryMatches;
  }

  function matchNotInRangeOfOtherMatches(matches, match) {
    var matchesLessMatch = _.filter(matches, function(curMatch) {
      return !_.isEqual(curMatch, match);
    });
    for (var i = 0; i < matchesLessMatch.length; i += 1) {
      if (isWithinRange(match, matchesLessMatch[i])) {
        return false;
      }
    }
    return true;
  }

  function isWithinRange(matchToTest, otherMatch) {
    return (matchToTest.start >= otherMatch.start) &&
      (matchToTest.end <= otherMatch.end);
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
