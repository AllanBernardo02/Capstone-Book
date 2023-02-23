import React, { useEffect, useRef, useState } from "react";
import { getUser } from "../../api/ChatRequest";
import { addMessage, getMessages } from "../../api/MessageRequest";
import "./ChatBox.css";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";

const ChatBox = ({ chat, currentUser, setSendMessage, receiveMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scroll = useRef();

  useEffect(() => {
    if (receiveMessage !== null && receiveMessage?.chatId === chat?._id) {
      console.log("Data received", receiveMessage);
      setMessages([...messages, receiveMessage]);
    }
  }, [receiveMessage, chat?._id]);

  //fetching data for header
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);

    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);

        setUserData(data);
        console.log("ChatBox", data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) getUserData();
  }, [chat, currentUser]);

  // fetching data for messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        setMessages(data);
        console.log("Chat messages", data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) fetchMessages();
  }, [chat]);

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };

    //sending mesage to database
    try {
      const { data } = await addMessage(message);
      setMessages([...messages, data]);

      setNewMessage("");
    } catch (error) {
      console.log(error);
    }

    // send message to socket server
    const receiverId = chat.members.find((id) => id !== currentUser);
    setSendMessage({ ...message, receiverId });
  };

  //Always scroll to last message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <React.Fragment>
      <div className="ChatBox-container">
        {chat ? (
          <React.Fragment>
            <div className="chat-header">
              <div className="followers">
                <div>
                  <img
                    src={
                      userData?.selectedFile ||
                      "https://th.bing.com/th/id/R.6ae74c5f86466ef4f6fc6253c767381a?rik=5DSgIRvIaK7UPw&riu=http%3a%2f%2fwww.pngall.com%2fwp-content%2fuploads%2f5%2fProfile-Avatar-PNG.png&ehk=GVMh4KTpyOBERsOt5H%2b8TcGp%2bS8DdbR6niBs54kRaYA%3d&risl=&pid=ImgRaw&r=0"
                    }
                    alt="Profile"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50px",
                    }}
                  />
                  <div>
                    <span>{userData?.name}</span>
                  </div>
                </div>
              </div>
              <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
            </div>
            {/*Chatbox Message */}
            <div className="chat-body">
              {messages.map((message) => (
                <React.Fragment>
                  <div
                    ref={scroll}
                    className={
                      message.senderId === currentUser
                        ? "message own"
                        : "message"
                    }
                  >
                    <span>{message.text}</span>
                    <span>{format(message.createdAt)}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
            {/*Chatbox-sender */}
            <div className="chat-sender">
              <div>+</div>
              <InputEmoji value={newMessage} onChange={handleChange} />
              <div className="send-button button" onClick={handleSend}>
                Send
              </div>
            </div>
          </React.Fragment>
        ) : (
          <span className="chatbox-empty-message">
            Tap on a chat to start conversation...
          </span>
        )}
      </div>
    </React.Fragment>
  );
};

export default ChatBox;
