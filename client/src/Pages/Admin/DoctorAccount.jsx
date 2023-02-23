import { Button, Col, Form, Input, Modal, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { EditFilled } from "@ant-design/icons";

const DoctorAccount = () => {
  const [open, setOpen] = useState(false);
  const [account, setAccount] = useState();
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/admin/create-doctor-account",
        {
          ...values,
          userId: user._id,
          logDoctor: true,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAccount([...account, { ...values }]);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/admin/doctor-account");
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  const getDoctorsAccount = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/admin/get-doctors-account", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setAccount(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorsAccount();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Password",
      dataIndex: "password",
    },
    {
      title: "Action",
      render: (text, record) => {
        return (
          <React.Fragment>
            <Button>
              <EditFilled />
            </Button>
          </React.Fragment>
        );
      },
    },
  ];
  return (
    <Layout>
      <h1>Doctor Account</h1>
      <Button onClick={showModal} type="primary">
        +
      </Button>
      <Table columns={columns} dataSource={account} />

      <Modal open={open} onCancel={hideModal}>
        <Form onFinish={onFinish}>
          <Row>
            <Col>
              <Form.Item
                required
                label="Name"
                name="name"
                rules={[{ required: true }]}
              >
                <Input placeholder="Name" />
              </Form.Item>
              <Form.Item
                required
                label="Email"
                name="email"
                rules={[{ required: true }]}
              >
                <Input placeholder="Email" />
              </Form.Item>
              <Form.Item
                required
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                required
                label="Address"
                name="address"
                rules={[{ required: true }]}
              >
                <Input placeholder="Address" />
              </Form.Item>
              <Form.Item
                required
                label="Specialization"
                name="specialization"
                rules={[{ required: true }]}
              >
                <Input placeholder="Specialization" />
              </Form.Item>
            </Col>
          </Row>
          <Button className="primary-button" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>
    </Layout>
  );
};

export default DoctorAccount;
