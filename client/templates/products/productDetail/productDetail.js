/**
 * Template.productDetail.helpers
 * @summary Helpers para Template.productDetail
 */
Template.productDetail.helpers({
	/**
	* @function tags
	* @summary Retorna los tags do producto seleccionado actualmente
	* @return [Template]
	*/
	tags: function () {
		let product = selectedProduct();
		if (product) {
			if (product.hashtags) {
				return _.map(product.hashtags, function (id) {
					return Tags.findOne(id);
				});
			}
		}
	},
	/**
	* @function tagsComponent
	* @summary Retorna el Template de descripción de los Tags dependiendo si es propietario o no
	* @return [Template]
	*/
	tagsComponent: function () {
		if (EFrameworkCore.hasPermission("createProduct")) {
			return Template.productTagInputForm;
		}
		return Template.productDetailTags;
	},
	/**
	* @function actualPrice
	* @summary Retorna el Template de descripción de los Tags dependiendo si es propietario o no
	* @return [Template]
	*/
	actualPrice: function () {
		let childVariants;
		let purchasable;
		let current = selectedVariant();
		let product = selectedProduct();
		if (product && current) {
			childVariants = (function () {
				let _results = [];
				/* TODO : ( NO estoy seguro ) En este for se verifica que cada variant.parendId en el product sea igual al current._id
					Si el current._id pertenece al variant seleccionado. Entonces solo habría uno.... Tal vez me falta entender mejor que es un Variant.
					PArece que ve todos los variants, con la idea de poner el invervalo de precios.
				*/
				for (let variant of product.variants) {
					if ((variant !== null ? variant.parentId : void 0) === current._id) {
						_results.push(variant);
					}
				}
				return _results;
			})();
			/* TODO : no entiendo por que si es mayor, entonces es falso */
			purchasable = childVariants.length > 0 ? false : true;
		}
		if (purchasable) {
			return current.price;
		}
		return getProductPriceRange();
	},

	/**
	* @function fieldComponent
	* @summary Retorna el Template dependiendo de los permisos del usuario (creación o solo lectura)
	* @return [Template]
	*/
	fieldComponent: function () {
		if (EFrameworkCore.hasPermission("createProduct")) {
			return Template.productDetailEdit;
		}
		return Template.productDetailField;
	},
	/**
	* @function metaComponent
	* @summary Retorna el Template dependiendo de los permisos del usuario
	* @return {Template}
	* @todo Mejorar descripcion, hablar de los Templates
	*/
	metaComponent: function () {
		if (EFrameworkCore.hasPermission("createProduct")) {
			return Template.productMetaFieldForm;
		}
		return Template.productMetaField;
	}
});

/**
 * Template.productDetail.events
 * @summary Events para Template.productDetail
 */
