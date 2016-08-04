(function() {
  "use strict";

  var assert = require("../shared/assert.js");
  var search = require("./search.js");
  var SearchData = require("./search_data");
  var _ = require("../shared/lodash.js");

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
  });

  function isEqual(first, second) {
    assert.isTrue(_.isEqual(first, second));
  }

  function matchIn(arr, item) {
    assert.isTrue(_.some(arr, item));
  }

}());
