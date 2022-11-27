import AgoraRTC from "agora-rtc-sdk-ng";
import { useEffect, useState } from "react";
import styles from "./styles/Staging.module.css";
import VideoPlayer from "./VideoPlayer";
import VideoRoom from "./VideoRoom";

const Staging = () => {
  // set states
  const [stage, setStage] = useState(0);
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

  var tracks;

  const fetchToken = async () => {
    const response = await fetch();
    const data = await response.json();
    setToken(data.data.token);
  };
  useEffect(() => {
    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);
    // return () => {
    //   for (let localTrack of localTracks) {
    //     localTrack.stop();
    //     localTrack.close();
    //   }
    //   client.off('user-published', handleUserJoined);
    //   client.off('user-left', handleUserLeft);
    //   client.unpublish(tracks).then(() => client.leave());
    // };
    return () => {
      for (let localTrack of localTracks) {
        localTrack.stop();
        localTrack.close();
      }
      client.off("user-published", handleUserJoined);
      client.off("user-left", handleUserLeft);
      client.unpublish(tracks).then(() => client.leave());
    };
  }, []);

  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
      setUsers(previousUsers => [...previousUsers, user]);
    }

    if (mediaType === "audio") {
      // user.audioTrack.play()
    }
  };

  const handleUserLeft = user => {
    setUsers(previousUsers => previousUsers.filter(u => u.uid !== user.uid));
  };

  const JoinRoom = async () => {
    client
      .join(APP_ID, channelName, Token, uid)
      .then(uid =>
        Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid])
      )
      .then(([tracks, uid]) => {
        const [audioTrack, videoTrack] = tracks;
        setLocalTracks(tracks);
        setUsers(previousUsers => [
          ...previousUsers,
          {
            uid,
            videoTrack,
            audioTrack
          }
        ]);
        client.publish(tracks);
      });

    setStage(1);
  };

  return (
    <div className={`${styles.videoChat}`}>
      {stage === 0 && (
        <div className={`${styles.staging}`}>
          <div className={`${styles.stagingWrapper}`}>
            <VideoPlayer tracks={localTracks} />
            <button
              className={`${styles.stagingBtn}`}
              onClick={() => JoinRoom()}
            >
              Join Call
            </button>
          </div>
        </div>
      )}
      {stage === 1 && <VideoRoom left={handleUserLeft} users={users} />}
    </div>
  );
};

export default Staging;
