/**
 * @summary Template.ordersListItems.helpers
 * @description Helpers para Template.ordersListItems
 */
Template.ordersListItems.helpers({
	/**
	 * @function media
	 * @summary Constructor_for_a_Collection
	 * @param {Number} a
	 * @param {Number} b
	 * @returns {Number} Sum of a and b
	 * @this What_does_the_THIS_keyword_refer_to_here
	 * @description add_two_numbers
	 * @see {@link http://github.com|GitHub}
	 * @todo Documentar
	 * @deprecated
	 */
  // media: function() {
  //   var defaultImage, img, product;
  //   if (defaultImage = EFrameworkCore.Collections.Media.findOne({
  //     'metadata.variantId': this.variants._id
  //   })) {
  //     return defaultImage;
  //   } else {
  //     product = EFrameworkCore.Collections.Products.findOne(this.productId);
  //     if (!product) {
  //       return;
  //     }
  //     img = null;
  //     _.any(product.variants, function(v) {
  //       img = EFrameworkCore.Collections.Media.findOne({
  //         'metadata.variantId': v._id
  //       });
  //       return !!img;
  //     });
  //     return img;
  //   }
  // }
});
