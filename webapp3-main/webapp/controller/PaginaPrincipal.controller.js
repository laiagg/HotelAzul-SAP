sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("fiori.controller.PaginaPrincipal", {
        onInit: function () {
            console.log("Página Principal inicializada correctamente.");
        },

        onButton1Press: function () {
            console.log("Botón 1 presionado en Página Principal.");
        },

        onButton2Press: function () {
            console.log("Botón 2 presionado en Página Principal.");
        }
    });
});
