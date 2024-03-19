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

    getImageLink() {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.#id}.png`;
    }

    getName() {
        return this.#name;
    }



}

export default Pokemon;