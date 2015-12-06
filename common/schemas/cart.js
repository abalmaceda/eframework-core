/**
 * CartItem Schema
 */
/*TODO*/
EFrameworkCore.Schemas.CartItem = new SimpleSchema({
  _id: {
    type: String
  },
  productId: {
    type: String,
    index: 1
  },
  shopId: {
    type: String,
    autoValue: EFrameworkCore.shopIdAutoValue,
    index: 1,
    label: "Cart Item shopId",
    optional: true
  },
  quantity: {
    label: "Quantity",
    type: Number,
    min: 0
  },
  variants: {
    type: EFrameworkCore.Schemas.ProductVariant
  }
});

/**
 * Cart Schema
 */
/*TODO*/
EFrameworkCore.Schemas.Cart = new SimpleSchema({
  shopId: {
    type: String,
    autoValue: EFrameworkCore.shopIdAutoValue,
    index: 1,
    label: "Cart ShopId"
  },
  userId: {
    type: String,
    unique: true,
    /**
    * @description "isInsert", "isUpdate" e "isFromTrustedCode" son variables del package collection2
    * @see {@link https://atmospherejs.com/aldeed/collection2|ATMOSPHERE}
    */
    autoValue: function () {
      if (this.isInsert || this.isUpdate) {
        if (!this.isFromTrustedCode) {
          return this.userId;
        }
      } else {
        this.unset();
      }
    }
  },
  sessionId: {
    type: String,
    autoValue: function () {
      return EFrameworkCore.sessionId;
    },
    index: 1
  },
  email: {
    type: String,
    optional: true,
    index: 1,
    regEx: SimpleSchema.RegEx.Email
  },
  items: {
    type: [EFrameworkCore.Schemas.CartItem],
    optional: true
  },
  shipping: {
    type: [EFrameworkCore.Schemas.Shipment],
    optional: true,
    blackbox: true
  },
  billing: {
    type: [EFrameworkCore.Schemas.Payment],
    optional: true,
    blackbox: true
  },
  totalPrice: {
    label: "Total Price",
    type: Number,
    optional: true,
    decimal: true,
    min: 0
  },
  workflow: {
    type: EFrameworkCore.Schemas.Workflow,
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
  },
  updatedAt: {
    type: Date,
    autoValue: function () {
      if (this.isUpdate) {
        return {
          $set: new Date
        };
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date
        };
      }
    },
    optional: true
  }
});
