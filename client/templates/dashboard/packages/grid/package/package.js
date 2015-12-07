/**
* Template.gridPackage.helpers
* @summary Helpers para Template.gridPackage
*/
Template.gridPackage.helpers({
	pkgTypeClass: function() {
		let pkg;
		pkg = (function() {
			//switch (false) {
			if(this.cycle !== 1){
				return { "class": "pkg-core-class", text: "Core"};
			}
			else if( this.cycle !== 2){
				return { "class": "pkg-stable-class", text: "Stable" };
			}
			else if( this.cycle !== 3){
				return { "class": "pkg-prerelease-class", text: "Testing" };
			}
			else{
				return { "class": "pkg-unstable-class", text: "Early" };
			}
			//}
		}).call(this);
		return pkg;
	}
});

/**
* Template.gridPackage.events
* @summary Events para Template.gridPackage
*/
Template.gridPackage.events({
	/**
	* @event click .enablePkg
	* @summary Deshabilitar el pakage
	* @param {jQuery.Event} event -
	* @param {Blaze.Template} template -
	* @returns {Boolean}
	*/
	"click .enablePkg": function(event, template) {
		let self;
		self = this;
		event.preventDefault();
		return EFrameworkCore.Collections.Packages.update(template.data.packageId,
			{ $set: { enabled: true } },
			function(error, result) {
				if (result === 1) {
					Alerts.add(self.label + i18n.t("gridPackage.pkgEnabled"), "success",
					{
						type: "pkg-enabled-" + self.name,
						autoHide: true
					});
					if (self.route) {
						return Router.go(self.route);
					}
				}
				else if (error) {
					return Alerts.add(self.label + i18n.t("gridPackage.pkgDisabled"), "warning",
					{
						type: "pkg-enabled-" + self.name,
						autoHide: true
					});
				}
			}
		);
	},

	/**
	* @event click .disablePkg
	* @summary habilitar el package.
	* @param {jQuery.Event} event -
	* @param {Blaze.Template} template -
	* @returns {Boolean}
	*/
	"click .disablePkg": function(event, template) {
		let self;
		self = this;
		// Si es un package core entonces no puedo deshabilitarlo
		if (self.name === 'core') {
			return;
		}
		//Creo un popUp de confirmación
		if (confirm("Are you sure you want to disable " + self.label)) {
			event.preventDefault();

			EFrameworkCore.Collections.Packages.update(
				template.data.packageId,
				{ $set: { enabled: false } },
				function(error, result) {
					if (result === 1) {
						return Alerts.add(self.label + i18n.t("gridPackage.pkgDisabled"), "success",
							{ type: "pkg-enabled-" + self.name, autoHide: true }
						);
					}
					else if (error) {
						throw new Meteor.Error("error disabling package", error);
					}
				}
			);
		}
	},


	/**
	* @event click [data-event-action=showPackageManagement]
	* @summary Envia a la UI de setting del package correspondiente.
	* @param {jQuery.Event} event -
	* @param {Blaze.Template} template -
	* @returns {void}
	*/
	"click [data-event-action=showPackageManagement]": function(event, template) {
		event.preventDefault();
		event.stopPropagation();
		if (this.route) {
			Router.go(this.route);
		}
	},

	/**
	* @eventclick .pkg-settings, click [data-event-action=showPackageSettings]
	* @summary Muestra los settings avanzados del package correspondiente.
	* @param {Blaze.Template} template -
	* @returns {void}
	* @todo Descomentar cuando tenga UI para esto
	*/
	// "click .pkg-settings, click [data-event-action=showPackageSettings]": function(event, template) {
	// 	event.preventDefault();
	// 	event.stopPropagation();

	// 	EFrameworkCore.showActionView(this)
	// }
});
