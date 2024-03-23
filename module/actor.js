/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 */

export class dressenaActor extends Actor {
    /** @override */
    prepareData() {
      // Prepare data for the actor. Calling the super version of this executes
      // the following, in order: data reset (to clear active effects),
      // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
      // prepareDerivedData().
      super.prepareData();
    }
  
    /** @override */
    prepareBaseData() {
      // Data modifications in this step occur before processing embedded
      // documents or derived data.
    }
  
    /**
     * @override
     * Augment the actor source data with additional dynamic data. Typically,
     * you'll want to handle most of your calculated/derived data in this step.
     * Data calculated in this step should generally not exist in template.json
     * (such as ability modifiers rather than ability scores) and should be
     * available both inside and outside of character sheets (such as if an actor
     * is queried and has a roll executed directly from it).
     */
    prepareDerivedData() {
      const actorData = this;
      const systemData = actorData.system;
      const flags = actorData.flags.dressenaActor || {};
      
//      systemData.defense = systemData.endurance.value+systemData.agility;
//      let def = systemData.defense;
//      console.log("defense es: "+def);
//      console.log("agility es:"+systemData.agility);

      // Make separate methods for each Actor type (character, npc, etc.) to keep
      // things organized.
      this._prepareCharacterData(actorData);
      this._prepareNpcData(actorData);
      this._UpdateDefense(actorData);
      this._ManageCombatActions(actorData);
   //   this._ManageAbilities(actorData);
   //   this._UpdateTraits(actorData);
    }
  
    /**
     * Prepare Character type specific data
     */
    _prepareCharacterData(actorData) {
      if (actorData.type == 'character') return;
      // Make modifications to data here. For example:
      const systemData = actorData.system;




  
      // Loop through ability scores, and add their modifiers to our sheet output.
//      for (let [key, ability] of Object.entries(systemData.abilities)) {
 //       ability.mod = Math.floor((ability.value - 10) / 2);
//      }
    }
  
    /**
     * Prepare NPC type specific data.
     */
    _prepareNpcData(actorData) {
      if (actorData.type !== 'npc') return;
  
      // Make modifications to data here. For example:
      const systemData = actorData.system;
    //  systemData.xp = systemData.cr * systemData.cr * 100;
    }
  
    /**
     * Override getRollData() that's supplied to rolls.
     */
    getRollData() {
      // Starts off by populating the roll data with `this.system`
      const data = { ...super.getRollData() };
  
      // Prepare character roll data.
      this._getCharacterRollData(data);
      this._getNpcRollData(data);
  
      return data;
    }
  
    /**
     * Prepare character roll data.
     */
    _getCharacterRollData(data) {
      if (this.type !== 'character') return;
  
      // Copy the ability scores to the top level, so that rolls can use
      // formulas like `@str.mod + 4`.
      if (data.abilities) {
        for (let [k, v] of Object.entries(data.abilities)) {
          data[k] = foundry.utils.deepClone(v);
        }
      }
  
      // Add level for easier access, or fall back to 0.
      if (data.attributes.level) {
        data.lvl = data.attributes.level.value ?? 0;
      }
    }
  
    /**
     * Prepare NPC roll data.
     */
    _getNpcRollData(data) {
      if (this.type !== 'npc') return;
  
      // Process additional NPC data here.
    }

    _UpdateDefense(actorData) {
      const systemData = actorData.system;
      
      
      let def = systemData.defense;
      let armors = this.items.filter(function (item) { return item.type == "armor" });
      let armorData = {};
      let armorBonus = 0;
      let armorEquipped;
      let stealthReduction = 0;
      armors.forEach(armor => {
        armorData = armor.getRollData();
        armorBonus = armorData.armorBonus;
        armorEquipped = armorData.equipped;
        stealthReduction= armorData.stealthReduction;
      });
      console.log("ENDURANCE: "+systemData.endurance.value+" AGILITY: "+systemData.agility);
      let newDefense = systemData.endurance.value+systemData.agility+armorBonus;
      actorData.update({"system.defense": newDefense});

    }


  _ManageCombatActions(actorData) {
    const systemData = actorData.system;

    let combatActions = this.items.filter(function (item) { return item.type == "combatAction" });
    let combatActionData = {};
    combatActions.forEach(combatAction => {
      combatActionData = combatAction.getRollData();
    });
  }


