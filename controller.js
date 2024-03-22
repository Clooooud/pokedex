import Pokedex from "./model/pokedex.js";
import view from "./view.js";

class Controller {

    #pokedex;

    constructor() {
        this.#pokedex = new Pokedex();
    }

    async load() {
        await this.#pokedex.fetchPokemons();
        this.updateList();
    }

    updateList() {
        const pokemonsOnPage = this.#pokedex.getPokemonsOnPage();
        console.log(pokemonsOnPage)
        for (let buttonId in view.keyboard.children) {
            const button = view.keyboard.children[buttonId];
            button.innerHTML = "";

            if (buttonId > pokemonsOnPage.length) {
                continue;
            }

            const img = document.createElement("img");
            img.src = pokemonsOnPage[buttonId].imageLink;

            button.append(img);
        }
    }
}

window.pokeFetch = async (url) => {
    const item = localStorage.getItem(url);
    if (item){
        return JSON.parse(item);
    }

    const result = await (await fetch(url)).json();
    localStorage.setItem(url, JSON.stringify(result));
    return result;
}

new Controller().load();