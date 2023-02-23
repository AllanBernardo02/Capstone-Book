import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import axios from "axios";
import "../index.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import FileBase from "react-file-base64";

const Register = () => {
  const [form, setForm] = useState({
    selectedFile: "",
    fullName: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const values = {
    fullName: form.fullName,
    email: form.email,
    password: form.password,
  };
  const onFinish = async (e) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("api/user/register", { ...form });
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        toast("Redirecting to login Page");
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }

    console.log("Recieved values of form", values);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target?.id]: e.target?.value });
  };
  console.log("data", form);

  return (
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className="card-title">Register</h1>
        <form layout="vertical" onSubmit={(e) => onFinish(e)}>
          {/*<Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name" }]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input placeholder="Passwords" type="password" />
          </Form.Item>*/}

          <Form.Item>
            <Input
              id="fullName"
              placeholder="Full Name"
              values={form.fullName}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item>
            <Input
              id="email"
              placeholder="Email"
              values={form.email}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item>
            <Input
              id="password"
              placeholder="Password"
              values={form.password}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item>
            <FileBase
              type="file"
              multiple={false}
              onDone={({ base64 }) =>
                setForm({ ...form, selectedFile: base64 })
              }
            />
          </Form.Item>

          <button className="primary-button my-2">Register</button>

          <Link to="/" className="anchor">
            CLICK HERE TO LOGIN
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
