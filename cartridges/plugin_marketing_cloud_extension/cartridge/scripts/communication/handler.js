'use strict';

/**
 * @module communication/handler
 */

// handlerID can be any unique identifier
exports.handlerID = module.cartridge;

/**
 * Register communication handler
 * @param {Object} registerHandler
 */
exports.registerHandler = function(registerHandler) {
    registerHandler[this.handlerID] = {
        name: 'Plugin Marketing Cloud Extension',
        id: this.handlerID,
        cartridge: module.cartridge,
        hooks: require('~/hooks.json').hooks
    };
};