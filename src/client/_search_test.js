(function() {
  "use strict";

  var assert = require("../shared/assert.js");
  var search = require("./search.js");
  var SearchData = require("./search_data");
  var _ = require("../shared/lodash.js");

  describe("Search", function() {
    it("gets exact matches for 'jou'", function() {
      var exactMatches = search.getExactMatches(SearchData, "jou");
      assert.isTrue(_.isEqual([], exactMatches));
    });

    it("gets exact matches for 'Journal'", function() {
      var exactMatches = search.getExactMatches(SearchData, "journal");
      var singleMatch = {value: "Journal", matches: [{start: 0, end: 7}]};
      assert.isTrue(_.isEqual([singleMatch], exactMatches));
    });
    
    it("gets beginning matches for 'jou'", function() {
      var matches = [{value: "Journal",
                      matches: [{start: 0, end: 3}]},
                     {value: "Journal Batch",
                      matches: [{start: 0, end: 3}]},
                     {value: "Journal Details",
                      matches: [{start: 0, end: 3}]}];

      var beginningMatches = search.getBeginningMatches(SearchData, "jou");
      assert.isTrue(_.isEqual(matches, _.take(beginningMatches, 3)));
    });

    it("gets ending matches for 'nal'", function() {
      var matches = [{value: "CR Test 2 Invoice Journal",
                      matches: [{start: 22, end: 25}]},
                     {value: "Journal",
                      matches: [{start: 4, end: 7}]}];
      var endingMatches = search.getEndingMatches(SearchData, "nal");
      assert.isTrue(_.isEqual(matches, endingMatches));
    });
  });

}());
