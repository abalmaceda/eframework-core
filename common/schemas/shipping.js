/**
 * ShippingMethod Schema
 */

/**
 * @summary EFrameworkCore.Schemas.ShippingMethod
 * @description
 * @todo DOCUMENTACION y DESCRIPCION
 */
EFrameworkCore.Schemas.ShippingMethod = new SimpleSchema({
  _id: {
    type: String,
    label: "Shipment Method Id",
    autoValue: EFrameworkCore.schemaIdAutoValue
  },
  name: {
    type: String,
    label: "Method Name"
  },
  label: {
    type: String,
    label: "Public Label"
  },
  group: {
    type: String,
    label: "Group"
  },
  cost: {
    type: Number,
    label: "Cost",
    decimal: true,
    optional: true,
    //Se agrego valor mínimo 0
    min: 0
  },
  handling: {
    type: Number,
    label: "Handling",
    optional: true,
    decimal: true,
    defaultValue: 0,
    min: 0
  },
  rate: {
    type: Number,
    label: "Rate",
    decimal: true,
    min: 0
  },
  enabled: {
    type: Boolean,
    label: "Enabled",
    defaultValue: true
  },
  validRanges: {
    type: Array,
    optional: true,
    label: "Matching Cart Ranges"
  },
  "validRanges.$": {
    type: Object,
    optional: true
  },
  "validRanges.$.begin": {
    type: Number,
    decimal: true,
    label: "Begin",
    optional: true
  },
  "validRanges.$.end": {
    type: Number,
    decimal: true,
    label: "End",
    optional: true
  },
  validLocales: {
    type: Array,
    optional: true,
    label: "Matching Locales"
  },
  "validLocales.$": {
    type: Object,
    optional: true
  },
  "validLocales.$.origination": {
    type: String,
    label: "From",
    optional: true
  },
  "validLocales.$.destination": {
    type: String,
    label: "To",
    optional: true
  },
  "validLocales.$.deliveryBegin": {
    type: Number,
    label: "Shipping Est.",
    optional: true
  },
  "validLocales.$.deliveryEnd": {
    type: Number,
    label: "Delivery Est.",
    optional: true
  }
});


/**
 * @summary EFrameworkCore.Schemas.ShipmentQuote
 * @description
 * @todo DOCUMENTACION y DESCRIPCION
 */
EFrameworkCore.Schemas.ShipmentQuote = new SimpleSchema({
	carrier: {
		type: String
	},
	method: {
		type: EFrameworkCore.Schemas.ShippingMethod
	},
	rate: {
		type: Number,
		decimal: true,
		defaultValue: "0.00"
	}
});

/**
 * @summary EFrameworkCore.Schemas.ShipmentItem
 * @description
 * @todo DOCUMENTACION y DESCRIPCION
 */
// populate with order.items that are added to a shipment
EFrameworkCore.Schemas.ShipmentItem = new SimpleSchema({
  _id: {
    type: String,
    label: "Shipment Line Item",
    optional: true,
    autoValue: EFrameworkCore.schemaIdAutoValue
  },
  productId: {
    type: String,
    index: 1
  },
  shopId: {
    type: String,
    index: 1,
    label: "Shipment Item ShopId",
    optional: true
  },
  quantity: {
    label: "Quantity",
    type: Number,
    min: 0
  },
  variantId: {
    type: String
  }
});


/**
 * @summary EFrameworkCore.Schemas.ShippingParcel
 * @description
 * @todo DOCUMENTACION y DESCRIPCION
 */
/**
 * ShippingParcel Schema
 */
EFrameworkCore.Schemas.ShippingParcel = new SimpleSchema({
  containers: {
    type: String,
    optional: true
  },
  length: {
    type: Number,
    optional: true
  },
  width: {
    type: Number,
    optional: true
  },
  height: {
    type: Number,
    optional: true
  },
  weight: {
    type: Number,
    optional: true
  }
});


/**
 * @summary EFrameworkCore.Schemas.Shipment
 * @description
 * @todo DOCUMENTACION y DESCRIPCION
 */
/**
 * Shipment Schema
 * used for cart/order shipment tracking
 */
EFrameworkCore.Schemas.Shipment = new SimpleSchema({
  _id: {
    type: String,
    label: "Shipment Id",
    autoValue: EFrameworkCore.schemaIdAutoValue
  },
  address: {
    type: EFrameworkCore.Schemas.Address,
    optional: true
  },
  shipmentMethod: {
    type: EFrameworkCore.Schemas.ShippingMethod,
    optional: true
  },
  shipmentQuotes: {
    type: [EFrameworkCore.Schemas.ShipmentQuote],
    optional: true
  },
  tracking: {
    type: String,
    optional: true
  },
  parcel: {
    type: EFrameworkCore.Schemas.ShippingParcel,
    optional: true
  },
  items: {
    type: [EFrameworkCore.Schemas.ShipmentItem],
    optional: true
  },
  workflow: {
    type: EFrameworkCore.Schemas.Workflow,
    optional: true
  },
  invoice: {
    type: EFrameworkCore.Schemas.Invoice,
    optional: true
  },
  transactions: {
    type: [Object],
    optional: true,
    blackbox: true
  }
});


/**
 * @summary EFrameworkCore.Schemas.ShippingProvider
 * @description
 * @todo DOCUMENTACION y DESCRIPCION
 */
/**
 * ShippingProvider Schema
 */
EFrameworkCore.Schemas.ShippingProvider = new SimpleSchema({
  name: {
    type: String,
    label: "Service Code"
  },
  label: {
    type: String,
    label: "Public Label"
  },
  enabled: {
    type: Boolean,
    defaultValue: true
  },
  serviceAuth: {
    type: String,
    label: "Auth",
    optional: true
  },
  serviceSecret: {
    type: String,
    label: "Secret",
    optional: true
  },
  serviceUrl: {
    type: String,
    label: "Service URL",
    optional: true
  }
});


/**
 * @summary EFrameworkCore.Schemas.Shipping
 * @description
 * @todo DOCUMENTACION y DESCRIPCION
 */
/**
 * Shipping Schema
 */
EFrameworkCore.Schemas.Shipping = new SimpleSchema({
  shopId: {
    type: String,
    index: 1,
    autoValue: EFrameworkCore.shopIdAutoValue,
    label: "Shipping ShopId"
  },
  provider: {
    type: EFrameworkCore.Schemas.ShippingProvider,
    label: "Shipping Provider"
  },
  methods: {
    type: [EFrameworkCore.Schemas.ShippingMethod],
    optional: true,
    label: "Shipping Methods"
  },
  shipmentQuotes: {
    type: [EFrameworkCore.Schemas.ShipmentQuote],
    optional: true,
    label: "Quoted Methods"
  }
});
