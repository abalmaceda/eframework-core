/**
* Template.packagesGrid.helpers
* @summary Helpers para Template.packagesGrid
*/
Template.packagesGrid.helpers({
	/**
	* @method pkgPermissions
	* @summary Si se debe mostrar
	* @returns {Boolean}
	*/
	pkgPermissions: function() {
		//verifica permisos de dashboard
		if (EFrameworkCore.hasPermission('dashboard')) {
			if (this.route) {
				//verifica si tiene permisos para la ruta
				return EFrameworkCore.hasPermission(this.route);
			}
			else {
				//verifica si tiene permisos por nombre
				return EFrameworkCore.hasPermission(this.name);
			}
		}
		else {
			return false;
		}
	}
});
