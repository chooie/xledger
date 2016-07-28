// Copyright (c) 2012-2014 Titanium I.T. LLC. All rights reserved. See
// LICENSE.txt for details.
(function () {
  "use strict";

  var fs = require("fs");
  var assert = require("../shared/assert.js");
  var server = require("./server.js");
  var httpUtil = require("../__http_util.js");
  var paths = require("../../build/config/paths.js");

  var TEST_FILE = paths.testDir + "/file.txt";
  var TEST_DATA = "Hello Test";

  describe("Server", function() {

    beforeEach(function(done) {
      fs.writeFile(TEST_FILE, TEST_DATA, function(err) {
	server.start(5000, paths.testDir, function() {
	  done(err);
	});
      });
    });

    afterEach(function(done) {
      server.stop(function() {
	fs.unlink(TEST_FILE, function(err) {
	  done(err);
	});
      });
    });

    it("responds to requests", function(done) {
      httpUtil.getPage("http://localhost:5000/file.txt", testGotCorrectPage);

      function testGotCorrectPage(error, response, responseText) {
        assert.equal(response.statusCode, 200);
        assert.equal(responseText, TEST_DATA);
        done(error);
      }
    });

  });

}());
