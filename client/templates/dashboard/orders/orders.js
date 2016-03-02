/**
 * Template.orders.helpers
 * @summary Helpers para Template.orders
 */
Template.orders.helpers({
	/**
	 * @method orders
	 * @summary Obtiene todas las Orders correspondientes al usuario actual
	 * @returns {Orders[]} Array de Orders
	 */
	orders : function() {
		return EFrameworkCore.Collections.Orders.find({});
	},

	/**
	 * @method settings
	 * @summary
	 * @returns {}
	 * @todo
	 * @deprecated
	 */
//   settings: function () {
//     // ensure sub is up to date
//     EFrameworkCore.Subscriptions.Orders = Meteor.subscribe("Orders");
//     // return reactive-table setup
//     return {
//       collection: EFrameworkCore.Collections.Orders,
//       rowsPerPage: 10,
//       showFilter: false,
//       showNavigation: true,
//       fields: [
//           { key: 'userId', label: 'User', tmpl: Template.orderDetail },
//           { key: 'items', label: 'Items', tmpl: Template.ordersListItems},
//           { key: 'workflow.status', label: 'Status', tmpl: Template.orderStatusDetail },
//           { key: 'invoices', label: 'Summary', tmpl: Template.ordersListSummary}
//       ]
//     };
//   },

	/**
	 * @method isOrder
	 * @summary
	 * @returns {}
	 * @todo
	 * @deprecated
	 */
//   isOrder: function () {
//     if (this._id) {
//       return true;
//     } else {
//       return false;
//     }
//   }
});

/**
 * Template.orders.events
 * @summary Events para Template.orders
 */
Template.orders.events({
//   'click .reactive-table tbody tr': function (event) {
//     if (this.workflow.status === "new") {
//       this.workflow.status = "coreOrderCreated";
//       Meteor.call("workflow/pushOrderWorkflow", "coreOrderWorkflow", "coreOrderCreated", this._id);
//     }

//     EFrameworkCore.showActionView({
//       label: "Order Details",
//       data: this,
//       template: "coreOrderWorkflow"
//     });

//   }
});

/**
 * Template.orderViewButton.events
 * @summary Events para Template.orderViewButton
 */
Template.orderViewButton.events({
	/**
	* @event click button
	* @summary
	* @param {String} event -
	* @param {Blaze.Template} template -
	* @returns {}
	* @this What_does_the_THIS_keyword_refer_to_here
	* @todo this
	*/
	'click button': function (event, template) {
		if (this.workflow.status === "new") {
			this.workflow.status = "coreOrderCreated";
			Meteor.call("workflow/pushOrderWorkflow", "coreOrderWorkflow", "coreOrderCreated", this._id);
		}

		//Vista settings para editar la Order
		EFrameworkCore.showActionView({
			label: "Order Details",
			data: this,
			template: "coreOrderWorkflow"
		});
	}
});
