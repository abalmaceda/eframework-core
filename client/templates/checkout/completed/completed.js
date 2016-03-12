/**
 * @summary Template.templateName.cartCompleted
 * @description Helpers para Template.cartCompleted
 */
Template.cartCompleted.helpers({
	/**
	 * @function orderStatus
	 * @summary Constructor_for_a_Collection
	 * @returns {String} status de la orden
	 * @this
	 * @todo
	 *		+ explicar que es this
	 *		+ Agregar mas textos localizados para los diferentes status
	 */
	orderStatus: function () {
		//En caso de ser estado 'new' pongo un texto localizado
		if (this.workflow.status === "new") {
			return i18n.t("cartCompleted.submitted");
		}
		return this.workflow.status;
	},

	/**
	 * @function userOrders
	 * @summary Ordenes del usuario actual
	 * @deprecated
	 */
	userOrders: function () {
		if (Meteor.user()) {
			return EFrameworkCore.Collections.Orders.find({ userId: Meteor.userId() });
		}
	}
});

/**
 * cartCompleted events
 *
 * adds email to order
 */

 /**
  * @summary Template.cartCompleted.events
  * @description Events para Template.cartCompleted
  */
Template.cartCompleted.events({
	/**
	 * @event click #update-order
	 * @summary Constructor_for_a_Collection
	 * @param {event} a
	 * @param {template} b
	 * @returns {Object} Resultado de agregar email a la orden
	 */
	"click #update-order": function (event, template) {
		const email = template.find("input[name=email]").value;
		check(email, String);
		return Meteor.call("orders/addOrderEmail", Template.parentData()._id, email);
	}
});
