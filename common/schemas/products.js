/* TODO : all */
/**
 * VariantMedia Schema
 */
EFrameworkCore.Schemas.VariantMedia = new SimpleSchema({
  mediaId: {
    type: String,
    optional: true
  },
  priority: {
    type: Number,
    optional: true
  },
  metafields: {
    type: [EFrameworkCore.Schemas.Metafield],
    optional: true
  },
  updatedAt: {
    type: Date,
    optional: true
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date
        };
      }
    },
    denyUpdate: true
  }
});

/**
 * ProductPosition Schema
 */
 /* TODO */

 /**
  * @global EFrameworkCore.Schemas.ProductPosition
  * @summary Schema para la Posición de un producto
  * @description
  * 	- Schema para guarda la información de la posición de un producto para un determinado tag ( utilizado como filtro.)
  * 	- Esto se utiliza para determina la posición del producto dentro de la grid.
  */
EFrameworkCore.Schemas.ProductPosition = new SimpleSchema({
	// Nombre del tag
	tag: {
		type: String,
		optional: true
	},
	//Posición del producto para asignar orden.
	position: {
		type: Number,
		optional: true
	},
	//TODO
	pinned: {
		type: Boolean,
		optional: true
	},
	//Tamaño de la componente que muestra el producto
	weight: {
		type: Number,
		optional: true,
		defaultValue: 0,
		min: 0,
		max: 3
	},
	//Fecha de creación
	updatedAt: {
		type: Date
	}
});

/**
 * ProductVariant Schema
 */
/* TODO */
EFrameworkCore.Schemas.ProductVariant = new SimpleSchema({
	_id: {
		type: String
	},
	parentId: {
		type: String,
		optional: true
	},
	cloneId: {
		type: String,
		optional: true
	},
	index: {
		type: String,
		optional: true
	},
	/*TODO: Que es un Barcode y para que se utiliza*/
	barcode: {
		label: "Barcode",
		type: String,
		optional: true,
		custom: function () {
			if (Meteor.isClient) {
				if (this.siblingField("type").value === "inventory" && !this.value) {
					return "required";
				}
			}
		}
	},
	/* TODO : No entiendo que es esto */
	compareAtPrice: {
		label: "MSRP",
		type: Number,
		optional: true,
		decimal: true,
		min: 0
	},
	fulfillmentService: {
		label: "Fulfillment service",
		type: String,
		optional: true
	},
	weight: {
		label: "Weight",
		type: Number,
		min: 0,
		optional: true,
		custom: function () {
			if (Meteor.isClient) {
				if (!(this.siblingField("type").value === "inventory" || this.value || this.value === 0)) {
					return "required";
				}
			}
		}
	},
	inventoryManagement: {
		type: Boolean,
		label: "Inventory Tracking",
		optional: true,
		custom: function () {
			if (Meteor.isClient) {
				if (!(this.siblingField("type").value === "inventory" || this.value || this.value === false)) {
					return "required";
				}
			}
		}
	},
	inventoryPolicy: {
		type: Boolean,
		label: "Deny when out of stock",
		optional: true,
		custom: function () {
			if (Meteor.isClient) {
				if (!(this.siblingField("type").value === "inventory" || this.value || this.value === false)) {
					return "required";
				}
			}
		}
	},
	lowInventoryWarningThreshold: {
		type: Number,
		label: "Warn @",
		min: 0,
		optional: true
	},
	/*
		Aunque se exige que el valor sea distinto de 0 para la cantidad, si es posible que sea menor que cero.
		Esto se da, para informar al usuario  ( en el formulario de creación ), que necesita agregar inventario.
		De esto se puede concluir tambien, que es "correcto" colocar una cantidad menor que 0
	*/
	inventoryQuantity: {
		type: Number,
		label: "Quantity",
		optional: true,
		custom: function () {
			if (Meteor.isClient) {
				if (this.siblingField("type").value !== "inventory") {
					if (checkChildVariants(this.docId) === 0 && !this.value) {
						return "required";
					}
				}
			}
		}
	},
	price: {
		label: "Price",
		type: Number,
		decimal: true,
		min: 0,
		optional: true,
		custom: function () {
			if (Meteor.isClient) {
				if (this.siblingField("type").value !== "inventory") {
					if (checkChildVariants(this.docId) === 0 && !this.value) {
						return "required";
					}
				}
			}
		}
	},
	sku: {
		label: "SKU",
		type: String,
		optional: true
	},
	/*TODO: A que corresponde este type ???*/
	/*
	Creo que hay estos type disponibles
		- variant
		- inventory
		- ???
	*/
	type: {
		label: "Type",
		type: String,
		defaultValue: "variant"
	},
	taxable: {
		label: "Taxable",
		type: Boolean,
		optional: true
	},
	title: {
		label: "Label",
		type: String,
		optional: true,
		custom: function () {
			if (Meteor.isClient) {
				if (!(this.siblingField("type").value === "inventory" || this.value)) {
					return "required";
				}
			}
		}
	},
	optionTitle: {
		label: "Option",
		type: String,
		optional: true
	},
	/* Ir a deficinión EFrameworkCore.Schemas.Metafield para entender conceptaualmente a que corresponde. */
	metafields: {
		type: [EFrameworkCore.Schemas.Metafield],
		optional: true
	},
	createdAt: {
		label: "Created at",
		type: Date,
		optional: true
	},
	updatedAt: {
		label: "Updated at",
		type: Date,
		optional: true
	}
});

