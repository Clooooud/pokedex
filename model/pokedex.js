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

    /**
     * Recherche actuelle
     * @type {String}
     */
    #search;

    /**
     * Cache de la recherche
     * @type {Array}
     */
    #searchedCache;
    
    constructor() {
        this.#pokemons = [];
        this.#selection = null;
        this.#page = 0;
    }

    /**
     * Récupère la liste de pokémon depuis l'API
     */
    async fetchPokemons() {
        if (this.#pokemons.length > 0) {
            return;
        }

        await pokeFetch(`https://pokeapi.co/api/v2/pokemon/?limit=${Pokedex.#NUMBER_OF_POKEMONS}`)
            .then(json => json.results)
            .then(results => {
                results.forEach((pokemon, id) => this.#pokemons.push(
                    // +1 car l'id commence à 1
                    new Pokemon(id+1, pokemon.name)
                ))
            });
    }

    getPokemon(id) {
        return this.#pokemons.filter(pokemon => pokemon.id == id)[0];
    }

    /**
     * @returns {Array} Liste de Pokemon
     * @see Pokemon
     */
    getPokemons() {
        if (this.#search) {
            if (!this.#searchedCache) {
                this.#searchedCache = this.#pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(this.#search.toLowerCase()));
            }
            return this.#searchedCache;
        }
        return this.#pokemons;
    }

    /**
     * @returns {number} Page actuelle
     */
    get page() {
        return this.#page;
    }

    /**
     * @returns {Pokemon} Pokemon sélectionné
     * @see Pokemon
     */
    get selection() {
        return this.#selection;
    }

    /**
     *  @param {Pokemon} pokemon Pokemon à sélectionner
     */
    select(pokemon) {
        this.#selection = pokemon.id;
    }

    /**
     * @param {number} offset Le décalage a ajouté à la page actuelle
     * @returns {boolean} Vrai si la page a changé
     */
    changePage(offset) {
        const oldPage = this.#page;

        this.#page += offset;
        if (this.#page < 0) {
            this.#page = this.getPageMax();
        }

        if (this.#page > this.getPageMax()) {
            this.#page = 0;
        }

        return oldPage !== this.#page;
    }

    /**
     * @returns {number} Nombre de page maximum
     * @see #POKEMONS_PER_PAGE
     */
    getPageMax() {
        return Math.floor(this.getPokemons().length / Pokedex.#POKEMONS_PER_PAGE);
    }

    /**
     * @returns {Array} Liste de Pokemon sur la page actuelle
     * @see Pokemon
     */
    getPokemonsOnPage() {
        return this.getPokemons().slice(this.#page * Pokedex.#POKEMONS_PER_PAGE, (this.#page + 1) * Pokedex.#POKEMONS_PER_PAGE);
    }

    search(research) {
        this.#search = research;
        this.#searchedCache = null;
        this.#page = 0;
    }
}

export default Pokedex;