import { dressena } from ".module/config.js"
import dressenaItemSheet from "./module/sheets/dressenaItemSheet.js";

Hooks.once("init", function() {
    console.log ("dressena | Initializing Dressena System");

    CONFIG.dressena = dressena;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("dressena", dressenaItemSheet, { makeDefault: true});


});