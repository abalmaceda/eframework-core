/**
 *
 * reactionApps
 *
 *   provides="<where matching registry provides is this >"
 *   enabled=true <false for disabled packages>
 *   context= true filter templates to current route
 *
 * returns matching package registry objects
 *  @todo:
 *   - reintroduce a dependency context
 *   - introduce position,zones #148
 *   - is it better to get all packages once and filter in code
 *     and possibly have some cache benefits down the road,
 *     or to retrieve what is requested and gain the advantage of priviledged,
 *     unnecessary data not retrieved with the cost of additional requests.
 *   - context filter should be considered experimental
 *
 *   @example {{#each reactionApps provides="settings" name=name container=container}}
 *   @example {{#each reactionApps provides="userAccountDropdown" enabled=true}}
 *   @example
 *     {{#each reactionApps provides="social" name="reaction-social"}}
 *         {{> Template.dynamic template=template data=customSocialSettings }}
 *     {{/each}}
 *
 *   @typedef optionHash
 *   @type {object}
 *   @property {string} name - name of a package.
 *   @property {string} provides -purpose of this package as identified to the registry
 *   @property {string} container - filter registry entries for matching container.
 *   @property {string} shopId - filter to only display results matching shopId, not returned
 *   @property {string} template - filter registry entries for matching template
 *   @type {optionHash}
 *
 *  @return {optionHash} returns an array of filtered, structure reactionApps
 *  [{
 *  	enabled: true
 *   label: "Stripe"
 *   name: "reaction-stripe"
 *   packageId: "QqkGsQCDRhg2LSn8J"
 *   priority: "1"
 *   provides: "paymentMethod"
 *   template: "stripePaymentForm"
 *   etc: "additional properties as defined in Packages.registry"
 *   ...
 *  }]
 */


/* TODO: Entender profundamente este codigo */
/* TODO: Parece que esta relacionado con el panel administrador*/
Template.registerHelper("reactionApps", function (optionHash) {
	let fields;
	let filter;
	let key;
	let match;
	let packages;

	let reactionApps;
	let reactionPackages;
	let registryFilter;

	let options = optionHash.hash; // _ref = options.hash;
	let packageSubscription = Meteor.subscribe("Packages");

	// you could provide a shopId in optionHash
	if (packageSubscription.ready()) {
		if (!options.shopId) {
			options.shopId = EFrameworkCore.getShopId();
		}

		reactionApps = [];
		filter = {};
		registryFilter = {};

		for (key in options) {
			if ({}.hasOwnProperty.call(options, key)) {
				let value = options[key];
				//
				if (!(key === "enabled" || key === "name" || key === "shopId")) {
					filter["registry." + key] = value;
					registryFilter[key] = value;
				}
				else {
					filter[key] = value;
				}
			}
		}
		fields = {
			enabled: 1,
			registry: 1,
			name: 1
		};

		reactionPackages = EFrameworkCore.Collections.Packages.find(filter, fields).fetch();

		if (!reactionPackages) {
			throw new Error("Packages not loaded.");
		}

		// filtramos por package y por disponibilidad true/false
		if (filter.name && filter.enabled) {
			packages = (function () {
				let _results = [];
				for (let pkg of reactionPackages) {
					if (pkg.name === filter.name && pkg.enabled === filter.enabled) {
						_results.push(pkg);
					}
				}
				return _results;
			})();

		}
		// Queremos todas lose elementos por package name
		else if (filter.name) {
			packages = (function () {
				let _results = [];
				for (let pkg of reactionPackages) {
					if (pkg.name === filter.name) {
						_results.push(pkg);
					}
				}
				return _results;
			})();

		}
		// solos los packages disponibles
		else if (filter.enabled) {
			packages = (function () {
				let _results = [];
				for (let pkg of reactionPackages) {
					if (pkg.enabled === filter.enabled) {
						_results.push(pkg);
					}
				}
				return _results;
			})();

		}
		// no hay filtro
		else {
			packages = (function () {
				let _results = [];
				for (let pkg of reactionPackages) {
					_results.push(pkg);
				}
				return _results;
			})();
		}
		// Se tienen todos los registros de entrada de package apps
		for (let app of packages) {
			// Se recorren todos los registros de entrada y se hace push de los disponibles.
			for (let registry of app.registry) {
				match = 0;
				for (key in registryFilter) {
					// Asegurar que las key son validas
					if ({}.hasOwnProperty.call(registryFilter, key)) {
						value = registryFilter[key];
						if (registry[key] === value) {
							match++;
						}
						if (match === Object.keys(registryFilter).length) {
							registry.name = app.name;
							if (registry.enabled !== false) {
								registry.enabled = registry.enabled || app.enabled;
								registry.packageId = app._id;
								reactionApps.push(registry);
							}
						}
					}
				}
			}
		}
		// Solo se necesita algun package una vez. Aseguremonos.
		// Ordenar apps por prioridad, nostros priorizamod
		reactionApps = _.uniq(reactionApps);
		reactionApps = reactionApps.sort((a, b) => b.priority - a.priority).slice();
		// Crear prioridad por index despues de ordenar
		for (let index in reactionApps) {
			if ({}.hasOwnProperty.call(reactionApps, index)) {
				let app = reactionApps[index];
				if (!app.priority) {
					reactionApps[index].priority = index;
				}
			}
		}

		return reactionApps;
	}
});
