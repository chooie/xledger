// Copyright (c) 2012-2015 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

// Helper functions for running processes.

(function() {
  "use strict";

  var jake = require("jake");

  module.exports = {
    runMany: runMany,
    run: run
  };

  function runMany(commands, successCallback, failureCallback) {
    var stdout = [];
    function serializedSh(command) {
      if (command) {
        run(command, function(oneStdout) {
          stdout.push(oneStdout);
          serializedSh(commands.shift());
        }, failureCallback);
      }
      else {
        successCallback(stdout);
      }
    }
    serializedSh(commands.shift());
  }

  function run(oneCommand, successCallback, failureCallback) {
    var stdout = "";
    var child = jake.createExec(oneCommand);
    child.on("stdout", function(data) {
      process.stdout.write(data);
      stdout += data;
    });
    child.on("stderr", function(data) {
      process.stderr.write(data);
    });
    child.on("cmdEnd", function() {
      successCallback(stdout);
    });
    child.on("error", function() {
      failureCallback(stdout);
    });

    console.log("> " + oneCommand);
    child.run();
  }

}());
