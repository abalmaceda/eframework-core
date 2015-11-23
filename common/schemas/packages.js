
/* TODO : por que va en este archio. NO seria mejor dejarlo fuera ?? */
/**
* Permissions Schema
*/

// EFrameworkCore.Schemas.Permissions = new SimpleSchema({
//   permission: {
//     type: String
//   },
//   label: {
//     type: String
//   }
// });

/**
 * workflow schema for attaching to collection where
 * PackageWorkflow is controlling view flow
 * Shop defaultWorkflow is defined in Shop
 */

EFrameworkCore.Schemas.Workflow = new SimpleSchema({
  status: {
    type: String,
    defaultValue: "new"
  },
  workflow: {
    type: [String],
    optional: true
  }
});


/* TODO: Schema */
/**
* PackageConfig Schema
*/

EFrameworkCore.Schemas.PackageConfig = new SimpleSchema({
  "shopId": {
    type: String,
    index: 1,
    autoValue: EFrameworkCore.shopIdAutoValue,
    label: "PackageConfig ShopId",
    optional: true
  },
  "name": {
    type: String,
    index: 1
  },
  "enabled": {
    type: Boolean,
    defaultValue: true
  },
  "icon": {
    type: String,
    optional: true
  },
  "settings": {
    type: Object,
    optional: true,
    blackbox: true
  },
  "layout": {
    type: [EFrameworkCore.Schemas.Layout],
    optional: true
  },
  "registry": {
    type: [Object],
    optional: true
  },
  "registry.$.provides": {
    type: String
  },
  "registry.$.route": {
    type: String,
    optional: true
  },
  "registry.$.template": {
    type: String,
    optional: true
  },
  "registry.$.description": {
    type: String,
    optional: true
  },
  "registry.$.icon": {
    type: String,
    optional: true
  },
  "registry.$.label": {
    type: String,
    optional: true
  },
  "registry.$.container": {
    type: String,
    optional: true
  },
  "registry.$.cycle": {
    type: Number,
    optional: true
  },
  "registry.$.enabled": {
    type: Boolean,
    optional: true
  },
  "registry.$.permissions": {
    type: [EFrameworkCore.Schemas.Permissions],
    optional: true
  }
});


/* TODO: Schema */
/**
* CorePackageConfig Schema
* Core Reaction Settings
*/

// EFrameworkCore.Schemas.CorePackageConfig = new SimpleSchema([
//   EFrameworkCore.Schemas.PackageConfig, {
//     "settings.mail": {
//       type: Object,
//       optional: true,
//       label: "Mail Settings"
//     },
//     "settings.mail.user": {
//       type: String,
//       label: "Username"
//     },
//     "settings.mail.password": {
//       type: String,
//       label: "Password"
//     },
//     "settings.mail.host": {
//       type: String,
//       label: "Host"
//     },
//     "settings.mail.port": {
//       type: String,
//       label: "Port"
//     },
//     "settings.openexchangerates.appId": {
//       type: String,
//       label: "Open Exchange Rates App Id"
//     },
//     "settings.google.clientId": {
//       type: String,
//       label: "Google Client Id",
//       defaultValue: null
//     },
//     "settings.google.apiKey": {
//       type: String,
//       label: "Google Api Key",
//       defaultValue: null
//     },
//     "settings.public": {
//       type: Object,
//       optional: true
//     },
//     "settings.public.allowGuestCheckout": {
//       type: Boolean,
//       label: "Allow Guest Checkout"
//     }
//   }
// ]);
