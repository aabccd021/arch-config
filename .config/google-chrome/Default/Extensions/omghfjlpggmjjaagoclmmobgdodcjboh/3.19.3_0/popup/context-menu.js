(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

(function () {
  /** @type {Object} */
  var _browser = typeof browser !== 'undefined' ? browser : chrome;

  /** @type {(Object|null)} */
  var backgroundPage = _browser.extension.getBackgroundPage();
  if (!backgroundPage) return;

  var _ = backgroundPage._,
      Browser = backgroundPage.Browser,
      Counters = backgroundPage.Counters,
      ga = backgroundPage.ga,
      siteFilters = backgroundPage['proxy'].siteFilters,
      PolymerRedux = backgroundPage.PolymerRedux,
      punycode = backgroundPage.punycode,
      internationalize = backgroundPage['tools'].internationalize;

  /** @type {Object<String>} */

  var translations = _.transform({
    'help': 'help',
    'addSettingFor': 'add_smart_setting_for_X',
    'deleteSettingFor': 'delete_smart_setting_for_X',
    'editSmartSettings': 'edit_smart_settings'
  }, function (carry, value, key) {
    carry[key] = internationalize(value);
  }, {});

  Polymer({
    'is': 'context-menu',
    'behaviors': [PolymerRedux(Polymer)],
    'properties': {
      'containsFilter': {
        'type': Boolean,
        'value': null
      },
      'domain': {
        'type': String,
        'value': '',
        'notify': true
      },
      'showEditSmartSettings': {
        'type': Boolean,
        'statePath': function statePath(_ref) {
          var page = _ref.page;

          var parts = page.split(':');
          return parts[0] !== 'index' || parts[1] !== 'filters';
        }
      },
      'translations': {
        'type': Object,
        'value': translations,
        'readOnly': true
      }
    },

    'conditionState': function conditionState(domain, containsFilter, value) {
      return !domain ? false : containsFilter === Boolean(value);
    },

    // Computed properties
    'domainTextTranslation': function domainTextTranslation(property, domain) {
      domain = punycode.toUnicode(domain);
      return translations[property].replace(/XXX/g, domain);
    },

    /// Methods
    addFilter: function addFilter() {
      var _getState = this.getState(),
          filters = _getState['pac'].filters,
          premiumUser = _getState['user']['premium'];

      if (premiumUser || !filters.length) {
        // Moving to filters page with specific domain
        this.dispatch({
          'type': 'Page change', 'page': 'index:filters:' + this.domain
        });
      } else this.showPremiumPopup();

      this.remove();
    },
    removeFilter: function removeFilter() {
      siteFilters.remove(this.domain);
      this.remove();
    },
    editSettings: function editSettings() {
      Counters.increase('popup: smart settings: open list');

      this.dispatch({ 'type': 'Page change', 'page': 'index:filters' });
      this.remove();
    },
    openHelp: function openHelp() {
      Counters.increase('popup: smart settings: open help');

      Browser.tabs.create('/pages/help/help.html');

      this.remove();
    },
    showPremiumPopup: function showPremiumPopup() {
      var popupPremium = document.createElement('popup-premium-onerule');
      popupPremium.setAttribute('style', 'top:-100%;');
      document.body.append(popupPremium);

      ga('premium', 'show');

      window.Velocity(popupPremium, { 'top': 0 }, 800).then(function () {
        popupPremium.removeAttribute('style');
      });
    }
  });
})();

},{}]},{},[1]);
