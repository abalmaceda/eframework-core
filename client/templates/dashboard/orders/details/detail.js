/**
 * orderDetail helpers
 *
 * order state tracking, user profile helpers
 *
 * @returns user profile details on orders
 */

 /**
 * Template.orderDetail.helpers
 * @summary Helpers para Template.orderDetail
 */
Template.orderDetail.helpers({
	/**
	 * userProfile
	 * @summary
	 * @returns {}
	 * @todo Documentar
	 */
	userProfile: function () {
		let profileId;
		let userProfile;
		profileId = this.userId;
		if (profileId !== null) {
			userProfile = Meteor.subscribe("UserProfile", profileId);
			if (userProfile.ready()) {
				return Meteor.users.findOne(profileId);
			}
		}
	},

	/**
	 * orderAge
	 * @summary
	 * @returns {}
	 * @todo Documentar
	 */
	orderAge: function () {
		return moment(this.createdAt).fromNow();
	},

	/**
	 * shipmentTracking
	 * @summary
	 * @returns {}
	 * @todo Documentar
	 */
	shipmentTracking: function () {
		return this.shipping.shipmentMethod.tracking;
	}
});
