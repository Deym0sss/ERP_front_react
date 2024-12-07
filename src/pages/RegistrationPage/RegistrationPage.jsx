import React from "react";
import styles from "./RegistrationPage.module.css";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const onLogin = () => {
    navigate("/login");
  };
  const onFinish = (values) => {
    axios.post(`http://localhost:5000/auth/register`, values).then(() => {
      localStorage.setItem("userName", values.name);
      localStorage.setItem("userSurname", values.surname);
      axios
        .post(`http://localhost:5000/auth/id`, { email: values.email })
        .then((res) => {
          localStorage.setItem("userId", res.data.userId);
          navigate("/home");
        });
    });
  };
  const onFinishFailed = (errorInfo) => {
    console.error("Failed:", errorInfo);
  };

  return (
    <div className={styles.registerForm}>
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
        <label className={styles.formlabel}>Name:</label>
        <Form.Item
          className={styles.form__inputs}
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your name!",
            },
          ]}
        >
          <Input style={{ width: "350px" }} />
        </Form.Item>
        <label className={styles.formlabel}>Surname:</label>
        <Form.Item
          className={styles.form__inputs}
          name="surname"
          rules={[
            {
              required: true,
              message: "Please enter your surname!",
            },
          ]}
        >
          <Input style={{ width: "350px" }} />
        </Form.Item>
        <label className={styles.formlabel}>Phone:</label>
        <Form.Item
          className={styles.form__inputs}
          name="phone"
          rules={[
            {
              required: true,
              message: "Please enter your phone!",
            },
          ]}
        >
          <Input style={{ width: "350px" }} />
        </Form.Item>
        <div className={styles.form__btns}>
          <Button type="primary" onClick={onLogin}>
            <p>Login</p>
          </Button>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              <p>Submit</p>
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default RegistrationPage;
