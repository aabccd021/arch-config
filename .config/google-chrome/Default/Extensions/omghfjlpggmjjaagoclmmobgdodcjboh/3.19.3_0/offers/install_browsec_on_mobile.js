(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _Browser = typeof browser !== 'undefined' ? browser : chrome;

var _Browser$extension$ge = _Browser.extension.getBackgroundPage(),
    _ = _Browser$extension$ge._,
    ga = _Browser$extension$ge.ga;

// On page open:


ga('mobile_promo', 'show');

/** @type {array<Node>} */
var nodes = _.toArray(document.querySelectorAll('[data-role="link"]'));
nodes.forEach(function (node) {
  var label = node.getAttribute('data-label');

  node.addEventListener('click', function () {
    ga('mobile_promo', 'click', label);
  });
});

},{}]},{},[1]);
