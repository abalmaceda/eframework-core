/**
* Template.coreHead.helpers
* @summary Helpers para Template.coreHead
* @see commen/routing.js
*/
Template.coreHead.helpers({
	/**
	* @method metaData
	* @summary
	* @returns {Boolean}
	*/
	metaData: function () {
		return EFrameworkCore.MetaData;
	}
});

/**
* Template.coreAdminLayout.helpers
* @summary Helpers para Template.coreAdminLayout
*/
Template.coreAdminLayout.helpers({
	/**
	* @method template
	* @summary Obtiene el nombre del Tempate actual
	* @returns {String} Nombre del Template
	*/
	template: function () {
		return EFrameworkCore.getActionView();
	},

	/**
	* @method adminControlsClassname
	* @summary Entrega un css class para la vista de administrador para mostrar los settings
	* @returns {String}
	*/
	adminControlsClassname: function () {
		if (EFrameworkCore.isActionViewOpen()) {
			return "show-settings";
		}
		return "";
	}
});
