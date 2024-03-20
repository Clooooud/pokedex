import Pokedex from "./model/pokedex.js";
import Pokemon from "./model/pokemon.js";

const pokelist = document.getElementById("poke-list");
const pageSpan = document.getElementById("page");
const searchInput = document.getElementById("searchBar");

const pokemonToRow = (pokemon) => {
    const listElement = document.createElement("div");
    const nameElement = document.createElement("p");
    const imgElement = document.createElement("img");

    imgElement.src = pokemon.imageLink;
    nameElement.innerHTML = pokemon.name.substring(0, 1).toUpperCase() + pokemon.name.substring(1);

    listElement.append(imgElement);
    listElement.append(nameElement);
    listElement.onclick = () => {
        updateInfo(pokemon.id);
    };
    return listElement;
};

const updateList = (pokemonList = pokedex.getPokemonsOnPage()) => {
    pokelist.innerHTML = "";
    pokemonList.forEach(async pokemon => {
        await pokemon.fetchName();
        pokelist.append(pokemonToRow(pokemon));
    });
    pageSpan.innerHTML = (pokedex.page + 1) + "/" + (pokedex.getPageMax() + 1);
};

const updateInfo = async (id) => {
    const pokemon = pokedex.getPokemon(id);
    await pokemon.fetchInfo();
    document.getElementById("poke-info").classList.remove("hide");
    document.getElementById("poke-img").src = pokemon.sprites["front"];
    document.getElementById("poke-name").innerHTML = pokemon.name;
    
    document.getElementById("types").innerHTML = "";
    pokemon.types.map(type => {
        const img = document.createElement("img");
        img.src = type.imageLink;
        return img;
    }).forEach(element => document.getElementById("types").append(element));
}

const pokedex = new Pokedex();

window.loadPokemons = async () => {
    await pokedex.fetchPokemons();
    updateList();
};

window.search = () => {
    pokedex.search(searchInput.value)
    updateList();
}

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

const oldFetch = window.fetch;

window.fetch = async (url)=>{
    const item = localStorage.getItem(url);
    if (item){
        return JSON.parse(item);
    }

    const result = await (await oldFetch(url)).json();
    localStorage.setItem(url, JSON.stringify(result));
    return result;
}

new Pokemon(1).fetchInfo();