// import React, { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";
// import Peer from "simple-peer";
// import { useParams } from "react-router-dom";

// const socket = io("http://localhost:4001");

// const VideoCall = () => {

//     const [peers, setPeers] = useState([]);
//     const userVideo = useRef();
//     const peersRef = useRef([]);
//     const {roomId} = useParams();
//     // roomId = 123;
//     useEffect(() => {
//         if (!roomId) return;
    
//         navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//             .then((stream) => {
//                 userVideo.current.srcObject = stream;
    
//                 socket.emit("join-room", roomId, socket.id);
    
//                 socket.on("existing-users", (users) => {
//                     const peerConnections = users.map((userId) => {
//                         const peer = createPeer(userId, socket.id, stream);
//                         if (peer) {
//                             peersRef.current.push({ peerID: userId, peer });
//                         }
//                         return peer;
//                     });
//                     setPeers(peerConnections);
//                 });
    
//                 socket.on("user-connected", (userId) => {
//                     const peer = createPeer(userId, socket.id, stream);
//                     if (peer) {
//                         peersRef.current.push({ peerID: userId, peer });
//                         setPeers((peers) => [...peers, peer]);
//                     }
//                 });
    
//                 socket.on("user-disconnected", (userId) => {
//                     const peerObj = peersRef.current.find((p) => p.peerID === userId);
//                     if (peerObj) {
//                         peerObj.peer.destroy();
//                     }
//                     setPeers((peers) => peers.filter((p) => p.peerID !== userId));
//                 });
//             })
//             .catch((error) => console.error("Failed to get media stream", error));
    
//     }, [roomId]);  // 🔥 Added `roomId` as a dependency
    

//     function createPeer(userToSignal, callerID, stream) {
//         if (!stream) {
//             console.error("Stream is undefined. Cannot create peer.");
//             return null;
//         }
    
//         const peer = new Peer({
//             initiator: true,
//             trickle: false,
//             stream,
//         });
    
//         peer.on("signal", (signal) => {
//             socket.emit("sending-signal", { userToSignal, callerID, signal });
//         });
    
//         return peer;
//     }
    

//     return (
//         <div>
//             <video ref={userVideo} autoPlay playsInline />
//             {peers.map((peer, index) => (
//                 <Video key={index} peer={peer} />
//             ))}
//         </div>
//     );
// };

// const Video = ({ peer }) => {
//     const ref = useRef();

//     useEffect(() => {
//         if (!peer) return;
        
//         peer.on("stream", (stream) => {
//             ref.current.srcObject = stream;
//         });

//         return () => {
//             peer.removeListener("stream"); // Cleanup on unmount
//         };
//     }, [peer]);  // 🔥 Add `peer` as a dependency

//     return <video ref={ref} autoPlay playsInline />;
// };


// export default VideoCall;

import React from 'react'

function VideoCall() {
  return (
    <div>
      Video Call!!!
    </div>
  )
}

export default VideoCall

