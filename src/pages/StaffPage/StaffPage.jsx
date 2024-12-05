import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import styles from "./StaffPage.module.css";
import { Button, Space, Table } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";

const StaffPage = () => {
  const { locationId } = useParams();

  const [dataSource, setDataSource] = useState(null);
  const columns = [
    {
      title: "Surname",
      dataIndex: "surname",
      key: "surname",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Action",
      key: "action",
      width: "8%",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              onDelete(record);
            }}
          >
            <p>Delete</p>
          </Button>
        </Space>
      ),
    },
  ];

  const getUsersBylocation = async () => {
    await axios
      .get(`http://localhost:5000/auth/all/${locationId}`)
      .then((response) => {
        setDataSource(response.data.users);
      });
  };
  const onDelete = async (user) => {
    await axios
      .put(`http://localhost:5000/auth/edit`, {
        userId: user._id,
        locationId: locationId,
      })
      .then(() => {
        getUsersBylocation();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getUsersBylocation();
  }, []);

  return (
    <div className={styles.wrapper}>
      <Header></Header>
      <Table
        bordered
        style={{ padding: "20px" }}
        columns={columns}
        dataSource={dataSource}
      ></Table>
    </div>
  );
};

export default StaffPage;
