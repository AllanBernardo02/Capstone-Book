import { Row, Col, Input } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../components/Layout";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { userChats } from "../api/ChatRequest";
import Conversation from "../components/Conversation/Conversation";
import ChatBox from "../components/ChatBox/ChatBox";
import { io } from "socket.io-client";
import "./chat.css";
const { Search } = Input;

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const socket = useRef();

  // sending message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  //connect to socket.io
  useEffect(() => {
    socket.current = io("http://localhost:8800");
    if (user !== null && user !== undefined) {
      socket.current.emit("new-user-add", user._id);

      console.log("null ba?", user._id);
    }
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
      console.log("real-time", users);
    });
  }, [user]);

  //receive message from socket server
  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      setReceiveMessage(data);
    });
  }, []);

  useEffect(() => {
    const getChats = async () => {
      try {
        // dispatch(showLoading());
        const { data } = await userChats(user?._id);
        // dispatch(hideLoading());

        setChats(data);
        console.log(data);
      } catch (error) {
        // dispatch(hideLoading());
        console.log("HIHI", error);
      }
    };
    getChats();
  }, [user?._id]);

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  return (
    <Layout>
      <Row>
        <Col span={6} className="leftbar-chat">
          <h2>Chats</h2>

          <hr />
          {chats.map((chat) => (
            <div onClick={() => setCurrentChat(chat)}>
              <Conversation
                data={chat}
                currentUserId={user._id}
                online={checkOnlineStatus(chat)}
              />
            </div>
          ))}
        </Col>
        <Col span={18}>
          <div>
            <ChatBox
              chat={currentChat}
              currentUser={user?._id}
              setSendMessage={setSendMessage}
              receiveMessage={receiveMessage}
            />
          </div>
        </Col>
      </Row>
    </Layout>
  );
};

export default Chat;
