'use strict';

/**
 * @type {dw.system.HookMgr}
 */
var HookMgr = require('dw/system/HookMgr');

/**
 * @type {dw.system.Status}
 */
var Status = require('dw/system/Status');

/**
 * @type {dw.system.Logger}
 */
var Logger = require('dw/system/Logger');

/**
 * @type {SynchronousPromise}
 */
var SynchronousPromise = require('synchronous-promise');

var base = module.superModule;

/**
 * Hook proxy to be used with MC Email Connector send action
 * @param {Object} emailObj Generic Email Object with Type, this is passed in from SFRA base classes
 * Examples can be
 *    emailObj.to,emailObj.subject,emailObj.from,emailObj.type.
 *  emailObj.type example emailHelpers.emailTypes.registration
 * @param {string} template Template name
 * @param {Object} context Contains the actual customer context.
 * @returns {dw.system.Status}
 */
function sendEmail(emailObj, template, context) {
    var result = base.sendEmail(emailObj, template, context);
    // If the base returns a non-undefined value, this means that the base method already triggered the hook
    // So abort this execution because it was related to already implemented hooks
    if (!empty(result)) {
        return result;
    }

    var params = new (require('dw/util/HashMap'))();
    var emailTypes = require('*/cartridge/scripts/helpers/emailHelpers').emailTypes;
    var emailData = {};

    // Pass all provided context forward as params
    for (var p in context) {
        params[p] = context[p];
    }

    params.put('CurrentForms', session && session.forms);
    params.put('CurrentHttpParameterMap', request && request.httpParameterMap);
    params.put('CurrentCustomer', customer);

    emailData.toEmail = emailObj.to;
    emailData.fromEmail = emailObj.from;

    var hookPath = 'app.communication.';
    var hookID = hookPath;

    if (emailObj) {
        switch(emailObj.type) {
            case emailTypes.orderCancelled:
                hookID += 'order.cancelled';
                break;
            default:
                Logger.warn('Mail send hook called, but correct action undetermined, mail not sent as a result.');
                break;
        }
    }

    emailData.params = params;

    if (hookID !== hookPath && HookMgr.hasHook(hookID)) {
        var promise = SynchronousPromise.unresolved()
            .then(function (data) {
                result = data;
            })
            .catch(function (data) {
                result = data;
            });

        HookMgr.callHook(
            hookID,
            hookID.slice(hookID.lastIndexOf('.') + 1),
            promise,
            emailData
        );

        var success = result && (result.status === 'OK');
        return new Status(success ? Status.OK : Status.ERROR);
    }
}

exports.sendEmail = sendEmail;
