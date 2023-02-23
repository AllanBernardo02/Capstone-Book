import { Calendar } from "antd";
import React from "react";

import Layout from "../components/Layout";

const BookAppointment = () => {
  const calendarStyle = { height: "200px", width: "100%" };

  return (
    <Layout>
      <h1>Book Appointment</h1>
      <hr />
      <Calendar style={calendarStyle} />
    </Layout>
  );
};

export default BookAppointment;
