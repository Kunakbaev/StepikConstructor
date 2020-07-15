function button(w, h, x, y, c) {
  this.w = w;
  this.h = h;
  this.x = x;
  this.y = y;
  
  this.color = color(c, c, c);
  this.draw = function() {
     fill(this.color);
     rect(this.x, this.y, this.w, this.h);
  }
  this.isClicked = function() {
    if (mouseX > this.x && mouseX < this.x + this.w
       && mouseY > this.y & mouseY < this.h + this.y) {
      return true;
    }
    return false;
  }
}
