(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _browser = typeof browser !== 'undefined' ? browser : chrome;

var _browser$extension$ge = _browser.extension.getBackgroundPage(),
    _ = _browser$extension$ge._,
    internationalize = _browser$extension$ge['tools'].internationalize;

document.title = internationalize('you_just_installed_browsec');

// Polymer redux problems resolve
window.addEventListener('unload', function () {
  var nodes = _.toArray(document.body.childNodes);
  nodes.forEach(function (node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.tagName.toLowerCase() === 'script') return;

    document.body.removeChild(node);
  });
});

},{}]},{},[1]);
