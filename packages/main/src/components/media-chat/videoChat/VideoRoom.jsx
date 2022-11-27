import React, { useState, useEffect } from "react";
import VideoPlayer from "./VideoPlayer";
import Styles from "./styles/videoroom.module.css";
import Mic from "./../../../assets/media/mic.svg";
import MicOff from "./../../../assets/media/mic-off.svg";
import Video from "./../../../assets/media/video.svg";
import VideoOff from "./../../../assets/media/video-off.svg";
import exit from "./../../../assets/media/exit.svg";
import AgoraRTC from "agora-rtc-sdk-ng";

const VideoRoom = ({ token, channelName, uid }) => {
  const [audio, setAudio] = useState(false);
  const [video, setVideo] = useState(false);

  const [localTracks, setLocalTracks] = useState([]);
  const [users, setUsers] = useState([]);

  const Token =
    "007eJxTYCg4rxx58lbmlL/r1kg+2D312JOzZS5hYdO91vrt2s++QnWDAkOapaFBomFakklyWqpJsqmlpVmypbllsqlJqqm5QVKiuefF5uSGQEYGU6lIRkYGCATxJRjMjM0sjA0tzEzMTcwMLYwSUxJTLc2SzJIYGAC/2yVr";
  const APP_ID = "f910a1fb4cfe4c5996c979c54e570ba7";

  const client = AgoraRTC.createClient({
    mode: "rtc",
    codec: "vp8"
  });

  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
      setUsers(previousUsers => [...previousUsers, user]);
    }

    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  };

  const handleUserLeft = user => {
    setUsers(previousUsers => previousUsers.filter(u => u.uid !== user.uid));
  };

  useEffect(() => {
    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);

    client
      .join(APP_ID, channelName, `${token}`, 0)
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

    return () => {
      for (let localTrack of localTracks) {
        localTrack.stop();
        localTrack.close();
      }
      client.off("user-published", handleUserJoined);
      client.off("user-left", handleUserLeft);
      client.unpublish(localTracks).then(() => client.leave());
    };
  }, []);

  return (
    <div className={`${Styles.videoroom}`}>
      <div>
        <h1>{token}</h1>
      </div>
      <div className={`${Styles.videoroomRooms}`}>
        {users.map(user => {
          return <VideoPlayer key={user.id} user={user} />;
        })}
      </div>
      <div className={`${Styles.controlBar}`}>
        <div className="audio" onClick={() => setAudio(prev => !prev)}>
          <img src={audio ? Mic : MicOff} alt="" />
        </div>
        <div className="video" onClick={() => setVideo(prev => !prev)}>
          <img src={video ? Video : VideoOff} alt="" />
        </div>
        <div className="leave" style={{ background: "red" }}>
          <img src={exit} alt="" />
        </div>
      </div>
    </div>
  );
};

export default VideoRoom;
