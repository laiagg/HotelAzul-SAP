/*global QUnit*/

sap.ui.define([
	"fiori/controller/PaginaPrincipal.controller"
], function (Controller) {
	"use strict";

	QUnit.module("PaginaPrincipal Controller");

	QUnit.test("I should test the PaginaPrincipal controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
