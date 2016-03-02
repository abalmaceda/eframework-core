/**
 * Reaction Product Methods
 */
/* eslint new-cap: 0 */
/* eslint no-loop-func: 0 */


/*
	this.unblock()
		this.unblock will allow the next available DDP (Distributed Data Protocol) message to process without waiting for the current method. This is all on a per client basis: there no blocking involved globally.
		Mas información: https://meteorhacks.com/understanding-meteor-wait-time-and-this-unblock
*/


Meteor.methods({

	/**
	* products/cloneVariant
	* @summary clones un product variant en un nuevo variant
	* @description el mètodo  "products/cloneVariant" copia variants, pero tambien crearà y clonara child variants (options)
	* productId,variantId to clone
	* add parentId to create children
	* Note: parentId and variantId can be the same if creating a child variant.
	* @param {String} productId - el productId del propietario del variant que se esta clonando
	* @param {String} variantId - el variantId que se esta clonando
	* @param {String} parentId - optional variantId de un parent variant para crear un childVariant
	* @return {String} returns el variantId del nuevo elemento clonado
	* @todo entender y comentar
	*/
	"products/cloneVariant": function (productId, variantId, parentId) {
		check(productId, String);
		check(variantId, String);
		check(parentId, Match.Optional(String));
		let children;
		let clone;
		let product;
		/*Verifico si tengo los permisos necesarios*/
		if (!EFrameworkCore.hasPermission("createProduct")) {
			throw new Meteor.Error(403, "Access Denied");
		}
		this.unblock();

		product = Products.findOne(productId);
		// create variant hierachy structure
		variant = (function () {
			let results = [];
			for (let variant of product.variants) {
				if (variant._id === variantId) {
					results.push(variant);
				}
			}
			return results;
		})();
		// exit if we're trying to clone a ghost
		if (!(variant.length > 0)) {
			return false;
		}
		// variant is an array, with only
		// selected variant
		clone = variant[0];
		// we use id with variant children
		clone._id = Random.id();
		// if this is going to be a child
		if (parentId) {
			EFrameworkCore.Log.info( "products/cloneVariant: create parent child clone from ", parentId);
			clone.parentId = variantId;
			delete clone.inventoryQuantity;
			Products.update(
				{_id: productId},
				{ $push: { variants: clone }},
				{validate: false }
			);
			return clone._id;
		}
		// delete original values for new clone
		clone.cloneId = productId;
		delete clone.updatedAt;
		delete clone.createdAt;
		delete clone.inventoryQuantity;
		delete clone.title;
		// push the new variant to the product
		Products.update(
			{ _id: productId },
			{$push: { variants: clone }},
			{ validate: false }
		);
		// process children
		children = (function () {
			let results = [];
			for (let variant of product.variants) {
				if (variant.parentId === variantId) {
					results.push(variant);
				}
			}
			return results;
		})();
		// if we have children
		if (children.length > 0) {
			EFrameworkCore.Log.info( "products/cloneVariant: create sub child clone from ", parentId );
			for (let childClone of children) {
				childClone._id = Random.id();
				childClone.parentId = clone._id;
				Products.update(
					{ _id: productId},
					{ $push: { variants: childClone}},
					{ validate: false }
				);
			}
		}
		return clone._id;
	},

//   /**
//    * products/createVariant
//    * @summary initializes empty variant template (all others are clones)
//    * should only be seen when all variants have been deleted from a product.
//    * @param {String} productId - the productId where we create variant
//    * @param {String} newVariant - variant object
//    * @return {String} new variantId
//    */
//   "products/createVariant": function (productId, newVariant) {
//     check(productId, String);
//     check(newVariant, Match.OneOf(Object, void 0));
//     let createVariant = newVariant || {};
//     // must have createProduct permissions
//     if (!EFrameworkCore.hasPermission("createProduct")) {
//       throw new Meteor.Error(403, "Access Denied");
//     }
//     this.unblock();
//     // random id for new variant
//     let newVariantId = Random.id();
//     // if we have a newVariant object we'll use it.
//     if (newVariant) {
//       createVariant._id = newVariantId;
//       check(createVariant, EFrameworkCore.Schemas.ProductVariant);
//     } else {
//       createVariant = {
//         _id: newVariantId,
//         title: "",
//         price: 0.00
//       };
//     }
//     Products.update({
//       _id: productId
//     }, {
//       $addToSet: {
//         variants: createVariant
//       }
//     }, {
//       validate: false
//     });
//     return newVariantId;
//   },

	/**
	* products/createInventoryVariant
	* @summary inicializa template inventory variant
	* Solo debe ser llamado para crear variantes type=inventory
	* utilizar el object newVariant para crear con opciones
	* @param {String} productId - productId
	* @param {String} parentId -  parent variantId
	* @param {Object} newVariant -  variant object opcional
	* @return {String} returns new variantId
	* @todo documentar
	*/
	"products/createInventoryVariant": function (productId, parentId, newVariant) {
		check(productId, String);
		check(parentId, String);
		check(newVariant, Match.OneOf(Object, void 0));
		/*Verificar permisos*/
		if (!Roles.userIsInRole(Meteor.userId(), ["admin"])) {
			throw new Meteor.Error(403, "Access Denied");
		}
		this.unblock();
		let inventoryVariant = newVariant;
		let newVariantId = Random.id();
		let newBarcode = Random.id();

		if (inventoryVariant) {
			inventoryVariant._id = newVariantId;
			inventoryVariant.parentId = parentId;
			inventoryVariant.type = "inventory";
			check(inventoryVariant, EFrameworkCore.Schemas.ProductVariant);
		} else {
			inventoryVariant = {
				_id: newVariantId,
				parentId: parentId,
				barcode: newBarcode,
				type: "inventory"
			};
		}
		Products.update(
			{_id: productId},
			{ $addToSet: { variants: newVariant }},
			{ validate: false }
		);
		return newVariantId;
	},

	/**
	* products/createInventoryVariants
	* @summary Crea inventario para variants default para cada cantidad
	* Valor opcional por defecto inicializará todas las variants a algun string + index
	* @param {String} productId - productId
	* @param {String} parentId - parentId
	* @param {String} quantity - cantidad por defecto para el inventario de variants
	* @param {String} defaultValue - valor barcode por defecto
	* @return {Array} returns array de nuevos variant ids
	* @todo Entender
	*/
	"products/createInventoryVariants": function (productId, parentId, quantity, defaultValue) {
		check(productId, String);
		check(parentId, String);
		check(defaultValue, Match.Optional(String));
		/*Verifica que la cantidad sea un numero entero positivo*/
		check(quantity, Match.OneOf(Match.Where(function () {
			check(quantity, String);
			return /[0-9]+/.test(quantity);
		}),
			/* Además verifica que sea mayor que 0 ( al menos 1 ) */
			Match.Where(function () {
				check(quantity, Number);
				return quantity > 0;
			}
		)));

		this.unblock();
		/*Verificamos permisos*/
		/* TODO : Por que necesito permisos de administrador para esto ???*/
		if (!Roles.userIsInRole(Meteor.userId(), ["admin"])) {
			throw new Meteor.Error(403, "Access Denied");
		}

		let newVariantIds = [];
		let newVariants = [];

		_(Number(quantity)).times(function (index) {
			let newVariantBarcode;
			let newVariantId;
			if (defaultValue || defaultValue === "") {
				newVariantBarcode = defaultValue + index;
			} else {
				newVariantBarcode = Random.id();
			}
			newVariantId = Random.id();
			newVariants.push(
			{
				_id: newVariantId,
				parentId: parentId,
				barcode: newVariantBarcode,
				type: "inventory"
			});
			return newVariantIds.push(newVariantId);
		});
		Products.update(
			{_id: productId},
			{ $addToSet: { variants: { $each: newVariants } }},
			/*Se hace skip a las validaciones*/
			{ validate: false }
		);
		return newVariantIds;
	},

	/**
	* products/updateVariant
	* @summary  Actualiza un variant con nuevos valores ( merge en el original ). Solo es necesario entregar información a actualizar
	* @param {Object} variant - variant object actual
	* @param {Object} updateDoc - objeto actualizado
	* @param {Object} currentDoc - variand id a actualizar
	* @return {String} retorna resultado actualizado
	* @todo Entender
	*/
	"products/updateVariant": function (variant, updateDoc, currentDoc) {
		check(variant, Object);
		check(updateDoc, Match.OptionalOrNull(Object));
		check(currentDoc, Match.OptionalOrNull(String));
		/*Verifica permisos*/
		if (!EFrameworkCore.hasPermission("createProduct")) {
			throw new Meteor.Error(403, "Access Denied");
		}
		/* Desbloquemos siguiente mensaje DPP */
		this.unblock();

		let newVariant;
		let Products = EFrameworkCore.Collections.Products;
		let product = Products.findOne({ "variants._id": variant._id });
		// update variants
		if (product !== null ? product.variants : void 0) {
			for (let variants of product.variants) {
				if (variants._id === variant._id) {
					newVariant = _.extend(variants, variant);
				}
			}
			return Products.update(
				{ "_id": product._id, "variants._id": variant._id},
				{ $set: { "variants.$": newVariant } },
				/* You can also skip the whole document validation process by setting validate=False when calling the method: */
				{validate: false }
			);
		}
	},

//   /**
//    * products/updateVariants
//    * @summary update whole variants array
//    * @param {Array} variants - array of variants to update
//    * @return {String} returns update result
//    */
//   "products/updateVariants": function (variants) {
//     check(variants, [Object]);
//     // must have createProduct permissions
//     if (!EFrameworkCore.hasPermission("createProduct")) {
//       throw new Meteor.Error(403, "Access Denied");
//     }
//     this.unblock();
//     let product = Products.findOne({
//       "variants._id": variants[0]._id
//     });
//     return Products.update(product._id, {
//       $set: {
//         variants: variants
//       }
//     }, {
//       validate: false
//     });
//   },

	/**
	* products/deleteVariant
	* @summary elimina variant, el cual tambien debe eliminar child variants
	* @param {String} variantId - variantId para borrar
	* @returns {String} returns resultados actualizados
	*/
	"products/deleteVariant": function (variantId) {
		check(variantId, String);
		/*Verificamos permisos*/
		if (!EFrameworkCore.hasPermission("createProduct")) {
			throw new Meteor.Error(403, "Access Denied");
		}
		/* Desbloquemos siguiente mensaje DPP */
		this.unblock();

		let deleted = Products.find({
			$or: [
				{ "variants.parentId": variantId },
				{ "variants._id": variantId }
			]
		}).fetch();
		Products.update(
			{"variants.parentId": variantId},
			{ $pull: { variants: { parentId: variantId }}}
		);
		Products.update(
			{"variants._id": variantId},
			{$pull: { variants: { _id: variantId }}}
		);
		_.each(deleted, function (product) {
			return _.each(product.variants, function (variant) {
				if (variant.parentId === variantId || variant._id === variantId) {
					return EFrameworkCore.Collections.Media.update(
						{ "metadata.variantId": variant._id },{
							$unset: {
								"metadata.productId": "",
								"metadata.variantId": "",
								"metadata.priority": ""
							}
						},
						{ multi: true }
					);
				}
			});
		});
		return true;
	},

//   /**
//    * products/cloneProduct
//    * @summary clone a whole product, defaulting visibility, etc
//    * in the future we are going to do an inheritance product
//    * that maintains relationships with the cloned product tree
//    * @param {Object} product - product object to clone
//    * @returns {String} returns insert result
//    */
//   "products/cloneProduct": function (product) {
//     check(product, Object);
//     // must have createProduct permissions
//     if (!EFrameworkCore.hasPermission("createProduct")) {
//       throw new Meteor.Error(403, "Access Denied");
//     }
//     this.unblock();

//     let i = 0;

//     let handleCount = Products.find({
//       cloneId: product._id
//     }).count() + 1;

//     product.cloneId = product._id;
//     product._id = Random.id();
//     delete product.updatedAt;
//     delete product.createdAt;
//     delete product.publishedAt;
//     delete product.handle;
//     product.isVisible = false;
//     if (product.title) {
//       product.title = product.title + handleCount;
//     }
//     while (i < product.variants.length) {
//       let newVariantId = Random.id();
//       let oldVariantId = product.variants[i]._id;
//       product.variants[i]._id = newVariantId;
//       EFrameworkCore.Collections.Media.find({
//         "metadata.variantId": oldVariantId
//       }).forEach(function (fileObj) {
//         let newFile = fileObj.copy();
//         return newFile.update({
//           $set: {
//             "metadata.productId": product._id,
//             "metadata.variantId": newVariantId
//           }
//         });
//       });
//       if (!product.variants[i].parentId) {
//         while (i < product.variants.length) {
//           if (product.variants[i].parentId === oldVariantId) {
//             product.variants[i].parentId = newVariantId;
//           }
//           i++;
//         }
//       }
//       i++;
//     }
//     return Products.insert(product, {
//       validate: false
//     });
//   },

	/**
	* products/createProduct
	* @summary Cuando se crea un producto, este se crea con un variant empty. Todos los products tienen un variant con detalles y precio.
	* @param {Object} product - (Opcional) Objecto product
	* @return {String} return insert result
	*/
	"products/createProduct": function (product) {
		check(product, Match.Optional(Object));
		/*Verifica si tiene permisos de createProduct*/
		if (!EFrameworkCore.hasPermission("createProduct")) {
			throw new Meteor.Error(403, "Access Denied");
		}
		/* Desbloquemos siguiente mensaje DPP */
		this.unblock();
		/*En caso de que se pase un product*/
		if (product) {
			return Products.insert(product);
		}
		/*Se crea un producto default */
		return Products.insert(
		{
			_id: Random.id(),
			title: "",
			variants:
			[{
				_id: Random.id(),
				title: "",
				price: 0.00
			}]
		},
		{
			/*TODO: Para que es este atributo*/
			validate: false
		});
	},
	/**
	* products/deleteProduct
	* @summary Eliminar un product y desvincularlo de toda su Media
	* @param {String} productId - productId para eliminar
	* @returns {Boolean} returns resultado de la eliminación
	*/
	"products/deleteProduct": function (productId) {
		check(productId, String);
		/*Verifico los permisos para eliminación de un producto*/
		if (!EFrameworkCore.hasAdminAccess()) {
			throw new Meteor.Error(403, "Access Denied");
		}
		this.unblock();

		let numRemoved = Products.remove(productId);
		/*Si el producto se eliminó, entonces eliminamos las referencias en el Collection Media a dicho producto*/
		if (numRemoved > 0) {
			EFrameworkCore.Collections.Media.update(
				{ "metadata.productId": productId},
				{
					$unset: {
						"metadata.productId": "",
						"metadata.variantId": "",
						"metadata.priority": ""
					}
				},
				{ multi: true}
			);
			return true;
		}
		/* No se pudo realizar la eliminación*/
		return false;
	},

	/**
	* products/updateProductField
	* @summary actualiza un solo campo del prodcuto
	* @param {String} productId - productId para actualizar
	* @param {String} field - key para hacer update del campo
	* @param {String} value - valor para actualizar el campo
	* @return {String} returns update result
	*/
	"products/updateProductField": function (productId, field, value) {
		check(productId, String);
		check(field, String);
		check(value, Match.OneOf(String, Object, Array, Boolean));
		/* Se verifican los permisos*/
		if (!EFrameworkCore.hasPermission("createProduct")) {
			throw new Meteor.Error(403, "Access Denied");
		}
		/* Desbloquemos siguiente mensaje DPP */
		this.unblock();

		let stringValue = EJSON.stringify(value);
		let update = EJSON.parse("{\"" + field + "\":" + stringValue + "}");

		return Products.update(productId, {
			$set: update
		});
	},

  /**
   * products/updateProductTags
   * @summary método par insertar o actualizar tag con jerarquia (hierachy)
   * @param {String} productId - productId
   * @param {String} tagName - tagName
   * @param {String} tagId - tagId
   * @param {String} currentTagId - currentTagId
   * @return {String} return result
   * @todo
   */
	"products/updateProductTags": function (productId, tagName, tagId, currentTagId) {
		check(productId, String);
		check(tagName, String);
		check(tagId, Match.OneOf(String, null));
		check(currentTagId, Match.Optional(String));
		/* Se verifica que se tenga permisos "createProduct" */
		if (!EFrameworkCore.hasPermission("createProduct")) {
			throw new Meteor.Error(403, "Access Denied");
		}
		/* Desbloquemos siguiente mensaje DPP */
		this.unblock();

		let newTag =
		{
			slug: getSlug(tagName),
			name: tagName
		};
		/*Verifico si el tag existe*/
		let existingTag = Tags.findOne({ name: tagName });

		if (existingTag) {
			let productCount = Products.find({
				_id: productId,
				hashtags:{
					$in: [existingTag._id]
				}
			}).count();
			if (productCount > 0) {
				throw new Meteor.Error(403, "Existing Tag, Update Denied");
			}
			Products.update(productId, {
				$push: {
					hashtags: existingTag._id
				}
			});
		} else if (tagId) {
			Tags.update(tagId, {
				$set: newTag
			});
		} else {
			newTag.isTopLevel = false;
			newTag.shopId = EFrameworkCore.getShopId();
			newTag.updatedAt = new Date();
			newTag.createdAt = new Date();
			newTag._id = Tags.insert(newTag);
			Products.update(productId, {
				$push: {
					hashtags: newTag._id
				}
			});
		}
	},

	/**
	* products/removeProductTag
	* @summary metodo para remover un tag de un product
	* @param {String} productId - productId
	* @param {String} tagId - tagId
	* @return {String} return resultado actualizado
	*/
	"products/removeProductTag": function (productId, tagId) {
		check(productId, String);
		check(tagId, String);
		/*Verifica que tenga los permisos*/
		if (!EFrameworkCore.hasPermission("createProduct")) {
			throw new Meteor.Error(403, "Access Denied");
		}
		/* Desbloquemos siguiente mensaje DPP */
		this.unblock();

		/*Elimina el tag*/
		Products.update(productId, {
			$pull: {
				hashtags: tagId
			}
		});

		/*Verifico si existe otro producto con ese tag */
		let productCount = Products.find({
			hashtags: {
				$in: [tagId]
			}
		}).count();

		/*TODO: entender que es un relatedTagIds */
		let relatedTagsCount = Tags.find({
			relatedTagIds: {
				$in: [tagId]
			}
		}).count();

		/*Si ambos son listas de largo 0, eso quiere decir que dicho Tag ya no se usa. Se elimina del arreglo tags*/
		if (productCount === 0 && relatedTagsCount === 0) {
			return Tags.remove(tagId);
		}
	},

	/**
	* products/setHandleTag
	* @summary set or toggle product handle
	* @param {String} productId - productId
	* @param {String} tagId - tagId
	* @return {String} return update result
	* @todo Entender que es esto exactamente, ademas para que sirve.
	*/
	"products/setHandleTag": function (productId, tagId) {
		check(productId, String);
		check(tagId, String);

		/* Verifica si tengo los permisos */
		if (!EFrameworkCore.hasPermission("createProduct")) {
			throw new Meteor.Error(403, "Access Denied");
		}
		/* Desbloquemos siguiente mensaje DPP */
		this.unblock();

		let product = Products.findOne(productId);
		let tag = Tags.findOne(tagId);
		// set handle
		if (productId.handle === tag.slug) {
			Products.update(product._id, {
				$unset: {
					handle: ""
				}
			});
			return product._id;
		}
		// toggle hangle
		let existingHandles = Products.find({
		handle: tag.slug
		}).fetch();
		for (let currentProduct of existingHandles) {
			Products.update(currentProduct._id, {
				$unset: { handle: "" }
			});
		}
		Products.update(product._id, {
			$set: { handle: tag.slug }
		});
		return tag.slug;
	},

	/**
	* products/updateProductPosition
	* @summary update  la posición del product en la grid
	* @param {String} productId - productId
	* @param {Object} positionData -  an object with tag,position,dimensions
	* @return {String} returns
	*/
	"products/updateProductPosition": function (productId, positionData) {
		check(productId, String);
		check(positionData, Object);

		//verifica los permisos "createProduct"
		if (!EFrameworkCore.hasPermission("createProduct")) {
			throw new Meteor.Error(403, "Access Denied");
		}

		this.unblock();

		let updateResult;

		let addPosition = function() {
			updateResult = Products.update(
			{_id: productId},
			{
				$addToSet: { positions: positionData},
				$set: { updatedAt: new Date() }
			},
			function (error) {
				if (error) {
					EFrameworkCore.Log.warn(error);
					throw new Meteor.Error(403, error);
				}
			});
		};

		let updatePosition = function() {
			updateResult = Products.update(
			{
				"_id": productId,
				"positions.tag": positionData.tag
			},
			{
				$set: {
					"positions.$.position": positionData.position,
					"positions.$.pinned": positionData.pinned,
					"positions.$.weight": positionData.weight,
					"positions.$.updatedAt": new Date()
				}
			},
			function (error) {
				if (error) {
					EFrameworkCore.Log.warn(error);
					throw new Meteor.Error(403, error);
				}
			});
		};

		//busco el producto que tiene el _id y la position.tag
		let product = Products.findOne({ "_id": productId, "positions.tag": positionData.tag});

		//Caso en que no existia una posición previa para el producto
		if ( product === undefined || product === null ) {
			addPosition();
		}
		//En el caso que existe un producto
		else {
			//Si el producto tenia posición, entonces se acualiza
			if (product.positions) {
				updatePosition();
			}
			//Si no existía posición, se agrega
			else {
				addPosition();
			}
		}
		//Se retorna el resultado de la actualización
		return updateResult;
	},

	/**
	* products/updateMetaFields
	* @summary update update metadata de un producto
	* @param {String} productId - productId
	* @param {Object} updatedMeta - update object con metadata
	* @param {Object} meta - meta object actual
	* @return {String} returns resultado actualizado
	*/
	"products/updateMetaFields": function (productId, updatedMeta, meta) {
		check(productId, String);
		check(updatedMeta, Object);
		check(meta, Match.OptionalOrNull(Object));
		/* Se verifica que el usuario tenga permisos de creación del producto*/
		if (!EFrameworkCore.hasPermission("createProduct")) {
		  	throw new Meteor.Error(403, "Access Denied");
		}
		/* Desbloquemos siguiente mensaje DPP */
		this.unblock();
		/* Caso en el metada existia. Se actualiza */
		if (meta) {
			return Products.update(
				{ _id: productId,metafields: meta },
				{ $set: { "metafields.$": updatedMeta }}
			);
		}
		/* Se crea un nuevo metada para el producto */
		return Products.update(
			{ _id: productId},
			{ $addToSet: { metafields: updatedMeta } }
		);
	},

	/**
	* products/removeMetaFields
	* @summary metodo para remover un tag de un product
	* @param {String} productId - productId
	* @param {String} meta - {key, value}
	* @return {String} return resultado actualizado
	*/
	"products/removeMetaFields": function (productId, meta) {
		check(productId, String);
		check(meta, Object);
		/*Verifica que tenga los permisos*/
		if (!EFrameworkCore.hasPermission("createProduct")) {
			throw new Meteor.Error(403, "Access Denied");
		}
		/* Desbloquemos siguiente mensaje DPP */
		this.unblock();

		/*Elimina el tag*/
		return Products.update(productId, {
			$pull: { metafields: meta }
		});
	},
	/**
	* products/publishProduct
	* @summary Publica  (visibilidad) del product
	* @param {String} productId - productId
	* @return {String} return
	* @todo hook into publishing flow
	*/
	"products/publishProduct": function (productId) {
		check(productId, String);
		if (!EFrameworkCore.hasPermission("createProduct")) {
			throw new Meteor.Error(403, "Access Denied");
		}
		this.unblock();

		let product = EFrameworkCore.Collections.Products.findOne(productId);

		/*
			Se verifica que tenga lo mínimo para poder publicar un product.
			Notar que aunque se desee ocultar el producto, de todas maneras se hace el check ( aunque en este caso es innecesario )
		*/
		if (
				( product !== null ? product.variants[0].price : void 0) &&
				( product !== null ? product.variants[0].title : void 0) &&
				( product !== null ? product.title : void 0))
		{
			// update product visibility
			EFrameworkCore.Log.info("toggle product visibility ", product._id, !product.isVisible);

			Products.update(product._id, {
				$set: {
					isVisible: !product.isVisible
				}
			});
			return Products.findOne(product._id).isVisible;
		}
		/*El product no cuenta con la información mínima para publicarse*/
		EFrameworkCore.Log.debug("invalid product visibility ", productId);
		throw new Meteor.Error(400, "Bad Request");
	}
});
