import React from "react";
import styles from "./LoginPage.module.css";
import { Button, Form, Input } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    axios.post(`http://localhost:5000/auth/login`, values).then((response) => {
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("userName", response.data.name);
      localStorage.setItem("userSurname", response.data.surname);
      navigate("/home");
    });
  };
  const onFinishFailed = (errorInfo) => {
    console.error("Failed:", errorInfo);
  };

  const onRegister = () => {
    navigate("/registration");
  };

  return (
    <div className={styles.loginForm}>
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
        <label className={styles.formlabel}>Email:</label>
        <Form.Item
          className={styles.form__inputs}
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input style={{ width: "350px" }} />
        </Form.Item>
        <label className={styles.formlabel}>Password:</label>
        <Form.Item
          className={styles.form__inputs}
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password style={{ width: "350px" }} />
        </Form.Item>
        <div className={styles.form__btns}>
          <Button type="primary" onClick={onRegister}>
            <p className={styles.formlabel}>Register</p>
          </Button>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              <p className={styles.formlabel}>Submit</p>
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;
