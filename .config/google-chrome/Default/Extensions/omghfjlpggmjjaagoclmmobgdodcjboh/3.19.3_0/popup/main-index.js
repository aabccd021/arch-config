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
      config = backgroundPage.config,
      Counters = backgroundPage.Counters,
      PolymerRedux = backgroundPage.PolymerRedux,
      proxy = backgroundPage.proxy,
      internationalize = backgroundPage['tools'].internationalize;

  /** @type {Object<String>} */

  var translations = _.transform({ 'help': 'help' }, function (carry, value, key) {
    carry[key] = internationalize(value);
  }, {});

  /** @type {String} */
  var defaultCountry = config.proxy.defaultCountry || 'nl';

  Polymer({
    'is': 'main-index',
    'behaviors': [PolymerRedux(Polymer)],
    'properties': {
      'switchOn': {
        'type': Boolean,
        'statePath': function statePath(_ref) {
          var pac = _ref.pac;
          return pac.mode === 'proxy';
        }
      },
      'switchVisible': {
        'type': Boolean,
        'statePath': function statePath(_ref2) {
          var domain = _ref2.domain,
              filters = _ref2['pac'].filters,
              page = _ref2.page;

          var parts = page.split(':');
          if (parts[0] === 'index' && parts[1] === 'filters') {
            return false;
          }
          if (!domain) return true;

          /** @type {Array<String>} */
          var domains = _.transform(filters, function (carry, _ref3) {
            var disabled = _ref3.disabled,
                domain = _ref3.domain;

            if (disabled) return;
            carry.push(domain);
          }, []);

          return !_.includes(domains, domain);
        }
      },
      'helpVisible': {
        'type': Boolean,
        'statePath': function statePath(_ref4) {
          var page = _ref4.page;

          var parts = page.split(':');
          return parts[0] === 'index' && parts[1] === 'filters';
        }
      },
      'page': {
        'type': String,
        'statePath': function statePath(_ref5) {
          var page = _ref5.page;
          return page;
        },
        'observer': 'observePage'
      },
      'translations': {
        'type': Object,
        'value': translations,
        'readOnly': true
      }
    },

    // Lifecycle
    ready: function ready() {
      var _this = this;

      this.switchNode = Polymer.dom(this.root).querySelector('div.Switch');
      this.switch = Polymer.dom(this.switchNode);

      // Removing empty nodes
      var nodes = _.toArray(this.switch.childNodes);
      nodes.forEach(function (node) {
        if (node.nodeType === Node.ELEMENT_NODE) return;
        _this.switch.removeChild(node);
      });
    },


    // Observers
    observePage: function observePage() {
      var _this2 = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (!args[1]) return; // Initial redux call

      var _args$map = args.map(function (item) {
        return item.split(':');
      }),
          _args$map2 = _slicedToArray(_args$map, 2),
          newPage = _args$map2[0],
          oldPage = _args$map2[1];

      if (newPage[0] !== 'index') return; // This will remove this element

      /** @type {String} */
      var mode = this.getState().pac.mode;

      // Removing first elements (they 'index' anyway)
      newPage.shift();
      oldPage.shift();

      /** @type {string} */
      var direction = newPage[0] === 'home' ? 'left' : 'right';

      /** @type {boolean} */
      var sameElement = newPage[0] === oldPage[0];

      /** @type {Element} */
      var oldElement = this.switch.firstChild;

      if (sameElement) {
        if (newPage[0] === 'filters' && newPage[1]) {
          /** @type {String} */
          var domain = newPage[1];

          oldElement.domain = domain;
          oldElement.country = mode === 'proxy' ? null : defaultCountry;
          oldElement.selectedDomain = null;
        }
      } else {
        /** @type {string} */
        var name = function () {
          switch (newPage[0]) {
            case 'home':
              return 'index-home';
            case 'locations':
              return 'index-locations';
            case 'filters':
              return 'index-filters';
          }
        }();

        /** @type {Node} */
        var newElement = document.createElement(name);
        if (newPage[0] === 'locations' && newPage[1]) {
          newElement.domain = newPage[1];
        }
        if (newPage[0] === 'filters' && newPage[1]) {
          newElement.domain = newPage[1];
          newElement.country = mode === 'proxy' ? null : defaultCountry;
        }

        if (direction === 'left') {
          this.switch.insertBefore(newElement, oldElement);
          this.switch.setAttribute('style', 'margin-left:-100%;');
        } else {
          this.switch.appendChild(newElement);
        }

        window.Velocity(this.switchNode, { 'margin-left': direction === 'left' ? '0%' : '-100%' }, 250).then(function () {
          _this2.switch.removeChild(oldElement);
          _this2.switch.removeAttribute('style');
        });
      }
    },


    // Methods
    openHelp: function openHelp() {
      Counters.increase('popup: smart settings: open help');

      Browser.tabs.create('/pages/help/help.html');
    },
    switchClick: function switchClick() {
      proxy[!this.switchOn ? 'enable' : 'disable']();
    }
  });
})();

},{}]},{},[1]);
