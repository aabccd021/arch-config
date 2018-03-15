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
    'okIGotIt': 'ok_i_got_it',
    'smartSettingsControl': 'smart_settings_allow_you_to_control',
    'smartSettingsFeatures1': 'smart_settings_features_1',
    'smartSettingsFeatures2': 'smart_settings_features_2',
    'smartSettingsFeatures3': 'smart_settings_features_3',
    'withSmartSettingsYouCan': 'with_smart_settings_you_can'
  }, function (carry, value, key) {
    carry[key] = internationalize(value);
  }, {});

  Polymer({
    'is': 'popup-help',
    'properties': {
      'translations': {
        'type': Object,
        'value': translations,
        'readOnly': true
      }
    },

    // Methods
    close: function close() {
      window.Velocity(this, 'fadeOut', 400);
      // this.remove();
    }
  });
})();

},{}]},{},[1]);
