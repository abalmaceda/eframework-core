
// /**
//  * loadMoreProducts
//  * @summary whenever #productScrollLimitLoader becomes visible, retrieve more results
//  * this basically runs this:
//  * Session.set('productScrollLimit', Session.get('productScrollLimit') + ITEMS_INCREMENT);
//  * @return {undefined}
//  */
// function loadMoreProducts() {
//   let threshold;
//   let target = $("#productScrollLimitLoader");
//   if (target.length) {
//     threshold = $(window).scrollTop() + $(window).height() - target.height();
//     if (target.offset().top < threshold) {
//       if (!target.data("visible")) {
//         target.data("productScrollLimit", true);
//         Session.set("productScrollLimit",
//           Session.get("productScrollLimit") + ITEMS_INCREMENT || 10);
//       }
//     } else {
//       if (target.data("visible")) {
//         target.data("visible", false);
//       }
//     }
//   }
// }


/**
 * @summary Ejecuta la función "loadMoreProducts" cada vez que el usuario hace scroll
 */
//$(window).scroll(loadMoreProducts());


/**
 * Template.productGrid.helpers
 * @summary Helpers para Template.productGrid
 */
Template.productGrid.helpers({
//   productScrollLimit: function () {
//     // if count less rows than we asked for, we've got all the rows in the collection.
//     return !(EFrameworkCore.Collections.Products.find().count() < Session.get(
//       "productScrollLimit"));
//   },
	products: function () {
		/*
		* take natural sort, sorting by updatedAt
		* then resort using positions.position for this tag
		* retaining natural sort of untouched items
		*/
		let hashtags;
		let newRelatedTags;
		let position;
		let relatedTags;

		// function to compare and sort position
		function compare(a, b) {
			if (a.position.position === b.position.position) {
				let x = a.position.updatedAt;
				let y = b.position.updatedAt;

				if (x > y) {
					return -1;
				} else if (x < y) {
					return 1;
				}

				return 0;
			}
			return a.position.position - b.position.position;
		}

		let tag = this.tag || this._id || "";
		let selector = {};

		if (tag) {
			hashtags = [];
			relatedTags = [tag];
			while (relatedTags.length) {
				newRelatedTags = [];
				for (let relatedTag of relatedTags) {
					if (hashtags.indexOf(relatedTag._id) === -1) {
						hashtags.push(relatedTag._id);
					}
				}
				relatedTags = newRelatedTags;
			}
			selector.hashtags = { $in: hashtags };
		}

		let gridProducts = Products.find(selector).fetch();

		for (let index in gridProducts) {
			if ({}.hasOwnProperty.call(gridProducts, index)) {
				let gridProduct = gridProducts[index];
				if (gridProduct.positions) {
					let _results = [];
					for (position of gridProduct.positions) {
						if (position.tag === EFrameworkCore.getCurrentTag()) {
							_results.push(position);
						}
						gridProducts[index].position = _results[0];
					}
				}
				if (!gridProduct.position) {
					gridProducts[index].position = {
						position: 0,
						weight: 0,
						pinned: false,
						updatedAt: gridProduct.updatedAt
					};
				}
			}
		}

		return gridProducts.sort(compare);
	}
});

/**
 * Template.productGridItems.helpers
 * @summary Helpers para Template.productGridItems
 */
