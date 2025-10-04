function initRightSide() {
    class Upgrade {
        constructor(name, buttonId, basePrice, cpsGain) {
            this.name = name;
            this.button = document.getElementById(buttonId);
            this.basePrice = basePrice;
            this.price = basePrice;
            this.cpsGain = cpsGain;
            this.count = 0;

            this.button.innerText = `${this.name}\nPrice: ${this.price} 🍪\nOwned: ${this.count}`;
            this.button.addEventListener('click', () => this.buy());
        }

        buy() {
            if (game.totalCookies >= this.price) {
                game.totalCookies -= this.price;
                this.count++;
                game.cookiesPerSecond += this.cpsGain;

                this.price = Math.ceil(this.price * 1.15); 
                game.updateDisplay();
                this.updateButton();
            } else {
                alert("Not enough cookies! 🍪");
            }
        }

        updateButton() {
            this.button.innerText = `${this.name}\nPrice: ${this.price} 🍪\nOwned: ${this.count}`;
        }
    }

    class Game {
        constructor() {
            this.totalCookies = 1000;
            this.cookiesPerSecond = 0;

            this.cookieDisplay = document.getElementById("cookie");
            this.cpsDisplay = document.getElementById("cookiesPerSecond");

            
            this.upgrades = [
                new Upgrade("Grandma", "uniecke1", 99, 4),
                new Upgrade("Farm", "uniecke2", 500, 10),
                new Upgrade("Mine", "uniecke3", 2500, 25),
                new Upgrade("Factory", "uniecke4", 10000, 100),
                new Upgrade("Bank", "uniecke5", 50000, 500)
            ];

            
            setInterval(() => this.produceCookies(), 1000);
            this.updateDisplay();
        }

        produceCookies() {
            this.totalCookies += this.cookiesPerSecond;
            this.updateDisplay();
        }

        updateDisplay() {
            if (this.cookieDisplay) {
                const cps = this.cookieDisplay.querySelector("#cookiesPerSecond");
                this.cookieDisplay.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) node.remove();
                });
                this.cookieDisplay.insertBefore(
                    document.createTextNode(`${this.totalCookies} Cookies 🍪`),
                    cps
                );
            }
            if (this.cpsDisplay) {
                this.cpsDisplay.innerText = `PerSecond: ${this.cookiesPerSecond}`;
            }
        }
    }

    window.game = new Game();
}
