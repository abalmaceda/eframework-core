/**
 * @global Media
 * @summary EFrameworkCore.Collections.Media
 */
let Media = EFrameworkCore.Collections.Media;

/**
* @function uploadHandler
* @summary Handler para cargar imagenes
* @param {jQuery.Event} event -
* @returns {Number} Sum of a and b
* @see {@link http://github.com|GitHub}
* @todo Documentar
*/
function uploadHandler(event) {
	let productId = selectedProductId();
	let variantId = selectedVariantId();
	let shopId = selectedProduct().shopId || EFrameworkCore.getShopId();
	let userId = Meteor.userId();
	let count = Media.find({ "metadata.variantId": variantId }).count();

	return FS.Utility.eachFile(event, function (file) {
		let fileObj;
		fileObj = new FS.File(file);
		fileObj.metadata = {
			ownerId: userId,
			productId: productId,
			variantId: variantId,
			shopId: shopId,
			priority: count
		};
		Media.insert(fileObj);
		return count++;
	});
}

/**
* @function updateImagePriorities
* @summary
* @returns {Number} Sum of a and b
* @this What_does_the_THIS_keyword_refer_to_here
* @description add_two_numbers
* @see {@link http://github.com|GitHub}
* @todo Documentar
*/
function updateImagePriorities() {
	let sortedMedias = _.map(
		//$(".gallery").sortable("toArray", {attribute: "data-index"}),
		$(".gallery li").toArray(),
		function (index) {
			return {mediaId: index};
		}
	);

	let _results = [];
	for (let image of sortedMedias) {
		_results.push(Media.update({"_id":$(image.mediaId).attr("data-index")},
			{$set: {"metadata.priority": _.indexOf(sortedMedias, image)}}
		));
	}
	return _results;
}

 /**
  * @summary Template.productImageGallery.helpers
  * @description Helpers para Template.productImageGallery
  * @todo Documentar
  */
Template.productImageGallery.helpers({
	/**
	 * @function media
	 * @summary Constructor_for_a_Collection
	 * @returns {Number} Sum of a and b
	 * @todo Documentar
	 */
	media: function () {
		let mediaArray = [];
		let variant = selectedVariant();
		let product = selectedProduct();

		//En caso de tener seleccionado una variant
		if (variant) {
			mediaArray = Media.find(
				{"metadata.variantId": variant._id},
				{ sort: {"metadata.priority": 1}}
			);

			//Caso en que el user no es admin
			//TODO: ver este caso
			if (!EFrameworkCore.hasAdminAccess() && mediaArray.count() < 1) {
				mediaArray = Media.find(
					{"metadata.variantId": product.variants[0]._id},
					{sort: {"metadata.priority": 1}}
				);
			}
		} else {
			//Se confirma que haya product
			if (product) {
				let ids = [];
				//Obtengo los id de todas las variants del product
				for (variant of product.variants) {
					ids.push(variant._id);
				}
				//Busco Media para todas las variant del product
				mediaArray = Media.find(
					{"metadata.variantId": { $in: ids}},
					{ sort: { "metadata.priority": 1 }}
				);
			}
		}
		return mediaArray;
	},

	/**
	 * @function vaiant
	 * @summary Entrega la Variant seleccionada
	 * @returns {Variant} Variant seleccionado
	 * @deprecated
	 */
	variant: function () {
		return selectedVariant();
	}
});

/**
 * @summary Template.productImageGallery.onRendered
 * @description onRendered para Template.productImageGallery
 * @todo Documentar
 */
Template.productImageGallery.onRendered(function () {
	return this.autorun(function () {
		let $gallery;
		//Solo si es administrador
		if (EFrameworkCore.hasAdminAccess()) {
			$gallery = $(".gallery");
			//Permite reordenar los elementos haciendo drag-drop
			return $gallery.sortable({
				cursor: "move",
				opacity: 0.3,
				placeholder: "sortable",
				forcePlaceholderSize: true,
				update: function () {
					let variant;
					if (!(typeof variant !== "undefined" && variant !== null ? variant._id : void 0)) {
						variant = selectedVariant();
					}
					variant.medias = [];
					return updateImagePriorities();
				},
				start: function (event, ui) {
					ui.placeholder.html("Drop image to reorder");
					ui.placeholder.css("padding-top", "30px");
					ui.placeholder.css("border", "1px dashed #ccc");
					return ui.placeholder.css("border-radius", "6px");
				}
			});
		}
	});
});

 /**
  * @summary Template.productImageGallery.events
  * @description Events para Template.productImageGallery
  * @todo Documentar
  */
