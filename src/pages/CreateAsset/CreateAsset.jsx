import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Form, Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Header from "../../components/Header";
import styles from "./CreateAsset.module.css";
import noimg from "../../assets/noimg.png";

const AssetForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { locationId } = useParams();

  const [formState, setFormState] = useState({
    title: "",
    description: "",
    tag: "",
    value: "",
    cost: "",
    location: locationId,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = (event) => {
    const file = event.file;

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
    formData.append("img", selectedFile);

    try {
      await axios.post("http://localhost:5000/asset/uploadImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  };

  const onFinish = async (values) => {
    const creationData = {
      ...values,
      img: selectedFile?.name,
      location: locationId,
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/asset/create",
        creationData
      );
      await axios.put(`http://localhost:5000/location/edit/${locationId}`, {
        assets: response.data._id,
      });
      navigate(`/location/${locationId}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.error("Failed:", errorInfo);
  };

  return (
    <div>
      <Header />
      <div className={styles.content}>
        <div className={styles.formContainer}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={formState}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <label className={styles.form__labels}>Title:</label>
            <Form.Item
              name="title"
              rules={[{ required: true, message: "Please enter title!" }]}
            >
              <Input style={{ width: "350px" }} />
            </Form.Item>
            <label className={styles.form__labels}>Description:</label>
            <Form.Item
              name="description"
              rules={[{ message: "Please enter description!" }]}
            >
              <Input style={{ width: "350px" }} />
            </Form.Item>
            <label className={styles.form__labels}>Tag:</label>
            <Form.Item
              name="tag"
              rules={[{ required: true, message: "Please enter tag!" }]}
            >
              <Input style={{ width: "350px" }} />
            </Form.Item>
            <label className={styles.form__labels}>Amount:</label>
            <Form.Item
              name="value"
              rules={[{ required: true, message: "Please enter amount!" }]}
            >
              <Input style={{ width: "350px" }} />
            </Form.Item>
            <label className={styles.form__labels}>Price:</label>

            <Form.Item
              name="cost"
              rules={[{ required: true, message: "Please enter price!" }]}
            >
              <Input style={{ width: "350px" }} />
            </Form.Item>
            <label className={styles.form__labels}>Logo:</label>
            <Form.Item>
              <Upload
                style={{ width: "350px" }}
                accept="image/*"
                beforeUpload={() => false}
                onChange={handleFileChange}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>
                  <p>Select Image</p>
                </Button>
              </Upload>

              <Button
                onClick={uploadLogo}
                style={{ marginTop: "10px", width: "145px" }}
              >
                <p>Upload Image</p>
              </Button>
            </Form.Item>

            <Form.Item
              style={{
                display: "flex",
                alignSelf: "flex-start",
              }}
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Button
                type="primary"
                htmlType="submit"
                style={{ display: "flex", alignSelf: "flex-start" }}
              >
                <p>Submit</p>
              </Button>
            </Form.Item>
          </Form>
        </div>

        <div>
          {selectedFile ? (
            <img src={imageUrl} alt="Selected Logo" className={styles.logo} />
          ) : (
            <img src={noimg} alt="Placeholder Logo" className={styles.logo} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetForm;
