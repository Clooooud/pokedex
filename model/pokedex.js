import Pokemon from "./pokemon.js";

/**
 *  Un pokédex contient la page du pokémon sélectionné ainsi qu'une liste de pokémon
 * @see Pokemon
 */ 
class Pokedex {

    static #POKEMONS_PER_PAGE = 20; // 4 colonnes * 5 lignes
    static #NUMBER_OF_POKEMONS = 1025; // Nombre de pokémon dans l'API en enlevant les méga-évolutions et cas spéciaux

    /**
     * Liste de pokémon
     * @type {Array}
     */
    #pokemons;

    /**
     * Sélection actuel, correspond au pokémon sélectionné
     * @type {Pokemon}
     */
    #selection;

    /**
     * Page actuelle
     * @type {number}
     * @see #POKEMONS_PER_PAGE
     */
    #page;
    
    constructor() {
        this.#pokemons = [];
        this.#selection = null;
        this.#page = 0;
    }

    /**
     * Récupère la liste de pokémon depuis l'API
     */
    async fetchPokemons() {
        await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${Pokedex.#NUMBER_OF_POKEMONS}`)
            .then(response => response.json())
            .then(json => json.results)
            .then(results => {
                results.forEach((pokemon, id) => this.#pokemons.push(
                    // +1 car l'id commence à 1
                    new Pokemon(id+1, pokemon.name)
                ))
            });
    }

    /**
     * @returns {Array} Liste de Pokemon
     * @see Pokemon
     */
    getPokemons() {
        return this.#pokemons;
    }

    /**
     * @returns {number} Page actuelle
     */
    getPage() {
        return this.#page;
    }

    /**
     * @returns {Pokemon} Pokemon sélectionné
     * @see Pokemon
     */
    getSelection() {
        return this.#selection;
    }

    /**
     * @param {number} offset Le décalage a ajouté à la page actuelle
     * @returns {boolean} Vrai si la page a changé
     */
    changePage(offset) {
        const oldPage = this.#page;

        this.#page += offset;
        this.#page = Math.max(0, Math.min(this.#page, this.getPageMax()));

        return oldPage !== this.#page;
    }

    /**
     * @returns {number} Nombre de page maximum
     * @see #POKEMONS_PER_PAGE
     */
    getPageMax() {
        return Math.floor(this.#pokemons.length / Pokedex.#POKEMONS_PER_PAGE);
    }

    /**
     * @returns {Array} Liste de Pokemon sur la page actuelle
     * @see Pokemon
     */
    getPokemonsOnPage() {
        return this.#pokemons.slice(this.#page * Pokedex.#POKEMONS_PER_PAGE, (this.#page + 1) * Pokedex.#POKEMONS_PER_PAGE);
    }
}

export default Pokedex;