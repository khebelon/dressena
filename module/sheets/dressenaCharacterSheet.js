import {onManageActiveEffect, prepareActiveEffectCategories} from "../helpers/effects.js";
import * as Dice from "../dice.js";
import * as Conditions from "../helpers/conditions.js";


export default class dressenaCharacterSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width:830,
            height: 1000,
            submitOnClose: true,
            submitOnChange: true,
            template: "systems/dressena/templates/sheets/character-sheet.hbs",
            classes: ["dressena", "sheet", "Character"],
            tabs: [
              {
                navSelector: '.sheet-tabs-character',
                contentSelector: '.sheet-content',
                initial: 'description',
              },
            ],
        });
    }

    itemContextMenu = [
      {
        name: "Edit",
        icon: '<i class="fas fa-edit"></i>',
        callback: element => {
          const item = this.actor.items.get(element.data("item-id"));
          item.sheet.render(true);
         }
      },
      {
        name: "Delete",
        icon: '<i class="fas fa-trash"></i>',
        callback: element => {
          this.actor.deleteEmbeddedDocuments(element.data("item-id"))
        }
      }
    ];




/* -------------------------------------------- */

/** @override */
getData() {
  // Retrieve the data structure from the base sheet. You can inspect or log
  // the context variable to see the structure, but some key properties for
  // sheets are the actor object, the data object, whether or not it's
  // editable, the items array, and the effects array.
  const context = super.getData();

  // Use a safe clone of the actor data for further operations.
  const actorData = context.data;

  // Add the actor's data to context.data for easier access, as well as flags.
  context.system = actorData.system;
  context.flags = actorData.flags;

  context.config = CONFIG.dressena;
  const systemData = actorData.system;
  context.effects = prepareActiveEffectCategories(this.actor.allApplicableEffects());


  // Add roll data for TinyMCE editors.
  context.rollData = context.actor.getRollData();

  context.combatActions = context.items.filter(function (item) { return item.type == "combatAction" });
  context.weapons = context.items.filter(function (item) { return item.type == "weapon" });
  context.traits = context.items.filter(function (item) { return item.type == "trait" });
  context.armors = context.items.filter(function (item) { return item.type == "armor" });
  context.spells = context.items.filter(function (item) { return item.type == "spell" });
  context.items = context.items.filter(function (item) { return item.type == "item" });

  return context;
}

get template() {
  return `systems/dressena/templates/sheets/character-sheet.hbs`;
}




/** @override */         
activateListeners(html) {
  super.activateListeners(html);

  // Render the item sheet for viewing/editing prior to the editable check.
  html.on('click', '.item-edit', (ev) => {
    const li = $(ev.currentTarget).closest('.item');
    const item = this.actor.items.get(li.data('itemId'));
    item.sheet.render(true);
  });

  // -------------------------------------------------------------
  // Everything below here is only needed if the sheet is editable
  if (!this.isEditable) return;

  // Add Inventory Item
  html.on('click', '.item-create', this._onItemCreate.bind(this));

  // Delete Inventory Item
  html.on('click', '.item-delete', (ev) => {
    const li = $(ev.currentTarget).parents('.item');
    const item = this.actor.items.get(li.data('itemId'));
    item.delete();
    li.slideUp(200, () => this.render(false));
  });


  // Rollable abilities.
  html.on('click', '.rollable', this._onRoll.bind(this));
  html.find(".weapon-roll").click(this._onWeaponRoll.bind(this));
  html.find(".combataction-roll").click(this._onCombatActionRoll.bind(this));
  html.find(".item-roll").click(this._onItemRoll.bind(this));
  html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

  html.find(".abilityRoll").click((ev) => {
    const div = $(ev.currentTarget);
    const attributeName = div.data("label");
    const attributeRealName = div.data("name");
    this._abilityRoll(attributeName, attributeRealName);
  });


////////////////
this._contextMenu(html);
///////////////



  // Drag events for macros.
  if (this.actor.isOwner) {
    let handler = (ev) => this._onDragStart(ev);
    html.find('li.item').each((i, li) => {
      if (li.classList.contains('inventory-header')) return;
      li.setAttribute('draggable', true);
      li.addEventListener('dragstart', handler, false);
    });
  }
}  

_contextMenu(html) {
  ContextMenu.create(this, html, ".item", this._getItemContextOptions());
}

_getItemContextOptions() {
  const canEdit = function(tr) {
    let result = false;
    const itemId = tr.data("item-id");

    if (game.user.isGM) {
      result = true;
    }
    else {
      result = this.actor.items.find(item => item._id === itemId)
        ? true
        : false;
    }

    return result;
  };

  return [
    {
      name: "Edit",
      icon: '<i class="fas fa-edit"></i>',
      condition: element => canEdit(element),
      callback: element => {
        const itemId = element.data("item-id");
        const item = this.actor.items.get(itemId);
        return item.sheet.render(true);
      },
    },
    {
      name: "Delete",
      icon: '<i class="fas fa-trash"></i>',
      condition: tr => canEdit(tr),
      callback: tr => {
        const item = this.actor.items.get(tr.data("itemId"));
        item.delete();
      },
    },
  ];
}




