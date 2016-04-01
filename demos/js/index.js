(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $ = require('jquery');
var _ = require('lodash');
var Q = require('q');

console.log(window.location.href);
console.log(window.location.host);
console.log(window.location.origin);

$.ajax({
  url: window.location.origin + "/api/"
})
.done(function(data) {
  console.log(data);
});

$.ajax({
  url: window.location.origin + "/api/hello",
  data: {
    name: "bob"
  }
})
.done(function(data) {
  console.log(data.hello);
});
},{"jquery":"jquery","lodash":"lodash","q":"q"}]},{},[1])


//# sourceMappingURL=index.js.map