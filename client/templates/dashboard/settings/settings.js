/**
 * Template.settingsHeader.helpers
 * @summary Helpers para Template.settingsHeader
 */
Template.settingsHeader.helpers({
	/**
	 * @method registry
	 * @summary algo de helpers para apoyar el package default i18nKey/i18nLabel
	 * @returns {void}
	 */
	registry: function () {
		let registry = EFrameworkCore.getActionView() || {};
		registry.nameSpace = registry.name || registry.template || "app";
		registry.i18nLabel = registry.label || registry.provides || "Settings";
		registry.i18nKey = registry.nameSpace.toCamelCase() + "." + registry.i18nLabel.toCamelCase();
		return registry;
	},

//   "thisApp": function () {
//     var fields = {
//       'enabled': 1,
//       'registry': 1,
//       'name': 1
//     };

//     var reactionApp = EFrameworkCore.Collections.Packages.findOne({
//       "registry.provides": "settings",
//       "registry.route": Router.current().route.getName()
//     }, {
//       'enabled': 1,
//       'registry': 1,
//       'name': 1,
//       'route': 1
//     });

//     if (reactionApp) {
//       var settingsData = _.find(reactionApp.registry, function (item) {
//         return item.route == Router.current().route.getName() && item.provides == "settings";
//       });

//       return settingsData;
//     }
//     return reactionApp;
//   }

});

/**
 * Template.settingsHeader.events
 * @summary Events para Template.settingsHeader
 */
Template.settingsHeader.events({
	/**
	 * @event click [data-event-action=closeSettings]
	 * @summary Esconde el menú settings
	 * @returns {void}
	 */
	"click [data-event-action=closeSettings]": function () {
		EFrameworkCore.hideActionView();
	}
});

/**
 * @method Template.settingsSidebar.inheritsHelpersFrom
 * @summary Se heredan los helpers de packagesGrid
 */
Template.settingsSidebar.inheritsHelpersFrom("packagesGrid");

/**
 * Template.settingsHeader.events
 * @summary Events para Template.settingsHeader
 */
Template.settingsSidebar.helpers({
	/**
	 * @method pkgPermissions
	 * @summary verifica los permisos del package actual
	 * @returns {Boolean} Si tengo
	 */
	pkgPermissions: function () {
		if (EFrameworkCore.hasPermission('dashboard')) {
			if (this.route) {
				return EFrameworkCore.hasPermission(this.route);
			}
			else {
				return EFrameworkCore.hasPermission(this.name);
			}
		}
		else {
			return false;
		}
	}
});

Template.settingsSidebarItem.helpers({
//   "label": function () {
//     return Template.parentData(1).label || this.label;
//   },

//   "active": function (route) {
//     if (route === Router.current().route.getName()) {
//       return "active";
//     }

//     return "";
//   }
});
