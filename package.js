Package.describe({
	summary: "E-Framework Core",
	name: "eframework:eframework-core",
	version: "0.1.0",
	git: ""
});

Npm.depends({
	/*
	*  Fake text and data generator for Meteor.js
	*/
	"faker": "3.0.1",
 	"node-geocoder": "3.0.0"
});

Package.onUse(function (api) {
	api.versionsFrom("METEOR@1.2");

	// meteor base packages

	/*
	* @summary
	* @see {@link |ATMOSPHERE}
	*/
	api.use("standard-minifiers");

	/*
	* @summary
	* @see {@link |ATMOSPHERE}
	*/
	api.use("mobile-experience");

	/*
	* @summary
	* @see {@link |ATMOSPHERE}
	*/
	api.use("meteor-base");

	/*
	* @summary
	* @see {@link |ATMOSPHERE}
	*/
	api.use("mongo");

	/*
	* @summary Compiler plugin that supports ES2015+ in all .js files
	* This package lets you use new JavaScript language features that are part of the ECMAScript 2015 specification but are not yet supported by all engines or browsers. Unsupported syntax is automatically translated into standard JavaScript that behaves the same way.
	* @see {@link |ATMOSPHERE}
	*/
	api.use("ecmascript");

	/*
	* @summary This package improves ECMAScript 5 compliance in all browers, particularly older browsers, and especially Internet Explorer 8 (and earlier).
	* @see {@link https://atmospherejs.com/meteor/ecmascript|ATMOSPHERE}
	*/
 	api.use("es5-shim");

 	/*
	* @summary
	* @see {@link https://atmospherejs.com/meteor/es5-shim|ATMOSPHERE}
	*/
	api.use("blaze-html-templates");

	/*
	* @summary
	* @see {@link |ATMOSPHERE}
	*/
	api.use("session");

	/*
	* @summary
	* @see {@link |ATMOSPHERE}
	*/
	api.use("jquery");

	/*
	* @summary Dependency tracker to allow reactive callbacks
	* @see {@link https://atmospherejs.com/meteor/tracker|ATMOSPHERE}
	*/
	api.use("tracker");

	// meteor add-on packages

	/*
	* @summary
	* @see {@link |ATMOSPHERE}
	*/
	api.use("underscore");

	/*
	* @summary
	* @see {@link |ATMOSPHERE}
	*/
	api.use("logging");

	/*
	* @summary Reload the page while preserving application state.
	* @see {@link https://atmospherejs.com/meteor/reload|ATMOSPHERE}
	*/
	api.use("reload");

	/*
	* @summary
	* @see {@link |ATMOSPHERE}
	*/
	api.use("random");

	/*
	* @summary
	* @see {@link |ATMOSPHERE}
	*/
	api.use("ejson");

	/*
	* @summary
	* @see {@link |ATMOSPHERE}
	*/
	api.use("check");

	/*
	* @summary
	* @see {@link |ATMOSPHERE}
	*/
	api.use("less");

	/*
	* @summary Make HTTP calls to remote servers
	* @see {@link https://atmospherejs.com/meteor/http|ATMOSPHERE}
	*/
	api.use("http");

	/*
	* @summary
	* @see {@link |ATMOSPHERE}
	*/
	api.use("reactive-var");

	/*
	* @summary
	* @see {@link |ATMOSPHERE}
	*/
	api.use("email");

	/*
	* @summary Configure security policies enforced by the browser
	* @see {@link https://atmospherejs.com/meteor/browser-policy|ATMOSPHERE}
	*/
	api.use("browser-policy");

	/*
	* @summary Manage the configuration for third-party services
	* @see {@link https://atmospherejs.com/meteor/service-configuration|ATMOSPHERE}
	*/
	api.use("service-configuration");



	/*
	* @summary API for Persistent Storage, PubSub and Request
	* @see {@link https://atmospherejs.com/meteor/amplify|ATMOSPHERE}
	*/
	api.use("amplify@1.0.0");

	// meteor authentication packages

	/*
	* @summary Encrypt account secrets stored in the database
	* @see {@link https://atmospherejs.com/meteor/oauth-encryption|ATMOSPHERE}
	*/
	api.use("oauth-encryption");

	/*
	* @summary
	* @see {@link |ATMOSPHERE}
	*/
	api.use("accounts-base");

	/*
	* @summary
	* @see {@link |ATMOSPHERE}
	*/
	api.use("accounts-password");

	// // community packages

	/*
	* @summary
	* @see {@link |ATMOSPHERE}
	*/
api.use("mquandalle:bower@1.5.2");

	/*
	* @summary
	* @see {@link |ATMOSPHERE}
	*/
	// api.use("d3js:d3@3.5.5");

	/*
	* @summary underscore.string (official): String manipulation extensions for Underscore.js javascript library.
	* @see {@link https://atmospherejs.com/underscorestring/underscore.string|ATMOSPHERE}
	*/
	api.use("underscorestring:underscore.string@3.2.2");

	/*
	* @summary AutoForm is a Meteor package that adds UI components and helpers to easily create basic forms with automatic insert and update events, and automatic reactive validation. This package requires and automatically installs the simple-schema package. You can optionally use it with the collection2 package, which you have to add to your app yourself.
	* @see {@link https://atmospherejs.com/aldeed/autoform |ATMOSPHERE}
	*/
	api.use("aldeed:autoform@5.6.0");

	/*
	* @summary  A Meteor package that allows you to attach a schema to a Mongo.Collection. Automatically validates against that schema when inserting and updating from client or server code.
	* @see {@link https://atmospherejs.com/aldeed/collection2|ATMOSPHERE}
	*/
	api.use("aldeed:collection2@2.5.0");

	/*
	* @summary A simple, reactive schema validation package for Meteor. It's used by the Collection2 and AutoForm packages, but you can use it by itself, too.
	* @see {@link https://atmospherejs.com/aldeed/simple-schema|ATMOSPHERE}
	*/
	api.use("aldeed:simple-schema@1.3.3");

	/*
	* @summary Adds template features currently missing from the templating package
	* @see {@link https://atmospherejs.com/aldeed/template-extension|ATMOSPHERE}
	*/
	api.use("aldeed:template-extension@3.4.3", "client");

	/*
	* @summary A router that works on the server and the browser, designed specifically for Meteor
	* @see {@link https://atmospherejs.com/iron/router|ATMOSPHERE}
	*/
	api.use("iron:router@1.0.10");

	/*
	* @summary Generate a slug. Wraps the speakingurl package for Meteor
	* @see {@link https://atmospherejs.com/ongoworks/speakingurl|ATMOSPHERE}
	*/
	api.use("ongoworks:speakingurl@5.0.1");

	/*
	* @summary Implements the Bunyan logging module for Meteor.
	* Bunyan is a simple and fast JSON logging library for node.js services.
	* @see {@link |ATMOSPHERE}
	*/
	api.use("ongoworks:bunyan-logger@2.5.0");

	/*
	* @summary A Meteor package that provides a simple, logical, plain language API for defining write security on your MongoDB collections. Wraps the core allow/deny security.
	* @see {@link https://atmospherejs.com/ongoworks/security|ATMOSPHERE}
	*/
	api.use("ongoworks:security@1.3.0");

	/*
	* @summary A package for creating test data or for generating fixtures.
	* @see {@link |ATMOSPHERE}
	*/
	api.use("dburles:factory@0.3.10");

	/*
	* @summary Extends Mongo.Collection with before/after hooks for insert, update, remove, find, and findOne.
	* @description Works across client, server or a mix. Also works when a client initiates a collection method and the server runs the hook, all while respecting the collection validators (allow/deny).
	* @see {@link https://atmospherejs.com/matb33/collection-hooks|ATMOSPHERE}
	*/
	api.use("matb33:collection-hooks@0.8.1");

	/*
	* @summary Authorization package for Meteor - compatible with built-in accounts package.
	* @see {@link https://atmospherejs.com/alanning/roles |ATMOSPHERE}
	*/
	api.use("alanning:roles@1.2.13");

	/*
	* @summary Moment.js (official): parse, validate, manipulate, and display dates - official Meteor packaging
	* @see {@link https://atmospherejs.com/momentjs/moment|ATMOSPHERE}
	*/
	api.use("momentjs:moment@2.10.6");

	/*
	* @summary Moment Timezone, Timezone support for moment.js, packaged for Meteor. Currently includes all timezone data files.
	* @see {@link https://atmospherejs.com/risul/moment-timezone|ATMOSPHERE}
	*/
	// api.use("risul:moment-timezone@0.4.0");

	/*
	* @summary A Meteor package wrapper for Spin.js via Npm.depends().
	* @see {@link https://atmospherejs.com/utilities/spin|ATMOSPHERE}
	*/
	api.use("utilities:spin@2.3.1", "client");

	/*
	* @summary Consolidated Avatar Template Package for Meteor
	* @see {@link https://atmospherejs.com/utilities/avatar|ATMOSPHERE}
	*/
	api.use("utilities:avatar@0.9.2");


	/*
	* @summary Filesystem for Meteor, collectionFS
	* @description This packege serves as a wrapper for several other packages and has no functionality in itself:
	* @see {@link https://atmospherejs.com/cfs/standard-packages|ATMOSPHERE}
	*/
	api.use("cfs:standard-packages@0.5.9");

	/*
	* @summary
	* @see {@link |ATMOSPHERE}
	*/
	api.use("cfs:storage-adapter@0.2.2");

	/*
	* @summary his package simply adds gm to scope, but it also tests the environment and automatically uses graphicsmagick or imagemagick if available. This makes debugging much easier.
	* @see {@link https://atmospherejs.com/cfs/graphicsmagick |ATMOSPHERE}
	*/
	api.use("cfs:graphicsmagick@0.0.18");

	/*
	* @summary A Meteor package that adds GridFS file storage for CollectionFS. When you use this storage adapter, file data is stored in chunks in your MongoDB database.
	* @see {@link https://atmospherejs.com/cfs/gridfs|ATMOSPHERE}
	*/
	api.use("cfs:gridfs@0.0.33");

	/*
	* @summary Filesystem storage adapter for CollectionFS
	* @description A Meteor package that adds local server filesystem storage for CollectionFS. When you use this storage adapter, file data is stored in a directory of your choosing on the same server on which your Meteor app is running.
	* @see {@link https://atmospherejs.com/cfs/filesystem|ATMOSPHERE}
	*/
	api.use("cfs:filesystem@0.1.2");

	/*
	* @summary Provides additional UI helpers for CollectionFS. Requires Meteor 0.8.0 or higher.
	* @see {@link https://atmospherejs.com/cfs/ui|ATMOSPHERE}
	*/
	api.use("cfs:ui@0.1.3");

	/*
	* @summary Add dropped event to Meteor UI Templates
	* @see {@link https://atmospherejs.com/raix/ui-dropped-event|ATMOSPHERE}
	*/
	api.use("raix:ui-dropped-event@0.0.7");

	/*
	* @summary Server Side Rendering for Meteor with Blaze
	* @see {@link https://atmospherejs.com/meteorhacks/ssr|ATMOSPHERE}
	*/
	// api.use("meteorhacks:ssr@2.1.2");

	/*
	* @summary
	* @see {@link |ATMOSPHERE}
	*/
	// api.use("aslagle:reactive-table@0.8.12");

	// // imply exports package vars
	api.imply("less");
	api.imply("amplify");
	api.imply("accounts-base");
	api.imply("ecmascript");
	api.imply("es5-shim");
	api.imply("browser-policy");
	api.imply("service-configuration");


	api.imply("ongoworks:speakingurl");


	api.imply("ongoworks:security");
	 api.imply("dburles:factory");
	api.imply("mquandalle:bower");
	api.imply("aldeed:collection2");
	api.imply("aldeed:simple-schema");
	api.imply("aldeed:autoform");
	api.imply("aldeed:template-extension");
api.imply("iron:router");
	// api.imply("cfs:graphicsmagick");
	// api.imply("cfs:filesystem");
	// api.imply("cfs:gridfs");
	// api.imply("raix:ui-dropped-event");
api.imply("matb33:collection-hooks");
	api.imply("alanning:roles");
	// api.imply("momentjs:moment");

	api.imply("utilities:spin", ["client"]);


		api.imply("utilities:avatar");

	// reaction core dependencies
	api.addFiles("lib/bower.json", "client");
	api.addFiles("lib/bower/jquery.ui/ui/core.js", "client");
	api.addFiles("lib/bower/jquery.ui/ui/widget.js", "client");
	api.addFiles("lib/bower/jquery.ui/ui/mouse.js", "client");
	api.addFiles("lib/bower/jquery.ui/ui/position.js", "client");
	api.addFiles("lib/bower/jquery.ui/ui/autocomplete.js", "client");
	api.addFiles("lib/bower/jquery.ui/ui/sortable.js", "client");
	api.addFiles("lib/bower/jquery.ui/ui/draggable.js", "client");
	api.addFiles("lib/bower/jquery.ui/ui/droppable.js", "client");
	api.addFiles("lib/bower/jquery.ui/ui/effect.js", "client");
	api.addFiles("lib/bower/jquery.ui/ui/effect-slide.js", "client");
	api.addFiles("lib/bower/jquery.ui/ui/menu.js", "client");
	api.addFiles("lib/bower/autosize/dist/autosize.js", "client");
	api.addFiles("lib/bower/openexchangerates.accounting/accounting.min.js", "client");
	api.addFiles("lib/bower/openexchangerates.money/money.js", "client");
	api.addFiles("lib/bower/jquery.tagsinput/dist/jquery.tagsinput.min.css", "client");
	api.addFiles("lib/css/jquery-ui.css", "client");
	api.addFiles("lib/faker.js", ["server"]);
	api.addFiles("lib/geocoder.js", ["server"]);

	// exports
	api.addFiles("common/global.js");

		// init reaction core

		//TODO : all
	api.addFiles("client/main.js", "client");

	//TODO : all
	api.addFiles("server/main.js", "server");
api.addFiles("server/register.js", "server");
	api.addFiles("common/common.js");

	// Private fixture data
	api.addAssets("private/data/Products.json", "server");
	api.addAssets("private/data/Shops.json", "server");
	api.addAssets("private/data/Tags.json", "server");

	// // i18n translations
	//TODO : Eliminar los lenguajes que no voy a usar ( solo usare español e ingles )
	api.addAssets("private/data/i18n/ar.json", "server");
	api.addAssets("private/data/i18n/cn.json", "server");
	api.addAssets("private/data/i18n/cs.json", "server");
	api.addAssets("private/data/i18n/de.json", "server");
	api.addAssets("private/data/i18n/en.json", "server");
	api.addAssets("private/data/i18n/el.json", "server");
	api.addAssets("private/data/i18n/es.json", "server");
	api.addAssets("private/data/i18n/fr.json", "server");
	api.addAssets("private/data/i18n/he.json", "server");
	api.addAssets("private/data/i18n/hr.json", "server");
	api.addAssets("private/data/i18n/hu.json", "server");
	api.addAssets("private/data/i18n/it.json", "server");
	api.addAssets("private/data/i18n/my.json", "server");
	api.addAssets("private/data/i18n/nl.json", "server");
	api.addAssets("private/data/i18n/pl.json", "server");
	api.addAssets("private/data/i18n/pt.json", "server");
	api.addAssets("private/data/i18n/ru.json", "server");
	api.addAssets("private/data/i18n/sl.json", "server");
	api.addAssets("private/data/i18n/sv.json", "server");
	api.addAssets("private/data/i18n/vi.json", "server");

	// import fixture data
	api.addFiles("server/fixtures.js", "server");

	// schemas
	api.addFiles("common/schemas/address.js");
	api.addFiles("common/schemas/layouts.js");
 api.addFiles("common/schemas/packages.js");

		//TODO: revizar
	api.addFiles("common/schemas/shops.js");
	api.addFiles("common/schemas/payments.js");
	api.addFiles("common/schemas/shipping.js");
	// api.addFiles("common/schemas/taxes.js");
	// api.addFiles("common/schemas/discounts.js");

	//TODO: revizar
	api.addFiles("common/schemas/products.js");

	//TODO: revizar
	api.addFiles("common/schemas/tags.js");
		api.addFiles("common/schemas/cart.js");
	api.addFiles("common/schemas/orders.js");

		//TODO: revizar
	api.addFiles("common/schemas/translations.js");

	// collections
	api.addFiles("common/collections/collections.js");
	api.addFiles("common/collections/collectionFS.js");

	// collection hooks
	api.addFiles("common/collections/hooks/hooks.js");

	// // security
	api.addFiles("server/browserPolicy.js", "server");
	api.addFiles("server/security.js", "server");

	// common
	//TODO: revizar
	api.addFiles("common/router.js");
	//TODO: revizar
	// api.addFiles("common/methods/layout.js");
	api.addFiles("common/methods/workflow.js");
	api.addFiles("common/methods/cart.js", "client");

		//TODO: revizar
		api.addFiles("common/factories/faker.js");
		//TODO: revizar
	api.addFiles("common/factories/users.js");
	//TODO: revizar
	api.addFiles("common/factories/shops.js");
	//TODO: revizar
	api.addFiles("common/factories/products.js");
	//TODO: revizar
	api.addFiles("common/factories/cart.js");
	//TODO: revizar
	api.addFiles("common/factories/orders.js");

	// // publications
	api.addFiles("server/publications/sessions.js", "server");
	api.addFiles("server/publications/shops.js", "server");
	api.addFiles("server/publications/cart.js", "server");
	api.addFiles("server/publications/media.js", "server");
	api.addFiles("server/publications/orders.js", "server");
	api.addFiles("server/publications/packages.js", "server");
	api.addFiles("server/publications/products.js", "server");
	api.addFiles("server/publications/translations.js", "server");

	// // methods
	api.addFiles("server/methods/cart.js", "server");
	api.addFiles("server/methods/orders.js", "server");
	api.addFiles("server/methods/products.js", "server");
	api.addFiles("server/methods/shipping.js", "server");
	api.addFiles("server/methods/shop.js", "server");

	// // method hooks
	api.addFiles("server/methods/hooks/hooks.js");
	api.addFiles("server/methods/hooks/cart.js", "server");

	// client
	api.addFiles("client/subscriptions.js", "client");
	api.addFiles("client/helpers/layout.js", "client");
api.addFiles("client/helpers/packages.js", "client");
	api.addFiles("client/helpers/cart.js", "client");
api.addFiles("client/helpers/globals.js", "client");
api.addFiles("client/helpers/products.js", "client");
api.addFiles("client/helpers/i18n.js", "client");
api.addFiles("client/helpers/metadata.js", "client");
 api.addFiles("client/helpers/permissions.js", "client");
	api.addFiles("client/helpers/utilities.js", "client");

api.addFiles("client/templates/layout/layout.html", "client");
api.addFiles("client/templates/layout/layout.js", "client");

	api.addFiles("client/templates/layout/header/header.html", "client");
	api.addFiles("client/templates/layout/header/header.js", "client");

	api.addFiles("client/templates/layout/header/tags/tags.html", "client");
	api.addFiles("client/templates/layout/header/tags/tags.js", "client");

	api.addFiles("client/templates/layout/header/i18n/i18n.html", "client");
	api.addFiles("client/templates/layout/header/i18n/i18n.js", "client");

	api.addFiles("client/templates/layout/header/brand/brand.html", "client");

	api.addFiles("client/templates/layout/footer/footer.html", "client");

	api.addFiles("client/templates/layout/alerts/bootstrapAlerts.js", "client");
	api.addFiles("client/templates/layout/alerts/alerts.html", "client");
	api.addFiles("client/templates/layout/alerts/alerts.js", "client");

	api.addFiles("client/templates/layout/loading/loading.html", "client");
	api.addFiles("client/templates/layout/notFound/notFound.html", "client");

	api.addFiles("client/templates/layout/notice/unauthorized.html", "client");
	api.addFiles("client/templates/layout/notice/shopNotFound.html", "client");

	api.addFiles("client/templates/cart/cartDrawer/cartDrawer.html", "client");
	api.addFiles("client/templates/cart/cartDrawer/cartDrawer.js", "client");

	api.addFiles("client/templates/cart/cartDrawer/cartDrawerItems/cartDrawerItems.html", "client");
	api.addFiles("client/templates/cart/cartDrawer/cartDrawerItems/cartDrawerItems.js", "client");

	api.addFiles("client/templates/cart/cartDrawer/cartSubTotals/cartSubTotals.html", "client");
	api.addFiles("client/templates/cart/cartDrawer/cartSubTotals/cartSubTotals.js", "client");

	api.addFiles("client/templates/cart/cartIcon/cartIcon.html", "client");
	api.addFiles("client/templates/cart/cartIcon/cartIcon.js", "client");

	api.addFiles("client/templates/cart/cartPanel/cartPanel.html", "client");
	api.addFiles("client/templates/cart/cartPanel/cartPanel.js", "client");

	api.addFiles("client/templates/checkout/checkout.html", "client");
	api.addFiles("client/templates/checkout/checkout.js", "client");

	api.addFiles("client/templates/checkout/checkoutHeader/checkoutHeader.html", "client");

	// api.addFiles("client/templates/checkout/login/login.html", "client");
	// api.addFiles("client/templates/checkout/login/login.js", "client");

	api.addFiles("client/templates/checkout/checkoutProgressBar/checkoutProgressBar.html", "client");
	api.addFiles("client/templates/checkout/checkoutProgressBar/checkoutProgressBar.js", "client");

	api.addFiles("client/templates/checkout/review/review.html", "client");
	api.addFiles("client/templates/checkout/review/review.js", "client");

	api.addFiles("client/templates/checkout/payment/payment.html", "client");
	api.addFiles("client/templates/checkout/payment/methods/cards.html", "client");
	api.addFiles("client/templates/checkout/payment/methods/cards.js", "client");

	api.addFiles("client/templates/checkout/completed/completed.html", "client");
	api.addFiles("client/templates/checkout/completed/completed.js", "client");

	api.addFiles("client/templates/checkout/shipping/shipping.html", "client");
	api.addFiles("client/templates/checkout/shipping/shipping.js", "client");

	api.addFiles("client/templates/checkout/addressBook/addressBook.html", "client");
	api.addFiles("client/templates/checkout/addressBook/addressBook.js", "client");

	// api.addFiles("client/templates/dashboard/console/console.html", "client");
	// api.addFiles("client/templates/dashboard/console/console.js", "client");

	// api.addFiles("client/templates/dashboard/console/icon/icon.html", "client");
	// api.addFiles("client/templates/dashboard/console/icon/icon.js", "client");

	api.addFiles("client/templates/dashboard/orders/orders.html", "client");
	api.addFiles("client/templates/dashboard/orders/orders.js", "client");

	// api.addFiles("client/templates/dashboard/orders/orderPage/orderPage.html", "client");
	// api.addFiles("client/templates/dashboard/orders/orderPage/orderPage.js", "client");

	// api.addFiles("client/templates/dashboard/orders/orderPage/details/details.html", "client");
	// api.addFiles("client/templates/dashboard/orders/orderPage/details/details.js", "client");

	api.addFiles("client/templates/dashboard/orders/list/ordersList.html", "client");
	api.addFiles("client/templates/dashboard/orders/list/ordersList.js", "client");

	api.addFiles("client/templates/dashboard/orders/list/items/items.html", "client");
	api.addFiles("client/templates/dashboard/orders/list/items/items.js", "client");

	api.addFiles("client/templates/dashboard/orders/list/summary/summary.html", "client");
	api.addFiles("client/templates/dashboard/orders/list/summary/summary.js", "client");

	// api.addFiles("client/templates/dashboard/orders/list/pdf/pdf.html", "client");
	// api.addFiles("client/templates/dashboard/orders/list/pdf/pdf.js", "client");

	// api.addFiles("client/templates/dashboard/orders/widget/widget.html", "client");
	// api.addFiles("client/templates/dashboard/orders/widget/widget.js", "client");

	api.addFiles("client/templates/dashboard/orders/details/detail.html", "client");
	api.addFiles("client/templates/dashboard/orders/details/detail.js", "client");

	// api.addFiles("client/templates/dashboard/orders/social/orderSocial.html", "client");

	// api.addFiles("client/templates/dashboard/orders/workflow/workflow.html", "client");
	// api.addFiles("client/templates/dashboard/orders/workflow/workflow.js", "client");

	// api.addFiles("client/templates/dashboard/orders/workflow/adjustments/adjustments.html", "client");
	// api.addFiles("client/templates/dashboard/orders/workflow/adjustments/adjustments.js", "client");

	// api.addFiles("client/templates/dashboard/orders/workflow/created/created.html", "client");
	// api.addFiles("client/templates/dashboard/orders/workflow/created/created.js", "client");

	// api.addFiles("client/templates/dashboard/orders/workflow/completed/completed.html", "client");

	// api.addFiles("client/templates/dashboard/orders/workflow/documents/documents.html", "client");
	// api.addFiles("client/templates/dashboard/orders/workflow/documents/documents.js", "client");

	// api.addFiles("client/templates/dashboard/orders/workflow/packing/packing.html", "client");
	// api.addFiles("client/templates/dashboard/orders/workflow/packing/packing.js", "client");

	// api.addFiles("client/templates/dashboard/orders/workflow/payment/payment.html", "client");
	// api.addFiles("client/templates/dashboard/orders/workflow/payment/payment.js", "client");

	// api.addFiles("client/templates/dashboard/orders/workflow/shipped/shipped.html", "client");
	// api.addFiles("client/templates/dashboard/orders/workflow/shipped/shipped.js", "client");

	// api.addFiles("client/templates/dashboard/orders/workflow/shipments/shipments.html", "client");
	// api.addFiles("client/templates/dashboard/orders/workflow/shipments/shipments.js", "client");

	// api.addFiles("client/templates/dashboard/orders/workflow/tracking/tracking.html", "client");
	// api.addFiles("client/templates/dashboard/orders/workflow/tracking/tracking.js", "client");

	api.addFiles("client/templates/dashboard/packages/packages.html", "client");

	api.addFiles("client/templates/dashboard/packages/grid/package/package.html", "client");
	api.addFiles("client/templates/dashboard/packages/grid/package/package.js", "client");

	api.addFiles("client/templates/dashboard/packages/grid/grid.html", "client");
	api.addFiles("client/templates/dashboard/packages/grid/grid.js", "client");

	api.addFiles("client/templates/dashboard/dashboard.html", "client");
	api.addFiles("client/templates/dashboard/dashboard.js", "client");

	api.addFiles("client/templates/dashboard/settings/settings.html", "client");
	api.addFiles("client/templates/dashboard/settings/settings.js", "client");

	api.addFiles("client/templates/dashboard/shop/settings/settings.html", "client");
	api.addFiles("client/templates/dashboard/shop/settings/settings.js", "client");

	// Product Templates
	api.addFiles("client/templates/products/products.html", "client");
	api.addFiles("client/templates/products/products.js", "client");

	// api.addFiles("client/templates/products/productList/productList.html", "client");
	// api.addFiles("client/templates/products/productList/productList.js", "client");

	api.addFiles("client/templates/products/productGrid/productGrid.html", "client");
	api.addFiles("client/templates/products/productGrid/productGrid.js", "client");

	api.addFiles("client/templates/products/productDetail/productDetail.html", "client");
	api.addFiles("client/templates/products/productDetail/productDetail.js", "client");

	api.addFiles("client/templates/products/productDetail/edit/edit.html", "client");
	api.addFiles("client/templates/products/productDetail/edit/edit.js", "client");

	api.addFiles("client/templates/products/productDetail/images/productImageGallery.html", "client");
	api.addFiles("client/templates/products/productDetail/images/productImageGallery.js", "client");

	api.addFiles("client/templates/products/productDetail/tags/tags.html", "client");
	api.addFiles("client/templates/products/productDetail/tags/tags.js", "client");

	// api.addFiles("client/templates/products/productDetail/social/social.html", "client");
	// api.addFiles("client/templates/products/productDetail/social/social.js", "client");

	api.addFiles("client/templates/products/productDetail/variants/variant.html", "client");
	api.addFiles("client/templates/products/productDetail/variants/variant.js", "client");

	api.addFiles("client/templates/products/productDetail/variants/variantList/variantList.html", "client");
	api.addFiles("client/templates/products/productDetail/variants/variantList/variantList.js", "client");

	api.addFiles("client/templates/products/productDetail/variants/variantForm/variantForm.html", "client");
	api.addFiles("client/templates/products/productDetail/variants/variantForm/variantForm.js", "client");

	api.addFiles("client/templates/products/productDetail/variants/variantForm/inventoryVariant/inventoryVariant.html", "client");
	api.addFiles("client/templates/products/productDetail/variants/variantForm/inventoryVariant/inventoryVariant.js", "client");

	api.addFiles("client/templates/products/productDetail/variants/variantForm/childVariant/childVariant.html", "client");
	api.addFiles("client/templates/products/productDetail/variants/variantForm/childVariant/childVariant.js", "client");

	api.addFiles("client/templates/products/productDetail/attributes/attributes.html", "client");
	api.addFiles("client/templates/products/productDetail/attributes/attributes.js", "client");

	api.addFiles("client/templates/products/productSettings/productSettings.html", "client");
	api.addFiles("client/templates/products/productSettings/productSettings.js", "client");

	// // Exports
	api.export("EFrameworkCore");
	api.export("ReactionRegistry", "server");
	api.export("faker", ["server"]); // for testing only?

	// legacy Exports (TODO: move to EFrameworkCore)
	api.export("Alerts", ["client"]);
	api.export("currentProduct", ["client", "server"]);
});


Package.onTest(function (api) {
	// api.use("sanjo:jasmine@0.20.1");
	// api.use("underscore");
	// api.use("dburles:factory@0.3.10");
	// api.use("velocity:html-reporter@0.9.0");
	// api.use("velocity:console-reporter@0.1.3");

	// api.use("eframework:eframework-core");
	// api.use("eframework:eframework-bootstrap-theme");

	// api.addFiles("tests/jasmine/server/integration/shops.js", "server");
	// api.addFiles("tests/jasmine/server/integration/accounts.js", "server");
	// api.addFiles("tests/jasmine/server/integration/methods.js", "server");
	// api.addFiles("tests/jasmine/server/integration/products.js", "server");
	// api.addFiles("tests/jasmine/server/integration/publications.js", "server");
});
