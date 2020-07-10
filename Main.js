var offset = 20;
var video;
var Objects = [];
var mousePress = false;

var timer = 0.3;
var time = 0;

// -------------- setup -------------------------------------------
function setup() {  
  createCanvas(800, 800);
  
  path = "assets/T.webm";
  video = new VideoArea(path, offset);
  //Objects.push(video);
  if(video.objects.length != 0) { 
    for (let i = 0; i < video.objects.length; i ++) 
      Objects.push(video.objects[i]);
  }
  
  database = new Database();
  var saveInterface = createButton("S");
  saveInterface.size(50, 50);
  saveInterface.position(width - 50, 0);
  saveInterface.mousePressed(function() {database.saveDefaultInterface(
    'interface/another', true)});
  
  var selInter = createSelect();
  selInter.position(width - 150, 0);
  selInter.option('default');
  selInter.option('another');
  selInter.changed(function() {
    let v = selInter.value();
    if(v == "default")                          database.downloadDefInterface("interface/standart");
    else database.downloadDefInterface("interface/another");
  });
}

// -------------- sorting -----------------------------------------

function sorting() {
  let o = Objects;
  var list = [];
  for (let a = 0; a < o.length; a++) {
    list.push(o[a].layer);
  }
  for (let a = 0; a < list.length; a++) {
    let ma = max(list.slice(a));
    let maInd = list.slice(a).indexOf(ma) + a;
    //print(ma, maInd);
    let x = list[a];
    list[a] = ma;
    list[maInd] = x;
    
    //x = o[a];
    //o[a] = o[maInd];
    //o[maInd] = x;
  }
}

// -------------- click -------------------------------------------

function click() {
  mousePress = false;
  time = 0;
  video.mouseClick();
  // print("One click");
}

// -------------- draw --------------------------------------------

function draw() {
  //if (frameCount % 60 == 0) sorting();
  background(50);
  var index = findIndex();
  if (index != -1) {
    video.vid.pause();
    Objects[index].draw();
  }
  else video.update();
  video.draw();
  if (mousePress) time += deltaTime / 1000;
  if (mousePress && time > timer) click();
}

// -------------- findIndex ---------------------------------------

function findIndex() {
  for (let i = 0; i < Objects.length; i += 1) {
    if (Objects[i].showSettings == true) return i; 
  }
  return -1;
}

// -------------- mousePressed ------------------------------------

function mousePressed() {
  mousePress = true;
  if (time > timer) {
    mousePress = false;
    time = 0;
  }
}

// -------------- double clicked ----------------------------------

function doubleClicked() {
  mousePress = false;
  time = 0;
  video.doubleClick();
  // print("Double click");
}
