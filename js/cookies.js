

function initRightSide() {
      
      class Click_Upgrades{
        constructor( name, buttonId, Price,efficienty ) {
            this.name = name;
            this.button = document.getElementById(buttonId);
            this.Price = Price;
            this.price = Price;
            this.efficienty = efficienty;
             this.counts = 0;
            this.button.addEventListener('click', () =>{
                this.buy() 
             
        });
      }

        buy() {
            if (game.totalCookies >= this.price ) {
                game.totalCookies -= this.price;
                this.counts++;

                if(this.button.id === "upgrade8"){
                   game.Autoclicker[0].cpsGain *= game.Click_Upgrades[0].efficienty
                }else if(this.button.id === "upgrade1" ){
                         game.Autoclicker[1].cpsGain *= game.Click_Upgrades[1].efficienty  
                }else if(this.button.id === "upgrade3" ){
                         game.Autoclicker[2].cpsGain *= game.Click_Upgrades[2].efficienty  
                }
                
                
                
                game.cookiesPerSecond = 0;
                    game.Autoclicker.forEach(auto => {
                        game.cookiesPerSecond += auto.cpsGain * auto.count;
                    });
                
                
               


                    game.updateUi();

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
            this.button.addEventListener('click', () => 

                this.buy()
                
        );
        }

        buy() {
            if (game.totalCookies >= this.price) {
                game.totalCookies -= this.price;
                this.count++;
                game.cookiesPerSecond += this.cpsGain;

                this.price = Math.ceil(this.price * 1.15); 
                game.updateUi();
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
            this.totalCookies = 1000 ; 
            this.cookiesPerSecond = 0;
            this.bigCookie = document.getElementById("bigCookie");
            this.cookieDisplay = document.getElementById("cookie");
            this.cpsDisplay = document.getElementById("cookiesPerSecond");
            
            
            this.Autoclicker = [
                new Autoclicker("Grandma", "uniecke1", 99, 4),
                new Autoclicker("Farm", "uniecke2", 500, 10),
                new Autoclicker("Mine", "uniecke3", 2500, 25),
                new Autoclicker("Factory", "uniecke4", 10000, 100),
                new Autoclicker("Bank", "uniecke5", 50000, 500)
            ];

            this.Click_Upgrades = [
                new Click_Upgrades("GrandmaUp", "upgrade8", 50, 2),
                new Click_Upgrades("FarmUp", "upgrade2", 150, 2)

            ];

            this.bigCookie.addEventListener('click', () => {
                this.totalCookies++; 
                this.updateUi();
                this.bigCookie.style.transform = "scale(1.1)";
                setTimeout(() => {
                    this.bigCookie.style.transform = "scale(1)";
                }, 90);
            });


            
            setInterval(() => this.produceCookies(), 1000);
            this.updateUi();
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
    }

    window.game = new Game();
}