Template.productGridItems.helpers({
	/* TODO: ARREGLAR FUNCION Y DEFINICION ( no se bien que retorna) */

	/*
	* Template.productGridItems.media
	* @summary Verifica si existe una imagen default para mostrar en el producto
	* @return {Media} returns un puntero a un "Objeto Media" / false
 	*/
 	media: function () {
    // let defaultImage;
    // let variantId;
    // let variants = [];
    // for (let variant of this.variants) {
    //   if (!variant.parentId) {
    //     variants.push(variant);
    //   }
    // }
    // if (variants.length > 0) {
    //   variantId = variants[0]._id;
    //   defaultImage = EFrameworkCore.Collections.Media.findOne({
    //     "metadata.variantId": variantId,
    //     "metadata.priority": 0
    //   });
    // }
    // if (defaultImage) {
    //   return defaultImage;
    // }
    	return false;
	},
//   additionalMedia: function () {
//     let mediaArray;
//     let variantId;
//     let variants = [];

//     for (let variant of this.variants) {
//       if (!variant.parentId) {
//         variants.push(variant);
//       }
//     }

//     if (variants.length > 0) {
//       variantId = variants[0]._id;
//       mediaArray = EFrameworkCore.Collections.Media.find({
//         "metadata.variantId": variantId,
//         "metadata.priority": {
//           $gt: 0
//         }
//       }, {
//         limit: 3
//       });
//     }
//     if (mediaArray.count() > 1) {
//       return mediaArray;
//     }
//     return false;
//   },
//   weightClass: function () {
//     let position = this.position || {};
//     let weight = position.weight || 0;
//     switch (weight) {
//     case 1:
//       return "product-medium";
//     case 2:
//       return "product-large";
//     default:
//       return "product-small";
//     }
//   },
//   isMediumWeight: function () {
//     let position = this.position || {};
//     let weight = position.weight || 0;

//     if (weight === 1) {
//       return true;
//     }
//     return false;
//   },
//   isLargeWeight: function () {
//     let position = this.position || {};
//     let weight = position.weight || 0;
//     if (weight === 3) {
//       return true;
//     }
//     return false;
//   },
//   shouldShowAdditionalImages: function () {
//     if (this.isMediumWeight && this.mediaArray) {
//       return true;
//     }
//     return false;
//   }
});

/**
 * Template.gridNotice.helpers
 * @summary Helpers para Template.gridNotice
 */
Template.gridNotice.helpers({
	/**
	* isLowQuantity
	* @summary Verifica si alguno de los variant tiene un inventario inferior o igual a su cantidad para warning.
	* @return {Boolean} retorna el resultado de la verificación
	*/
	isLowQuantity: function () {
		let variants = [];
		for (let variant of this.variants) {
			/*TODO: entender que significa el parentId*/
			if (!variant.parentId) {
				variants.push(variant);
			}
		}
		if (variants.length > 0) {
			for (let variant of variants) {
				/*Si alguno de los variant tiene un inventario menor o igual a su warning, entonces retornamos True*/
				if (variant.inventoryQuantity <= variant.lowInventoryWarningThreshold) {
					return true;
				}
			}
		} /*else {
			return false;
		}*/
		/*No hay inventario bajo*/
		return false;
	},

	/**
	* isSoldOut
	* @summary Verifica si todos los variant del product estan sin stock.
	* @return {Boolean} false si algun variant tiene stock
	*/
	isSoldOut: function () {
		let variants = [];
		for (let variant of this.variants) {
			if (!variant.parentId) {
				variants.push(variant);
			}
		}

		if (variants.length > 0) {
			for (let variant of variants) {
				if (!variant.inventoryManagement || variant.inventoryQuantity > 0) {
					/*Este variant tiene stock, por lo tanto se retorna false*/
					return false;
				}
			}
			/*No queda ningun variant con stock*/
			return true;
		}

		/*Como el product no tiene variants, se retorna false*/
		return false;
	},

	/**
	* isBackorder
	* @summary
	* @return {Boolean}
	*/
	isBackorder: function () {
		let variants = [];
		for (let variant of this.variants) {
			if (!variant.parentId) {
			variants.push(variant);
			}
		}
		if (variants.length > 0) {
			for (let variant of variants) {
				if (!variant.inventoryManagement || variant.inventoryQuantity > 0) {
					return false;
				}
			}
			for (let variant of variants) {
				if (!variant.inventoryPolicy) {
					return true;
				}
			}
			return false;
		}
	}
});

/**
 * Template.gridContent.helpers
 * @summary Helpers para Template.gridContent
 */
Template.gridContent.helpers({
	/**
	 * displayPrice
	 * @summary Retorna el rango de precio (o simplemente el precio) del Product
	 * @returns {String}
	 */
	displayPrice: function () {
		if (this._id) {
			return getProductPriceRange(this._id);
		}
	}
});

/**
* Template.gridControls.onRendered
* @summary
* @event onRendered
* @returns {void}
* @todo documentar
*/
Template.gridControls.onRendered(function () {
	return this.$("[data-toggle='tooltip']").tooltip({
		position: "top"
	});
});

/**
 * Template.productGridItems.events
 * @summary Events para Template.productGridItems
 */
