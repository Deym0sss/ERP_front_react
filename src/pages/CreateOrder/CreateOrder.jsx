import React, { useState, useEffect, useMemo } from "react";
import {
  Form,
  Input,
  DatePicker,
  Button,
  Table,
  Select,
  Popconfirm,
  Typography,
} from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import cloneDeep from "lodash/cloneDeep";
import styles from "./CreateOrder.module.css";
import Header from "../../components/Header";

const MyComponent = () => {
  const [form] = Form.useForm();
  const [formState, setFormState] = useState({
    title: "",
    paymentStatus: "",
    createdAt: null,
  });
  const [assetsOptions, setAssetsOptions] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [editableData, setEditableData] = useState({});
  const navigate = useNavigate();
  const { locationId } = useParams();

  const count = useMemo(
    () => (dataSource ? dataSource.length + 1 : 0),
    [dataSource]
  );

  useEffect(() => {
    getAssetsInfo();
  }, []);

  const getAssetsInfo = () => {
    axios
      .get(`http://localhost:5000/asset/all/${locationId}`)
      .then((response) => {
        const assets = response.data.assets;
        setAssetsOptions(
          assets.map((asset) => ({ label: asset.title, value: asset._id }))
        );
      });
  };

  const getLabelByValue = (value) => {
    const option = assetsOptions.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  const addAsset = () => {
    const newData = { key: `${count}`, title: "", value: "" };
    setDataSource((prev) => [...prev, newData]);
  };

  const edit = (key) => {
    const record = dataSource.find((item) => key === item.key);
    setEditableData((prev) => ({ ...prev, [key]: cloneDeep(record) }));
  };

  const save = (key) => {
    const updatedData = dataSource.map((item) =>
      item.key === key ? { ...item, ...editableData[key] } : item
    );
    setDataSource(updatedData);
    setEditableData((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const cancel = (key) => {
    setEditableData((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const onFinish = (values) => {
    const creationData = {
      ...values,
      status: "new",
      location: locationId,
      assets: dataSource.map((item) => ({
        asset: item.title,
        quantity: item.value,
      })),
    };

    axios
      .post(`http://localhost:5000/order/create`, creationData)
      .then((response) => {
        axios
          .put(`http://localhost:5000/location/edit/${locationId}`, {
            orders: response.data.order._id,
          })
          .then(() => {
            navigate(`/orders/${locationId}`);
          });
      });
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      width: "25%",
      render: (text, record) =>
        editableData[record.key] ? (
          <Select
            style={{ width: "350px" }}
            value={editableData[record.key].title}
            onChange={(value) =>
              setEditableData((prev) => ({
                ...prev,
                [record.key]: { ...prev[record.key], title: value },
              }))
            }
            options={assetsOptions}
          />
        ) : (
          getLabelByValue(text)
        ),
    },
    {
      title: "Amount",
      dataIndex: "value",
      width: "15%",

      render: (text, record) =>
        editableData[record.key] ? (
          <Input
            value={editableData[record.key].value}
            onChange={(e) =>
              setEditableData((prev) => ({
                ...prev,
                [record.key]: { ...prev[record.key], value: e.target.value },
              }))
            }
          />
        ) : (
          text
        ),
    },
    {
      title: "Operation",
      dataIndex: "operation",
      width: "10%",

      render: (_, record) =>
        editableData[record.key] ? (
          <>
            <Typography.Link onClick={() => save(record.key)}>
              Save
            </Typography.Link>
            <Popconfirm
              title="Sure to cancel?"
              onConfirm={() => cancel(record.key)}
            >
              <a>Cancel</a>
            </Popconfirm>
          </>
        ) : (
          <a onClick={() => edit(record.key)}>Edit</a>
        ),
    },
  ];

  return (
    <>
      <div className={styles.wrapper}>
        <Header />
        <div className={styles.formContainer}>
          <Form
            form={form}
            layout="horizontal"
            onFinish={onFinish}
            initialValues={formState}
          >
            <label className={styles.form__labels}>Title:</label>
            <Form.Item
              className={styles.form__inputs}
              name="title"
              rules={[{ required: true, message: "Please input title!" }]}
            >
              <Input style={{ width: 350 }} />
            </Form.Item>
            <label className={styles.form__labels}>Payment status:</label>
            <Form.Item
              className={styles.form__inputs}
              name="paymentStatus"
              rules={[{ required: true, message: "Set Payment status!" }]}
            >
              <Input style={{ width: 350 }} />
            </Form.Item>
            <label className={styles.form__labels}>Choose date:</label>
            <Form.Item
              className={styles.form__inputs}
              name="createdAt"
              rules={[{ required: true, message: "Please pick date!" }]}
            >
              <DatePicker style={{ width: 350 }} />
            </Form.Item>
            <div className={styles.table}>
              <Button onClick={addAsset} className={styles.btn}>
                <p>Add asset to order</p>
              </Button>
              <Table
                className={styles.assets__table}
                columns={columns}
                dataSource={dataSource}
                rowKey="key"
                bordered
              />
            </div>
            <div className={styles.btnContainer}>
              <Form.Item>
                <Button className={styles.btn} type="primary" htmlType="submit">
                  <p>Submit</p>
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default MyComponent;
