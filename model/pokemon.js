class Pokemon{

    /***
     * Nom du pokémon
     * @type {string}
     */
    #name; 
    
    /**
     * Id du pokemon
     * @type{number}
     */
    #id

    /**
     * Stats du pokemon
     * @type{Array}
     */
    #stats

    // TODO: getCrie directement
    #cries

    // TODO: faut faire un getTypes avec les noms
    #type 

    #abilities


    /**
     * @param {number} id 
     * @param {string} nomPokemon
     */
    constructor(id, nomPokemon){
        this.#id = id;
        this.#name = nomPokemon;
    }

    /**
     * @returns {string} Lien de l'image du pokémon
     */
    getImageLink() {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.#id}.png`;
    }

    /**
     * @returns {string} Nom du pokémon
     */
    getName() {
        return this.#name;
    }

    /**
     * @returns {number} Id du pokémon
     */
    getId() {
        return this.#id;
    }



}

export default Pokemon;