//
// cartCheckout is a wrapper template
// controlling the load order of checkout step templates
//
//
// If you are looking for:
//  - cartWorkflow
//  - cartWorkflowPosition
//  - cartWorkflowCompleted
// see helpers/cart.coffee
//

/**
 * Template.cartCheckout.helpers
 * @summary Helpers para Template.cartCheckout
 */
Template.cartCheckout.helpers({
	/**
	 * @function cart
	 * @summary Busca un cart del usuario
	 * @returns {Cart}
	 */
	cart: function () {
		return EFrameworkCore.Collections.Cart.findOne();
	}
});

Template.cartCheckout.onRendered(function () {
	// ensure checkout drawer does not display
	Session.set("displayCartDrawer", false);
	// init cart workflow
	if (!EFrameworkCore.Collections.Cart.findOne().workflow.workflow) {
		Meteor.call("workflow/pushCartWorkflow", "coreCartWorkflow", "checkoutLogin");
	}
});

 /**
 * Template.checkoutSteps.helpers
 * @summary Helpers para Template.checkoutSteps
 */
Template.checkoutSteps.helpers({

	/**
	 * @function checkoutStepBadgeClass
	 * @summary
	 * @returns {String}
	 */
	isCompleted: function () {
		if (this.status === true) {
			return this.status;
		}
		return false;
	},

	/**
	 * @function checkoutStepBadgeClass
	 * @summary helper isPending evaluates that this is
 	 * the current step, or has been processed already
	 * @returns {String}
	 * @todo
	 */
	isPending: function () {
		if (this.status === this.template) {
			return this.status;
		}
		return false;
	}
});

/**
 * Template.checkoutStepBadge.helpers
 * @summary Helpers para Template.checkoutStepBadge
 */
Template.checkoutStepBadge.helpers({
	/**
	 * @function checkoutStepBadgeClass
	 * @summary
	 * @returns {String}
	 */
	checkoutStepBadgeClass: function () {
		let workflowStep = Template.instance().data;
		// let currentStatus = EFrameworkCore.Collections.Cart.findOne().workflow.status;
		if (workflowStep.status === true || workflowStep.status === this.template) {
			return "active";
		}
		return "";
	}
});
