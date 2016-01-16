/**
* Template.shopSettings.helpers
* @summary Helpers para Template.shopSettings
*/
Template.shopSettings.helpers({
	/**
	* @method shop
	* @summary Obtiene el Cursor de la collection shop
	* @returns {Cursor}
	*/
	shop: function () {
		return EFrameworkCore.Collections.Shops.findOne();
	},

	/**
	* @method packageData
	* @summary Obtiene el Cursor de la collection package
	* @returns {Cursor}
	*/
	packageData: function() {
		return EFrameworkCore.Collections.Packages.findOne({ name: "core" });
	},


	// addressBook: function() {
	// 	var address;
	// 	address = Shops.findOne().addressBook;
	// 	return address[0];
	// },
 //  countryOptions: function() {
 //    var countries, country, countryOptions, locale;
 //    countries = EFrameworkCore.Collections.Shops.findOne().locales.countries;
 //    countryOptions = [];
 //    for (locale in countries) {
 //      country = countries[locale];
 //      countryOptions.push({
 //        label: country.name,
 //        value: locale
 //      });
 //    }
 //    countryOptions.sort(function(a, b) {
 //      if (a.label < b.label) {
 //        return -1;
 //      }
 //      if (a.label > b.label) {
 //        return 1;
 //      }
 //      return 0;
 //    });
 //    return countryOptions;
 //  },
 //  currencyOptions: function() {
 //    var currencies, currency, currencyOptions, structure;
 //    currencies = EFrameworkCore.Collections.Shops.findOne().currencies;
 //    currencyOptions = [];
 //    for (currency in currencies) {
 //      structure = currencies[currency];
 //      currencyOptions.push({
 //        label: currency + "  |  " + structure.symbol + "  |  " + structure.format,
 //        value: currency
 //      });
 //    }
 //    return currencyOptions;
 //  },
 //  uomOptions: function() {
 //    var measure, unitsOfMeasure, uom, uomOptions;
 //    unitsOfMeasure = EFrameworkCore.Collections.Shops.findOne().unitsOfMeasure;
 //    uomOptions = [];
 //    for (measure in unitsOfMeasure) {
 //      uom = unitsOfMeasure[measure];
 //      uomOptions.push({
 //        label: uom.name,
 //        value: measure
 //      });
 //    }
 //    return uomOptions;
 //  }
});


 /**
 * AutoForm.hooks
 * @summary Hooks para shopSettings
 */
AutoForm.hooks({
	/**
	 * @summary Eventos del formulario id = shopEditForm
	 */
	shopEditForm: {
		/**
		* @summary Muestra mensaje de exito de operación.
		* @event onSuccess
		* @Param{} - operation
		* @Param{} - result
		* @Param{Blaze.Template} - template
		* @returns {void}
		* @todo parametros
		*/
		onSuccess: function(operation, result, template) {
			return Alerts.add("Shop general settings saved.", "success", {autoHide: true});
		},
		/**
		* @summary Muestra mensaje de error en operación.
		* @event onError
		* @Param{} - operation
		* @Param{} - result
		* @Param{Blaze.Template} - template
		* @returns {void}
		* @todo parametros
		*/
		onError: function(operation, error, template) {
			return Alerts.add("Shop general settings update failed. " + error, "danger");
		}
	}
});

 /**
 * AutoForm.hooks
 * @summary Hooks para shopSettings
 */
AutoForm.hooks({
	/**
	 * @summary Eventos del formulario id = shopEditAddressForm
	 */
	shopEditAddressForm: {
		/**
		* @summary Muestra mensaje de exito de operación.
		* @event onSuccess
		* @Param{} - operation
		* @Param{} - result
		* @Param{Blaze.Template} - template
		* @returns {void}
		* @todo parametros
		*/
		onSuccess: function(operation, result, template) {
			return Alerts.add("Shop address settings saved.", "success", { autoHide: true });
		},

		/**
		* @summary Muestra mensaje de error en operación.
		* @event onError
		* @Param{} - operation
		* @Param{} - result
		* @Param{Blaze.Template} - template
		* @returns {void}
		* @todo parametros
		*/
		onError: function(operation, error, template) {
		return Alerts.add("Shop address settings update failed. " + error, "danger");
		}
	}
});

 /**
 * AutoForm.hooks
 * @summary Hooks para shopSettings
 */
