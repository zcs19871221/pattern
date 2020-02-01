"use strict";

require("core-js/modules/es.array.slice");

require("core-js/modules/es.string.starts-with");

require("core-js/modules/es.string.trim");

const getCmdArgs = () => {
  const result = process.argv.slice(2).reduce((acc, myArg) => {
    const arg = myArg.trim();

    if (arg && arg !== '--') {
      if (arg.startsWith('--')) {
        acc.options.push(arg);
      } else {
        acc.src.push(arg);
      }
    }

    return acc;
  }, {
    options: [],
    src: []
  });

  if (result.options.length === 0) {
    delete result.options;
  }

  if (result.src.length === 0) {
    delete result.src;
  }

  return result;
};

module.exports = getCmdArgs;