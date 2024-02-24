export default class dressenaCharacterSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            submitOnClose: true,
            submitOnChange: true,
            template: "systems/dressena/templates/sheets/character-sheet.hbs",
            classes: ["dressena", "sheet", "Character"]
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


  // Add roll data for TinyMCE editors.
  context.rollData = context.actor.getRollData();

  context.weapons = context.items.filter(function (item) { return item.type == "weapon" });
  context.traits = context.items.filter(function (item) { return item.type == "trait" });
  context.armors = context.items.filter(function (item) { return item.type == "armor" });
  context.spells = context.items.filter(function (item) { return item.type == "spell" });
  context.items = context.items.filter(function (item) { return item.type == "item" });
  context.combatActions = context.items.filter(function (item) { return item.type == "combatAction" });


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
    console.log(li);
    item.delete();
    li.slideUp(200, () => this.render(false));
  });


  // Rollable abilities.
  html.on('click', '.rollable', this._onRoll.bind(this));

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


}




 /* getData() {
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

    new ContextMenu(html, ".weapon-card", this.itemContextMenu)
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
*/



