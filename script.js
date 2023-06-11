$(document).ready(()=>{
    var name = ""
    var room = ""
    var onlineUsers = [];
    $('.chat-send').click(async ()=>{
        const val = $('.user-input').val();
        const el = `<p class='sender-chat'><span>${val}</span></p>`
        $('.msg-container').append(el);
        $(".msg-container").animate({ scrollTop: 20000000 },100);
        
        // emit msg event
        const time = new Date().toLocaleTimeString(); 
        await socket.emit('Clicked',val,name,time,room);
        $('.user-input').val("");
    });

    // Find Parametes from URL
    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
    
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
    
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
        return false;
    };

    var socket = io();
   
    socket.on("connect", () => {
        name = getUrlParameter('name');
        room = getUrlParameter('room');

        $('.user-title').text(name);        //set user name in chat UI
        socket.emit('join-room',room,name);
        
    });

    socket.on('user-online',(usersOnline)=>{
        console.log(usersOnline);
        if(onlineUsers.sort().join(',')=== usersOnline.sort().join(',')){
           return;
        }else{
            $('.add-online-users').empty();
            onlineUsers = usersOnline;
            for(let item of onlineUsers){
                console.log(item);
                let ele = `<div class="online-users-list"><i class="fa-solid fa-user user-icon"></i> ${item}</div>`
                $('.add-online-users').append(ele);
            }
        }
       
    });

    socket.on("disconnect", () => {
        console.log("Disconnected!"); 
    });

    
    socket.on('broadcast',(msg,name,time)=>{
        let el=`<div class='receiver-chat'>\
                <i class='fa-solid fa-user rec-userName'></i>\
                <span>${msg}</span>\
                <p class='user-name'>${name+"\n"+time}</p>\
                </div>`
        $('.msg-container').append(el);
        $(".msg-container").animate({ scrollTop: 20000000 },100);
      
        
    });
});