  _UpdateTraits(actorData) {
    const systemData = actorData.system;
    let traits = this.items.filter(function (item) { return item.type == "trait" });
    traits.forEach(trait => {
      console.log("VALOR ES: "+trait.system.active);
      if(trait.system.active === false) {
        console.log("ACTIVO EL TRAIT:"+trait.name);
        trait.update({"system.active": true});
        /*let mwh = actorData.system.meleeWeaponHandling;
        let nmwh = mwh + 10;
        actorData.update({"system.meleeWeaponHandling": nmwh});*/

      }
      console.log("NUEVO VALOR ES: "+trait.system.active);  
    });

  }

  _ManageAbilities(actorData) {
    const systemData = actorData.system;

    let weakChar = 0;
    let strongChar = 0;
    let weakHealth = 0;
    let strongHealth = 0;

    if (systemData.level == "1") {
      weakChar = 1;
      strongChar = 2;
      weakHealth = 12;
      strongHealth = 14
    }
    if (systemData.level == "2") {
      weakChar = 1;
      strongChar = 2;
      weakHealth = 15;
      strongHealth = 18
    }
    if (systemData.level == "3") {
      weakChar = 1;
      strongChar = 3;
      weakHealth = 18;
      strongHealth = 21
    }
    if (systemData.level == "4") {
      weakChar = 2;
      strongChar = 3;
      weakHealth = 22;
      strongHealth = 26
    }
    if (systemData.level == "5") {
      weakChar = 2;
      strongChar = 4;
      weakHealth = 26;
      strongHealth = 30
    }
    if (systemData.level == "6") {
      weakChar = 2;
      strongChar = 4;
      weakHealth = 30;
      strongHealth = 35
    }
    if (systemData.level == "7") {
      weakChar = 3;
      strongChar = 5;
      weakHealth = 35;
      strongHealth = 39
    }
    if (systemData.level == "8") {
      weakChar = 3;
      strongChar = 5;
      weakHealth = 38;
      strongHealth = 43
    }
    if (systemData.level == "9") {
      weakChar = 4;
      strongChar = 5;
      weakHealth = 42;
      strongHealth = 48;
    }
    if (systemData.level == "10") {
      weakChar = 4;
      strongChar = 6;
      weakHealth = 46;
      strongHealth = 53;
    }


      
      if (actorData.type == "warrior") {
        actorData.update({"system.meleeWeaponHandling": strongChar});
        actorData.update({"system.health.max": strongHealth});
        actorData.update({"system.endurance.max": strongChar});
        actorData.update({"system.rangedWeaponHandling": weakChar});
        actorData.update({"system.agility": weakChar});
        actorData.update({"system.fineMotor": weakChar});
        actorData.update({"system.stealth": weakChar});
        actorData.update({"system.exteriorWorld": weakChar});
        actorData.update({"system.logic": weakChar});
        actorData.update({"system.suggestion": weakChar});
        actorData.update({"system.combatStrategy": weakChar});
        actorData.update({"system.metaphysics": weakChar});
        actorData.update({"system.survival": weakChar});
        actorData.update({"system.encyclopedia": weakChar});
        actorData.update({"system.ethics": weakChar});
        actorData.update({"system.painThreshold": weakChar});
        actorData.update({"system.valor": weakChar});
        actorData.update({"system.rhetoric": weakChar});
        actorData.update({"system.volition": weakChar});
        actorData.update({"system.authority": weakChar});
        actorData.update({"system.occultism": weakChar});
      }
      if (actorData.type == "hunter") {
        actorData.update({"system.meleeWeaponHandling": weakChar});
        actorData.update({"system.health.max": weakHealth});
        actorData.update({"system.endurance.max": weakChar});
        actorData.update({"system.rangedWeaponHandling": strongChar});
        actorData.update({"system.agility": strongChar});
        actorData.update({"system.fineMotor": strongChar});
        actorData.update({"system.stealth": strongChar});
        actorData.update({"system.exteriorWorld": weakChar});
        actorData.update({"system.logic": weakChar});
        actorData.update({"system.suggestion": weakChar});
        actorData.update({"system.combatStrategy": weakChar});
        actorData.update({"system.metaphysics": weakChar});
        actorData.update({"system.survival": weakChar});
        actorData.update({"system.encyclopedia": weakChar});
        actorData.update({"system.ethics": weakChar});
        actorData.update({"system.painThreshold": weakChar});
        actorData.update({"system.valor": weakChar});
        actorData.update({"system.rhetoric": weakChar});
        actorData.update({"system.volition": weakChar});
        actorData.update({"system.authority": weakChar});
        actorData.update({"system.occultism": weakChar});
      }

    } 


    }

