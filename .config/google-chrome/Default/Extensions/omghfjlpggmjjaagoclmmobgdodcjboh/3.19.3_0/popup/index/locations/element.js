(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

(function () {
  /** @type {Object} */
  var _browser = typeof browser !== 'undefined' ? browser : chrome;

  /** @type {(Object|null)} */
  var backgroundPage = _browser.extension.getBackgroundPage();
  if (!backgroundPage) return;

  var _ = backgroundPage._,
      PolymerRedux = backgroundPage.PolymerRedux;


  Polymer({
    'is': 'index-locations-element',
    'behaviors': [PolymerRedux(Polymer)],
    'properties': {
      'button': {
        'type': String,
        'computed': 'computeButton(mode)'
      },
      'country': {
        'type': String,
        'value': '',
        'notify': true
      },
      'data': {
        'type': Object,
        'value': {},
        'notify': true
      },
      'mode': { // Key property
        'type': String,
        'value': '',
        'notify': true,
        'observer': 'observeMode'
      },
      'premium': {
        'type': Boolean,
        'value': false,
        'notify': true
      },
      'premiumUser': {
        'type': Boolean,
        'value': false,
        'notify': true
      }
    },
    'observers': ['observeForMode(premiumUser, country, data, premium)'],

    // Lifecycle
    ready: function ready() {
      //this.mode = this.observeForMode( this.premiumUser, this.country );
    },


    // Computed properties
    'computeButton': function computeButton(mode) {
      return _.upperFirst(mode);
    },

    'flagUrl': function flagUrl(flag) {
      return flag ? '/images/flags/' + flag + '.png' : '/images/empty.png';
    },

    // Observers
    observeForMode: function observeForMode(premiumUser, country, data, premium) {
      this.mode = function () {
        if (premium && !premiumUser) return 'premium';
        if (data.code === country) return 'current';
        return 'change';
      }();
    },
    observeMode: function observeMode(mode) {
      this.toggleClass('current', mode === 'current');
      this.toggleClass('premium', mode === 'premium');
    },


    // Methods
    onClick: function onClick() {
      if (this.mode === 'current') return;

      this.fire('countryclick', { 'mode': this.mode, 'country': this.data.code });
    }
  });
})();

},{}]},{},[1]);
