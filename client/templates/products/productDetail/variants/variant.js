
/**
 * Template.variant.helpers
 * @summary Helpers para Template.variant
 */
Template.variant.helpers({
	/**
	 * progressBar
	 * @summary Informa si hay stock disponible
	 * @returns {Boolean} true si hay stock, false si no queda
	 * @todo Documentar y descomentar
	 */
	// progressBar: function() {
	// 	if (this.inventoryPercentage <= 10) {
	// 		return "progress-bar-danger";
	// 	} else if (this.inventoryPercentage <= 30) {
	// 		return "progress-bar-warning";
	// 	} else {
	// 		return "progress-bar-success";
	// 	}
	// },
	/**
	 * selectedVariant
	 * @summary Agrega Feedback al Variant seleccionado
	 * @returns {String} CSS para destacar la Variant seleccionada
	 */
	selectedVariant: function() {
		var current;
		current = selectedVariant();
		/*TODO: entender que hace aca*/
		if ((this._id === (current != null ? current._id : void 0)) || (this._id === (current != null ? current.parentId : void 0))) {
			return "variant-detail-selected";
		}
	},
	/**
	 * displayPrice
	 * @summary Constructor_for_a_Collection
	 * @returns {String} Rango de precios
	 */
	displayPrice: function() {
		return getVariantPriceRange(this._id);
	},
	/**
	 * isSoldOut
	 * @summary Informa si hay stock disponible
	 * @returns {Boolean} true si hay stock, false si no queda
	 */
	isSoldOut: function() {
		if (this.inventoryQuantity < 1) {
			return true;
		}
		return false;
	}
});

/**
 * Template.variant.events
 * @summary Eventos para Template.variant
 */
Template.variant.events({
	/**
	 * @summary Constructor_for_a_Collection
	 * @event click .variant-edit
	 * @param {event} event
	 * @returns {}
	 * @todo Documentar
	 */
	"click .variant-edit": function(event) {
		/* Selecciono al Variant */
		setCurrentVariant(this._id);
		return toggleSession("variant-form-" + this._id);
	},
	/**
	 * @summary Constructor_for_a_Collection
	 * @event click .variant-edit
	 * @param {event} event
	 * @returns {}
	 * @todo Documentar
	 */
	"dblclick .variant-detail": function(event) {
		/*Esta funcion es para editar. Por eso verificamos si tiene permisos "createProduct" */
		if (EFrameworkCore.hasPermission('createProduct')) {
			/* Selecciono al Variant */
			setCurrentVariant(this._id);
			return toggleSession("variant-form-" + this._id);
		}
	},
	/**
	 * @summary Constructor_for_a_Collection
	 * @event click .variant-detail > *
	 * @param {event} event
	 * @returns {}
	 * @todo Documentar
	 */
	"click .variant-detail > *": function(event) {
		event.preventDefault();
		event.stopPropagation();
		Alerts.removeSeen();
		/* Selecciono al Variant */
		return setCurrentVariant(this._id);
	}
});

/**
 * Template.variant.onRendered
 * @summary Evento onRendered para Template.variant
 */
Template.variant.onRendered(function() {
	return this.autorun(function() {
		var variantSort;
		if (EFrameworkCore.hasPermission('createProduct')) {
			variantSort = $(".variant-list");
			return variantSort.sortable({
				items: "> li.variant-list-item",
				cursor: "move",
				opacity: 0.3,
				helper: "clone",
				placeholder: "variant-sortable",
				forcePlaceholderSize: true,
				axis: "y",
				/*TODO: Entender que sucede aca*/
				update: function(event, ui) {
					var id, index, newVariants, pindex, productVariants, uiPositions, updateVariants, variant, _i, _j, _len, _len1, _ref;
					productVariants = (_ref = selectedProduct()) != null ? _ref.variants : void 0;
					uiPositions = $(this).sortable("toArray", {
					attribute: "data-id"
					});
					newVariants = [];
					for (index = _i = 0, _len = uiPositions.length; _i < _len; index = ++_i) {
						id = uiPositions[index];
						for (pindex = _j = 0, _len1 = productVariants.length; _j < _len1; pindex = ++_j) {
							variant = productVariants[pindex];
							if ((variant != null ? variant._id : void 0) === id) {
								newVariants[index] = variant;
								delete productVariants[pindex];
							}
						}
					}
					updateVariants = _.union(productVariants, newVariants);
					return Meteor.defer(function() {
						return Meteor.call("products/updateVariants", updateVariants);
					});
				},
				start: function(event, ui) {
					ui.placeholder.height(ui.helper.height());
					ui.placeholder.html("Drop variant to reorder");
					ui.placeholder.css("padding-top", ui.helper.height() / 3);
					ui.placeholder.css("border", "1px dashed #ccc");
					return ui.placeholder.css("border-radius", "6px");
				}
			});
		}
	});
});
