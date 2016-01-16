// /**
//  * security definitions
//  *
//  * The following security definitions use the ongoworks:security package.
//  * Rules within a single chain stack with AND relationship. Multiple
//  * chains for the same collection stack with OR relationship.
//  * See https://github.com/ongoworks/meteor-security
//  *
//  * It"s important to note that these security rules are for inserts,
//  * updates, and removes initiated from untrusted (client) code.
//  * Thus there may be other actions that certain roles are allowed to
//  * take, but they do not necessarily need to be listed here if the
//  * database operation is executed in a server method.
//  */


/**
 * @summary Se definen variables locales
 */
let Cart = EFrameworkCore.Collections.Cart;

//let Discounts = EFrameworkCore.Collections.Discounts;

//let Media = EFrameworkCore.Collections.Media;

let Orders = EFrameworkCore.Collections.Orders;

let Packages = EFrameworkCore.Collections.Packages;

let Products = EFrameworkCore.Collections.Products;

let Shipping = EFrameworkCore.Collections.Shipping;

let Shops = EFrameworkCore.Collections.Shops;

let Tags = EFrameworkCore.Collections.Tags;

//let Taxes = EFrameworkCore.Collections.Taxes;

let Translations = EFrameworkCore.Collections.Translations;

// /*
//  * Define some additional rule chain methods
//  */

 /**
 * @method ifShopIdMatches
 * @summary Verifica si el shopId del formulario es el mismo que el del shopId actual
 * @return {Boolean}
 */
Security.defineMethod("ifShopIdMatches",
{
	fetch: [],
	deny: function (type, arg, userId, doc) {
		return doc.shopId !== EFrameworkCore.getShopId();
	}
});

 /**
 * @method ifShopIdMatchesThisId
 * @summary Verifica si doc._id del formulario es el mismo que el del shopId actual
 * @return {Boolean}
 */
Security.defineMethod("ifShopIdMatchesThisId",
{
	fetch: [],
	deny: function (type, arg, userId, doc) {
		return doc._id !== EFrameworkCore.getShopId();
	}
});

// Security.defineMethod("ifFileBelongsToShop", {
//   fetch: [],
//   deny: function (type, arg, userId, doc) {
//     return doc.metadata.shopId !== EFrameworkCore.getShopId();
//   }
// });

// Security.defineMethod("ifUserIdMatches", {
//   fetch: [],
//   deny: function (type, arg, userId, doc) {
//     return userId && doc.userId && doc.userId !== userId || doc.userId && !userId;
//   }
// });

// Security.defineMethod("ifUserIdMatchesProp", {
//   fetch: [],
//   deny: function (type, arg, userId, doc) {
//     return doc[arg] !== userId;
//   }
// });

// Security.defineMethod("ifSessionIdMatches", {
//   fetch: [],
//   deny: function (type, arg, userId, doc) {
//     return doc.sessionId !== EFrameworkCore.sessionId;
//   }
// });

 /**
 * @summary Definir los roles de seguridad
 */

 /**
 * @description Seguridad para Administrador "admin"
 * @summary Los usuarios con rol "admin" pueden "insert", "update", "remove" en Products, Tags, Translations, Discounts, Taxes, Shipping, Orders, Packages Excepto si ifShopIdMatches retorna TRUE y que no sea ejecuta la acción sobre shopId
 * @todo agregar discounts, taxes
 */
Security.permit(["insert", "update", "remove"]).collections([Products, Tags, Translations, /*Discounts, Taxes,*/ Shipping, Orders, Packages ]).ifHasRole(
{
	role: "admin",
	group: EFrameworkCore.getShopId()
}).ifShopIdMatches().exceptProps(["shopId"]).apply();

// /*
//  * Permissive security for users with the "admin" role for FS.Collections
//  */

// Security.permit(["insert", "update", "remove"]).collections([Media]).ifHasRole({
//   role: ["admin", "owner", "createProduct"],
//   group: EFrameworkCore.getShopId()
// }).ifFileBelongsToShop().apply();

// /*
//  * Users with the "admin" or "owner" role may update and
//  * remove their shop but may not insert one.
//  */

 /**
 * @description Seguridad para Administrador "admin"
 * @summary "update"y "remove" Shops si tienen el role "admin" ó "owner" y son del grupo shopId
 */
Shops.permit(["update", "remove"]).ifHasRole({
  role: ["admin", "owner"],
  group: EFrameworkCore.getShopId()
}).ifShopIdMatchesThisId().apply();

// /*
//  * Users with the "admin" or "owner" role may update and
//  * remove products, but createProduct allows just for just a product editor
//  */

// Products.permit(["insert", "update", "remove"]).ifHasRole({
//   role: ["createProduct"],
//   group: EFrameworkCore.getShopId()
// }).ifShopIdMatchesThisId().apply();

// /*
//  * Users with the "owner" role may remove orders for their shop
//  */

// Orders.permit("remove").ifHasRole({
//   role: "owner",
//   group: EFrameworkCore.getShopId()
// }).ifShopIdMatches().exceptProps(["shopId"]).apply();

// /*
//  * Can update cart from client. Must insert/remove carts using
//  * server methods.
//  * Can update all session carts if not logged in or user cart if logged in as that user
//  * XXX should verify session match, but doesn"t seem possible? Might have to move all cart updates to server methods, too?
//  */

// Cart.permit(["insert", "update", "remove"]).ifHasRole({
//   role: ["anonymous", "guest"],
//   group: EFrameworkCore.getShopId()
// }).ifShopIdMatchesThisId().ifUserIdMatches().ifSessionIdMatches().apply();

// /*
//  * apply download permissions to file collections
//  */
// _.each([Media], function (fsCollection) {
//   return fsCollection.allow({
//     download: function () {
//       return true;
//     }
//   });
// });
