/*jshint esversion: 8 */

var offset = 20;
var video;
var Objects = [];
var mousePress = false;
var database;
var mainPage;
var dragged = false;

var timer = 0.3;
var time = 0;

function openNav() {
  document.getElementById("i").style.width = "200px";
}

function closeNav() {
  document.getElementById("i").style.width = "0";
}

// -------------- setup -------------------------------------------
function setup() {  
  let canvas = createCanvas(800, 800);
  noStroke();
  
  database = new Database();
  var saveInterface = createButton("S");
  saveInterface.size(50, 50);
  saveInterface.position(width - 50, 0);
  saveInterface.mousePressed(function() {database.saveDefaultInterface(
    'interface/another', true)});
  
  var selInter = createSelect();
  selInter.position(width - 150, 5);
  selInter.option('default');
  selInter.option('another');
  selInter.size(100, 40);
  selInter.changed(function() {
    let v = selInter.value();
    if(v == "default") database.downloadDefInterface("interface/standart");
    else database.downloadDefInterface("interface/another");
  });
  
  userBase = new UsersDatabase(database.database);
  
  mainPage = new MainPage();

  /*let div = createDiv();
  div.id("miSidenav");
  div.class("sidenav");
  div.elt.innerHTML = "<a href='#'>About</a><a href='#'>Services</a><a href='#'>Clients</a><button type='button' onclick='closeNav' id='i' name='i' style='position:absolute; left: 100px; top: 200px'>1.2.2.5</button><button type='button' onclick='closeNav' id='ib' name='ib' style='position:absolute; left: 100px; top: 200px'>1.2.2.5</button>";*/
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
  mainPage.mouseClick();
  //video.mouseClick();
  // print("One click");
}

// -------------- draw --------------------------------------------

function draw() {
  //print(database);
  background(50);
  
  mainPage.draw();
  if (mainPage.img != undefined) {
    image(mainPage.img, 0, 0, width, height); 
  }
  if (!userBase.show) {
    if (mousePress) time += deltaTime / 1000;
    if (mousePress && time > timer) click();
  }
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
  //video.doubleClick();
  // print("Double click");
}
function create_check_box() {
  let div = createDiv();
  
  let inp = document.createElement("input");
  inp.style = "width : 50, height : 50";
  inp.value = "";
  inp.id = "";
  inp.type = "checkbox";
  
  
  
  div.elt.appendChild(inp);
  div.elt.appendChild();
  
  return element; 
}
function mouseReleased() {
  if (mainPage.lesson == undefined) return;
  if (mainPage.lesson.page == undefined) return;
  mainPage.lesson.page.index = -1;
  dragged = false;
  if(mainPage.lesson.page.index != -1) {
    if (mainPage.lesson.page.elements[mainPage.lesson.page.index].vid != undefined){
  mainPage.lesson.page.elements[mainPage.lesson.page.index].vid.play();
  mainPage.lesson.page.elements[mainPage.lesson.page.index].vid.playing = true;
    }
  }
}
function mouseDragged() {
  //print("dragging mouse");
  mainPage.mouseDragg();
  dragged = true;
}
