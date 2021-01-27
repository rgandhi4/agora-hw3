let handlefail = function(err){
    console.log(err)
}


function addVideoStream(streamId){
    let remoteContainer = document.getElementById("remoteStream");
    let streamDiv = document.createElement("div");
    streamDiv.id = streamId;
    streamDiv.style.cssText = 'text-align: left; margin-top: 20px; justify-self: center; border: 2px solid #099dfd; width: 400px; height: 250px; transform: rotateY(180deg); float: left '
    remoteContainer.appendChild(streamDiv);
}

function removeVideoStream(elementId) {
    let remoteDiv = document.getElementById(elementId);
    if (remoteDiv) remoteDiv.parentNode.removeChild(remoteDiv);
};


document.getElementById("join").onclick = function () {
    let channelName = document.getElementById("channelName").value;
    let Username = document.getElementById("username").value;
    let appId = "743aefe6f8bb424dacb059bac49fb7de";

    document.getElementById('participants').innerHTML = Username;

    let client = AgoraRTC.createClient({
        mode: "live",
        codec: "h264"
    })

    client.init(appId,() => console.log("AgoraRTC Client Connected"), handlefail);

    client.join(
        null, 
        channelName, 
        Username, 
        () =>{
            var localStream = AgoraRTC.createStream({
                video: true,
                audio: true,
            })

            localStream.init(function(){
                localStream.play("SelfStream");
                console.log("App id: ${appId}\nChannel id: ${channelName}");
                client.publish(localStream);
            })
        }
    )

    client.on("stream-added", function(evt){
        client.subscribe(evt.stream, handlefail)
    })

    client.on("stream-subscribed", function(evt){
        console.log("Subscribed Stream");
        let stream = evt.stream;
        addVideoStream(stream.getId());
        document.getElementById('participants').innerHTML += "<br/> <br/>" + String(stream.getId());
        stream.play(stream.getId());
    })

    client.on("stream-removed", function(evt){
        let stream = evt.stream;
        let streamId = String(stream.getId());
        document.getElementById('participants').innerHTML = document.getElementById('participants').innerHTML.replace(streamId, ""); 
        stream.close();
        removeVideoStream(streamId);
    });

    client.on("peer-leave", function(evt){
        let stream = evt.stream;
        let streamId = String(stream.getId());
        document.getElementById('participants').innerHTML = document.getElementById('participants').innerHTML.replace(streamId, ""); 
        stream.close();
        removeVideoStream(streamId);
    });

}