(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
      log = backgroundPage.log,
      PolymerRedux = backgroundPage.PolymerRedux,
      proxy = backgroundPage.proxy,
      internationalize = backgroundPage['tools'].internationalize;

  /** @type {object<string>} */

  var translations = _.transform({
    'changeLocation': 'change_virtual_location',
    'chooseYourVirtualLocation': 'choose_your_virtual_location',
    'freeServers': 'free_servers',
    'premiumServers': 'premium_servers'
  }, function (carry, value, key) {
    carry[key] = internationalize(value);
  }, {});

  /** Get full country name by 2 letter code
  @param {String} code - 2 letter code
  @return {String} */
  var countryNameByCode = function countryNameByCode(code) {
    var countryName = internationalize('country_name_' + code.toUpperCase());
    if (countryName) return countryName;

    /** @type {String} */
    var locale = Browser.i18n.getUILanguage();

    /** @type {String} */
    var version = _.get(Browser.runtime.getManifest(), 'version', 'n/a');

    var message = 'failed to look up country name for: ' + code + ' with locale: ' + locale + ' at popup.js';
    log.warn(message);
    ga('error', version, message, 0, false);
    return code.toUpperCase() || 'N/A';
  };

  Polymer({
    'is': 'index-locations',
    'behaviors': [PolymerRedux(Polymer)],
    'properties': {
      'countries': {
        'type': Object
      },
      'premiumUser': {
        'type': Boolean,
        'statePath': function statePath(_ref) {
          var premium = _ref['user'].premium;
          return premium;
        }
      },
      'proxyCountry': {
        'type': String,
        'value': '',
        'statePath': function statePath(_ref2) {
          var _ref2$pac = _ref2['pac'],
              mode = _ref2$pac.mode,
              country = _ref2$pac.country;
          return mode === 'proxy' ? country : '';
        }
      },
      'proxyList': {
        'type': Array,
        'value': [],
        'statePath': function statePath(_ref3) {
          var pac = _ref3.pac;
          return pac.filters.filter(function (_ref4) {
            var disabled = _ref4.disabled,
                proxyMode = _ref4.proxyMode;
            return !disabled && proxyMode;
          });
        }
      },
      'servers': {
        'type': Object,
        'value': {},
        'statePath': function statePath(_ref5) {
          var servers = _ref5.servers;
          return servers;
        },
        'observer': 'observeServers'
      },
      'translations': {
        'type': Object,
        'value': translations,
        'readOnly': true
      },

      /** In case of global locations -> pac.country,
      otherwise selected country in case of proxy filter */
      'country': {
        'type': String,
        'value': null
      },

      /** Used for setup of country for filter */
      'domain': {
        'type': String,
        'value': ''
      }
    },

    'observers': ['observeForCountry(domain, proxyCountry, proxyList)'],

    // Lifecycle
    attached: function attached() {
      /** @type {PolymerNode} */
      var root = Polymer.dom(this.root);

      /** @type {number} */
      var height = root.querySelector('div.Head').offsetHeight;

      root.querySelector('div.Sections').setAttribute('style', 'top:' + height + 'px;');

      if (!this.domain) Counters.increase('popup: location page shows');
    },


    // Observers
    observeForCountry: function observeForCountry(domain, proxyCountry, proxyList) {
      // Global settings
      if (!domain) {
        this.country = proxyCountry;return;
      }

      // Domain only
      this.country = _.get(_.find(proxyList, function (item) {
        return item.domain === domain;
      }), 'country') || '';
    },
    observeServers: function observeServers(servers) {
      /** @type {array<array>} */
      var countries = _.transform(
      /** @type {object<object>} */
      servers,

      /**
      @param {object} country
      @param {*} country.hidden
      @param {array} [country.servers]
      @param {array} [country.premium_servers] */
      function (carry, country, code) {
        if (country.hidden) return;

        var servers = {
          'free': country.servers,
          'premium': country.premium_servers
        };

        var name = countryNameByCode(code);
        // Free servers
        if (Array.isArray(servers.free) && servers.free.length > 0) {
          carry[0].push({
            'id': code,
            code: code,
            name: name,
            'premium': false
          });
        }

        // Premium servers
        if (Array.isArray(servers.premium) && servers.premium.length > 0) {
          carry[1].push({
            'id': code + '_premium',
            code: code,
            'name': name + ' (Premium)',
            'premium': true
          });
        }
      }, [[], []]).map(
      /**
      @param {array<object>} data */
      function (data) {
        return data.sort(function (_ref6, _ref7) {
          var a = _ref6['name'];
          var b = _ref7['name'];

          // Premium state does not matter, only by name
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        });
      });

      this.countries = function (_ref8) {
        var _ref9 = _slicedToArray(_ref8, 2),
            free = _ref9[0],
            premium = _ref9[1];

        return { free: free, premium: premium };
      }(countries);
    },


    // Methods
    countryClick: function countryClick(_ref10) {
      var _this = this;

      var _ref10$detail = _ref10['detail'],
          mode = _ref10$detail.mode,
          country = _ref10$detail.country;

      if (mode === 'change') {
        if (this.domain) {
          proxy.siteFilters.changeCountry({ 'domain': this.domain, country: country }).then(function () {
            setTimeout(function () {
              _this.dispatch({ 'type': 'Page change', 'page': 'index:home' });
            }, 500);
          });
        } else {
          proxy.setCountry(country).then(function () {
            ga('extension', 'change_country', country);
            setTimeout(function () {
              _this.dispatch({ 'type': 'Page change', 'page': 'index:home' });
            }, 500);
          });
        }
      } else if (mode === 'premium') {
        var popupPremium = document.createElement('popup-premium');
        popupPremium.country = country;
        popupPremium.setAttribute('style', 'top:-100%;');
        document.body.append(popupPremium);

        ga('premium', 'show');

        window.Velocity(popupPremium, { 'top': 0 }, 800).then(function () {
          popupPremium.removeAttribute('style');
        });
      }
    }
  });
})();

},{}]},{},[1]);
