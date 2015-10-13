// exported, global/window scope
EFrameworkCore = {};
EFrameworkCore.Schemas = {};
EFrameworkCore.Collections = {};
EFrameworkCore.Helpers = {};
EFrameworkCore.MetaData = {};
EFrameworkCore.Locale = {};
EFrameworkCore.Log = {};

if (Meteor.isClient) {
  EFrameworkCore.Alerts = {};
  EFrameworkCore.Subscriptions = {};
}

// convenience
Alerts = EFrameworkCore.Alerts;
Schemas = EFrameworkCore.Schemas;

// not exported to client (private)
ReactionRegistry = {};
ReactionRegistry.Packages = {};
