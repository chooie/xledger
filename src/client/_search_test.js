(function() {
  "use strict";

  var assert = require("../shared/assert.js");
  var search = require("./search.js");

  describe("Search", function() {
    it("has an API", function() {
      assert.equal("Hello", search.hello());
    });
  });

}());
