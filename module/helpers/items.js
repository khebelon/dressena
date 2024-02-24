export async function _WeaponAttackChat (){
    event.preventDefault();
    const a = event.currentTarget;

    const li = a.closest("li");
    const item = li.dataset.itemId ? this.actor.items.get(li.dataset.itemId) : null;
    const itemData = item.system;
    const systemData = this.actor.system;

    console.log("THIS IS AN ATTACK!!!");

} 

export async function _WeaponDamageChat (){
    event.preventDefault();
    const a = event.currentTarget;

    const li = a.closest("li");
    const item = li.dataset.itemId ? this.actor.items.get(li.dataset.itemId) : null;
    const itemData = item.system;
    const systemData = this.actor.system;

    console.log("THIS IS AN ATTACK!!!");

} 