// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE.txt
// for details.

// A cross-platform mechanism for determining how to run the build

(function() {
  "use strict";

  var UNIX_BUILD_COMMAND = "./jake.sh";
  var WINDOWS_BUILD_COMMAND = "jake.bat";

  var os = require("os");

  exports.get = function() {
    if (os.platform() === "win32") {
      return WINDOWS_BUILD_COMMAND;
    }
    return UNIX_BUILD_COMMAND;
  };

}());
