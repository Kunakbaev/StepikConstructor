function MainPage() {
  this.closeLessonPanel = function() {
    try { 
      this.showLessonPanel = false;
      this.lessonPanelBack.hide();
    } catch (err) {
      print(err);
      print("this is fucking error");
    }
  }
  
  this.addLessonPanel = function() {
    let w = 400;
    let h = 600;
    let x = width / 2 - w / 2;
    let y = height / 2 - h / 2;
    this.lessonPanelBack = createDiv();
    this.lessonPanelBack.id("lessonPanelBack");
    this.lessonPanelBack.class("panel");
    
    this.lessonPathPick = createInput();
    this.lessonPathPick.id("lessonPathPick");
    this.lessonPathPick.elt.setAttribute("placeholder", " Lesson's image url");
    this.lessonPathPick.style("background-color", "black");
    this.lessonPathPick.style("color", "white");
    this.lessonPathPick.style("font: 800 30px arial");
    this.lessonPathPick.style("border: 0px");
    this.lessonPathPick.style("border-radius: 5px");
    let pick_h = this.lessonPathPick.elt.getBoundingClientRect().height;
    this.lessonPathPick.size(w - 40, pick_h);
    let pick_w = this.lessonPathPick.elt.getBoundingClientRect().width;
    this.lessonPathPick.position(w / 2 - pick_w / 2, 20);
    
    this.lessonNamePick = createInput("rodion");
    this.lessonNamePick.id("lessonNamePick");
    this.lessonNamePick.elt.setAttribute("placeholder", " Lesson's name");
    this.lessonNamePick.style("background-color", "black");
    this.lessonNamePick.style("color", "white");
    this.lessonNamePick.style("font: 800 30px arial");
    this.lessonNamePick.style("border: 0px");
    this.lessonNamePick.style("border-radius: 5px");
    pick_h = this.lessonNamePick.elt.getBoundingClientRect().height;
    this.lessonNamePick.size(w - 40, pick_h);
    pick_w = this.lessonNamePick.elt.getBoundingClientRect().width;
    this.lessonNamePick.position(w / 2 - pick_w / 2, 70);
    
    this.lessonDrop = createSpan("or drop it");
    this.lessonDrop.id("lessonDrop");
    this.lessonDrop.style("background-color", "black");
    this.lessonDrop.style("color", "white");
    this.lessonDrop.style("font: 800 30px arial");
    this.lessonDrop.style("border: 0px");
    this.lessonDrop.style("padding-left: 30px");
    this.lessonDrop.style("padding-top: 80px");
    this.lessonDrop.style("border-radius: 5px");
    this.lessonDrop.size(170, 120);
    this.lessonDrop.position(20, 120);
    
    this.createLesson = createButton("create");
    this.createLesson.id("createLesson");
    this.createLesson.style("background-color", "black");
    this.createLesson.style("color", "white");
    this.createLesson.style("font: 800 30px arial");
    this.createLesson.style("border: 0px");
    this.createLesson.style("border-radius: 5px");
    
    let button_h = this.createLesson.elt.getBoundingClientRect().height;
    this.createLesson.size(w - 40, button_h);
    let button_w = this.createLesson.elt.getBoundingClientRect().width;
    this.createLesson.position(w / 2 - button_w / 2, h - button_h - 20);
    
    this.lessonPanelBack.elt.innerHTML = this.createLesson.elt.outerHTML + this.lessonPathPick.elt.outerHTML + this.lessonNamePick.elt.outerHTML + 
this.lessonDrop.elt.outerHTML;
    
    let arr = this.lessonPanelBack.elt.children;
    for (let i in arr) {
      if (arr[i].id == "createLesson") {
        arr[i].onclick = function() {
          let imagePath = document.getElementById("lessonPathPick").value;
          let lessonName = document.getElementById("lessonNamePick").value;
          
          let lesson = new Lesson(lessonName, 20, 170, imagePath, mainPage.lessons.length);
          
          mainPage.lessonsNavbar.style("display: table");
          
          let div = createDiv();
          div.size(150, 150);
          div.style("padding-left: 20px");
          div.style("padding-top: 20px");
          div.style("display: inline-block");
          div.style("background: none");
          //if (count == 1) div.style("background: red");
          
          let image = lesson.lessonImage;
          let w = image.elt.getBoundingClientRect().width;
          image.elt.style = "";
          let elem = createSpan(lessonName);
          let fontSize = div.style("padding-top");
          let elemW = elem.elt.getBoundingClientRect().width;
          elem.style("font: 500 19px arial");
          elem.style("color: white");
          elem.style("padding-left", str(int((w - elemW) / 2)) + "px");
          //print(w / i.length);
          //canvas.hide();
          //canvas.remove();
          
          div.elt.innerHTML = elem.elt.outerHTML + image.elt.outerHTML;
          
          mainPage.lessonsNavbar.elt.innerHTML += div.elt.outerHTML;
          
          elem.hide();
          image.hide();
          div.hide();
          lesson.lessonImage.hide();
          lesson.saveLessonToBase();
          
          mainPage.closeLessonPanel();
        }
      }
      if (arr[i].id == "lessonDrop") {
        arr[i].drop = function(file) {
          let image = createImg(file.data, '');
          print(file.data);
        } 
      }
    }
    
    this.createLesson.hide();
    this.lessonPathPick.hide();
    this.lessonNamePick.hide();
    this.lessonDrop.hide();
  }
  this.setLessonsImages = function() {
    let arr = this.lessonsNavbar.elt.children;
    let count = 0;
    for (let i in arr) {
      let o = arr[i];
      let j = function(count) {
        this.lessons[count].showLesson();
        this.lessons[count].show = true;
        this.lesson = this.lessons[count];
        
        let email = this.user.email;
        if (email == "") email = "abc";
        let path = "users/" + email + "/My lessons/" + this.lesson.lessonName;
        print(this.lesson.lessonName);
        //print(email, path);
        let ref = userBase.database.ref(path);
        ref.set({visit:true});
      }
      if (o.tagName == "DIV") {
        o.onclick = j.bind(this,count);
        count += 1;
      }
    }
  }
  this.createLesson = function() {
    
  }
  this.downloadLessons = function() {
    database = database.database;
    let ref = database.ref("Lessons/");
    ref.once('value', function(data) {
      data = data.val();
      let count = 0;
      if (data != undefined) {
        for (let i in data) {
          let o = data[i];
          let imagePath = o.imagePath;
          let lesson = new Lesson(i, 20, 170, imagePath, count);
          
          //mainPage.lessonsNavbar.style("display: table");
          
          let div = createDiv();
          div.size(150, 150);
          div.style("padding-left: 20px");
          div.style("padding-top: 20px");
          div.style("display: inline-block");
          div.style("background: none");
          //if (count == 1) div.style("background: red");
          
          let image = lesson.lessonImage;
          let w = image.elt.getBoundingClientRect().width;
          image.elt.style = "";
          let elem = createSpan(i);
          let fontSize = div.style("padding-top");
          let elemW = elem.elt.getBoundingClientRect().width;
          elem.style("font: 500 19px arial");
          elem.style("color: white");
          elem.style("padding-left", str(int((w - elemW) / 2)) + "px");
          //print(w / i.length);
          //canvas.hide();
          //canvas.remove();
          
          div.elt.innerHTML = elem.elt.outerHTML + image.elt.outerHTML;
          
          mainPage.lessonsNavbar.elt.innerHTML += div.elt.outerHTML;
          
          elem.hide();
          image.hide();
          div.hide();
          lesson.lessonImage.hide();
          
          mainPage.lessons.push(lesson);
          count += 1;
        }
        mainPage.setLessonsImages();
      }
    });
  }
  
  this.setup = function() {
    this.showLessonPanel = false;
    this.admin = true;
    this.user = new User("", "", "", "", "");
    
    this.showProf = false;
    this.logged = true;
    this.index = 1;
    this.elements = [];
    
    //-------- signUp setup -----------------------
    
    this.signUp = createButton("Sign up");
    this.signUp.size(95, 30);
    this.signUp.position(10, 10);
    this.signUp.mousePressed(function() {mainPage.signUpFunc()});
    this.signUp.style("font: 600 17.5px arial");
  
    //----------- signIn setup --------------------
    
    this.signIn = createButton("Sign in");
    this.signIn.size(90, 30);
    this.signIn.position(115, 10);
    this.signIn.mousePressed(function() {mainPage.signInFunc()});
    this.signIn.style("font: 600 18px arial");
  
    this.background = new Panel("rect", color(30,144,255), 255, 1, 0, 0, width, height);
    this.show = false;
  
    //---------- lessons setup ---------------
    
    this.lessonsNavbar = createDiv();
    this.lessonsNavbar.id("lessonsNavbar");
    this.lessonsNavbar.class("navbar");
    
    this.LessonsBack = new Panel("rect", color(0, 0, 0), 255, 1, 0, 100, width, 50);
    this.LessonsText = createSpan("Our lessons");
    this.LessonsText.position(20, 105);
    this.LessonsText.style("font: 600 35px arial");
    this.LessonsText.style("color: white");
    this.LessonsText.elt.multiline = true;
    
    this.addLessonBut = createButton("add lesson");
    this.addLessonBut.position(width - 150, 110);
    this.addLessonBut.size(140, 30);
    this.addLessonBut.style("background-color: white");
    this.addLessonBut.style("color: black");
    this.addLessonBut.style("font: 500 25px arial");
    this.addLessonBut.style("border: 0px");
    this.addLessonBut.style("border-radius: 5px");
    this.addLessonBut.mousePressed(function() {
      mainPage.showLessonPanel = !mainPage.showLessonPanel;
      if (mainPage.showLessonPanel) mainPage.addLessonPanel();
      else mainPage.closeLessonPanel();
    });
    this.lessons = [];
    this.downloadLessons();
  }
  this.setup();
  this.setupUpStripe = function() {
    this.stripe = new Panel("rect", color(0, 0, 0), 255, 1, 0, 0, width, 50);
  }
  this.setupUpStripe();
  this.drawUpStripe = function() {
    //this.stripe.draw(); 
  }
  
  this.showWarning = function() {
    this.show_warn = true;
    
    let centreX = width / 2;
    let centreY = width * 0.2 + 0.4 * height / 2;
    colBack = color(0, 204, 102);
    colText = color(255, 255, 255);
    this.text = createSpan("This email is\n already exist...");
    this.text.style("background", colBack);
    this.text.style("color", colText);
    this.text.style("font: 700 20px arial");
    let w = this.text.elt.getBoundingClientRect().width;
    let h = this.text.elt.getBoundingClientRect().height;
    print(w);
    this.text.position(centreX - w / 2, centreY + height * 0.4 / 2 - h);
  }
  
  this.closeSign = function() {
    print("onclick");
    mainPage.show = false;
    mainPage.signUpBackground.hide();
    mainPage.signInBackground.hide();
  } 
  this.signUpUser = function() {
    mainPage.show = false;
    userBase.addUser(mainPage.nameInput.value(), mainPage.surnameInput.value(), mainPage.mailInput.value(), mainPage.passwordInput.value());
  }
  this.signInUser = function() {
    mainPage.show = false;
    let mail;
    let password;
    let arr = mainPage.signInBackground.elt.children;
    for (let i in arr) {
      if (arr[i].id == "mailInput") mail = arr[i].value;
      if (arr[i].id == "passwordInput") password = arr[i].value;
    }
    print(mail, password);
    userBase.logIn(mail, password);
  }
  this.setupSignUp = function() {
    let centreX = width / 2;
    let centreY = width * 0.2 + 0.4 * height / 2;
    let wi = width * 0.6;
    let he = height * 0.4;
    let backCol = color(0, 0, 0);
    backCol.setAlpha(127);
    this.signUpBackground = createDiv();
    this.signUpBackground.id("singUpBackground");
    this.signUpBackground.class("panel");
    this.signUpBackground.style("background-color", backCol);
    this.signUpBackground.style("width : 800px");
    this.signUpBackground.style("height: 800px");
    this.signUpBackground.position(0, 0);
    
    backCol = color(0, 0, 0);
    this.signUpBack = createDiv();
    this.signUpBack.id("signUpBack");
    this.signUpBack.class("panel");
    this.signUpBack.style("background-color", backCol);
    this.signUpBack.style("width", str(wi) + "px");
    this.signUpBack.style("height", str(he) + "px");
    this.signUpBack.position((width - wi) / 2, width * 0.2);
    
    this.closeButton = createButton("X");
    this.closeButton.id("closeButton");
    this.closeButton.size(30, 30);
    this.closeButton.position(centreX + wi/2-30, centreY - he/2);
    this.closeButton.mousePressed(function() {mainPage.show = false});
    this.closeButton.style("padding: 0px 0px");
    this.closeButton.style("background", "none");
    this.closeButton.style("border: 0px");
    this.closeButton.style("font: 800 30px arial");
    this.closeButton.style("color: white");
    
    this.signUpText = createSpan("SIGN UP");
    this.signUpText.style("color: white");
    this.signUpText.style("font: 600 50px arial");
    
    this.nameInput = createInput();
    this.nameInput.id("nameInput");
    this.nameInput.elt.setAttribute("placeholder", "name");
    this.nameInput.size(250, 30);
    this.nameInput.position(centreX - 50, centreY);
    
    this.mailInput = createInput();
    this.mailInput.id("mailInput");
    this.mailInput.elt.setAttribute("placeholder", "email");
    this.mailInput.size(250, 30);
    this.mailInput.position(centreX - 50, centreY - 80);
    
    this.passwordInput = createInput();
    this.passwordInput.id("passwordInput");
    this.passwordInput.elt.setAttribute("placeholder", "password");
    this.passwordInput.size(250, 30);
    this.passwordInput.style("border: 0px");
    
    this.surnameInput = createInput();
    this.surnameInput.id("surnameInput");
    this.surnameInput.elt.setAttribute("placeholder", "surname");
    this.surnameInput.size(250, 30);
    this.surnameInput.position(centreX - 50, centreY - 40);
    
    this.signUpButton = createButton("sign up");
    this.signUpButton.id("signUp");
    this.signUpButton.size(255, 30);
    this.signUpButton.position(centreX - 50, centreY + 40);
    this.signUpButton.style("background:blue");
    this.signUpButton.style("color:white");
    this.signUpButton.style("font:800 20px arial");
    this.signUpButton.style("border-radius:5px");
    this.signUpButton.style("border:0");
    
    this.nameInput.style("border:0");
    this.surnameInput.style("border:0");
    this.mailInput.style("border:0");
    
    this.signUpText.elt.innerHTML = "sign up";
    let w = this.signUpText.elt.getBoundingClientRect().width;
    //print(w);
    this.signUpText.position(centreX - w / 2, centreY - 150);
    this.nameInput.position(centreX - 125, centreY);
    this.mailInput.position(centreX - 125, centreY - 80);
    this.passwordInput.position(centreX - 125, centreY - 40);
    this.surnameInput.position(centreX - 125, centreY + 40);
    this.signUpButton.position(centreX - 125, centreY + 80);
    
    this.signUpBackground.elt.innerHTML = this.signUpBack.elt.outerHTML;
    
    document.getElementById("closeButton").setAttribute('onclick', "mainPage.closeSign()");
    //document.getElementById("closeButton").onclick = n;
    
    document.getElementById("closeButton").innerHTML = "X";
    document.getElementById("signUp").setAttribute("onclick", "mainPage.signUpUser()");
    
    this.signUpBackground.elt.innerHTML += document.getElementById("closeButton").outerHTML + this.signUpButton.elt.outerHTML + this.nameInput.elt.outerHTML + this.surnameInput.elt.outerHTML + this.mailInput.elt.outerHTML + this.signUpText.elt.outerHTML + this.passwordInput.elt.outerHTML;
    
    this.signUpText.hide();
    this.mailInput.hide();
    this.signUpButton.hide();
    this.nameInput.hide();
    this.surnameInput.hide();
    this.signUpBackground.hide();
    this.signUpBack.hide();
    this.closeButton.hide();
  }
  this.setupSignIn = function() {
    let centreX = width / 2;
    let centreY = width * 0.2 + 0.4 * height / 2;
    let wi = width * 0.6;
    let he = height * 0.4;
    
    let backCol = color(0,0,0);
    backCol.setAlpha(127);
    this.signInBackground = createDiv();
    this.signInBackground.id("signInBackground");
    this.signInBackground.class("panel");
    this.signInBackground.style("background", backCol);
    this.signInBackground.size(width, height);
    this.signInBackground.position(0, 0);

    this.signInBack = createDiv();
    this.signInBack.id("signInBack");
    this.signInBack.class("panel");
    this.signInBack.style("background", color(0,0,0));
    this.signInBack.style("width", str(wi) + "px");
    this.signInBack.style("height", str(he) + "px");
    this.signInBack.position((width - wi) / 2, width * 0.2);
    
    this.signInButton = createButton("SIGN IN");
    this.signInButton.id("signIn");
    this.signInButton.size(255, 30);
    this.signInButton.style("background:blue");
    this.signInButton.style("color:white");
    this.signInButton.style("font:800 20px arial");
    this.signInButton.style("border-radius:5px");
    this.signInButton.style("border:0");
    
    this.mailInput.show();
    this.passwordInput.show();
    this.closeButton.show();
    this.signUpText.show();
    
    let w = this.signUpText.elt.getBoundingClientRect().width;
    //print(w);
    this.signUpText.elt.innerHTML = "sign in";
    this.signUpText.position(centreX - w / 2, centreY - 120);
    this.passwordInput.position(centreX - 125, centreY-15);
    this.mailInput.position(centreX - 125, centreY-55);
    this.signInButton.position(centreX - 125, centreY + 25);
    
    this.signInBackground.elt.innerHTML = this.signInBack.elt.outerHTML;
    document.getElementById("signIn").setAttribute("onclick", "mainPage.signInUser()");
    
    this.signInBackground.elt.innerHTML += this.signInButton.elt.outerHTML + this.mailInput.elt.outerHTML + this.passwordInput.elt.outerHTML + document.getElementById("closeButton").outerHTML + this.signUpText.elt.outerHTML;
    
    this.mailInput.hide();
    this.signInButton.hide();
    this.passwordInput.hide();
    this.signInBackground.hide();
    this.signInBack.hide();
  }
  
  this.drawSignUp = function() {
    this.signUpBackground.show();
  }
  this.drawSignIn = function() {
    this.signInBackground.show();
  }
  
  this.setupSignUp();
  this.setupSignIn();
  
  this.objects = [this.background, this.stripe];
  
  this.signUpFunc = function() {
    this.show = true;
    this.index = 1;
  }
  this.signInFunc = function() {
    this.show = true;
    this.index = 2;
  }
  
  //----------- draw ----------------------------
  this.draw = function () {
    this.elements = [];
    for (let a in this.lessons) {
      this.elements += this.lessons[a].elements; 
    }
    this.signUpBackground.hide();
    this.signInBackground.hide();
    this.lessonsNavbar.hide();
    this.mailInput.hide();
    this.closeButton.hide();
    this.signUpText.hide();
    this.signUpButton.hide();
    this.nameInput.hide();
    this.surnameInput.hide();
    this.signInButton.hide();
    this.passwordInput.hide();
    if (this.text != undefined) this.text.hide();
    for (let a in this.lessons) {
      if (this.lesson != undefined) {
        this.lesson.draw();
        this.lessonsNavbar.hide();
        this.signIn.hide();
        this.signUp.hide();
        this.LessonsText.hide();
        this.addLessonBut.hide();
        break;
      }
      let l = this.lessons[a];
      if (l.show == false) {
        //print(a);
        this.lessonsNavbar.show();
        for (let i = 0; i < this.objects.length; i++) {
          this.objects[i].draw();
        }
        if (this.show) {
          if (this.index == 1) this.drawSignUp();
          if (this.index == 2) this.drawSignIn();
        }
        this.LessonsBack.draw();
        if (this.showProf) {
          this.user.showProfile(); 
        }
      }
      else {
        this.lesson = l;
        //print(a);
        if (this.user != undefined) {
          this.user.hideProfile(); 
        }
        this.lessonsNavbar.hide();
        this.signIn.hide();
        this.signUp.hide();
        this.LessonsText.hide();
        this.addLessonBut.hide();
        for (let i in this.lessons) {
          this.lessons[i].lessonImage.hide(); 
        }
        if (this.symbols != undefined) {
          this.symbols.hide();
        }
      }
    }
        
    for (let i in this.elements) {
      if (this.elements[i].draw != undefined) {   
        this.elements[i].update(); 
        this.elements[i].draw();
      }
    }
    
    if (this.showLessonPanel) {
      this.lessonPanelBack.show();
    }
  }
  this.mouseClick = function() {
    for (let i = 0; i < this.elements.length; i++) {
      if (this.elements[i].mouseClick != undefined) { 
        //print("clicking mouse...");
        this.elements[i].mouseClick(); 
      }
    }
  }
  this.mouseDragg = function() {
    if (this.lesson == undefined) return;
    this.lesson.mouseDragg(); 
  }
}
