 /**
 * Template.dashboardOrdersList.helpers
 * @summary Helpers para Template.dashboardOrdersList
 */
Template.dashboardOrdersList.helpers({
	/**
	* @function orders
	* @summary Obtiene las Orders que el usuario ha realizado
	* @description Solo obtiene las 25 últimas y las ordena por fecha decreciente
	* @params {} data -
	* @return {Order[]}
	* @todo all
	*/
	orders: function (data) {
		if (data.hash.data) {
			return data.hash.data;
		}
		return EFrameworkCore.Collections.Orders.find({}, {
			sort: { createdAt: -1 },
			limit: 25
		});
	},
	/**
	* @function
	* @summary
	* @return {}
	* @todo all
	*/
	// orderAge: function () {
	// return moment(this.createdAt).fromNow();
	// },
	/**
	* @function
	* @summary
	* @return {}
	* @todo all
	*/
	// shipmentTracking: function () {
	// return this.shipping[0].shipmentMethod.tracking;
	// },
	/**
	* @function
	* @summary
	* @return {}
	* @todo all
	*/
	// shopName: function () {
	// let shop = Shops.findOne(this.shopId);
	// return shop !== null ? shop.name : void 0;
	// }
});
