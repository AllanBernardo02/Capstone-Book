import { Button, Table, Modal, Calendar } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../components/Layout";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import moment from "moment";
import { useReactToPrint } from "react-to-print";

const Appointments = () => {
  const [appointments, setAppoinments] = useState([]);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();

  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "/api/user/get-appointments-by-user-id",

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setAppoinments(response.data.data);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const onPanelChange = (value, mode) => {
    console.log(value.format("YYYY-MM-DD"), mode);
  };

  useEffect(() => {
    getAppointmentsData();
  }, []);

  const columns = [
    {
      title: "Appointment ID",
      dataIndex: "_id",
    },
    {
      title: "Doctor Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.doctorInfo.firstName} {record.doctorInfo.lastName}
        </span>
      ),
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
      render: (text, record) => <span>{record.doctorInfo.specialization}</span>,
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      render: (text, record) => <span>{record.doctorInfo.phoneNumber}</span>,
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")}{" "}
          {moment(record.time).format("hh:mm a")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div>
          {record.status === "approved" ? (
            <Button
              className="text-md underline"
              onClick={() => {
                setSelectedBooking(record);
                setShowPrintModal(true);
              }}
            >
              Print Ticket
            </Button>
          ) : (
            <Button
              className="text-md underline"
              onClick={() => {
                setSelectedBooking(record);
                setShowPrintModal(true);
              }}
              disabled
            >
              Print Ticket
            </Button>
          )}
        </div>
      ),
    },
  ];

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <React.Fragment>
      <Layout>
        <h1 className="page-header">Appointments List</h1>
        <h2>Number of Appointments : {appointments.length}</h2>
        <Table
          columns={columns}
          dataSource={appointments}
          pagination={{
            pageSize: 6,
            total: totalPages,
          }}
        />

        {showPrintModal && (
          <Modal
            title="Print Ticket"
            onCancel={() => {
              setShowPrintModal(false);
              setSelectedBooking(null);
            }}
            visible={showPrintModal}
            okText="Print"
            onOk={handlePrint}
          >
            <div className="d-flex flex-column p-5" ref={componentRef}>
              <p>Appointment ID : {selectedBooking._id}</p>
              <p>
                Doctor Name : {selectedBooking.doctorInfo.firstName}{" "}
                {selectedBooking.doctorInfo.lastName}
              </p>
              <p>
                Date & Time :{" "}
                {moment(selectedBooking.date).format("DD-MM-YYYY")}{" "}
                {moment(selectedBooking.time).format("hh:mm a")}
              </p>
              <p>Status : {selectedBooking.status}</p>
            </div>
          </Modal>
        )}

        {/* <Calendar onPanelChange={onPanelChange} /> */}
      </Layout>
    </React.Fragment>
  );
};

export default Appointments;
