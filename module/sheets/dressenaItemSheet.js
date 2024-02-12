export default class dressenaItemSheet extends ItemSheet {
    get template() {
        return `systems/dressena/templates/sheets/${this.item.data.type}-sheet.html`;
    }

    get data() {
        const data = super.getData();
        data.config = CONFIG.dressena;
        return data;
    }

}