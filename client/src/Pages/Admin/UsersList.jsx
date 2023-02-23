import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { Button, Table } from "antd";
import toast from "react-hot-toast";
const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const dispatch = useDispatch();

  const getUsersData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "/api/admin/get-all-users",

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setUsers(response.data.data);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const updateUserPermissions = async (user, action) => {
    try {
      let payload = null;
      if (action === "make-doctor") {
        payload = {
          ...user,
          isApplyDoctor: true,
        };
      } else if (action === "remove-admin") {
        payload = {
          ...user,
          isApplyDoctor: false,
        };
      } else if (action === "block") {
        payload = {
          ...user,
          isBlocked: true,
        };
      } else if (action === "unblock") {
        payload = {
          ...user,
          isBlocked: false,
        };
      }

      dispatch(showLoading());
      const response = await axios.post(
        "/api/admin/update-user-permissions",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        getUsersData();
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getUsersData();
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
      title: "Created At",
      dataIndex: "createdAt",
    },
    {
      title: "Actions",
      dataIndex: "action",
      render: (action, record) => (
        <div className="d-flex">
          {record?.isBlocked && (
            <Button
              type="primary"
              className="underline"
              onClick={() => updateUserPermissions(record, "unblock")}
            >
              UnBlock
            </Button>
          )}
          {!record?.isBlocked && (
            <Button
              type="primary"
              danger
              className="underline"
              onClick={() => updateUserPermissions(record, "block")}
            >
              Block
            </Button>
          )}
          {record?.isApplyDoctor && (
            <Button
              type="primary"
              danger
              className="underline"
              onClick={() => updateUserPermissions(record, "remove-admin")}
            >
              Remove Doctor
            </Button>
          )}
          {!record?.isApplyDoctor && (
            <Button
              type="primary"
              className="underline"
              onClick={() => updateUserPermissions(record, "make-doctor")}
            >
              Make Doctor
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <React.Fragment>
      <Layout>
        <h1 className="page-header">Users List</h1>
        <Table
          columns={columns}
          dataSource={users}
          pagination={{
            pageSize: 5,
            total: totalPages,
          }}
        />
      </Layout>
    </React.Fragment>
  );
};

export default UsersList;
