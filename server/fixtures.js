/* TODO: verificar todo este código*/

/*
 * Fixtures is a global server object that it can be reused in packages
 * assumes collection data in eframework-core/private/data, optionally jsonFile
 * use jsonFile when calling from another package, as we can't read the assets from here
 */

/* eslint no-loop-func: 0*/

let getDomain;

PackageFixture = class PackageFixture {
  /**
   * PackageFixture.loadData
   * @summary imports collection fixture data
   * @param {Object} collection - The collection to import
   * @param {String} jsonFile - path to json File.
   * @return {Boolean} boolean -  returns true on insert
   */
  loadData(collection, jsonFile) {
    check(collection, Mongo.Collection);
    check(jsonFile, Match.Optional(String));

    // prevent import if existing collection data
    if (collection.find().count() > 0) {
      return false;
    }

    let json = null;
    let result = null;

    EFrameworkCore.Log.debug(
      `Loading fixture data for ${collection._name}`);
    // if jsonFile was path wasn't provided
    // we'll assume we're loading collection data
    if (!jsonFile) {
      json = EJSON.parse(Assets.getText("private/data/" + collection._name + ".json"));
    } else {
      json = EJSON.parse(jsonFile);
    }

    // loop over each item in json and import insert into collection
    for (let item of json) {
      result = collection.insert(item);
    }

    if (result) {
      EFrameworkCore.Log.info(
        `Success importing fixture data to ${collection._name}`
      );
    } else {
      EFrameworkCore.Log.error("Error adding fixture data to " + collection._name, error.message);
    }
  }

  /**
   * PackageFixture.loadSettings
   * @description
   * This basically allows you to "hardcode" all the settings. You can change them
   * via admin etc for the session, but when the server restarts they'll
   * be restored back to the supplied json
   *
   * All settings are private unless added to `settings.public`
   *
   * Meteor account services can be added in `settings.services`
   * @summary updates package settings, accepts json string
   * @param {Object} json - json object to insert
   * @return {Boolean} boolean -  returns true on insert
   * @example
   *  Fixtures.loadSettings Assets.getText("settings/reaction.json")
   */
  loadSettings(json) {
    check(json, String);
    let exists;
    let service;
    let services;
    let settings;
    let validatedJson = EJSON.parse(json);
    // validate json and error out if not an array
    if (!_.isArray(validatedJson[0])) {
      EFrameworkCore.Log.warn(
        "Load Settings is not an array. Failed to load settings.");
      return;
    }
    // loop settings and upsert packages.
    for (let pkg of validatedJson) {
      for (let item of pkg) {
        exists = EFrameworkCore.Collections.Packages.findOne({
          name: item.name
        });
        // insert into the Packages collection
        if (exists) {
          result = EFrameworkCore.Collections.Packages.upsert({
            name: item.name
          }, {
            $set: {
              settings: item.settings,
              enabled: item.enabled
            }
          }, {
            multi: true,
            upsert: true,
            validate: false
          });
        }
        // sets the private settings of various
        // accounts authentication services
        if (item.settings.services) {
          for (services of item.settings.services) {
            for (service in services) {
              // this is just a sanity check required by linter
              if ({}.hasOwnProperty.call(services, service)) {
                // actual settings for the service
                settings = services[service];
                ServiceConfiguration.configurations.upsert({
                  service: service
                }, {
                  $set: settings
                });
                EFrameworkCore.Log.info("service configuration loaded: " +
                  item.name + " | " + service);
              }
            }
          }
        }
        EFrameworkCore.Log.info(`loaded local package data: ${item.name}`);
      }
    }
  }

  	/* TODO: descripcion funcion */
	/**
	* loadI18n fixtures
	* @summary importa datos translation fixture
	* @param {Object} translationCollection - Objecto collection opional
	* @returns {null} inserts collection
	*/
	loadI18n(translationCollection) {
		// Puntero del collections de Translations
		let collection = translationCollection || EFrameworkCore.Collections.Translations;
		let json;
		let shop;
		/*  Si no hay Translations disponibles, no tiene sentido seguir */
		if (collection.find().count() > 0) {
			return;
		}

		/*
			TODO: no entiendo por que es necesario que existe al menos un shop

			Las tiendas (shop) tienen languages disponibles.

		*/
		shop = EFrameworkCore.Collections.Shops.findOne();
		if (shop) {
			EFrameworkCore.Log.info( "Loading fixture data for " + `${collection._name}`);
			/*
				Si la tienda no tiene languajes disponibles, por default agrego Ingles.
			*/
			if (!(shop !== null ? shop.languages : void 0)) {
				shop.languages = [{
					i18n: "en"
				}];
			}
			EFrameworkCore.Log.info( "Loading " + shop.languages.length +" languages ");
			/*
				Recorro los languages disponibles del shop y los cargo
			*/
			for (let language of shop.languages) {
				json = EJSON.parse(Assets.getText("private/data/i18n/" + language.i18n + ".json"));
				for (let item of json) {
					collection.insert(item, function (error) {
						if (error) {
							EFrameworkCore.Log.warn("Error adding " + language.i18n + " to " + collection._name, item, error);
						}
					});
					EFrameworkCore.Log.info("Success adding " + language.i18n + " to " + collection._name);
				}
			}
		} else {
			EFrameworkCore.Log.error("No shop found. Failed to load languages.");
			return;
		}
	}
};

