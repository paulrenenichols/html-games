/*
 *
 *  vendor.js
 *
 *  This file exists to create a browserify bundle for all
 *  third party scripts.  The required scripts in here will 
 *  be referenced (externally) by other bundles.
 *
 */
var $ = require("jquery");
var Q = require("q");
var _ = require("lodash");