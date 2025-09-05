const anim = {
  fadeIn: function(ob) {
    let target = document.getElementById(ob);
    let opacity = 0.01;
    target.style.opacity = opacity;
    setInterval(() => {
      if(opacity < 1){
        opacity+=0.05;
        target.style.opacity = opacity;
      }
      if(opacity > 1){
        return;
      }
    },100)
  }
}

document.onload = () => {
  anim.fadeIn("menu");
}