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
        const json = await fetch(`https://pokeapi.co/api/v2/ability/${this.#name}/`);
        // Récupération du nom de l'abilitées dans le bon langage
        this.#name = json.names[7].name;
        // Récupération de la description de l'abilitées
        this.#description = json.effect_entries[0].short_effect;
    }    
    
    /**
     * @returns {string} Nom de l'abilité
     */
    get name(){
        return this.#name;
    }
    /**
     * @returns {string} Description de l'abilitées du pokémon
     */
    get description(){
        return this.#description;
    }
}
export default Ability;