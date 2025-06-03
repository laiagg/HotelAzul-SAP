sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History"
], function (Controller, JSONModel, History) {
    "use strict";

    return Controller.extend("fiori.controller.PaginaSecundaria", {
        onInit: function () {
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RoutePaginaSecundaria").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            const sMarca = oEvent.getParameter("arguments").marca;

            console.log("Marca recibida:", sMarca);

            // Base de datos inicial con marcas
            const oData = {
                marcas: [
                    {
                        marca: "Acer",
                        details: "Acer es conocida por producir laptops y monitores de alta calidad.",
                        url: "https://www.acer.com",
                        image: "imagenes/acer.png",
                        additionalText: "Liderando el mercado de laptops para gamers.",
                        production: 70,
                        DescriptionText: "Acer se especializa en electrónica de consumo, destacando en laptops y monitores, y apuesta por la sostenibilidad con iniciativas ecológicas como su línea Vero.",
                        anyo: 1976,
                        fechasDestacadas: [
                            { fecha: "27-04-2025", evento: "Lanzamiento de nueva laptop" },
                            { fecha: "22-04-2025", evento: "Evento especial de gaming" }
                        ]
                    },
                    {
                        marca: "DELL",
                        details: "DELL es conocida por producir laptops y monitores de alta calidad.",
                        url: "https://www.dell.com",
                        image: "imagenes/dell.png",
                        additionalText: "Un nombre confiable en el sector corporativo.",
                        production: 85,
                        DescriptionText: "Dell Technologies es un líder global en soluciones informáticas, ofreciendo productos como PCs, servidores y sistemas de almacenamiento con énfasis en innovación y soluciones empresariales.",
                        anyo: 1984,
                        fechasDestacadas: [
                            { fecha: "25-04-2025", evento: "Lanzamiento de monitor 4K" },
                            { fecha: "28-04-2025", evento: "Actualización de servidores" }
                        ]
                    },
                    {
                        marca: "Apple",
                        details: "Apple es conocida por su tecnología innovadora y diseño elegante.",
                        url: "https://www.apple.com",
                        image: "imagenes/apple.png",
                        additionalText: "Innovación en cada producto.",
                        production: 90,
                        DescriptionText: "Apple lidera el mercado de tecnología con dispositivos como iPhone y MacBook, priorizando la experiencia del usuario y la calidad.",
                        anyo: 1976,
                        fechasDestacadas: [
                            { fecha: "22-04-2025", evento: "Lanzamiento del nuevo iPhone" },
                            { fecha: "26-04-2025", evento: "Evento especial de desarrolladores" }
                        ]
                    },
                    {
                        marca: "Asus",
                        details: "Asus destaca en la fabricación de laptops, componentes y móviles con excelente calidad.",
                        url: "https://www.asus.com",
                        image: "imagenes/asus.png",
                        additionalText: "Excelencia en tecnología.",
                        production: 75,
                        DescriptionText: "Asus sobresale en el desarrollo de tecnología avanzada, con un enfoque en laptops, móviles y componentes de alta gama.",
                        anyo: 1989,
                        fechasDestacadas: [
                            { fecha: "23-04-2025", evento: "Anuncio de nuevos componentes" },
                            { fecha: "25-04-2025", evento: "Evento internacional" }
                        ]
                    }
                ]
            };

            const aFilteredMarcas = oData.marcas.filter(marca => marca.marca === sMarca);

            if (aFilteredMarcas.length > 0) {
                const oFilteredModel = new sap.ui.model.json.JSONModel({ marcas: aFilteredMarcas });
                this.getView().setModel(oFilteredModel, "filteredModel");

                console.log("Modelo filtrado y asignado:", aFilteredMarcas);
                console.log("Fechas destacadas:", aFilteredMarcas[0]?.fechasDestacadas || []);
                this.highlightDates(); //llama para que se muestren
            } else {
                console.warn("No se encontraron datos para la marca seleccionada:", sMarca);
            }
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
        highlightDates: function () {
            const oCalendar = this.byId("dynamicCalendar");
            const oFilteredModel = this.getView().getModel("filteredModel");
            const aMarcas = oFilteredModel.getProperty("/marcas");
        
            if (this._boundOnPressDate) {
                oCalendar.detachEvent("select", this._boundOnPressDate);
            }
        
            this._boundOnPressDate = this.onPressDate.bind(this); //para evitar duplicaciones
            oCalendar.attachEvent("select", this._boundOnPressDate);
        
            oCalendar.destroySpecialDates();
        
            if (aMarcas.length > 0 && aMarcas[0].fechasDestacadas) {
                const aFechas = aMarcas[0].fechasDestacadas;
        
                aFechas.forEach(({ fecha, evento }) => {
                    const [day, month, year] = fecha.split("-");
                    const oDate = new Date(year, month - 1, day);
        
                    //validar fecha, para input manual
                    if (isNaN(oDate.getTime())) {
                        console.error("Fecha inválida:", fecha);
                        return;
                    }
        
                    oCalendar.addSpecialDate(new sap.ui.unified.DateTypeRange({
                        startDate: oDate,
                        type: "Type01", // Tipo de estilo
                        tooltip: evento
                    }));
                });
            } else {
                console.warn("No hay fechas destacadas disponibles para esta marca.");
            }
        },
        
        onPressDate: function (oEvent) {
            const oCalendar = oEvent.getSource();
            const aSelectedDates = oCalendar.getSelectedDates();
            const oFilteredModel = this.getView().getModel("filteredModel");
            const aMarcas = oFilteredModel.getProperty("/marcas");
        
            if (aSelectedDates.length > 0) {
                const oDateRange = aSelectedDates[0];
                const oDate = oDateRange.getStartDate();
        
                if (!oDate) {
                    console.warn("No se pudo recuperar la fecha seleccionada.");
                    return;
                }
        
                const day = String(oDate.getDate()).padStart(2, '0');
                const month = String(oDate.getMonth() + 1).padStart(2, '0'); 
                const year = oDate.getFullYear();
                const selectedDate = `${day}-${month}-${year}`;
        
                const aFechasDestacadas = aMarcas[0]?.fechasDestacadas || [];
                const oEvento = aFechasDestacadas.find(item => item.fecha === selectedDate);
        
                if (oEvento) {
                    const oDialog = new sap.m.Dialog({
                        title: "Detalle del Evento",
                        content: new sap.m.Text({ text: oEvento.evento }),
                        beginButton: new sap.m.Button({
                            text: "Cerrar",
                            press: function () {
                                oDialog.close();
                            }
                        }),
                        afterClose: function () {
                            oDialog.destroy();
                        }
                    });
        
                    oDialog.open();
                } else {
                    console.warn("No se encontró un evento para la fecha seleccionada.");
                }
            } else {
                console.warn("No se seleccionó ninguna fecha.");
            }
        },
        
        
        onAddDatePress: function () {
            if (!this._oDialog) {
                this._oDialog = new sap.m.Dialog({
                    title: "Añadir Fecha Importante",
                    content: [
                        new sap.m.DatePicker(this.createId("datePicker"), {
                            displayFormat: "dd-MM-yyyy",
                            valueFormat: "dd-MM-yyyy",
                            value: "" 
                        }),
                        new sap.m.Input(this.createId("descriptionInput"), {
                            placeholder: "Descripción del evento",
                            value: "" 
                        })
                    ],
                    buttons: [
                        new sap.m.Button({
                            text: "Guardar",
                            press: this.onSaveDate.bind(this)
                        }),
                        new sap.m.Button({
                            text: "Cancelar",
                            press: function () {
                                this._oDialog.close();
                            }.bind(this)
                        })
                    ]
                });
        
                this.getView().addDependent(this._oDialog);
            }
            const oDatePicker = this.byId("datePicker");
            const oDescriptionInput = this.byId("descriptionInput");
            if (oDatePicker) { //borrar datos anteiores
                oDatePicker.setValue(""); 
            }
            if (oDescriptionInput) {
                oDescriptionInput.setValue(""); 
            }
        
            this._oDialog.open();
        },
        onSaveDate: function () {
            const sFecha = this.byId("datePicker").getValue();
            const [day, month, year] = sFecha.split("-");
            const sFechaDDMMYYYY = `${day}-${month}-${year}`; // formato dd-mm-aaaa
            const sDescripcion = this.byId("descriptionInput").getValue();
        
            if (!sFechaDDMMYYYY || !sDescripcion) {
                sap.m.MessageToast.show("Por favor, ingresa una fecha y descripción válidas.");
                return;
            }
        
            const oModel = this.getView().getModel("filteredModel");
            const aMarcas = oModel.getProperty("/marcas");
            aMarcas[0].fechasDestacadas.push({ fecha: sFechaDDMMYYYY, evento: sDescripcion });
        
            oModel.setProperty("/marcas", aMarcas);
        
            sap.m.MessageToast.show("Fecha añadida correctamente.");
            this.highlightDates(); //actualizar el calendario
            this._oDialog.close();
        },
        
        
        onEditDatePress: function () {
            const oModel = this.getView().getModel("filteredModel");
            const aSpecialDates = oModel.getProperty("/marcas/0/fechasDestacadas");
        
            if (!aSpecialDates || aSpecialDates.length === 0) {
                sap.m.MessageToast.show("No hay eventos para editar.");
                return;
            }
        
            if (!this._oEditDialog) {
                this._oEditDialog = new sap.m.Dialog({
                    title: "Editar Fecha",
                    content: [
                        new sap.m.Select(this.createId("selectEvent"), {
                            change: function (oEvent) {
                                const sKey = oEvent.getParameter("selectedItem").getKey();
                                const oSelectedDate = aSpecialDates[sKey];
        
                                this.byId("editDatePicker").setValue(""); 
                                this.byId("editDescriptionInput").setValue("");
        
                                if (oSelectedDate) {
                                    const sTooltip = oSelectedDate.evento;
                                    const oStartDate = new Date(oSelectedDate.fecha.split("-").reverse().join("-"));
                                    const sFormattedDate = oStartDate
                                        ? `${String(oStartDate.getDate()).padStart(2, '0')}-${String(oStartDate.getMonth() + 1).padStart(2, '0')}-${oStartDate.getFullYear()}`
                                        : "";
        
                                    this.byId("editDatePicker").setValue(sFormattedDate);
                                    this.byId("editDescriptionInput").setValue(sTooltip || "");
                                }
                            }.bind(this),
                        }),
                        new sap.m.DatePicker(this.createId("editDatePicker"), {
                            displayFormat: "dd-MM-yyyy",
                            valueFormat: "dd-MM-yyyy"
                        }),
                        new sap.m.Input(this.createId("editDescriptionInput"), {
                            placeholder: "Descripción actualizada"
                        })
                    ],
                    buttons: [
                        new sap.m.Button({
                            text: "Guardar",
                            press: function () {
                                const oSelectEvent = this.byId("selectEvent");
                                const oDatePicker = this.byId("editDatePicker");
                                const oDescriptionInput = this.byId("editDescriptionInput");
        
                                const sSelectedKey = oSelectEvent.getSelectedKey();
                                const oSelectedDate = aSpecialDates[sSelectedKey];
        
                                if (oSelectedDate) {
                                    const sNewDate = oDatePicker.getValue();
                                    const sNewTooltip = oDescriptionInput.getValue();
        
                                    const [day, month, year] = sNewDate.split("-");
                                    const oNewStartDate = new Date(year, month - 1, day);
        
                                    if (!isNaN(oNewStartDate.getTime())) {
                                        oSelectedDate.fecha = sNewDate;
                                        oSelectedDate.evento = sNewTooltip;
                                    }
        
                                    oModel.setProperty("/marcas/0/fechasDestacadas", aSpecialDates);
                                    sap.m.MessageToast.show("Evento actualizado correctamente.");
                                }
        
                                this.highlightDates();
                                this._oEditDialog.close();
                            }.bind(this)
                        }),
                        new sap.m.Button({
                            text: "Cancelar",
                            press: function () {
                                this._oEditDialog.close();
                            }.bind(this)
                        })
                    ]
                });
        
                this.getView().addDependent(this._oEditDialog);
            }
        
            //limpiar datos
            const oSelectEvent = this.byId("selectEvent");
            const oDatePicker = this.byId("editDatePicker");
            const oDescriptionInput = this.byId("editDescriptionInput");
        
            if (oSelectEvent) {
                oSelectEvent.setSelectedKey(null); 
                oSelectEvent.destroyItems(); 
                oSelectEvent.addItem(new sap.ui.core.Item({
                    key: "",
                    text: "Seleccionar evento"
                }));
                aSpecialDates.forEach((dateRange, index) => {
                    oSelectEvent.addItem(new sap.ui.core.Item({
                        key: index,
                        text: `${dateRange.fecha} - ${dateRange.evento || "Sin descripción"}`
                    }));
                });
            }
        
            if (oDatePicker) {
                oDatePicker.setValue(""); 
            }
            if (oDescriptionInput) {
                oDescriptionInput.setValue(""); 
            }
        
            this._oEditDialog.open();
        },
        
        onSaveEditDate: function () {
            const iSelectedIndex = this.byId("selectEvent").getSelectedKey();
            const sFechaNueva = this.byId("editDatePicker").getValue();
            const [day, month, year] = sFechaNueva.split("-");
            const sFechaDDMMYYYY = `${day}-${month}-${year}`; //formato dd-mm-aaaa
            const sDescripcionNueva = this.byId("editDescriptionInput").getValue();
        
            if (!sFechaDDMMYYYY || !sDescripcionNueva) {
                sap.m.MessageToast.show("Por favor, ingresa una fecha y descripción válidas.");
                return;
            }
        
            const oModel = this.getView().getModel("filteredModel");
            const aMarcas = oModel.getProperty("/marcas");
            const aFechas = aMarcas[0].fechasDestacadas;
        
            if (iSelectedIndex !== undefined && aFechas[iSelectedIndex]) {
                aFechas[iSelectedIndex].fecha = sFechaDDMMYYYY;
                aFechas[iSelectedIndex].evento = sDescripcionNueva;
        
                oModel.setProperty("/marcas/0/fechasDestacadas", aFechas);
                sap.m.MessageToast.show("Evento actualizado correctamente.");
            } else {
                sap.m.MessageToast.show("No se encontró el evento para editar.");
            }
        
            this.highlightDates(); 
            this._oEditDialog.close();
        },
        onDeleteDatePress: function () {
            const oCalendar = this.byId("dynamicCalendar"); 
            const aSelectedDates = oCalendar.getSelectedDates(); 
            const oFilteredModel = this.getView().getModel("filteredModel"); 
            const aMarcas = oFilteredModel.getProperty("/marcas"); 
            
            if (aSelectedDates.length === 0) {
                sap.m.MessageToast.show("Por favor, selecciona una fecha en el calendario para eliminar el evento.");
                return;
            }
        
            // Recupera la última fecha seleccionada
            const oDateRange = aSelectedDates[aSelectedDates.length - 1];
            const oSelectedDate = oDateRange.getStartDate();
        
            if (!oSelectedDate) {
                sap.m.MessageToast.show("No se pudo recuperar el evento seleccionado.");
                return;
            }
        
            // Convierte la fecha al formato dd-MM-yyyy
            const day = String(oSelectedDate.getDate()).padStart(2, '0');
            const month = String(oSelectedDate.getMonth() + 1).padStart(2, '0');
            const year = oSelectedDate.getFullYear();
            const selectedDate = `${day}-${month}-${year}`;
        
            const aFechasDestacadas = aMarcas[0]?.fechasDestacadas || [];
            const iFechaIndex = aFechasDestacadas.findIndex(item => item.fecha === selectedDate);
        
            if (iFechaIndex === -1) {
                sap.m.MessageToast.show("La fecha seleccionada no está entre los eventos destacados.");
                return;
            }
        
            const oEvento = aFechasDestacadas[iFechaIndex];
        
            //Diálogo de confirmación
            const oDeleteDialog = new sap.m.Dialog({
                title: "Confirmar eliminación",
                type: sap.m.DialogType.Message,
                content: new sap.m.VBox({
                    items: [
                        new sap.m.Text({
                            text: `Fecha seleccionada: ${selectedDate}`
                        }),
                        new sap.m.Text({
                            text: `Evento: ${oEvento.evento}`
                        })
                    ]
                }),
                buttons: [
                    new sap.m.Button({
                        text: "Sí",
                        press: function () {
                            aFechasDestacadas.splice(iFechaIndex, 1); 
                            oFilteredModel.setProperty("/marcas", aMarcas); // Actualiza el modelo
        
                            const aSpecialDates = oCalendar.getSpecialDates(); // Obtén todas las fechas especiales
                            aSpecialDates.forEach(function (oSpecialDate) {
                                const oStartDate = oSpecialDate.getStartDate();
                                if (oStartDate && oStartDate.toDateString() === oSelectedDate.toDateString()) {
                                    oCalendar.removeSpecialDate(oSpecialDate); // Elimina el highlight
                                }
                            });
                            
                            sap.m.MessageToast.show("Evento eliminado correctamente.");
                            oDeleteDialog.close();
                        }
                    }),
                    new sap.m.Button({
                        text: "No",
                        press: function () {
                            oDeleteDialog.close();
                        }
                    })
                ]
            });
        
            this.getView().addDependent(oDeleteDialog);
        
            oDeleteDialog.open();
        }
        
    });     
});