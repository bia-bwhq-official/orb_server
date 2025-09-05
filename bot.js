const botname = "BullshitBot 2.0";
const { io } = require("socket.io-client");
const fs = require("fs");
var logs = 0;
var msgs = require("./msg.old");
var bot = () => {
  logs++;
  var thislog = logs;
  const socket = io("https://bonzi.nigger.email");
  ////
  socket.emit("login", { name: botname, room: "" });
  var users = {};
  socket.on("login", (data) => {
    users = data.users;
  });
  socket.on("leave", (data) => {
    delete users[data];
  });
  socket.on("join", (data) => {
    users[data.guid] = data;
  });
  var q = 0;
  var time = 0;
  socket.on("talk", (data) => {
    if (users[data.guid] == undefined) {
      return;
    }
    if (users[data.guid].name !== botname) {
      q++;
      if (q > 50) {
        var writ = "module.exports = [\n";
        for (i = 0; i < msgs.length; i++) {
          writ += '"' + msgs[i] + '",\n';
        }
        writ += "];";
        while(writ.includes("&apos;")){
          writ.replace("&apos;","")
        }
        fs.writeFileSync("msg.js", writ, (err) => {
          if (err) console.log(err);
          else {
            console.log("messages saved (messages: " + msgs.length + ")");
          }
        });
        q = 0;
      }
      if (
        !msgs.includes(data.text) &&
        !msgs.includes("STOP STOP STOP STOP STOP") &&
        data.text.length < 80
      ) {
        msgs = [...msgs, data.text];
      }
      //if(msgs.length > 100){
      //msgs = [];
      //}
      if (data.text.length < 70) {
        setTimeout(
          () => {
            if (users[data.guid] !== undefined) {
              var newmsg = "";
              var quotelength = Math.floor(Math.random() * (3 - 1 + 1)) + 1;

              for (i = 0; i < quotelength; i++) {
                newmsg += msgs[Math.floor(Math.random() * msgs.length)] + " ";
              }
              socket.emit("talk", users[data.guid].name + ", " + newmsg);
            }
          },
          Math.floor(Math.random() * (30000 - 18000 + 1)) + 18000,
        );
      }
    }
    
    if (thislog === 1) {
        time = 0;
      console.log(users[data.guid].name + ": " + data.text);
    }
  });

  ///
};

bot();
