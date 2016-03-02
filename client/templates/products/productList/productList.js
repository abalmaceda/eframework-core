/**
 * productList helpers
 */


 /**
  * @global Meida
  * @summary EFrameworkCore.Collections.Media
  */
let Media;
Media = EFrameworkCore.Collections.Media;

/**
 * Template.productList.helpers
 * @summary Helpers para Template.productList
 */
Template.productList.helpers({
	/**
	 * @function products
	 * @summary
	 * @returns {String}
	 * @todo Documentar
	 */
	products: function () {
		return getProductsByTag(this.tag);
	},

	/**
	 * @function media
	 * @summary
	 * @returns {}
	 * @todo Documentar
	 */
	media: function () {
		let defaultImage;
		let variants = [];
		for (let variant of this.variants) {
			if (!variant.parentId) {
				variants.push(variant);
			}
		}
		if (variants.length > 0) {
			let variantId = variants[0]._id;
			defaultImage = Media.findOne({
				"metadata.variantId": variantId,
				"metadata.priority": 0
			});
		}
		if (defaultImage) {
			return defaultImage;
		}
		return false;
	}
});

