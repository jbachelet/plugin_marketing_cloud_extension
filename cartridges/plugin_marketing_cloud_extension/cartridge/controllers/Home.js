'use strict';

/**
 * This controller includes an example on how to trigger an new email to Salesforce Marketing Cloud.
 * The whole content of the "FakeEntry" controller endpoint can be reused anywhere (from the storefront or a job) as long as the correct cartridges are part of the cartridge path
 */

// Instantiate our middleware and extend the controller
var server = require('server');
server.extend(module.superModule);

// Create a method to override Home-show and render the homepage
server.get('FakeEntry', function (req, res, next) {
    var objectForEmail = {
        order: require('dw/order/OrderMgr').getOrder('ORDER_NUMBER_TO_TEST')
    };
    var emailObj = {
        to: 'jbachelet@salesforce.com',
        subject: 'test order cancellation',
        from: require('dw/system/Site').current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@salesforce.com',
        type: require('*/cartridge/scripts/helpers/emailHelpers').emailTypes.orderCancelled
    };

    require('*/cartridge/scripts/helpers/emailHelpers').sendEmail(emailObj, 'template/to_use', objectForEmail);
});

module.exports = server.exports();
