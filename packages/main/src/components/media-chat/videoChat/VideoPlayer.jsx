import { useEffect, useRef } from "react";
import styles from "./styles/videoplayer.module.css";
import { AgoraVideoPlayer } from "agora-rtc-react";

const VideoPlayer = ({ user }) => {
  const ref = useRef();
  useEffect(() => {
    user?.videoTrack.play(ref.current);
    console.log(user);
  });
  return (
    <div className={`${styles.videoplayer}`}>
      <div ref={ref} className={`${styles.video}`}></div>
    </div>
  );
};

export default VideoPlayer;
