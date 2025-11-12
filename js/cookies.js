const { console } = require("inspector");


function initRightSide() {
      const clickerSound = [
        new Audio('../assets/Sound/bigcookie.mp3'),  
        new Audio('../assets/Sound/buy.mp3'),
      ];
      class Click_Upgrades{
        constructor( name, buttonId, Price,efficienty,autoclicke) {
            this.name = name;
            this.button = document.getElementById(buttonId);
            this.Price = Price;
            this.price = Price;
            this.efficienty = efficienty;
            this.autoclicke = autoclicke;
            this.counts = 0;

            this.button.addEventListener('click', () =>{ //
                this.buy() 
             
        }); 
      }

        buy() {
            if (game.totalCookies >= this.price ) {
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


             }else { 
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

            this.button.addEventListener('click', () => this.buy());    


            
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

    class Themas{
        constructor( buttonId,autoclicke) {
            this.button = document.getElementById(buttonId);
            this.autoclicke = autoclicke;
            this.button.style.display = "none";                           
    }

      
        update(){
            if (this.autoclicke.count >= 1) {
                this.button.style.display = "block";
            } else {
                this.button.style.display = "none";
            }
        } 
             
    }


    class Game {
        constructor() {
            this.totalCookies = 10000; 
            this.cookiesPerSecond = 0;
            this.perclick = 1;
            this.bigCookie = document.getElementById("bigCookie");
            this.cookieDisplay = document.getElementById("cookie");
            this.cpsDisplay = document.getElementById("cookiesPerSecond");
            this.saveButton = document.getElementById("saveButton");
            this.loadButton = document.getElementById("loadButton");
            this.skinEen = document.getElementById("skin1");
            this.skinTwee = document.getElementById("skin2");
            this.skinchoice();
            this.Autoclicker = [
                new Autoclicker("Grandma", "uniecke1", 99, 4),
                new Autoclicker("Farm", "uniecke2", 500, 10),
                new Autoclicker("Mine", "uniecke3", 2500, 25),
                new Autoclicker("Factory", "uniecke4", 10000, 100),
                new Autoclicker("Bank", "uniecke5", 50000, 500),
                
            ];

            this.Click_Upgrades = [
                new Click_Upgrades("MineUp", "upgrade3", 10, 2,this.Autoclicker[5]),
                new Click_Upgrades("GrandmaUp", "upgrade8", 50, 2, this.Autoclicker[0]),
                
                 
            ];

            this.Themas = [
                new Themas("row1", this.Autoclicker[0]),
                new Themas("row2", this.Autoclicker[1]),
                new Themas("row3", this.Autoclicker[2]),
                new Themas("row4", this.Autoclicker[3]),
                new Themas("row5", this.Autoclicker[4]),

            ];


            this.bigCookie.addEventListener('click', () => {
                this.totalCookies += this.perclick  ; 
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

            this.saveButton.addEventListener('click', () =>{ this.saveGame();
              if(this.saveGame){
                 alert("Game Saved!")
                 
                 }else{
                  alert("Game not saved.")  
                 }
                }
            );
            this.loadButton.addEventListener('click', () =>{ this.loadGame();
              if(this.loadGame) {
                alert("Game Loaded!")
              }else{
                alert("No saved game found.")
              }
                }
              
            );
        };

        skinchoice(){ 
            this.img = this.bigCookie.querySelector('img');
            const skins = {
                een: "./assets/Images/BigCooki2.webp",
                twee: "./assets/Images/BigCookie.png"
            };

            this.skinEen?.addEventListener('click', () => {
                this.img.src = skins.een;
            });

            this.skinTwee?.addEventListener('click', () => {
                this.img.src = skins.twee;
            });
        
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
            this.Themas.forEach((t) => t.update());
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
    window.game = new Game();
}
 