Template.productDetail.events({
	/**
	 * @summary Focus sobre el elemento variant al cual pertenece el price ( Recordar que al haber mas de un variant, hay un intervalo de precio)
	 * @event click #price
	 * @returns {void}
	 * @todo Documentar
	 */
	"click #price": function () {
		let formName;
		if (EFrameworkCore.hasPermission("createProduct")) {
			let variant = selectedVariant();
			if (!variant) {
				return;
			}

			if (variant.parentId) {
				formName = variant.parentId;
			} else {
				formName = variant._id;
			}
			formName = "variant-form-" + formName;
			Session.set(formName, true);
			$(`#${formName}[name="price"]`).focus();
		}
	},
	/**
	 * @summary Elimina las acciones del botón
	 * @event click #add-to-cart-quantity
	 * @returns {void}
	 * @todo Documentar
	 */
	"click #add-to-cart-quantity": function (event) {
		event.preventDefault();
		return event.stopPropagation();
	},
	/**
	 * @summary Constructor_for_a_Collection
	 * @event change #add-to-cart-quantity
	 * @returns {void}
	 * @todo Si cambio la option de product ( otra variant), la cantidad del cart no se actualiza de ser necesario.
	 * Ejemplo: Tengo producto A : inventario 5 ; producto B : inventario 1. Si tengo seleccionado el producto A y en el carro tengo 5 productos, al cambiar al producto B, la cantidad del carro seguira siendo 5, en condiciones que el producto B solo tiene un máximo de 1 de stock.
	 */
	"change #add-to-cart-quantity": function (event, template) {
		let currentVariant;
		let qtyField;
		let quantity;
		event.preventDefault();
		event.stopPropagation();
		currentVariant = selectedVariant();
		if (currentVariant) {
			qtyField = template.$('input[name="addToCartQty"]');
			quantity = qtyField.val();
			if (quantity < 1) {
				quantity = 1;
			}
			if (currentVariant.inventoryPolicy && quantity > currentVariant.inventoryQuantity) {
				qtyField.val(currentVariant.inventoryQuantity);
			}
		}
	},
	/**
	 * @summary Elimina las acciones del botón
	 * @event click #add-to-cart-quantity
	 * @returns {void}
	 * @todo Documentar
	 */
	"click #add-to-cart": function (event, template) {
		let cartId;
		let count;
		let options;
		let productId;
		let qtyField;
		let quantity;
		let currentVariant = selectedVariant();
		let currentProduct = selectedProduct();

		//Si tengo un Variant seleccionado
		if (currentVariant) {
			if (currentVariant.parentId === null) {
				options = (function () {
					let _results = [];
					for (let variant of currentProduct.variants) {
						if (variant.parentId === currentVariant._id) {
							_results.push(variant);
						}
					}
					return _results;
				})();

				if (options.length > 0) {
					Alerts.add("Please choose options before adding to cart", "danger", {
						placement 	: "productDetail",
						i18nKey 	: "productDetail.chooseOptions",
						autoHide 	: 10000
					});
					return [];
				}
			}
			//Si tengo politicas de inventario ( mostrar alertas de inventario ) y el inventario es menor que uno ( no tengo inventario )
			if (currentVariant.inventoryPolicy && currentVariant.inventoryQuantity < 1) {
				Alerts.add("Sorry, this item is out of stock!", "danger", {
					placement: "productDetail",
					i18nKey: "productDetail.outOfStock",
					autoHide: 10000
				});
				return [];
			}

			qtyField = template.$('input[name="addToCartQty"]');
			quantity = qtyField.val();

			if (quantity < 1) {
				quantity = 1;
			}
			//Se define que si el producto no es visible, entonces no se venderá. Este caso se da cuando el mismo creador, intenta agregar al cart el producto, en condiciones que este no es visible.
			if (!this.isVisible) {
				Alerts.add("Publish product before adding to cart.", "danger", {
					placement: "productDetail",
					i18nKey: "productDetail.publishFirst",
					autoHide: 10000
				});
			} else {
				cartId = EFrameworkCore.Collections.Cart.findOne()._id;
				productId = currentProduct._id;

				if (cartId && productId) {
					count = EFrameworkCore.Collections.Cart.findOne(cartId).cartCount() || 0;

					Meteor.call("cart/addToCart", cartId, productId, currentVariant, quantity, function (error) {
					let address;
						if (!error && count === 0) {
							address = Session.get("address");
							if (!address) {
								return locateUser();
							}
						} else if (error) {
							EFrameworkCore.Log.error("Failed to add to cart.", error);
							return error;
						}
					});
				}

				template.$(".variant-select-option").removeClass("active");
				setCurrentVariant(null);
				qtyField.val(1);
				// scroll to top on cart add
				$("html,body").animate({ scrollTop: 0 }, 0);
				// slide out label
				let addToCartText = i18n.t("productDetail.addedToCart");
				let addToCartTitle = currentVariant.title;
				$(".cart-alert-text").text(`${quantity} ${addToCartTitle} ${addToCartText}`);
				return $(".cart-alert").toggle("slide", {
					direction: i18n.t("languageDirection") === "rtl" ? "left" : "right",
					width: currentVariant.title.length + 50 + "px"
				}, 600).delay(4000).toggle("slide", {
					direction: i18n.t("languageDirection") === "rtl" ? "left" : "right"
				});
			}
		}
		/*En caso de que no tenga ningun variant seleccionado, no hay nada que agregar al "cart".*/
		else {
			Alerts.add("Select an option before adding to cart", "danger", {
				placement: "productDetail",
				i18nKey: "productDetail.selectOption",
				autoHide: 8000
			});
		}
	},
	/**
	 * @summary
	 * @event click .toggle-product-isVisible-link
	 * @returns {void}
	 * @todo Documentar
	 */
	"click [data-event-action=toggle-product-isVisible]": function (event, template) {
		let errorMsg = "";
		if (!this.title) {
			errorMsg += "Product title is required. ";
			template.$(".title-edit-input").focus();
		}
		let variants = this.variants;
		for (let variant of variants) {
			let index = _.indexOf(variants, variant);
			if (!variant.title) {
				errorMsg += "Variant " + (index + 1) + " label is required. ";
			}
			if (!variant.price) {
				errorMsg += "Variant " + (index + 1) + " price is required. ";
			}
		}
		if (errorMsg.length) {
				Alerts.add(errorMsg, "danger", {
				placement: "productManagement",
				i18nKey: "productDetail.errorMsg"
			});
		} else {
			Meteor.call("products/publishProduct", this._id);
		}
	},
	/**
	 * @summary Elimina el producto actual
	 * @event click .delete-product-link
	 * @returns {void}
	 */
	"click .delete-product-link": function () {
		maybeDeleteProduct(this);
	},
//   "click .fa-facebook": function () {
//     if (EFrameworkCore.hasPermission("createProduct")) {
//       $(".facebookMsg-edit").fadeIn();
//       return $(".facebookMsg-edit-input").focus();
//     }
//   },
//   "click .fa-twitter": function () {
//     if (EFrameworkCore.hasPermission("createProduct")) {
//       $(".twitterMsg-edit").fadeIn();
//       return $(".twitterMsg-edit-input").focus();
//     }
//   },
//   "click .fa-pinterest": function () {
//     if (EFrameworkCore.hasPermission("createProduct")) {
//       $(".pinterestMsg-edit").fadeIn();
//       return $(".pinterestMsg-edit-input").focus();
//     }
//   },
//   "click .fa-google-plus": function () {
//     if (EFrameworkCore.hasPermission("createProduct")) {
//       $(".googleplusMsg-edit").fadeIn();
//       return $(".googleplusMsg-edit-input").focus();
//     }
//   },
//   "focusout .facebookMsg-edit-input,.twitterMsg-edit-input,.pinterestMsg-edit-input,.googleplusMsg-edit": function () {
//     Session.set("editing-" + this.field, false);
//     return $(".social-media-inputs > *").hide();
//   }
});
