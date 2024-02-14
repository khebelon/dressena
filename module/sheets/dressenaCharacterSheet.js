export default class dressenaCharacterSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/dressena/templates/sheets/character-sheet.hbs",
            classes: ["dressena", "sheet", "Character"]
        });
    }

    getData() {
        const context = super.getData();
        context.config = CONFIG.dressena;
        context.weapons = itemData.filters(function (item) {return item.type == "weapon"});
        return context;
    }
}