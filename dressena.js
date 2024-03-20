import { dressenaActor } from "./module/actor.js";
import { dressenaItem } from "./module/item.js";
import { dressena } from "./module/config.js";
import { dressenaCombat} from "./module/combat.js";

import dressenaItemSheet from "./module/sheets/dressenaItemSheet.js";
import dressenaCharacterSheet from "./module/sheets/dressenaCharacterSheet.js";
import { resetCurrentEndurance } from "./module/helpers/utils.js";
import { checkConditions } from "./module/helpers/conditions.js";

//import dressenaChatMessage from "./module/chat-message.js";

async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "systems/dressena/templates/partials/character-abilities-block.hbs",
        "systems/dressena/templates/partials/weapon-card.hbs",
        "systems/dressena/templates/partials/item-effects.hbs",
        "systems/dressena/templates/partials/character-sheet-sidebar.hbs"
    ];
    return loadTemplates(templatePaths);
};


Hooks.once("init", function() {
    console.log ("dressena | Initializing Dressena System");
    game.dressena = {
        dressenaActor,
        dressenaItem,
        dressenaCombat,
        
//        dressenaChatMessage
      };
    
    CONFIG.dressena = dressena;
    CONFIG.Actor.documentClass = dressenaActor;
    CONFIG.Item.documentClass = dressenaItem;
    CONFIG.ActiveEffect.legacyTransferral = false;
    CONFIG.Combat.documentClass = dressenaCombat;



//    CONFIG.ChatMessage.documentClass = dressenaChatMessage;

  
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("dressena", dressenaItemSheet, { makeDefault: true});

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("dressena", dressenaCharacterSheet, { makeDefault: true});

    preloadHandlebarsTemplates();

});




Handlebars.registerHelper('toLowerCase', function (str) {
    return str.toLowerCase();
  });

