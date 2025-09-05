const socket = io("https://66d0922a-7c82-4d08-8d48-8f6493211ca5-00-3n1ql7tdxc6zt.worf.replit.dev/");
var incomingUser = '';
var avatar = "/src/dog1.png";
var msgAvatar = "/src/dog1.png";
var guestid = "0123456789_abcdefghijklmnopqrstuvwxyz".split("")
var username = 'Guest ID #' + random(guestid) + random(guestid) + random(guestid) + random(guestid);
////

window.onload = () => {
  let c = getCookie("username");

  if(c !== ""){
    setUser(getCookie("username"));
  } else {
    return;
  }
}
$("#user_label").html("Current user: " + username);

socket.on('name', data => {
  incomingUser = data;
})
socket.on('message', data => {
  $("#chat").append('<div id="user_cont"><div id="avatar"><img id="pfp" src="' + msgAvatar + '"></img></div><div id="msg"><p class="userAt">' + incomingUser + ' said:</p><p class="dialogue_medium">' + data + '</p></div></div><hr>');
  var objDiv = document.getElementById("chat");
    objDiv.scrollTop = objDiv.scrollHeight;
})
socket.on('updateUsers', data => {
  $("#usersOnline").html("Users online: " + data);
})
socket.on('newConnection', data => {
  $("#chat").append("<p class='segoe' style='color: black;'>Somebody just joined! Say hi!</p><hr>")
})
socket.on('avatarSet', data => {
  msgAvatar = data;
})


////


function random(inp) {
  let str = inp[Math.floor(Math.random()*inp.length)];
  return str;
}
function setUser(user) {
  $("#user_label").html("Current user: " + username);
  username = user;
  socket.emit('name', username);
  setCookie("username",username,30);
}
function sendMsg(msg) {
  setUser(username);
  setAvatar(avatar);
  socket.emit('message', msg);
  $("#chat").append('<div id="user_cont"><div id="avatar"><img id="pfp" src="' + avatar + '"></img></div><div id="msg"><p class="userAt">You said:</p><p class="dialogue_medium">' + msg + '</p></div></div><hr>');
  var objDiv = document.getElementById("chat");
  objDiv.scrollTop = objDiv.scrollHeight;
  $("#clientmsg").val('');
  }
function setAvatar(pfp) {
  avatar = pfp;
  socket.emit('avatarSet', avatar);
  $(".myPfp").attr("src", avatar);
}

//stolen from w3schools wtf
function setCookie(cname,cvalue,exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function checkCookie() {
  let user = getCookie("username");
  if (user != "") {
    username = user;
  } else {
     user = prompt("Please enter your name:","");
     if (user != "" && user != null) {
       setCookie("username", user, 30);
     }
  }
}


document.onkeydown = (e) => {
  e = window.event;
  if(e.key == "Enter"){
    sendMsg($("#clientmsg").val());
  }
}