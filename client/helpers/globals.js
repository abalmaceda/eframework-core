// Reaction Globals
/* eslint "no-extend-native": [2, {"exceptions": ["String"]}] */
/* eslint "no-alert": 0 */

/**
 * String.prototype.toCamelCase
 * @summary special toCamelCase for converting a string to camelCase for use with i18n keys
 * @return {String} camelCased string
 * @todo Entender
 */
String.prototype.toCamelCase = function () {
  let s;
  s = this.replace(/([^a-zA-Z0-9_\- ])|^[_0-9]+/g, "").trim().toLowerCase();
  s = s.replace(/([ -]+)([a-zA-Z0-9])/g, function (a, b, c) {
    return c.toUpperCase();
  });
  s = s.replace(/([0-9]+)([a-zA-Z])/g, function (a, b, c) {
    return b + c.toUpperCase();
  });
  return s;
};

/**
 * toggleSession
 * quick and easy snippet for toggling sessions
 * @param {String} sessionVariable - string name, see http://docs.meteor.com/#/basic/session
 * @param {String} positiveState - optional, if is is positiveState, set opposite
 * @return {Object} return session value
 * @todo Entender
 */
this.toggleSession = function (sessionVariable, positiveState) {
	let session;
	session = Session.get(sessionVariable);
	positive = positiveState || true;
	if (_.isEqual(positive, session)) {
		Session.set(sessionVariable, false);
	}
	else {
		Session.set(sessionVariable, positive);
	}
	return Session.get(sessionVariable);
};

/**
 * getProductsByTag
 * @summary method to return tag specific product
 * @param {String} tag - tag string
 * @return {Object} - return products collection cursor filtered by tag
 * @todo Entender
 */
this.getProductsByTag = function (tag) {
  let hashtags;
  let newRelatedTags;
  let relatedTag;
  let relatedTags;
  let selector = {};

  if (tag) {
    hashtags = [];
    relatedTags = [tag];
    while (relatedTags.length) {
      newRelatedTags = [];
      for (relatedTag of relatedTags) {
        if (hashtags.indexOf(relatedTag._id) === -1) {
          hashtags.push(relatedTag._id);
        }
      }
      relatedTags = newRelatedTags;
    }
    selector.hashtags = {
      $in: hashtags
    };
  }
  let cursor = Products.find(selector);
  return cursor;
};

/**
 * maybeDeleteProduct
 * @summary confirm product deletion, delete, and alert
 * @param {Object} product - Objeto product
 * @return {Object} - returns nothing, and alerts,chappen here
 * @todo - Esto debe estar en un template.
 */
this.maybeDeleteProduct = function (product) {
	let title = product.title || "the product";
	let id = product._id;
	if (confirm("Delete this product?")) {
		return Meteor.call("products/deleteProduct", id, function (error, result) {
			/*En caso de que ocurriera un error en el proceso*/
			if (error || !result) {
				/*Informfo del error */
				Alerts.add("There was an error deleting " + title, "danger", {
					type: "prod-delete-" + id,
					i18nKey: "productDetail.productDeleteError"
				});
				/*Agrego al log que sobre el error ocurrido */
				throw new Meteor.Error("Error deleting product " + id, error);
			}
			/*En caso de que a eliminación fue exitosa*/
			else {
				setCurrentProduct(null);
				Router.go("/");
				/*Informfo que se realizo la eliminación*/
				return Alerts.add("Deleted " + title, "info", {
					type: "prod-delete-" + id
				});
			}
		});
	}
};

/**
 * locateUser
 * @return {Object} set and return session address based on browser latitude, longitude
 */
this.locateUser = function () {
  function successFunction(position) {
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    return Meteor.call("shop/locateAddress", lat, lng, function (error,
      address) {
      if (address) {
        return Session.set("address", address);
      }
    });
  }

  function errorFunction() {
    return Meteor.call("shop/locateAddress", function (error, address) {
      if (address) {
        return Session.set("address", address);
      }
    });
  }

  if (navigator.geolocation) {
    return navigator.geolocation.getCurrentPosition(successFunction,
      errorFunction);
  }
};
