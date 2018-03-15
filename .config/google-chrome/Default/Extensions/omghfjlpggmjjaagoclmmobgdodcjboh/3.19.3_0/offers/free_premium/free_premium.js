(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (root) {

  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  function noop() {}
  
  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function () {
      fn.apply(thisArg, arguments);
    };
  }

  function Promise(fn) {
    if (!(this instanceof Promise)) throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function') throw new TypeError('not a function');
    this._state = 0;
    this._handled = false;
    this._value = undefined;
    this._deferreds = [];

    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }
    if (self._state === 0) {
      self._deferreds.push(deferred);
      return;
    }
    self._handled = true;
    Promise._immediateFn(function () {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }
      var ret;
      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }
      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then;
        if (newValue instanceof Promise) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }
      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      Promise._immediateFn(function() {
        if (!self._handled) {
          Promise._unhandledRejectionFn(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }

  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }

  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */
  function doResolve(fn, self) {
    var done = false;
    try {
      fn(function (value) {
        if (done) return;
        done = true;
        resolve(self, value);
      }, function (reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      });
    } catch (ex) {
      if (done) return;
      done = true;
      reject(self, ex);
    }
  }

  Promise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
  };

  Promise.prototype.then = function (onFulfilled, onRejected) {
    var prom = new (this.constructor)(noop);

    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise.all = function (arr) {
    return new Promise(function (resolve, reject) {
      if (!arr || typeof arr.length === 'undefined') throw new TypeError('Promise.all accepts an array');
      var args = Array.prototype.slice.call(arr);
      if (args.length === 0) return resolve([]);
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (typeof val === 'object' || typeof val === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {
              then.call(val, function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise.resolve = function (value) {
    if (value && typeof value === 'object' && value.constructor === Promise) {
      return value;
    }

    return new Promise(function (resolve) {
      resolve(value);
    });
  };

  Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
      reject(value);
    });
  };

  Promise.race = function (values) {
    return new Promise(function (resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  // Use polyfill for setImmediate for performance gains
  Promise._immediateFn = (typeof setImmediate === 'function' && function (fn) { setImmediate(fn); }) ||
    function (fn) {
      setTimeoutFunc(fn, 0);
    };

  Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };

  /**
   * Set the immediate function to execute callbacks
   * @param fn {function} Function to execute
   * @deprecated
   */
  Promise._setImmediateFn = function _setImmediateFn(fn) {
    Promise._immediateFn = fn;
  };

  /**
   * Change the function to execute on unhandled rejection
   * @param {function} fn Function to execute on unhandled rejection
   * @deprecated
   */
  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
    Promise._unhandledRejectionFn = fn;
  };
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Promise;
  } else if (!root.Promise) {
    root.Promise = Promise;
  }

})(this);

},{}],2:[function(require,module,exports){
'use strict';

require('polyfills/Promise');

// TODO lodash
var curry = function curry(func) {
  for (var _len = arguments.length, parameters = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    parameters[_key - 1] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    func.apply(null, parameters.concat(args));
  };
};

var validateEmail = function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

var _browser = typeof browser !== 'undefined' ? browser : chrome;

var _browser$extension$ge = _browser.extension.getBackgroundPage(),
    ajaxes = _browser$extension$ge.ajaxes,
    routes = _browser$extension$ge.routes,
    storage = _browser$extension$ge.storage;

var _window = window,
    $ = _window.$;


var blink_counter = 6;
var titleText = document.title;
var blink_fn = function blink_fn() {
  blink_counter -= 1;
  // space is a combo of invisible separator (u+2063) and medium math space (u+205f)
  document.title = document.title === titleText ? '⁣⁣⁣⁣⁣⁣⁣ ' : titleText;
  if (blink_counter > 0) setTimeout(blink_fn, 300);
};

if (document.hidden) blink_fn();

var jContainer = $('.offerHead');
var containerClasses = ['_showSignUp', '_showSignIn', '_showSignSuccess', '_showSignInSuccess'];
var jSignup = $('#signup-form');
var jSignin = $('#signin-form');

/**
@param {*} jForm
@param {*} status
@return {jQueryNode} */
var toggleButton = function toggleButton(jForm, status) {
  var jBtn = $('button[type="submit"]', jForm);
  if (status) jBtn.removeAttr('disabled');else jBtn.attr('disabled', 'disabled');

  return jBtn;
};
var signUpSubmit = function signUpSubmit(e) {
  var jEmail = $('[name=email]', jSignup);
  var email = jEmail.val();
  e.preventDefault();

  if (!validateEmail(email.trim())) {
    toggleError(jSignup, true, 'Invalid Email');
    return false;
  }

  toggleButton(jSignup, false);
  toggleError(jSignup);

  ajaxes.premiumSignup(email, storage.getItem('trial_premium_token')).then(function (data) {
    toggleButton(jSignup, true);
    if (data.status === 0) {
      togglePanels('_showSignSuccess');
      $('.jShowGmail').toggle(email.indexOf('@gmail.com') > 0); // gmail link
    } else if (data.error.indexOf('already exists') !== -1) {
      jEmail.val('');
      togglePanels('_showSignIn');
      storage.setItem('signInEmail', email);
    } else {
      toggleError(jSignup, true, data.error);
    }
  }, function () {
    toggleButton(jSignup, true);
    toggleError(jSignup, true, 'Network error.');
  });

  return false;
};
var togglePanels = function togglePanels(classname) {
  if (containerClasses.indexOf(classname) === -1) {
    throw new Error('classname must be one of the following: ' + containerClasses.join(', '));
  }
  containerClasses.forEach(function (v) {
    jContainer.toggleClass(v, v === classname);
  });
};
var toggleError = function toggleError(panelObj, status, message) {
  panelObj.toggleClass('error', status).find('.error-text').text(message || '');
  // if error is shown, then remove it after user inputs something in the form
  if (status) {
    panelObj.find('.note-text').hide();
    panelObj.find(':text,:password').one('keyup change', function () {
      toggleError(panelObj);
    });
  }
};

var signInSubmit = function signInSubmit(event) {
  toggleError(jSignin);
  toggleButton(jSignin, false);

  ajaxes.authenticate(storage.getItem('signInEmail'), jSignin.find('[name="pw"]').val()).then(function () {
    toggleButton(jSignin, true);
    togglePanels('_showSignInSuccess');
  }, function (_ref) {
    var error = _ref.error;

    toggleButton(jSignin, true);

    if (error === 'unauthorized') {
      toggleError(jSignin, true, 'Incorrect password');
    } else if (error === '') {
      toggleError(jSignin, true, 'Network or server error');
    } else {
      togglePanels('_showSignInSuccess');
    }
  });
  event.preventDefault();
  return false;
};

jSignup.on('submit', signUpSubmit);
jSignin.on('submit', signInSubmit);
$('.jShowSignUp').on('click', curry(togglePanels, '_showSignUp'));
$('.forgot__a').attr('href', routes.reset_password_url);

},{"polyfills/Promise":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promisePolyfill = require('promise-polyfill');

var _promisePolyfill2 = _interopRequireDefault(_promisePolyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// To add to window
if (window && !window.Promise) window.Promise = _promisePolyfill2.default;

exports.default = _promisePolyfill2.default;

},{"promise-polyfill":1}]},{},[2]);
