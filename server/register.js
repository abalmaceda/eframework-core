/*TODO: all */
/*
 * register reaction core components as reaction packages
 */

EFrameworkCore.registerPackage = function (packageInfo) {
	let registeredPackage = ReactionRegistry.Packages[packageInfo.name] = packageInfo;
	return registeredPackage;
};

/**
 * @summary
 * @todo Documentar
 */
EFrameworkCore.registerPackage(
{
	label: "Core",
	name: "core",
	icon: "fa fa-th",
	autoEnable: true,
	settings: {
		public: {
			allowGuestCheckout: true
		},
		mail: {
			user: "",
			password: "",
			host: "localhost",
			port: "25"
		},
		openexchangerates: {
			appId: ""
		}
	},
	registry: [
		{
			route: 			"dashboard/shop",
			provides: 		"dashboard",
			label: 			"Core",
			description: 	"E-Commerce Framework Core",
			icon: 			"fa fa-diamond",
			cycle: 			1,
			container: 		"dashboard",
			permissions: [
			{
				label: 		"Dashboard",
				permission: "dashboard"
			}]
		},
		{
			/*TODO: Al parecer es la información del botón "Dashboard" que se encuentra en el dropdown de las opciones del usuario*/
			route: 		"dashboard",
			provides: 	"shortcut",
			label: 		"Dashboard",
			icon: 		"fa fa-th",
			cycle: 		1
		},
		{
			route: 		"dashboard/shop",
			provides: 	"settings",
			label: 		"Shop Settings",
			template: 	"shopSettings",
			//icon: 		"fa fa-cog fa-2x fa-fw",
			icon: 		"fa fa-pencil-square-o fa-2x fa-fw",
			container: 	"dashboard"
		},
		{
			route: 		"dashboard/orders",
			provides: 	"dashboard",
			label: 		"Orders",
			description: "Fulfill your orders",
			icon: 		"fa paperclip",
			//icon: 		"fa fa-sun-o",
			cycle: 		3,
			container: 	"orders"
		},
		{
			/*TODO: Al parecer es la información del botón "Orders" que se encuentra en el dropdown de las opciones del usuario*/
			route: 		"dashboard/orders",
			provides: 	"shortcut",
			label: 		"Orders",
			description: "Fulfill your orders",
			icon: 		"fa paperclip",
			//icon: 		"fa fa-sun-o",
			cycle: 		3
		},
		{
			route: 		"dashboard/orders",
			provides: 	"widget",
			template: 	"coreOrderWidgets"
		},
		{
			/*TODO: Al parecer es la información del botón "Add Product" que se encuentra en el dropdown de las opciones del usuario*/
			route: 		"createProduct",
			provides: 	"shortcut",
			label: 		"Add Product",
			icon: 		"fa fa-plus"
		}
	],
	layout: [
		{
			template: 	"checkoutLogin",
			label: 		"Login",
			workflow: 	"coreCartWorkflow",
			container: 	"checkout-steps-main",
			audience: 	["guest", "anonymous"],
			priority: 	1,
			position: 	"1"
		},
		{
			template: 	"checkoutAddressBook",
			label: 		"Address Details",
			workflow: 	"coreCartWorkflow",
			container: 	"checkout-steps-main",
			audience: 	["guest", "anonymous"],
			priority: 	2,
			position: 	"2"
		},
		{
			template: 	"coreCheckoutShipping",
			label: 		"Shipping Options",
			workflow: 	"coreCartWorkflow",
			container: 	"checkout-steps-main",
			audience: 	["guest", "anonymous"],
			priority: 	3,
			position: 	"3"
		},
		{
			template: 	"checkoutReview",
			label: 		"Review Payment",
			workflow: 	"coreCartWorkflow",
			container: 	"checkout-steps-side",
			audience: 	["guest", "anonymous"],
			priority: 	4,
			position: 	"4"
		},
		{
			template: 	"checkoutPayment",
			label: 		"Complete",
			workflow: 	"coreCartWorkflow",
			container: 	"checkout-steps-side",
			audience: 	["guest", "anonymous"],
			priority: 	5,
			position: 	"5"
		},
		{
			template: 	"coreOrderCreated",
			label: 		"Created",
			workflow: 	"coreOrderWorkflow",
			audience: 	["dashboard/orders"]
		},
		{
			template: 	"coreOrderShipments",
			label: 		"Shipments",
			workflow: 	"coreOrderWorkflow",
			audience: 	["dashboard/orders"]
		},
		{
			template: 	"coreOrderAdjustments",
			label: 		"Adjustments",
			workflow: 	"coreOrderWorkflow",
			audience: 	["dashboard/orders"]
		},
		{
			template: 	"coreProcessPayment",
			label: 		"Payments",
			workflow: 	"coreOrderWorkflow",
			audience: 	["dashboard/orders"]
		},
		{
			template: 	"coreShipmentShipped",
			label: 		"Shipped",
			workflow: 	"coreOrderWorkflow",
			audience: 	["dashboard/orders"]
		},
		{
			template: 	"coreOrderCompleted",
			label: 		"Completed",
			workflow: 	"coreOrderWorkflow",
			audience: 	["dashboard/orders"]
		}
	]
});
