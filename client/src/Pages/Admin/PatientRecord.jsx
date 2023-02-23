import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Button, Modal, Col, Form, Input, Row, Table, Space } from "antd";
import { DeleteFilled, EditFilled, EyeFilled } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
const PatientRecord = () => {
  const [open, setOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [newpatient, setNewPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [showopen, setShowOpen] = useState(false);
  const [showdelopen, setShowDelOpen] = useState(false);
  const [searchedText, setSearchedText] = useState(""); // search
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  console.table("patient", patients);

  const getPatient = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/admin/get-all-patient", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setPatients(response.data.data);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const onFinish = async (values) => {
    setOpen(false);
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/admin/patient-record",
        { ...values, userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPatients([...patients, { ...values }]);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/admin/patient-record");
      }
    } catch (error) {}
  };

  //delete modal

  const deletePatient = (id) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this patient?",

      onOk: () => {
        try {
          const response = axios
            .delete(`/api/admin/delete-patient-record/${id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
            .then(() => {
              // setPatients(patients.splice([...patients], 1));

              // setPatients([...patients]);
              // const deletedPatientId = patients.findIndex(
              //   (patient) => patient._id === id
              // );
              // const newPatientList = [...patients].splice(deletedPatientId);
              // setPatients(newPatientList);

              setPatients(
                patients.filter((val) => {
                  return val._id !== id;
                })
              );
            });

          if (response.data.success) {
            console.log("Success?", response.data.success);

            toast.success(response.data.message);
          }
        } catch (error) {}
      },
    });
  };

  const showEditModal = (record) => {
    setShowOpen(true);
    // setNewPatient({ ...record, id });

    setEditingPatient({ ...record });
  };

  const handleCancelModel = () => {
    setShowOpen(false);
    window.location.reload(false);
  };

  // const getPatientData = async () => {
  //   try {
  //     dispatch(showLoading());
  //     const response = await axios.post(
  //       "/api/admin/get-patient-info-by-patient-id",
  //       { patientId: params.patientId },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     console.log("ano kaya?", response);

  //     dispatch(hideLoading());
  //     if (response.data.success) {
  //       setNewPatient(response.data.data);
  //     }
  //   } catch (error) {
  //     dispatch(hideLoading());
  //   }
  // };

  console.log("ANONG LAMAN???", editingPatient);

  const onFinishEdit = async (values) => {
    setShowOpen(false);
    try {
      dispatch(showLoading());
      const response = await axios.patch(
        `/api/admin/update-patient-profile/${editingPatient._id}`,
        {
          ...values,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPatients(
        patients.map((val) => {
          return val._id === editingPatient._id ? values : val;
        })
      );

      // const newNotes = [...patients];
      // const noteIndex = patients.findIndex((note) => {
      //   return note._id === editingPatient._id;
      // });
      // newNotes[noteIndex] = response.data.data.note;
      // setPatients(newNotes);

      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/admin/patient-record");
      }
    } catch (error) {}
  };

  useEffect(() => {
    getPatient();
    // getPatientData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.firstName)
            ?.toLowerCase()
            ?.includes(value.toLowerCase()) ||
          String(record.middleName)
            ?.toLowerCase()
            ?.includes(value.toLowerCase()) ||
          String(record.lastName)?.toLowerCase()?.includes(value.toLowerCase())
        );
      },
      render: (text, record) => (
        <span>
          {record?.firstName} {record?.middleName} {record?.lastName}
        </span>
      ),
    },
    {
      title: "Birthday",
      dataIndex: "birthday",
    },
    {
      title: "Civil Status",
      dataIndex: "civilStatus",
    },
    {
      title: "Gender",
      dataIndex: "gender",
    },
    {
      title: "Contact",
      dataIndex: "mobileNumber",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Birth Place",
      dataIndex: "birthPlace",
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="d-flex">
          <Space>
            <EditFilled
              style={{ color: "#08c" }}
              onClick={() => showEditModal(record)}
            />

            <DeleteFilled
              style={{ color: "#f54242" }}
              onClick={() => deletePatient(record._id)}
            ></DeleteFilled>

            <EyeFilled
              onClick={() => navigate(`/patient-profile/${record._id}`)}
            ></EyeFilled>
          </Space>
        </div>
      ),
    },
  ];

  return (
    <React.Fragment>
      <Layout>
        <h1 className="page-header">Patient Record Table</h1>
        <Button type="primary" onClick={showModal}>
          +
        </Button>
        <Modal
          open={open}
          onCancel={handleCancel}
          footer={[
            <React.Fragment>
              <Button
                className="primary-button"
                key="back"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </React.Fragment>,
          ]}
        >
          <h1>Add Patient</h1>
          <Form onFinish={onFinish}>
            <Row>
              <Col>
                <Form.Item
                  required
                  label="First Name"
                  name="firstName"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="FirstName" />
                </Form.Item>
                <Form.Item
                  required
                  label="Last Name"
                  name="lastName"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="LastName" />
                </Form.Item>
                <Form.Item
                  required
                  label="Middle Name"
                  name="middleName"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="MiddleName" />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  required
                  label="Birthday"
                  name="birthday"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Birthday" />
                </Form.Item>
                <Form.Item
                  required
                  label="Civil Status"
                  name="civilStatus"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Civil Status" />
                </Form.Item>
                <Form.Item
                  required
                  label="Gender"
                  name="gender"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Gender" />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  required
                  label="Mobile Number"
                  name="mobileNumber"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Mobile Number" />
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
                  label="Birth Place"
                  name="birthPlace"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Birth Place" />
                </Form.Item>
              </Col>
            </Row>
            <Button className="primary-button" htmlType="submit">
              Submit
            </Button>
          </Form>
        </Modal>
        <Input.Search
          placeholder="Search here..."
          style={{ marginBottom: 8 }}
          onSearch={(value) => {
            setSearchedText(value);
          }}
          onChange={(e) => {
            setSearchedText(e.target.value);
          }}
        />
        <Table
          columns={columns}
          dataSource={patients}
          pagination={{
            pageSize: 5,
            total: totalPages,
          }}
        />

        <Modal
          title="Edit Patient Details"
          open={showopen}
          onCancel={handleCancelModel}
          okText="Submit"
        >
          <Form onFinish={onFinishEdit} initialValues={{ ...editingPatient }}>
            <Row>
              <Col>
                <Form.Item
                  required
                  label="First Name"
                  name="firstName"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="FirstName" />
                </Form.Item>
                <Form.Item
                  required
                  label="Last Name"
                  name="lastName"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="LastName" />
                </Form.Item>
                <Form.Item
                  required
                  label="Middle Name"
                  name="middleName"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="MiddleName" />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  required
                  label="Birthday"
                  name="birthday"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Birthday" />
                </Form.Item>
                <Form.Item
                  required
                  label="Civil Status"
                  name="civilStatus"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Civil Status" />
                </Form.Item>
                <Form.Item
                  required
                  label="Gender"
                  name="gender"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Gender" />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  required
                  label="Mobile Number"
                  name="mobileNumber"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Mobile Number" />
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
                  label="Birth Place"
                  name="birthPlace"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Birth Place" />
                </Form.Item>
              </Col>
            </Row>
            <Button className="primary-button" htmlType="submit">
              Submit
            </Button>
          </Form>
        </Modal>
      </Layout>
    </React.Fragment>
  );
};

export default PatientRecord;
