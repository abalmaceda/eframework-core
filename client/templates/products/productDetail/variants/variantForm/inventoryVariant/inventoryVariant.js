/**
 * Template.inventoryVariantForm.helpers
 * @summary Helpers para Template.inventoryVariantForm
 */
Template.inventoryVariantForm.helpers({
	/**
	 * @summary
	 * @returns {String}
	 * @todo Documentar
	 */
	inventoryVariantFormId: function () {
		return "inventory-variant-form-" + this._id;
	},

	/**
	 * @summary
	 * @returns {String}
	 * @todo Documentar
	 */
	removeInventoryVariantId: function () {
		return "remove-inventory-variant-" + this._id;
	}
});

/**
 * Template.inventoryVariantForm.events
 * @summary Events para Template.inventoryVariantForm
 */
Template.inventoryVariantForm.events({
	/**
	 * @summary
	 * @event click .inventory-variant-form :input, click li
	 * @returns {void}
	 */
	"click .inventory-variant-form :input, click li": function (event, template) {
		return setCurrentVariant(template.data._id);
	},

	/**
	 * @summary
	 * @event change .inventory-variant-form :input
	 * @returns {void}
	 */
	"change .inventory-variant-form :input": function (event, template) {
		let variant = template.data;
		let value = $(event.currentTarget).val();
		let field = $(event.currentTarget).attr("name");
		variant[field] = value;
		/*Informa al servidor del cambio del variant*/
		Meteor.call("products/updateVariant", variant, function (error) {
			if (error) {
				throw new Meteor.Error("error updating variant", error);
			}
		});
		/*TODO: Descomentar esto si tiene sentido. Dado que para que haya un evento "change" tuvo que existir antes un evento "click". Entonces ya se hizo  */
		//return setCurrentVariant(template.data._id);
	},

	/**
	 * @summary Elimina inventory Variant
	 * @event click .remove-inventory-variant
	 * @returns {void}
	 */
	"click .remove-inventory-variant": function (event) {
		event.stopPropagation();
		event.preventDefault();
		let barcode = this.barcode || "barcode not found";
		if (confirm(i18n.t("productDetail.confirmDeleteBarcode") + ": " + barcode)) {
			let id = this._id;
			return Meteor.call("products/deleteVariant", id, function (error, result) {
				if (result && selectedVariantId() === id) {
					return setCurrentVariant(null);
				}
			});
		}
	}
});

/**
 * Template.generateInventoryVariantForm.events
 * @summary Events para Template.generateInventoryVariantForm
 */
Template.generateInventoryVariantForm.events({
	/**
	 * @summary
	 * @event submit .generate-inventory-variants-form
	 * @returns {void}
	 * @todo Documentar
	 */
	"submit .generate-inventory-variants-form": function (event) {
		event.stopPropagation();
		/* Evita que se haga un refresh de la pagina*/
		event.preventDefault();
		let productId = selectedProductId();
		let qty = event.target.generateqty.value;
		if (qty && parseInt(qty, 10) > 0) {
			Meteor.call("products/createInventoryVariants", productId, this._id, qty);
			event.target.generateqty.value = "";
		} else {
			Alerts.add(
				i18n.t("productDetail.quantityGreaterThanZero"),
				danger,
				{ placement: "generateBarcodes" }
			);
		}
		return false;
	}
});

/**
 * Template.addInventoryVariantForm.events
 * @summary Events para Template.addInventoryVariantForm
 */
Template.addInventoryVariantForm.events({
	"submit .add-inventory-variant-form": function (event) {
		event.stopPropagation();
		event.preventDefault();
		let productId = selectedProductId();
		let barcode = event.target.barcode.value;
		Meteor.call("products/createInventoryVariant", productId, this._id, {
			barcode: barcode
		});
		event.target.barcode.value = "";
		return false;
	}
});
