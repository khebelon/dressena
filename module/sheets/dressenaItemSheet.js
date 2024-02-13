export default class dressenaItemSheet extends ItemSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 530,
            height:340,
            classes: ["dressena", "sheet", "item"]
        })
    }

    get template() {
        return `systems/dressena/templates/sheets/${this.item.type}-sheet.html`;
    }

    getData() {
        // Retrieve base data structure.
        const context = super.getData();

        // Use a safe clone of the item data for further operations.
        const itemData = context.data;
        context.config = CONFIG.dressena;

        // Retrieve the roll data for TinyMCE editors.
        context.rollData = this.item.getRollData();

        // Add the item's data to context.data for easier access, as well as flags.
        context.system = itemData.system;
        context.flags = itemData.flags;

        return context;
    }


    }