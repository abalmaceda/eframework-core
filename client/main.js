// /* TODO: all */

/**
 * EFrameworkCore
 * Global reaction shop permissions methods and shop initialization
 */
_.extend(EFrameworkCore, {
	/* TODO: agregar descipcion */
	shopId: null,
	/* TODO: agregar descipcion */
	init: function () {
		let self;
		self = this;
		return Tracker.autorun(function () {
			let domain;
			let shop;
			let shopHandle;
			// keep an eye out for shop change
			shopHandle = Meteor.subscribe("Shops");
			if (shopHandle.ready()) {
				domain = Meteor.absoluteUrl().split("/")[2].split(":")[0];
				shop = EFrameworkCore.Collections.Shops.findOne({
					domains: domain
				});
				self.shopId = shop._id;
				return self;
			}
		});
	},
	/* TODO: agregar descipcion */
	/**
	* hasPermission - Check permisos del cliente
	* @param {String | Array} checkPermissions -String o Array de permisos. Si la variable es empty, defaults "admin, owner"
	* @param {String} checkUserId - userId, defaults Meteor.userId()
	* @param {String} group - default shopId
	* @return {Boolean} Boolean - true si tiene permisos
	*/
	/* TODO : comprender a fondo */
	hasPermission: function (checkPermissions, checkUserId, group) {
		check(checkPermissions, Match.OneOf(String, Array));

		// Utilizar el usuario actual si userId es null
		let userId = checkUserId || this.userId || Meteor.userId();
		let shopId = group || this.getShopId();
		let permissions = [];

		// permissions can be either a string or an array
		// we'll force it into an array so we can add
		// admin roles
		if (!_.isArray(checkPermissions)) {
			permissions = [checkPermissions];
		} else {
			permissions = checkPermissions;
		}
		// if the user has admin, owner permissions we'll always check if those roles are enough
		permissions.push("admin", "owner");
		// check if userIs the Roles
		if (Roles.userIsInRole(userId, permissions, shopId)) {
			return true;
		} else if (Roles.userIsInRole(userId, permissions, Roles.GLOBAL_GROUP)) {
			return true;
		}

		// global roles check
		let sellerShopPermissions = Roles.getGroupsForUser(userId, "admin");
		// we're looking for seller permissions.
		if (sellerShopPermissions) {
		// loop through shops roles and check permissions
		for (let key in sellerShopPermissions) {
			if (key) {
				let shop = sellerShopPermissions[key];
				if (Roles.userIsInRole(checkUserId, permissions, shop)) {
					return true;
				}
			}
		}
		}
		// no specific permissions found returning false
		return false;
	},

	/**
	 * @summary Determina si el usuario actual tiene permisos de propietario
	 * @return {boolean} True si tiene permisos de propietario
	 */
	hasOwnerAccess: function () {
		let ownerPermissions = ["owner"];
		return this.hasPermission(ownerPermissions);
	},

	/**
	 * @summary Determina si el usuario actual es un administrador
	 * @return {boolean} True si tiene permisos de administrador
	 */
	hasAdminAccess: function () {
		let adminPermissions = ["owner", "admin"];
		return this.hasPermission(adminPermissions);
	},
	
	/**
	 * @summary Determina si el usuario actual tiene permisos para acceder al dashboard
	 * @return {boolean} True si tiene permisos de acceso al dashboard
	 */
	hasDashboardAccess: function () {
		let dashboardPermissions = ["owner", "admin", "dashboard"];
		return this.hasPermission(dashboardPermissions);
	},
	/*
	TODO : comentar funcion, Averiguar bien que es this.shopId
	*/
	getShopId: function () {
		return this.shopId;
	},
	/*
	TODO : comentar funcion
	*/
	allowGuestCheckout: function () {
		let allowGuest = true;
		let packageRegistry = EFrameworkCore.Collections.Packages.findOne({
			name: "core",
			shopId: this.shopId
		});
		// we can disable in admin, let's check.
		if (packageRegistry !== undefined) {
			if (packageRegistry.settings) {
				if (packageRegistry.settings.allowGuestCheckout) {
					allowGuest = packageRegistry.settings.allowGuestCheckout;
				}
			}
		}
		return allowGuest;
	},
//   getSellerShopId: function () {
//     return Roles.getGroupsForUser(this.userId, "admin");
//   },

//   /**
//    * @description showActionView
//    *
//    * @param {String} viewData {label, template, data}
//    * @returns {String} Session "admin/showActionView"
//    */
//   showActionView: function (viewData) {
//     Session.set("admin/showActionView", true);
//     EFrameworkCore.setActionView(viewData);
//   },

	/* TODO: entender esta funcion. */
	isActionViewOpen: function () {
		return Session.equals("admin/showActionView", true);
	},

	/* TODO: entender esta funcion. */
	setActionView: function (viewData) {
		if (viewData) {
			Session.set("admin/actionView", viewData);
		} else {
			let registryItem = EFrameworkCore.getRegistryForCurrentRoute(
			"settings");

			if (registryItem) {
				EFrameworkCore.setActionView(registryItem);
			} else {
				EFrameworkCore.setActionView({
					template: "blankControls"
				});
			}
		}
	},

	/* TODO: entender esta funcion. */
	getActionView: function () {
		return Session.get("admin/actionView");
	},

//   hideActionView: function () {
//     Session.set("admin/showActionView", false);
//   },

//   clearActionView: function () {
//     Session.set("admin/actionView", undefined);
//   },

//   getCurrentTag: function () {
//     if (Router.current().route.getName() === "/product/tag") {
//       return Router.current().params._id;
//     }
//   },

/* TODO: entender esta funcion. */
  getRegistryForCurrentRoute: function (provides) {
    let routeName = Router.current().route.getName();
    // find registry entries for routeName
    let reactionApp = EFrameworkCore.Collections.Packages.findOne({
      // "registry.provides": provides,
      "registry.route": routeName
    }, {
      enabled: 1,
      registry: 1,
      name: 1,
      route: 1
    });

    if (reactionApp) {
      let settingsData = _.find(reactionApp.registry, function (item) {
        return item.provides === provides && item.route === routeName;
      });

      return settingsData;
    }

    return null;
  }

});

