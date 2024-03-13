class Pokemon{

    /***
     * Nom du pokémon
     * @type {string}
     */
    #nom; 
    
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
        this.#nom = nomPokemon;
    }







}

export default Pokemon;