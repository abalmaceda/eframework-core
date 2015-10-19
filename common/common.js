/**
 * Match.OptionalOrNull
 * See Meteor Match methods
 * @param {String} pattern - match pattern
 * @return {Boolen} matches - void, null, or pattern
 */
Match.OptionalOrNull = function (pattern) {
  return Match.OneOf(void 0, null, pattern);
};
/*
 * extend EFrameworkCore and add common methods
 */
_.extend(EFrameworkCore, {
  /**
   * EFrameworkCore.shopIdAutoValue
   * @summary used for schemea injection autoValue
   * @example autoValue: EFrameworkCore.shopIdAutoValue
   * @return {String} returns current shopId
   */
  // shopIdAutoValue: function () {
  //   // we should always have a shopId
  //   if (EFrameworkCore.getShopId()) {
  //     if (this.isSet && this.isFromTrustedCode) {
  //       return EFrameworkCore.getShopId();
  //     }
  //     if (Meteor.isClient && this.isInsert) {
  //       return EFrameworkCore.getShopId();
  //     } else if (Meteor.isServer && (this.isInsert || this.isUpsert)) {
  //       return EFrameworkCore.getShopId();
  //     }
  //     return this.unset();
  //   }
  // },
  /**
   * EFrameworkCore.schemaIdAutoValue
   * @summary used for schemea injection autoValue
   * @example autoValue: EFrameworkCore.schemaIdAutoValue
   * @return {String} returns randomId
   */
  // schemaIdAutoValue: function () {
  //   if (this.isSet && this.isFromTrustedCode) {
  //     return Random.id();
  //   }
  //   if (Meteor.isClient && this.isInsert) {
  //     return Random.id();
  //   } else if (Meteor.isServer && (this.isInsert || this.isUpsert || this.isUpdate)) {
  //     return Random.id();
  //   }
  //   return this.unset();
  // },
  
  /**
   * EFrameworkCore.setProduct
   * @summary Metodo para set default/parameterized product variant. Si no entrego un ProducId valido, entonces se busca un producto cualquiera en Products collections.
   * @param {String} currentProductId - set actual productId
   * @param {String} currentVariantId - set actual variantId
   * @return {undefined} return nothing, sets en session
   */
	setProduct: function (currentProductId, currentVariantId) {

		let productId = currentProductId;
		let variantId = currentVariantId;
		/*
			En caso de que el productId no es valido busco un producto cualquiera
		*/
		if (!productId.match(/^[A-Za-z0-9]{17}$/)) {
			let product = EFrameworkCore.Collections.Products.findOne({
				handle: productId.toLowerCase()
			});
			/*
				Si encuentro un producto valido, lo selecciono entonces
			*/
			if (product) {
				productId =  product._id;
			}
		}
		/* Establezco el valor del nuevo productId. */
		setCurrentProduct(productId);
		setCurrentVariant(variantId);
	}
});
