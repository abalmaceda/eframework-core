Template.settingsHeader.helpers({

  "registry": function () {
    // just some handle little helpers for default package i18nKey/i18nLabel
    var registry = EFrameworkCore.getActionView() || {};
    registry.nameSpace = registry.name || registry.template || "app";
    registry.i18nLabel = registry.label || registry.provides || "Settings";
    registry.i18nKey = registry.nameSpace.toCamelCase() + "." + registry.i18nLabel.toCamelCase();
    return registry;

  },

  "thisApp": function () {
    var fields = {
      'enabled': 1,
      'registry': 1,
      'name': 1
    };

    var reactionApp = EFrameworkCore.Collections.Packages.findOne({
      "registry.provides": "settings",
      "registry.route": Router.current().route.getName()
    }, {
      'enabled': 1,
      'registry': 1,
      'name': 1,
      'route': 1
    });

    if (reactionApp) {
      var settingsData = _.find(reactionApp.registry, function (item) {
        return item.route == Router.current().route.getName() && item.provides == "settings";
      });

      return settingsData;
    }
    return reactionApp;
  }

});


Template.settingsHeader.events({
  "click [data-event-action=closeSettings]": function () {
    EFrameworkCore.hideActionView();
  }
});


Templte.settingsSidebar.inheritsHelpersFrom("packagesGrid");

Template.settingsSidebar.helpers({
  pkgPermissions: function () {
    if (EFrameworkCore.hasPermission('dashboard')) {
      if (this.route) {
        return EFrameworkCore.hasPermission(this.route);
      } else {
        return EFrameworkCore.hasPermission(this.name);
      }
    } else {
      return false;
    }
  }
});

Template.settingsSidebarItem.helpers({
  "label": function () {
    return Template.parentData(1).label || this.label;
  },

  "active": function (route) {
    if (route === Router.current().route.getName()) {
      return "active";
    }

    return "";
  }
});
