// /**
//  * productMetaFieldForm events
//  */

// Template.productMetaFieldForm.events({
//   "click .metafield-remove": function () {
//     let productId;
//     productId = selectedProductId();
//     return Products.update(productId, {
//       $pull: {
//         metafields: this
//       }
//     });
//   }
// });

/**
 * metaComponent helpers
 */

//Template.metaComponent.events({
	/**
	* Graba los cambios en los campos simplemente cambiando el foco.
	* @note Se guarda automaticamente. No es necesario presionar un boton guardar.
	* @event name [description]
	* Event tags
	* @param event [Event] Información de los elemntos DOM del contexto
	* @todo Comentar código
	*/
	/*
	"change input": function (event) {
		let updateMeta = {
			key: $(event.currentTarget).parent().children(".metafield-key-input").val(),
			value: $(event.currentTarget).parent().children(".metafield-value-input").val()
		};
		if (this.key) {
			let productId = selectedProductId();
			Meteor.call("products/updateMetaFields", productId, updateMeta,this);
			$(event.currentTarget).animate({
				backgroundColor: "#e2f2e2"
			}).animate({
				backgroundColor: "#fff"
			});
			return Tracker.flush();
		}

		if (updateMeta.value && !updateMeta.key) {
			$(event.currentTarget).parent().children(".metafield-key-input").val("").focus();
		}
		if (updateMeta.key && updateMeta.value) {
			Meteor.call("products/updateMetaFields", this._id, updateMeta);
			Tracker.flush();
			$(event.currentTarget).parent().children(".metafield-key-input").val("").focus();
			return $(event.currentTarget).parent().children(".metafield-value-input").val("");
		}
	}
	*/
//});
