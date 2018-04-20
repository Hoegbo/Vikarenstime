var canvas = document.getElementById('tegnebrett');

var width = window.innerWidth;
var height = window.innerHeight;

canvas.setAttribute('width', width);
canvas.setAttribute('height', height);

var context = canvas.getContext('2d');


document.addEventListener('keydown', moveFrogger)
document.addEventListener('keyup', function () {
    keyPress = false;
});

// document.getElementById('GodMode').addEventListener('change', function (event) {
//   if (event.target.value == "1") {
//     GodMode = true;
//   } else {
//     GodMode = false;
//   }
// });

var GodMode = false;

var GameSpeed = 30;
var numberOfFiles = 40;
var totalCells = 40;
var numberOfCarsPerFile = 5;
var keyPress = false;
var HeightOfFile = Math.floor(height / (numberOfFiles + 2));

var frog = {
    horizontal: Math.floor(width / 2),
    vertical: numberOfFiles,
    alive: true,
    size: HeightOfFile
}

var Cars = [];
generateCars();

function generateCars() {
    Cars = [];

    for (var i = 0; i < numberOfFiles; i++) {
        for (var a = 0; a < numberOfCarsPerFile; a++) {
            addCar(i)
        }
    }
}

function addCar(i) {
    if (Cars.length > (numberOfFiles * numberOfCarsPerFile)) {
        return false;
    }
    var direction;
    if (i || i == 0) {
        direction = i % 2 != 0 ? "right" : "left";
    }

    var horizontal = Math.floor(Math.random() * width);

    if (!i && i != 0) {

        // hvis jeg ikke mottar i som en parameter, så ønsker jeg de skal starte fra kanten. 
        // men må også finne ut hvilken rad jeg skal legge dem til.

        i = Math.floor(Math.random() * numberOfFiles);
        direction = i % 2 != 0 ? "right" : "left";
        horizontal = direction == 'right' ? 0 : width;
    }

    var vertical = i;
    var Car = {
        horizontal: horizontal,
        vertical: vertical,
        // cell: document.querySelectorAll('#road tr')[vertical].childNodes[horizontal],
        direction: direction,
        speed: Math.floor(Math.random() * 1) + 1,
        lengde: (Math.floor(Math.random() * 3) + 1) * HeightOfFile
        // oldCell: null
    }
    Cars.push(Car);
}

function updateCars() {

    for (var i = Cars.length - 1; i >= 0; i--) {
        var Car = Cars[i];
        // Car.oldCell = Car.cell;

        var newHorizontal = (Car.direction == "left") ? Car.horizontal - Car.speed : Car.horizontal + Car.speed;

        if (newHorizontal < 0 - Car.lengde || newHorizontal >= width) {
            // direction = Math.floor(Math.random() * 2) == 1 ? "right" : "left";
            newHorizontal = Car.direction == "left" ? width : 0 - Car.lengde;
            // Car.direction = direction;
            Car.speed = Math.floor(Math.random() * 1) + 1;
        }


        // // kollisjonstesting
        // if (document.querySelectorAll('#road tr')[Car.vertical].childNodes[newHorizontal].className.indexOf('car') > -1) {
        //   if (document.querySelectorAll('#road tr')[Car.vertical].childNodes[newHorizontal] != Car.oldCell) {
        //     Cars.splice(i, 1);
        //     Car.oldCell.classList.remove('car', 'left', 'right');
        //     Car.oldCell.classList.add('crashed');
        //     // document.getElementById('carCount').innerText = Cars.length;
        //     continue;
        //   }
        // }

        Car.horizontal = newHorizontal;
        // Car.cell = document.querySelectorAll('#road tr')[Car.vertical].childNodes[Car.horizontal]

        // Car.cell.classList.add('car', Car.direction);
        // Car.oldCell.classList.remove('car', 'left', 'right');
        if (Car.vertical == frog.vertical) {
            var minimumX = Car.horizontal;
            var maximumX = Car.horizontal + Car.lengde;

            if (frog.horizontal > minimumX && frog.horizontal < maximumX) {
                die();
                break;
            } else if ((frog.horizontal + frog.size) > minimumX && (frog.horizontal + frog.size) < maximumX) {
                die();
                break;
            }
        }
        // if (Car.cell.className.indexOf('frog') > -1) {
        //   die();
        // }
    }

}

