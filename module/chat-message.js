import {_WeaponAttackChat, _WeaponDamageChat} from '../helpers/items.mjs';


export class dressenaChatMessage extends ChatMessage {

    activateListeners(html) {
        super.activateListeners(html);
    } 

 /*   async getHTML() {
        const html = await super.getHTML();

        html.on('click', '.item-button-attack-chat', _WeaponAttackChat.bind(this));
        html.on('click', '.item-button-damage-chat', _WeaponDamageChat.bind(this));

        return html
    }*/

}   