/*TODO : todo para abajo */

/*
 * configure bunyan logging module for reaction client
 * See: https://github.com/trentm/node-bunyan#levels
 * client we'll cofigure WARN as default
 */
let isDebug = "WARN";

if (Meteor.settings !== undefined) {
  if (Meteor.settings.public) {
    if (Meteor.settings.public.debug) {
      isDebug = Meteor.settings.public.debug;
    }
  }
}

levels = ["FATAL", "ERROR", "WARN", "INFO", "DEBUG", "TRACE"];

if (typeof isDebug !== "boolean" && typeof isDebug !== undefined) {
  isDebug = isDebug.toUpperCase();
}

if (!_.contains(levels, isDebug)) {
  isDebug = "INFO";
}

EFrameworkCore.Log = bunyan.createLogger({
  name: "core-client"
});

EFrameworkCore.Log.level(isDebug);

/*
 * registerLoginHandler
 * method to create anonymous users
 */

Accounts.loginWithAnonymous = function (anonymous, callback) {
  Accounts.callLoginMethod({
    methodArguments: [{
      anonymous: true
    }],
    userCallback: callback
  });
};

/**
 *  Startup Reaction
 *  Init Reaction client
 */

Meteor.startup(function () {
  // warn on insecure exporting of PackageRegistry settings
  if (typeof PackageRegistry !== "undefined" && PackageRegistry !== null) {
    let msg = "PackageRegistry: Insecure export to client.";
    EFrameworkCore.Log.warn(msg, PackageRegistry);
  }
  // init the core
  EFrameworkCore.init();
  // initialize anonymous guest users
  return Deps.autorun(function () {
    if (EFrameworkCore.allowGuestCheckout() && !Meteor.userId()) {
      Accounts.loginWithAnonymous();
    }
  });
});
