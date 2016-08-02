(function() {
  "use strict";

  var assert = require("../shared/assert.js");
  var search = require("./search.js");
  var SearchData = require("./search_data");
  var _ = require("../shared/lodash.js");

  describe("Search", function() {
    it("gets beginning matches for 'jou'", function() {
      var matches = [{value: "Journal",
                      matches: [{start: 0, end: 3}]},
                     {value: "Journal Batch",
                      matches: [{start: 0, end: 3}]},
                     {value: "Journal Details",
                      matches: [{start: 0, end: 3}]}];

      var beginningMatches = search.getBeginningMatches(SearchData, "jou");
      assert.isTrue(_.isEqual(matches, firstN(beginningMatches, 3)));
    });
  });

  function firstN(arr, n) {
    return arr.slice(0, n);
  }

}());
