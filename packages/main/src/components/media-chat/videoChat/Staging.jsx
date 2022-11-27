import AgoraRTC from "agora-rtc-sdk-ng";
import { useEffect, useState } from "react";
import styles from "./styles/Staging.module.css";

const Staging = () => {
  // set states
  const [token, setToken] = useState(null);
  const [localTracks, setLocalTracks] = useState([]);
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  const [users, setUsers] = useState([]);

  // const APP_ID = process.env.APP_ID;
  const APP_ID = "f910a1fb4cfe4c5996c979c54e570ba7";
  const Token =
    "007eJxTYPg12XHuohmyWU1r1+x0cdU4IMNZdJSrqyQ+Xfbdv66dVvIKDGmWhgaJhmlJJslpqSbJppaWZsmW5pbJpiappuYGSYnms2ubkhsCGRlKjTMYGRkgEMRnYSjIKU1nYAAAKtketg==";
  const channelName = "plug";

  // Get users id
  let uid = sessionStorage.getItem("uid");
  if (!uid) {
    uid = String(Math.floor(Math.random() * 1000));
    sessionStorage.setItem("uid", uid);
  }

  // channel ID = workspace ID

  // Get token

  // Fetch token from endpoint

  const fetchToken = async () => {
    const response = await fetch();
    const data = await response.json();
    setToken(data.data.token);
  };
  useEffect(() => {
    // fetchToken();
    joinStream();
  }, []);

  // local track

  const JoinRoom = async () => {
    await client.join(APP_ID, channelName, Token, uid);
  };

  const joinStream = async () => {
    const localTrack = await AgoraRTC.createMicrophoneAndCameraTracks();
    setLocalTracks(localTrack);
    localTracks[1].play("local-video");
  };

  return (
    <div className={`${styles.staging}`}>
      <div className={`${styles.stagingWrapper}`}>
        <div className={`${styles.videoContainer}`}>
          <div className={`${styles.userVideo}`}></div>
        </div>
        <button className={`${styles.stagingBtn}`}>Join Call</button>
      </div>
    </div>
  );
};

export default Staging;
