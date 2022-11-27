import AgoraRTC from "agora-rtc-sdk-ng";
import { useEffect, useState } from "react";
import styles from "./styles/Staging.module.css";
import VideoPlayer from "./VideoPlayer";
import VideoRoom from "./VideoRoom";

const Staging = ({ workspaceId }) => {
  // set states
  const [stage, setStage] = useState(0);
  const [localTracks, setLocalTracks] = useState([]);
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState(null);

  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  // const APP_ID = process.env.APP_ID;
  let uid = sessionStorage.getItem("uid");
  if (!uid) {
    uid = String(Math.floor(Math.random() * 1000));
    sessionStorage.setItem("uid", uid);
  }

  const fetchToken = () => {
    fetch(`https://localH/rtc/${workspaceId}/publisher/uid/0/`)
      .then(res => res.json())
      .then(data => {
        setToken(data.data.token);
        setStage(1);
      });
  };

  return (
    <div className={`${styles.videoChat}`}>
      {stage === 0 && (
        <div className={`${styles.staging}`}>
          <div className={`${styles.stagingWrapper}`}>
            {/* <VideoPlayer tracks={localTracks} /> */}
            <button
              className={`${styles.stagingBtn}`}
              onClick={() => fetchToken()}
              // disabled={!tokenStatus}
            >
              Join Call
            </button>
          </div>
        </div>
      )}
      {stage === 1 && (
        <VideoRoom token={token} channelName={workspaceId} uid={uid} />
      )}
      {/* {stage === 1 && <h1>Hello world, {token}</h1>} */}
    </div>
  );
};

export default Staging;
