(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

(function () {
  /** @type {Object} */
  var _browser = typeof browser !== 'undefined' ? browser : chrome;

  /** @type {(Object|null)} */
  var backgroundPage = _browser.extension.getBackgroundPage();
  if (!backgroundPage) return;

  var _ = backgroundPage._,
      internationalize = backgroundPage['tools'].internationalize;

  /** @type {Object<String>} */

  var translations = _.transform({
    'browsecOff': 'browsec_off',
    'off': 'off'
  }, function (carry, value, key) {
    carry[key] = internationalize(value);
  }, {});

  Polymer({
    'is': 'filters-country-list',
    'properties': {
      'countries': {
        'type': Array,
        'value': []
      },
      'translations': {
        'type': Object,
        'value': translations,
        'readOnly': true
      }
    },

    // Computed properties
    'flagUrl': function flagUrl(flag) {
      return flag ? '/images/flags/' + flag + '.png' : '/images/empty.png';
    },

    // Methods
    elementClick: function elementClick(_ref) {
      var model = _ref.model;

      var country = model.get('item.code');

      this.fire('select', country);

      this.remove();
    },
    offClick: function offClick() {
      this.fire('disable');

      this.remove();
    }
  });
})();

},{}]},{},[1]);
