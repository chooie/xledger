(function() {
  "use strict";

  var assert = require("../shared/assert");
  var search = require("./search.js");
  var SearchData = require("./search_data");
  var _ = require("../shared/lodash");

  describe("Search", function() {
    it("gets exact matches for 'jou'", function() {
      var exactMatches = search.getExactMatches(SearchData, "jou");
      isEqual([], exactMatches);
    });

    it("gets exact matches for 'Journal'", function() {
      var exactMatches = search.getExactMatches(SearchData, "journal");
      var singleMatch = {value: "Journal", matches: [{start: 0, end: 7}]};
      isEqual([singleMatch], exactMatches);
    });
    
    it("gets beginning matches for 'jou'", function() {
      var matches = [{value: "Journal",
                      matches: [{start: 0, end: 3}]},
                     {value: "Journal Batch",
                      matches: [{start: 0, end: 3}]},
                     {value: "Journal Details",
                      matches: [{start: 0, end: 3}]}];

      var beginningMatches = search.getBeginningMatches(SearchData, "jou");
      isEqual(matches, _.take(beginningMatches, 3));
    });

    it("gets ending matches for 'nal'", function() {
      var matches = [{value: "CR Test 2 Invoice Journal",
                      matches: [{start: 22, end: 25}]},
                     {value: "Journal",
                      matches: [{start: 4, end: 7}]}];
      var endingMatches = search.getEndingMatches(SearchData, "nal");
      isEqual(matches, endingMatches);
    });

    it("gets partial beginning of words matches for 'jo en'", function() {
      var firstMatch = {value: "Journal Entry",
                        matches: [{start: 0, end: 2}, {start: 8, end: 10}]},
          results = search.getPartialBeginningOfWordsMatches(SearchData,
                                                             "jo en");
      isEqual(firstMatch, _.head(results));
    });

    it("gets partial beginning of words matches for 'jo'", function() {
      isEqual([], search.getPartialBeginningOfWordsMatches(SearchData, "jo"));
    });

    it("gets partial beginning of words matches for 'abs stat'", function() {
      var matches = search.getPartialBeginningOfWordsMatches(SearchData,
                                                             "abs stat");

      matchIn(matches, {value: "Absence Income Statement",
                        matches: [{start: 0, end: 3}, {start: 15, end: 19}]});
    });

    it("gets matches in the middle for 'rnal'", function() {
      var matches = search.getMiddleMatches(SearchData, "rnal");

      matchIn(matches, {value: "Journal",
                        matches: [{start: 3, end: 7}]});
    });

    it("collects matching value results", function() {
      var searchTerm = "account period hello";
      var expected = {value: "Account", matches: [{start: 0, end: 7}]};
      var matches = search.search(SearchData, searchTerm);
      var actual = search.combineDuplicateMatchesForValue(matches, "Account");
      isEqual(expected, actual);
    });

    it("consolidates duplicate matches", function() {
      var matches = [
        {value: "foo", matches: [{start: 0, end: 1}]},
        {value: "bar", matches: [{start: 0, end: 1}]},
        {value: "foo", matches: [{start: 2, end: 3}]},
        {value: "baz", matches: [{start: 0, end: 1}]}
      ];
      var desired = [
        {value: "foo", matches: [{start: 0, end: 1}, {start: 2, end: 3}]},
        {value: "bar", matches: [{start: 0, end: 1}]},
        {value: "baz", matches: [{start: 0, end: 1}]}
      ];
      var actual = search.consolidateDuplicates(matches);
      isEqual(desired, actual);
    });

    it("Ranges get handled correctly", function() {
      var matchRanges = [{start: 4, end: 11},
                         {start: 0, end: 11},
                         {start: 0, end: 3}];
      var expectedRanges = [{start: 0, end: 11}];
      var actualRanges = search.prepareMatches(matchRanges);
      isEqual(expectedRanges, actualRanges);
    });
  });

  describe("Util", function() {
    it("sorts by word length", function() {
      var before = ["a", "word", "length", "test"],
          after = ["length", "test", "word", "a"];
      isEqual(after, search.sortByWordLength(before));
    });
  });

  function isEqual(first, second) {
    assert.isTrue(_.isEqual(first, second));
  }

  function matchIn(arr, item) {
    assert.isTrue(_.some(arr, item));
  }

}());
