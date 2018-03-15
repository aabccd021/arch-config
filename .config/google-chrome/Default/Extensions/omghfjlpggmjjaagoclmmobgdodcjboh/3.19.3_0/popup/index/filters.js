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
      domainZoneList = backgroundPage.domainZoneList,
      ga = backgroundPage.ga,
      PolymerRedux = backgroundPage.PolymerRedux,
      proxy = backgroundPage.proxy,
      punycode = backgroundPage.punycode,
      store = backgroundPage.store,
      _backgroundPage$tools = backgroundPage['tools'],
      filtersSorting = _backgroundPage$tools.filtersSorting,
      internationalize = _backgroundPage$tools.internationalize;

  /** @type {Object<String>} */

  var translations = _.transform({
    'cancelEditing': 'cancel_editing',
    'off': 'off',
    'on': 'on',
    'pleaseEnterDomain': 'please_enter_domain',
    'pleaseEnterValidDomain': 'please_enter_valid_domain',
    'removeSmartSetting': 'remove_smart_setting',
    'select': 'select',
    'settingWasDeleted': 'setting_was_deleted',
    'thisDomainAlreadyInList': 'this_domain_already_in_list',
    'undo': 'undo',
    'use': 'use'
  }, function (carry, value, key) {
    carry[key] = internationalize(value);
  }, {});

  /** @type {String} */
  var defaultCountry = config.proxy.defaultCountry || 'nl';
  var siteFilters = proxy.siteFilters;

  /** @type {Function} - for sorting filters by alphabet */

  var alphabetFiltersSorting = function alphabetFiltersSorting(_ref, _ref2) {
    var a = _ref['view'];
    var b = _ref2['view'];

    if (a < b) return -1;if (a > b) return 1;return 0;
  };

  Polymer({
    'is': 'index-filters',
    'behaviors': [PolymerRedux(Polymer)],
    'properties': {
      'country': { // Country in flag select
        'type': String,
        'value': null
      },
      'countries': {
        'type': Array,
        'value': [],
        'statePath': function statePath(_ref3) {
          var servers = _ref3.servers,
              premium = _ref3['user'].premium;
          return _.transform(servers, function (carry, value, country) {
            var servers = value[premium ? 'premium_servers' : 'servers'];
            if (!servers) return;

            carry.push(country);
          }, []);
        }
      },
      'domain': { // Input:text with domain
        'type': String,
        'value': ''
      },
      'filters': {
        'type': Array,
        'value': []
      },
      'premium': {
        'type': Boolean,
        'value': null,
        'statePath': function statePath(_ref4) {
          var user = _ref4.user;
          return user.premium;
        }
      },

      'selectedDomain': { // Used to split 'add' mode and 'modify' mode
        'type': String,
        'value': null
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

      this.nodes = {
        'list': Polymer.dom(this.root).querySelector('div.List')
      };

      /** Loading list of filters
      @typedef {Object} VisibleFilter
      @property {(true|undefined)} disabled
      @property {(String|null)} country
      @property {Boolean} deleted
      @property {String} domain
      @property {String} view
       @type {Array<VisibleFilter>} */
      this.filters = this.getState().pac.filters.map(function (item) {
        item = _.cloneDeep(item);
        item.country = item.proxyMode ? item.country : null;
        delete item.proxyMode;

        return _.assign(item, {
          'view': punycode.toUnicode(item.domain),
          'deleted': false
        });
      }).sort(alphabetFiltersSorting); // Alphabet sorting

      var root = Polymer.dom(this.root);

      // Nodes
      this.domainInput = root.querySelector('div.ChangeRule filters-domain');
      this.countryNode = root.querySelector('div.ChangeRule_Country');

      // Listener to changes of filters.length
      this.removeStoreListener = store.compare(function (_ref5) {
        var filters = _ref5['pac'].filters;
        return filters;
      }, function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var list = {};list.new = args[0];
        list.old = args[1];

        if (list.new.length === list.old.length) return;

        /** @type {String} */
        var action = list.new.length > list.old.length ? 'addition' : 'deletion';

        if (action === 'addition') {
          var filter = _.differenceBy(list.new, list.old, _.isEqual)[0];
          if (!filter) return;

          var hasFilter = Boolean(_.find(_this.filters, function (_ref6) {
            var domain = _ref6.domain;
            return domain === filter.domain;
          }));
          if (hasFilter) return;

          var filters = _.cloneDeep(_this.filters);
          filters.push({
            'country': filter.country,
            'deleted': false,
            'domain': filter.domain,
            'view': punycode.toUnicode(filter.domain)
          });

          _this.filters = filters.sort(alphabetFiltersSorting); // Render here
          return;
        }

        if (action === 'deletion') {
          /** @type {Boolean} */
          var userLogined = Boolean(_this.getState().user.email);

          // Logout
          var condition = !userLogined && !list.new.length && list.old.length - list.new.length >= 2;
          if (condition) {
            _this.filters = [];return; // Render here
          }

          var _filter = _.differenceBy(list.old, list.new, _.isEqual)[0];
          if (!_filter) return;

          var _hasFilter = Boolean(_.find(_this.filters, function (_ref7) {
            var deleted = _ref7.deleted,
                domain = _ref7.domain;
            return domain === _filter.domain && !deleted;
          }));
          if (!_hasFilter) return;

          var _filters = _.cloneDeep(_this.filters);
          _.remove(_filters, function (_ref8) {
            var domain = _ref8.domain;
            return domain === _filter.domain;
          });
          _this.filters = _filters; // Render here
        }
      });
    },
    detached: function detached() {
      this.removeStoreListener();
      delete this.removeStoreListener;

      if (!this.documentClick) return;
      document.removeEventListener('mousedown', this.documentClick);
    },


    // Computed properties
    'classButton': function classButton(site) {
      return site ? 'save' : '';
    },

    'classElement': function classElement(_ref9, selectedDomain) {
      var deleted = _ref9.deleted,
          disabled = _ref9.disabled,
          domain = _ref9.domain;

      var classes = [];
      if (deleted) classes.push('deleted');
      if (disabled) classes.push('disabled');
      if (selectedDomain) {
        classes.push(domain === selectedDomain ? 'active' : 'inactive');
      }

      return classes.join(' ');
    },

    'computeVisibleCountry': function computeVisibleCountry(country, countries) {
      /** @type {String} */
      var code = _.includes(countries, country) ? country : defaultCountry;

      return '/images/flags/' + code + '.png';
    },

    'domainIcon': function domainIcon(domain) {
      return domain ? 'https://www.google.com/s2/favicons?domain=' + domain : '/images/empty.png';
    },

    // Methods
    cancelRemove: function cancelRemove(_ref10) {
      var model = _ref10.model;

      var condition = this.filters.filter(function (_ref11) {
        var deleted = _ref11.deleted,
            disabled = _ref11.disabled;
        return !deleted && !disabled;
      }).length && !this.getState().user.premium;
      if (condition) {
        // Premium popup show condition
        this.showPremiumPopup();return;
      }

      var _model$get = model.get('item'),
          country = _model$get.country,
          domain = _model$get.domain;

      var filters = _.cloneDeep(this.filters);
      _.find(filters, function (item) {
        return item.domain === domain;
      }).deleted = false;
      this.filters = filters; // Render here

      var data = { domain: domain, 'type': country ? 'proxy' : 'direct' };
      if (country) data.country = country;
      siteFilters.add(data);
    },
    listClick: function listClick(_ref12) {
      var target = _ref12.target;

      if (target !== this.nodes.list) return;

      this.resetSelection();
    },
    listElementClick: function listElementClick(_ref13) {
      var model = _ref13.model,
          target = _ref13.target;

      var _model$get2 = model.get('item'),
          country = _model$get2.country,
          disabled = _model$get2.disabled,
          domain = _model$get2.domain,
          view = _model$get2.view;

      // Remove click


      if (target.classList.contains('List_Remove')) {
        var filters = _.cloneDeep(this.filters);
        _.find(filters, function (item) {
          return item.domain === domain;
        }).deleted = true;
        this.filters = filters; // Render here

        siteFilters.remove(domain);

        this.resetSelection();
        return;
      }

      // Select disabled click
      if (target.classList.contains('List_Select_Button')) {
        {
          // Popup part
          var _filters2 = _.cloneDeep(this.filters);
          var filter = _.find(_filters2, function (_ref14) {
            var disabled = _ref14.disabled;
            return !disabled;
          });
          if (filter) filter.disabled = true;

          delete _.find(_filters2, function (_ref15) {
            var ownDomain = _ref15['domain'];
            return domain === ownDomain;
          }).disabled;

          this.filters = _filters2;
        }

        {
          // Internal extension part
          /** @type {Array<Object>} */
          var _filters3 = _.cloneDeep(this.getState().pac.filters);

          var _filter2 = _.find(_filters3, function (_ref16) {
            var disabled = _ref16.disabled;
            return !disabled;
          });
          if (_filter2) _filter2.disabled = true;

          delete _.find(_filters3, function (_ref17) {
            var ownDomain = _ref17['domain'];
            return domain === ownDomain;
          }).disabled;

          proxy.setState({ filters: _filters3 });
        }
        return;
      }

      // Disabled element
      if (disabled) {
        this.resetSelection();return;
      }

      // Activate click
      this.country = country;
      this.domain = view;
      this.selectedDomain = domain;
    },
    openCountryList: function openCountryList() {
      var _this2 = this;

      /** @type {Node} */
      var element = document.createElement('filters-country-list');

      element.countries = this.countries.map(function (country) {
        return {
          'code': country,
          'name': Browser.i18n.getMessage('country_name_' + country.toUpperCase())
        };
      });

      element.addEventListener('select', function (_ref18) {
        var country = _ref18['detail'];

        _this2.country = country;
      });
      element.addEventListener('disable', function () {
        _this2.country = null;
      });

      /** @type {integer} */

      var _countryNode$getBound = this.countryNode.getBoundingClientRect(),
          offsetLeft = _countryNode$getBound['left'],
          offsetTop = _countryNode$getBound['top'];

      /** @type {integer} */


      var offsetHeight = this.countryNode.offsetHeight;

      /** @type {integer} */
      var top = offsetTop + offsetHeight;

      /** @type {integer} */
      var right = window.innerWidth - offsetLeft - this.countryNode.offsetWidth;

      /** @type {integer} */
      var height = window.innerHeight - offsetTop - offsetHeight;

      element.setAttribute('style', 'top:' + top + 'px;right:' + right + 'px;max-height:' + height + 'px;');

      document.body.append(element);

      this.documentClick = function (_ref19) {
        var target = _ref19.target;

        // Click on element
        if (element.contains(target) || target === element) {
          if (target.classList.contains('E')) {
            document.removeEventListener('mousedown', _this2.documentClick);
            delete _this2.documentClick;
            return;
          }

          var parent = void 0;
          while (true) {
            parent = (parent || target).parentElement;
            if (parent === null) break;

            if (parent.classList.contains('E')) {
              document.removeEventListener('mousedown', _this2.documentClick);
              delete _this2.documentClick;
              return;
            }
          }

          // Do nothing
          return;
        }

        element.remove();
        document.removeEventListener('mousedown', _this2.documentClick);
        delete _this2.documentClick;
      };

      document.addEventListener('mousedown', this.documentClick);
    },
    resetSelection: function resetSelection() {
      this.country = null;
      this.domain = '';
      this.selectedDomain = null;
    },


    // Add or modify filter
    save: function save() {
      var _this3 = this;

      /** @type {String} - visible form for domain (for user) */
      var domainView = this.domain;

      /** @type {(String|undefined)} - punycode converted form for domain */
      var domain = punycode.toASCII(domainView);

      /**
      @param {String} text
      @return {undefined} */
      var createError = function createError(text) {
        var element = document.createElement('tooltip-error');
        element.text = text;

        var _domainInput$getBound = _this3.domainInput.getBoundingClientRect(),
            left = _domainInput$getBound.left,
            top = _domainInput$getBound.top;

        top += _this3.domainInput.offsetHeight - 1;
        element.setAttribute('style', 'top:' + top + 'px;left:' + left + 'px;');
        document.body.append(element);

        var listener = function () {
          var first = true;

          return function () {
            if (first) {
              first = false;return;
            }

            element.remove();
            document.removeEventListener('click', listener);
          };
        }();
        document.addEventListener('click', listener);
      };

      // Check for value existence
      if (!domainView) {
        createError(translations.pleaseEnterDomain);return;
      }

      // Check for correct domain parts count
      if (domain.split('.').length === 1) {
        createError(translations.pleaseEnterValidDomain);return;
      }

      // Check for correct domain
      {
        var parts = domain.split('.');
        var hasErrors = _.find(parts, function (part) {
          return !/^[a-zA-Z0-9-_]+$/.test(part);
        }) !== undefined;

        if (hasErrors) {
          createError(translations.pleaseEnterValidDomain);return;
        }
      }

      // Check for correct domain zone
      {
        /** @type {String} */
        var zone = domain.split('.').pop();
        if (!_.includes(domainZoneList.data, zone)) {
          createError(translations.pleaseEnterValidDomain);return;
        }
      }

      // Check for doubles
      if (!this.selectedDomain) {
        var domains = this.filters.map(function (_ref20) {
          var domain = _ref20.domain;
          return domain;
        });
        if (_.includes(domains, domain)) {
          createError(translations.thisDomainAlreadyInList);return;
        }
      }

      // Addition
      if (!this.selectedDomain) {
        var condition = this.filters.filter(function (_ref21) {
          var deleted = _ref21.deleted,
              disabled = _ref21.disabled;
          return !deleted && !disabled;
        }).length && !this.getState().user.premium;
        if (condition) {
          // Premium popup show condition
          this.showPremiumPopup();return;
        }

        Counters.increase('popup: smart settings: add rule');

        /** @type {Object} */
        var filter = this.country ? { 'country': this.country, domain: domain, 'type': 'proxy' } : { domain: domain, 'type': 'direct' };

        // Popup part
        var filters = this.filters.slice();
        filters.unshift({
          'country': this.country, 'deleted': false, domain: domain, 'view': domainView
        });
        this.filters = filters;

        // Internal extension part
        siteFilters.add(filter);
      }

      // Modification
      else {
          {
            // Popup part
            var _filters4 = this.filters.slice();
            _.remove(_filters4, function (_ref22) {
              var domain = _ref22.domain;
              return domain === _this3.selectedDomain;
            });

            _filters4.push({
              'country': this.country,
              'deleted': false,
              domain: domain,
              'view': domainView
            });
            _filters4.sort(alphabetFiltersSorting);

            this.filters = _filters4;
          }

          {
            // Internal extension part
            /** @type {Array<Object>} */
            var _filters5 = _.cloneDeep(this.getState().pac.filters);

            // Remove same domain

            var _$remove = _.remove(_filters5, function (_ref23) {
              var domain = _ref23.domain;
              return _this3.selectedDomain === domain;
            }),
                _$remove2 = _slicedToArray(_$remove, 1),
                country = _$remove2[0].country;

            // Add new entity


            _filters5.push({
              'country': this.country || country,
              domain: domain,
              'proxyMode': Boolean(this.country)
            });
            _filters5.sort(filtersSorting);

            proxy.setState({ filters: _filters5 });
          }
        }

      // After successfull addition/modification
      this.resetSelection();
    },
    showPremiumPopup: function showPremiumPopup() {
      var _this4 = this;

      if (this.popupPremiumFreeze) return;

      this.popupPremiumFreeze = true;

      var popupPremium = document.createElement('popup-premium-onerule');
      popupPremium.setAttribute('style', 'top:-100%;');
      document.body.append(popupPremium);

      ga('premium', 'show');

      window.Velocity(popupPremium, { 'top': 0 }, 800).then(function () {
        popupPremium.removeAttribute('style');
        _this4.popupPremiumFreeze = false;
      });
    }
  });
})();

},{}]},{},[1]);
