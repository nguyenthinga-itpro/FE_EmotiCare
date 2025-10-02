// import { useEffect, useState } from "react";

// function SpotifyPlayer() {
//   const [player, setPlayer] = useState(null);
//   const [deviceId, setDeviceId] = useState(null);
//   const [accessToken, setAccessToken] = useState(
//     localStorage.getItem("spotify_access_token") || ""
//   );
//   const [refreshToken, setRefreshToken] = useState(
//     localStorage.getItem("spotify_refresh_token") || ""
//   );

//   // 1️⃣ Lấy token từ URL sau callback Spotify
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const at = params.get("access_token");
//     const rt = params.get("refresh_token");

//     if (at && rt) {
//       localStorage.setItem("spotify_access_token", at);
//       localStorage.setItem("spotify_refresh_token", rt);
//       setAccessToken(at);
//       setRefreshToken(rt);

//       // Log ra console
//       console.log("[SpotifyPlayer] Access token saved:", at);
//       console.log("[SpotifyPlayer] Refresh token saved:", rt);

//       // Xóa query params khỏi URL
//       window.history.replaceState({}, document.title, "/user/postcards");
//     }
//   }, []);

//   // 2️⃣ Init Spotify Web Playback SDK
//   useEffect(() => {
//     if (!accessToken) return;

//     const script = document.createElement("script");
//     script.src = "https://sdk.scdn.co/spotify-player.js";
//     script.async = true;
//     document.body.appendChild(script);

//     window.onSpotifyWebPlaybackSDKReady = () => {
//       const playerInstance = new window.Spotify.Player({
//         name: "EmotiCare Player",
//         getOAuthToken: (cb) => cb(accessToken),
//         volume: 0.5,
//       });

//       setPlayer(playerInstance);

//       playerInstance.addListener("ready", ({ device_id }) => {
//         setDeviceId(device_id);
//         console.log("[SpotifyPlayer] Player ready. Device ID:", device_id);
//       });

//       playerInstance.addListener("initialization_error", (e) =>
//         console.error("[SpotifyPlayer] Init error:", e)
//       );
//       playerInstance.addListener("authentication_error", (e) =>
//         console.error("[SpotifyPlayer] Auth error:", e)
//       );
//       playerInstance.addListener("account_error", (e) =>
//         console.error("[SpotifyPlayer] Account error:", e)
//       );
//       playerInstance.addListener("playback_error", (e) =>
//         console.error("[SpotifyPlayer] Playback error:", e)
//       );

//       playerInstance.connect();
//     };
//   }, [accessToken]);

//   // 3️⃣ Refresh token tự động mỗi 50 phút
//   useEffect(() => {
//     if (!refreshToken) return;

//     const interval = setInterval(async () => {
//       try {
//         const res = await fetch("http://127.0.0.1:3001/spotify/refresh-token", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ refreshToken }),
//         });
//         const data = await res.json();
//         setAccessToken(data.access_token);
//         localStorage.setItem("spotify_access_token", data.access_token);

//         // Log ra console
//         console.log("[SpotifyPlayer] Token refreshed:", data.access_token);

//         if (player)
//           player._options.getOAuthToken = (cb) => cb(data.access_token);
//       } catch (err) {
//         console.error("[SpotifyPlayer] Error refreshing token:", err);
//       }
//     }, 50 * 60 * 1000);

//     return () => clearInterval(interval);
//   }, [refreshToken, player]);

//   // 4️⃣ Play track function
//   const playTrack = async (spotifyUri) => {
//     if (!deviceId || !accessToken) {
//       console.warn("[SpotifyPlayer] Player or token not ready");
//       return;
//     }

//     try {
//       await fetch(
//         `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
//         {
//           method: "PUT",
//           body: JSON.stringify({ uris: [spotifyUri] }),
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//       console.log("[SpotifyPlayer] Playing track:", spotifyUri);
//     } catch (err) {
//       console.error("[SpotifyPlayer] Error playing track:", err);
//     }
//   };

//   return (
//     <div>
//       <h1>EmotiCare Spotify Player</h1>
//       <button
//         onClick={() =>
//           (window.location.href = "http://127.0.0.1:3001/spotify/login")
//         }
//       >
//         Login with Spotify
//       </button>
//       <button onClick={() => playTrack("spotify:track:3n3Ppam7vgaVa1iaRUc9Lp")}>
//         Play Track
//       </button>
//     </div>
//   );
// }

// export default SpotifyPlayer;
