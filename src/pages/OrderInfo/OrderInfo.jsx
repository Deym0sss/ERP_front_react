import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import styles from "./OrderInfo.module.css";
import { Button, Table } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrderInfo = () => {
  const { orderId } = useParams();
  const [payDisabled, setPayDisabled] = useState(false);
  const [orderInfo, setOrderInfo] = useState();
  const [dataSource, setDataSource] = useState();

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "60%",
    },
    {
      title: "Amount",
      dataIndex: "value",
      key: "value",
      width: "40%",
    },
  ];

  const getOrderInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/order/ids/${orderId}`
      );
      const orderTemp = response.data.orders[0];
      setOrderInfo(orderTemp);
      const assetIds = assetsIdsToString(orderTemp);
      await getAssetTitles(assetIds, orderTemp);
      checkPaymentStatus();
    } catch (error) {
      console.error("Error fetching order info:", error);
    }
  };

  const assetsIdsToString = (order) => {
    const assetString = order.assets.map((item) => item.asset).join(",");
    return assetString;
  };

  const getAssetTitles = async (ids, orderTemp) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/asset/ids/${ids}`
      );
      const assetsInfo = response.data.assets;
      const result = assetsInfo
        .map((asset) => {
          const order = orderTemp.assets.find(
            (order) => order.asset === asset._id
          );
          if (order) {
            return {
              key: asset._id,
              title: asset.title,
              value: order.quantity,
            };
          }
          return null;
        })
        .filter((item) => item !== null);
      setDataSource(result);
    } catch (error) {
      console.error("Error fetching asset titles:", error);
    }
  };

  const checkPaymentStatus = () => {
    if (orderInfo?.paymentStatus === "paid") {
      setPayDisabled(true);
    }
  };

  const setPaymentStatus = async () => {
    await axios
      .put(`http://localhost:5000/order/edit/${orderId}`, {
        paymentStatus: "paid",
      })
      .then(() => {
        getOrderInfo();
      });
  };
  const setStatusInProgress = async () => {
    await axios
      .put(`http://localhost:5000/order/edit/${orderId}`, {
        status: "in progress",
      })
      .then(() => {
        getOrderInfo();
      });
  };
  const setStatusDone = async () => {
    await axios
      .put(`http://localhost:5000/order/edit/${orderId}`, {
        status: "done",
      })
      .then(() => {
        getOrderInfo();
      });
  };

  const updateAmount = async () => {
    const tempDataSource = dataSource.map(({ key, value }) => ({ key, value }));
    await axios.put(`http://localhost:5000/asset/editForOrder`, {
      assets: tempDataSource,
    });
  };

  useEffect(() => {
    getOrderInfo();
  }, []);

  return (
    <div>
      <Header></Header>
      <div className={styles.content}>
        <div className={styles.content__staff}>
          {orderInfo && (
            <div className={styles.content__staff__info}>
              <div className={styles.content__staff__Info__element}>
                <label>Title</label>
                <p>{orderInfo.title}</p>
              </div>
              <div className={styles.content__locationInfo__element}>
                <label>Status</label>
                <p>{orderInfo.status}</p>
              </div>
              <div className={styles.content__locationInfo__element}>
                <label>Payment status</label>
                <p>{orderInfo.paymentStatus}</p>
              </div>
              <div className={styles.content__locationInfo__element}>
                <label>Creation date</label>
                <p>{orderInfo.createdAt.split("T")[0]}</p>
              </div>
            </div>
          )}
        </div>
        <div className={styles.table}>
          <Table bordered columns={columns} dataSource={dataSource} />
        </div>
        <div className={styles.btnContainer}>
          {orderInfo?.paymentStatus === "unpaid" && (
            <Button
              disabled={payDisabled}
              onClick={setPaymentStatus}
              className={styles.btn}
            >
              <p>Pay</p>
            </Button>
          )}

          {orderInfo?.status === "new" ? (
            <Button onClick={setStatusInProgress} className={styles.btn}>
              <p>Start</p>
            </Button>
          ) : orderInfo?.status === "in progress" ? (
            <Button
              onClick={() => {
                setStatusDone();
                updateAmount();
              }}
              className={styles.btn}
            >
              <p>Start</p>
            </Button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;
