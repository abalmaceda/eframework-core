/**
 * Order Document Schema
 */

EFrameworkCore.Schemas.Document = new SimpleSchema({
  docId: {
    type: String
  },
  docType: {
    type: String,
    optional: true
  }
});

/**
 * Order History Schema
 */

EFrameworkCore.Schemas.History = new SimpleSchema({
  event: {
    type: String
  },
  userId: {
    type: String
  },
  updatedAt: {
    type: Date
  }
});

/**
 * Order Notes Schema
 */

EFrameworkCore.Schemas.Notes = new SimpleSchema({
  content: {
    type: String
  },
  userId: {
    type: String
  },
  updatedAt: {
    type: Date
  }
});

/**
 * OrderItems Schema
 * merges with EFrameworkCore.Schemas.Cart, EFrameworkCore.Schemas.Order]
 * to create Orders collection
 * @see common/collections.collection.js
 */
EFrameworkCore.Schemas.OrderItem = new SimpleSchema({
  additionalField: {
    type: String,
    optional: true
  },
  workflow: {
    type: EFrameworkCore.Schemas.Workflow,
    optional: true
  },
  history: {
    type: [EFrameworkCore.Schemas.History],
    optional: true
  },
  documents: {
    type: [EFrameworkCore.Schemas.Document],
    optional: true
  }
});


/**
 * OrderTransaction Schema
 * order transactions tie shipping, billing, and inventory transactions
 * @see common/collections.collection.js
 */
EFrameworkCore.Schemas.OrderTransaction = new SimpleSchema({
  itemId: {
    type: String,
    optional: true
  },
  paymentId: {
    type: String,
    optional: true
  },
  shipmentId: {
    type: String,
    optional: true
  },
  inventoryId: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isUpdate && !this.isSet) {
        return new Date;
      }
      this.unset();
    },
    denyUpdate: true
  }
});

/**
 * Order Schema
 * @see common/collections.collection.js
 */
EFrameworkCore.Schemas.Order = new SimpleSchema({
  userId: {
    type: String,
    unique: false
  },
  cartId: {
    type: String,
    optional: true
  },
  history: {
    type: [EFrameworkCore.Schemas.History],
    optional: true
  },
  documents: {
    type: [EFrameworkCore.Schemas.Document],
    optional: true
  },
  notes: {
    type: [EFrameworkCore.Schemas.Notes],
    optional: true
  },
  items: {
    type: [EFrameworkCore.Schemas.OrderItem],
    optional: true
  },
  transactions: {
    type: [EFrameworkCore.Schemas.OrderTransaction],
    optional: true
  }
});
