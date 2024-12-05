import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import styles from "./OrdersPage.module.css";
import { Button, Space, Table } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const OrdersPage = () => {
  const navigate = useNavigate();
  const { locationId } = useParams();
  const [dataSource, setDataSource] = useState(null);

  const getOrders = async () => {
    await axios
      .get(`http://localhost:5000/order/all/${locationId}`)
      .then((response) => {
        setDataSource(response.data.orders);
      });
  };

  const onDeleteOrder = async (order) => {
    await axios.delete(`http://localhost:5000/order/${order._id}`).then(() => {
      axios
        .put(`http://localhost:5000/location/removeOrder`, {
          orderId: order._id,
          locationId: locationId,
        })
        .then(() => {
          getOrders();
        });
    });
  };
  const createOrder = () => {
    navigate(`/orders/create/${locationId}`);
  };
  const onOpenOrder = (order) => {
    navigate(`/order/${order._id}`);
  };
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Payment status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
    },
    {
      title: "Actions",
      key: "actions",
      width: "10%",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              onOpenOrder(record);
            }}
          >
            <p>Open </p>
          </Button>
          <Button
            onClick={() => {
              onDeleteOrder(record);
            }}
          >
            <p>Delete</p>
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div>
      <Header></Header>
      <div className={styles.table}>
        <Table columns={columns} dataSource={dataSource} />
      </div>
      <div className={styles.btnContainer}>
        <Button onClick={createOrder} className={styles.btn}>
          <p>Create order</p>
        </Button>
      </div>
    </div>
  );
};

export default OrdersPage;
