//
// These helpers can be used in general shipping packages


/**
 * @function cartShippingMethods
 * @summary Obtiene el método actual de shipment hasta que se puedan manejar múltiples métodos. Momentaneamente se utiliza el primero.
 * @param {Collections.Cart} currentCart - Cart actual que el usuario tiene asociado.
 * @returns {Shema.ShipmentQuotes}
 * @todo Documentar
 */
function cartShippingMethods(currentCart) {
	let cart = currentCart || EFrameworkCore.Collections.Cart.findOne();
	if (cart) {
		if (cart.shipping) {
			if (cart.shipping[0].shipmentQuotes) {
				return cart.shipping[0].shipmentQuotes;
			}
		}
	}
  	return undefined;
}

// getShipmentMethod to get current shipment method
// until we handle multiple methods, we just use the first
/**
 * @function getShipmentMethod
 * @summary Obtiene el actuál método shipment
 * @param {Collections.Cart} currentCart - Cart actual que el usuario tiene asociado.
 * @returns {Number} Sum of a and b
 * @todo Documentar
 */
function getShipmentMethod(currentCart) {
  let cart = currentCart || EFrameworkCore.Collections.Cart.findOne();
  if (cart) {
    if (cart.shipping) {
      if (cart.shipping[0].shipmentMethod) {
        return cart.shipping[0].shipmentMethod;
      }
    }
  }
  return undefined;
}


/**
 * @summary Template.coreCheckoutShipping.helpers
 * @description Helpers para Template.coreCheckoutShipping
 */
Template.coreCheckoutShipping.helpers({

  /**
   * @function shipmentQuotes
   * @summary retrieves current rates and updates shipping rates in the users cart collection (historical, and prevents repeated rate lookup)
   * @returns {Schema.ShipmentQuotes}
   * @todo Documentar y SUMMARY
   */
  shipmentQuotes: function () {
    let cart = EFrameworkCore.Collections.Cart.findOne();
    return cartShippingMethods(cart);
  },

  /**
   * @function shippingConfigured
   * @summary confirmar si existe algún shipping providersb
   * @returns {Number} cantidad de shipping providersb configurados
   * @todo Documentar y SUMMARY
   */
  shippingConfigured: function () {
  	// busca
    let exists = EFrameworkCore.Collections.Shipping.find({
      "methods.enabled": true
    }).count();
    return exists;
  },

   /**
   * @function shippingConfigured
   * @summary display el shipmentMethod actuál
   * @returns {String} CSS clase (active ó NULL)
   * @todo Documentar y SUMMARY
   */
	isSelected: function () {
		let self = this;
		let shipmentMethod = getShipmentMethod();
		// Si ya hay un método seleccionado, ponerlo "active"
		if (_.isEqual(self.method, shipmentMethod)){
			return "active";
		}
		return null;
	}
});

//
// Set and store cart shipmentMethod
// this copies from shipmentMethods (retrieved rates)
// to shipmentMethod (selected rate)
//

/**
 * @summary Template.coreCheckoutShipping.events
 * @description Events para Template.coreCheckoutShipping
 */
Template.coreCheckoutShipping.events({
	/**
   * @event click .list-group-item
   * @summary establecer Shipment method
   * @returns {String} CSS clase (active ó NULL)
   * @todo Documentar y SUMMARY
   */
  	"click .list-group-item": function (event) {
		event.preventDefault();
		event.stopPropagation();
		let self = this;
		let cart = EFrameworkCore.Collections.Cart.findOne();

		try {
			Meteor.call("cart/setShipmentMethod", cart._id, self.method);
		} catch (error) {
			throw new Meteor.Error(error,
			"Cannot change methods while processing.");
		}
	}
});
