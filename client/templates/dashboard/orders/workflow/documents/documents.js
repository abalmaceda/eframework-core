/**
 * coreOrderDocuments helpers and events
 *
 */
Template.coreOrderDocuments.helpers({
  documents: function () {}
});

Template.coreOrderDocuments.events({
  'click .download-documents': function () {
    Meteor.call("orders/documentPrepare", this);
    Meteor.call("workflow/pushOrderWorkflow", "coreOrderWorkflow", "coreOrderDocuments", this._id);
  }
});
