import React, { useState, useEffect } from "react";
import VideoPlayer from "./VideoPlayer";
import Styles from "./styles/videoroom.module.css";
import Mic from "./../../../assets/media/mic.svg";
import MicOff from "./../../../assets/media/mic-off.svg";
import Video from "./../../../assets/media/video.svg";
import VideoOff from "./../../../assets/media/video-off.svg";
import exit from "./../../../assets/media/exit.svg";
import AgoraRTC from "agora-rtc-sdk-ng";
import { Grid } from "@material-ui/core";

const VideoRoom = ({ token, channelName, uid, closeRoom }) => {
  const [trackState, setTrackState] = useState({ video: true, audio: true });
  const [localTracks, setLocalTracks] = useState([]);
  const [users, setUsers] = useState([]);
  const [gridSpacing, setGridSpacing] = useState(12);

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
    setGridSpacing(Math.max(Math.floor(12 / (users.length + 1)), 4));

    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);

    client
      .join(APP_ID, channelName, `${Token}`, parseInt(uid))
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
  }, [users, localTracks]);

  const mute = async type => {
    if (type === "audio") {
      await localTracks[0].setEnabled(!trackState.audio);
      setTrackState(ps => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await localTracks[1].setEnabled(!trackState.video);
      setTrackState(ps => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    localTracks[0].close();
    localTracks[1].close();
    closeRoom(prev => prev - 1);
  };

  return (
    <div className={`${Styles.videoroom}`}>
      <div className={`${Styles.videoroomRooms}`}>
        <Grid item xs={gridSpacing} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
          {users.map(user => {
            return <VideoPlayer key={user.id} user={user} />;
          })}
        </Grid>
      </div>
      <div className={`${Styles.controlBar}`}>
        <div className="audio" onClick={() => mute("audio")}>
          <img src={trackState.audio ? Mic : MicOff} alt="" />
        </div>
        <div className="video" onClick={() => mute("video")}>
          <img src={trackState.video ? Video : VideoOff} alt="" />
        </div>
        <div
          className="leave"
          style={{ background: "red" }}
          onClick={() => leaveChannel()}
        >
          <img src={exit} alt="" />
        </div>
      </div>
    </div>
  );
};

export default VideoRoom;