_onItemDelete(itemId) {
  const itemData = this.actor.getEmbeddedDocument("Item", itemId);
  this.actor.deleteEmbeddedDocuments(element.data("item-id"));
}




/**
 * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
 * @param {Event} event   The originating click event
 * @private
 */
async _onItemCreate(event) {
  event.preventDefault();
  const header = event.currentTarget;
  // Get the type of item to create.
  const type = header.dataset.type;
  // Grab any data associated with this control.
  const data = duplicate(header.dataset);
  // Initialize a default name.
  const name = `New ${type.capitalize()}`;
  // Prepare the item object.
  const itemData = {
    name: name,
    type: type,
    system: data,
  };
  // Remove the type from the dataset since it's in the itemData.type prop.
  delete itemData.system['type'];

  // Finally, create the item!
  return await Item.create(itemData, { parent: this.actor });
}

/**
 * Handle clickable rolls.
 * @param {Event} event   The originating click event
 * @private
 */
_onRoll(event) {
  event.preventDefault();
  const element = event.currentTarget;
  const dataset = element.dataset;

  // Handle item rolls.
  if (dataset.rollType) {
    if (dataset.rollType == 'item') {
      const itemId = element.closest('.item').dataset.itemId;
      const item = this.actor.items.get(itemId);
      if (item) return item.roll();
    }
  }

  // Handle rolls that supply the formula directly.
  if (dataset.roll) {
    let label = dataset.label ? `[ability] ${dataset.label}` : '';
    let roll = new Roll(dataset.roll, this.actor.getRollData());
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: label,
      rollMode: game.settings.get('core', 'rollMode'),
    });
    return roll;
  }
}

_onWeaponRoll(event) {
  event.preventDefault();
  const itemID = event.currentTarget.closest(".item").dataset.itemId;
  const item = this.actor.items.get(itemID);
  let rollData = item.getRollData();
  let abilityMod;
  const actorData = this.actor;

  let weaponName = item.name;
  let weaponAbility = item.system.attackWith;
  let weaponDamage = item.system.damage;
  let weaponBonus = item.system.experienceBonus;
  let combatStrategy = actorData.system.combatStrategy;


  let rangedBonus = actorData.system.rangedWeaponBonus;
  let meleeBonus = actorData.system.meleeWeaponBonus;
  console.log (actorData);

  console.log("RANGED WEAPON BONUS IS: "+rangedBonus);
  if ((weaponAbility === "melee" && meleeBonus === false) || (weaponAbility === "ranged" && rangedBonus === false)) {
      weaponBonus = 0;
  }


  if (weaponAbility === "melee") {
  abilityMod = this.actor.system.meleeWeaponHandling;
  }

  let actorEndurance = actorData.system.endurance.value
  if (actorEndurance === 0) {
    return;
  }
  let WeaponAttackEndurance = actorEndurance-1;

  switch (weaponAbility) {
    case 'melee':
      abilityMod = this.actor.system.meleeWeaponHandling;
      this.actor.update({"system.endurance.value": WeaponAttackEndurance})
        break;
    case 'ranged':
    abilityMod = this.actor.system.rangedWeaponHandling;
    this.actor.update({"system.endurance.value": WeaponAttackEndurance})
      break;
    case 'ego':
      abilityMod = this.actor.system.ego;
        break;
    case 'fine':
      abilityMod = this.actor.system.fineMotor;
        break;
    case 'metaphysics':
      abilityMod = this.actor.system.metaphysics;
        break;
 
    }

  
  const targets = Array.from(game.user.targets);

  if (targets.length === 0) {
    console.log("ACTOR IS NULL");
  }
  const targetActor = targets[0].actor;
  const targetDefense = targets[0].actor.system.defense;

  let attack = Dice.WeaponAttack(
    {
      rollType: "Attack Roll",
      weaponName: weaponName,
      weaponAbility: weaponAbility,
      weaponDamage: weaponDamage,
      weaponName: weaponName,
      description: rollData.description,
      weaponBonus: weaponBonus,
      abilityMod: abilityMod,
      combatStrategy: combatStrategy,
      targetDefense: targetDefense,
      targetActor: targetActor
    }
  )


  const evalAttack = async () => {
    let attackOutcome = await attack;

    if (attackOutcome == "HIT") {
        function delay(time) {
            return new Promise(resolve => setTimeout(resolve, time));
        }

        // Wait for the delay before calling WeaponDamage
        await delay(3000);

        // Call WeaponDamage and await its result
        const weaponDamageResult = await Dice.WeaponDamage({
            rollType: "Damage Roll",
            weaponName: weaponName,
            weaponAbility: weaponAbility,
            weaponDamage: weaponDamage,
            weaponName: weaponName,
            description: rollData.description,
            weaponBonus: weaponBonus,
            abilityMod: abilityMod,
            combatStrategy: combatStrategy,
            targetDefense: targetDefense,
            targetActor: targetActor
        });

        await delay(3000);

        const ConditionResult = await Conditions.ConditionsManager({
          weaponDamageResult: weaponDamageResult,
          targetActor: targetActor
        });




    }
};

evalAttack();


}

