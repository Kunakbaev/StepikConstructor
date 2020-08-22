function Database() {
  // ------------------- firebase config ----------------------------
  
  this.firebaseConfig = {
    apiKey: "AIzaSyCTV7HzlcXaHZwKjvmoyLbLcSLgpMMQXSU",
    authDomain: "databasefmessenger.firebaseapp.com",
    databaseURL: "https://databasefmessenger.firebaseio.com",
    projectId: "databasefmessenger",
    storageBucket: "databasefmessenger.appspot.com",
    messagingSenderId: "381856091790",
    appId: "1:381856091790:web:893be310b64d29db6003df",
    measurementId: "G-QW341CYDR8"
  };
  // Initialize Firebase
  this.firebase = firebase;
  this.firebase.initializeApp(this.firebaseConfig);
  this.database = this.firebase.database();
  this.ref = this.database.ref('interface/standart');
  
  this.saveDefaultInterface = function(path, removeRef) {
    let r = this.database.ref(path);
    if(removeRef) {
      r.remove();
      r = this.database.ref(path);
    }
    r.once('value', function(snapshot) {
      if(snapshot.val() == null) {
        for (let i = 0; i < Objects.length; i++) {
          let data = {}
          let o = Objects[i];
          for (let i in o) {
            print(o[i], typeof(o[i])); 
            if((typeof(o[i]) != "object" && typeof(o[i]) !="function") || 
              o[i].mode == 'rgb')
               data[i] = o[i];
          }
          r.push(data);
        }
      }
    });
  }
  this.clearRef = function(path) {
    r = this.database.ref(path);
    r.remove();
  }
  //this.saveDefaultInterface('interface/standart', true);
  this.goodData = function(data) {
    data = data.val();
    //print(data);
    if (data != null) {
      var keys = Object.keys(data);
      //print(keys);
      for (let i = 0; i < keys.length; i ++) {
        //var o = Objects[i];
        var k = keys[i];
        for (let a in data[k]) {
          //print(data[k][a]);
          if(a == "color") {
            //fill(data[k][a]);
            print(data[k][a]);
            let r = data[k][a].levels[0];
            let g = data[k][a].levels[1];
            let b = data[k][a].levels[2];
            Objects[i][a] = color(r, g, b);
            Objects[i].colorPicker = createColorPicker(color(r, g, b));
            Objects[i].colorPicker.position(Objects[i].panCornX, Objects[i].panCornY);
            Objects[i].colorPicker.hide();
            
            Objects[i].alphaSlider = createSlider(0, 255, data[k]["alpha"]);
            Objects[i].alphaSlider.position(Objects[i].panCornX, Objects[i].panCornY + 15);
            Objects[i].alphaSlider.hide();
          }
          else Objects[i][a] = data[k][a];
          if(a == "form") {
            if (data[k][a] == "rect") {
              Objects[i].wSlider = createSlider(1, width, data[k]['w']);
              Objects[i].wSlider.position(Objects[i].panCornX, Objects[i].panCornY + 50);
              Objects[i].wSlider.hide();
              
              Objects[i].hSlider = createSlider(1, width, data[k]['h']);
              Objects[i].hSlider.position(Objects[i].panCornX, Objects[i].panCornY + 60)
              Objects[i].hSlider.hide();
            }
            if (data[k][a] == "circle") {
              print("circle", data[k]['r']);
              Objects[i].rSlider = createSlider(0, width, data[k]['r']);
              Objects[i].rSlider.position(Objects[i].panCornX, Objects[i].panCornY + 40);
              Objects[i].rSlider.hide();
            }
            if (data[k][a] == "triangle") {
              
            }
          }
        }
      }
    }
  }
  this.badError = function(error) {
    print('Error!');
    print(error);
  }
  this.downloadDefInterface = function(path) {
    var r = this.database.ref(path);
    r.on('value', this.goodData, this.badError);
  }
  //this.downloadDefInterface('interface/standart');
}
