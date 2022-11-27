import { useEffect, useRef } from "react";
import styles from "./styles/videoplayer.module.css";

const VideoPlayer = ({ tracks }) => {
  const ref = useRef();
  useEffect(() => {
    tracks[1].play(ref.current);
  }, []);
  return (
    <div className={`${styles.videoplayer}`}>
      <div ref={ref} className={`${styles.video}`}></div>
    </div>
  );
};

export default VideoPlayer;
