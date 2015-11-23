/**
 * cartSubTotals helpers
 *
 * @returns cart
 */
 /*TODO*/
Template.cartSubTotals.helpers({
  cart: function() {
    return Cart.findOne();
  }
});
