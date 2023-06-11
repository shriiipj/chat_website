import {Server} from 'socket.io';
import http from 'http';
import fs from 'fs';


const httpServer = http.createServer((req,res)=>{

  if(req.url === '/'){
    res.writeHead(200,{"Content-Type": "text/html"});
    const html = fs.readFileSync("./index.html");
    res.end(html);
  }else if(req.url.match('Room') !== null){
    res.writeHead(200,{"ContentType":"text/html"});
    const html = fs.readFileSync("./chat.html");
    res.end(html);
  }else if(req.url.match("\.css$")){
    
    var cssPath = "./public/"+req.url;
    var fileStream = fs.createReadStream(cssPath, "UTF-8");
    res.writeHead(200, {"Content-Type": "text/css"});
    fileStream.pipe(res);
}else if(req.url.match("\.js$")){
    var scriptPath = "./public/"+req.url;
    var fileStream = fs.createReadStream(scriptPath);
    res.writeHead(200, {"Content-Type": "text/javascript"});
    fileStream.pipe(res);
}else if(req.url.match(".\png$")){
  var imagePath = '.'+req.url;
  var fileStream = fs.createReadStream(imagePath);
  res.writeHead(200, {"Content-Type": "image/png"});
  fileStream.pipe(res);
}else{
    res.writeHead(404, {"Content-Type": "text/html"});
    res.end("No Page Found");
}
});

const io = new Server(httpServer,{});
var usersOnline = [];
io.on("connection",(socket)=>{
  console.log("Connection recieved!");
  console.log(socket.id);

  setInterval(()=>{
    socket.emit("user-online",usersOnline)
  }, 1000);

  socket.on('join-room',async(room,name)=>{
    await socket.join(room);
    usersOnline.includes(name)?null:usersOnline.push(name);
    console.log(usersOnline);
    socket.to(room).emit('user-online',usersOnline);
  });

  socket.on("Clicked",(msg,name,time,room)=>{
    socket.to(room).emit('broadcast',msg,name,time);
    socket.to(room).emit('user-online',usersOnline);
  }); 
});


httpServer.listen(3000,()=>console.log('HTTP Server Listening on 3000!'));
