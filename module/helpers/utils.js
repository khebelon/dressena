export async function resetCurrentEndurance (combatant) {

    let actorData = combatant;
    actorData.prepareData();
    console.log ("UPDATE DE "+actorData.name+" que tiene "+actorData.system.endurance.value+" de endurance a "+actorData.system.endurance.max);
    console.log(actorData);
    let actorMaxEndurance = actorData.system.endurance.max;
    combatant.update({"system.endurance.value": actorMaxEndurance});
    
    let is_defending = actorData.system.defending;
    console.log("IS DEFENDING: "+actorData.system.defending);
    if (is_defending === true) {
        let actorAgility = actorData.system.agility;
        let newAgility = actorAgility-3;
        combatant.update({"system.agility": newAgility});
        combatant.update({"system.defending": false});
             
    }


}