/**
* review status
* trigger checkoutPayment step on template checkoutReview render
*/
/**
 * Template.cartCheckout.onRendered
 * @summary Gatilla el step checkoutPayment
 */
Template.checkoutReview.onRendered(function () {
	//TODO: Entender que hace esto
	Meteor.call("workflow/pushCartWorkflow", "coreCartWorkflow", "checkoutReview");
});
