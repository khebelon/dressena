export default class dressenaCharacterSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/dressena/templates/sheets/character-sheet.hbs",
            classes: ["dressena", "sheet", "Character"]
        });
    }

  getData() {
    // Retrieve the data structure from the base sheet.
    const baseData = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = this.actor.toObject(false);

    // Add the actor's data to base structure for easier access
    baseData.system = actorData.system;

    // Add config data to base sctructure
    baseData.config = CONFIG.dressena;

    baseData.weapons = baseData.items.filter(function (item) { return item.type == "weapon" });
    baseData.traits = baseData.items.filter(function (item) { return item.type == "trait" });
    baseData.armors = baseData.items.filter(function (item) { return item.type == "armor" });
    baseData.spells = baseData.items.filter(function (item) { return item.type == "spell" });
    baseData.items = baseData.items.filter(function (item) { return item.type == "item" });

    return baseData;
  }

  activateListeners(html) {
  
   
    html.find(".rollable").click(this._onRoll.bind(this));
    super.activateListeners(html);
  }

  _onRoll(event) {
    event.preventDefault();
     const element = event.currentTarget;
     const dataset = element.dataset;
  
     let roll = new Roll(dataset.roll, this.actor.getRollData());
     roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: dataset.label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }

}



