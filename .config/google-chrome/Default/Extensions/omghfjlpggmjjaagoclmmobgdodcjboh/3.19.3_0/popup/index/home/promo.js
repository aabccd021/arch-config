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
      config = backgroundPage.config,
      ga = backgroundPage.ga,
      PolymerRedux = backgroundPage.PolymerRedux,
      promotions = backgroundPage.promotions,
      routes = backgroundPage.routes,
      storage = backgroundPage.storage,
      _backgroundPage$tools = backgroundPage['tools'],
      createElement = _backgroundPage$tools.createElement,
      internationalize = _backgroundPage$tools.internationalize,
      weightedRandom = _backgroundPage$tools.weightedRandom;

  /** @type {String} */

  var price = '3.33';

  /** @type {Object<String>} */
  var translations = _.transform({
    'continueUsing': 'continue_using_premium',
    'getFreePremium': 'get_free_premium',
    'getTurboSpeed': 'get_turbo_speed',
    'goAheadAndRenewIt': 'go_ahead_and_renew_it',
    'moneyBackGuarantee': '7_days_money_back_guarantee',
    'premiumIsAboutToExpire': 'your_premium_is_about_to_expire',
    'turboSpeedInFree': 'turbo_speed_in_free_premium',
    'upgradeConnectionSpeed': 'upgrade_connection_speed'
  }, function (carry, value, key) {
    carry[key] = internationalize(value);
  }, {});
  translations.fromOnlyPricePerMonth = internationalize('from_only_X_per_month').replace(/XXX/g, price);

  Polymer({
    'is': 'index-home-promo',
    'behaviors': [PolymerRedux(Polymer)],
    'properties': {
      'expirationPremiumLink': {
        'type': String,
        'statePath': function statePath(_ref) {
          var days = _ref['daysAfterInstall'];
          return browsecLink(routes.main_url + 'en/orders/new?plan_id=annual', function (search) {
            return _.assign(search, {
              'utm_source': 'Chromium extension'
            });
          });
        }
      },
      'premiumLink': {
        'type': String,
        'statePath': function statePath(_ref2) {
          var days = _ref2['daysAfterInstall'];
          return browsecLink(routes.premium, function (search) {
            return _.assign(search, {
              'utm_source': 'Chromium extension',
              'utm_medium': 'banner',
              'utm_campaign': 'banner-' + 'banner_speed_new'
            });
          });
        }
      },
      'translations': {
        'type': Object,
        'value': translations,
        'readOnly': true
      },
      'user': {
        'type': Object,
        'statePath': function statePath(_ref3) {
          var user = _ref3.user;

          user = _.cloneDeep(user);
          delete user.validUntil;
          delete user.version;

          return user;
        },
        'observer': 'setActivePromo'
      },
      'activePromo': {
        'type': Number,
        'value': null,
        'notify': true
      },
      'visible': {
        'type': Boolean,
        'value': null,
        'notify': true,
        'observer': 'observeVisible'
      }
    },

    // Lifecycle
    ready: function ready() {
      /** @type {PolymerNode} */
      var root = Polymer.dom(this.root);

      // Deleting all text nodes and getting all data from other nodes
      /** @type {array<Node>} */
      var nodes = _.toArray(root.childNodes); // NOTE _.toArray is critical

      /** @type {Array<Objects>} */
      this.elements = _.transform(nodes, function (carry, node) {
        if (node.nodeType !== Node.ELEMENT_NODE) {
          root.removeChild(node);return;
        }

        carry.push({
          'node': Polymer.dom(node).querySelector('a'),
          'weight': Number(node.dataset.weight) || 1,
          'premium': node.dataset.premium === 'true',
          'name': node.dataset.name || '',
          'gaId': node.dataset.ga
        });
      }, []);

      // Initial render
      this.setActivePromo(this.user);

      // Click on links
      this.elements.forEach(function (_ref4) {
        var node = _ref4.node,
            gaId = _ref4.gaId;

        if (!node) return;

        node.addEventListener('click', function () {
          if (gaId) {
            ga({ 'category': 'banner', 'action': 'click', 'label': gaId });
          }
          if (typeof browser !== 'undefined') {
            // FF only: click on links
            setTimeout(function () {
              window.close();
            }, 50);
          }
        });
      });
    },


    // Observers
    observeVisible: function observeVisible(visible) {
      this.toggleClass('visible', visible);
      this.fire('visible', { visible: visible });
    },


    // Condition rendering
    /**
    @param {(integer|null)}
    @param {integer}
    @return {boolean} */
    'conditionShowPromo': function conditionShowPromo(promo, number) {
      return promo === number;
    },

    // Methods
    expirationClose: function expirationClose() {
      var untilDate = new Date(this.user.subscription.paidUntil);
      storage.setItem('userClosedWarnToPremiumEndDate', String(untilDate));

      this.setActivePromo(this.user);
    },
    setActivePromo: function setActivePromo(user) {
      var _this = this;

      if (!this.elements) return; // For first Redux call

      /** End point of this array will be our view
      @type {Array<Object>} */
      var promos = function () {
        var promos = _this.elements.slice(1);
        promos = promos.filter(function (_ref5) {
          var premium = _ref5.premium;
          return premium === user.premium;
        });

        // Premium user
        if (user.premium) {
          var untilDate = new Date(user.subscription.paidUntil);
          var condition = _.get(user, 'subscription.auto_renewal') || // Only payment without subscription
          storage.getItem('userClosedWarnToPremiumEndDate') === String(untilDate) || Date.now() < untilDate.getTime() - 1000 * 3600 * 24 * 2; // Minus two days before expiration

          return promos.filter(function (_ref6) {
            var name = _ref6.name;
            return !condition && name === 'premium expiration soon' || condition && name !== 'premium expiration soon';
          });
        }

        // Do we have some current visible promo
        /** @type {(Object|undefined)} */
        var promotion = promotions.get();

        // If we have active promotion -> build it
        if (promotion) {
          var parent = Polymer.dom(Polymer.dom(_this.root).querySelector('div.Downloadable'));

          var link = document.createElement('a');
          link.setAttribute('href', config.browsec.baseUrl + 'en/plans');
          link.setAttribute('target', '_blank');

          // Appending nodes
          parent.appendChild(createElement(promotion));
          parent.appendChild(link);

          return [_this.elements[0]];
        }

        // Free user
        var trialPremium = storage.getItem('trial_premium_token') && !user.email && !storage.getItem('trialPremiumUsed');
        promos = promos.filter(function (_ref7) {
          var name = _ref7.name;
          return trialPremium && name === 'guest free trial' || !trialPremium && name !== 'guest free trial';
        });

        if (!trialPremium) {
          promos = promos.filter(function (_ref8) {
            var gaId = _ref8.gaId;
            return window.showSpeedPromo && gaId === 'banner_speed_new' || !window.showSpeedPromo && gaId !== 'banner_speed_new';
          });
        }

        return promos;
      }();

      if (promos.length > 1) promos = [weightedRandom(promos)];

      /** @type {(Object|null)} */
      var activePromo = promos.length === 1 ? promos.pop() : null;
      if (_.get(activePromo, 'gaId')) {
        ga({
          'category': 'banner', 'action': 'show', 'label': activePromo.gaId
        });
      }

      this.activePromo = activePromo ? this.elements.indexOf(activePromo) : null;

      /** @type {Boolean} */
      var visible = this.activePromo !== null;
      if (visible !== this.visible) this.visible = visible;
    }
  });
})();

},{}]},{},[1]);
