/* TODO */

/**
 * dashboard helpers
 *
 * manages view / permissions for the console
 */

/**
* Template.dashboard.helpers
* @summary Helpers para Template.dashboard
*/
Template.dashboard.helpers({
//   route: function() {
//     return Router.current().route.getName();
//   },

	/**
	* @method displayConsoleNavBar
	* @summary Si se debe mostrar
	* @returns {Boolean}
	*/
	displayConsoleNavBar: function() {
		if (EFrameworkCore.hasPermission('console') && Session.get("displayConsoleNavBar")) {
			return true;
		}
	},

	/**
	* @method displayConsoleDrawer
	* @summary Si se debe mostrar
	* @returns {Boolean}
	*/
	displayConsoleDrawer: function() {
		if (EFrameworkCore.hasPermission('console') && Session.get("displayConsoleDrawer")) {
			return true;
		}
	}
});

/**
 * dashboard events
 *
 * routes console links to packages routes from ReactionRegistry
 */
/* TODO: descomentar */
// Template.dashboard.events({
//   'click .dashboard-navbar-package': function(event, template) {
//     Session.set("currentPackage", this.route);
//     if (this.route != null) {
//       event.preventDefault();
//       return Router.go(this.route);
//     }
//   }
// });


// Template.dashboardHeader.helpers({
//   showHeader: function () {
//     if (Router.current().route.getName().indexOf("dashboard") === 0) {
//       return true;
//     }

//     return false;
//   },

//   "registry": function () {
//     // just some handle little helpers for default package i18nKey/i18nLabel
//     var registry = EFrameworkCore.getRegistryForCurrentRoute("dashboard") || {};
//     registry.nameSpace = registry.name || registry.template || "app";
//     registry.i18nLabel = registry.label || registry.provides || "Settings";
//     registry.i18nKey = registry.nameSpace.toCamelCase() + "." + registry.i18nLabel.toCamelCase();
//     return registry;
//   },

//   thisDashboard: function () {

//     return EFrameworkCore.getRegistryForCurrentRoute("dashboard");

//   }



// });


// Template.dashboardHeader.events({
//   "click [data-event-action=showPackageSettings]": function () {
//     EFrameworkCore.showActionView();
//   }
// });
