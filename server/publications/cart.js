/**
 * cart
 */
/**
 * cart publication
 * @param {String} sessionId -
 * @param {String} userId -
 * @return {Cart}
 */
Meteor.publish("Cart", function (sessionId, userId) {
	check(sessionId, Match.OneOf(String, null));
	check(userId, Match.OptionalOrNull(String));
	// sessionId is required, not for selecting
	// the cart, (userId), but as a key in merging
	// anonymous user carts into authenticated existing
	// user carts.
	// we won't create carts unless we've got sessionId
	if (!this.userId || sessionId === null) {
		/*TODO: verificar que es this.ready()*/
		this.ready();
	}
	// shopId is also required.
	if (!EFrameworkCore.getShopId()) {
		this.ready();
	}
	// select user cart
	cart = EFrameworkCore.Collections.Cart.findOne({ userId: this.userId });

	// we may create a cart if we didn't find one.
	if (cart) {
		cartId = cart._id;
	}
	else if (this.userId) {
		cartId = Meteor.call("cart/createCart", this.userId);
	}
	else {
		this.ready();
	}
	return EFrameworkCore.Collections.Cart.find(cartId);
});

// /**
//  * shipping
//  */

// Meteor.publish("Shipping", function () {
//   return EFrameworkCore.Collections.Shipping.find({
//     shopId: EFrameworkCore.getShopId()
//   });
// });

// /**
//  * taxes
//  */

// Meteor.publish("Taxes", function () {
//   return EFrameworkCore.Collections.Taxes.find({
//     shopId: EFrameworkCore.getShopId()
//   });
// });

// /**
//  * discounts
//  */

// Meteor.publish("Discounts", function () {
//   return EFrameworkCore.Collections.Discounts.find({
//     shopId: EFrameworkCore.getShopId()
//   });
// });
