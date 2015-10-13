/* TODO todo*/

/*
 * Methods for the reaction permissions
 * https://github.com/ongoworks/reaction#rolespermissions-system
 * use: {{hasPermissions admin userId}}
 */

/**
 * hasPermission template helper
 * @summary check current user hasPermission
 * @param  {String|Array} "permissions"
 * @param  {String} checkUserId - optional Meteor.userId, default to current
 * @return {Boolean}
 */
 /* TODO funtion */
Template.registerHelper("hasPermission", function (permissions, options) {
  return true;
  check(permissions, Match.OneOf(String, Array));
  check(options.hash, Match.Optional(Object));
  // default to checking this.userId
  let userId = Meteor.userId();
  // we don't necessarily need to check here
  // as these same checks and defaults are
  // also performed in EFrameworkCore.hasPermission
  if (typeof options === "object") {
    if (options.hash.userId) {
      userId = options.hash.userId;
      return EFrameworkCore.hasPermission(permissions, userId);
    }
  }
  return EFrameworkCore.hasPermission(permissions, userId);
});

/**
 * hasOwnerAccess template helper
 * @summary check if user has owner access
 * @return {Boolean} return true if owner
 */
// Template.registerHelper("hasOwnerAccess", function () {
//   return EFrameworkCore.hasOwnerAccess();
// });

/**
 * hasAdminAccess template helper
 * @summary check if user has admin access
 * @return {Boolean} return true if admin
 */
// Template.registerHelper("hasAdminAccess", function () {
//   return EFrameworkCore.hasAdminAccess();
// });

/**
 * hasDashboardAccess template helper
 * @summary check if user has dashboard access
 * @return {Boolean} return true if user has dashboard permission
 */
// Template.registerHelper("hasDashboardAccess", function () {
//   return EFrameworkCore.hasDashboardAccess();
// });

/**
 * allowGuestCheckout template helper
 * @summary check if guest users are allowed to checkout
 * @return {Boolean} return true if shop has guest checkout enabled
 */
// Template.registerHelper("allowGuestCheckout", function () {
//   return EFrameworkCore.allowGuestCheckout();
// });