_abilityRoll(attributeName, attributeRealName) {


  const rollAbility = async () => {
  let abilitymod = 0;
  if (attributeName == "health") {
    abilitymod = this.actor.system.health.max;
  } else if (attributeName == "endurance") {
    abilitymod = this.actor.system.endurance.max;
  } else {
  abilitymod = this.actor.system[attributeName];
  }
  let charName = this.actor.name;
  let charImg = this.actor.img;
  const abilityMessageTemplate = "systems/dressena/templates/chat/ability-chat.hbs";
  let abilityFormula = `1d10+${abilitymod}`;
  let abilityResult = await new Roll(abilityFormula).roll({ async: true });
  let renderedRoll = await abilityResult.render();

  let templateContext = {
    charName: charName,
    charImg: charImg,
    attributeName: attributeName,
    attributeRealName: attributeRealName,
    roll: renderedRoll,
  }

  let chatData = {
    user: game.user.id,
    speaker: ChatMessage.getSpeaker(),
    roll: abilityResult,
    content: await renderTemplate(abilityMessageTemplate, templateContext),
    sound: CONFIG.sounds.dice,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL
  }

  ChatMessage.create(chatData);
}

rollAbility();

}



_onCombatActionRoll(event) {
  event.preventDefault();
  event.preventDefault();
  const element = event.currentTarget;
  const dataset = element.dataset;
  const itemID = event.currentTarget.closest(".item").dataset.itemId;
  const item = this.actor.items.get(itemID);
  let rollData = item.getRollData();
  const actorData = this.actor;

  let enduranceCost = item.system.enduranceCost
  let actorEndurance = actorData.system.endurance.value

  if (actorEndurance === 0 && enduranceCost != 0) {
    return;
  }
  if (dataset.rollType) {
    if (dataset.rollType == 'item') {
      const itemId = element.closest('.item').dataset.itemId;
      const item = this.actor.items.get(itemId);
      if (item) {
//        actorData.system.endurance.value = actorEndurance - enduranceCost;
        let newEndurance = actorEndurance - enduranceCost;
        this.actor.update({"system.endurance.value": newEndurance})
                  if (item.name=='Restore Endurance') {
                    let actorMaxEndurance = actorData.system.endurance.max;
                    this.actor.update({"system.endurance.value": actorMaxEndurance});
                    let is_defending = actorData.system.defending;
                    console.log("IS DEFENDING: "+actorData.system.defending);
                    if (is_defending === true) {
                        let actorAgility = actorData.system.agility;
                        let newAgility = actorAgility-3;
                        this.actor.update({"system.agility": newAgility});
                        this.actor.update({"system.defending": false});
                             
                    }
                  }
                  if (item.name=='Defend') {
                        console.log("IS DEFENDING: "+actorData.system.defending);
                        let is_defending = actorData.system.defending;
                        if (is_defending === false) {
                        let actorAgility = actorData.system.agility;
                        let newAgility = actorAgility+3;
                        this.actor.update({"system.agility": newAgility});
                        this.actor.update({"system.defending": true});
                        } 
                  }

        return item.roll(); 
      }
    }
  }


}

_onItemRoll (event) {
  event.preventDefault();
  event.preventDefault();
  const element = event.currentTarget;
  const dataset = element.dataset;
  const itemID = event.currentTarget.closest(".item").dataset.itemId;
  const item = this.actor.items.get(itemID);
  let rollData = item.getRollData();
  const actorData = this.actor;

  if (item.name=="bandage") {
    let actorEndurance = this.actor.system.endurance.value;
    if (actorEndurance == 0) return;
    let newEndurance = this.actor.system.endurance.value-1;
    this.actor.update({"system.endurance.value": newEndurance});
    let newQuantity= item.system.quantity-1;
    item.update({"system.quantity": newQuantity});
    
    delay2(100).then(() => useBandage(item, itemID, newQuantity, actorData));
    }
    

  }

 

}



async function useBandage(item, itemID, newQuantity, actorData) {
  if (item.system.quantity==0) {
    item.delete();
  }




    const messageTemplate = "systems/dressena/templates/chat/weapon-chat.hbs";
    let actorSurvival = actorData.system.survival;

    let rollFormula = `1d8 + ${actorSurvival}`;

    let rollResult = await new Roll(rollFormula).roll({ async: true });
    let renderedRoll = await rollResult.render();
    let cure = rollResult.total;
    
    let actorHealth = actorData.system.health.value;
    let newHealth = actorHealth + cure;
    let maxHealth = actorData.system.health.max;
    if (newHealth > maxHealth) {
      actorData.update({"system.health.value": maxHealth})
    } else {
    actorData.update({"system.health.value": newHealth})
    }

    let templateContext = {
      flavor: `Use Bandage on ${actorData.name}`,
      weapon: item.name,
      roll: renderedRoll,
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

function delay2(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
