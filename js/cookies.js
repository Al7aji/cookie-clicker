function initRightSide() {
    const clickerSound = [
        new Audio('../assets/Sound/bigcookie.mp3'),
        new Audio('../assets/Sound/buy.mp3'),
    ];
    class Click_Upgrades {
        constructor(name, buttonId, Price, efficienty, autoclicke) {
            this.name = name;
            this.button = document.getElementById(buttonId);
            this.Price = Price;
            this.price = Price;
            this.efficienty = efficienty;
            this.autoclicke = autoclicke;
            this.counts = 0;
            this.button.addEventListener('click', () => {
                this.buy()

            });
        }

        buy() {
            if (game.totalCookies >= this.price) {
                game.totalCookies -= this.price;
                this.counts++;

                clickerSound.currentTime = 0; // Reset sound to start
                clickerSound[1].play(); // Play buy sound

                // Increase the price by 90%
                this.price = Math.ceil(this.price * 1.90);

                // Increase the cpsGain of the associated autoclicker
                this.autoclicke.cpsGain *= this.efficienty;

                // Recalculate total cookies per second
                game.cookiesPerSecond = 0;
                game.Autoclicker.forEach(auto => {
                    game.cookiesPerSecond += auto.cpsGain * auto.count;
                });
                // Update the button text to reflect new price and owned count
                game.updateUi();

                Game.saveGame();


            } else {
                alert("Not enough cookies! 🍪")
            };
        }

    }




    class Autoclicker {
        constructor(name, buttonId, basePrice, cpsGain) {
            this.name = name;
            this.button = document.getElementById(buttonId);
            this.price = basePrice;
            this.cpsGain = cpsGain;
            this.count = 0;

            this.button.innerText = `${this.name}\nPrice: ${this.price} 🍪\nOwned: ${this.count}`;
            this.button.addEventListener('click', () =>
                this.buy()

            );
        }

        buy() {
            if (game.totalCookies >= this.price) {
                game.totalCookies -= this.price;
                this.count++;
                game.cookiesPerSecond += this.cpsGain;
                clickerSound.currentTime = 0;
                clickerSound[1].play();
                this.price = Math.ceil(this.price * 1.15);
                game.updateUi();
                this.updateButton();
                Game.saveGame();
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
            this.totalCookies = 100;
            this.cookiesPerSecond = 0;
            this.bigCookie = document.getElementById("bigCookie");
            this.cookieDisplay = document.getElementById("cookie");
            this.cpsDisplay = document.getElementById("cookiesPerSecond");
            this.perclick = 1;

            this.Autoclicker = [
                new Autoclicker("Grandma", "uniecke1", 99, 4),
                new Autoclicker("Farm", "uniecke2", 500, 10),
                new Autoclicker("Mine", "uniecke3", 2500, 25),
                new Autoclicker("Factory", "uniecke4", 10000, 100),
                new Autoclicker("Bank", "uniecke5", 50000, 500),

            ];

            this.Click_Upgrades = [
                new Click_Upgrades("MineUp", "upgrade3", 10, 2, this.Autoclicker[5]),
                new Click_Upgrades("GrandmaUp", "upgrade8", 50, 2, this.Autoclicker[0]),


            ];

            this.bigCookie.addEventListener('click', () => {
                this.totalCookies += this.perclick;
                this.updateUi();

                // Reset sound to start
                clickerSound.currentTime = 0;
                // Play click sound 
                clickerSound[0].play();
                this.bigCookie.style.transform = "scale(1.1)";
                setTimeout(() => {
                    this.bigCookie.style.transform = "scale(1)";
                }, 90);
                this.saveGame();

            });



            setInterval(() => this.produceCookies(), 1000);
            this.updateUi();
            this.loadGame();
            setInterval(() => this.save(), 10000);
        }

        produceCookies() {
            this.totalCookies += this.cookiesPerSecond;
            this.updateUi();
        }

        updateUi() {
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

        saveGame() {
            const gameState = {
                totalCookies: this.totalCookies,
                cookiesPerSecond: this.cookiesPerSecond,
                autoclickers: this.Autoclicker.map(auto => ({
                    name: auto.name,
                    price: auto.price,
                    cpsGain: auto.cpsGain,
                    count: auto.count
                })),
                clickUpgrades: this.Click_Upgrades.map(upg => ({
                    name: upg.name,
                    price: upg.price,
                    counts: upg.counts
                }))
            };
            localStorage.setItem('cookieClickerSave', JSON.stringify(gameState));
        }
        loadGame() {
            const savedGame = JSON.parse(localStorage.getItem('cookieClickerSave'));
            if (savedGame) {
                this.totalCookies = savedGame.totalCookies;
                this.cookiesPerSecond = savedGame.cookiesPerSecond;
                savedGame.autoclickers.forEach((savedAuto, index) => {
                    const auto = this.Autoclicker[index];
                    auto.price = savedAuto.price;
                    auto.cpsGain = savedAuto.cpsGain;
                    auto.count = savedAuto.count;
                    auto.updateButton();
                });
                savedGame.clickUpgrades.forEach((savedUpg, index) => {
                    const upg = this.Click_Upgrades[index];
                    upg.price = savedUpg.price;
                    upg.counts = savedUpg.counts;
                });

                this.updateUi();

            }
        }
    }




    class SpacialEvent  {
        constructor (game) {
            this.game = game;
        }

    doubleProduction () {
        const originalRate = this.game.cookiesPerSecond;
        const showMessage = this.showMessage;
        this.game.cookiesPerSecond *= 2;
         this.showMessage("⚡ Double production activated for 10 seconds!");
        
        setTimeout(() => {
            this.game.cookiesPerSecond = originalRate;
            this.showMessage("⚡ Double production ended.");
        }, 10000);

       
    }
     showMessage(text, duration= 3000){
            const messageBox = document.querySelector(".event_message");
            if (!messageBox) return; 


            messageBox.innerText = text;
            messageBox.style.display= "block";

        setTimeout(()=>{
             messageBox.style.display= "none";

            }, duration);
        }
    
}

class GoldenCookie {
   constructor(game) {
        this.game = game;
        this.event = new SpacialEvent(game);
        this.active = false;
        this.spawnInterval();
    }

    spawnInterval() {
        setInterval(() => this.spawn(), 30000);
    }

    spawn() {
        if (this.active) return;
        this.active = true;

        const x = Math.random() * 80 + 10;
        const y = Math.random() * 80 + 10;

        const cookie = document.createElement("div");
        cookie.classList.add("golden-cookie"  ) ;
        cookie.style.left = x + "%";
        cookie.style.top = y + "%";
        document.body.appendChild(cookie);

        cookie.addEventListener("click", () => {
            this.collect(cookie);
        });

        setTimeout(() => {
            if (this.active) {
                cookie.remove();
                this.active = false;
            }
        }, 5000);
    }

    collect(cookie) {
        cookie.remove();
        this.active = false;
        this.event.doubleProduction();
    }
}
    window.game = new Game();
    const goldenCookieEvent = new GoldenCookie(window.game);
    goldenCookieEvent.spawnInterval(); 
    
}









