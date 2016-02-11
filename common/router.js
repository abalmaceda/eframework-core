/*
* E-Framework Core Routing
* reaction routing and security configuration
* utiliza iron:router package.
* Extend/override en eframework/client/routing.js
*/

/**
* @global Router
* @summary Configuración global de Router
*/
Router.configure({
	notFoundTemplate: "notFound",
	loadingTemplate: "loading",

	onRun: function () {
		$(window).scrollTop(0);
		EFrameworkCore.clearActionView();
		this.next();
	},

	onBeforeAction: function () {
		if (Meteor.isClient) {
			this.render("loading");
			Alerts.removeSeen();
			$(document).trigger("closeAllPopovers");
		}

		if (Meteor.isClient) {
			if (EFrameworkCore.hasDashboardAccess()) {
				this.layout("coreAdminLayout");
				// Find a registry entry for this page that provides settings
				// -- Settings is the default view for the "Action View"

				EFrameworkCore.setActionView();
				 this.render("dashboardPackages")
				$("body").addClass("admin");
			} else {
				$("body").removeClass("admin");
				this.layout("coreLayout");
			}
		}
		return this.next();
	}
});

/**
 * @summary Acción global para la subscripción a estas publicaciones antes de acceder a una nueva UI
 * @event Router.waitOn
 * @returns {void}
 */
Router.waitOn( function () {
	this.subscribe("Shops");
	return this.subscribe("Packages");
});

/*
 * ShopController Controller
 * Controlador principal para shop, mayoria de las vistas excepto admin
 */
let ShopController = RouteController.extend({
	onAfterAction: function () {
		return EFrameworkCore.MetaData.refresh(this.route, this.params);
	},
	yieldTemplates: {
		layoutHeader: {
			to: "layoutHeader"
		},
		layoutFooter: {
			to: "layoutFooter"
		},
		dashboard: {
			to: "dashboard"
		}
	}
});

this.ShopController = ShopController;

/*
 * ShopAccountsController Controller
 * restricts access of accounts views
 */

let ShopAccountsController = RouteController.extend({
  onBeforeAction: function () {
    if (!EFrameworkCore.hasPermission(this.route.getName())) {
      this.render("layoutHeader", {
        to: "layoutHeader"
      });
      this.render("layoutFooter", {
        to: "layoutFooter"
      });
      this.render("unauthorized");
    } else {
      this.next();
    }
  },
  yieldTemplates: {
    layoutHeader: {
      to: "layoutHeader"
    },
    layoutFooter: {
      to: "layoutFooter"
    },
    dashboard: {
      to: "dashboard"
    }
  }
});

this.ShopAccountsController = ShopAccountsController;

/*
 * ShopAdminController Controller
 * restricts access of admin views
 */
let ShopAdminController = this.ShopController.extend({
  onBeforeAction: function () {
    if (!EFrameworkCore.hasPermission(this.route.getName())) {
      this.render("layoutHeader", {
        to: "layoutHeader"
      });
      this.render("layoutFooter", {
        to: "layoutFooter"
      });
      this.render("unauthorized");
    } else {
      this.next();
    }
  }
});

 this.ShopAdminController = ShopAdminController;

// /*
//  * Print Controller
//  */

// let PrintController = RouteController.extend({
//   onBeforeAction: function () {
//     if (!EFrameworkCore.hasPermission(this.route.getName())) {
//       this.render("unauthorized");
//     } else {
//       this.next();
//     }
//   }
// });

// this.PrintController = PrintController;

/*
 * Declarar las URL generales
 */
 /* TODO : agregar una descripcion */
