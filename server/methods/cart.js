/**
 * Reaction Cart Methods
 */

Meteor.methods({
//   /**
//    * cart/mergeCart
//    * @summary merge matching sessionId cart into specified userId cart
//    *
//    * There should be one cart for each independent, non logged in user session
//    * When a user logs in that cart now belongs to that user and we use the a single user cart.
//    * If they are logged in on more than one devices, regardless of session, the user cart will be used
//    * If they had more than one cart, on more than one device,logged in at seperate times then merge the carts
//    *
//    * @param {String} cartId - cartId of the cart to merge matching session carts into.
//    * @return {Object} cartId - cartId on success
//    */
//   "cart/mergeCart": function (cartId) {
//     check(cartId, String);

//     let Cart = EFrameworkCore.Collections.Cart; // convienance shorthand
//     let currentCart = Cart.findOne(cartId); // we don't process current cart, but merge into it.
//     let userId = currentCart.userId; // just used to filter out the current cart
//     let sessionId = EFrameworkCore.sessionId; // persisten sessions, see: publications/sessions.js
//     let shopId = EFrameworkCore.getShopId();

//     // no need to merge anonymous carts
//     if (Roles.userIsInRole(userId, "anonymous", shopId)) {
//       return false;
//     }
//     EFrameworkCore.Log.debug("merge cart: matching sessionId");
//     EFrameworkCore.Log.debug("current userId", userId);
//     EFrameworkCore.Log.debug("sessionId", sessionId);
//     // get session carts without current user cart
//     let sessionCarts = Cart.find({
//       $and: [{
//         userId: {
//           $ne: userId
//         }
//       }, {
//         sessionId: {
//           $eq: sessionId
//         }
//       }]
//     });
//     EFrameworkCore.Log.debug("sessionCarts", sessionCarts.fetch())
//     EFrameworkCore.Log.debug(
//       `merge cart: begin merge processing of session ${sessionId} into: ${currentCart._id}`
//     );
//     // loop through session carts and merge into user cart
//     sessionCarts.forEach((sessionCart) => {
//       EFrameworkCore.Log.debug(
//         `merge cart: merge user userId: ${userId}, sessionCart.userId: ${sessionCart.userId}, sessionCart id: ${sessionCart._id}`
//       );
//       // really if we have no items, there's nothing to merge    "workflow" : {
//       if (sessionCart.items) {
//         // merge session cart into current cart
//         Cart.update(currentCart._id, {
//           $set: {
//             "userId": Meteor.userId(),
//             "workflow.status": "checkoutLogin",
//             "workflow.workflow": ["checkoutLogin"]
//           },
//           $addToSet: {
//             items: {
//               $each: sessionCart.items
//             }
//           }
//         });
//       }
//       // cleanup session Carts after merge.
//       if (sessionCart.userId !== this.userId) {
//         // clear the cart that was used for a session
//         // and we're also going to do some garbage Collection
//         Cart.remove(sessionCart._id);
//         Meteor.users.remove(sessionCart.userId);
//         EFrameworkCore.Collections.Accounts.remove({
//           userId: sessionCart.userId
//         });
//         EFrameworkCore.Log.debug(
//           `merge cart: delete cart ${sessionCart._id} and user: ${sessionCart.userId}`
//         );
//       }

//       EFrameworkCore.Log.debug(
//         `merge cart: processed merge for cartId ${sessionCart._id}`
//       );
//       return currentCart._id;
//     });

//     return currentCart._id;
//   },

	/**
	* cart/createCart
	* @summary crea y retorna un nuevo "cart" para el "user"
	* @param {String} createForUserId - userId al que se le crearà el "cart"
	* @returns {String} cartId - users cartId
	* @todo Documentar y entender
	*/
	"cart/createCart": function (createForUserId) {
		check(createForUserId, Match.Optional(String));
		this.unblock();
		let sessionId;
		let userId = createForUserId || this.userId;
		let Cart = EFrameworkCore.Collections.Cart;
		let currentCartId;

		// find current userCart
		// this is the only true cart
		let currentUserCart = Cart.findOne({ userId: userId });

		if (currentUserCart) {
			EFrameworkCore.Log.debug("currentUserCart", currentUserCart.sessionId);
			sessionId = currentUserCart.session;
		} else {
			sessionId = EFrameworkCore.sessionId;
		}
		EFrameworkCore.Log.debug("current cart serverSession", sessionId);
		// while anonymous and merge into user cart
		let sessionCartCount = Cart.find({
			session: sessionId,
			userId: { $ne: userId }
		}).count();

		// check if user has `anonymous` role.( this is a visitor)
		let anonymousUser = EFrameworkCore.hasPermission("anonymous");
		// the cart is either current or new
		if (currentUserCart) {
			currentCartId = currentUserCart._id;
		}

		EFrameworkCore.Log.debug("create cart: shopId", shopId);
		EFrameworkCore.Log.debug("create cart: userId", userId);
		EFrameworkCore.Log.debug("create cart: sessionId", sessionId);
		EFrameworkCore.Log.debug("create cart: currentUserCart", currentCartId);
		EFrameworkCore.Log.debug("create cart: sessionCarts.count",
		sessionCartCount);
		EFrameworkCore.Log.debug("create cart: anonymousUser", anonymousUser);

		// if we have a session cart, but just create or
		// authenticated into a new user we need to create a user
		// cart for the new authenticated user.
		if (!currentCartId && anonymousUser === false) {
			currentCartId = Cart.insert({
				sessionId: sessionId,
				userId: userId
			});
			EFrameworkCore.Log.debug("create cart: into new user cart. created: " + currentCartId + " for user " + userId);
		}

		// merge session carts into the current cart
		if (currentCartId && sessionCartCount > 0 && anonymousUser === false) {
			EFrameworkCore.Log.debug( "create cart: found existing cart. merge into " + currentCartId + " for user " + userId);
			Meteor.call("cart/mergeCart", currentCartId);
		} else if (!currentCartId) { // Create empty cart if there is none.
			currentCartId = Cart.insert({
				sessionId: sessionId,
				shopId: shopId,
				userId: userId
			});
			EFrameworkCore.Log.debug( `create cart: no existing cart. created: ${currentCartId} currentCartId for sessionId ${sessionId} and userId ${userId}`);
		}
		return currentCartId;
	},

	/**
	*  @function cart/addToCart
	*  @summary agrega items a un cart del usuario
	*  when we add an item to the cart, we want to break all relationships
	*  with the existing item. We want to fix price, qty, etc into history
	*  however, we could check reactively for price /qty etc, adjustments on
	*  the original and notify them
	*  @param {String} cartId - cartId
	*  @param {String} productId - productId para agregar al Cart
	*  @param {String} variantData - variant object
	*  @param {String} quantity - camtidad para agregar al cart, reducir desde el inventory
	*  @return {Number} Mongo insert response
	*/
	"cart/addToCart": function (cartId, productId, variantData, quantity) {
		check(cartId, String);
		check(productId, String);
		check(variantData, EFrameworkCore.Schemas.ProductVariant);
		check(quantity, String);

		let currentCart = EFrameworkCore.Collections.Cart.findOne(cartId);
		let cartVariantExists = EFrameworkCore.Collections.Cart.findOne({
			"_id": currentCart._id,
			"items.variants._id": variantData._id
		});

		//verificamos si la misma variant ha sido guardada previamente
		if (cartVariantExists) {
			Cart.update({
				"_id": currentCart._id,
				"items.variants._id": variantData._id
			}, {
				$set: {
					updatedAt: new Date()
				},
				$inc: {
					"items.$.quantity": quantity
				}
			});
			return function (error) {
				if (error) {
					EFrameworkCore.Log.warn("error adding to cart", EFrameworkCore.Collections.Cart.simpleSchema().namedContext().invalidKeys());
					return error;
				}
			};
		}

		// cart variant NO EXISTE
		let product = EFrameworkCore.Collections.Products.findOne(productId);
		return Cart.update(
		{
			_id: currentCart._id
		},
		{
			$addToSet: {
				items: {
					_id: Random.id(),
					shopId: product.shopId,
					productId: productId,
					quantity: quantity,
					variants: variantData
				}
			}
		},
		function (error) {
			if (error) {
				//Agrego log en caso de error
				EFrameworkCore.Log.warn("error adding to cart", EFrameworkCore.Collections.Cart.simpleSchema().namedContext().invalidKeys());
				return;
			}
		});
	},
	/**
	* @function cart/removeFromCart
	* @summary Elimina una variant del cart
	* @param {String} cartId - user cartId
	* @param {String} variantData - Objecto variant
	* @returns {String} retorna  resultado de Mongo update
	*/
	"cart/removeFromCart": function (cartId, variantData) {
		check(cartId, String);
		check(variantData, Object);
		this.unblock();

		return Cart.update(
			{_id: cartId},
			{ $pull: { items: { variants: variantData} }
		});
	},

//   *
//    * cart/copyCartToOrder
//    * @summary transform cart to order
//    * when a payment is processed we want to copy the cart
//    * over to an order object, and give the user a new empty
//    * cart. reusing the cart schema makes sense, but integrity of
//    * the order, we don't want to just make another cart item
//    * @todo:  Partial order processing, shopId processing
//    * @todo:  Review Security on this method
//    * @param {String} cartId - cartId to transform to order
//    * @return {String} returns orderId

//   "cart/copyCartToOrder": (cartId) => {
//     check(cartId, String);
//     let cart = EFrameworkCore.Collections.Cart.findOne(cartId);
//     let order = _.clone(cart);
//     let user;
//     let emails;

//     // reassign the id, we'll get a new orderId
//     order.cartId = cart._id;

//     // a helper for guest login, we let guest add email afterwords
//     // for ease, we'll also add automatically for logged in users
//     if (order.userId && !order.email) {
//       user = Meteor.user(order.userId);
//       emails = _.pluck(user.emails, "address");
//       order.email = emails[0];
//     }

//     // schema should provide order defaults
//     // so we'll delete the cart autovalues
//     delete order.createdAt; // autovalues
//     delete order.updatedAt;
//     delete order.cartCount;
//     delete order.cartShipping;
//     delete order.cartSubTotal;
//     delete order.cartTaxes;
//     delete order.cartDiscounts;
//     delete order.cartTotal;
//     delete order._id;

//     // init item level workflow
//     _.each(order.items, function (item, index) {
//       order.items[index].workflow = {
//         status: "orderCreated",
//         workflow: ["inventoryAdjusted"]
//       };
//     });

//     if (!order.items) {
//       throw new Meteor.Error(
//         "An error occurred saving the order. Missing cart items.");
//     }

//     // set new workflow status
//     order.workflow.status = "new";
//     order.workflow.workflow = ["orderCreated"];

//     // insert new reaction order
//     let orderId = EFrameworkCore.Collections.Orders.insert(order);
//     EFrameworkCore.Log.debug("Created orderId", orderId);

//     if (orderId) {
//       // TODO: check for succesful orders/inventoryAdjust
//       Meteor.call("orders/inventoryAdjust", orderId);
//       // trash the old cart
//       EFrameworkCore.Collections.Cart.remove({
//         _id: order.cartId
//       });
//       // create a new cart for the user
//       // even though this should be caught by
//       // subscription handler, it's not always working
//       let newCartExists = EFrameworkCore.Collections.Cart.find(order.userId);
//       if (newCartExists.count() === 0) {
//         Meteor.call("cart/createCart", order.userId);
//       }
//       // return
//       EFrameworkCore.Log.debug("Transitioned cart " + cartId + " to order " +
//         orderId);
//       return orderId;
//     }
//     // we should not have made it here, throw error
//     throw new Meteor.Error("cart/copyCartToOrder: Invalid request");
//   },

//   /**
//    * cart/setShipmentMethod
//    * @summary saves method as order default
//    * @param {String} cartId - cartId to apply shipmentMethod
//    * @param {Object} method - shipmentMethod object
//    * @return {String} return Mongo update result
//    */
//   "cart/setShipmentMethod": function (cartId, method) {
//     check(cartId, String);
//     check(method, Object);
//     // get current cart
//     let cart = EFrameworkCore.Collections.Cart.findOne({
//       _id: cartId,
//       userId: Meteor.userId()
//     });
//     // a cart is required!
//     if (!cart) {
//       return;
//     }

//     // temp hack until we build out multiple shipping handlers
//     let selector;
//     let update;
//     // temp hack until we build out multiple shipment handlers
//     // if we have an existing item update it, otherwise add to set.
//     if (cart.shipping) {
//       selector = {
//         "_id": cartId,
//         "shipping._id": cart.shipping[0]._id
//       };
//       update = {
//         $set: {
//           "shipping.$.shipmentMethod": method
//         }
//       };
//     } else {
//       selector = {
//         _id: cartId
//       };
//       update = {
//         $addToSet: {
//           shipping: {
//             shipmentMethod: method
//           }
//         }
//       };
//     }
//     // update or insert method
//     EFrameworkCore.Collections.Cart.update(selector, update, function (
//       error) {
//       if (error) {
//         EFrameworkCore.Log.warn(`Error adding rates to cart ${cartId}`,
//           error);
//         return;
//       }
//       // this will transition to review
//       Meteor.call("workflow/pushCartWorkflow", "coreCartWorkflow",
//         "coreCheckoutShipping");
//       return;
//     });
//   },

	/**
	* cart/setShipmentAddress
	* @summary adds address book to cart shipping
	* @param {String} cartId - cartId to apply shipmentMethod
	* @param {Object} address - addressBook object
	* @return {String} return Mongo update result
	*/
	"cart/setShipmentAddress": function (cartId, address) {
		check(cartId, String);
		check(address, EFrameworkCore.Schemas.Address);
		this.unblock();

		let cart = EFrameworkCore.Collections.Cart.findOne({
			_id: cartId,
			userId: Meteor.userId()
		});

		if (cart) {
			let selector;
			let update;
			// temp hack until we build out multiple shipment handlers
			// if we have an existing item update it, otherwise add to set.
			if (cart.shipping) {
				selector = {
					"_id": cartId,
					"shipping._id": cart.shipping[0]._id
				};
				update = { $set: { "shipping.$.address": address } };
			}
			else {
				selector = { _id: cartId };
				update = { $addToSet: { shipping: { address: address }}};
			}

			// add / or set the shipping address
			EFrameworkCore.Collections.Cart.update(selector, update, function (error) {
				if (error) {
					EFrameworkCore.Log.warn(error);
					return;
				}
				// refresh shipping quotes
				Meteor.call("shipping/updateShipmentQuotes", cartId);

				// it's ok for this to be called multiple times
				Meteor.call("workflow/pushCartWorkflow", "coreCartWorkflow", "coreCheckoutShipping");

				// this is probably a crappy way to do this
				// let's default the payment address
				if (!cart.payment) {
					Meteor.call("cart/setPaymentAddress", cartId, address);
				}
				return;
			});
		}
	},

	/**
	* cart/setPaymentAddress
	* @summary Agrega addressbook a pagos del cart
	* @param {String} cartId - cartId para realizar pagos
	* @param {Object} address - Objeto addressBook
	* @return {String} return Mongo update result
	*/
	"cart/setPaymentAddress": function (cartId, address) {
		check(cartId, String);
		check(address, EFrameworkCore.Schemas.Address);
		this.unblock();

		let cart = EFrameworkCore.Collections.Cart.findOne({
			_id: cartId,
			userId: Meteor.userId()
		});

		if (cart) {
			let selector;
			let update;
			// temp hack until we build out multiple billing handlers
			// if we have an existing item update it, otherwise add to set.
			if (cart.billing) {
				selector = {
					"_id": cartId,
					"billing._id": cart.billing[0]._id
				};
				update = { $set: { "billing.$.address": address }};
			}
			else {
				selector = { _id: cartId };
				update = { $addToSet: { billing: { address: address} }};
			}

			EFrameworkCore.Collections.Cart.update(selector, update, function (error, result) {
				if (error) {
					EFrameworkCore.Log.warn(error);
				}
				else {
					// post payment address Methods
					return result;
				}
			});
		}
	},

//   /**
//    * cart/submitPayment
//    * @summary saves a submitted payment to cart, triggers workflow
//    * and adds "paymentSubmitted" to cart workflow
//    * Note: this method also has a client stub, that forwards to cartCompleted
//    * @param {Object} paymentMethod - paymentMethod object
//    * @return {String} returns update result
//    */
//   "cart/submitPayment": function (paymentMethod) {
//     check(paymentMethod, EFrameworkCore.Schemas.PaymentMethod);

//     let checkoutCart = EFrameworkCore.Collections.Cart.findOne({
//       userId: Meteor.userId()
//     });

//     let cart = _.clone(checkoutCart);
//     let cartId = cart._id;
//     let invoice = {
//       shipping: cart.cartShipping(),
//       subtotal: cart.cartSubTotal(),
//       taxes: cart.cartTaxes(),
//       discounts: cart.cartDiscounts(),
//       total: cart.cartTotal()
//     };

//     // we won't actually close the order at this stage.
//     // we'll just update the workflow and billing data where
//     // method-hooks can process the workflow update.

//     let selector;
//     let update;
//     // temp hack until we build out multiple billing handlers
//     // if we have an existing item update it, otherwise add to set.
//     if (cart.billing) {
//       selector = {
//         "_id": cartId,
//         "billing._id": cart.billing[0]._id
//       };
//       update = {
//         $set: {
//           "billing.$.paymentMethod": paymentMethod,
//           "billing.$.invoice": invoice
//         }
//       };
//     } else {
//       selector = {
//         _id: cartId
//       };
//       update = {
//         $addToSet: {
//           "billing.paymentMethod": paymentMethod,
//           "billing.invoice": invoice
//         }
//       };
//     }

//     return EFrameworkCore.Collections.Cart.update(selector, update,
//       function (error) {
//         if (error) {
//           EFrameworkCore.Log.warn(error);
//           throw new Meteor.Error("An error occurred saving the order",
//             error);
//         }
//         return;
//       });
//   }
});
