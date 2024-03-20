export async function ConditionsManager({
    weaponDamageResult = null,
    targetActor = null } = {}) {



///////////////////////////// MASSIVE DAMAGE EVAL ////////////////////////////////    
    let targetActorMaxHealth = targetActor.system.health.max;
    let massiveDamageLimit = Math.floor(targetActorMaxHealth / 2);
    console.log("RECIBE "+weaponDamageResult+" de daño, el limite es "+massiveDamageLimit);
    if (weaponDamageResult >= massiveDamageLimit) {
        console.log("MASSIVE DAMAGE VALUE!!!");
        targetActor.update({"system.conditions.massiveDamage.value": true});
        massiveDamageChat(targetActor);
    } 
////////////////////////// BLEEDING EVAL ///////////////////////////////////////
    let targetCurrentHealth = targetActor.system.health.value;
    console.log("LA VIDA ES "+targetCurrentHealth+" que es menor a "+massiveDamageLimit);
    if (targetCurrentHealth < massiveDamageLimit) {
        console.log("CHARACTER BLEEDING!");
        targetActor.update({"system.conditions.bleeding.value": true});
    }
//////////////////////////// UNCONSCIOUS EVAL /////////////////////////////////////////
    if (targetCurrentHealth <1 && targetCurrentHealth > -9) {   
        console.log("CHARACTER UNCONSCIOUS!")
        targetActor.update({"system.conditions.unconscious.value": true});
    }
//////////////////////////// DEATH EVAL /////////////////////////////////////////
    if (targetCurrentHealth < -9) {
    console.log("CHARACTER DEAD!")
        targetActor.update({"system.conditions.dead.value": true});
    }





    console.log(targetActor);

    }

    async function massiveDamageChat(targetActor) {
        
    const messageTemplate = "systems/dressena/templates/chat/conditions-chat.hbs";
    let targetName = targetActor.name;
    let templateContext = {
        flavor: "Massive Damage",
        description: "You have Massive Damage",
        targetName: targetName,
      }
    
      let chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker(),
        content: await renderTemplate(messageTemplate, templateContext),
        sound: CONFIG.sounds.dice,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL
      }
    
      ChatMessage.create(chatData);
    }


    export async function checkConditions(combatant){
    
    ///////////// CHECKING BLEEDING /////////////////
    let bleeding = combatant.system.conditions.bleeding.value;
    let targetCurrentHealth = combatant.system.health.value;
    console.log("PASO POR ACA1");

    if (bleeding === true) {
        console.log("PASO POR ACA2");
        let newHealth = combatant.system.health.value-1;
        console.log("New Health for "+combatant.name+" is"+newHealth);
        combatant.update({"system.health.value": newHealth});
    }
    if (targetCurrentHealth <1 && targetCurrentHealth > -9) {
        console.log("CURRENT HEALTH IS: "+targetCurrentHealth);
        console.log("CHARACTER UNCONSCIOUS!")
        combatant.update({"system.conditions.unconscious.value": true});

    }        
    if (targetCurrentHealth < -9) {
        console.log("CURRENT HEALTH IS: "+targetCurrentHealth);
        console.log("CHARACTER DEAD!")
        combatant.update({"system.conditions.dead.value": true});

    }

    
    }