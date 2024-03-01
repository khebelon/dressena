import {onManageActiveEffect, prepareActiveEffectCategories} from "../helpers/effects.js";

export default class dressenaItemSheet extends ItemSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 530,
            height:340,
            classes: ["dressena", "sheet", "item"],
            tabs: [
              {
                navSelector: '.sheet-tabs',
                contentSelector: '.sheet-content',
                initial: 'description',
              },
            ],
      
        })
    }

    get template() {
        return `systems/dressena/templates/sheets/${this.item.type}-sheet.hbs`;
    }

    getData() {
        // Retrieve base data structure.
        const context = super.getData();
    
        // Use a safe clone of the item data for further operations.
        const itemData = context.data;
    
        // Retrieve the roll data for TinyMCE editors.
        context.rollData = this.item.getRollData();
        context.config = CONFIG.dressena;
    
        // Add the item's data to context.data for easier access, as well as flags.
        context.system = itemData.system;
        context.flags = itemData.flags;
        context.effects = prepareActiveEffectCategories(this.item.effects);

    
        // Prepare active effects for easier access
    
        return context;
      }
    
      /* -------------------------------------------- */
    
      /** @override */
      activateListeners(html) {
        super.activateListeners(html);
    
        // Everything below here is only needed if the sheet is editable
        if (!this.isEditable) return;
    
        // Roll handlers, click handlers, etc. would go here.
    
        // Active Effect management
        html.on('click', '.effect-control', (ev) =>
          onManageActiveEffect(ev, this.item)
        );

      }
   

    }