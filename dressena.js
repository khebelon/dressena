import { dressena } from "./module/config.js";
import dressenaItemSheet from "./module/sheets/dressenaItemSheet.js";
import dressenaCharacterSheet from "./module/sheets/dressenaCharacterSheet.js";

async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "systems/dressena/templates/partials/character-abilities-block.hbs"
    ];
    return loadTemplates(templatePaths);
};


Hooks.once("init", function() {
    console.log ("dressena | Initializing Dressena System");

    CONFIG.dressena = dressena;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("dressena", dressenaItemSheet, { makeDefault: true});

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("dressena", dressenaCharacterSheet, { makeDefault: true});

    preloadHandlebarsTemplates();

});