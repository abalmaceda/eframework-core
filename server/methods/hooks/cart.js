/**
 * @function EFrameworkCore.MethodHooks.after."cart/submitPayment"
 * @summary Constructor_for_a_Collection
 * @param {object} options
 * @returns {Number}
 * @todo Documentar
 */
EFrameworkCore.MethodHooks.after("cart/submitPayment", function (options) {
	//En caso de existir un error en "cart/submitPayment" no se realiza la copia del Cart a Order y "se lanzará un error informativo"

	//En caso de no haber error.
	if (options.error === undefined) {
		let cart = EFrameworkCore.Collections.Cart.findOne({userId: Meteor.userId()});

		//Si no hay error
		if (cart) {
			//Se guarda la información de la orden en caso de que todo este correcto
			if (cart.items && cart.billing[0].paymentMethod) {
				Meteor.call("cart/copyCartToOrder", cart._id);
			}
			//En caso de haber un error, se informa al usuario
			else {
				throw new Meteor.Error("An error occurred verifing payment method. Failed to save order." );
			}
		}
	}
	//Se retorna el resultado de "cart/submitPayment"
	return options.result;
});
