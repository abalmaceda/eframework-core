/**
 * cartIcon helpers
 *
 */
Template.cartIcon.helpers({
  cart: function () {
    return EFrameworkCore.Collections.Cart.findOne();
  }
});

Template.cartIcon.events({
  "click .cart-icon": function () {
    return $("#cart-drawer-container").fadeOut(300, function () {
      return toggleSession("displayCart");
    });
  }
});
