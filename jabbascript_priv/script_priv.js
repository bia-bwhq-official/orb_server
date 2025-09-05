var tokencolors = [
    {name: "era", color: "(0, 145, 255)"},
    {name: "era", color: "(0, 145, 255)"},
  ];
  
  document.getElementById("rantsnippet").innerHTML = document.getElementById("rantsnippet").innerHTML.replace(/era/g, '<span style="color:rgb(0, 145, 255);">era</span>');
  document.getElementById("rantsnippet").innerHTML = document.getElementById("rantsnippet").innerHTML.replace(/newfunction/g, '<span style="color:rgb(255, 191, 0);">newfunction</span>');
  
  var stdlog = console.log;
  
  console.log = (msg,color) => {
      var filter = [
        {type: "alert", replac: "rant"},
        {type: "ReferenceError", replac: "error was fucked by detection for user reference, go beat a fish or never make a shit to in your life again"}
      ];
      stdlog(msg);
      const consoleDOM = document.getElementById("console");
      
      if(color){ consoleDOM.innerHTML+="<br><p style='color:"+color+"'>" + msg + "</p>"; } else consoleDOM.innerHTML+="<br><p>" + msg + "</p>";
  }
  
  var importantRant = (msg, color) => {
    console.log("Hypercompiler: " + msg,color+";font-weight:bold;font-style:italic;")
  }
  
  
  const parselist = [
      {call: "rant", type: "alert", case: false},
      {call: "[", type: "(", case: false},
      {call: "]", type: ")", case: false},
      {call: "-", type: ";", case: false},
      {call: ":", type: "'", case: false},
      {call: "newuser", type: "var", case: true},
      {call: "<", type: "{", case: false},
      {call: ">", type: "}", case: false},
      {call: "gooduser", type: "true", case: false},
      {call: "baduser", type: "false", case: false},
      {call: "era", type: "function", case: false},
      {call: "is having equivalents to", type: "="},
      {call: "user behaviors", type: "["},
      {call: "user behavior are terminate", type: "]"},
      {call: "another user here", type: ","},
      {call: "confront user", type: "console.log"},
      {call: "less than", type: "<"},
      {call: "greater than", type: ">"},
      {call: "community post allude from IUS", type: "return"}
  ];
  
  function jbsParse(inp,rantorno){
      var newtxt = inp;
      console.log("/////////////////","green;")
      if(rantorno == true){
        importantRant("processing baffles...","orange");
      }
      for(i=0;i<parselist.length;i++){
        let query = parselist[i];
        while(newtxt.includes(query.call)){ 
          newtxt = newtxt.replace(query.call, query.type);
        }
        if(query.case === true && newtxt.includes(query.call)){
          stdlog("special case!")
        }
      }
      if(rantorno == true){
      importantRant("compiling complete. new era will eat 9 billion NodeJS request with fastest toaster oven speeds for your whole fucklife.","orange")
      }
      stdlog("Original input:" + inp + "\nJBS Result: \n" + newtxt);
      try {
      eval(newtxt);
      } catch(e){
        importantRant("JAVASCRIPT ERROR: " + e,"red")
      }
      return newtxt;
  }
   
  jbsParse("rant[:hello worlda:]-",true);
  
  document.getElementById("jbsrun").onclick = () => {
    jbsParse(document.getElementById("jbs").value, false)
  }