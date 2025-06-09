sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/routing/History"  
], function (Controller, MessageToast, History) {
    "use strict";

    return Controller.extend("fiori.controller.MiCuenta", {
        onInit: function () {
            console.log("Vista Mi Cuenta inicializada.");
        },

        onGuardarPress: function () {
            MessageToast.show("Datos guardados (simulado)");
        },
        onNavBack: function () {
            console.log("Botón de navegación presionado");
            const oHistory = History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                console.log("Regresando a la página anterior");
                window.history.go(-1);
            } else {
                console.log("Redirigiendo a la Página Principal");
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RoutePaginaPrincipal", {}, true);
            }
        },
    });
});
