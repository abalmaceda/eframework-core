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


/** productDetailEdit events */
Template.productDetailEdit.events({
	/**
	 * @summary Evento que se ejecuta cuando se detecta cambios de input en el textarea.
	 * @event {change}
	 * @returns {void}
	 */
	 /* Entender como funciona */
	"change input,textarea": function (event) {
		/* TODO : entender esta funcion */
		Meteor.call(
			"products/updateProductField",
			selectedProductId(),
			this.field,
			$(event.currentTarget).val(), function (error, results) {
				/* Si el cambio resultó exitosamente entonces agregamos un efecto visual de feedback */
				if (results) {
					/* TODO ; Entender como funciona la animación */
					return $(event.currentTarget).animate({ backgroundColor: "#e2f2e2" }).animate({ backgroundColor: "#fff" });
				}
			}
		);
		/* TODO: no entendí por que es necesario agregar un autosize */
		if (this.type === "textarea") {
			autosize($(event.currentTarget));
		}
		/* TODO : tampoco se para que es esto. */
		return Session.set("editing-" + this.field, false);
	}
});

/* productDetailField events */
Template.productDetailField.events({
	/**
	 * @summary.
	 * @event {click}
	 * @returns {void}
	 */
	 /*  TODO:Entender como funciona este codigo. Y su razon de ser. Me da la impresión que este código permite a un administrador editar la información de un producto del cual el no es propietario ( pertenece a otro usuario). Por ejemplo si contiene algun mensaje ofensivo, etc. */
	"click .product-detail-field": function () {
		/** Se ejecutara solo si el usuario tiene permisos de adminstrador */
		if (EFrameworkCore.hasOwnerAccess()) {
			let fieldClass = "editing-" + this.field;
			Session.set(fieldClass, true);
			/* Llamando Tracker.flush() fuerza a que cualquier función con "invalidated computation object "  ejecutarse inmediatamente */
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
