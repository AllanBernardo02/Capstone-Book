import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { ReactReduxContext, useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Row,
  Table,
  Form,
  Modal,
  Input,
  Space,
  Select,
} from "antd";
import toast from "react-hot-toast";
import { DeleteFilled, EditFilled, EyeFilled } from "@ant-design/icons";

const PatientProfile = () => {
  const [patients, setPatients] = useState(null);
  const [patientConsultation, setPatientConsultation] = useState([]);
  const [patientData, setPatientData] = useState(null);
  const [clinicService, setClinicService] = useState([]);
  const [opens, setOpens] = useState(false); // modal
  const [totalPages, setTotalPages] = useState(1); //pagination
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const params = useParams();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  console.log("Nakuha naba ang Service?", clinicService);

  const clinicName = clinicService.map((name) => {
    return <h1>{name.serviceName}</h1>;
  });

  // let date = patientData.createdAt;
  // const newDate = date.split("T")[0];
  // setPatientData(newDate);

  const getPatientData = async () => {
    dispatch(showLoading());
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `/api/admin/get-patient-info-by-id`,
        {
          patientId: params.patientId,
          // userId: user,
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("ANO BA KASI", params.patientId);
      dispatch(hideLoading());
      if (response.data.success) {
        setPatients(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/admin/patient-consulation-history",
        {
          ...values,
          userId: user._id,
          patientId: patients._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPatientConsultation([...patientConsultation, { ...values }]);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        // navigate(`/patient-record/${patients._id}`);
      }
    } catch (error) {}
  };

  //get patient consulatation
  const getPatientConsulatation = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/admin/get-patient-consultations-history",
        {
          // patientId: patients._id,
          patientId: params.patientId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setPatientConsultation(response.data.data);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  console.log("Anong Mali?", patientConsultation);

  //modal

  const showModal = () => {
    setOpens(true);
  };

  const hideModal = () => {
    setOpens(false);
  };

  const showEditModal = async (record) => {
    setOpenModal(true);
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/admin/get-patient-consultation-history-by-id",
        {
          patientId: record._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setPatientData(response.data.data);
      }
    } catch (error) {}
  };

  const hideEditModal = () => {
    setOpenModal(false);
  };

  //onchange for select option
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const getClinicService = async () => {
    try {
      const response = await axios.get("/api/admin/get-clinic-service-name", {
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

  //render method
  useEffect(() => {
    getPatientConsulatation();
    getPatientData();
    getClinicService();
  }, []);
  console.log("Patient info", patients);

  const columns = [
    {
      title: "Consultation Name",
      dataIndex: "consultationName",
    },
    {
      title: "Date Consulted",

      render: (text, record) => <div>{record.createdAt?.split("T")[0]}</div>,
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="d-flex">
          <Space>
            <EditFilled />
            <DeleteFilled />
            <EyeFilled onClick={() => showEditModal(record)} />
          </Space>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      {patients && (
        <React.Fragment>
          <h3>
            PATIENT NAME: {patients.firstName} {patients.middleName}{" "}
            {patients.lastName}
          </h3>

          <div className="site-card-wrapper">
            <Row gutter={16}>
              <Col span={8}>
                <Card title="Details" bordered={true}>
                  <h5 style={{ color: "#005555", fontWeight: "bold" }}>
                    Birthday
                  </h5>
                  <h4>{patients.birthday}</h4>
                  <h5 style={{ color: "#005555", fontWeight: "bold" }}>
                    Civil Status
                  </h5>
                  <h4>{patients.civilStatus}</h4>
                  <h5 style={{ color: "#005555", fontWeight: "bold" }}>
                    Gender
                  </h5>
                  <h4>{patients.gender}</h4>
                  <h5 style={{ color: "#005555", fontWeight: "bold" }}>
                    Contact Number
                  </h5>
                  <h4>{patients.mobileNumber}</h4>
                  <h5 style={{ color: "#005555", fontWeight: "bold" }}>
                    Address
                  </h5>
                  <h4>{patients.address}</h4>
                  <h5 style={{ color: "#005555", fontWeight: "bold" }}>
                    Birth Place
                  </h5>
                  <h4>{patients.birthPlace}</h4>
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  title="Consultation History"
                  bordered={true}
                  style={{ width: 600 }}
                  extra={
                    <Button onClick={showModal} type="primary">
                      +
                    </Button>
                  }
                >
                  <Table
                    columns={columns}
                    dataSource={patientConsultation}
                    pagination={{
                      pageSize: 5,
                      total: totalPages,
                    }}
                  />
                </Card>
              </Col>
            </Row>
          </div>
          <Modal
            open={opens}
            title="Add Consultation Data"
            onCancel={hideModal}
          >
            <Form onFinish={onFinish}>
              <Row>
                <Col>
                  <Form.Item
                    required
                    label="Consultation Name"
                    name="consultationName"
                    rules={[{ required: true }]}
                  >
                    <select>
                      <option></option>
                      {clinicService.map((name) => (
                        <option>{name.serviceName}</option>
                      ))}
                    </select>
                  </Form.Item>

                  <Form.Item
                    required
                    label="Blood Pressure"
                    name="bloodPressure"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Blood Pressure" />
                  </Form.Item>
                  <Form.Item
                    required
                    label="weight"
                    name="weight"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Weight" />
                  </Form.Item>
                  <Form.Item
                    required
                    label="Temperature"
                    name="temparature"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Temperature" />
                  </Form.Item>
                  <Form.Item
                    required
                    label="Pulse Rate"
                    name="pulseRate"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Pulse Rate" />
                  </Form.Item>
                </Col>
              </Row>
              <Button className="primary-button" htmlType="submit">
                Submit
              </Button>
            </Form>
          </Modal>

          <Modal open={openModal} onCancel={hideEditModal}>
            {patientData && (
              <React.Fragment>
                <h1>{patientData.consultationName}</h1>
                <h1>{patientData.bloodPressure}</h1>
                <h1>{patientData.weight}</h1>
                <h1>{patientData.createdAt.split("T")[0]}</h1>
              </React.Fragment>
            )}
          </Modal>
        </React.Fragment>
      )}
    </Layout>
  );
};

export default PatientProfile;
