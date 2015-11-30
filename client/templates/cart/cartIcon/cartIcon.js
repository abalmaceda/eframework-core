/**
* @function showLowInventoryWarning
* @summary determina si hay low inventory en algun item en el cart
* @returns {Boolean}
* @todo Documentar
*/
let showLowInventoryWarning = function(){
		let item;
		let storedCart = EFrameworkCore.Collections.Cart.findOne();
		// we're not being picky here - first thing in cart
		// that is low will trigger a inventory warning
		if (storedCart !== null ? storedCart.items : void 0) {
			for (item of storedCart.items) {
				if (item.variants !== null && item.variants.inventoryPolicy &&
					item.variants.lowInventoryWarningThreshold) {
					if (item.variants.inventoryQuantity <= item.variants.lowInventoryWarningThreshold) {
						return true;
					}
				}
			}
		}
	}

/**
 * Template.openCartDrawer.helpers
 * @summary Helpers para Template.openCartDrawer
 */
Template.cartIcon.helpers({
	/**
	 * @function cart
	 * @summary Obtiene un objeto del tipo Cart
	 * @returns {Cart}
	 */
	cart: function () {
		return EFrameworkCore.Collections.Cart.findOne();
	},

	/**
	 * @function showCartIconWarning
	 * @summary Determina si es necesario mostrar warning de low inventory
	 * @returns {Boolean}
	 */
	showCartIconWarning: function() {
		if (showLowInventoryWarning()) {
			return true;
		}
		return false;
	},

	/**
	 * @function showLowInventoryWarning
	 * @summary determina si hay low inventory en algun item en el cart
	 * @returns {Boolean}
	 * @todo Documentar
	 */
	// showLowInventoryWarning: function(){
	// 	let item;
	// 	let storedCart = EFrameworkCore.Collections.Cart.findOne();
	// 	// we're not being picky here - first thing in cart
	// 	// that is low will trigger a inventory warning
	// 	if (storedCart !== null ? storedCart.items : void 0) {
	// 		for (item of storedCart.items) {
	// 			if (item.variants !== null && item.variants.inventoryPolicy &&
	// 				item.variants.lowInventoryWarningThreshold) {
	// 				if (item.variants.inventoryQuantity <= item.variants.lowInventoryWarningThreshold) {
	// 					return true;
	// 				}
	// 			}
	// 		}
	// 	}
	// }
});

/**
* Template.cartIcon.events
* @summary Events para Template.cartIcon
*/
Template.cartIcon.events({
	/**
	* @event click .cart-iconx
	* @summary Muestra información del "cart"
	* @return {Boolean}
	*/
	"click .cart-icon": function () {
		return $("#cart-drawer-container").fadeOut(300, function (){
			/*Lo importante de este toggleSession, no es lo que retorna, si no que al modificar el valor de una variable reactiva, produce la ejecución del helper Template.cartDrawer.helpers.displayCartDrawer */
			return toggleSession("displayCart");
		});
	}
});
