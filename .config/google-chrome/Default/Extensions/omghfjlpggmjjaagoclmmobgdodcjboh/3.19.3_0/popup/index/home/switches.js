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

  var translations = _.transform({ 'otherWebsites': 'other_websites' }, function (carry, value, key) {
    carry[key] = internationalize(value);
  }, {});

  Polymer({
    'is': 'index-home-switches',
    'properties': {
      'proxyEnabled': {
        'type': Boolean,
        'notify': true
      },
      'proxyCountry': {
        'type': String,
        'notify': true
      },
      'translations': {
        'type': Object,
        'value': translations,
        'readOnly': true
      },
      'view': {
        'type': Object,
        'notify': true
      }
    },

    // Computed properties
    'flagUrl': function flagUrl(flag) {
      return flag ? '/images/flags/' + flag + '.png' : '/images/empty.png';
    },

    // Methods
    proxySwitch: function proxySwitch() {
      this.fire('proxyswitch');
    },
    domainProxySwitch: function domainProxySwitch() {
      this.fire('domainproxyswitch');
    },
    countryChange: function countryChange() {
      this.fire('countrychange');
    },
    domainCountryChange: function domainCountryChange() {
      this.fire('domaincountrychange');
    }
  });
})();

},{}]},{},[1]);
