//tg
let usr_id;
let recordik;

const Http = new XMLHttpRequest();


//board
let board;
let boardWidth = window.innerWidth;
let boardHeight = window.innerHeight;
let context;
let show = false;

//bird
let birdWidth = 34; //width/height ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;
let listik;

//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;




//start button
let startBtn = document.createElement("img");
startBtn.id = 'start';
startBtn.src = './start.png';
startBtn.width = 180;
startBtn.height = 100;
startBtn.style.marginTop = `${boardHeight / 6 * 5 - 50}px`;
startBtn.style.borderRadius = "10px";
startBtn.style.left = `${boardWidth / 2 - 150}px`;

//leaders_list_btn button
let leaders_list_btn = document.createElement("img");
leaders_list_btn.id = 'leadListBtn';
leaders_list_btn.src = './menu.png';
leaders_list_btn.style.top = "0px";
// leaders_list_btn.style.left = "0px";
leaders_list_btn.style.marginTop = `${boardHeight / 6 * 5 - 50}px`;
leaders_list_btn.style.left = `${boardWidth / 2 + 50}px`
leaders_list_btn.style.borderRadius = "10px";

//logo
let welcomeImg = document.createElement("img");
welcomeImg.id = "logo";
welcomeImg.src = "./logo1.png";
welcomeImg.width = window.innerWidth - 20;
welcomeImg.height = 200;
welcomeImg.style.marginTop = `100px`;
welcomeImg.style.left = `${window.innerWidth/2 - welcomeImg.width/2}px`

async function show_list() {
    if (show == false) {
        show = true;
        let liders;
        await fetch('/api/get_liders')
            .then(response => response.json())
            .then(Liders => {
                liders = Liders
            })

        listik = document.createElement("div");
        listik.style.width = `${window.innerWidth - 40}px`;

        listik.id = "listik"
        listik.style.top = "0px"
        listik.style.left = `${boardWidth / 2 - window.innerWidth /2 + 20}px`;
        listik.style.marginTop = `15px`
        listik.style.height = `${boardHeight / 6 * 5 - 100}px`;

        let listik_logo = document.createElement("div");
        listik_logo.id = "listikLogo";
        listik_logo.innerHTML = "LEADERS";
        listik.appendChild(listik_logo)
        document.body.appendChild(listik);

        if (document.getElementById("logo")) {
            document.body.removeChild(welcomeImg);
        }

        let i = 0;
        while (i < liders.length) {
            let user_line = document.createElement("div");
            user_line.id = "usr";

            let user_name = document.createElement("div");
            user_name.id = "user_name";
            user_name.innerHTML = liders[i].name;
            user_line.appendChild(user_name);
            let ash = document.createElement("div");
            user_line.appendChild(ash);


            let user_record = document.createElement("div");
            user_record.id = "usrRec"
            user_record.innerHTML = liders[i].record;
            user_line.appendChild(user_record)
            listik.appendChild(user_line);
            i++;
        }
    } else {
        document.body.removeChild(listik);
        if (!document.getElementById("restart")) {
            document.body.appendChild(welcomeImg);
        }
        show = false;
    }


}

function addRestart() {

    document.removeEventListener("click", moveBird)
    leaders_list_btn.style.left = `${boardWidth / 2 + 85}px`

    let restartBtn = document.createElement("img");
    restartBtn.id = 'restart';
    restartBtn.src = './restart.png';
    restartBtn.width = 250;
    restartBtn.height = 100;
    restartBtn.style.marginTop = `${boardHeight / 6 * 5 - 50}px`;
    restartBtn.style.left = `${boardWidth / 2 - 180}px`;
    restartBtn.style.borderRadius = "10px"
    restartBtn.addEventListener("click", () => {
        document.body.removeChild(restartBtn);
        document.body.removeChild(leaders_list_btn);
        if (document.getElementById("listik")) {
            document.body.removeChild(listik);
            show = false
        }
        document.addEventListener("click", moveBird);

    })

    document.body.appendChild(restartBtn);
    document.body.appendChild(leaders_list_btn);

}


function start() {
    document.body.style.paddingTop = "0px";
    const tg = window.Telegram.WebApp;
    usr_id = tg.initDataUnsafe.user.id;

    fetch(`/api/${usr_id}/${tg.initDataUnsafe.user.first_name + tg.initDataUnsafe.user.last_name}/${tg.initDataUnsafe.user.username}/`)
        .then(response => response.json())
        .then(record => {
            recordik = record
        });

    board = document.createElement("canvas");
    board.id = "board";
    board.height = boardHeight;
    board.width = boardWidth;

    document.body.appendChild(board);
    document.body.removeChild(startBtn);
    document.body.removeChild(leaders_list_btn);
    if (document.getElementById("listik")) {
        document.body.removeChild(listik)
        show = false;
    }

    if (document.getElementById("logo")) {
        document.body.removeChild(welcomeImg);
    }

    context = board.getContext("2d");

    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //every 1.5 seconds
    document.addEventListener("click", moveBird);
    document.addEventListener("wheel", (e) => {
        e.preventDefault()
        e.stopPropagation()
    });
}


window.onload = function() {
    document.body.appendChild(startBtn);
    document.body.appendChild(leaders_list_btn);
    document.body.appendChild(welcomeImg);

    leaders_list_btn.addEventListener("click", () => {
        show_list();
    })
    startBtn.addEventListener("click", () => {
        start();
    })
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y, limit the bird.y to top of the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //removes first element from the array
    }

    //score
    context.fillStyle = "white";
    context.font="45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
        addRestart();

        if (score > recordik) {
            recordik = score;
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


function placePipes() {
    if (gameOver) {
        return;
    }

    //(0-1) * pipeHeight/2.
    // 0 -> -128 (pipeHeight/4)
    // 1 -> -128 - 256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    // if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
    //     //jump
    //     velocityY = -6;
    //
    //     //reset game
    //     if (gameOver) {
    //         bird.y = birdY;
    //         pipeArray = [];
    //         score = 0;
    //         gameOver = false;
    //     }
    // }

    //jump
    velocityY = -6;

    //reset game
    if (gameOver) {
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}