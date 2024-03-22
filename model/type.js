class Type {

    /**
     * Nom de l'Abilité
     * @type {string}
     */
    #name

    /**
     * @param {String} name 
     */
    constructor(name){
        this.#name = name;
        this.#fetchType();
    }

    async #fetchType(){
        const json = await pokeFetch(`https://pokeapi.co/api/v2/type/${this.#name}/`);

        this.#name = json.names[7].name;
    }    
    
    get name(){
        return this.#name;
    }
    get imageLink(){
        const capitalize = (string) => string.substring(0, 1).toUpperCase() + string.substring(1);
        return `https://play.pokemonshowdown.com/sprites/types/${capitalize(this.#name)}.png`;
    }
}

export default Type;