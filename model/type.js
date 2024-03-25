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
    }
    
    /**
     * @returns {string} Nom du type
     */
    get name(){
        return this.#name;
    }

    /**
     * @return {string} Liens de l'image du type
     */
    get imageLink(){
        const capitalize = (string) => string.substring(0, 1).toUpperCase() + string.substring(1);
        return `https://play.pokemonshowdown.com/sprites/types/${capitalize(this.#name)}.png`;
    }
}

export default Type;