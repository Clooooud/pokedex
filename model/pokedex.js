import Pokemon from "./pokemon.js";

/**
 *  Un pokédex contient la page du pokémon sélectionné ainsi qu'une liste de pokémon
*/ 
class Pokedex {

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
    
    constructor() {
        this.#pokemons = [];
        this.#selection = null;
    }

    async fetchPokemons() {
        await fetch("https://pokeapi.co/api/v2/pokemon/?limit=1025")
            .then(response => response.json())
            .then(json => json.results)
            .then(results => {
                results.forEach((pokemon, id) => {
                    // const listElement = document.createElement("li");
                    // const nameElement = document.createElement("p");
                    // const imgElement = document.createElement("img");

                    // imgElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id+1}.png`;
                    // nameElement.innerHTML = pokemon.name;

                    // listElement.append(imgElement);
                    // listElement.append(nameElement);
                    // pokelist.append(listElement);
                    this.#pokemons.push(new Pokemon(id+1, pokemon.name));
                })
            });
    }

    /**
     * @returns {Array} Liste de pokémon
     */
    getPokemons() {
        return this.#pokemons;
    }
}

export default Pokedex;