function Lesson(lessonName, x, y, imgPath, lesInd) {
  this.saveLessonToBase = function() {
    print(database);
    database = database;
    let ref = database.ref("Lessons/" + lessonName);
    let data = {
      imagePath : imgPath
    };
    ref.set(data);
  }
  
  this.saveHtml = function(element, path) {
    if (element.elt.localName == "video") {
      let ref = this.database.ref(path + "/path/");
      ref.set(element.src);
    }
    let ref = this.database.ref(path + "/localName");
    ref.set(element.elt.localName);
    ref = this.database.ref(path + "/type");
    if (element.elt.type != undefined) ref.set(element.elt.type);
    //ref = this.database.ref(path + "/style");
    //ref.set(element.style);
    let el = element.elt.style;
    for (let i in el) {
      if (el[i] != "") {
        try {
          ref = this.database.ref(path + "/style/" + i);
          ref.set(el[i]);
        } catch (err) {}
      }
    }

    for (let i in element) {
      try {
        let o = element[i];
        if (i == "position") o = element.position();
        if (i == "size") o = element.size();
        if (i == "value") {
          o = element.value();
          ref = this.database.ref(path + "/" + i);
          ref.set(o);
        }
        if (o.x != undefined && o.y != undefined) {
          ref = this.database.ref(path + "/x");
          ref.set(o.x);
          ref = this.database.ref(path + "/y");
          ref.set(o.y);
          continue;
        }
        if (o.w != undefined && o.h != undefined) {
          let ref = this.database.ref(path + "/w");
          ref.set(o.w);
          ref = this.database.ref(path + "/h");
          ref.set(o.h);
          continue;
        }
        if (typeof(o) == "function") {
          if (i != "mousePressed") continue;
          ref = this.database.ref(path + "/" + i);
          ref.set(o.toString());
        }
      } catch (err) {}
    }
  }
  this.downloadHtml = function(node) {
    //print("-------------------");
    let element;
    element = createElement(node.localName);
    for (let i in node.style) {
      element.elt.style[i] = node.style[i];
    }
    element.position(node.x, node.y);
    if (node.value != undefined) {
      element.value(node.value);
    }
    //element.size(node.w, node.h);
    for (let i in node) {
      try {
        element[i] = new Function(node.i);
      } catch (err) {}
    }
    element.hide();

    return element;
  }
  this.downloadPanel = function(node) {
    let panel = new Panel("circle", color(255, 255, 255), 255, 1, 0, 0, 0);
    for (let i in node) {
      panel[i] = node[i];
      if (typeof(panel[i]) == "object") panel[i] = this.formData(panel[i]);
    }
    return panel;
  }
  this.downloadVideoArea = function(node) {
    //print(node.vid.path);
    let video = new VideoArea(node.vid.path, 20);
    //print("video");
    for (let i in node) {
      if (i != "vid") video[i] = node[i];
      //print(video[i], 1);
      if (i != "vid") video[i] = this.formData(video[i]);
      //print(video[i], 2);
    }
    //video.vid.play();
    video.setupObjects();
    return video;
  }
  this.saveData = function(object, path) {
    let list = [object, path];
    let count = 0;
    while (list.length != 0) {
      let o = list.shift();
      let path = list.shift();
      //print(path);
      for (let i in o) {
        //print(i);
        if (typeof(o[i]) != "object" &&
          typeof(o[i]) != "function") {
          //print(o[i], "o");
          let ref = this.database.ref(path + "/" + i);
          if (o[i] != undefined && !isNaN(o[i]) && o[i] != null) ref.set({
            v: o[i]
          });
        } else if (typeof(o[i]) == "object") {
          if (o[i].elt != undefined) {
            this.saveHtml(o[i], path + "/" + i)
          } else {
            //print(i);
            list.push(o[i]);
            list.push(path + "/" + i);
            count += 1;
          }
        }
      }
    }
  }
  this.savePage = function() {
    let path = this.ind;
    //print("save page");
    let page = this.pages[path];
    let ref = this.database.ref(page.pageAdress);
    print(this.ind, page);
    ref.once('value', function() {
      mainPage.lesson.data = {};
      mainPage.lesson.saveData(page.elements, path);
      print("finish", page.elements);
      //print(mainPage.lesson.data);
    });
    //ref.push(this.data);
  }
  this.formData = function(object) {
    if (object["localName"] != undefined) {
      object = this.downloadHtml(object);
      return object;
    }
    if (object["alpha"] != undefined) {
      //print("panel");
      object = this.downloadPanel(object);
      return object;
    }
    if (object["vid"] != undefined) {
      //print('vid');
      object = this.downloadVideoArea(object);
      return object;
    }
    if (object["v"] != undefined) {
      object = object["v"];
      return object;
    }
    if (object["maxes"] != undefined) {
      let r = object.levels[0].v;
      let g = object.levels[1].v;
      let b = object.levels[2].v;
      object = color(r, g, b);
      return object;
    }
    for (let i in object) {
      if (typeof(object[i]) == "object") {
        object[i] = this.formData(object[i]);
      }
    }
    return object;
  }
  this.downloadPage = async function(path) {
    let page = new Page(600, 600, this.treeBack.w + 10, path);
    let ref = this.database.ref(page.pageAdress);
    let ind = this.lesInd;

    await this.database.ref(page.pageAdress).once('value', function(data) {
      data = data.val();
      //print("download");
      this.count += 1;
      if (data != undefined) {
        let result = mainPage.lesson.formData(data);
        //print(result);
        if (typeof(result) == "string") {
          result = [];
        }
        page.elements = result;
      }
      mainPage.lesson.pages[path] = page;
      //print(page, "page");
      if (mainPage.lesson.page == undefined) {
        mainPage.lesson.setupLesson(mainPage.lesson.ind);
      }
    });
  }
  this.setup = function() {
    this.done = false;

    this.lesInd = lesInd;
    this.elem = null;
    this.elements = [];
    this.pages = {};
    this.show = false;
    this.count = 0;
    this.offset = 0;

    // our lessons part tree will be like a tree
    this.navbar = createDiv();
    this.navbar.id("i");
    this.navbar.class("navbar");
    this.navbar.style.width = "0px";
    this.tree = [];
    this.paragraphs = [];
    this.pathes = [];
    this.ind = "";

    this.lessonName = lessonName;
    this.database = database;
    this.lessonImage = createImg(imgPath, "image not loaded...");
    this.lessonImage.size(150, 150);
    this.lessonImage.position(x, y);
    this.lessonImage.mousePressed(function() {
      mainPage.lesson.showLesson()
    });
  }
  this.setup();
  this.addElemToTree = function(index, v) {
    let arr = this.navbar.elt.children;
    print(index, "index", arr.length);
    let path;
    let paragraph;
    if (v == "add node") {
      for (let i = index + 1; i < arr.length; i++) {
        let o = arr[i].position();
        arr.position(o.x, o.y + 35);
      }
      let word = arr[index].innerHTML + ".1";
      paragraph = createSpan(word);
      paragraph.size(word.length * 10, 35);
      let x = arr[index].x;
      let y = arr[index].y;
      let w = arr[index].getBoundingClientRect().width;
      let elem_w = paragraph.elt.getBoundingClientRect().width;
      paragraph.position(x + w, y + 35);
      paragraph.style("background:black");
      paragraph.style("font: 500 25px arial");
      paragraph.style("padding-top:-10px");
      paragraph.style("color:white");
      //path += i + "/";
      let len = arr.length;

      paragraph.mousePressed(function() {
        //print("mousePress");
        if (mouseButton == RIGHT) {
          let pick = createSelect();
          let x_word = paragraph.style.left;
          let y_word = paragraph.style.top;
          let x = int(x_word.slice(0, x_word.length-2)) + elem_w + 10;
          let y = int(y_word.slice(0, y_word.length-2));
          //print(x, x_word.slice(0, x_word.length-2));
          pick.position(x, y);
          pick.option("none");
          pick.option("close");
          pick.option("delete");
          pick.option("add node");
          pick.option("add page");
          pick.changed(function() {
            let v = pick.value();
            if (v == "delete") paragraph.remove();
            if (v == "close") pick.remove();
            if (v == "add node" || v == "add page") mainPage.lesson.addElemToTree(index + 1, v);
          });
        }
      });
    } else {
      for (let i = index + 1; i < this.paragraphs.length; i++) {
        let o = this.paragraphs[i].position();
        this.paragraphs[i].position(o.x, o.y + 35);
      }

      let word = this.paragraphs[index].elt.innerHTML + ".1";
      paragraph = createButton(word);
      //paragraph.size(word.length * 10, 35);
      let x = this.paragraphs[index].position().x;
      let y = this.paragraphs[index].position().y;
      let w = this.paragraphs[index].elt.getBoundingClientRect().width;
      paragraph.position(x + w, y + 35);
      paragraph.style("background:black");
      paragraph.style("font: 500 25px arial");
      paragraph.style("border: 0px");
      paragraph.style("border-radius: 5px");
      paragraph.style("color:white");
      //path += i + "/";

      paragraph.mouseMoved(function() {
        paragraph.style("background-color:white");
        paragraph.style("color:black");
      });
      paragraph.mouseOut(function() {
        paragraph.style("background-color:black");
        paragraph.style("color:white");
      });
      //path += i;
      paragraph.mousePressed(function() {
        if (mouseButton == LEFT) {
          let index = path + i;
          mainPage.lesson.ind = index;
          //print(path,i, mainPage.lesson.pages[index]);
          mainPage.lesson.page = mainPage.lesson.pages[index];
        }
      });
    }
    let bef = this.paragraphs.slice(0, index + 1);
    let aft = this.paragraphs.slice(index + 1);
    this.paragraphs = [];
    for (let i in bef) {
      this.paragraphs.push(bef[i]);
    }
    this.paragraphs.push(paragraph);
    for (let i in aft) {
      this.paragraphs.push(aft[i]);
    }

    this.navbar.elt.innerHTML = "";
    for (let i in this.paragraphs) {
      let p = this.paragraphs[i];
      this.navbar.elt.innerHTML += p.elt.outerHTML.replace(/"/g, "'");
    }

  }
  this.setupLessonTree = async function() {
    print("ff");
    this.treeBack = new Panel("rect", color(0, 0, 0), 255, 1, 0, 0, 200, height);
    this.treeStrip = new Panel("rect", color(255, 255, 255), 255, 1, 200, 0, 10, height);

    let Data;
    let ref = this.database.ref("Lessons/" + this.lessonName);
    ref.once('value', function(data) {
      print("fkdakfdk");
      data = data.val();
      if (data != undefined) {
        Data = data;
        mainPage.lesson.inNode(Data, 0, 0, "Lessons/" + mainPage.lesson.lessonName + "/");
        
        let saveButt = createButton("save");
        let w = saveButt.elt.getBoundingClientRect().width;
        let navW = mainPage.lesson.navbar.elt.getBoundingClientRect().width;
        saveButt.position(200 - 100 - 10, 0);
        print(w, navW);
        mainPage.lesson.navbar.elt.innerHTML += saveButt.elt.outerHTML.replace(/-/g, '.');
        print(mainPage.lesson.navbar.elt.outerHTML);
        mainPage.lesson.navbar.show();
        saveButt.hide();
        saveButt.remove();
        
        this.tree = data[1];
      }
      
      for (let i in mainPage.lesson.paragraphs) {
        mainPage.lesson.paragraphs[i].hide();
      }
      mainPage.lesson.loadPages();
      mainPage.lesson.done = true;
    });
  }
  this.setupLesson = function() {
    //print(this.ind, "ind");
    this.page = this.pages[this.ind];
  }

  this.loadPages = async function() {
    for (let i = 0; i < this.pathes.length; i++) {
      let elem = this.pathes[i];
      if (i == 0) {
        //print(this.pathes[i]);
        this.ind = this.pathes[i];
      }
      await this.downloadPage(this.pathes[i]);
    }
    if (this.pathes.length == 0) {
      this.page = new Page(600, 600, this.treeBack.w, "Lessons/" + this.lessonName);
    }
  }

  this.setupPickers = function() {
    let arr = this.navbar.elt.children;
    let count = 0;
    for (let i in arr) {
      //print(arr[i].tagName, "");
      if (arr[i].tagName == "SPAN") {
        count += 1;
        let paragraph = arr[i];
        let elem_w = paragraph.getBoundingClientRect().width;
        let index = i;
        arr[i].oncontextmenu = function() {
          if (mouseButton == RIGHT) {
            let pick = createSelect();
            let x_word = paragraph.style.left;
            let y_word = paragraph.style.top;
            let x = int(x_word.slice(0, x_word.length-2)) + elem_w + 10;
            let y = int(y_word.slice(0, y_word.length-2));
            //print(x, x_word.slice(0, x_word.length-2));
            pick.position(x, y);
            pick.option("none");
            pick.option("close");
            pick.option("delete");
            pick.option("add node");
            pick.option("add page");
            pick.changed(function() {
              let v = pick.value();
              if (v == "delete") paragraph.remove();
              if (v == "close") pick.remove();
              if (v == "add node" || v == "add page") mainPage.lesson.addElemToTree(count-1, v);
            });
          }
        }
      }
      if (arr[i].tagName == "BUTTON") {
        if (arr[i].innerHTML == "save") {
          arr[i].onclick = function() {
            print("save");
          };
        }
        count += 1; 
      }
    }
  }

  this.inNode = function(data, length, pos, path) {
    if (data != undefined) {
      for (let i in data) {
        if (typeof(data) === "string" || data.x != undefined || data.tagName != undefined) break;

        let paragraph;
        let len = this.paragraphs.length;
        if (typeof(data[i]) == "string" || data.x != undefined || data.tagName != undefined || data[i][0] != undefined) {
          paragraph = createButton(i.replace(/-/g, '.'));
          paragraph.position(pos + length, this.count * 35);
          let len = mainPage.lesson.paragraphs.length;
          /*paragraph.mouseMoved(function() {
            paragraph.style("background-color:white");
            paragraph.style("color:black");
          });
          paragraph.mouseOut(function() {
            paragraph.style("background-color:black");
            paragraph.style("color:white");
          });*/
          path += i;
          paragraph.mousePressed(function() {
            let index = path + i;
            mainPage.lesson.ind = index;
            print(path, i, mainPage.lesson.pages[index]);
            mainPage.lesson.page = mainPage.lesson.pages[index];
          });
          paragraph.show();
          //print(paragraph.elt.outerHTML);
          this.navbar.elt.innerHTML += paragraph.elt.outerHTML.replace(/"/g, "'");
          paragraph.hide();

          this.paragraphs.push(paragraph);
          //we go deeper in tree
          this.count++;
          let arr = path.split('/');
          this.pathes.push(path);
          arr.pop();
          path = "";
          for (let a = 0; a < arr.length; a++) {
            path += arr[a] + "/";
          }
        } else {
          paragraph = createSpan(i.replace(/-/g, '.'));
          paragraph.size(i.length * 10, 35);
          paragraph.position(pos + length, this.count * 35);
          //paragraph.style("background:none");
          //paragraph.style("font: 500 25px arial");
          //paragraph.style("padding: 0px 0px");
          paragraph.style("color:white");
          path += i + "/";

          let word = "";
          word = paragraph.elt.outerHTML.slice(0, 6) + word + paragraph.elt.outerHTML.slice(6);

          //print(word);

          paragraph.show();
          elem_w = length;
          //func();
          //let onclick = paragraph.elt.getAttribute("onclick");
          //paragraph.elt.setAttribute("oncontextmenu", "mainPage.lesson.onSpanPress(paragraph, elem_w);");
          print(paragraph.elt.outerHTML.replace(/"/g, "'"));
          this.navbar.elt.innerHTML += paragraph.elt.outerHTML.replace(/"/g, "'");
          paragraph.hide();

          //we go deeper in tree
          this.count++;
          this.paragraphs.push(paragraph);
          this.inNode(data[i], i.length * 10, pos + length, path);
          let arr = path.split('/');
          arr.pop();
          arr.pop();
          path = "";
          for (let a = 0; a < arr.length; a++) {
            path += arr[a] + "/";
          }
        }
      }
    }
  }

  this.drawTree = function() {
    this.treeBack.draw();
    this.treeStrip.draw();
    if (this.elem != null) {
      this.elem.show();
      //print(this.elem.x);
    }
  }
  this.drawLoad = function() {
    if (this.loadBack == undefined) {
      this.loadBack = new Panel("rect", color(0, 0, 0), 255, 1, 0, 0, width, height);
    } else {
      this.loadBack.draw();
    }

    if (this.loadText == undefined) {
      this.loadText = createSpan("Loading...");
      this.loadText.style("background:none");
      this.loadText.style("color: white");
      this.loadText.style("border: 0px");
      this.loadText.style("font: 800 50px arial");
      let w = this.loadText.elt.getBoundingClientRect().width;
      let h = this.loadText.elt.getBoundingClientRect().height;
      //print(w, h);
      this.loadText.position(width / 2 - w / 2, height / 2 - h / 2);
    }
  }

  this.showLesson = async function() {
    this.show = true;
    this.navbar.style.width = "200px";
    //this.drawLoad();
    await this.setupLessonTree();
    print("done");
    if (!mainPage.logged) {
      mainPage.signInFunc();
    }
    this.navbar.style.width = "200px";
  }
  this.mouseDragg = function() {
    if (this.page != undefined) this.page.mouseDragg();
  }
  this.draw = function() {
    if (this.page == undefined) {
      this.done = false;
      this.drawLoad();
      return;
    } 
    else {
      openNav();
      this.setupPickers();
      if (!this.done) {
        try {
          this.loadText.hide();
        } catch (err) {}
      }
      this.done = true;
    }
    this.elements = this.page.elements;
    if (this.show) {
      this.page.draw();
      this.drawTree();
      this.page.add.show();
      this.page.save.show();
    }
  }
}
