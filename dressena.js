import { dressenaActor } from "./module/actor.js";
import { dressenaItem } from "./module/item.js";
import { dressena } from "./module/config.js";
import dressenaItemSheet from "./module/sheets/dressenaItemSheet.js";
import dressenaCharacterSheet from "./module/sheets/dressenaCharacterSheet.js";

async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "systems/dressena/templates/partials/character-abilities-block.hbs",
        "systems/dressena/templates/partials/weapon-card.hbs"
    ];
    return loadTemplates(templatePaths);
};


Hooks.once("init", function() {
    console.log ("dressena | Initializing Dressena System");
    game.boilerplate = {
        dressenaActor,
        dressenaItem,
      };
    
    CONFIG.dressena = dressena;
    CONFIG.Actor.documentClass = dressenaActor;
    CONFIG.Item.documentClass = dressenaItem;
  
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("dressena", dressenaItemSheet, { makeDefault: true});

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("dressena", dressenaCharacterSheet, { makeDefault: true});

    preloadHandlebarsTemplates();

});

Handlebars.registerHelper('toLowerCase', function (str) {
    return str.toLowerCase();
  });
  