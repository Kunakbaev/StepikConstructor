function UsersDatabase(database) {
  this.addUser = function(name, surname, email, password) {
    print(name, surname, email, password);
    let ref = this.database.ref("users/" + email);
    let data = {
      email: email,
      password: password,
      surname: surname,
      name: name
    };
    ref.once('value', function(snapshot) {
      if(snapshot.val() == null) {
        ref.push(data);
      }
      else {
        mainPage.showWarning(); 
      }
    });
  }
  
  // Initialize Firebase
  this.database = database;
  
  this.greeting = function(name) {
    let elem = createSpan("Hello " + name + "!");
    let back = color(0, 0, 0);
    back.setAlpha(127);
    elem.style("color: white");
    elem.style("font: 800 40px arial");
    let w = elem.elt.getBoundingClientRect().width;
    let h = elem.elt.getBoundingClientRect().height;
    let x_offset = (width - w) / 2;
    let y_offset = (height - h) / 2;
    x_offset = str(x_offset) + "px";
    y_offset = str(y_offset) + "px";
    let word = y_offset + " " + x_offset + " " + y_offset + " " + x_offset;
    elem.style("padding", word);
    elem.position(0, 0);
    elem.style("transition: background-color 500ms linear");
    elem.style("background", back);
    setTimeout(function() {
      let c = color(255, 255, 255);
      c.setAlpha(0);
      elem.style("color", c);
      c = back;
      c.setAlpha(0);
      elem.style("background-color", c);
      setTimeout(function() {
        elem.remove();
      }, 500);
    }, 500);
  }
  this.logIn = function(email, password) {
    print(email, password);
    let ref = this.database.ref("users/" + email);
    ref.once("value", function(data) {
      data = data.val();
      if (data != null) {
        let key = Object.keys(data)[0];
        print(key);
        let email = data[key].email;
        let name = data[key].name;
        let surname = data[key].surname;
        let pass = data[key].password;
        print(data);
        for (let i in data) {
          print(i, data[i]); 
        }
        print(pass, password);
        if (pass != password) {
          print("incorrect password");
        } else {
          let symbols = name[0] + surname[0];
          mainPage.user = new User(surname, name, email, password, "");
          mainPage.user.showSymbols(symbols);
          userBase.greeting(name);
        }
      } else {
        print("no user find with this email"); 
      }
    });
  }
}