AutoForm.hooks({
	/**
	 * @summary Eventos del formulario id = shopEditEmailForm
	 */
	shopEditEmailForm: {
		/**
		* @summary Muestra mensaje de exito de operación.
		* @event onSuccess
		* @Param{} - operation
		* @Param{} - result
		* @Param{Blaze.Template} - template
		* @returns {void}
		* @todo parametros
		*/
		onSuccess: function(operation, result, template) {
			return Alerts.add("Shop mail settings saved.", "success", { autoHide: true});
		},

		/**
		* @summary Muestra mensaje de error en operación.
		* @event onError
		* @Param{} - operation
		* @Param{} - result
		* @Param{Blaze.Template} - template
		* @returns {void}
		* @todo parametros
		*/
		onError: function(operation, error, template) {
			return Alerts.add("Shop mail settings update failed. " + error, "danger");
		}
	}
});

 /**
 * AutoForm.hooks
 * @summary Hooks para shopSettings
 */
AutoForm.hooks({
	/**
	 * @summary Eventos del formulario id = shopEditOpenExchangeRatesForm
	 */
	shopEditOpenExchangeRatesForm: {
		/**
		* @summary Muestra mensaje de exito de operación.
		* @event onSuccess
		* @Param{} - operation
		* @Param{} - result
		* @Param{Blaze.Template} - template
		* @returns {void}
		* @todo parametros
		*/
		onSuccess: function(operation, result, template) {
			return Alerts.add("Open Exchange settings saved.", "success", {autoHide: true});
		},

		/**
		* @summary Muestra mensaje de error en operación.
		* @event onError
		* @Param{} - operation
		* @Param{} - result
		* @Param{Blaze.Template} - template
		* @returns {void}
		* @todo parametros
		*/
		onError: function(operation, error, template) {
			return Alerts.add("Open Exchange settings update failed. " + error, "danger");
		}
	}
});

 /**
 * AutoForm.hooks
 * @summary Hooks para shopSettings
 */
AutoForm.hooks({
	/**
	 * @summary Eventos del formulario id = shopEditSettingsForm
	 */
	shopEditSettingsForm: {
		/**
		* @summary Muestra mensaje de exito de operación.
		* @event onSuccess
		* @Param{} - operation
		* @Param{} - result
		* @Param{Blaze.Template} - template
		* @returns {void}
		* @todo parametros
		*/
		onSuccess: function(operation, result, template) {
			return Alerts.add("Shop settings saved.", "success", { autoHide: true});
		},

		/**
		* @summary Muestra mensaje de error en operación.
		* @event onError
		* @Param{} - operation
		* @Param{} - result
		* @Param{Blaze.Template} - template
		* @returns {void}
		* @todo parametros
		*/
		onError: function(operation, error, template) {
			return Alerts.add("Shop setting update failed. " + error, "danger");
		}
	}
});

 /**
 * AutoForm.hooks
 * @summary Hooks para shopSettings
 */
AutoForm.hooks({
	/**
	 * @summary Eventos del formulario id = shopEditOptionsForm
	 */
	shopEditOptionsForm: {
		/**
		* @summary Muestra mensaje de exito de operación.
		* @event onSuccess
		* @Param{} - operation
		* @Param{} - result
		* @Param{Blaze.Template} - template
		* @returns {void}
		* @todo parametros
		*/
		onSuccess: function(operation, result, template) {
			return Alerts.add("Shop options saved.", "success", { autoHide: true });
		},

		/**
		* @summary Muestra mensaje de error en operación.
		* @event onError
		* @Param{} - operation
		* @Param{} - result
		* @Param{Blaze.Template} - template
		* @returns {void}
		* @todo parametros
		*/
		onError: function(operation, error, template) {
			return Alerts.add("Shop options update failed. " + error, "danger");
		}
	}
});
