/* TODO: agregar descripcion */

/**
 * shops
 * @returns {Object} shop - current shop cursor
 */

Meteor.publish("Shops", function () {
  return EFrameworkCore.getCurrentShopCursor(this);
});
