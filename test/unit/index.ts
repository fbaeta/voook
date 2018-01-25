import "es6-promise/auto";
import Vue from "vue";

Vue.config.productionTip = false;

declare const require: any;

// require all test files (files that ends with .spec.js)
const testsContext = require.context("../../src", true, /^\.\/.*\.spec\.ts$/);
testsContext.keys().forEach(testsContext);

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
const srcContext = require.context("../../src", true,  /^\.\/(components|router|store)\/.*\.ts$/);
srcContext.keys().forEach(srcContext);
