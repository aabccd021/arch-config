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
    'browsecPremium': 'browsec_premium',
    'moneyBackGuarantee': '7_days_money_back_guarantee',
    'oneSmartSettingDescription1': 'one_smart_setting_description_1',
    'oneSmartSettingDescription2': 'one_smart_setting_description_2',
    'oneSmartSettingDescriptionList1': 'one_smart_setting_description_list_1',
    'oneSmartSettingDescriptionList2': 'one_smart_setting_description_list_2',
    'upgradeToPremium': 'upgrade_to_premium',
    'youCanHaveOnlyOneSmartSetting': 'you_can_have_only_1_smart_setting'
  }, function (carry, value, key) {
    carry[key] = internationalize(value);
  }, {});
  translations.onlyPricePerMonth = internationalize('only_X_per_month').replace(/XXX/, price);

  Polymer({
    'is': 'popup-premium-onerule',
    'behaviors': [PolymerRedux(Polymer)],
    'properties': {
      'premiumLink': {
        'type': String,
        'value': browsecLink(premiumLink, function (search) {
          return _.assign(search, {
            'utm_source': 'Chromium extension',
            'utm_medium': 'premium_div',
            'utm_campaign': 'premium_div_smartlocations',
            'utm_term': 'Upgrade to Premium. Only $3.33 per month'
          });
        })
      },
      'translations': {
        'type': Object,
        'value': translations,
        'readOnly': true
      }
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
