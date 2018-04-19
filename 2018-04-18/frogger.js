document.addEventListener('keydown', moveFrogger)
document.addEventListener('keyup', function () {
  keyPress = false;
});

document.getElementById('GodMode').addEventListener('change', function (event) {
  if (event.target.value == "1") {
    GodMode = true;
  } else {
    GodMode = false;
  }
});

var GodMode = false;

var GameSpeed = 30;
var numberOfFiles = 15;
var totalCells = 40;
var numberOfCarsPerFile = 5;
var keyPress = false;

var frog = {
  horizontal: Math.floor(totalCells / 2),
  vertical: "start",
  cell: null,
  oldCell: null,
  alive: true,
}
var height = Math.floor(document.querySelector('#mainTable > tbody > tr > td').clientHeight / numberOfFiles);
for (var y = numberOfFiles; y > 0; y--) {
  var thisFile = document.createElement('tr');
  for (var x = 0; x < totalCells; x++) {
    var thisCell = document.createElement('td');
    thisFile.appendChild(thisCell);
  }
  thisFile.style.height = height + 'px'
  document.getElementById('road').appendChild(thisFile);
}

var Cars = [];
generateCars();

function generateCars() {
  Cars = [];
  document.querySelectorAll('.car').forEach(function (element) {
    element.classList.remove('car');
  });

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
    // direction = i % 2 != 0 ? "right" : "left";
  }
  direction = Math.floor(Math.random() * 2) % 2 != 0 ? "right" : "left";
  
  var horizontal = Math.floor(Math.random() * totalCells);

  if (!i && i != 0) {

    // hvis jeg ikke mottar i som en parameter, så ønsker jeg de skal starte fra kanten. 
    // men må også finne ut hvilken rad jeg skal legge dem til.

    i = Math.floor(Math.random() * numberOfFiles);
    // direction = i % 2 != 0 ? "right" : "left";
    horizontal = direction == 'right' ? 0 : totalCells - 1;
  }

  var vertical = numberOfFiles - 1 - i;
  var Car = {
    horizontal: horizontal,
    vertical: vertical,
    cell: document.querySelectorAll('#road tr')[vertical].childNodes[horizontal],
    direction: direction,
    speed: Math.floor(Math.random() * 1) + 1,
    oldCell: null
  }
  Cars.push(Car);
}

function updateCars() {

  for (var i = Cars.length - 1; i >= 0; i--) {
    var Car = Cars[i];
    Car.oldCell = Car.cell;

    var newHorizontal = (Car.direction == "left") ? Car.horizontal - Car.speed : Car.horizontal + Car.speed;

    if (newHorizontal < 0 || newHorizontal >= totalCells) {
       direction = Math.floor(Math.random() * 2) == 1 ? "right" : "left";
      newHorizontal = Car.direction == "left" ? totalCells - 1 : 0;
       Car.direction = direction;
      Car.speed = Math.floor(Math.random() * 1) + 1;
    }


    // kollisjonstesting
    if (document.querySelectorAll('#road tr')[Car.vertical].childNodes[newHorizontal].className.indexOf('car') > -1) {
      if (document.querySelectorAll('#road tr')[Car.vertical].childNodes[newHorizontal] != Car.oldCell) {
        Cars.splice(i, 1);
        Car.oldCell.classList.remove('car', 'left', 'right');
        Car.oldCell.classList.add('crashed');
        // document.getElementById('carCount').innerText = Cars.length;
        continue;
      }
    }

    Car.horizontal = newHorizontal;
    Car.cell = document.querySelectorAll('#road tr')[Car.vertical].childNodes[Car.horizontal]

    Car.cell.classList.add('car', Car.direction);
    Car.oldCell.classList.remove('car', 'left', 'right');

    if (Car.cell.className.indexOf('frog') > -1) {
      die();
    }
  }

}

updateRoads();

function updateRoads() {
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
    setTimeout(updateRoads, 1000 / GameSpeed);
  }
}

function die() {
  if (GodMode == false)
    frog.alive = false;
}

function resetFrog() {
  frog.oldCell.className = '';
  document.querySelectorAll('.frog').forEach(function (element) {
    element.classList.remove('frog');
  });
  frog = {
    horizontal: Math.floor(totalCells / 2),
    vertical: "start",
    cell: null,
    oldCell: null,
    alive: true
  }
}

function moveFrogger(event) {
  var keyCode = event.keyCode || event.which;

  if (keyPress == true) {
    return false;
  }
  keyPress = true;
  console.log(event.key, event.keyCode);
  switch (keyCode) {
    case 37:
      if (frog.vertical != "start") goLeft();
      //ArrowLeft
      break;
    case 38:
      goUp();
      //ArrowUp
      break;
    case 39:
      if (frog.vertical != "start") goRight();
      //ArrowRight
      break;
    case 40:
      if (frog.vertical != "start") goDown();
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
  if (frog.vertical >= numberOfFiles) frog.vertical = numberOfFiles - 1;
  updateFrogPosition();
}

function goLeft() {
  frog.horizontal--;
  if (frog.horizontal < 0) frog.horizontal = totalCells - 1;

  updateFrogPosition();
}

function goRight() {
  frog.horizontal++;
  if (frog.horizontal >= totalCells) frog.horizontal = 0;

  updateFrogPosition();
}

function updateFrogPosition() {
  frog.oldCell = frog.cell;
  if (frog.vertical == "goal") {
    return false;
  }
  frog.cell = document.querySelectorAll('#road tr')[frog.vertical].childNodes[frog.horizontal]

  if (frog.cell.className.indexOf('car') > -1) {
    die();
  }
  frog.cell.classList.add('frog');
  if (frog.oldCell != null && frog.oldCell != frog.cell) {
    frog.oldCell.classList.remove('frog');
  }
}


// legg til en ny bil hvert x millisekund
setInterval(addCar, 10);