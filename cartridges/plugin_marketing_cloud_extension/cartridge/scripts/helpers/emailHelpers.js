'use strict';
var base = module.superModule;

var emailTypes = base.emailTypes;
emailTypes.orderCancelled = 12;

Object.keys(base).forEach(function (prop) {
    // eslint-disable-next-line no-prototype-builtins
    if (!module.exports.hasOwnProperty(prop)) {
        module.exports[prop] = base[prop];
    }
});

module.exports.emailTypes = emailTypes;
