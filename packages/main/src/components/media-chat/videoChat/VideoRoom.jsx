import React, { useState } from "react";
import VideoPlayer from "./VideoPlayer";
import Styles from "./styles/videoroom.module.css";
import Mic from "./../../../assets/media/mic.svg";
import MicOff from "./../../../assets/media/mic-off.svg";
import Video from "./../../../assets/media/video.svg";
import VideoOff from "./../../../assets/media/video-off.svg";
import exit from "./../../../assets/media/exit.svg";

const VideoRoom = ({ users, left }) => {
  const [audio, setAudio] = useState(false);
  const [video, setVideo] = useState(false);
  return (
    <div className={`${Styles.videoroom}`}>
      <div>
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
