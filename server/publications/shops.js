/* TODO: agregar descripcion */

/**
 * shops
 * @returns {Object} shop - current shop cursor
 */

/**
 * @global Meteor.publish."Shops"
 * @summary Obtiene el Cursor del Shop actual
 * @returns {Collection.Cursor} Cursor de la shop actual
 * @this What_does_the_THIS_keyword_refer_to_here
 * @todo decir que es "this"
 */
Meteor.publish("Shops", function () {
  return EFrameworkCore.getCurrentShopCursor(this);
});
