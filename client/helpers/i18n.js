// /*
//  * Reaction i18n Translations, RTL and Currency Exchange Support
//  */

/**
 * getLabelsFor
 * get Labels for simple.schema keys
 * @param  {Object} schema - schema
 * @param  {String} name - name
 * @return {Object} return schema label object
 */
 /* TODO */
function getLabelsFor(schema, name) {
  let labels = {};
  // loop through all the rendered form fields and generate i18n keys
  for (let fieldName of schema._schemaKeys) {
    let i18nKey = name.charAt(0).toLowerCase() + name.slice(1) + "." +
      fieldName
      .split(".$").join("");
    // translate autoform label
    let translation = i18n.t(i18nKey);
    if (new RegExp("string").test(translation) !== true && translation !==
      i18nKey) {
      if (translation) labels[fieldName] = translation;
    }
  }
  return labels;
}

/**
 * getMessagesFor
 * get i18n messages for autoform messages
 * currently using a globalMessage namespace only*
 * (1) Use schema-specific message for specific key
 * (2) Use schema-specific message for generic key
 * (3) Use schema-specific message for type
 * @todo implement messaging hierarchy from simple-schema
 * @return {Object} returns i18n translated message for schema labels
 */
 /* TODO */
function getMessagesFor() {
  let messages = {};
  for (let message in SimpleSchema._globalMessages) {
    if ({}.hasOwnProperty.call(SimpleSchema._globalMessages, message)) {
      let i18nKey = `globalMessages.${message}`;
      let translation = i18n.t(i18nKey);
      if (new RegExp("string").test(translation) !== true && translation !==
        i18nKey) {
        messages[message] = translation;
      }
    }
  }
  return messages;
}

/**
 *  set language and autorun on change of language
 *  initialize i18n and load data resources for the current language and fallback 'EN'
 *
 */
/* TODO */
this.i18nextDep = new Tracker.Dependency();
/* TODO */
  this.localeDep = new Tracker.Dependency();
/* TODO */
Meteor.startup(function () {
	/* TODO */
  // i18nNext detectLanguage
   Session.set("language", i18n.detectLanguage());
  // // use i18n detected language to getLocale info
  // Meteor.call("shop/getLocale", function (error, result) {
  //   if (result) {
  //     EFrameworkCore.Locale = result;
  //     EFrameworkCore.Locale.language = Session.get("language");
  //     moment.locale(EFrameworkCore.Locale.language);
  //     localeDep.changed();
  //   }
  // });

	/* TODO */
 	 // use tracker autorun to detect language changes
	Tracker.autorun(function () {
		EFrameworkCore.Locale.language = Session.get("language");
		return Meteor.subscribe("Translations", EFrameworkCore.Locale.language,
		function () {
			// fetch reaction translations
			let reactionTranslations = EFrameworkCore.Collections.Translations.find(
				{},
				{
					fields: {
						_id: 0
					},
					reactive: false
				}
			).fetch();
			// map reduce translations into i18next formatting
			let resources = reactionTranslations.reduce(
				function (x, y) {
					x[y.i18n] = y.translation;
					return x;
				},
				{}
			);
			// initialize i18next
			return $.i18n.init(
				{
					lng: EFrameworkCore.Locale.language,
					fallbackLng: "en",
					ns: "core",
					resStore: resources
				},
				function () {
					for (let schema in EFrameworkCore.Schemas) {
						if ({}.hasOwnProperty.call(EFrameworkCore.Schemas, schema)) {
							let ss = EFrameworkCore.Schemas[schema];
							ss.labels(getLabelsFor(ss, schema));
							ss.messages(getMessagesFor(ss, schema));
						}
					}
					// trigger dependency change
					i18nextDep.changed();
					// apply language direction to html
					if ($.t("languageDirection") === "rtl") {
						return $("html").addClass("rtl");
					}
					return $("html").removeClass("rtl");
				}
			);
		});
  	});

  // global onRendered event finds and replaces
  // data-i18n attributes in html/template source.
  /* TODO */
  Template.onRendered(function () {
    this.autorun((function (_this) {
      return function () {
        let $elements;
        i18nextDep.depend();
        $elements = _this.$("[data-i18n]");
        if (typeof $elements.i18n === "function") {
          $elements.i18n();
        }
      };
    })(this));
  });
  return Template.onDestroyed(function () {
    i18nextDep.changed();
  });
});

/* TODO funcion */
/**
 * i18n
 * see: http://i18next.com/
 * pass the translation key as the first argument
 * and the default message as the second argument
 * @param {String} i18nKey - i18nKey
 * @param {String} i18nMessage - message text
 * @example {{i18n "accountsTemplate.error" "Invalid Email"}}
 * @return {String} returns i18n translated message
 */
Template.registerHelper("i18n", function (i18nKey, i18nMessage) {
	if (!i18nKey || typeof i18nMessage !== "string") {
		EFrameworkCore.Log.info("i18n key string required to translate", i18nKey, i18nMessage);
		return "";
	}
	check(i18nKey, String);
	check(i18nMessage, String);

	i18nextDep.depend();

	let message = new Handlebars.SafeString(i18nMessage);

	if (i18n.t(i18nKey) === i18nKey) {
		EFrameworkCore.Log.debug(`i18n: no translation found. returning raw message for: ${i18nKey}`);
		return message.string;
	}
	return i18n.t(i18nKey);
});

// /**
//  * currencySymbol
//  * @summary return shop /locale specific currency format (ie: $)
//  * @returns {String} return current locale currency symbol
//  */
// Template.registerHelper("currencySymbol", function () {
//   return EFrameworkCore.Locale.currency.symbol;
// });

/**
 * formatPrice
 * @summary return shop /locale specific formatted price
 * También acepta rango de valores con : " - "
 * @param {String} currentPrice - precio actual ó formato String "xx.xx - xx.xx"
 * @return {String} returns locale formatted and exchange rate converted values
 */
 /* TODO */
Template.registerHelper("formatPrice", function (currentPrice) {
	let actualPrice;
	let formattedPrice;
	let price;

	//En caso de que currentPrice sea un número
	currentPrice = currentPrice + "";

	localeDep.depend();

	// TODO: Refactor
	try {
		let prices = currentPrice.split(" - ");
		for (actualPrice of prices) {
			let originalPrice = actualPrice;
			if (EFrameworkCore.Locale) {
				if (EFrameworkCore.Locale.currency) {
					if (EFrameworkCore.Locale.exchangeRate) {
						if (EFrameworkCore.Locale.exchangeRate.rate) {
							actualPrice = actualPrice * EFrameworkCore.Locale.exchangeRate.rate;
						}
					}
				}
				formattedPrice = accounting.formatMoney(actualPrice, EFrameworkCore.Locale
				.currency);
				price = currentPrice.replace(originalPrice, formattedPrice);
			}
		}
	} catch (error) {
		EFrameworkCore.Log.debug("currency error, fallback to shop currency");
		if (EFrameworkCore.Locale) {
		if (EFrameworkCore.Locale.currency) {
		if (EFrameworkCore.Locale.exchangeRate) {
		if (EFrameworkCore.Locale.exchangeRate.rate) {
		price = price * EFrameworkCore.Locale.exchangeRate.Rate;
		price = accounting.formatMoney(price, EFrameworkCore.Locale.currency);
		}
		} else {
		price = accounting.formatMoney(currentPrice, EFrameworkCore.Locale.currency);
		}
		}
		}
	}
	return price;
});
