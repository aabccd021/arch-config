(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

{
  /** @type {Object} */
  var _browser = typeof browser !== 'undefined' ? browser : chrome;

  /** @type {(Object|null)} */
  var backgroundPage = _browser.extension.getBackgroundPage();

  var polymerSettings = {
    'is': 'main-head',

    // Methods
    back: function back() {
      this.dispatch({ 'type': 'Page change', 'page': 'index:home' });
    },
    login: function login() {
      this.dispatch({ 'type': 'Page change', 'page': 'login' });
    }
  };

  if (!backgroundPage) {
    // Private mode Firefox
    polymerSettings.properties = {
      'user': {
        'type': Object,
        'value': { 'guest': true, 'premium': false }
      },
      'indexPage': {
        'type': Boolean,
        'value': true
      },
      'translations': {
        'type': Object,
        'value': {}
      }
    };

    polymerSettings.logout = function () {}; // Empty function
  } else {
    // Normal cases
    var _ = backgroundPage._,
        actions = backgroundPage.actions,
        PolymerRedux = backgroundPage.PolymerRedux,
        internationalize = backgroundPage['tools'].internationalize;

    /** @type {Object<String>} */

    var translations = _.transform({
      'goBack': 'go_back',
      'signIn': 'sign_in',
      'signOut': 'sign_out'
    }, function (carry, value, key) {
      carry[key] = internationalize(value);
    }, {});

    polymerSettings.behaviors = [PolymerRedux(Polymer)];
    polymerSettings.properties = {
      'user': {
        'type': Object,
        'statePath': function statePath(_ref) {
          var user = _ref.user;
          return user;
        }
      },
      'indexPage': {
        'type': Boolean,
        'statePath': function statePath(_ref2) {
          var page = _ref2.page;
          return page.split(':')[0] === 'index';
        }
      },
      'translations': {
        'type': Object,
        'value': translations,
        'readOnly': true
      }
    };

    polymerSettings.logout = function () {
      actions.logout();
    };
  }

  Polymer(polymerSettings);
}

},{}]},{},[1]);
