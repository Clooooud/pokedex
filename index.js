import Pokedex from "./model/pokedex.js";

const pokelist = document.getElementById("pokelist");
const pageSpan = document.getElementById("page");

const pokemonToRow = (pokemon) => {
    const listElement = document.createElement("li");
    const nameElement = document.createElement("p");
    const imgElement = document.createElement("img");

    imgElement.src = pokemon.getImageLink();
    nameElement.innerHTML = pokemon.getName().substring(0, 1).toUpperCase() + pokemon.getName().substring(1);

    listElement.append(imgElement);
    listElement.append(nameElement);
    return listElement;
};

const updateList = () => {
    pokelist.innerHTML = "";
    pokedex.getPokemonsOnPage().forEach(pokemon => pokelist.append(pokemonToRow(pokemon)));
    pageSpan.innerHTML = (pokedex.getPage() + 1).toString() + "/" + (pokedex.getPageMax() + 1).toString();
};

const pokedex = new Pokedex();
window.loadPokemons = async () => {
    await pokedex.fetchPokemons();
    updateList();
};

window.next = () => {
    if (pokedex.changePage(1)) {
        updateList();
    }
}

window.previous = () => {
    if (pokedex.changePage(-1)) {
        updateList();
    }
}