sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"fiori/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("fiori.Component", {

		metadata: {
			manifest: "json"
		},

		init: function () {
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();

		}
	});
});
