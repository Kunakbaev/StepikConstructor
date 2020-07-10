function VideoArea(path, offset) {
  this.see = true;
  
  this.path = path;
  this.offset = offset;
  this.playing = false;
  this.lastCursorPos = [mouseX, mouseY];
  this.time = 1;
  this.timer = this.time;

  // width of video area
  this.vid = createVideo(this.path);
  this.w = width - 2 * this.offset;
  this.h = this.w / 2;
  this.vid.size(this.w, this.h);
  this.vid.hide();
  this.vid.position(20, 20);
  
  var pauseRectW = 50;
  this.rW = 10;
  // coordinates of centre video
  var centreX = this.offset + this.w / 2 + 5;
  var centreY = this.offset + this.h / 2;
  //this.completion = this.vid.time() / this.vid.duration();
  this.completion = 0;
  var d = 0.9 * this.rW;
  var di = 60;
  var r = 18;
  
  // ----------- objects -----------------------------------------------
  this.full = new button(50, 50, width / 2, height / 2, 255);
  
  this.pauseBackground = new Panel("rect", color(0, 0, 0), 80, 2,               this.offset, this.offset, this.w, this.h);
  
  this.playPause1 = new Panel("rect", color(0, 0, 0), 255, 3, centreX - pauseRectW / 2, centreY - pauseRectW / 2, pauseRectW / 3, pauseRectW);
  this.playPause2 = new Panel("rect", color(0, 0, 0), 255, 3, centreX - pauseRectW / 2 + 30, centreY - pauseRectW / 2, pauseRectW / 3, pauseRectW);
  
  //print(this.completion);
  this.timeCircle = new Panel("circle", color(0, 0, 0),255,5,this.completion * this.w + this.offset, this.h + this.offset - this.rW / 2, d);
  
  this.progressBack = new Panel("rect", color(255, 255, 255), 255, 3, this.offset, this.h + this.offset - this.rW, this.w, this.rW);
  
  this.progressRect = new Panel("rect", color(127, 127, 127), 255, 4, this.offset, this.h + this.offset - this.rW, this.completion * this.w, this.rW);
  
  this.pauseCircle = new Panel("circle", color(0, 0, 0), 255, 3, this.offset + this.w / 2, this.offset + this.h / 2, di);
  
  this.pauseTriang = new Panel("triangle", color(255, 255, 255), 255, 4,
centreX - r, centreY - r, centreX + 0.9 * r, centreY, centreX - r, 
centreY + r);
  
  // ----------- objects list ---------------------------------------------
  this.objects = [this.playPause1, this.playPause2, this.pauseBackground,
      this.timeCircle, this.progressBack, this.progressRect, this.pauseTriang, this.pauseCircle];
  
  /*this.objects.push(this.playPause1);
  this.objects.push(this.playPause2);
  this.objects.push(this.pauseBackground);
  this.objects.push(this.timeCircle);
  this.objects.push(this.progressBack);
  this.objects.push(this.fullScreen);
  this.objects.push(this.progressRect);*/

  this.ShowAtributes = function() {
    if (this.playing) {
      //this.pauseBackground.draw();
      this.pauseBackground.see = true;
    }
    
    this.lastCursorPos[0] = mouseX;
    this.lastCursorPos[1] = mouseY;
    
    //this.progressBack.draw();
    
    //this.progressRect.draw();
    this.progressRect.w = completion * this.w;
    
    // procent of video that we watch
    //this.timeCircle.draw();
    this.timeCircle.x = completion * this.w + this.offset;
    
    this.timeCircle.see = true;
    this.progressBack.see = true;
    this.progressRect.see = true;
    
    if (this.playing) {
      //this.playPause1.draw();
      //this.playPause2.draw();
      this.playPause1.see = true;
      this.playPause2.see = true;
    }
  }
  this.sorting = function() {
    let o = this.objects;
    var list = [];
    for (let a = 0; a < o.length; a++) {
      list.push(o[a].layer);
    }
    for (let a = 0; a < list.length; a++) {
      let ma = max(list.slice(a));
      let maInd = list.slice(a).indexOf(ma) + a;
      let x = list[a];
      list[a] = ma;
      list[maInd] = x;
      
      x = o[a];
      o[a] = o[maInd];
      o[maInd] = x;
    }
  }
  this.sorting();
  this.update = function() {
    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].see = false;
    }
    
    completion = this.vid.time() / this.vid.duration();
    
    this.leftStart = this.offset;
    this.topStart = this.offset + this.h;
    
    if (!this.playing && this.timer < this.time) {
      noStroke();
      //this.pauseBackground.draw();
      
      //this.pauseCircle.draw();
      
      //this.pauseTriang.draw();
      
      this.pauseBackground.see = true;
      this.pauseCircle.see = true;
      this.pauseTriang.see = true;
    }
    
    if (this.lastCursorPos[0] != mouseX || 
        this.lastCursorPos[1] != mouseY) {
      this.timer = 0
    }
    if (this.timer < this.time) {
      // because in seconds 1000 miliseconds
      this.timer += deltaTime / 1000;
      this.ShowAtributes();
    }
  }
  this.draw = function() {
    image(this.vid, this.offset, this.offset, this.w, this.h);
    for (let i = this.objects.length-1; i > -1; i --) {
      if (this.objects[i].see) this.objects[i].draw();
    }
    this.full.draw();
  }
  
  // check is curcor on a slider
  this.CheckForSliderArea = function() {
    if (this.timer < this.time) {
      if (mouseX > this.leftStart && mouseX < this.leftStart + this.w 
          && mouseY > this.h + this.offset - this.rW
          && mouseY < this.h + this.offset)
        return true;
      return false; 
    }
  }
  
  // check is cursor on a video
  this.CheckForPauseArea = function() {
    if (this.timer == this.time) {
      var l = this.offset;
      var t = this.offset;
      if (mouseX > l && mouseX < l + this.w 
          && mouseY > t && mouseY < t + this.h)
        return true;
      return false;
    }
    else {
      var l = this.offset;
      var t = this.offset;
      if (mouseX > l && mouseX < l + this.w 
          && mouseY > t && mouseY < t + this.h - this.rW)
        return true;
      return false; 
    }
  }
  
  this.FullScreen = function() {
    this.w = width - this.offset * 2;
    this.h = height - this.offset * 2;
  }
  
  this.mouseClick = function() {
    let res = false;
    for (let i = 0; i < this.objects.length; i ++) {
      if (this.objects[i].showSettings == true) { 
        res = true;
        break;
      }
    }
    if(res == false) {
      this.full.isClicked();
      if(this.full.clicked) {
        this.FullScreen(); 
      }
    
      if (this.CheckForSliderArea()) 
        this.vid.time(((mouseX - this.offset) / this.w) *                                this.vid.duration());
      if (this.CheckForPauseArea()) {
        if (!this.playing) {
          this.vid.play();
          this.playing = true;
          this.timer = 0;
        }
        else {
          this.vid.pause();
          this.playing = false;
          this.timer = 0;
        }
      }   
    }
  }
  
  this.doubleClick = function() {
    //print("start");
    let res = false;
    for (let i = 0; i < this.objects.length; i ++) {
      if (this.objects[i].showSettings == true) { 
        res = true;
        //print("locked");
        this.objects[i].CheckForIn();
      }
    }
    print(res);
    if (res == false) {
      for (let i = 0; i < this.objects.length; i ++) {
        if(this.objects[i].see == true) {   
          //print("");
          this.objects[i].CheckForIn();
          if (this.objects[i].showSettings) break;
        }
      } 
    }
    print("end");
    /*for (let i = 0; i < this.objects.length; i ++) {
      if(this.objects[i].see == true) {   
        this.objects[i].CheckForIn();
      }
    }*/
  }
}
