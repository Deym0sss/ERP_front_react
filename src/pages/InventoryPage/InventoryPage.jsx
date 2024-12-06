import React, { useEffect, useState } from "react";
import { Button, Form, Input, Popconfirm, Table, Typography } from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./InventoryPage.module.css";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const App = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      title: "",
      tag: "",
      value: "",
      cost: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setDataSource(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setDataSource(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.error("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "25%",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
      width: "15%",
    },
    {
      title: "Amount",
      dataIndex: "value",
      key: "value",
      width: "20%",
      editable: true,
    },
    {
      title: "Price",
      dataIndex: "cost",
      key: "cost",
      width: "20%",
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginInlineEnd: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const { locationId } = useParams();
  const navigate = useNavigate();
  const onSubmit = async () => {
    const inventoryResult = dataSource.map((asset) => {
      return { assetId: asset._id, value: asset.value };
    });

    await axios
      .put(`http://localhost:5000/asset/inventory`, inventoryResult)
      .then(navigate(`/location/${locationId}`));
  };

  const getAssetsInfo = async () => {
    await axios
      .get(`http://localhost:5000/asset/all/${locationId}`)
      .then((response) => {
        const assets = response.data.assets.map((item, index) => ({
          key: index.toString(),
          ...item,
        }));
        setDataSource(assets);
      });
  };

  useEffect(() => {
    getAssetsInfo();
  }, [locationId]);

  return (
    <div>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={dataSource}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
      <div className={styles.btnContainer}>
        <Button onClick={onSubmit} className={styles.submitBtn}>
          <p>Submit</p>
        </Button>
      </div>
    </div>
  );
};

export default App;
