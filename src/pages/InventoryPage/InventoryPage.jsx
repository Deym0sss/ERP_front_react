import React, { useEffect, useState } from "react";
import { Button, Form, Input, Popconfirm, Table, Typography } from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./InventoryPage.module.css";

// Компонент редактируемой ячейки
const EditableCell = ({
  editing,
  dataIndex,
  title,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = <Input />; // Все инпуты теперь текстовые (строчные)
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

  // Проверяем, редактируется ли строка
  const isEditing = (record) => record.key === editingKey;

  // Редактирование строки
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

  // Отмена редактирования
  const cancel = () => {
    setEditingKey("");
  };

  // Сохранение данных после редактирования
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

  // Определение колонок
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
      editable: true, // Столбец "Amount" редактируемый
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

  // Мерджим редактируемые колонки
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "text", // Все ячейки редактируем через Input (строчный)
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
