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

Template.metaComponent.events({
	/**
	* Graba los cambios en los campos simplemente cambiando el foco.
	* @note Se guarda automaticamente. No es necesario presionar un boton guardar.
	* @event name [description]
	* Event tags
	* @param event [Event] Información de los elemntos DOM del contexto
	* @todo Comentar código
	*/
	
	"change input": function (event) {
		/* Obtengo los valores a guardar*/
		let updateMeta = {
			key: $(event.currentTarget).parent().children(".metafield-key-input").val(),
			value: $(event.currentTarget).parent().children(".metafield-value-input").val()
		};
		/*Este es el caso en donde se editan los campos "key-value" que ya existen */
		if (this.key) {
			let productId = selectedProductId();
			/* Notar que al entregar un terecer atributo ( no null )"products/updateMetaFields" es para hacer update de un metada existente */
			Meteor.call(
				"products/updateMetaFields",
				productId,
				updateMeta,
				this/*,
				function (error, results) {
					if( results){
						// Animación de feedback para mostrar un update correcto 
						$(event.currentTarget).animate({ backgroundColor: "#e2f2e2" }).animate({ backgroundColor: "#fff" });
					}
					else{
						$(event.currentTarget).animate({ backgroundColor: "#e2f2e2" }).animate({ backgroundColor: "#fff" });
					}
				}*/
				);
			$(event.currentTarget).animate({ backgroundColor: "#e2f2e2" }).animate({ backgroundColor: "#fff" });
			/* Para ejecutar acciones inmediatamente en caso de existir errores*/
			return Tracker.flush();
		}

		/* Si solo tiene valor el campo "value", automaticamente ponemos el foco en el campo "key"*/
		if (updateMeta.value && !updateMeta.key) {
			$(event.currentTarget).parent().children(".metafield-key-input").val("").focus();
		}

		/* En el caso de estar creando un nuevo par "key-value" para los detalles. */
		if (updateMeta.key && updateMeta.value) {
			/* TODO: Entender por que este this._id es siempre null */
			Meteor.call("products/updateMetaFields", this._id, updateMeta);
			Tracker.flush();
			$(event.currentTarget).parent().children(".metafield-key-input").val("").focus();
			return $(event.currentTarget).parent().children(".metafield-value-input").val("");
		}
	}
	
});
