function User(surname, name, password, email, image) {
  this.setup = function() {
    this.name = name;
    this.surname = surname;
    this.password = password;
    this.email = email;
    this.image = image; 
  }
  this.setup();
  
  this.showProfile = function() {
    mainPage.showProf = true;
    if (this.profText == undefined) {
      this.profText = createSpan(this.name + " " + this.surname);
      this.profText.style("background: none");
      this.profText.style("color: white");
      this.profText.style("font: 600 30px arial");
      let w = this.profText.elt.getBoundingClientRect().width;
      this.profText.position(320 / 2 - w / 2, 440 / 2 - 205);
    }
    if (this.profLessons == undefined) {
      this.profLessons = createSpan("My lessons");
      this.profLessons.style("background: none");
      this.profLessons.style("color: white");
      this.profLessons.style("font: 600 30px arial");
      let w = this.profLessons.elt.getBoundingClientRect().width;
      this.profLessons.position(320 / 2 - w / 2, 440 / 2 - 145);
    }
    if (this.profStripe == undefined) {
      this.profStripe = createDiv();
      this.profStripe.class("navbar");
      this.profStripe.id("profStripe");
    } 
    if (this.profNavbar == undefined) {
      let image = mainPage.lesson.lessonImage;
      image.elt.setAttribute('onclick', 'mainPage.lesson.showLesson()');
      image.elt.style = "padding-left: 10px; padding-top: 10px; width : 60px; height : 60px";
      
      this.profNavbar = createDiv();
      this.profNavbar.id("profNavbar");
      this.profNavbar.class("navbar");
      this.profNavbar.elt.innerHTML += image.elt.outerHTML;
      image.hide();
      image.remove();
    }
    if (this.profBack == undefined) {
      this.profBack = createDiv();
      this.profBack.class("navbar");
      this.profBack.id("profBack");
      this.profBack.elt.innerHTML += this.profNavbar.elt.outerHTML + this.profStripe.elt.outerHTML + this.profLessons.elt.outerHTML + this.profText.elt.outerHTML;
      
      this.profLessons.hide();
      this.profText.hide();
      this.profStripe.hide();
      this.profNavbar.hide();
    }
  }
  this.hideProfile = function() {
    try {
      this.profNavbar.hide();
      this.profLessons.hide();
      this.profText.hide();
    } catch (err){}
  }
  
  this.showSymbols = function(symbs) {
    this.logged = true;
    this.symbols = createButton(symbs);
    this.symbols.size(50, 50);
    this.symbols.position(220, 0);
    colorMode(HSB, 255);
    let backCol = color(random(255), 255, 255);
    colorMode(RGB, 255);
    this.symbols.style("background-color", backCol);
    this.symbols.style("color:white");
    this.symbols.style("border-radius: 5px");
    this.symbols.style("border: 0px");
    this.symbols.style("font: 800 40px arial");
    this.symbols.style("padding: 0px 0px");
    
    this.symbols.mousePressed(function() {
      mainPage.user.showProfile();
    });
  }
}
