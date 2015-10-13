/**
 * PaymentMethod Schema
 */

EFrameworkCore.Schemas.PaymentMethod = new SimpleSchema({
  processor: {
    type: String
  },
  storedCard: {
    type: String,
    optional: true
  },
  method: {
    type: String,
    optional: true
  },
  transactionId: {
    type: String
  },
  workflow: {
    type: EFrameworkCore.Schemas.Workflow,
    optional: true
  },
  status: {
    type: String
  },
  mode: {
    type: String,
    allowedValues: ["authorize", "capture", "refund", "void"]
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isUpdate && !this.isSet) {
        return new Date;
      }
      this.unset();
    }
  },
  updatedAt: {
    type: Date,
    optional: true
  },
  authorization: {
    type: String,
    optional: true
  },
  amount: {
    type: Number,
    decimal: true,
    optional: true
  },
  transactions: {
    type: [Object],
    optional: true,
    blackbox: true
  }
});

/**
 * Invoice Schema
 */

EFrameworkCore.Schemas.Invoice = new SimpleSchema({
  transaction: {
    type: String,
    optional: true
  },
  shipping: {
    type: Number,
    decimal: true,
    optional: true
  },
  taxes: {
    type: Number,
    decimal: true,
    optional: true
  },
  subtotal: {
    type: Number,
    decimal: true
  },
  discounts: {
    type: Number,
    decimal: true,
    optional: true
  },
  total: {
    type: Number,
    decimal: true
  }
});

/**
 * Payment Schema
 */

EFrameworkCore.Schemas.Payment = new SimpleSchema({
  _id: {
    type: String,
    label: "Payment Id",
    autoValue: function () {
      if (this.isUpdate && !this.isSet) {
        return Random.id();
      }
      this.unset();
    }
  },
  address: {
    type: EFrameworkCore.Schemas.Address,
    optional: true
  },
  paymentMethod: {
    type: EFrameworkCore.Schemas.PaymentMethod,
    optional: true
  },
  invoice: {
    type: EFrameworkCore.Schemas.Invoice,
    optional: true
  }
});
