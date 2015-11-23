/**
 * Template.cartDrawer.helpers
 * @summary Helpers para Template.cartDrawer
 */
Template.cartDrawer.helpers({
	/**
	 * @function displayCartDrawer
	 * @summary
	 * @provides displayCartDrawer
	 * @returns {Template} carro abierto o cerrado
	 */
	displayCartDrawer: function () {
		return Template.emptyCartDrawer;
		/*En caso de no existir una session*/
		if (!Session.equals("displayCart", true)) {
			return null;
		}

		let storedCart = Cart.findOne();
		let count = 0;

		if (storedCart !== null ? storedCart.items : void 0) {
			for (let items of storedCart.items) {
				count += items.quantity;
			}
		}
		/*Si el cart no tiene ningun product*/
		if (count === 0) {
			return Template.emptyCartDrawer;
		}
		/*Si cart tiene al menos un product */
		return Template.openCartDrawer;
	}
});


// Template.openCartDrawer.onRendered(function () {
//   return $("#cart-drawer-container").fadeIn();
// });

/**
 * Template.openCartDrawer.helpers
 * @summary Helpers para Template.openCartDrawer
 */
Template.openCartDrawer.helpers({
//   cartItems: function () {
//     return Cart.findOne().items;
//   },
//   checkoutView: function () {
//     let checkoutView;
//     checkoutView = "display:block";
//     if (Router.current().route.getName() === "cartCheckout") {
//       return checkoutView;
//     }
//   }
});

 /**
 * Template.openCartDrawer.events
 * @summary Events para Template.openCartDrawer
 */
Template.openCartDrawer.events({
//   "click #btn-checkout": function () {
//     $("#cart-drawer-container").fadeOut();
//     Session.set("displayCart", false);
//     return Router.go("cartCheckout");
//   },
//   "click .remove-cart-item": function (event) {
//     event.stopPropagation();
//     event.preventDefault();
//     let currentCartId = Cart.findOne()._id;
//     let currentVariant = this.variants;

//     return $(event.currentTarget).fadeOut(300, function () {
//       return Meteor.call("cart/removeFromCart", currentCartId,
//         currentVariant);
//     });
//   }
});

 /**
 * Template.emptyCartDrawer.helpers
 * @summary Helpers para Template.emptyCartDrawer
 */
Template.emptyCartDrawer.events({
//   "click #btn-keep-shopping": function (event) {
//     event.stopPropagation();
//     event.preventDefault();
//     return $("#cart-drawer-container").fadeOut(300, function () {
//       return toggleSession("displayCart");
//     });
//   }
});

// Template.emptyCartDrawer.onRendered(function () {
//   return $("#cart-drawer-container").fadeIn();
// });
