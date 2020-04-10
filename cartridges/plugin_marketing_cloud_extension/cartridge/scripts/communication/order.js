'use strict';

/**
 * @module communication/account
 */
var URLUtils = require('dw/web/URLUtils');

var hookPath = 'app.communication.order.';

/**
 * Trigger order cancelled notification
 * @param {SynchronousPromise} promise
 * @param {module:communication/util/trigger~CustomerNotification} data
 * @returns {SynchronousPromise}
 */
function cancelled(promise, data) {
    data.Order = data.Order || data.order || data.params.order || data.params.Order;
    data.AccountHomeLink = URLUtils.https('Account-Show');

    return require('*/cartridge/scripts/communication/util/send').sendTrigger(hookPath + 'cancelled', promise, data);
}

module.exports = require('dw/system/HookMgr').callHook(
    'app.communication.handler.initialize',
    'initialize',
    require('./handler').handlerID,
    'app.communication.order',
    {
        cancelled: cancelled
    }
);