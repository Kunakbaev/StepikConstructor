function Page(workWidth, workHeight, backW, pageAdress) {
  this.callTextEdit = function(elem) {
    if (this.textEdit == undefined) {
      this.textEdit = document.createElement('TEXTAREA');
      let ourElementText = document.createTextNode("Print your Text");
      this.textEdit.appendChild(ourElementText);
      this.textEdit.setAttribute('maxlength', 5000);
      this.textEdit.setAttribute('cols',10);
      this.textEdit.setAttribute('rows', 5);
      this.textEdit.style.fontSize = "20px";
      this.textEdit.style.width = "200px";
      this.textEdit.style.height = "150px";
      this.textEdit.style.left = str(width / 2) + "px";
      this.textEdit.style.top = str(height / 2) + "px";
      this.textEdit.style.position = "absolute";
      print(str(width / 2) + "px");
      document.body.appendChild(this.textEdit);
    } else {
      print(this.textEdit.value, "value");
      let val = this.textEdit.value;
      this.textEdit.remove();
      this.textEdit = undefined;
      return val;
    }
  }
  this.callRadioEdit = function(elem) {
    if (this.editArray == undefined) {
      this.editArray = createSelect();
      this.editArray.option("none");
      let arr = elem.elt.children;
      //print(arr);
      //print(arr, "arr");
      let count = 0;
      for (let i in arr) {
        if (arr[i].type != "radio") continue;
        let word = arr[i].value;
        this.editArray.option("remove " + word);
      }
      this.editArray.changed(function() {
        count = 0;
        let val = mainPage.lesson.page.editArray.value();
        arr = elem.elt.children;
        val = val.replace('remove ', '')
        for (let i in arr) {
          if (typeof(arr[i]) == 'object') count += 1;
          if (arr[i].value == val) {
            break;
          }
        }
        if (val == "add") {
          let opt = createInput();
          opt.size(60, 20);
          let w = mainPage.lesson.page.editArray.elt.getBoundingClientRect().width;
          let x = mainPage.lesson.page.editArray.position().x + w;
          let y = mainPage.lesson.page.editArray.position().y;
          opt.position(x, y);

          let buttAdd = createButton("add");
          w = opt.elt.getBoundingClientRect().width;
          buttAdd.position(x + w, y);
          buttAdd.mousePressed(function() {
            let word = opt.value();
            print("word", word);
            elem.option(word);
            mainPage.lesson.page.editArray.option("remove " + word);
            //arr = 
          });
          
          mainPage.lesson.page.opt = opt;
          mainPage.lesson.page.buttAdd = buttAdd;
        }
        else {
          elem.elt.children[count].remove();
          elem.elt.children[count-1].remove();
          mainPage.lesson.page.editArray.elt.children[(count+1) / 2].remove();
        }
      });
      
      let w = elem.elt.getBoundingClientRect().width;
      let x = elem.position().x + w;
      let y = elem.position().y;
      
      this.editArray.option("add");
      this.editArray.position(x, y);
      this.editArray.size(80, 30);
      this.editArray.style("font: 600 20 arial");
      this.editArray.style("background: white");
      this.editArray.style("color: black");
    }
    else {
      this.editArray.hide();
      this.editArray.remove();
      this.editArray = undefined;
      //print(opt, buttAdd);
      try {
        mainPage.lesson.page.opt.hide();
        mainPage.lesson.page.opt.remove();
        mainPage.lesson.page.buttAdd.hide();
        mainPage.lesson.page.buttAdd.remove();
      } catch(err) {}
    }
  }
  this.addElement = function() {
    if (this.picker.value() == "video") {
      let elem = new VideoArea("https://editor.p5js.org/FreshTomato/sketches/U6yC5QZR1/assets/T.webm", backW + 20);
      this.elements.push(elem);
    }
    if (this.picker.value() == "text") {
      let elem = createSpan("Some text...");
      let ind = this.elements.length;
      let addr = this.pageAdress;
      elem.doubleClicked(function() {
        let val = mainPage.lesson.page.callTextEdit(elem);
        print(mainPage.lesson.pages[addr].elements[ind]);       print(mainPage.lesson.pages[addr].elements[ind].value());     mainPage.lesson.pages[addr].elements[ind].value(val);
        mainPage.lesson.pages[addr].elements[ind].elt.innerHTML = val;
      });
      elem.position(backW + this.workWidth * 0.025, 200);
      elem.size(this.workWidth * 0.95 - 10, 200);
      elem.style("border : 0px");
      elem.style("border-radius:5px");
      elem.style("background-color:white");
      elem.style("color: black");
      elem.style("font: 400 20px system-ui");
      elem.style("word-wrap", "break-word");
      elem.style("overflow-y", "scroll");
      this.elements.push(elem);
    }
    if (this.picker.value() == "input") {
      let elem = createInput();
      elem.position(backW + this.workWidth * 0.025, 200);
      elem.size(this.workWidth * 0.95 - 10, 50);
      //elem.elt.setAttribute("placeholder", "your answer");
      //elem.placeholder = "write answer";
      elem.style("border : 0px");
      elem.style("border-radius:5px");
      elem.style("background-color:white");
      elem.style("color: black");
      elem.style("font: 400 20px system-ui");
      this.elements.push(elem);
    }
    if (this.picker.value() == "radio") {
      let elem = createRadio();
      
      elem.position(backW + this.workWidth * 0.025, 200);
      elem.size(this.workWidth * 0.95 - 10, 200);
      elem.style("border : 0px");
      elem.style("border-radius:5px");
      elem.style("background-color:white");
      elem.style("color: black");
      elem.style("font: 400 20px system-ui");
      elem.option("milk");
      elem.option("butter");
      elem.option("bread");
      elem.doubleClicked(function() {
        mainPage.lesson.page.callRadioEdit(elem);
      });
      this.elements.push(elem);
    }
    if (this.picker.value() == "radio many answers") {
      let elem = createDiv();
      this.elements.push(elem);
    }
    mainPage.lesson.pages[this.pageAdress].elements = this.elements;
    //print(this.pageAdress, "addr");
  }
  this.setup = function() {
    // all types:
    //   * video
    //   * text
    //   * question
    
    this.elements = [];
    this.pageAdress = pageAdress;
    this.index = -1;
    this.showPanel = false;
    
    this.workWidth = workWidth;
    this.workHeight = workHeight;
  }
  this.setup();
  this.PageConstructor = function() {
    this.background = new Panel("rect", color(0,0,0), 255, 1, 0, 0, width, height);
    
    this.save = createButton("save");
    this.save.mousePressed(function() {
      mainPage.lesson.savePage();
    });
    this.save.style("background: white");
    this.save.style("color: black");
    this.save.style("font: 500 20px arial");
    this.save.style("border: 0px");
    this.save.style("border-radius: 5px");
    this.save.position(backW + this.workWidth * 0.025 + 65, this.workWidth * 0.025);
    
    this.add = createButton("add"); 
    this.add.style("border: 0px");
    this.add.style("border-radius: 5px");
    this.add.style("background:white");
    this.add.style("font: 500 20px system-ui");
    this.add.style("color:black");
    //this.add.style("hover:border", "0px");
    this.add.position(backW + this.workWidth * 0.025, this.workWidth * 0.025);
    this.add.mousePressed(function() {mainPage.lesson.page.callPanel()});
    //print(this.add.onclick.toString(), "add butt");
    
    this.backgroundPanel = new Panel("rect", color(255, 255, 255), 255, 1, backW + this.workWidth * 0.025, this.workWidth * 0.025 + 30, 200, 100);
    this.picker = createSelect();
    this.picker.style("border: 0px");
    this.picker.style("border-radius: 5px");                   this.picker.style("background-color:black");
    this.picker.style("color:white");
    this.picker.style("font: 500 20px arial");
    this.picker.size(180, 30);
    this.picker.position(backW + this.workWidth * 0.025 + 10, this.workWidth * 0.025 + 40); 
    this.picker.option("video");
    this.picker.option("text");
    this.picker.option("input");
    this.picker.option("radio");
    this.picker.option("radio many answers");
    
    this.create = createButton("create");
    this.create.style("background-color:black");
    this.create.style("color:white");                         this.create.style("border:0px");
    this.create.style("border-radius:5px");
    this.create.style("font: 500 20px arial");
    this.create.position(backW + this.workWidth * 0.025 + 10, this.workWidth * 0.025 + 80);
    this.create.size(180, 30);
    this.create.elt.onclick = function() {mainPage.lesson.page.addElement()};
    
    this.create.hide();
    this.picker.hide();
    this.save.hide();
    this.add.hide();
  }
  this.PageConstructor();
  this.callPanel = function() {
    this.showPanel = !this.showPanel;
    if (this.showPanel) {
      //print("call panel");
      this.create.show();
      this.picker.show();
    } else {
      this.create.hide();
      this.picker.hide();
    }
  }
  this.drawPanel = function() {
    this.backgroundPanel.draw();
    this.picker.show();
    this.create.show();
  }
  this.checkElem = function(elem) {
    //print(elem);
    //print(elem.x, elem.y, elem.width, elem.height, mouseX, mouseY);
    if (elem.x != undefined && elem.y != undefined && elem.width != undefined && elem.height != undefined) {
      //print("in");
      if (elem.x < mouseX && mouseX < elem.x + elem.width && elem.y < mouseY && mouseY < elem.y + elem.height) return true;
    }
    return false;
  }
  this.mouseDragg = function() {
    if (this.index == -1) {
      for (let i = 0; i < this.elements.length; i++)  {
        if (this.checkElem(this.elements[i]) && this.elements[i].vid != undefined) {
          this.elements[i].x = mouseX - 10;
          this.elements[i].y = mouseY - 10;
          this.index = i;
          break;
        }
        if (this.elements[i].vid == undefined ) {
          let element = this.elements[i];
          this.elements[i].mouseMoved(function() {
            //print("mouse Moved", dragged);
            if (dragged) {
              element.position(mouseX - 10, mouseY - 10);
              mainPage.lesson.page.index = i;
            }
            if (keyCode == DELETE) {
              element.remove(); 
            }
          });
        }
      }  
    }
    else {
      if (this.elements[this.index].vid != undefined) {
        this.elements[this.index].vid.pause();
        this.elements[this.index].vid.playing = false;
        this.elements[this.index].setupObjects();
        this.elements[this.index].x = mouseX - 10;
        this.elements[this.index].y = mouseY - 10;
      }
      else {
        this.elements[this.index].position(mouseX - 10, mouseY - 10);
      }
    }
  }
  this.draw = function() {
    
    this.background.draw();

    if (this.showPanel) this.drawPanel();
    else {
      this.picker.hide();
      this.create.hide();
    }
  }
}
