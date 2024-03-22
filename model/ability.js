class Ability{

    /**
     * Nom de l'Abilité
     * @type {string}
     */
    #name

    /**
     * 
     * @type {string}
     */
    #description

    /**
     * @param {string} name 
     */
    constructor(name){
        this.#name = name;
        this.#fetchAbility();
    }

    async #fetchAbility(){
        const json = await pokeFetch(`https://pokeapi.co/api/v2/ability/${this.#name}/`);

        this.#name = json.names[7].name;
        this.#description = json.effect_entries[0].short_effect;
        
    }    
    
    get name(){
        return this.#name;
    }
    get description(){
        return this.#description;
    }
}
export default Ability;