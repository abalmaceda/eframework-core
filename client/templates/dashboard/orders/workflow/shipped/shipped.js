 /**
 * Template.coreShipmentShipped.events
 * @summary Events para Template.coreShipmentShipped
 */
Template.coreShipmentShipped.events({
	/**
	* @event click .btn
	* @summary
	* @param {String} event -
	* @param {Blaze.Template} template -
	*/
	"click .btn": function (event, template) {
		Meteor.call("order/orderShipped", this._id);
		Meteor.call("workflow/pushOrderWorkflow", "coreOrderWorkflow", "orderShipped", this._id);
	}
});
