/**
* packagesGrid helpers
*
*/
Template.packagesGrid.helpers({
  pkgPermissions: function() {
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
