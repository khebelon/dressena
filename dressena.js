import dressenaItemSheet from "./module/sheets/dressenaItemSheets.js";

Hooks.once("init", function() {
    console.log ("dressena | Initializing Dressena System");
    Items.unregistersheet("core", ItemSheet);
    Items.registersheet("dressena", dressenaItemSheet, { makeDefault: true});


});