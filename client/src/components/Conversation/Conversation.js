import { CloseOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "../../api/ChatRequest";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import "./Conversation.css";
const Conversation = ({ data, currentUserId, online }) => {
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();
  const url =
    "https://th.bing.com/th/id/R.6ae74c5f86466ef4f6fc6253c767381a?rik=5DSgIRvIaK7UPw&riu=http%3a%2f%2fwww.pngall.com%2fwp-content%2fuploads%2f5%2fProfile-Avatar-PNG.png&ehk=GVMh4KTpyOBERsOt5H%2b8TcGp%2bS8DdbR6niBs54kRaYA%3d&risl=&pid=ImgRaw&r=0";

  const files = userData?.selectedFile || url;
  const name = userData?.name;
  useEffect(() => {
    const userId = data.members.find((id) => id !== currentUserId);
    console.log("USERID", userId);

    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);

        setUserData(data);
        console.log("Second", data);
      } catch (error) {
        console.log(error);
      }
    };

    getUserData();
  }, []);
  return (
    <React.Fragment>
      <div className="follower conversation">
        <div>
          {online ? (
            <Popover content={online ? <p>Online</p> : ""}>
              <div className="online-dot"></div>
            </Popover>
          ) : (
            <Popover content={online ? <p>Online</p> : <p>Offline</p>}>
              <CloseOutlined
                style={{ fontSize: "10px" }}
                className="offline-dot"
              />
            </Popover>
          )}
          <div className="parent">
            <img
              src={files}
              alt="Profile"
              style={{ width: "50px", height: "50px", borderRadius: "50px" }}
            />
            <div className="convo">
              <span>{name}</span>
              <span>{online ? "online" : "offline"}</span>
            </div>
          </div>
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
    </React.Fragment>
  );
};

export default Conversation;
