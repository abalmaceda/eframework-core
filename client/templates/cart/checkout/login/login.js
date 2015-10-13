/**
 * checkoutLoginCompleted
 * returns true if we've already past this stage,
 * or if the user is a guest but not anonymous
 */

Template.checkoutLogin.helpers({
  checkoutLoginCompleted: function () {
    const self = this;
    let guestUser = EFrameworkCore.hasPermission("guest", Meteor.user());
    let currentStatus = EFrameworkCore.Collections.Cart.findOne().workflow.status;
    let anonUser = Roles.userIsInRole("anonymous", Meteor.user(),
      EFrameworkCore.getShopId());

    if (currentStatus !== self.template && guestUser === true && anonUser ===
      false) {
      return true;
    }
    return false;
  }
});
