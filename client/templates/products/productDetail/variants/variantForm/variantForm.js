/**
 * variantForm helpers
 */
/* TODO */
Template.variantForm.helpers({
  // variantDetails: function () {
  //   if (this.parentId === null) {
  //     return Template.parentVariantForm;
  //   }
  //   return Template.childVariantForm;
  // },
  	/**
  	 * childVariants
  	 * @summary
  	 * @todo Entender como funciona. Entender que es un childVariant
  	 */
	childVariants: function () {
		let product = selectedProduct();
		if (!product) {
			return {};
		}
		let _results = [];
		for (let variant of product.variants) {
			if ((variant !== null ? variant.parentId : void 0) === this._id && variant.type !== "inventory") {
				_results.push(variant);
			}
		}
		return _results;
	},
	/**
  	 * hasChildVariants
  	 * @summary Verifica si existen childVariants
  	 * @returns {Boolean} true si tiene childVariants
  	 */
	hasChildVariants: function () {
		if (checkChildVariants(this._id) > 0) {
			return true;
		}
	},
	/**
	* hasInventoryVariants
	* @summary
	* @return {Boolean}
	* @todo Docuentacion
	*/
	hasInventoryVariants: function () {
		if (!hasChildVariants()) {
			if (checkInventoryVariants(this._id) > 0) {
				return true;
			}
		}
	},
  // nowDate: function () {
  //   return new Date();
  // },
	/**
	* @summary id del Variant Form
	* @return {String} id del VariantForm
	*/
	variantFormId: function () {
		return "variant-form-" + this._id;
	},
	/**
	* variantFormVisible
	* @summary Oculta la información de los Variant
	* @return {String} CSS atributo para ociltar
	* @todo Docuentacion
	*/
	variantFormVisible: function () {
		if (!Session.equals("variant-form-" + this._id, true)) {
			return "hidden";
		}
	},
  	/**
  	* displayInventoryManagement
	* @summary Retorna Propiedad CSS para ocultar Layouts
	* @return {String} String si el inventoryManagement es false
	*/
	displayInventoryManagement: function () {
		if (this.inventoryManagement !== true) {
			return "display:none;";
		}
	},
  	/**
  	* displayLowInventoryWarning
	* @summary Retorna Propiedad CSS para ocultar Layouts
	* @return {String} String si el inventoryManagement es false
	*/
	displayLowInventoryWarning: function () {
		/* TODO : Que es inventoryManagement */
		if (this.inventoryManagement !== true) {
			return "display:none;";
		}
	}
});

/**
 * variantForm events
 */
/* TODO */
Template.variantForm.events({
	"change form :input": function (event, template) {
		let formId;
		formId = "#variant-form-" + template.data._id;
		template.$(formId).submit();
		setCurrentVariant(template.data._id);
	},
	/**
	* @summary Crea un nuevo child Variant
	* @event click .btn-child-variant-form
	* @return {void}
	* @todo Docuentacion
	*/
	"click .btn-child-variant-form": function (event, template) {
		let productId;
		event.stopPropagation();
		event.preventDefault();
		productId = selectedProductId();
		if (!productId) {
			return;
		}
		Meteor.call("products/cloneVariant", productId, template.data._id, this._id);
	},

  	/**
	* @summary Elimina el Variant
	* @event click .btn-remove-variant
	* @return {String}
	* @todo Docuentacion
	*/
	"click .btn-remove-variant": function () {
		let title = this.title || "this variant";
		/*TODO: Localizar texto */
		/*Poner bootstrap popup*/
		if (confirm("Are you sure you want to delete " + title)) {
			let id = this._id;
			Meteor.call("products/deleteVariant", id, function (error, result) {
				if (result && selectedVariantId() === id) {
					return setCurrentVariant(null);
				}
			});
		}
	},
	/**
	* @summary Clona un Variant
	* @event click .btn-clone-variant
	* @return {}
	* @todo Docuentacion
	*/
	"click .btn-clone-variant": function (event, template) {
		let productId;
		event.stopPropagation();
		event.preventDefault();
		productId = selectedProductId();
		if (!productId) {
			return;
		}
		Meteor.call("products/cloneVariant", productId, template.data._id, function (error, result) {
			return toggleSession("variant-form-" + result);
		});
	}
});
