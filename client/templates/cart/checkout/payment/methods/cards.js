/**
 * corePaymentMethods helpers
 *
 * app details defaults the icon and label to the package dashboard settings
 * but you can override by setting in the package registry
 * eventually admin editable as well.
 * label is also translated with checkoutPayment.{{app name}}.label
 */
Template.corePaymentMethods.helpers({
	/**
	* @function isOpen
	* @summary Selecciona automaticamente la opión con la mayor prioridad == 0
	* @param {Number} current -
	* @returns {String} CSS Class para abrir selecionar elmento html
	* @todo Documentar
	*/

  isOpen: function (current) {
    if (current.priority === 0) {
      return "in";
    }
  },

  	/**
  	 * @function appDetails
  	 * @summary Obtener los detalles de la aplicación
  	 * @returns {Object} Datos de la aplicación
  	 * @this What_does_the_THIS_keyword_refer_to_here
  	 * @todo Documentar THIS
  	 */
	appDetails: function () {
		let self = this;
		if (!(self.icon && self.label)) {
			let app = EFrameworkCore.Collections.Packages.findOne(self.packageId);
			for (let registry of app.registry) {
				if (!(registry.provides === "dashboard")) {
					continue;
				}
				self.icon = registry.icon;
				self.label = registry.label;
			}
		}
		return self;
	}
});
