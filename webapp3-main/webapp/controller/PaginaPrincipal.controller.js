sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("fiori.controller.PaginaPrincipal", {
        onInit: function () {
            console.log("Página Principal inicializada correctamente.");
        },

        onButtonCuentaPress: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteMiCuenta");
        }

        
        
    });
});
