import Pokedex from "./model/pokedex.js";

const pokelist = document.getElementById("pokelist");
const pokemonToRow = (pokemon) => {
    const listElement = document.createElement("li");
    const nameElement = document.createElement("p");
    const imgElement = document.createElement("img");

    imgElement.src = pokemon.getImageLink();
    nameElement.innerHTML = pokemon.getName().toString();

    listElement.append(imgElement);
    listElement.append(nameElement);
    return listElement;
};

const pokedex = new Pokedex();
window.loadPokemons = async () => {
    await pokedex.fetchPokemons();
    pokedex.getPokemons().forEach(pokemon => {
        pokelist.append(pokemonToRow(pokemon));
    });
};