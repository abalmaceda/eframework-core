/* TODO : all */

/**
 * Application Startup
 * EFrameworkCore Server Configuration
 */

/**
 * configure bunyan logging module for reaction server
 * See: https://github.com/trentm/node-bunyan#levels
 */

let isDebug = Meteor.settings.isDebug || process.env.REACTION_DEBUG || "INFO";
let levels = ["FATAL", "ERROR", "WARN", "INFO", "DEBUG", "TRACE"];
let mode = process.env.NODE_ENV || "production";

if (isDebug === true || mode === "development" && isDebug !== false) {
  if (typeof isDebug !== "boolean" && typeof isDebug !== undefined) {
    isDebug = isDebug.toUpperCase();
  }
  if (!_.contains(levels, isDebug)) {
    isDebug = "WARN";
  }
}

if (process.env.VELOCITY_CI === "1") {
  formatOut = process.stdout;
} else {
  formatOut = logger.format({
    outputMode: "short",
    levelInString: false
  });
}

EFrameworkCore.Log = logger.bunyan.createLogger({
  name: "core",
  stream: isDebug !== "DEBUG" ? formatOut : process.stdout,
  level: "debug"
});

// Establecer logging level
EFrameworkCore.Log.level(isDebug);

/**
 * Metodos EFrameworkCore (server)
 */
_.extend(EFrameworkCore, {
	/* TODO : funcion */
	init: function () {
		try {
			ReactionRegistry.loadFixtures();
		} catch (error) {
			EFrameworkCore.Log.error("loadFixtures: ", error.message);
		}
		return true;
	},

  getCurrentShopCursor: function (client) {
    let domain = this.getDomain(client);
    let cursor = EFrameworkCore.Collections.Shops.find({
      domains: domain
    }, {
      limit: 1
    });
    if (!cursor.count()) {
      EFrameworkCore.Log.debug("Add a domain entry to shops for ",
        domain);
    }
    return cursor;
  },
  	/* TODO : descripcion */
	getCurrentShop: function (client) {
		let cursor = this.getCurrentShopCursor(client);
		return cursor.fetch()[0];
	},

  	/* TODO : descripcion */
	/**
	* getShopId - 
	* @param {String} client - 
	* @return {String} String - Id de la shop para el client 
	*/
	getShopId: function (client) {
		if (this.getCurrentShop(client)) {
			return this.getCurrentShop(client)._id;
		}
	},
  getDomain: function () {
    return Meteor.absoluteUrl().split("/")[2].split(":")[0];
  },

  /* TODO: verificar bien esta funcion */
  /**
   * hasPermission - Revision de permisos en el servidor
   * @param {String | Array} checkPermissions -String or Array of permissions if empty, defaults to "admin, owner"
   * @param {String} checkUserId - userId, defaults to Meteor.userId()
   * @param {String} group - default to shopId
   * @return {Boolean} Boolean - true si tiene permisos
   */
  hasPermission: function (checkPermissions, checkUserId, group) {
    check(checkPermissions, Match.OneOf(String, Array));
    // console.log("hasPermission", checkPermissions, userId, group)
    // console.log("userId", userId, this.userId, Meteor.userId())
    // use current user if userId if not provided
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
   
    /* Aunque se tenga permisos "admin" , "owner" se verifica siempre si estos roles son suficientes */
    permissions.push("admin", "owner");
    // check if userIs the Roles
    if (Roles.userIsInRole(userId, permissions, shopId)) {
      return true;
    } else if (Roles.userIsInRole(userId,
        permissions,
        Roles.GLOBAL_GROUP
      )) {
      return true;
    }

    // global roles check
    let sellerShopPermissions = Roles.getGroupsForUser(userId, "admin");
    // we're looking for seller permissions.
    if (sellerShopPermissions) {
      // loop through shops roles and check permissions
      for (let key in sellerShopPermissions) {
        if ({}.hasOwnProperty.call(sellerShopPermissions, key)) {
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
  hasOwnerAccess: function () {
    let ownerPermissions = ["owner"];
    return this.hasPermission(ownerPermissions);
  },
  hasAdminAccess: function () {
    let adminPermissions = ["owner", "admin"];
    return this.hasPermission(adminPermissions);
  },
  hasDashboardAccess: function () {
    let dashboardPermissions = ["owner", "admin", "dashboard"];
    return this.hasPermission(dashboardPermissions);
  },
  getSellerShopId: function () {
    return Roles.getGroupsForUser(this.userId, "admin");
  },
  configureMailUrl: function (user, password, host, port) {
    let shopMail = EFrameworkCore.Collections.Packages.findOne({
      shopId: this.getShopId(),
      name: "core"
    }).settings.mail;
    let processUrl = process.env.MAIL_URL;
    let settingsUrl = Meteor.settings.MAIL_URL;
    if (user && password && host && port) {
      let mailString = `smtp://${user}:${password}@${host}:${port}/`;
      mailUrl = processUrl = settingsUrl = mailString;
      return mailString;
    } else if (shopMail.user && shopMail.password && shopMail.host &&
      shopMail.port) {
      EFrameworkCore.Log.info("setting default mail url to: " + shopMail
        .host);
      let mailString =
        `smtp://${shopMail.user}:${shopMail.password}@${shopMail.host}:${shopMail.port}/`;
      let mailUrl = processUrl = settingsUrl = mailString;
      return mailUrl;
    } else if (settingsUrl && !processUrl) {
      let mailUrl = processUrlL = settingsUrl;
      return mailUrl;
    }
    if (!process.env.MAIL_URL) {
      EFrameworkCore.Log.warn(
        "Mail server not configured. Unable to send email.");
      return false;
    }
  }
});


// Method Check Helper
Match.OptionalOrNull = function (pattern) {
return Match.OneOf(void 0, null, pattern);
};


/*
 * Ejecuta start up fixtures
 */
Meteor.startup(function () {
	EFrameworkCore.init();
	return EFrameworkCore.Log.info("E-Framework Core initialization finished. ");
});
