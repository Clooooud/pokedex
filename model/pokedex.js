import Pokemon from "./pokemon.js";

/**
 *  Un pokédex contient la page du pokémon sélectionné ainsi qu'une liste de pokémon
 *  @see Pokemon
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
     * Catégorie actuelle
     * @type {String}
     */
    #category;

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
        this.#search = "";
        this.#searchedCache = null;
        this.#category = "all";
    }

    /**
     * Récupère la liste de pokémon depuis l'API
     */
    async fetchPokemons() {
        if (this.#pokemons.length > 0) {
            return;
        }

        await pokeFetch(`pokemon/?limit=${Pokedex.#NUMBER_OF_POKEMONS}`)
            .then(json => json.results)
            .then(results => {
                results.forEach((pokemon, id) => this.#pokemons.push(
                    // +1 car l'id commence à 1
                    new Pokemon(id+1, pokemon.name)
                ))
            });
    }

    /**
     * Récupère le pokémon correspondant à l'id
     * @param {Number} id 
     * @returns 
     */
    getPokemon(id) {
        return this.#pokemons.filter(pokemon => pokemon.id == id)[0];
    }

    /**
     * @returns {Array} Liste de Pokemon
     * @see Pokemon
     */
    getPokemons() {
        let pokemons = this.#pokemons;

        if (this.#category === "favorite") {
            pokemons = pokemons.filter(pokemon => pokemon.isFavorite);
        }

        if (this.#search) {
            if (!this.#searchedCache) {
                this.#searchedCache = pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(this.#search.toLowerCase()));
            }
            return this.#searchedCache;
        }
        return pokemons;
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
     * @returns {Array} Liste des Pokémon Favoris
     */
    getFavoritesPokemon() {
        return this.#pokemons.filter(pokemon => pokemon.isFavorite);
    }

    /**
     * Change la catégorie actuelle
     */
    cycleCategories() {
        this.#category = this.#category === "all" ? "favorite" : "all";
        this.#searchedCache = null;
        this.#page = 0;
    }

    /**
     *  @param {Pokemon} pokemon Pokemon à sélectionner
     */
    select(pokemon) {
        if (!pokemon) {
            this.#selection = null;
            return;
        }
        this.#selection = pokemon.id;
    }

    /**
     * Retourne vrai si le pokémon est favoris
     * @param {Number} id 
     * @returns {Boolean}
     */
    isFavorite(id) {
        return this.getPokemon(id).isFavorite;
    }

    /**
     * Retire un pokémon de la liste des favoris
     * @param {Number} id 
     */
    removeFavorite(id) {
        this.getPokemon(id).isFavorite = false;
        this.saveFavorites();
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

    /**
     * Met à jour la recherche actuelle
     * @param {String} research 
     */
    search(research) {
        this.#search = research;
        this.#searchedCache = null;
        this.#page = 0;
    }

    /**
     * Renvoie la catégorie actuelle
     * Peut être soit "all" soit "favorite"
     * @returns {"all"|"favorite"} Catégorie actuelle
     */
    get category() {
        return this.#category;
    }

    /**
     * Ajoute un pokemon à la liste des Pokemon favorite
     * @param {Number} idPokemon Pokemon à ajouter 
     */
    addFavorite(idPokemon){
        this.getPokemon(idPokemon).isFavorite = true;
        this.saveFavorites();
    }

    /**
     * Sauvegarde les pokemon favoris
     */
    saveFavorites(){
        localStorage.setItem("favorites", JSON.stringify(this.#pokemons.filter(pokemon => pokemon.isFavorite).map(pokemon => pokemon.id)));
    }

    /**
     * Reccupère les pokémon favoris sauvegarder
     */
    loadFavorites(){
        const favorites = localStorage.getItem("favorites");
        if (!favorites) {
            return;
        }

        JSON.parse(favorites).forEach(pokemonId => this.getPokemon(pokemonId).isFavorite = true);
    }
}

export default Pokedex;