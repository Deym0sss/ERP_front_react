import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import styles from "./СreateLocation.module.css";
import { Button, Form, Input, Select } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import noimage from "../../assets/noimg.png";

const CreateLocation = () => {
  const navigate = useNavigate();

  const [staffOptions, setStaffOptions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    setSelectedFile(file);
    if (file && file.type.startsWith("image")) {
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const uploadLogo = async () => {
    if (!selectedFile) {
      alert("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("logo", selectedFile);
    try {
      await axios.post("http://localhost:5000/location/uploadLogo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  };
  const onFinish = async (values) => {
    const creationData = values;
    creationData.logo = selectedFile.name;
    const userId = localStorage.getItem("userId");

    await axios
      .post(`http://localhost:5000/location/create`, creationData)
      .then((response) => {
        navigate("/home");
        axios.put(`http://localhost:5000/auth/edit/${userId}`, {
          locationIds: [response.data.location._id],
        });
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.error("Failed:", errorInfo);
  };
  const getUsersData = async () => {
    await axios.get(`http://localhost:5000/auth/users`).then((response) => {
      const transformedData = response.data.map((item) => ({
        label: `${item.surname} ${item.name}`,
        value: item._id,
      }));
      setStaffOptions(transformedData);
    });
  };

  useEffect(() => {
    getUsersData();
  }, [setSelectedFile]);

  return (
    <div>
      <Header></Header>
      <div className={styles.content}>
        <div className={styles.formContainer}>
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <label>Title:</label>
            <Form.Item
              className={styles.form__inputs}
              name="title"
              rules={[
                {
                  required: true,
                  message: "Please enter location title!",
                },
              ]}
            >
              <Input style={{ width: "350px" }} />
            </Form.Item>
            <label>Description:</label>
            <Form.Item className={styles.form__inputs} name="description">
              <Input style={{ width: "350px" }} />
            </Form.Item>
            <label>Address:</label>
            <Form.Item
              className={styles.form__inputs}
              name="address"
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
              ]}
            >
              <Input style={{ width: "350px" }} />
            </Form.Item>
            <label>Staff:</label>
            <Form.Item
              className={styles.form__inputs}
              name="Staff"
              rules={[
                {
                  required: true,
                  message: "Please enter your surname!",
                },
              ]}
            >
              <Select
                options={staffOptions}
                placeholder="Please select "
                mode="multiple"
                variant="filled"
                style={{ width: "350px" }}
              />
            </Form.Item>
            <label>City:</label>
            <Form.Item
              className={styles.form__inputs}
              name="city"
              rules={[
                {
                  required: true,
                  message: "Please enter your phone!",
                },
              ]}
            >
              <Input style={{ width: "350px" }} />
            </Form.Item>
            <label>Country:</label>
            <Form.Item
              className={styles.form__inputs}
              name="country"
              rules={[
                {
                  required: true,
                  message: "Please enter your phone!",
                },
              ]}
            >
              <Input style={{ width: "350px" }} />
            </Form.Item>
            <div className={styles.upload}>
              <div className={styles.upload__label}>
                <label>
                  Choose logo
                  <input
                    className={styles.upload__input}
                    type="file"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <Button className={styles.upload__btn} onClick={uploadLogo}>
                Upload logo
              </Button>
            </div>
            <div className={styles.form__btns}>
              <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                  <p>Submit</p>
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
        {selectedFile !== null ? (
          <div>
            <img src={imageUrl} alt="Selected Logo" className={styles.logo} />
          </div>
        ) : (
          <div className={styles.placeholder}>
            <img src={noimage} alt="Selected Logo" className={styles.logo} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateLocation;
