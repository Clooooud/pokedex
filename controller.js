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
        view.closeSearchButton.addEventListener("click", () => this.#clearSearch());

        view.searchButton.addEventListener("click", () => this.#search());

        view.previousButton.addEventListener("click", () => this.#changePage(-1));
        view.nextButton.addEventListener("click", () => this.#changePage(1));

        view.favoriteCategoryButton.addEventListener("click", () => this.#goToFavorites());
        view.mainCategoryButton.addEventListener("click", () => this.#goToMainMenu());

        view.favoriteButton.addEventListener("click", () => this.#addToFavorites());

        for (let buttonId = 0; buttonId < view.keyboard.children.length; buttonId++) {
            const button = view.keyboard.children[buttonId];
            button.addEventListener("click", () => this.#selectPokemon(buttonId));
        }
    }

    #clearSearch() {
        view.searchInput.value = "";
        this.#pokedex.search(null);
        this.#updatePageDisplay();
        this.#updateList();
    }

    #search() {
        this.#pokedex.search(view.searchInput.value);
        this.#updatePageDisplay();
        this.#updateList();
    }
    
    #changePage(offset) {
        this.#pokedex.changePage(offset);
        this.#updatePageDisplay();
        this.#updateList();
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
        // Nom du Pokémon
        let namePokemon = document.createElement("p");
        namePokemon.innerHTML = pokemon.name;
        namePokemon.style.textAlign = "center";
        namePokemon.style.textTransform = "uppercase";
        div.append(namePokemon);

        // Sprites du Pokémon
        let divImages = document.createElement("div");
        console.log(pokemon.sprites);
        
        let image1 = document.createElement("img");
        image1.src = pokemon.sprites.front; 
        divImages.append(image1);
        
        let image2 = document.createElement("img");
        image2.src = pokemon.sprites.back;
        
        divImages.style.display = "flex";
        divImages.style.justifyContent = "space-evenly";
        divImages.append(image2);
        div.append(divImages);

        // Types du Pokémon
        let divTypes = document.createElement("div");
        console.log(pokemon.types);
        pokemon.types.forEach(type =>{
            let imageType = document.createElement("img");
            imageType.src = type.imageLink();
            divTypes.append(imageType);
        });
        div.append(divTypes);

        


        view.screen.append(div);
    }
}

/**
 * Récupère les données de l'API et les stocke dans le localStorage
 * Différence avec le fetch classique : on récupère directement le contenu sous format json et on le stocke dans le localStorage
 * 
 * On stocke le json avec pour clé l'url de la requête, on peut donc retrouver très facilement les données
 * 
 * @param {String} url 
 * @returns 
 */
window.pokeFetch = async (url) => {
    const item = localStorage.getItem(url);
    if (item){
        return JSON.parse(item);
    }

    const result = await fetch(url).then(response => response.json());
    localStorage.setItem(url, JSON.stringify(result));
    return result;
}

new Controller().init();