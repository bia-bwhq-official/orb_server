var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var path = require("path");
const fs = require("fs");
const crypto = require('crypto');
let whitelist = ["https://files.catbox.moe"];
let formats = {
    "image":[".png",".jpg",".jpeg",".gif",".webp"],
    "video":[".webm",".mp4"]
}

//const str = 'bvllpizza69696969!!#';
//const hash = crypto.createHash('sha256');
//hash.update(str);
//const hashedStr = hash.digest('hex');

//console.log(`inp: ${str} \n new string: ${hashedStr}`);


const blacklist = [
    "<script>",
    "<a href='javascript:",
    '<a href="javascript:',
    "<a",
    "<video",
    "<img",
    "<img",
    "<audio",
    " onclick='",
    ' onclick="',
    " onmouseover='",
    'onmouseover="',
    "();",
    ".emit",
    "function()",
    "function ()",
    "() =>",
    '="',
    "='",
    '.innerHTML = "',
    ".innerHTML = ",
    "Spyro Subway"
  ];

app.use(express.static("public"));


http.listen(2000, function(){
  var port = http.address().port;
  console.log('Orbium is running on localhost:%s' + '!', port);
});

function Id(length){
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#@!";
    var result = "";
    for(i=0;i<length;i++){
        result+=characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

var users = [
    {
        username: "IUSBot",
        serverid: "iusbot_#21968",
        publicid: Id(8),
        avatar: "/img/avatar/guest.png",
        status: "User" //User, Moderator, Admin, Owner
    }
];

var globalEmojis = [
    "smile",
    "angry",
    "sunglasses",
    "smug",
    "friends",
    "cry",
    "innocent",
    "grin",
    "mouthzipped"
];


function globalReplace(string,search,newreplace){
    while(string.includes(newreplace)){
        string = string.replace(search,newreplace);
    }
    return string;
}
function getVid(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;
}
    

var banlist = [
    "2a02:c7c:fcf2:d500:9556:276f:cba8:4e9e",
    "a02:c7c:fcf2:d500:f574:6921:723f:abd7",
    "51.158.236.47",
    "190.6.14.178",
    "51.158.170.105"
];

var trophylist = [
    "2607:fb90:753f:9205:ac8b:74ff:fe1a:a60e",
   // "24.40.118.99",
    //"127.0.0.1",
    "190.120.246.156",
    "162.210.194.1"
];
var ratelimit = 1100;
const adminpass = "MEJOW1";
var pastmsg = fs.readFileSync('newmsg.cock', 'utf8');
pastmsg = ``;

var usercount = 1;
io.on("connection", function(socket){
    console.log(socket.id);
    var thisuser = {
        socketid: socket.id,
        publicid: Id(8),
        username: "Guest Member",
        avatar: "/img/avatar/guest.png",
        status: "user" //User, Moderator, Admin, Owner
    };
    
    var loggedin = false;
    var cansend = true;
    var ip = "127.0.0.1";
    var wait = ratelimit;
    if(socket.handshake.headers["x-forwarded-for"] !== undefined){
        if(socket.handshake.headers["x-forwarded-for"].includes(",")){
        ip = socket.handshake.headers["x-forwarded-for"].substring(0,socket.handshake.headers["x-forwarded-for"].indexOf(","));
        } else {
            ip = socket.handshake.headers["x-forwarded-for"];
        }
    }
    socket.on("login",(data) => {
        if(!blacklist.some(r => data.name.includes(r))){
            if(data.name !== "" && data.name.length < 25){
                thisuser.username = data.name;
            } else {
                data.name = thisuser.username;
            }
            if(data.name.length > 25){
                data.name = thisuser.name;
            }
            
        }
        if(data.name.length > 25){
            data.name
        }
        if(whitelist.some(r => data.avatar.startsWith(r))
            && formats["image"].some(r => data.avatar.endsWith(r)) &&
         data.avatar !== "" 
        && !blacklist.some(r => data.avatar.includes(r)) && !data.avatar.includes('"')){
            thisuser.avatar = data.avatar;
        }
        
        
        var newuser = {
            name: thisuser.username,
            id: thisuser.publicid,
            avatar: thisuser.avatar,
            status: thisuser.status
        };
      if(!banlist.includes(ip)){
        if(ip == "24.40.118.99" || ip == "127.0.0.1"){
            thisuser.status = "Owner";
        }
        users = [...users, thisuser];
        usercount++;
        loggedin = true;
        socket.emit("msghistory", pastmsg);
        socket.broadcast.emit("newuser",thisuser.username);
        socket.emit("useramt",usercount);
        socket.broadcast.emit("useramt",usercount);
        socket.broadcast.emit("userlist",users);
        console.log(thisuser.username + " has logged in (ip: "+ip+") \n users online: " + JSON.stringify(users));
        
        
        socket.on("image", url => {
            if(!whitelist.some(r => url.startsWith(r)))return;
            if(cansend == true){
            if(!blacklist.some(r => url.includes(r))&& formats["image"].some(r => url.endsWith(r)) ){
            if(url.startsWith("https://") || url.startsWith("http://")){
            var msg = "<span><img src='" + url + "' width='250' height='auto'></img></span>";
            pastmsg+='<div class="msg"><div class="avatar_cont"><img src="'+thisuser.avatar+'" width="80" height="80" style="border-radius:8px;"></div><p style="margin-left:20px;"><span style="font-size:20px;">' + thisuser.username + '<span style="color:gray;">(' + thisuser.status + ')</span> said:</span><br>'+msg+'</p></div><br>';
            fs.writeFileSync('newmsg.cock', pastmsg);
            socket.broadcast.emit("talk",{msg: msg, name: thisuser.username, avatar: thisuser.avatar, status: thisuser.status});
            socket.emit("talk",{msg: msg, name: thisuser.username, avatar: thisuser.avatar, status: thisuser.status});
            }
            }
        }
        });
        
        socket.on("video", url => {
            if(!whitelist.some(r => url.startsWith(r)) )return;
            if(cansend == true){
            if(typeof url == "string" && !blacklist.some(r => url.includes(r))&& formats["video"].some(r => url.endsWith(r)) ){
                const videoId = getVid(url);
                const msg = '<span><iframe style="height:300px;width: 120%;" src="https://www.youtube.com/embed/' + videoId + 
                '" frameborder="0" allowfullscreen></iframe></span>';
                console.log(msg); pastmsg+='<div class="msg"><div class="avatar_cont"><img src="'+thisuser.avatar+'" width="80" height="80" style="border-radius:8px;"></div><p style="margin-left:20px;"><span style="font-size:20px;">' + thisuser.username + '<span style="color:gray;">(' + thisuser.status + ')</span> said:</span><br>'+msg+'</p></div><br>';
                fs.writeFileSync('newmsg.cock', pastmsg);
                socket.broadcast.emit("talk",{msg: msg, name: thisuser.username, avatar: thisuser.avatar, status: thisuser.status});
                socket.emit("talk",{msg: msg, name: thisuser.username, avatar: thisuser.avatar, status: thisuser.status});
            }
        }
        });


        socket.on("talk",(data) => {
          if(cansend == true){
          if(!blacklist.some(r => data.msg.includes(r)) && data.msg !== '' && typeof data == "object" && typeof data.msg == "string" && data !== undefined){
               var rawmsg = data.msg;
            for(i=0;i < globalEmojis.length; i++){
                  while(data.msg.includes(":emoji_" + globalEmojis[i] + ":")){
                    data.msg = data.msg.replace(":emoji_" + globalEmojis[i] + ":",'<span><img width="20" height="20" src="/img/emoji/emoji_'+globalEmojis[i]+'.png"></span>');
                  } 
               }
                if(data.msg == thisuser.lastmsg){
                    var increase = ratelimit;
                    if(wait > ratelimit * 5){
                        increase*=2;
                    }
                    if(wait > ratelimit * 6){
                        increase*=6;
                    }
                    wait+=increase;
                }
                if(!data.msg.startsWith("/admin")){
                    if(trophylist.includes(ip)){
                        data.msg = data.msg + "<br> <span style='color:orange'>(This user has a trophy! <img src='/img/trophy.png' width='35' height='35'></img>)</span>"
                    }
                    if(data.msg.includes("https://bonzi-tube.onrender.com/video?id=")){
                        try{
                            let token = "https://bonzi-tube.onrender.com/video?id=";
                            let thisId = data.msg.substring(data.msg.indexOf(token),data.msg.indexOf(token)+token.length);
                            console.log(thisId);
                        }catch(e){}
                    }
                    let newMsg ={msg: data.msg, name: thisuser.username, avatar: thisuser.avatar, status: thisuser.status, rawmsg: rawmsg};
                  socket.broadcast.emit("talk",newMsg);
                  socket.emit("talk",newMsg);
                  cansend = false;
                  thisuser.lastmsg = data.msg;
                  setTimeout(() => {cansend = true; if(wait > ratelimit)wait-=ratelimit;},wait)
                  pastmsg+='<div class="msg"><div class="avatar_cont"><img src="'+thisuser.avatar+'" width="80" height="80" style="border-radius:8px;"></div><p style="margin-left:20px;"><span style="font-size:20px;">' + thisuser.username + '<span style="color:gray;">(' + thisuser.status + ')</span> said:</span><br>'+data.msg+'</p></div><br>\n';
                  fs.writeFileSync('newmsg.cock', pastmsg);
                  if(pastmsg.length > 40000){
                    fs.writeFileSync('oldmsg.cock', pastmsg);
                    pastmsg = 'The chat log has seen reset. Your past messages are no longer available before this point.<br>\n';
                    fs.writeFileSync('newmsg.cock', pastmsg);
                  }
                } else {
                    if(data.msg.substring(7, data.msg.length) == adminpass){
                        thisuser.status = "admin";
                    }
                }
          } else {
            socket.emit("talk",{msg: "<span style='color:red;'>Your message was invalid.</span>", name: thisuser.username, avatar: thisuser.avatar});
          }
          console.log(thisuser.username + ": " + data.msg);
         }
        });
      } else {
        console.log("Banned user attempted to join LULLL")
        socket.emit("errorUser","You have been banned from orbium.");
        socket.emit("msghistory","You are not allowed to chat until your ban/suspension has been lifted. Believe this is a mistake? Contact staff to discuss the issue.");
        setTimeout(() => {socket.disconnect(true);},3000)
      }
    });
    socket.on("disconnect", () => {
        if(loggedin == true){
            usercount--;
        io.emit("leave",thisuser.username);
        users.splice(users.indexOf(thisuser),1);
        socket.broadcast.emit("useramt",usercount);
        socket.broadcast.emit("userlist",users);
        }
    });
});