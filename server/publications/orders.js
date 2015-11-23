/**
 * orders
 */

Meteor.publish("Orders", function () {
	shopId = EFrameworkCore.getShopId();
	if (Roles.userIsInRole(this.userId, ["admin", "owner"], EFrameworkCore.getShopId())) {
		return EFrameworkCore.Collections.Orders.find({
			shopId: shopId
		});
	}
	return EFrameworkCore.Collections.Orders.find({
		shopId: shopId,
		userId: this.userId
	});
});

// /*
//  * account orders
//  */

// Meteor.publish("AccountOrders", function (userId, currentShopId) {
//   check(userId, Match.OptionalOrNull(String));
//   check(currentShopId, Match.OptionalOrNull(String));
//   shopId = currentShopId || EFrameworkCore.getShopId(this);

//   if (userId && userId !== this.userId) {
//     this.ready();
//   }

//   return EFrameworkCore.Collections.Orders.find({
//     shopId: shopId,
//     userId: this.userId
//   });
// });

// /*
//  * completed cart order
//  */
// Meteor.publish("CompletedCartOrder", function (userId, cartId) {
//   check(userId, String);
//   check(cartId, String);

//   if (userId !== this.userId) {
//     this.ready();
//   }

//   return EFrameworkCore.Collections.Orders.find({
//     cartId: cartId,
//     userId: userId
//   });
// });
