import Pokemon from "./pokemon";

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
        this.#fetchPokemons();
    }

    #fetchPokemons() {
        fetch("https://pokeapi.co/api/v2/pokemon/?limit=1025")
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
                this.#pokemons.push(new Pokemon(id, pokemon));
            })
        });
    }

}

export default Pokedex;