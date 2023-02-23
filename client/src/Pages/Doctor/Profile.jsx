import React, { useEffect, useState } from "react";
import DoctorForm from "../../components/DoctorForm";
import Layout from "../../components/Layout";

import FileBase from "react-file-base64";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const params = useParams();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/update-doctor-profile",
        {
          ...values,
          userId: user._id,
          timings: [
            moment(values.timings[0]).format("hh:mm a"),
            moment(values.timings[1]).format("hh:mm a"),
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/homepage");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
    console.log("Success Doctor:", values);
  };

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-user-id",
        {
          userId: params.userId,
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  return (
    <React.Fragment>
      <Layout>
        <h1 className="page-title">Doctor Profile</h1>
        <hr />
        {doctor && <DoctorForm onFinish={onFinish} initivalValues={doctor} />}
      </Layout>
    </React.Fragment>
  );
};

export default Profile;
