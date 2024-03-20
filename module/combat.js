import * as Conditions from "./helpers/conditions.js";

export class dressenaCombat extends Combat {

    async _onStartTurn() {
      await super._onStartTurn();
        console.log("Turn START");
        let combat = game.combat;
        if (combat && combat.turns.length > 0) {
            // Get the current turn index
            let currentTurn = combat.turn;
            let currentCombatant = combat.turns[currentTurn];
            console.log(currentCombatant.actor); // Output the current combatant object
            let maxEndurance = currentCombatant.actor.system.endurance.max;
            currentCombatant.actor.update({"system.endurance.value": maxEndurance});


            let is_defending = currentCombatant.actor.system.defending;
            console.log("IS DEFENDING: "+currentCombatant.actor.system.defending);
            if (is_defending === true) {
                let actorAgility = currentCombatant.actor.system.agility;
                let newAgility = actorAgility-3;
                currentCombatant.actor.update({"system.agility": newAgility});
                currentCombatant.actor.update({"system.defending": false});
                
            }

            Conditions.checkConditions(currentCombatant.actor);


              }


}

}