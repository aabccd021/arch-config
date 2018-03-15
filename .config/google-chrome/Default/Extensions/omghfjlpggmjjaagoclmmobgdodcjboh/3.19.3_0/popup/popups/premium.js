(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

(function () {
  /** @type {Object} */
  var _browser = typeof browser !== 'undefined' ? browser : chrome;

  /** @type {(Object|null)} */
  var backgroundPage = _browser.extension.getBackgroundPage();
  if (!backgroundPage) return;

  var _ = backgroundPage._,
      browsecLink = backgroundPage.browsecLink,
      ga = backgroundPage.ga,
      PolymerRedux = backgroundPage.PolymerRedux,
      premiumLink = backgroundPage['routes']['premium'],
      internationalize = backgroundPage['tools'].internationalize;

  /** @type {String} */

  var price = '3.33';

  /** @type {Object<String>} */
  var translations = _.transform({
    'accessInternet': 'access_internet_via_premium_locations',
    'browsecPremium': 'browsec_premium',
    'dedicatedLanes': 'dedicated_traffic_lanes',
    'getPremiumNow': 'get_premium_now',
    'moneyBackGuarantee': '7_days_money_back_guarantee',
    'premiumLocations': 'premium_locations',
    'premiumServers': 'premium_servers',
    'performanceGuaranteed': 'top_performance_guaranteed',
    'turboSpeed': 'turbo_speed'
  }, function (carry, value, key) {
    carry[key] = internationalize(value);
  }, {});
  translations.onlyPricePerMonth = internationalize('only_X_per_month').replace(/XXX/g, price);

  Polymer({
    'is': 'popup-premium',
    'behaviors': [PolymerRedux(Polymer)],
    'properties': {
      'country': {
        'type': String,
        'value': ''
      },
      'premiumLink': {
        'type': String,
        'computed': 'computePremiumLink(country, withPrice)'
      },
      'translations': {
        'type': Object,
        'value': translations,
        'readOnly': true
      },
      'withPrice': {
        'type': Boolean,
        'value': false,
        'observer': 'observeWithPrice'
      }
    },

    // Lifecycle
    ready: function ready() {
      if (Math.floor(Math.random() * 2) === 1) this.withPrice = true;
    },


    // Computed properties
    'computePremiumLink': function computePremiumLink(country, withPrice) {
      return browsecLink(premiumLink, function (search) {
        return _.assign(search, {
          'utm_source': 'Chromium extension',
          'utm_medium': 'premium_div',
          'utm_campaign': 'premium_div-' + country,
          'utm_term': withPrice ? 'Get Premium now! only $3.33 per month' : 'Get Premium now!'
        });
      });
    },
    observeWithPrice: function observeWithPrice(withPrice) {
      Polymer.dom(this).classList[withPrice ? 'add' : 'remove']('withPrice');
    },


    // Methods
    linkClick: function linkClick() {
      ga('premium', 'click');

      // FF only
      if (typeof browser === 'undefined') return;
      setTimeout(function () {
        window.close();
      }, 50);
    },
    close: function close() {
      var _this = this;

      window.Velocity(this, { 'top': '-100%' }, 800).then(function () {
        _this.remove();
      });
    }
  });
})();

},{}]},{},[1]);
