/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class dressenaItem extends Item {
  
  
    /**
     * Augment the basic Item data model with additional dynamic data.
     */
    prepareData() {
      // As with the actor class, items are documents that can have their data
      // preparation methods overridden (such as prepareBaseData()).
      super.prepareData();
    }
  
    /**
     * Prepare a data object which defines the data schema used by dice roll commands against this Item
     * @override
     */
    getRollData() {
      // Starts off by populating the roll data with `this.system`
      const rollData = { ...super.getRollData() };
  
      // Quit early if there's no parent actor
      if (!this.actor) return rollData;
  
      // If present, add the actor's roll data
      rollData.actor = this.actor.getRollData();
  
      return rollData;
    }
  
    /**
     * Handle clickable rolls.
     * @param {Event} event   The originating click event
     * @private
     */
    async roll() {
      const item = this;
  
      // Initialize chat data.
      const speaker = ChatMessage.getSpeaker({ actor: this.actor });
      const rollMode = game.settings.get('core', 'rollMode');
      const label = `[${item.type}] ${item.name}`;
  
      // If there's no roll data, send a chat message.
      if (!this.system.formula) {
        ChatMessage.create({
          speaker: speaker,
          rollMode: rollMode,
          flavor: label,
          content: item.system.description ?? '',
        });
      }
      // Otherwise, create a roll and send a chat message from it.
      else {
        // Retrieve roll data.
        const rollData = this.getRollData();
  
        // Invoke the roll and submit it to chat.
        const roll = new Roll(rollData.formula, rollData);
        // If you need to store the value first, uncomment the next line.
        // const result = await roll.evaluate();
        roll.toMessage({
          speaker: speaker,
          rollMode: rollMode,
          flavor: label,
        });
        return roll;
      }
    }


    async _onCreate(data, options, user){

      await super._onCreate(data, options, user);

      if (this.type == "trait") {
        let improvement = this.system.traitBonus;
        let improvedAbility = this.system.improvedAbility;
        let improvedAbilityValue = 0;
        switch (improvedAbility) {
          case "meleeWeaponHandling":
            improvedAbilityValue = this.actor.system.meleeWeaponHandling;
            break;
          case "health":
            improvedAbilityValue = this.actor.system.health.max;
              break;
          case "endurance":
            improvedAbilityValue = this.actor.system.endurance.max;
              break;
          case "rangedWeaponHandling":
            improvedAbilityValue = this.actor.system.rangedWeaponHandling;
              break;
          case "agility":
            improvedAbilityValue = this.actor.system.agility;
            break;
          case "fineMotor":
            improvedAbilityValue = this.actor.system.fineMotor;
              break;
          case "stealth":
            improvedAbilityValue = this.actor.system.stealth;
              break;
          case "exteriorWorld":
            improvedAbilityValue = this.actor.system.exteriorWorld;
              break;
          case "logic":
            improvedAbilityValue = this.actor.system.logic;
            break;
          case "suggestion":
            improvedAbilityValue = this.actor.system.suggestion;
              break;
          case "combatStrategy":
            improvedAbilityValue = this.actor.system.combatStrategy;
              break;
          case "metaphysics":
            improvedAbilityValue = this.actor.system.metaphysics;
              break;
          case "survival":
            improvedAbilityValue = this.actor.system.survival;
            break;
          case "encyclopedia":
            improvedAbilityValue = this.actor.system.encyclopedia;
              break;
          case "ethics":
            improvedAbilityValue = this.actor.system.ethics;
              break;
          case "painThreshold":
            improvedAbilityValue = this.actor.system.painThreshold;
              break;
          case "valor":
            improvedAbilityValue = this.actor.system.valor;
              break;
          case "rhetoric":
            improvedAbilityValue = this.actor.system.rhetoric;
              break;
          case "volition":
            improvedAbilityValue = this.actor.system.volition;
            break;
          case "authority":
            improvedAbilityValue = this.actor.system.authority;
              break;
          case "occultism":
            improvedAbilityValue = this.actor.system.occultism;
              break;
          case "ego":
            improvedAbilityValue = this.actor.system.ego;
              break;
                                
        }
        this.actor.update({[`system.${this.system.improvedAbility}`] : improvedAbilityValue + improvement});
        
      }

  }

  async _onDelete(data, options, user){
    
    await super._onDelete(data, options, user);
    
    if (this.type == "trait") {
      let improvement = this.system.traitBonus;
      let improvedAbility = this.system.improvedAbility;
      let improvedAbilityValue = 0;
      switch (improvedAbility) {
        case "meleeWeaponHandling":
          improvedAbilityValue = this.actor.system.meleeWeaponHandling;
          break;
        case "health":
          improvedAbilityValue = this.actor.system.health.max;
            break;
        case "endurance":
          improvedAbilityValue = this.actor.system.endurance.max;
            break;
        case "rangedWeaponHandling":
          improvedAbilityValue = this.actor.system.rangedWeaponHandling;
            break;
        case "agility":
          improvedAbilityValue = this.actor.system.agility;
          break;
        case "fineMotor":
          improvedAbilityValue = this.actor.system.fineMotor;
            break;
        case "stealth":
          improvedAbilityValue = this.actor.system.stealth;
            break;
        case "exteriorWorld":
          improvedAbilityValue = this.actor.system.exteriorWorld;
            break;
        case "logic":
          improvedAbilityValue = this.actor.system.logic;
          break;
        case "suggestion":
          improvedAbilityValue = this.actor.system.suggestion;
            break;
        case "combatStrategy":
          improvedAbilityValue = this.actor.system.combatStrategy;
            break;
        case "metaphysics":
          improvedAbilityValue = this.actor.system.metaphysics;
            break;
        case "survival":
          improvedAbilityValue = this.actor.system.survival;
          break;
        case "encyclopedia":
          improvedAbilityValue = this.actor.system.encyclopedia;
            break;
        case "ethics":
          improvedAbilityValue = this.actor.system.ethics;
            break;
        case "painThreshold":
          improvedAbilityValue = this.actor.system.painThreshold;
            break;
        case "valor":
          improvedAbilityValue = this.actor.system.valor;
            break;
        case "rhetoric":
          improvedAbilityValue = this.actor.system.rhetoric;
            break;
        case "volition":
          improvedAbilityValue = this.actor.system.volition;
          break;
        case "authority":
          improvedAbilityValue = this.actor.system.authority;
            break;
        case "occultism":
          improvedAbilityValue = this.actor.system.occultism;
            break;
        case "ego":
          improvedAbilityValue = this.actor.system.ego;
            break;
                                
      }
      this.actor.update({[`system.${this.system.improvedAbility}`] : improvedAbilityValue - improvement});

      
    }
    
}


  }
  