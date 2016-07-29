// Copyright (c) 2015 Titanium I.T. LLC. All rights reserved. For license, see
// "README" or "LICENSE" file.

// Configuration options for JSHint. Change this to match your preferences.

(function() {
  "use strict";

  var merge = require("object-merge");

  var universalOptions = {
    // No bitwise ops
    bitwise: true,
    // Always use curly braces around blocks
    curly: true,
    // Only permit triple equals
    eqeqeq: true,
    // Always filter inherited properties out in `for in` loops
    forin: true,
    // Prevent overwriting prototypes of native objects
    freeze: true,
    // Enables warnings about identifiers defined in future version of
    // JavaScript
    futurehostile: true,
    // Warn __iterator__ property
    iterator: true,
    // Warn about using variables that were declared inside of control
    // structures outside of associated control structures
    funcscope: true,
    // Prohibit use of variable before it's defined. Allow funcs though
    latedef: 'nofunc',
    // Prevent use of arguments.caller and arguments.callee
    noarg: true,
    // Prohibit use of comma operator
    nocomma: true,
    // Warn about "non-breaking whitespace" characters
    nonbsp: true,
    // Prohibits use of constructor functions for side-effects
    nonew: true,
    // Warn when use typeof operator with invalid value
    notypeof: true,
    // Must use strict mode
    strict: true,
    // Prohibit use of explicitly undeclared variables
    undef: true,
    // Warn when you define but never use variables
    unused: true,

    // Debugging
    devel: true
  };

  exports.nodeOptions = merge(universalOptions, {
    node: true
  });

  exports.clientOptions = merge(universalOptions, {
    browser: true
  });

  var universalGlobals = {
    // Mocha
    before: false,
    after: false,
    beforeEach: false,
    afterEach: false,
    describe: false,
    it: false
  };

  exports.nodeGlobals = merge(universalGlobals, {
    // Jake
    jake: false,
    desc: false,
    task: false,
    directory: false,
    complete: false,
    fail: false
  });

  exports.clientGlobals = merge(universalGlobals, {
    // CommonJS
    exports: false,
    require: false,
    module: false
  });

}());