function drawBackground() {

    context.fillStyle = "#000000"
    context.fillRect(0, 0, width, height);

    for (var i = 1; i < numberOfFiles; i++) {
        context.fillStyle = "#FFFF00";
        context.fillRect(0, HeightOfFile + (i * HeightOfFile), width, 1);
    }
}

function drawFrog() {
    context.fillStyle = "#00FF00";
    // context.fillRect(frog.horizontal,HeightOfFile + (frog.vertical * HeightOfFile), frog.size, frog.size);
    // context.ellipse(frog.horizontal, HeightOfFile + (frog.vertical * HeightOfFile), frog.size / 2, frog.size / 2, 0, 0, 0, 0);
    
    context.beginPath();
    context.ellipse(
        frog.horizontal + (frog.size /2), 
        (HeightOfFile + (frog.vertical * HeightOfFile)) + (frog.size / 2), 
        frog.size / 2, 
        frog.size / 2, 
        45 * Math.PI / 180, 
        0, 
        2 * Math.PI);        
    context.fill();


}

function drawCars() {
    for (var i = 0; i < Cars.length; i++) {
        var Car = Cars[i];
        context.fillStyle = "#FF0000";
        context.fillRect(Car.horizontal, HeightOfFile + (Car.vertical * HeightOfFile), Car.lengde, HeightOfFile);
    }
}
updateRoads();

function updateRoads() {
    drawBackground();
    drawFrog();
    if (frog.alive == false) {
        alert("Du døde... starter på nytt");
        resetFrog();
        updateRoads();
    } else if (frog.vertical == "goal") {
        alert("Gratulerer, DU VANT! ... starter på nytt")
        resetFrog();
        updateRoads();
    } else {
        updateCars();
        drawCars();
        setTimeout(updateRoads, 1000 / GameSpeed);
    }
}

function die() {
    if (GodMode == false)
        frog.alive = false;
}

function resetFrog() {
    //   frog.oldCell.className = '';
    //   document.querySelectorAll('.frog').forEach(function (element) {
    //     element.classList.remove('frog');
    //   });

    frog = {
        horizontal: Math.floor(width / 2),
        vertical: numberOfFiles,
        alive: true,
        size: HeightOfFile
    }
}

function moveFrogger(event) {
    var keyCode = event.keyCode || event.which;

    if (keyPress == true) {
        return false;
    }
    // keyPress = true;
    console.log(event.key, event.keyCode);
    switch (keyCode) {
        case 37:
            goLeft();
            //ArrowLeft
            break;
        case 38:
            goUp();
            //ArrowUp
            break;
        case 39:
            goRight();
            //ArrowRight
            break;
        case 40:
            goDown();
            //ArrowDown
            break;
    }
}

function goUp() {
    var newVertical;
    if (frog.vertical == "start") {
        frog.vertical = numberOfFiles - 1;

    } else {
        frog.vertical--;
    }
    if (frog.vertical < 0) frog.vertical = 'goal';
    updateFrogPosition();

}

function goDown() {
    frog.vertical++;
    if (frog.vertical >= numberOfFiles) frog.vertical = numberOfFiles;
    updateFrogPosition();
}

function goLeft() {
    frog.horizontal -= frog.size;
    if (frog.horizontal < 0) frog.horizontal = width - frog.size;

    updateFrogPosition();
}

function goRight() {
    frog.horizontal += frog.size;
    if (frog.horizontal >= width) frog.horizontal = 0;

    updateFrogPosition();
}

function updateFrogPosition() {
    //   frog.oldCell = frog.cell;
    if (frog.vertical == "goal") {
        return false;
    }
    //   frog.cell = document.querySelectorAll('#road tr')[frog.vertical].childNodes[frog.horizontal]

    //   if (frog.cell.className.indexOf('car') > -1) {
    //     die();
    //   }

    for (var i = 0; i < Cars.length; i++) {
        var Car = Cars[i];
        if (Car.vertical == frog.vertical) {
            var minimumX = Car.horizontal;
            var maximumX = Car.horizontal + Car.lengde;

            if (frog.horizontal > minimumX && frog.horizontal < maximumX) {
                die();
                break;
            } else if ((frog.horizontal + frog.size) > minimumX && (frog.horizontal + frog.size) < maximumX) {
                die();
                break;
            }
        }
    }
    //   frog.cell.classList.add('frog');
    //   if (frog.oldCell != null && frog.oldCell != frog.cell) {
    //     frog.oldCell.classList.remove('frog');
    //   }
}


// legg til en ny bil hvert x millisekund
setInterval(addCar, 100);