Template.productImageGallery.events({

	/**
	 * @event mouseenter .gallery > li
	 * @summary Constructor_for_a_Collection
	 * @param {jQuery.Event} event
	 * @returns {Number} Sum of a and b
	 * @this What_does_the_THIS_keyword_refer_to_here
	 * @description add_two_numbers
	 * @todo Documentar
	 */
	"mouseenter .gallery > li": function (event) {
		let ids = [];
		event.stopImmediatePropagation();
		//Si el usuario no tiene permisos para "createProduct"
		if (!EFrameworkCore.hasPermission("createProduct")) {
			let first = $(".gallery li:nth-child(1)");
			let target = $(event.currentTarget);
			let variant = selectedVariant();

			if (!variant) {
				let product = selectedProduct();
				if (product) {
					for (let productVariant of product.variants) {
						let mediaResults = Media.find(
							{"metadata.variantId": productVariant._id},
							{sort: {"metadata.priority": 1 }}
						).fetch();

						// loop within product variants
						for (let media of mediaResults) {
							ids.push(media._id);
							if ($(event.currentTarget).data("index") === media._id) {
								setCurrentVariant(productVariant._id);
							}
						}
						if (selectedVariant()) {
							break;
						}
					}
				}

				/*
				hide all images not associated with the highlighted variant
				to prevent the alternate variant images from being displayed.
				*/
				if (ids.length > 0) {
					$(".gallery li").each(function (k, v) {
						let vId = $(v).data("index");
						if (_.indexOf(ids, vId) < 0) {
							return $(v).hide();
						}
					});
				}
			}
			if ($(target).data("index") !== first.data("index")) {
				return $(".gallery li:nth-child(1)").fadeOut(400, function () {
					$(this).replaceWith(target);
					first.css({display: "inline-block"}).appendTo($(".gallery"));
					return $(".gallery li:last-child").fadeIn(100);
				});
			}
		}
	},

	/**
	 * @event click .remove-image
	 * @summary Elimina la imagen correspondiente y re-define la prioridad de las imagenes.
	 * @returns {void}
	 * @this Objecto FS.File
	 * @description add_two_numbers
	 */
	"click .remove-image": function () {
		//La funcion reomve pertenece a FS.File
		this.remove();
		updateImagePriorities();
	},

	/**
	 * @event dropped #galleryDropPane
	 * @summary Permite agregar imagenes a la galleria haciendo drop de imagenes dentro de la galeria ( sobre otras imagenes )
	 * @returns {void}
	 */
	"dropped #galleryDropPane": uploadHandler,

	/**
	 * @function click #img-upload
	 * @summary Gatilla event click de #files
	 * @returns {void}
	 */
	"click #img-upload": function () {
		return $("#files").click();
	},

	/**
	 * @function load .img-responsive
	 * @summary Constructor_for_a_Collection
	 * @param {jQuery.Event} event
	 * @param {Template} template
	 * @returns {Number} Sum of a and b
	 * @description add_two_numbers
	 * @todo Documentar
	 */
	"load .img-responsive": function (event, template) {
		return Session.set("variantImgSrc", template.$(".img-responsive").attr("src"));
	}

});


/**
 * @summary Template.imageUploader.events
 * @description Events para Template.imageUploader
 */
Template.imageUploader.events({
	/**
	 * @event click #btn-upload
	 * @summary llama evento click de #files
	 * @returns {void}
	 */
	"click #btn-upload": function () {
		return $("#files").click();
	},

	/**
	 * @event change #files
	 * @summary Se ejecuta función uploadHandler
	 * @returns {void}
	 */
	"change #files": uploadHandler,

	/**
	 * @event dropped #dropzone
	 * @summary Se ejecuta función uploadHandler
	 * @returns {void}

	 */
	"dropped #dropzone": uploadHandler
});

/**
 * @summary Template.productImageGallery.events
 * @description Events para Template.productImageGallery
 * @todo Documentar
 */
// Template.productImageGallery.events({

// });
