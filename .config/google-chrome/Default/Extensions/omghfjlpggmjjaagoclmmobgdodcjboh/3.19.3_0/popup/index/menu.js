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
      Counters = backgroundPage.Counters,
      PolymerRedux = backgroundPage.PolymerRedux,
      routes = backgroundPage.routes,
      ShowedOffers = backgroundPage['showedOffers'],
      internationalize = backgroundPage['tools'].internationalize;

  /** @type {Object<String>} */

  var translations = _.transform({
    'changeLocation': 'change_location',
    'contactUs': 'contact_us',
    'home': 'home',
    'smartSettings': 'smart_settings'
  }, function (carry, value, key) {
    carry[key] = internationalize(value);
  }, {});

  Polymer({
    'is': 'index-menu',
    'behaviors': [PolymerRedux(Polymer)],
    'properties': {
      'contactUsUrl': {
        'type': String,
        'statePath': function statePath(_ref) {
          var days = _ref['daysAfterInstall'];
          return browsecLink(routes.contact_us_url);
        }
      },
      'domain': {
        'type': String,
        'statePath': function statePath(_ref2) {
          var domain = _ref2.domain;
          return domain;
        }
      },
      'filtersPage': {
        'type': Boolean,
        'value': false,
        'statePath': function statePath(_ref3) {
          var page = _ref3.page;

          page = page.split(':');
          return page[0] === 'index' && page[1] === 'filters';
        }
      },
      'homePage': {
        'type': Boolean,
        'value': false,
        'statePath': function statePath(_ref4) {
          var page = _ref4.page;

          page = page.split(':');
          return page[0] === 'index' && page[1] === 'home';
        }
      },
      'containsFilter': {
        'type': Boolean,
        'statePath': function statePath(_ref5) {
          var domain = _ref5.domain,
              filters = _ref5['pac'].filters;

          /** @type {Array<String>} */
          var list = _.transform(filters, function (carry, _ref6) {
            var disabled = _ref6.disabled,
                domain = _ref6.domain;

            if (!disabled) carry.push(domain);
          }, []);

          // Is domain in list of domains
          return _.includes(list, domain);
        }
      },
      'translations': {
        'type': Object,
        'value': translations,
        'readOnly': true
      }
    },

    // Lifecycle
    ready: function ready() {
      Polymer.dom(this.root).childNodes.forEach(function (node) {
        if (node.nodeType === Node.ELEMENT_NODE) return;

        node.remove();
      });

      // FF links click
      if (typeof browser === 'undefined') return;
      var links = Polymer.dom(this.root).querySelectorAll('a');
      links.forEach(function (node) {
        node.addEventListener('click', function () {
          setTimeout(function () {
            window.close();
          }, 50);
        });
      });
    },
    detached: function detached() {
      if (!this.documentClick) return;
      document.removeEventListener('mousedown', this.documentClick);
      delete this.documentClick;
    },


    // Calculated properties
    /**
    @param {Boolean} desiredPage
    @return {String} */
    'iconConditionClass': function iconConditionClass(desiredPage) {
      return desiredPage ? 'selected' : '';
    },

    // Methods
    goHome: function goHome() {
      if (this.homePage) return;
      this.dispatch({ 'type': 'Page change', 'page': 'index:home' });
    },
    openSettings: function openSettings(event) {
      var _this = this;

      event.preventDefault();

      if (this.documentClick) return;

      Counters.increase('popup: menu: smart settings click');

      if (!ShowedOffers.includes('smart settings')) {
        ShowedOffers.push('smart settings');
        document.body.append(document.createElement('popup-help'));
      }

      // Create content menu element

      var _event$target$getBoun = event.target.getBoundingClientRect(),
          left = _event$target$getBoun.left;

      var maxWidth = document.body.clientWidth - left;
      var style = 'left:' + left + 'px;max-width:' + maxWidth + 'px;';

      var element = document.createElement('context-menu');
      element.setAttribute('style', style);

      // Setup of properties
      element.containsFilter = this.containsFilter;
      element.domain = this.domain;

      // Append node to body
      document.body.append(element);

      this.documentClick = function (_ref7) {
        var target = _ref7.target;

        /** @type {Boolean} */
        var deleteNode = !target.matches('div.Element');

        /** @type {Boolean} */
        var doNothing = deleteNode && (target === element || element.contains(target)) || target.matches('popup-help, popup-help *');
        if (doNothing) return;

        if (deleteNode) element.remove();
        document.removeEventListener('mousedown', _this.documentClick);
        delete _this.documentClick;
      };
      document.addEventListener('mousedown', this.documentClick);
    }
  });
})();

},{}]},{},[1]);
