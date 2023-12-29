let currMoleTile;
let currPlantTile;
let score = 0;
let gameOver = false;
let usr_id;
let recordik;

const Http = new XMLHttpRequest();

window.onload = function() {
    setGame();
}


function setGame() {
    const tg = window.Telegram.WebApp;
    usr_id = tg.initDataUnsafe.user.id;
    fetch(`/api/${usr_id}`)
        .then(response => response.json())
        .then(record => {
            recordik = record
            console.log(recordik)
        })
    //set up the grid in html
    for (let i = 0; i < 9; i++) { //i goes from 0 to 8, stops at 9
        //<div id="0-8"></div>
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }
    setInterval(setMole, 700); // 1000 miliseconds = 1 second, every 1 second call setMole
    setInterval(setPlant, 1500); // 2000 miliseconds = 2 seconds, every 2 second call setPlant
}

function getRandomTile() {
    //math.random --> 0-1 --> (0-1) * 9 = (0-9) --> round down to (0-8) integers
    let num = Math.floor(Math.random() * 9);
    return num.toString();
}

function setMole() {
    if (gameOver) {
        return;
    }
    if (currMoleTile) {
        currMoleTile.innerHTML = "";
    }
    let mole = document.createElement("img");
    mole.src = "./monty-mole.png";

    let num = getRandomTile();
    if (currPlantTile && currPlantTile.id == num) {
        return;
    }
    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole);
}

function setPlant() {
    if (gameOver) {
        return;
    }
    if (currPlantTile) {
        currPlantTile.innerHTML = "";
    }
    let plant = document.createElement("img");
    plant.src = "./piranha-plant.png";

    let num = getRandomTile();
    if (currMoleTile && currMoleTile.id == num) {
        return;
    }
    currPlantTile = document.getElementById(num);
    currPlantTile.appendChild(plant);
}

function selectTile() {
    if (gameOver) {
        return;
    }
    if (this == currMoleTile) {
        score += 10;
        document.getElementById("score").innerText = score.toString(); //update score html
    }
    else if (this == currPlantTile) {
        document.getElementById("score").innerText = "GAME OVER: " + score.toString(); //update score html
        gameOver = true;
        if (score > recordik) {
            let url;
            fetch(`/api/set_record/${usr_id}/${score}`);

            if (recordik != 0) {
                url = `https://api.telegram.org/bot6602794619:AAEspg2Ru9CL3XvUInibD_uVBrTLVepmpZc/sendMessage?chat_id=${usr_id}&text=You scored ${score.toString()}, you beat your previous record.`
            } else {
                url = `https://api.telegram.org/bot6602794619:AAEspg2Ru9CL3XvUInibD_uVBrTLVepmpZc/sendMessage?chat_id=${usr_id}&text=You scored ${score.toString()}`
            }

            Http.open("GET", url);
            Http.send();
        } else {
            Http.open("GET", `https://api.telegram.org/bot6602794619:AAEspg2Ru9CL3XvUInibD_uVBrTLVepmpZc/sendMessage?chat_id=${usr_id}&text=You scored ${score.toString()}, your record is ${recordik}`);
            Http.send();
        }
    }
}