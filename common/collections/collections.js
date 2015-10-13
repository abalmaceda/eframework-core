
/**
* EFrameworkCore Collections
*
*
* transform methods used to return cart calculated values
* cartCount, cartSubTotal, cartShipping, cartTaxes, cartTotal
* are calculated by a transformation on the collection
* and are available to use in template as cart.xxx
* in template: {{cart.cartCount}}
* in code: EFrameworkCore.Collections.Cart.findOne().cartTotal()
*/

/**
* EFrameworkCore transform collections
*/
// EFrameworkCore.Helpers.cartTransform = {
//   cartCount: function () {
//     let count = 0;
//     if (typeof this !== "undefined" && this !== null ? this.items : void 0) {
//       for (let items of this.items) {
//         count += items.quantity;
//       }
//     }
//     return count;
//   },
//   cartShipping: function () {
//     let shipping = 0;
//     if (this.shipping) {
//       if (this.shipping[0].shipmentMethod) {
//         shipping += this.shipping[0].shipmentMethod.rate;
//       }
//     }
//     return shipping;
//   },
//   cartSubTotal: function () {
//     let subtotal = 0;
//     if (typeof this !== "undefined" && this !== null ? this.items : void 0) {
//       for (let items of this.items) {
//         subtotal += items.quantity * items.variants.price;
//       }
//     }
//     subtotal = subtotal.toFixed(2);
//     return subtotal;
//   },
//   cartTaxes: function () {
//     let subtotal = 0;
//     if (typeof this !== "undefined" && this !== null ? this.items : void 0) {
//       for (let items of this.items) {
//         let tax = this.tax || 0;
//         subtotal += items.variants.price * tax;
//       }
//     }
//     subtotal = subtotal.toFixed(2);
//     return subtotal;
//   },
//   cartDiscounts: function () {
//     return "0.00";
//   },
//   cartTotal: function () {
//     let total;
//     let subtotal = 0;
//     if (typeof this !== "undefined" && this !== null ? this.items : void 0) {
//       for (let items of this.items) {
//         subtotal += items.quantity * items.variants.price;
//       }
//     }
//     let shipping = 0;
//     if (this.shipping) {
//       if (this.shipping.shippingMethod) {
//         for (let shippingMethod of this.shipping.shippingMethod) {
//           shipping += shippingMethod.rate;
//         }
//       }
//     }

//     shipping = parseFloat(shipping);
//     if (!isNaN(shipping)) {
//       subtotal = subtotal + shipping;
//     }
//     total = subtotal.toFixed(2);
//     return total;
//   }
// };

// /**
// * EFrameworkCore Collections Cart
// */
// EFrameworkCore.Collections.Cart = Cart = this.Cart = new Mongo.Collection("Cart", {
//   transform: function (cart) {
//     let newInstance = Object.create(EFrameworkCore.Helpers.cartTransform);
//     return _.extend(newInstance, cart);
//   }
// });

// EFrameworkCore.Collections.Cart.attachSchema(EFrameworkCore.Schemas.Cart);


// /**
// * EFrameworkCore Collections Orders
// */
// EFrameworkCore.Collections.Orders = Orders = this.Orders = new Mongo.Collection("Orders", {
//   transform: function (order) {
//     order.itemCount = function () {
//       let count = 0;
//       if (order !== null ? order.items : void 0) {
//         for (let items of order.items) {
//           count += items.quantity;
//         }
//       }
//       return count;
//     };
//     return order;
//   }
// });

// EFrameworkCore.Collections.Orders.attachSchema([
//   EFrameworkCore.Schemas.Cart,
//   EFrameworkCore.Schemas.Order,
//   EFrameworkCore.Schemas.OrderItem
// ]);

/**
* EFrameworkCore Collections Packages
*/
EFrameworkCore.Collections.Packages = new Mongo.Collection("Packages");

EFrameworkCore.Collections.Packages.attachSchema(EFrameworkCore.Schemas.PackageConfig);

/**
* EFrameworkCore Collections Products
*/
EFrameworkCore.Collections.Products = Products = this.Products = new Mongo.Collection("Products");

EFrameworkCore.Collections.Products.attachSchema(EFrameworkCore.Schemas.Product);

/**
* EFrameworkCore Collections Shipping
*/
EFrameworkCore.Collections.Shipping = new Mongo.Collection("Shipping");

EFrameworkCore.Collections.Shipping.attachSchema(EFrameworkCore.Schemas.Shipping);

/**
* EFrameworkCore Collections Taxes
*/
EFrameworkCore.Collections.Taxes = new Mongo.Collection("Taxes");

EFrameworkCore.Collections.Taxes.attachSchema(EFrameworkCore.Schemas.Taxes);

/**
* EFrameworkCore Collections Discounts
*/
EFrameworkCore.Collections.Discounts = new Mongo.Collection("Discounts");

EFrameworkCore.Collections.Discounts.attachSchema(EFrameworkCore.Schemas.Discounts);

/**
* EFrameworkCore Collections Shops
*/
EFrameworkCore.Collections.Shops = Shops = this.Shops = new Mongo.Collection("Shops");

EFrameworkCore.Collections.Shops.attachSchema(EFrameworkCore.Schemas.Shop);

/**
* EFrameworkCore Collections Tags
*/
EFrameworkCore.Collections.Tags = Tags = this.Tags = new Mongo.Collection("Tags");

EFrameworkCore.Collections.Tags.attachSchema(EFrameworkCore.Schemas.Tag);

/**
* EFrameworkCore Collections Translations
*/
EFrameworkCore.Collections.Translations = new Mongo.Collection("Translations");

EFrameworkCore.Collections.Translations.attachSchema(EFrameworkCore.Schemas.Translation);

/**
* EFrameworkCore Collections Accounts
*/
EFrameworkCore.Collections.Layouts = new Mongo.Collection("Layouts");

EFrameworkCore.Collections.Layouts.attachSchema(EFrameworkCore.Schemas.Layouts);
