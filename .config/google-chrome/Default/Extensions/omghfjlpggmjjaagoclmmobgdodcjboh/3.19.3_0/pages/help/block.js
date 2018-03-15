(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

{
  var _browser = typeof browser !== 'undefined' ? browser : chrome;

  var _browser$extension$ge = _browser.extension.getBackgroundPage(),
      _ = _browser$extension$ge._,
      internationalize = _browser$extension$ge['tools'].internationalize;

  /** @type {Object<String>} */


  var translations = _.transform({
    // 1st block
    'enableForSelectedSites': 'enable_browsec_only_for_selected_sites',
    'enableForSelectedSitesDescription1': 'enable_browsec_only_for_selected_sites_description_1',
    'enableForSelectedSitesDescription2': 'enable_browsec_only_for_selected_sites_description_2',
    'enableForSelectedSitesDescription3': 'enable_browsec_only_for_selected_sites_description_3',

    // 2nd block
    'enableForAllSitesExcludingSelected': 'enable_browsec_for_all_sites_excluding_selected_sites',
    'enableForAllSitesExcludingSelectedDescription1': 'enable_browsec_for_all_sites_excluding_selected_sites_description_1',
    'enableForAllSitesExcludingSelectedDescription2': 'enable_browsec_for_all_sites_excluding_selected_sites_description_2',
    'enableForAllSitesExcludingSelectedDescription3': 'enable_browsec_for_all_sites_excluding_selected_sites_description_3',

    // 3rd block
    'useDifferentLocationsForDifferentSites': 'use_different_locations_for_different_sites',
    'useDifferentLocationsForDifferentSitesDescription1': 'use_different_locations_for_different_sites_description_1',
    'useDifferentLocationsForDifferentSitesDescription2': 'use_different_locations_for_different_sites_description_2',
    'useDifferentLocationsForDifferentSitesDescription3': 'use_different_locations_for_different_sites_description_3',

    'howToUseSmartSettings': 'how_to_use_smart_settings',
    'iWantTo': 'i_want_to'

    /*
    'enableForAllSitesExcludingSelected':
      'enable_browsec_for_all_sites_excluding_selected_sites',
    'enableForSelectedSites': 'enable_browsec_only_for_selected_sites',
    'howToUseSmartSettings': 'how_to_use_smart_settings',
    'iWantTo': 'i_want_to'*/
  }, function (carry, value, key) {
    carry[key] = internationalize(value);
  }, {});

  /** Translations with images in code
  @type {Object<String>} */
  var imageTranslations = _.transform({
    'enableForAllSitesExcludingSelectedDescription': 'enable_browsec_for_all_sites_excluding_selected_sites_description',
    'enableForSelectedSitesDescription': 'enable_browsec_only_for_selected_sites_description',
    'useAnotherLocationForSelectedSitesDescription': 'use_another_location_for_selected_sites_description'
  }, function (carry, value, key) {
    carry[key] = internationalize(value).replace(/IMG/, '<img src="/images/help/plus.png" width="23" height="13" alt="" />');
  }, {});

  _.assign(translations, imageTranslations);

  Polymer({
    'is': 'main-block',
    'properties': {
      'freeze': {
        'type': Boolean,
        'value': false
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

      /** All nodes with image replacement */
      _.toArray(Polymer.dom(this.root).querySelectorAll('[data-role="with image"]')).forEach(function (element) {
        /** @type {String} */
        var text = element.textContent.trim();

        /** @type {Array<Array<Node>>} */
        var parts = text.split('IMG').map(function (text, index) {
          if (!index) return [document.createTextNode(text)];

          /** @type {Element} */
          var img = _.transform({
            'src': '/images/help/plus.png',
            'width': '23',
            'height': '13',
            'alt': ''
          }, function (img, value, attribute) {
            img.setAttribute(attribute, value);
          }, document.createElement('img'));

          return [img, document.createTextNode(text)];
        });

        /** @type {Array<Node>} */
        var nodes = _.flatten(parts);

        // Removing all nodes inside element
        _.toArray(element.childNodes).forEach(function (node) {
          element.removeChild(node);
        });
        nodes.forEach(function (node) {
          element.appendChild(node);
        });
      });

      /** @type {Array<Object>} */
      var objects = _.toArray(Polymer.dom(this.root).querySelectorAll('[data-role="section"]')).map(function (node, index) {
        var nodes = {
          /** @type {PolymerNode} */
          'parent': Polymer.dom(node),

          /** @type {Element} */
          'trigger': node.querySelector('[data-click="trigger"]'),

          /** @type {Element} */
          'information': node.querySelector('div.Section_Information')
        };

        nodes.trigger.addEventListener('click', function () {
          if (_this.freeze) return;

          _this.freeze = true;

          /** @type {Object} */
          var currentObject = objects[index];

          /** @type {Array<integer>} */
          var otherIndexes = _.without(indexes, index).filter(function (index) {
            return objects[index].visible;
          });

          /** @type {Array<Promise>} */
          var promises = otherIndexes.map(function (index) {
            return window.Velocity(objects[index].nodes.information, 'slideUp', 700).then(function () {
              objects[index].nodes.parent.classList.remove('open');
              objects[index].visible = false;
            });
          });

          promises.push(window.Velocity(currentObject.nodes.information, currentObject.visible ? 'slideUp' : 'slideDown', 700).then(function () {
            /** @type {String} */
            var action = currentObject.visible ? 'remove' : 'add';
            currentObject.nodes.parent.classList[action]('open');
            currentObject.visible = !currentObject.visible;
          }));

          Promise.all(promises).then(function () {
            _this.freeze = false;
          });
        });

        return { nodes: nodes, 'visible': false };
      });

      /** @type {Array<integer>} */
      var indexes = objects.map(function (x, index) {
        return index;
      });
    }
  });
}

},{}]},{},[1]);
