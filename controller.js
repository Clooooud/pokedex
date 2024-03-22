import Pokedex from "./model/pokedex.js";
import view from "./view.js";

class Controller {

    /**
     * Pokedex
     * @type {Pokedex}
     */
    #pokedex;

    constructor() {
        this.#pokedex = new Pokedex();
    }

    init() {
        this.#listenEvents();
        this.#load();
    }

    #listenEvents() {
        view.closeSearchButton.addEventListener("click", () => {
            view.searchInput.value = "";
            this.#pokedex.search("");
            this.updateList();
        });

        view.searchButton.addEventListener("click", () => {
            this.#pokedex.search(view.searchInput.value);
            this.updateList();
        });

        view.previousButton.addEventListener("click", () => {
            this.#pokedex.changePage(-1);
            view.pageDisplay.innerHTML = `${this.#pokedex.page + 1}/${this.#pokedex.getPageMax() + 1}`;
            this.updateList();
        });

        view.nextButton.addEventListener("click", () => {
            this.#pokedex.changePage(1);
            view.pageDisplay.innerHTML = `${this.#pokedex.page + 1}/${this.#pokedex.getPageMax() + 1}`;
            this.updateList();
        });

        view.favoriteCategory.addEventListener("click",()=>{
            this.#pokedex.addFavorite(this.#pokedex.selection);
        });

        for (let buttonId = 0; buttonId < view.keyboard.children.length; buttonId++) {
            const button = view.keyboard.children[buttonId];
            button.addEventListener("click", () => {
                // Si on en a sélectionné un avant, on le désélectionne
                document.querySelector(".selected")?.classList.remove("selected");
                button.classList.add("selected");

                const pokemon = this.#pokedex.getPokemonsOnPage()[buttonId];
                this.#pokedex.select(pokemon);
                //this.updateScreen();
                view.idScreen.innerHTML = pokemon.id.toString();

            });
        }
    }

    async #load() {
        await this.#pokedex.fetchPokemons();
        this.updateList();
    }

    updateList() {
        const pokemonsOnPage = this.#pokedex.getPokemonsOnPage();
        console.log(pokemonsOnPage)
        for (let buttonId = 0; buttonId < 20; buttonId++) {
            const button = view.keyboard.children[buttonId];
            button.innerHTML = "";

            if (buttonId >= pokemonsOnPage.length) {
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

new Controller().init();