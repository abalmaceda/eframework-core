/* TODO */

/**
 * productDetailEdit helpers
 */

// Template.productDetailEdit.helpers({
//   i18nPlaceholder: function () {
//     i18nextDep.depend();
//     let i18nKey = `productDetailEdit.${this.field}`;
//     if (i18n.t(i18nKey) === i18nKey) {
//       EFrameworkCore.Log.info(`returning empty placeholder productDetailEdit: ${i18nKey} no i18n key found.`);
//     } else {
//       return i18n.t(i18nKey);
//     }
//   }
// });

/**
 * productDetailEdit events
 */

// Template.productDetailEdit.events({
// "change input,textarea": function (event) {
// Meteor.call("products/updateProductField", selectedProductId(), this.field,
// $(event.currentTarget).val(),
// function (error, results) {
// if (results) {
// return $(event.currentTarget).animate({
// backgroundColor: "#e2f2e2"
// }).animate({
// backgroundColor: "#fff"
// });
// }
// });
// if (this.type === "textarea") {
// autosize($(event.currentTarget));
// }
// return Session.set("editing-" + this.field, false);
// }
// });

/* productDetailField events */
Template.productDetailField.events({
	/**
	 * @summary Deja el elemento HTML TextArea con el size denido. Esta Funcion  se ejecuto al momento de hacer render del objeto. Se requiere, si no se utiliza no se hace visible los size seteados.
	 * @event {click}
	 * @returns {void}
	 */
	 /*  TODO:Entender como funciona este codigo */
	"click .product-detail-field": function () {
		if (EFrameworkCore.hasOwnerAccess()) {
			let fieldClass = "editing-" + this.field;
			Session.set(fieldClass, true);
			Tracker.flush();
			return $(`.${this.field}-edit-input`).focus();
		}
	}
	
});

/**
 * @summary Deja el elemento HTML TextArea con el size denido. Esta Funcion  se ejecuto al momento de hacer render del objeto. Se requiere, si no se utiliza no se hace visible los size seteados.
 * @returns {void}
 */
Template.productDetailEdit.onRendered(function () {
	return autosize($("textarea"));
});
