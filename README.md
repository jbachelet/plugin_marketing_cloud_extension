# plugin_marketing_cloud_extension: Storefront Reference Architecture (SFRA) extension for the SFCC-SFMC connector

This is the repository for the plugin_marketing_cloud_extension plugin. This plugin shows how to extend the [SFCC-SFMC official connector](https://github.com/SalesforceCommerceCloud/marketing-cloud-connector) without editing the code of the connector.

This plugin show how to:
- Send transactional emails from Salesforce B2C Commerce to Salesforce Marketing Cloud that does not exists in the official connector (i.e. order cancellation)
- Export data from Salesforce B2C Commerce to Salesforce Marketing Cloud that is not part of the actual scope of data synchronization the connector provides

# Getting Started

1. Clone this repository. (The name of the top-level folder is plugin_marketing_cloud_extension.)
2. Upload the cartridge on your instance
3. Include the plugin_marketing_cloud_extension cartridge in the cartridge path of your site
4. Follow the instructions frow the How-To section bellow

---
Note that this cartridge contains:
- a new order cancellation email trigger
- an example of data synchronization, by exporting coupon codes
---

# How-to implement yourself

## Trigger new emails

Here is a summary of all the steps that you need to perform in order to trigger an new email and leverage the connector:

1. Add the required configuration to the CommunicationHandlers > {instanceName} custom object > “Handler Configuration JSON” attribute (note: for sandboxes, instanceName is “development“)
This cartridge needs the following configuration:
```json
{
    // This is the added piece
	"plugin_marketing_cloud_extension": {
		"name": "Plugin Marketing Cloud Extension",
		"id": "plugin_marketing_cloud_extension",
		"cartridge": "plugin_marketing_cloud_extension",
		// Register in the hooks array any new hook that you will need to trigger. Basically one hook is associated to one interaction, so one email
		// This example introduces a new "order cancellation" email
		"hooks": [{
			"name": "app.communication.order.cancelled",
			"script": "~/cartridge/scripts/communication/order",
			"enabled": true
		}],
		"enabled": true
	},
	// End of the added piece
	"int_marketing_cloud": {
		"name": "Marketing Cloud Connector",
		"id": "int_marketing_cloud",
		"cartridge": "int_marketing_cloud",
		"hooks": [{
				"name": "app.communication.account.created",
				"script": "~/cartridge/scripts/communication/account",
				"enabled": true
			},
			{
				"name": "app.communication.account.updated",
				"script": "~/cartridge/scripts/communication/account",
				"enabled": true
			},
			{
				"name": "app.communication.account.passwordChanged",
				"script": "~/cartridge/scripts/communication/account",
				"enabled": true
			},
			{
				"name": "app.communication.account.passwordReset",
				"script": "~/cartridge/scripts/communication/account",
				"enabled": true
			},
			{
				"name": "app.communication.account.lockedOut",
				"script": "~/cartridge/scripts/communication/account",
				"enabled": true
			},
			{
				"name": "app.communication.customerService.contactUs",
				"script": "~/cartridge/scripts/communication/customerService",
				"enabled": true
			},
			{
				"name": "app.communication.giftCertificate.sendCertificate",
				"script": "~/cartridge/scripts/communication/giftCertificate",
				"enabled": true
			},
			{
				"name": "app.communication.order.confirmation",
				"script": "~/cartridge/scripts/communication/order",
				"enabled": true
			},
			{
				"name": "app.communication.oms.invoiceProcessed",
				"script": "~/cartridge/scripts/communication/oms",
				"enabled": false
			},
			{
				"name": "app.communication.oms.returnOrderCreated",
				"script": "~/cartridge/scripts/communication/oms",
				"enabled": false
			},
			{
				"name": "app.communication.oms.shipment",
				"script": "~/cartridge/scripts/communication/oms",
				"enabled": false
			}
		],
		"enabled": true
	},
	"standard_email": {
		"name": "Standard email",
		"cartridge": "int_handlerframework",
		"id": "standard_email",
		"hooks": [{
				"name": "app.communication.account.created",
				"script": "~/cartridge/scripts/communication/account",
				"enabled": false
			},
			{
				"name": "app.communication.account.updated",
				"script": "~/cartridge/scripts/communication/account",
				"enabled": false
			},
			{
				"name": "app.communication.account.passwordChanged",
				"script": "~/cartridge/scripts/communication/account",
				"enabled": false
			},
			{
				"name": "app.communication.account.passwordReset",
				"script": "~/cartridge/scripts/communication/account",
				"enabled": false
			},
			{
				"name": "app.communication.account.lockedOut",
				"script": "~/cartridge/scripts/communication/account",
				"enabled": false
			},
			{
				"name": "app.communication.customerService.contactUs",
				"script": "~/cartridge/scripts/communication/customerService",
				"enabled": false
			},
			{
				"name": "app.communication.giftCertificate.sendCertificate",
				"script": "~/cartridge/scripts/communication/giftCertificate",
				"enabled": false
			},
			{
				"name": "app.communication.order.confirmation",
				"script": "~/cartridge/scripts/communication/order",
				"enabled": false
			}
		],
		"enabled": false
	}
}
```
2. Create a new custom object to the MarketingCloudTriggers custom object with the data mapping that you’ll need to use within the email
This cartridge needs the following configuration:
![Screenshot of the configuration](https://github.com/jbachelet/plugin_marketing_cloud_extension/raw/master/readme.app.communication.order.cancelled.screenshot.png "Screenshot of the configuration")
3. Add the required hooks in the newly created cartridge, that matches your new email triggers. Please follow what has been done for the `app.communication.order.cancelled` hook in the `/hooks.json` file.
4. Implement the trigger to send the email
Please follow what has been done for the `app.communication.order.cancelled` hook in the `/cartridge/scripts/communication/order.js` file and the `/cartridge/scripts/hookProxy/emailProxy.js` file and the `/cartridge/scripts/helpers/emailHelpers.js` file.

## New data sync

1. Create a new custom object to the MarketinDataExport custom object with the data mapping that you’ll need to use within the export
This cartridge needs the following configuration:
![Screenshot of the configuration](https://github.com/jbachelet/plugin_marketing_cloud_extension/raw/master/readme.couponCodes.screenshot.png "Screenshot of the configuration")
2. Create a new job step that will export the data by reusing the underlying connector to grad the mapping configured