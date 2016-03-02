 /**
  * @function Meteor.publish."Media"
  * @summary CollectionFS - Image/Video Publication
  * @params {Array} shops - array of current shop object
  * @returns {Collection.Cursor} Collection.Media
  * @todo Documentar
  */
Meteor.publish("Media", function (shops) {
	check(shops, Match.Optional(Array));
	let Media = EFrameworkCore.Collections.Media;
	let selector;
	let shopId = EFrameworkCore.getShopId(this);

	if (shopId) {
		selector = {
			"metadata.shopId": shopId
		};
	}
	if (shops) {
		selector = {
			"metadata.shopId": {
				$in: shops
			}
		};
	}
	return Media.find(selector, {
		sort: {
			"metadata.priority": 1
		}
	});
});