Template.productGridItems.events({
	/**
	 * @summary
	 * @event click [data-event-action=showProductSettings]
	 * @returns {void}
	 */
	"click [data-event-action=showProductSettings]": function (event) {
		event.preventDefault();
		/*TODO: Que estoy haciendo aca ?*/
		EFrameworkCore.showActionView({
			label: "Edit Product",
			template: "productSettings",
			type: "product",
			data: this
		});
	},

	// "click .clone-product": function () {
	// 	let title;
	// 	title = this.title;
	// 	return Meteor.call("products/cloneProduct", this, function (error, productId) {
	// 		if (error) {
	// 			throw new Meteor.Error("error cloning product", error);
	// 		}
	// 		Router.go("product", {
	// 			_id: productId
	// 		});
	// 		return Alerts.add("Cloned " + title, "success", {
	// 			placement: "productManagement",
	// 			id: productId,
	// 			i18nKey: "productDetail.cloneMsg",
	// 			autoHide: true,
	// 			dismissable: false
	// 		});
	// 	});
	// },
//   "click .delete-product": function (event) {
//     event.preventDefault();
//     maybeDeleteProduct(this);
//   },
//   "click .pin-product": function (event) {
//     let pin;
//     let position;
//     event.preventDefault();
//     if (this.position.pinned === true) {
//       pin = false;
//     } else {
//       pin = true;
//     }
//     position = {
//       tag: share.tag,
//       pinned: pin,
//       updatedAt: new Date()
//     };
//     Meteor.call("products/updateProductPosition", this._id, position);
//     return Tracker.flush();
//   },
//   "click .update-product-weight": function (event) {
//     let position;
//     let weight;
//     event.preventDefault();
//     weight = this.position.weight || 0;
//     if (weight < 2) {
//       weight++;
//     } else {
//       weight = 0;
//     }
//     position = {
//       tag: share.tag,
//       weight: weight,
//       updatedAt: new Date()
//     };
//     Meteor.call("products/updateProductPosition", this._id, position);
//     return Tracker.flush();
//   },
//   "click .publish-product": function () {
//     let self;
//     self = this;
//     return Meteor.call("products/publishProduct", this._id, function (
//       error, result) {
//       if (error) {
//         Alerts.add(error, "danger", {
//           placement: "productGridItem",
//           id: self._id
//         });
//         return {};
//       }
//       if (result === true) {
//         return Alerts.add(self.title + " is now visible", "success", {
//           placement: "productGridItem",
//           type: self._id,
//           id: self._id,
//           i18nKey: "productDetail.publishProductVisible",
//           autoHide: true,
//           dismissable: false
//         });
//       }
//       return Alerts.add(self.title + " is hidden", "warning", {
//         placement: "productGridItem",
//         type: self._id,
//         id: self._id,
//         i18nKey: "productDetail.publishProductHidden",
//         autoHide: true,
//         dismissable: false
//       });
//     });
//   }
});

/**
* Template.productGridItems.onRendered
* @summary
* @event onRendered
* @returns {void}
* @todo documentar
*/
Template.productGridItems.onRendered(function () {
	// if (EFrameworkCore.hasPermission("createProduct")) {
	// 	let productSort = $(".product-grid-list");
	// 	return productSort.sortable({
	// 		items: "> li.product-grid-item",
	// 		cursor: "move",
	// 		opacity: 0.5,
	// 		revert: true,
	// 		scroll: false,
	// 		update: function (event, ui) {
	// 			let position;
	// 			let productId = ui.item[0].id;
	// 			let uiPositions = $(this).sortable("toArray", {
	// 				attribute: "data-id"
	// 			});
	// 			let index = _.indexOf(uiPositions, productId);
	// 			let _i;
	// 			let _len;
	// 			for (index = _i = 0, _len = uiPositions.length; _i < _len; index = ++_i) {
	// 				productId = uiPositions[index];
	// 				position = {
	// 					tag: EFrameworkCore.getCurrentTag(),
	// 					position: index,
	// 					updatedAt: new Date()
	// 				};
	// 				Meteor.call("products/updateProductPosition", productId, position);
	// 			}
	// 			return Tracker.flush();
	// 		}
	// 	});
	// }
});
