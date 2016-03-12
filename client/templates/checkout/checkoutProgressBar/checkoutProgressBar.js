/**
 * checkoutProgressBar helpers
 * progressbar status: "visited first","previous visited","active","next"
 */

/**
 * Template.checkoutProgressBar.helpers
 * @summary Helpers para Template.checkoutProgressBar
 */
Template.checkoutProgressBar.helpers({
	/**
	 * @function cart
	 * @summary Busca un cart del usuario
	 * @returns {Cart}
	 * @todo
	 */
	progressbarStatusClass: function () {
		var cartWorkflow = EFrameworkCore.Collections.Cart.findOne().workflow;
		var thisStep = (cartWorkflow.status === this.template); // active
		var previouslyVisited = _.contains(cartWorkflow.workflow, this.template);

		if (previouslyVisited === true && thisStep === false) {
			return "visited";
		}
		else if (thisStep === true) {
			//return "visited active";
			return "active"
		}
		else {
			return "";
		}
	}
});
