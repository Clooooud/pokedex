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

    #updatePageDisplay() {
        view.pageDisplay.innerHTML = `${this.#pokedex.page + 1}/${this.#pokedex.getPageMax() + 1}`;
    }

    #listenEvents() {
        // Fermeture de la recherche
        view.closeSearchButton.addEventListener("click", () => {
            view.searchInput.value = "";
            this.#pokedex.search(null);
            this.#updatePageDisplay();
            this.#updateList();
        });

        // Recherche
        view.searchButton.addEventListener("click", () => {
            this.#pokedex.search(view.searchInput.value);
            this.#updatePageDisplay();
            this.#updateList();
        });

        // Bouton pour changer de page
        view.previousButton.addEventListener("click", () => {
            this.#pokedex.changePage(-1);
            this.#updatePageDisplay();
            this.#updateList();
        });
        view.nextButton.addEventListener("click", () => {
            this.#pokedex.changePage(1);
            this.#updatePageDisplay();
            this.#updateList();
        });

        view.favoriteCategoryButton.addEventListener("click", () => this.#goToFavorites());
        view.mainCategoryButton.addEventListener("click", () => this.#goToMainMenu());

        view.favoriteButton.addEventListener("click", () => this.#addToFavorites());

        for (let buttonId = 0; buttonId < view.keyboard.children.length; buttonId++) {
            const button = view.keyboard.children[buttonId];
            button.addEventListener("click", () => this.#selectPokemon(buttonId));
        }
    }

    #selectPokemon(buttonId) {
        const pokemon = this.#pokedex.getPokemonsOnPage()[buttonId];

        if (pokemon === undefined) {
            return;
        }

        if (this.#pokedex.selection !== pokemon.id) {
            this.#pokedex.select(pokemon);
        } else {
            this.#pokedex.select(null);
        }

        this.#updateList();
        this.#updateScreen();
    }

    #goTo(button) {
        const toggled = document.querySelector("#category-div .toggled");

        if (toggled === button) {
            return;
        }    

        toggled?.classList.remove("toggled");
        button.classList.add("toggled");
        this.#pokedex.cycleCategories();
        this.#updatePageDisplay();
        this.#updateList();
    }

    #goToFavorites() {
        this.#goTo(view.favoriteCategoryButton);
    }

    #goToMainMenu() {
        this.#goTo(view.mainCategoryButton);
    }

    #addToFavorites() {
        if (this.#pokedex.selection === null) {
            return;
        }

        if (this.#pokedex.isFavorite(this.#pokedex.selection)) {
            this.#pokedex.removeFavorite(this.#pokedex.selection);
            if (this.#pokedex.category === "favorite") {
                this.#selectPokemon(this.#pokedex.selection);
            }
        } else {
            this.#pokedex.addFavorite(this.#pokedex.selection);
        }

        this.#updateList();
        this.#updateScreen();
    }

    async #load() {
        await this.#pokedex.fetchPokemons();
        this.#pokedex.loadFavorites();
        this.#updateList();
    }

    #updateList() {
        const pokemonsOnPage = this.#pokedex.getPokemonsOnPage();
        for (let buttonId = 0; buttonId < 20; buttonId++) {
            const button = view.keyboard.children[buttonId];
            button.innerHTML = "";
            button.classList.remove("selected");

            if (buttonId >= pokemonsOnPage.length) {
                continue;
            }

            const img = document.createElement("img");
            img.src = pokemonsOnPage[buttonId].imageLink;

            if (this.#pokedex.selection === pokemonsOnPage[buttonId].id) {
                button.classList.add("selected");
            }

            button.append(img);
        }
    }

    #updateScreen(){
        view.screen.innerHTML = "";
        
        if (this.#pokedex.selection === null) {
            view.idScreen.innerHTML = "";
            view.favoriteButton.classList.remove("toggled");
            view.favoriteButton.innerHTML = "♡";
            return;
        }

        view.idScreen.innerHTML = "N°" + this.#pokedex.selection;
        view.favoriteButton.innerHTML = this.#pokedex.isFavorite(this.#pokedex.selection) ? "❤️" : "♡";

        const pokemon = this.#pokedex.getPokemon(this.#pokedex.selection);

        let div = document.createElement("div");
        let p = document.createElement("p");
        p.innerHTML = pokemon.name;
        div.append(p);
        view.screen.append(div);
        
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