/*
 * instantiate fixtures
 */
this.Fixtures = new PackageFixture();

/**
 * getDomain
 * local helper for creating admin users
 * @param {String} requestUrl - url
 * @return {String} domain name stripped from requestUrl
 */
getDomain = function (requestUrl) {
  let url = requestUrl || process.env.ROOT_URL;
  let domain = url.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i)[1];
  return domain;
};


/* TODO: verificar funcion*/
/**
 * ReactionRegistry createDefaultAdminUser
 * @summary Metodo para crear un usuario administrador default
 */
ReactionRegistry.createDefaultAdminUser = function () {
	let accountId;
	let defaultAdminRoles;
	let packages;
	let shopId;
	let url;
	let domain = getDomain();
	let options = {};
	options.email = process.env.REACTION_EMAIL;
	options.username = process.env.REACTION_USER;
	options.password = process.env.REACTION_AUTH;
	defaultAdminRoles = ["owner", "admin"];
	shopId = EFrameworkCore.getShopId();
	if (Roles.getUsersInRole(defaultAdminRoles, shopId).count() !== 0) {
		return;
	}

	if (process.env.REACTION_EMAIL) {
		url = process.env.MONGO_URL;
		options.username = "Owner";
		if (!options.password) {
			options.password = url.substring(url.indexOf("/") + 2, url.indexOf("@")).split(":")[1];
		}
		EFrameworkCore.Log.warn("\nIMPORTANT! DEFAULT USER INFO (ENV)\n  EMAIL/LOGIN: " + options.email + "\n  PASSWORD: " + options.password + "\n");
	} else {
		/*
			Meteor.settings.REACTION_EMAIL
			Si se agrego un email en el archivo que se pasa a meteor a travez de --settings
		*/
		options.username = Meteor.settings.REACTION_USER || "Owner";
		options.password = Meteor.settings.REACTION_AUTH || Random.secret(8);
		options.email = Meteor.settings.REACTION_EMAIL || Random.id(8).toLowerCase() + "@" + domain;
		EFrameworkCore.Log.warn( "\nIMPORTANT! DEFAULT USER INFO (RANDOM)\n  EMAIL/LOGIN: " + options.email + "\n  PASSWORD: " + options.password + "\n");
	}
	accountId = Accounts.createUser(options);

	// account email should print on console
	// if server is not confgured. Error in configuration
	// are caught, but admin isn't verified.
	try {
		//TODO : Descomentar
		Accounts.sendVerificationEmail(accountId);
	} catch (error) {
		EFrameworkCore.Log.warn("Unable to send admin account verification email.", error);
	}

	// configure Launchdock auth
	if (process.env.LAUNCHDOCK_USERID) {
		Meteor.users.update({
			_id: accountId
		},
		{
			$set: {
				"services.launchdock.userId": process.env.LAUNCHDOCK_USERID,
				"services.launchdock.username": process.env.LAUNCHDOCK_USERNAME,
				"services.launchdock.auth": process.env.LAUNCHDOCK_AUTH,
				"services.launchdock.url": process.env.LAUNCHDOCK_URL
			}
		});
	}

	packages = EFrameworkCore.Collections.Packages.find().fetch();

	EFrameworkCore.Collections.Shops.update(shopId, {
		$addToSet: {
			emails: {
				address: options.email,
				verified: true
			},
			domains: Meteor.settings.ROOT_URL
		}
	});

	for (let pkg of packages) {
		for (let reg of pkg.registry) {
			if (reg.route) {
				defaultAdminRoles.push(reg.route);
			}
			if (reg.name) {
				defaultAdminRoles.push(reg.name);
			}
		}
		defaultAdminRoles.push(pkg.name);
	}

	Meteor.call("accounts/addUserPermissions", accountId, _.uniq(defaultAdminRoles), shopId);
	Meteor.call("accounts/addUserPermissions", accountId, ["owner", "admin", "dashboard"], Roles.GLOBAL_GROUP);
};


