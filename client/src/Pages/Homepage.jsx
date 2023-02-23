import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Col, Row } from "antd";
import Doctors from "../components/Doctors";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";

const Homepage = () => {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "/api/user/get-all-approved-doctors",

        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctors(response.data.data);
      }
      console.log("tokens:", response.data);
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <React.Fragment>
      <Layout>
        <Row gutter={20}>
          {doctors.map((doc) => {
            return (
              <Col span={8} xs={24} sm={24} lg={8}>
                <Doctors doctor={doc} />
              </Col>
            );
          })}
        </Row>
      </Layout>
    </React.Fragment>
  );
};

export default Homepage;
