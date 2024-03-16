import { dressena } from "./config.js";

  export async function WeaponAttack({
    rollType = null,
    weaponName = null,
    weaponAbility = null,
    weaponDamage = null,
    weaponBonus = null,
    description = null,
    abilityMod = null,
    combatStrategy = null,
    targetDefense = null,
    targetActor: targetActor,
    askForOptions = true } = {}) {
    const messageTemplate = "systems/dressena/templates/chat/weapon-chat.hbs";
  
    
    let label = `${rollType}: ${weaponName} to ${targetActor.name}`;
    let result = null;
    let rollFormula = `1d10+${combatStrategy}+${abilityMod}`;


    let rollResult = await new Roll(rollFormula).roll({ async: true });
    let renderedRoll = await rollResult.render();
  
    let attackRoll = rollResult.total;
    let output = null;

    if (attackRoll >= targetDefense) {
        output = "HIT"; }
    else {
        output = "MISS";
        }


    let templateContext = {
      flavor: label,
      weapon: weaponName,
      description: description,
      roll: renderedRoll,
      output: output
    }
  
    let chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker(),
      roll: rollResult,
      content: await renderTemplate(messageTemplate, templateContext),
      sound: CONFIG.sounds.dice,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL
    }
  
    ChatMessage.create(chatData);

    return output;

  }


  export async function WeaponDamage({
    rollType = null,
    weaponName = null,
    weaponAbility = null,
    weaponDamage = null,
    weaponBonus = null,
    description = null,
    abilityMod = null,
    combatStrategy = null,
    targetActor: targetActor,
    askForOptions = true } = {}) {
    const messageTemplate = "systems/dressena/templates/chat/weapon-chat.hbs";
  
    let label = `${rollType}: ${weaponName} to ${targetActor.name}`;

    let rollFormula = `${weaponDamage}+${abilityMod}+${weaponBonus}`;

    console.log("EXP BONUS IS: "+weaponBonus);


    let rollResult = await new Roll(rollFormula).roll({ async: true });
    let renderedRoll = await rollResult.render();

    let damageRoll = rollResult.total;

  
    let templateContext = {
      flavor: label,
      weapon: weaponName,
      description: description,
      roll: renderedRoll
    }
  
    let chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker(),
      roll: rollResult,
      content: await renderTemplate(messageTemplate, templateContext),
      sound: CONFIG.sounds.dice,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL
    }
  
    ChatMessage.create(chatData);

    let newHealth = targetActor.system.health.value - damageRoll;
    targetActor.update({"system.health.value": newHealth})


  }

