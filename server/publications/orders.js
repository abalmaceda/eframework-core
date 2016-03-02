/**
 * @global Meteor.publish.Orders
 * @summary Retorna Cursor de las Orders del usuario actual o todas las Orders si es "admin"
 * @return {Collection.Cursor} return Cursor de Orders
 */
Meteor.publish("Orders", function () {
	shopId = EFrameworkCore.getShopId();
	if (Roles.userIsInRole(this.userId, ["admin", "owner"], EFrameworkCore.getShopId())) {
		return EFrameworkCore.Collections.Orders.find({
			shopId: shopId
		});
	}

	//En caso de ser usuario normal
	return EFrameworkCore.Collections.Orders.find({
		shopId: shopId,
		userId: this.userId
	});
});

/**
 * @global Meteor.publish.AccountOrders
 * @summary
 * @param {String} userId - id del usuario
 * @param {String} currentShopId - id de la tienda actual
 * @return {Collection.Cursor}
 * @todo Documentacion
 */
Meteor.publish("AccountOrders", function (userId, currentShopId) {
	check(userId, Match.OptionalOrNull(String));
	check(currentShopId, Match.OptionalOrNull(String));
	shopId = currentShopId || EFrameworkCore.getShopId(this);

	if (userId && userId !== this.userId) {
		this.ready();
	}

	return EFrameworkCore.Collections.Orders.find({ shopId: shopId, userId: this.userId });
});

/**
 * @global Meteor.publish.CompletedCartOrder
 * @summary Publish para informar a los suscriptores de los cambios producidos en el Collection Orders.
 * @param {String} userId - id del usuario
 * @param {String} cartId - id del cart
 * @return {Collection.Cursor} return Cursor de Orders para un usuario y carro determinado.
 * @todo verificar el tema de permisos
 */
Meteor.publish("CompletedCartOrder", function (userId, cartId) {
	check(userId, String);
	check(cartId, String);

	if (userId !== this.userId) {
		this.ready();
	}

	return EFrameworkCore.Collections.Orders.find({ cartId: cartId, userId: userId});
});
