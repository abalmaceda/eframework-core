/**
 * i18nChooser helpers
 */
/* TODO */
Template.i18nChooser.helpers({
	/* TODO */
	languages: function () {
		let languages = [];
		let shop = EFrameworkCore.Collections.Shops.findOne();
		if (shop !== null ? shop.languages : void 0) {
			for (let language of shop.languages) {
				if (language.enabled === true) {
					language.translation = "languages." + language.label.toLowercase;
					languages.push(language);
				}
			}
			return languages;
		}
	},
  /* TODO */
  active: function () {
    if (Session.equals("language", this.i18n)) {
      return "active";
    }
  }
});

/**
 * i18nChooser events
 */

/* TODO */
Template.i18nChooser.events({
  "click .i18n-language": function (event) {
    event.preventDefault();
    return Session.set("language", this.i18n);
  }
});