Router.map(function () {
	/* Si no se tiene permisos para ingresar a la ruta, se reenvia a este Template */
	this.route("unauthorized", {
		template: "unauthorized",
		name: "unauthorized"
	});
	/*
		Ruta inicial de la aplicación. Envia al Template Products
	*/
	this.route("index", {
		controller: ShopController,
		path: "/",
		name: "index",
		template: "products",
		//waitOn: function () {
		subscriptions: function(){
			/*
				Hay que estar suscrito a Proucts, antes de ir al Template.
				Asi puedo utlizar la información para llenar la UI
			*/
			return this.subscribe("Products", Session.get("productScrollLimit"));
		}
	  });

	this.route("dashboard", {
		controller: ShopAdminController,
		template: "dashboardPackages",
		onBeforeAction: function () {
			Session.set("dashboard", true);
			return this.next();
		}
  	});

	this.route("dashboard/shop", {
		controller: ShopAdminController,
		path: "/dashboard/shop",
		template: "shopDashboard",
		data: function () {
			return EFrameworkCore.Collections.Shops.findOne();
		}
	});

	this.route("dashboard/orders", {
		controller: ShopAdminController,
		path: "dashboard/orders/:_id?",
		template: "orders",
		waitOn: function () {
			return this.subscribe("Orders");
		},
		data: function () {
			if (Orders.findOne(this.params._id)) {
				return EFrameworkCore.Collections.Orders.findOne({
					_id: this.params._id
				});
			}
		}
	});


	/**
	 * @summary Ruta para acceder a los productos que tienen determinado tag.
	 * @param {String} _id - tagId
	 * @returns {void}
	 * @todo Descripcion
	 */
	this.route("product/tag", {
		controller: ShopController,
		path: "product/tag/:_id",
		template: "products",
		waitOn: function () {
			return this.subscribe("Products", Session.get("productScrollLimit"));
		},
		subscriptions: function () {
			return this.subscribe("Tags");
		},
		data: function () {
			let id;
			if (this.ready()) {
				id = this.params._id;
				return {
					tag: Tags.findOne({ slug: id }) || Tags.findOne(id)
				};
			}
		}
	});

	/**
	 * @summary Ruta para acceder a los detalles de un producto.
	 * @param {String} _id - productId
	 * @param {String} variant -
	 * @returns {void}
	 * @todo Descripcion
	 */
	this.route("product", {
		controller: ShopController,
		path: "product/:_id/:variant?",
		template: "productDetail",
		waitOn: function () {
			return this.subscribe("Product", this.params._id);
		},
		onBeforeAction: function () {
			let variant;
			variant = this.params.variant || this.params.query.variant;
			EFrameworkCore.setProduct(this.params._id, variant);
			return this.next();
		},
		data: function () {
			let product;
			product = selectedProduct();
			if (this.ready() && product) {
				if (!product.isVisible) {
					if (!EFrameworkCore.hasPermission("createProduct")) {
						this.render("unauthorized");
					}
				}
				return product;
			}
			if (this.ready() && !product) {
				return this.render("productNotFound");
			}
		}
	});

	this.route("cartCheckout", {
		layoutTemplate: "coreLayout",
		path: "checkout",
		template: "cartCheckout",
		yieldTemplates: { checkoutHeader: { to: "layoutHeader" } },
		waitOn: function () {
			this.subscribe("Packages");
			this.subscribe("Products");
			this.subscribe("Shipping");
			return this.subscribe("AccountOrders");
		}
	});

//   this.route("cartCompleted", {
//     controller: ShopController,
//     path: "completed/:_id",
//     template: "cartCompleted",
//     subscriptions: function () {
//       this.subscribe("Orders");
//       return this.subscribe("CompletedCartOrder", Meteor.userId(),
//         this.params._id);
//     },
//     data: function () {
//       if (this.ready()) {
//         if (EFrameworkCore.Collections.Orders.findOne({
//           cartId: this.params._id
//         })) {
//           return EFrameworkCore.Collections.Orders.findOne({
//             cartId: this.params._id
//           });
//         }
//         return this.render("unauthorized");
//       }
//       return this.render("loading");
//     }
//   });

//   return this.route("dashboard/pdf/orders", {
//     controller: PrintController,
//     path: "dashboard/pdf/orders/:_id",
//     template: "completedPDFLayout",
//     onBeforeAction() {
//       this.layout("print");
//       return this.next();
//     },
//     subscriptions: function () {
//       this.subscribe("Orders");
//     },
//     data: function () {
//       if (this.ready()) {
//         return EFrameworkCore.Collections.Orders.findOne({
//           _id: this.params._id
//         });
//       }
//     }
//   });
});
