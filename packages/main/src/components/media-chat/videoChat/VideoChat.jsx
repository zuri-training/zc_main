import AgoraUIKit from "agora-react-uikit";
import { useEffect, useState } from "react";
import styles from "./styles/videochat.module.css";

const VideoChat = ({ workspaceId }) => {
  const [rtcToken, setRtcToken] = useState(null);
  const [rtcTokenStatus, setRtcTokenStatus] = useState(false);
  const [videoCall, setVideoCall] = useState(false);
  const fetchRtcToken = async () => {
    const response = await fetch(
      `https://staging.api.zuri.chat/rtc/${workspaceId}/publisher/userAccount/8`
    );
    const rtcToken = await response.json();
    setRtcToken(rtcToken.data.token);
    if (response.status == 200) {
      setRtcTokenStatus(true);
    } else {
      setRtcTokenStatus(false);
    }
  };
  useEffect(() => {
    fetchRtcToken();
  }, []);

  // const rtcProps = {
  //   appId: process.env.REACT_APP_AGORA_APP_ID,
  //   channel: workspaceId,
  //   token: `${rtcToken}`
  // };

  const rtcProps = {
    appId: "f910a1fb4cfe4c5996c979c54e570ba7",
    channel: "plug",
    token:
      "007eJxTYPg12XHuohmyWU1r1+x0cdU4IMNZdJSrqyQ+Xfbdv66dVvIKDGmWhgaJhmlJJslpqSbJppaWZsmW5pbJpiappuYGSYnms2ubkhsCGRlKjTMYGRkgEMRnYSjIKU1nYAAAKtketg=="
  };

  const callbacks = {
    EndCall: () => setVideoCall(false)
  };

  const joinBtn = {
    padding: "12px 24px",
    borderRadius: "8px",
    color: "white",
    background: "#00b87c"
  };

  return (
    <div className={`${styles.videoChat}`}>
      {videoCall ? (
        <div style={{ display: "flex", width: "100vw", height: "100%" }}>
          <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
        </div>
      ) : (
        <button
          disabled={!rtcTokenStatus}
          onClick={() => setVideoCall(true)}
          style={joinBtn}
        >
          Join Video Call
        </button>
      )}
    </div>
  );
};

export default VideoChat;
