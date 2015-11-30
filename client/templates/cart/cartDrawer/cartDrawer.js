/**
 * Template.cartDrawer.helpers
 * @summary Helpers para Template.cartDrawer
 */
Template.cartDrawer.helpers({
	/**
	 * @function displayCartDrawer
	 * @summary
	 * @returns {Template} carro abierto o cerrado
	 */
	displayCartDrawer: function () {
		/*Si displayCart == true, significa que debo mostrar alguno de los Template emptyCartDrawer/openCartDrawer */
		/*Si displayCart !== true (no se pregunta si es false, por que en un inicio puede ser null) Significa que debo ocultar el Template, lo que es lo mismo que no poner ningun Template ( Esto se logra retonando NULL donde deberia ir un Template.*/
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

/**
 * Template.openCartDrawer.onRendered
 * @summary onRendered para Template.openCartDrawer
 */
Template.openCartDrawer.onRendered(function () {
  return $("#cart-drawer-container").fadeIn();
});

/**
 * Template.openCartDrawer.helpers
 * @summary Helpers para Template.openCartDrawer
 */
Template.openCartDrawer.helpers({
	/**
	 * @function cartItems
	 * @summary Busca los productos que se han agregado al cart y retorna su información
	 * @returns {Item} producto contenido en el cart
	 */
	cartItems: function () {
		return Cart.findOne().items;
	},
	/**
	 * @function checkoutView
	 * @summary
	 * @returns {Template} carro abierto o cerrado
	 */
	checkoutView: function () {
		let checkoutView;
		checkoutView = "display:block";
		if (Router.current().route.getName() === "cartCheckout") {
			return checkoutView;
		}
	}
});

 /**
 * Template.openCartDrawer.events
 * @summary Events para Template.openCartDrawer
 */
Template.openCartDrawer.events({
	/**
	* @event click #btn-checkout
	* @summary Dirige hacia la vista cartCheckout
	* @return {void}
	*/
	"click #btn-checkout": function () {
		//Oculta el cart-drawer-container
		$("#cart-drawer-container").fadeOut();
		//displayCart = false
		Session.set("displayCart", false);
		return Router.go("cartCheckout");
	},
	/**
	* @event click .remove-cart-item
	* @summary Muestra información del "cart"
	* @return {Boolean}
	* @falta notificacion de error
	*/
	"click .remove-cart-item": function (event) {
		event.stopPropagation();
		event.preventDefault();
		let currentCartId = Cart.findOne()._id;
		let currentVariant = this.variants;

		return $(event.currentTarget).fadeOut(300, function(){
			return Meteor.call("cart/removeFromCart", currentCartId, currentVariant, function (error, results) {
				//TODO Agregar notificacion de error
			});
		});
	}
});

 /**
 * Template.emptyCartDrawer.helpers
 * @summary Helpers para Template.emptyCartDrawer
 */
Template.emptyCartDrawer.events({
	/**
	* @event click #btn-keep-shopping
	* @summary Muestra información del "cart"
	* @return {Boolean}
	*/
	"click #btn-keep-shopping": function (event) {
		event.stopPropagation();
		event.preventDefault();
		return $("#cart-drawer-container").fadeOut(300, function () {
			return toggleSession("displayCart");
		});
	}
});

Template.emptyCartDrawer.onRendered(function () {
  return $("#cart-drawer-container").fadeIn();
});
