function Panel(form, c, alpha, layer, w = 10, h = 10, x = 0, y = 0, 
                  r = 50,x1 = 0, y1 = 0, x2 = 10, y2 =10, x3 = 20, y3 = 20){
  // 3 variants of form : 
  //   * rect
  //   * circle
  //   * triangle
  this.indexes = [];
  
  this.panelW = 200;
  this.panelH = 100;
  
  this.see = true;
  this.form = form;
  this.showSettings = false;
  if (this.form == "rect") {
    this.x = arguments[4];
    this.y = arguments[5];
    this.w = arguments[6];
    this.h = arguments[7];

    this.panCornX = this.x - this.panelW;
    this.panCornY = this.y - this.panelH;
    
    this.wSlider = createSlider(1, width, this.w);
    this.wSlider.position(this.panCornX, this.panCornY + 50);
    
    this.hSlider = createSlider(1, width, this.h);
    this.hSlider.position(this.panCornX, this.panCornY + 60);
  }
  if (this.form == "circle") {
    this.x = arguments[4];
    this.y = arguments[5];
    this.r = arguments[6];
    
    this.panCornX = this.x - this.panelW;
    this.panCornY = this.y - this.panelH;
    
    this.rSlider = createSlider(0.1, width, this.r);
    this.rSlider.position(this.panCornX, this.panCornY + 40);
  }
  if (this.form == "triangle") {
    this.x1 = arguments[4];
    this.y1 = arguments[5];
    this.x2 = arguments[6];
    this.y2 = arguments[7];
    this.x3 = arguments[8];
    this.y3 = arguments[9];
    this.x = this.x1;
    this.y = this.y1;
    
    this.panCornX = this.x - this.panelW;
    this.panCornY = this.y - this.panelH;
  }
  this.variables = arguments;
  //this.variables += [this.panelW, this.panelH];
  if(this.panCornX < 0) {
    this.panCornX += this.panelW;
  }
  if(this.panCornY < 0) this.panCornY += this.panelH;
  
  this.color = c;
  this.alpha = alpha
  this.color.setAlpha(this.alpha);
  this.alphaSlider = createSlider(0, 255, this.alpha);

  this.layer = layer;
  
  this.colorPicker = createColorPicker(this.color);
  this.colorPicker.position(this.panCornX, this.panCornY);
  this.alphaSlider.position(this.panCornX, this.panCornY + 15);
  
  this.low = new button(20, 20, this.panCornX,this.panCornY + 20, 255);
  this.high = new button(20, 20, this.panCornX + 30, this.panCornY + 20, 255);
  this.close = new button(20, 20, this.x - 20, this.panCornY, 0)
  
  this.colorPicker.hide();
  this.alphaSlider.hide();
  if (this.form == "rect") {
    this.wSlider.hide();
    this.hSlider.hide();
  }
  if (this.form == "circle") {
    this.rSlider.hide();
  }
  if (this.form == "triangle") {}
  
  
  // ------------ draw -----------------------------------------------
  
  this.draw = function() {
    this.colorPicker.hide();
    this.alphaSlider.hide();
    if (this.form == "rect") {
      this.wSlider.hide();
      this.hSlider.hide();
    }
    if (this.form == "circle") {
      this.rSlider.hide();
    }
    if (this.form == "triangle") {}
    //print(this.color);
    this.color.setAlpha(this.alpha);
    fill(this.color);
    if (this.form == "rect") rect(this.x, this.y, this.w, this.h);
    if (this.form == "circle") circle(this.x, this.y, this.r);
    if (this.form == "triangle") triangle(this.x1, this.y1, this.x2, this.y2,
                                          this.x3, this.y3);
    
    if (this.showSettings) {
      this.drawSettings();
    }
  }
  
  // ------------ draw settings --------------------------------------
  
  this.drawSettings = function() {
    this.panCornX = this.x - this.panelW;
    this.panCornY = this.y - this.panelH;
    
    if(this.panCornX < 0) this.panCornX += this.panelW;
    if(this.panCornY < 0) this.panCornY += this.panelH;
    
    this.colorPicker.position(this.panCornX, this.panCornY);
    this.alphaSlider.position(this.panCornX, this.panCornY + 15);
    //print(this.panCornX, this.panCornY);
    
    for (let i = 0; i < Objects.length; i += 1) {
      if(Objects[i].see == true) this.indexes.push(i);
    }
    
    let a = 0;
    for (var i = 0; i < Objects.length; i += 1) {
      if (Objects[i] != this && this.indexes[a] != i) {
        Objects[i].see = false; 
      }
      else a++;
    }
    if (this.form == "rect") {
      this.wSlider.position(this.panCornX, this.panCornY + 50);
      this.hSlider.position(this.panCornX, this.panCornY + 60);
      
      this.wSlider.show();
      this.hSlider.show();
      
      this.w = this.wSlider.value();
      this.h = this.hSlider.value();
    }
    if (this.form == "circle") {
      this.rSlider.position(this.panCornX, this.panCornY + 40);
      
      this.rSlider.show();
      this.r = this.rSlider.value();
    }
    if (this.form == "triangle") {}
    
    fill(255);
    rect(this.panCornX, this.panCornY, this.panelW,               this.panelH);
    
    this.alphaSlider.show();
    this.alpha = this.alphaSlider.value();
    
    this.colorPicker.show();
    this.color = this.colorPicker.color();
    
    this.low.draw();
    this.high.draw();
    this.close.draw();
  }
  
  // ------------ triangle area --------------------------------------
  
  this.triangleArea = function(x1, y1, x2, y2, x3, y3) {
    return abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)));
  }
  
  // ------------ check in area
  
  this.checkInTriangle = function(x, y) {
    A = this.triangleArea(this.x1, this.y1, this.x2, 
                          this.y2, this.x3, this.y3); 
    A1 = this.triangleArea(x, y, this.x2, 
                          this.y2, this.x3, this.y3); 
    A2 = this.triangleArea(this.x1, this.y1, x,
                          y, this.x3, this.y3);
    A3 = this.triangleArea(this.x1, this.y1, this.x2, 
                          this.y2, x, y); 
    //print(A, A1, A2, A3, A1 + A2 + A3);
    if (abs(A - (A1 + A2 + A3)) < 0.01) return true;
    return false;
  }
  
  // ------------ check for in
  
  this.CheckForIn = function() {
    if(this.form == "rect") {
      if (mouseX > this.x && mouseX < this.x + this.w &&
        mouseY > this.y && mouseY < this.y + this.h) {
        this.showSettings = !this.showSettings;
        //this.drawSettings();
        
        if (!this.showSettings) {
          let a = 0;
          for (let i = 0; i < Objects.length; i += 1) {
            if(i == this.indexes[a]) {
              Objects[i].see = true;
              a++;
            }
            else Objects[i].see = false;
          }
        
          // because later figures position can be changed
          this.indexes = [];
          
          this.colorPicker.hide();
          this.alphaSlider.hide();
          if (this.form == "rect") {
            this.wSlider.hide();
            this.hSlider.hide();
          }
          if (this.form == "circle") {
            this.rSlider.hide();
          }
          if (this.form == "triangle") {}
          if(video.playing) video.vid.play();
        }
      }
    }
    if(this.form == "circle") {
      if (abs(mouseX - this.x) < this.r && abs(mouseY - this.y) < this.r) {
        this.showSettings = !this.showSettings; 
        if (!this.showSettings) {
          let a = 0;
          for (let i = 0; i < Objects.length; i += 1) {
            if(i == this.indexes[a]) {
              Objects[i].see = true;
              a++;
            }
            else Objects[i].see = false;
          }
        
          // because later figures position can be changed
          this.indexes = [];
          this.colorPicker.hide();
          this.alphaSlider.hide();
          if (this.form == "rect") {
            this.wSlider.hide();
            this.hSlider.hide();
          }
          if (this.form == "circle") {
            this.rSlider.hide();
          }
          if (this.form == "triangle") {}
          
          if(video.playing) video.vid.play();
        }
        //this.drawSettings();
      }
    }
    if (this.form == "triangle") {
      if (this.checkInTriangle(mouseX, mouseY)) {
        this.showSettings = !this.showSettings; 
        if (!this.showSettings) {
          let a = 0;
          for (let i = 0; i < Objects.length; i += 1) {
            if(i == this.indexes[a]) {
              Objects[i].see = true;
              a++;
            }
            else Objects[i].see = false;
          }
        
          // because later figures position can be changed
          this.indexes = [];
          this.colorPicker.hide();
          this.alphaSlider.hide();
          if (this.form == "rect") {
            this.wSlider.hide();
            this.hSlider.hide();
          }
          if (this.form == "circle") {
            this.rSlider.hide();
          }
          if (this.form == "triangle") {}
          if(video.playing) video.vid.play();
        }
        //this.drawSettings();
      }
    }
  }
  //print("Panel Function: ", arguments);
}
