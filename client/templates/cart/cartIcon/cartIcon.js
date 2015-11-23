/**
 * Template.openCartDrawer.helpers
 * @summary Helpers para Template.openCartDrawer
 */
Template.cartIcon.helpers({
	/**
	 * cart
	 * @summary Obtiene un objeto del tipo Cart
	 * @returns {Cart}
	 */
	cart: function () {
		return EFrameworkCore.Collections.Cart.findOne();
	}
});

// Template.cartIcon.events({
//   "click .cart-icon": function () {
//     return $("#cart-drawer-container").fadeOut(300, function () {
//       return toggleSession("displayCart");
//     });
//   }
// });
