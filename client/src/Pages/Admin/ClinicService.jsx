import { Button, Col, Form, Input, Modal, Row, Space, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import {
  DeleteFilled,
  EditFilled,
  ExclamationCircleFilled,
  FileAddOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const ClinicService = () => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [clinicService, setClinicService] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const { TextArea } = Input;

  console.log("Clinic Data ?", clinicService);

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const deleteClinicService = (id) => {
    Modal.confirm({
      title: "Are you sure delete this task?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        try {
          dispatch(showLoading());
          const response = axios
            .delete(`/api/admin/delete-clinic-service/${id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
            .then(() => {
              setClinicService(
                clinicService.filter((val) => {
                  return val._id !== id;
                })
              );
            });
          dispatch(hideLoading());
          if (response.data.success) {
            console.log("Success?", response.data.success);

            toast.success(response.data.message);
          }
        } catch (error) {}
      },
    });
  };

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/admin/create-clinic-services",
        {
          ...values,
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setClinicService([...clinicService, { ...values }]);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/admin/clinic-service");
        window.location.reload(false);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  const onFinishEdit = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.patch(
        `/api/admin/update-clinic-service/${editingService._id}`,
        {
          ...values,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setClinicService(
        clinicService.map((val) => {
          return val._id === editingService._id ? values : val;
        })
      );

      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {}
  };

  const editClinicService = (record) => {
    setEditModal(true);

    setEditingService({ ...record });
  };

  const hideEditModal = () => {
    setEditModal(false);

    window.location.reload(false);
  };

  const getClinicService = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/admin/get-clinic-services", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      dispatch(hideLoading());
      if (response.data.success) {
        setClinicService(response.data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getClinicService();
  }, []);

  const columns = [
    {
      title: "Service Name",
      dataIndex: "serviceName",
    },
    {
      title: "Service Description",
      dataIndex: "serviceDescription",
    },
    {
      title: "Action",
      render: (text, record) => (
        <React.Fragment>
          <Space wrap>
            <Button onClick={() => editClinicService(record)} type="primary">
              <EditFilled />
            </Button>
            <Button
              onClick={() => deleteClinicService(record._id)}
              type="primary"
              danger
            >
              <DeleteFilled />
            </Button>
          </Space>
        </React.Fragment>
      ),
    },
  ];
  return (
    <Layout>
      <h1>Clinic Service</h1>
      <Button type="primary" onClick={showModal}>
        <PlusOutlined />
      </Button>
      <Modal open={open} onCancel={hideModal}>
        <Form onFinish={onFinish}>
          <Row>
            <Col>
              <Form.Item
                required
                label="Service Name"
                name="serviceName"
                rules={[{ required: true }]}
              >
                <Input placeholder="Service Name" />
              </Form.Item>
              <Form.Item
                required
                label="Service Description"
                name="serviceDescription"
                rules={[{ required: true }]}
              >
                <TextArea placeholder="Service Description" rows={4} />
              </Form.Item>
            </Col>
          </Row>
          <Button className="primary-button" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Edit Clinic Service"
        open={editModal}
        onCancel={hideEditModal}
      >
        <Form onFinish={onFinishEdit} initialValues={{ ...editingService }}>
          <Row>
            <Col>
              <Form.Item
                required
                label="Service Name"
                name="serviceName"
                rules={[{ required: true }]}
              >
                <Input placeholder="Service Name" />
              </Form.Item>
              <Form.Item
                required
                label="Description Name"
                name="serviceDescription"
                rules={[{ required: true }]}
              >
                <TextArea placeholder="Description" />
              </Form.Item>
            </Col>
          </Row>
          <Button className="primary-button" htmlType="submit">
            Update
          </Button>
        </Form>
      </Modal>
      <Table columns={columns} dataSource={clinicService} />
    </Layout>
  );
};

export default ClinicService;
