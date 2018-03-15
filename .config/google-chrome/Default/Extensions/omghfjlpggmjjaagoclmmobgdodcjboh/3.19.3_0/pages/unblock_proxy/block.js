(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

{
  // Chrome only page
  var _browser = typeof browser !== 'undefined' ? browser : chrome;

  var _browser$extension$ge = _browser.extension.getBackgroundPage(),
      _ = _browser$extension$ge._,
      browsecLink = _browser$extension$ge.browsecLink,
      Browser = _browser$extension$ge.Browser,
      log = _browser$extension$ge.log,
      proxy = _browser$extension$ge.proxy,
      routes = _browser$extension$ge.routes,
      internationalize = _browser$extension$ge['tools'].internationalize;

  /** @type {Object<String>} */


  var translations = _.transform({
    'becauseYourProxySettingsAreBlocked': 'because_your_proxy_settings_are_blocked',
    'browsecIsEnabled': 'browsec_is_enabled',
    'cantSetupSecureConnection': 'cant_setup_secure_connection',
    'contactSupport': 'contact_support',
    'continueUsingBrowsecToOpenWebsites': 'continue_using_browsec_to_open_websites',
    'disableSelectedExtensions': 'disable_selected_extensions',
    'fixProxySettings': 'fix_proxy_settings',
    'pleaseTryAgainOrContactSupport': 'please_try_again_or_contact_support',
    'selectAllowInPopupWindow': 'select_allow_in_popup_window',
    'somethingWentWrong': 'something_went_wrong',
    'tryAgain': 'try_again',
    'yourProxySettingsAreBlocked': 'your_proxy_settings_are_blocked'
  }, function (carry, value, key) {
    carry[key] = internationalize(value);
  }, {});

  /**
  @return {Promise} */
  var permissionRequest = function permissionRequest() {
    return new Promise(function (resolve) {
      chrome.permissions.request({ 'permissions': ['management'] }, resolve);
    }).then(
    /**
    @param {Boolean} allowed */
    function (allowed) {
      return allowed ? undefined // Success
      : Promise.reject('Management permission is not granted') // Rejection
      ;
    });
  };

  Polymer({
    'is': 'main-block',
    'properties': {
      'contactSupportUrl': {
        'type': String,
        'value': browsecLink(routes.contact_us_url),
        'readOnly': true
      },
      'extensions': {
        'type': Array,
        'value': []
      },
      'hasManagement': {
        'type': Boolean,
        'value': false
      },
      'logoUrl': {
        'type': String,
        'value': browsecLink('https://browsec.com/?utm_source=Chromium+extension&utm_medium=logo_link&utm_campaign=congratulations'),
        'readOnly': true
      },
      'mode': {
        'type': String,
        'value': 'information' // OR 'success' OR 'error'
      },
      'translations': {
        'type': Object,
        'value': translations,
        'readOnly': true
      }
    },

    ready: function ready() {
      var _this = this;

      Browser.permissions.getAll().then(
      /**
      @param {Array<String>} permissions */
      function (_ref) {
        var permissions = _ref.permissions;

        // Shows "Fix proxy settings" button, if permission is not granted yet
        if (!_.includes(permissions, 'management')) return;

        _this.hasManagement = true;
        _this.getExtensionsList(); // lists the extensions to turn off
      });
    },


    'comparison': function comparison(mode, value) {
      return mode === value;
    },

    // Methods
    disableExtensions: function disableExtensions() {
      var _this2 = this;

      /** @type {Array<Object>} */
      var extensions = this.extensions.filter(function (_ref2) {
        var checked = _ref2.checked;
        return checked;
      });
      if (extensions.length === 0) {
        if (this.extensions.length === 0) {
          proxy.enable();
          this.mode = 'success'; // <- No problem extensions = success
        }
        return;
      }

      permissionRequest().then(function () {
        /** Disable every extension, and after all of the selected are disabled,
        proceed to show success page.
        @type {Array<Promise>} */
        var promises = extensions.map(function (_ref3) {
          var id = _ref3.id;
          return new Promise(function (resolve) {
            chrome.management.setEnabled(id, false, resolve);
          });
        });

        Promise.all(promises).then(function () {
          proxy.enable().then(function () {
            _this2.mode = 'success';
            // console.log( 'Unblock proxy page: setBooleanState -> success' );
            // nodes.warningBox.fadeOut( () => { nodes.successBox.fadeIn(); });
          }, function () {
            _this2.mode = 'error';
            // console.log( 'error' );
            // nodes.warningBox.fadeOut( () => { nodes.errorBox.fadeIn(); });
          });
        }, function (error) {
          _this2.mode = 'error';
          log.error('Unblock proxy error: ', error);
          // nodes.warningBox.fadeOut( () => { nodes.errorBox.fadeIn(); });
        });
      });
    },


    /** Checkbox click
    @param {Object} model
    @param {Boolean} checked
    @return {undefined} */
    extensionCheckbox: function extensionCheckbox(_ref4) {
      var model = _ref4.model,
          checked = _ref4['target'].checked;

      /** Actual object of <tr> line
      @type {Object} */
      var extension = model.get('item');

      /** @type {integer} */
      var index = this.extensions.indexOf(extension);

      /** @type {Array<Object>} */
      var extensions = _.cloneDeep(this.extensions);
      extensions[index].checked = checked;

      this.extensions = extensions; // Render here
    },
    getExtensionsList: function getExtensionsList() {
      var _this3 = this;

      new Promise(function (resolve) {
        chrome.management.getAll(resolve);
      }).then(
      /** @type {Array<Object>} */
      function (data) {
        /** @type {Array<Object>} */
        var extensions = _.transform(data, function (extensions, _ref5) {
          var enabled = _ref5.enabled,
              icons = _ref5.icons,
              id = _ref5.id,
              name = _ref5.name,
              permissions = _ref5.permissions;

          var condition = _.includes(permissions, 'proxy') && Browser.runtime.id !== id && // Not our extension
          enabled; // Exclude disabled extensions
          if (!condition) return;

          /** @type {Object} */
          var extension = { 'checked': true, id: id, name: name };

          /** @type {(String|undefined)} */
          var iconUrl = _.get(icons[1] || icons[0], 'url');
          if (iconUrl) {
            extension.icon = 'chrome://favicon/size/38/chrome-extension://' + id + '/';
          }

          extensions.push(extension);
        }, []);

        _this3.extensions = extensions;
      });
    },


    // First click here
    scanExtensions: function scanExtensions() {
      var _this4 = this;

      // Extra check of proxy control
      proxy.getControlState().then(
      /**
      @param {Boolean} state - if true we have control over proxy */
      function (state) {
        var makeRequest = function makeRequest() {
          permissionRequest().then(function () {
            if (_this4.mode !== 'information') _this4.mode = 'information';
            _this4.hasManagement = true;
            _this4.getExtensionsList();
          });
        };

        if (state) {
          // Strnage, but we have control over proxy
          proxy.enable().then(function () {
            _this4.mode = 'success';
          }, function () {
            makeRequest();
          });
          return;
        }

        // No control over proxy
        makeRequest();
      });
    }
  });
}

},{}]},{},[1]);
