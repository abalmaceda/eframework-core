/**
 * @summary Meteor.methods cart
 * @description Meteor.methods para funciones relacionadas con Cart
 * @todo Documentar
 */
Meteor.methods({
	/**
	 * @function cart/submitPayment
	 * @summary Constructor_for_a_Collection
	 * @param {Schemas.PaymentMethod} paymentMethod
	 * @returns {void}
	 * @todo Documentar
	 */
	"cart/submitPayment": function (paymentMethod) {
		check(paymentMethod, EFrameworkCore.Schemas.PaymentMethod);

		let checkoutCart = EFrameworkCore.Collections.Cart.findOne({userId: Meteor.userId() });

		let cart = _.clone(checkoutCart);
		let cartId = cart._id;
		let invoice = {
			shipping: cart.cartShipping(),
			subtotal: cart.cartSubTotal(),
			taxes: cart.cartTaxes(),
			discounts: cart.cartDiscounts(),
			total: cart.cartTotal()
		};
		// we won't actually close the order at this stage.
		// we'll just update the workflow and billing data where
		// method-hooks can process the workflow update.

		let selector;
		let update;
		// temp hack until we build out multiple billing handlers
		// if we have an existing item update it, otherwise add to set.
		if (cart.billing) {
			selector = { "_id": cartId, "billing._id": cart.billing[0]._id };
			update = {
				$set: {
					"billing.$.paymentMethod": paymentMethod,
					"billing.$.invoice": invoice
				}
			};
		}
		else {
			selector = { _id: cartId };
			update = {
				$addToSet: {
					"billing.paymentMethod": paymentMethod,
					"billing.invoice": invoice
				}
			};
		}

		EFrameworkCore.Collections.Cart.update(selector, update, function (error, result) {
			if (error) {
				EFrameworkCore.Log.warn(error);
				throw new Meteor.Error("An error occurred saving the order", error);
			}
			else {
				// it's ok for this to be called multiple times
				Meteor.call("workflow/pushCartWorkflow", "coreCartWorkflow", "paymentSubmitted");
				// Client Stub Actions
				if (result === 1) {
					Router.go("cartCompleted", { _id: cartId });
				}
				else {
					Alerts.add("Failed to place order.", "danger", {
						autoHide: true,
						placement: "paymentMethod"
					});
					throw new Meteor.Error("An error occurred saving the order", cartId, error);
				}
			}
		});
	}
});