/* TODO: verificar funcion*/
/*
 * load core fixture data
 */

ReactionRegistry.loadFixtures = function () {
	let currentDomain;

	Fixtures.loadData(EFrameworkCore.Collections.Shops);
	Fixtures.loadData(EFrameworkCore.Collections.Products);
	Fixtures.loadData(EFrameworkCore.Collections.Tags);
	Fixtures.loadI18n(EFrameworkCore.Collections.Translations);

	//Siempre debe haber al menos un Shop
	try {
		currentDomain = EFrameworkCore.Collections.Shops.findOne().domains[0];
	} catch (error) {
		EFrameworkCore.Log.error("Failed to determine default shop.", _error);
	}

	// if the server domain changes, update shop
	if (currentDomain && currentDomain !== getDomain()) {
		EFrameworkCore.Log.info("Updating domain to " + getDomain());
		Shops.update({
		domains: currentDomain
			}, {
			$set: {
				"domains.$": getDomain()
			}
		});
	}
	//  insert packages into registry
	//  we check to see if the number of packages have changed against current data
	//  if there is a change, we'll either insert or upsert package registry
	//  into the Packages collection
	if (EFrameworkCore.Collections.Packages.find().count() !== EFrameworkCore.Collections.Shops.find().count() * Object.keys(ReactionRegistry.Packages).length) {
		// for each shop, we're loading packages registry
		_.each(ReactionRegistry.Packages, function (config, pkgName) {
			return EFrameworkCore.Collections.Shops.find().forEach(function (shop) {
				let shopId = shop._id;
				EFrameworkCore.Log.info("Initializing " + shop.name + " " + pkgName);
				_.each(config.layout, function( element ){
					EFrameworkCore.Log.info("template " +element.template);
					EFrameworkCore.Log.info("workflow " +element.workflow);
					EFrameworkCore.Log.info("container " +element.container);
				});
				// existing registry will be upserted with changes
				if (!shopId){
					return [];
				}

				let result = EFrameworkCore.Collections.Packages.upsert(
				{
					shopId: shopId,
					name: pkgName
				},
				{
					$setOnInsert: {
						shopId: shopId,
						icon: config.icon,
						enabled: !!config.autoEnable,
						settings: config.settings,
						registry: config.registry,
						layout: config.layout
					}
				});
				return result;
			});
		});
	}
	// remove registry entries for packages that have been removed
	EFrameworkCore.Collections.Shops.find().forEach(function (shop) {
		return EFrameworkCore.Collections.Packages.find().forEach(function (pkg) {
			if (!_.has(ReactionRegistry.Packages, pkg.name)) {
				EFrameworkCore.Log.info("Removing " + `${pkg.name}`, pkg);
				return EFrameworkCore.Collections.Packages.remove({
					shopId: shop._id,
					name: pkg.name
				});
			}
		});
	});
	// create default admin user
	ReactionRegistry.createDefaultAdminUser();
};
