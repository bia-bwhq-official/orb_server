function Id(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';let result = '';
    for (let i = 0; i < length; i++) {  result += characters.charAt(Math.floor(Math.random() * characters.length));}
    return result;
  }

  function collision(a, b) {
    check = 0;
    if($("#" + a).length){
      check++;
    }
    if($("#" + b).length){
      check++;
    }
    if(check == 2){
    const rect1 = document.getElementById(a).getBoundingClientRect();
    const rect2 = document.getElementById(b).getBoundingClientRect();
    const isInHoriztonalBounds =
      rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
    const isInVerticalBounds =
      rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
    const isOverlapping = isInHoriztonalBounds && isInVerticalBounds;
    return isOverlapping;
    }
    if(check < 2){
      return;
    }
}

var redlist = ["bla1"];
var bluelist = ["bla2"];
var yellowlist = ["bla3"];
var greenlist = ["bla4"];

var energyThresh = 80;
var population = 0;
function square(type, newx, newy){
    population++;
    document.getElementById("p").innerHTML = "population: " + population;
    var localId = Id(5);
    var x = Math.floor(Math.random() * $("html").width());
    var y = Math.floor(Math.random() * $("html").height());
    if(newx !== undefined)x=newx;
    if(newy !== undefined)y=newy;
    var direction = {left: false, right: false, up: false, down: false}
    var directions = ["left","right","up","down"];

    var chanc = directions[Math.floor(Math.random() * directions.length)];

    direction[chanc] = true;
    var canEffect = true;
    var canCopy = true;

    var size = 30;
    var rateX = 0;
    var rateY = 0;
    var hp = 20;

    if(type == "red"){
      //size = 160;
      rateX = Math.floor(Math.random() * 8 - 6) + 6;
      rateY = Math.floor(Math.random() * 8 - 6) + 6;
      redlist = [...redlist, localId];
    }
    if(type == "blue"){
      //size = 100;
      rateX = Math.floor(Math.random() * 11 - 8) + 8;
      rateY = Math.floor(Math.random() * 11 - 8) + 8;
      bluelist = [...bluelist, localId];
    }
    if(type == "yellow"){
      //size = 50;
      rateX = Math.floor(Math.random() * 11 - 8) + 8;
      rateY = Math.floor(Math.random() * 11 - 8) + 8;
      yellowlist = [...yellowlist, localId];
    }
    if(type == "green"){
      //size = 30;
      rateX = Math.floor(Math.random() * 5 - 2) + 2;
      rateY = Math.floor(Math.random() * 5 - 2) + 2;
      greenlist = [...greenlist, localId];
    }
    
    var bordersize = size / 1.314;
    $("body").append("<div id='"+localId+"' style='background-color:"+type+";width:"+size+"px;height:"+size+"px;position:absolute;left:"+x+"px;top:"+y+"px;border-radius:"+bordersize+"px'></div>")
    
    setTimeout(() => {
        const newsquare = document.getElementById(localId);
        
        if(type == "red"){
        newsquare.style.zIndex = "1";
        }
        if(type == "blue"){
          newsquare.style.zIndex = "2";
        }
        if(type == "yellow"){
          newsquare.style.zIndex = "3";
        }
        setInterval(() => {
          hp-=0.01;
          if(greenlist.some(r => collision(localId, r))){
            hp+=1;
          }
          if(type == "red"){
             if(redlist.some(redid => collision(localId, redid)) && hp > energyThresh && canCopy == true){
              square("red",x,y);
              canCopy = false;
              hp-=20;
              setTimeout(() => {canCopy = true;},3100);
            } 
            bluelist.every((id) => {
              if(collision(localId, id)){
                var blueleft = parseInt(document.getElementById(id).style.left);
                var bluetop = parseInt(document.getElementById(id).style.top);
  
                if(blueleft > x){
                  direction.left = true;
                  direction.right = false;
                } else {
                  direction.left = false;
                  direction.right = true;
                }
                if(bluetop > y){
                  direction.up = true;
                  direction.down = false;
                } else {
                  direction.up = false;
                  direction.down = true;
                }
              } else {
              return "checked";
              }
            });
          } 
          if(type == "blue"){
             if(bluelist.some(redid => collision(localId, redid)) && hp > energyThresh && canCopy == true){
              square("blue",x,y);
              canCopy = false;
              hp-=20;
              setTimeout(() => {canCopy = true;},3100);
            } 
            redlist.every((id) => {
              if(collision(localId, id)){
                var redleft = parseInt(document.getElementById(id).style.left);
                var redtop = parseInt(document.getElementById(id).style.top);
  
                if(redleft > x ){
                  direction.right = true;
                  direction.left = false;
                } else {
                  direction.right = false;
                  direction.left = true;
                }
                if(redtop > y){
                  direction.down = true;
                  direction.up = false;
                } else {
                  direction.down = false;
                  direction.up = true;
                }
              } else {
              return "checked";
              }
            });
            yellowlist.every((id) => {
              if(collision(localId, id)){
                var redleft = parseInt(document.getElementById(id).style.left);
                var redtop = parseInt(document.getElementById(id).style.top);
  
                if(redleft > x ){
                  direction.left = true;
                  direction.right = false;
                } else {
                  direction.left = false;
                  direction.right = true;
                }
                if(redtop > y){
                  direction.up = true;
                  direction.down = false;
                } else {
                  direction.up = false;
                  direction.down = true;
                }
              } else {
              return "checked";
              }
            });
            
           }
          if(type == "yellow"){
             if(yellowlist.some(redid => collision(localId, redid)) && hp > energyThresh && canCopy == true){
              square("yellow",x,y);
              canCopy = false;
              hp-=20;
              setTimeout(() => {canCopy = true;},3100);
            } 
            bluelist.every((id) => {
              if(collision(localId, id)){
                var blueleft = parseInt(document.getElementById(id).style.left);
                var bluetop = parseInt(document.getElementById(id).style.top);
  
                if(blueleft > x){
                  direction.left = true;
                  direction.right = false;
                } else {
                  direction.left = false;
                  direction.right = true;
                }
                if(bluetop > y){
                  direction.up = true;
                  direction.down = false;
                } else {
                  direction.up = false;
                  direction.down = true;
                }
              } else {
              return "checked";
              }
            });
            redlist.every((id) => {
              if(collision(localId, id)){
                var redleft = parseInt(document.getElementById(id).style.left);
                var redtop = parseInt(document.getElementById(id).style.top);
  
                if(redleft > x ){
                  direction.right = true;
                  direction.left = false;
                } else {
                  direction.right = false;
                  direction.left = true;
                }
                if(redtop > y){
                  direction.down = false;
                  direction.up = true;
                } else {
                  direction.down = true;
                  direction.up = false;
                }
              } else {
              return "checked";
              }
            });
            
          }
          if(type == "green"){
            if(yellowlist.some(redid => collision(localId, redid))){
              newsquare.remove();
            }
            if(redlist.some(redid => collision(localId, redid))){
              newsquare.remove();
            }
            if(bluelist.some(redid => collision(localId, redid))){
              newsquare.remove();
            }
          }
          if(x > $("html").width()){
            x = 100;
            direction.right = true;
          }
          if(x < 0){
            x = $("html").width() - 100;
            direction.left = true;
          }
          if(y > $("html").height()){
            y = 100;
            direction.down = true;
          }
          if(y < 0){
            y = $("html").height() - 100;
            direction.up = true;
          }

            if(direction.left == true){
                x-=rateX;
            }
            if(direction.right == true){
                x+=rateX;
            }
            if(direction.up == true){
                y-=rateY;
            }
            if(direction.down == true){
                y+=rateY;
            }
            
           
            newsquare.style.left = x + "px";
            newsquare.style.top = y + "px";
            newsquare.innerHTML = hp;

             if(hp < 0.1 && canEffect == true){
              newsquare.remove();
              population--;
              canEffect = false;
              return;
            } 
            console.log(direction);
        },30)
    },1000);

}

for(i=0;i<100;i++){
  square("red");
  square("blue");
  square("yellow");
}

var newfood = 0;
var foodrate = 50;
var foodthresh = 100;
setInterval(() => {
  newfood+=foodrate;

  if(newfood > foodthresh){
    square("green")
    newfood = 0;
  }
},300)
