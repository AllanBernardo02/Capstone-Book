import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageOutlined } from "@ant-design/icons";
import { Button } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import ".././index.css";

const Doctors = ({ doctor }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const chatDoctor = (doctorId) => {
    try {
      axios.post("/api/chat/", {
        senderId: user._id,
        receiverId: doctorId,
      });
      navigate(`/chat`);
    } catch (error) {}
  };

  return (
    <div className="card p-2 cursor-pointer">
      <div className="doctor-chat">
        <h1 className="card-title">
          {doctor.firstName} {doctor.lastName}
        </h1>
        <MessageOutlined
          style={{ fontSize: "20px" }}
          onClick={() => chatDoctor(doctor.userId)}
        />
      </div>
      <hr />
      <p>
        <b>Specialization : </b>
        {doctor.specialization}
      </p>
      <p>
        <b>Experience : </b>
        {doctor.experience}
      </p>
      <p>
        <b>Consultation Fee : </b>
        {doctor.feeConsultation}
      </p>
      <p>
        <b>Phone Number : </b>
        {doctor.phoneNumber}
      </p>
      <p>
        <b>Address : </b>
        {doctor.address}
      </p>

      <p>
        <b>Hours Schedule : </b>
        {doctor.timings[0]} - {doctor.timings[1]}
      </p>
      <Button
        onClick={() => navigate(`/homepage/book-appointment/${doctor._id}`)}
      >
        Book
      </Button>
    </div>
  );
};

export default Doctors;
