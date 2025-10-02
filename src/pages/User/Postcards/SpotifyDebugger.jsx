// import React, { useEffect, useState } from "react";

// const SpotifyDebugger = ({ accessToken }) => {
//   const [deviceId, setDeviceId] = useState(null);

//   useEffect(() => {
//     if (!accessToken) return;

//     // Load Spotify SDK
//     const script = document.createElement("script");
//     script.src = "https://sdk.scdn.co/spotify-player.js";
//     script.async = true;
//     document.body.appendChild(script);

//     window.onSpotifyWebPlaybackSDKReady = () => {
//       console.log("Spotify SDK ready");

//       const player = new window.Spotify.Player({
//         name: "Debug Player",
//         getOAuthToken: (cb) => {
//           console.log("Providing access token to SDK:", accessToken);
//           cb(accessToken);
//         },
//         volume: 0.5,
//       });

//       // Error handling
//       player.addListener("initialization_error", ({ message }) =>
//         console.error("Init error:", message)
//       );
//       player.addListener("authentication_error", ({ message }) =>
//         console.error("Auth error:", message)
//       );
//       player.addListener("account_error", ({ message }) =>
//         console.error("Account error:", message)
//       );
//       player.addListener("playback_error", ({ message }) =>
//         console.error("Playback error:", message)
//       );

//       // Playback status
//       player.addListener("player_state_changed", (state) =>
//         console.log("Player state changed:", state)
//       );

//       // Ready
//       player.addListener("ready", ({ device_id }) => {
//         console.log("Device ready with ID:", device_id);
//         setDeviceId(device_id);
//       });

//       player.addListener("not_ready", ({ device_id }) =>
//         console.log("Device offline:", device_id)
//       );

//       player.connect().then((success) => {
//         if (success) console.log("Player connected!");
//       });
//     };

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, [accessToken]);

//   const playTestTrack = () => {
//     if (!deviceId) return console.warn("Device not ready yet");
//     fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
//       method: "PUT",
//       body: JSON.stringify({ uris: ["spotify:track:7GhIk7Il098yCjg4BQjzvb"] }), // Thay track id nếu muốn
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//       },
//     })
//       .then((res) => {
//         if (res.ok) console.log("Track started playing!");
//         else console.error("Play request failed:", res.status, res.statusText);
//       })
//       .catch((err) => console.error("Play request error:", err));
//   };

//   return (
//     <div>
//       <h2>Spotify Web Playback Debugger</h2>
//       <button onClick={playTestTrack} disabled={!deviceId}>
//         Play Test Track
//       </button>
//       <p>Device ID: {deviceId || "Not ready"}</p>
//     </div>
//   );
// };

// export default SpotifyDebugger;
