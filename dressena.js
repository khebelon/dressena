import { dressenaActor } from "./module/actor.js";
import { dressenaItem } from "./module/item.js";
import { dressena } from "./module/config.js";
//import dressenaCombat from ".module/combat.js";
import dressenaItemSheet from "./module/sheets/dressenaItemSheet.js";
import dressenaCharacterSheet from "./module/sheets/dressenaCharacterSheet.js";
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
//        dressenaChatMessage
      };
    
    CONFIG.dressena = dressena;
    CONFIG.Actor.documentClass = dressenaActor;
    CONFIG.Item.documentClass = dressenaItem;
    CONFIG.ActiveEffect.legacyTransferral = false;
//    CONFIG.Combat.documentClass = dressenaCombat;


//    CONFIG.ChatMessage.documentClass = dressenaChatMessage;

  
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("dressena", dressenaItemSheet, { makeDefault: true});

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("dressena", dressenaCharacterSheet, { makeDefault: true});

    preloadHandlebarsTemplates();

});

/*

Hooks.on("combatTurn", (combat, update, options, userId) => {

//    console.log("LE TOCA A: "+combat.combatant.actor.name);

    let arr = [];
    for (const combatant of combat.turns) {
    arr.push(combatant.name);
    }
//    console.log("ID IS: "+combat.combatant.name);
//   console.log("ARRAY VALUES: "+arr);
    const index = arr.indexOf(combat.combatant.actor.name);
    let current = index+1;
    console.log("COMBATIENTES: "+arr);
    console.log("IS THE TURN OF: "+arr[current]);
    let actorToResetEndurance = game.actors.getName(arr[current]);
    console.log("QUIERO RESETAR A: "+actorToResetEndurance.name);
//    let maxEndurance = actorToResetEndurance.system.endurance.max;
//    let currentEndurance = actorToResetEndurance.system.endurance.value;
//    console.log("RESETEO A: "+actorToResetEndurance.name+" DE ENDURANCE: "+currentEndurance+" A ENDURANCE: "+maxEndurance);
//    actorToResetEndurance.update({ "system.endurance.value": maxEndurance });

 //   if (!actorToResetEndurance.sheet.rendered) {
        // Rerender the sheet
//      actorToResetEndurance.sheet.render(true);
 //   }
   // actorToResetEndurance.sheet.render(true);






});

  Hooks.on("combatRound", (combat, update, options, userId) => {

    let arr = [];
    for (const combatant of combat.turns) {
    arr.push(combatant.name);
    }

    let current2 = 0;
    console.log("ES EL TURNO DE: "+arr[current2]);
    let actorToResetEndurance = game.actors.getName(arr[current2]);
//    let actorMaxEndurance = actorToResetEndurance.system.endurance.max;
//    actorToResetEndurance.resetEndurancePool();
//    actorToResetEndurance.update({ "system.endurance.value": actorMaxEndurance });
    const maxEndurance = actorToResetEndurance.system.endurance.max;
    const currentEndurance = actorToResetEndurance.system.endurance.value;
    console.log("RESETEO A: "+actorToResetEndurance.name+" DE ENDURANCE: "+currentEndurance+" A ENDURANCE: "+maxEndurance);
    actorToResetEndurance.update({ "system.endurance.value": maxEndurance });  
    if (!actorToResetEndurance.sheet.rendered) {
        // Rerender the sheet
        actorToResetEndurance.sheet.render(true);
    }

      });  

*/

Hooks.on("updateCombat", (combat, update, options, userId) => {
    // Check if it's a turn change
    if (update.turn) {
        const currentCombatantId = update.turn;
        const currentCombatant = game.combat.combatants.find(c => c._id === currentCombatantId);

        if (currentCombatant) {
            const actor = currentCombatant.actor;

            if (actor) {
                console.log(`It's ${actor.name}'s turn.`);
                // You can perform actions related to the actor's turn here
            }
        }
    }
});





Handlebars.registerHelper('toLowerCase', function (str) {
    return str.toLowerCase();
  });