/**
 * Product Schema
 */


/**
 * @global EFrameworkCore.Schemas.Product
 * @summary Schema de un producto
 * @todo Documentar
 */
EFrameworkCore.Schemas.Product = new SimpleSchema({
	_id: {
		type: String,
		optional: true
	},
	cloneId: {
		type: String,
		optional: true
	},
	/*TODO: Entender que es esto */
	shopId: {
		type: String,
		autoValue: EFrameworkCore.shopIdAutoValue,
		index: 1,
		label: "Product ShopId"
	},
	title: {
		type: String
	},
	pageTitle: {
		type: String,
		optional: true
	},
	description: {
		type: String,
		optional: true
	},
	type: {
		label: "Type",
		type: String,
		defaultValue: "simple"
	},
	/*TODO: Entender que es esto */
	vendor: {
		type: String,
		optional: true
	},
	/*Corresponden a una cualidad que permite identificar a un producto de sus semejantes.*/
	metafields: {
		type: [EFrameworkCore.Schemas.Metafield],
		optional: true
	},
	/*
	*	- Ver deficion de EFrameworkCore.Schemas.ProductPosition
	*	- Es un arreglo para permitir diferentes positions para diferentes tag. ( Permite diferentes posiciones para diferentes filtros tag)
	*/
	positions: {
		type: [EFrameworkCore.Schemas.ProductPosition],
		optional: true
	},
	variants: {
		type: [EFrameworkCore.Schemas.ProductVariant]
	},
	requiresShipping: {
		label: "Require a shipping address",
		type: Boolean,
		defaultValue: true,
		optional: true
	},
	parcel: {
		type: EFrameworkCore.Schemas.ShippingParcel,
		optional: true
	},
	hashtags: {
		type: [String],
		optional: true,
		index: 1
	},
	twitterMsg: {
		type: String,
		optional: true,
		max: 140
	},
	facebookMsg: {
		type: String,
		optional: true,
		max: 255
	},
	googleplusMsg: {
		type: String,
		optional: true,
		max: 255
	},
	pinterestMsg: {
		type: String,
		optional: true,
		max: 255
	},
	metaDescription: {
		type: String,
		optional: true
	},
	/*TODO: Entender que es esto */
	handle: {
		type: String,
		optional: true,
		index: 1
	},
	/*TODO: Entender que es esto */
	isVisible: {
		type: Boolean,
		index: 1
	},
	/*TODO: Entender que es esto */
	publishedAt: {
		type: Date,
		optional: true
	},
	/*TODO: Entender que es esto */
	publishedScope: {
		type: String,
		optional: true
	},
	/*TODO: Entender que es esto */
	templateSuffix: {
		type: String,
		optional: true
	},
	/*TODO: Entender que es esto */
	createdAt: {
		type: Date,
		autoValue: function () {
			if (this.isInsert) {
				return new Date;
			}
			else if (this.isUpsert) {
				return { $setOnInsert: new Date };
			}
		}
	},
	/*TODO: Entender que es esto */
	updatedAt: {
		type: Date,
		autoValue: function () {
			if (this.isUpdate) {
				return { $set: new Date };
			}
			else if (this.isUpsert) {
				return { $setOnInsert: new Date };
			}
		},
		optional: true
	}
});
