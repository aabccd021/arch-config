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

  var translations = _.transform({ 'pleaseEnterDomain': 'please_enter_domain' }, function (carry, value, key) {
    carry[key] = internationalize(value);
  }, {});

  Polymer({
    'is': 'filters-domain',
    'properties': {
      'translations': {
        'type': Object,
        'value': translations,
        'readOnly': true
      },
      'value': {
        'type': String,
        'value': '',
        'notify': true,
        'observer': 'observeValue'
      }
    },

    // Lifecycle
    ready: function ready() {
      var _this = this;

      this.input = Polymer.dom(this.root).querySelector('input[type="text"]');
      this.inputValue = '';

      this.input.addEventListener('input', function (_ref) {
        var value = _ref['target'].value;

        value = value.replace(/\s+/g, '').toLowerCase();

        // Save caret position
        var end = _this.input.selectionEnd;
        _this.input.value = value;

        var newEnd = end > value.length ? value.length : end;
        _this.input.setSelectionRange(newEnd, newEnd); // Restore caret position

        _this.inputValue = value;
        _this.value = value;
      });

      this.input.addEventListener('paste', function (event) {
        event.stopPropagation(); // Stop data actually being pasted into div
        event.preventDefault();

        /** Get pasted url via clipboard API
        @type {String} */
        var url = (event.clipboardData || window.clipboardData).getData('text/plain').trim();
        if (!url) return;

        try {
          _this.value = new URL(url).hostname;
        } catch (e) {
          _this.value = url;
        }

        // TODO if not URL -> standard paste algorithm
      });

      this.input.addEventListener('keypress', function (event) {
        var code = event.code,
            which = event.which;

        if (code !== 'Enter' && which !== 13) return;
        event.preventDefault();

        _this.fire('save');
        _this.input.blur();
      });
    },


    // Observers
    observeValue: function observeValue(newValue, oldValue) {
      if (newValue === oldValue) return;
      if (newValue === this.inputValue) return; // Protect from internal changes

      if (!this.input) return;

      this.inputValue = newValue;
      this.input.value = newValue;
    }
  });
})();

},{}]},{},[1]);
