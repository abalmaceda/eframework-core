/**
 * coreHead helpers
 * used to define layout for routes
 * see: common/routing.js
 */

Template.coreHead.helpers({
  metaData: function () {
    return EFrameworkCore.MetaData;
  }
});

Template.coreAdminLayout.helpers({
  template: function () {
    return EFrameworkCore.getActionView();
  },

  adminControlsClassname: function () {
    if (EFrameworkCore.isActionViewOpen()) {
      return "show-settings";
    }
    return "";
  }
});
