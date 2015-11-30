/**
* review status
* trigger checkoutPayment step on template checkoutReview render
*/
//TODO
Template.checkoutReview.onRendered(function () {
  Meteor.call("workflow/pushCartWorkflow", "coreCartWorkflow", "checkoutReview");
});
