export async function WeaponRoll({
    weaponName = null,
    weaponAbility = null,
    weaponDamage = null,
    weaponBonus = null,
    description = null,
    abilityMod = null,
    askForOptions = true } = {}) {
    const messageTemplate = "systems/dressena/templates/chat/weapon-chat.hbs";
  
    let rollType = "Damage Roll";
    let label = `${rollType}: ${weaponName}`;
  
  
    let rollFormula = `${weaponDamage}+${abilityMod}`;
    let rollResult = await new Roll(rollFormula).roll({ async: true });
    let renderedRoll = await rollResult.render();
  
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
  }
  