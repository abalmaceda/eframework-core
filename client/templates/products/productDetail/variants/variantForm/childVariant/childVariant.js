/**
 * childVariantForm helpers
 */

Template.childVariantForm.helpers({
	/**
	 * childVariantFormId
	 * @summary
	 * @returns {String}
	 * @todo Documentar
	 */
	childVariantFormId: function () {
		return "child-variant-form-" + this._id;
	},
	/**
	 * @summary
	 * @returns {Boolean} True
	 * @todo Documentar
	 */
	hasInventoryVariants: function () {
		if (checkInventoryVariants(this._id) > 0) {
			return true;
		}
	},

	/**
	 * inventoryVariants
	 * @summary
	 * @returns {Variant[]}
	 * @todo Documentar
	 */
	 /*TODO: Que es un inventory variant*/
	inventoryVariants: function () {
		let product = selectedProduct();
		if (!product) {
			return [];
		}
		let _results = [];
		for (let variant of product.variants) {
			if ((variant !== null ? variant.parentId : void 0) === this._id && variant.type === "inventory") {
				_results.push(variant);
			}
		}
		return _results.reverse();
	},
	/**
	 * @summary Entrega clase CSS para esconder o visualizar el inventario
	 * @returns {String} String correspondiente a clase CSS
	 * @todo Documentar
	 */
	showInventoryVariants: function () {
		if (Session.get("showInventoryVariants" + this._id)) {
			return "";
		}
		return "hidden";
	},
	/**
	 * @summary Texto que debe tener el bóton edit inventory
	 * @returns {String} texto
	 * @todo Documentar
	 */
	editInventoryToggleText: function () {
		if (Session.get("showInventoryVariants" + this._id)) {
			return i18n.t("productDetail.hideBarcodes");
		}
		return i18n.t("productDetail.showBarcodes");
	}
});

/**
 * Template.childVariantForm.events
 * @summary Events para Template.childVariantForm
 */
Template.childVariantForm.events({
	"click .child-variant-form :input, click li": function (event, template) {
	return setCurrentVariant(template.data._id);
	},

	/**
	 * @summary Elimina un child Variant
	 * @event click .edit-inventory-variants
	 * @returns {void}
	 */
	"click .edit-inventory-variants": function () {
		let showInventoryVariantsId = "showInventoryVariants" + this._id;
		/*Se guarda el estado en una variable Session, para que todo siga igual incluso si me cambio de pagina dentro del sitio*/
		if (!Session.get(showInventoryVariantsId)) {
			return Session.set(showInventoryVariantsId, true);
		}
		return Session.set(showInventoryVariantsId, false);
	},

	/**
	 * @summary Elimina un child Variant
	 * @event click .init-inventory-variants
	 * @returns {}
	 * @todo Documentar
	 */
	"click .init-inventory-variants": function () {
		let showInventoryVariantsId = "showInventoryVariants" + this._id;
		Session.set(showInventoryVariantsId, true);
		let productId = selectedProductId();
		/*TODO*/
		return Meteor.call("products/createInventoryVariants", productId, this._id, this.inventoryQuantity, "default");
	},

	/**
	 * @summary Elimina un child Variant
	 * @event change .child-variant-form :input
	 * @returns {}
	 */
	"change .child-variant-form :input": function (event, template) {
		let variant = template.data;
		let value = $(event.currentTarget).val();
		let field = $(event.currentTarget).attr("name");

		/*Variant viene con los valores justo antes de realizar la modificación. Por eso es necesario settear el valor del campo que se ha editado. */
		variant[field] = value;
		Meteor.call("products/updateVariant", variant, function (error) {
			if (error) {
				throw new Meteor.Error("error updating variant", error);
			}
		});
		return setCurrentVariant(template.data._id);
	},

	/**
	 * @summary Elimina un child Variant
	 * @event click #remove-child-variant
	 * @returns {}
	 */
	"click #remove-child-variant": function (event) {
		event.stopPropagation();
		event.preventDefault();
		let optionTitle = this.optionTitle || "this option";
		/*Primero consulta si esta de acuerdo en borrar */
		if (confirm("Are you sure you want to delete " + optionTitle)) {
			let id = this._id;
			return Meteor.call("products/deleteVariant", id, function (error, result) {
				if (result && selectedVariantId() === id) {
					return setCurrentVariant(null);
				}
			});
		}
	}
});
