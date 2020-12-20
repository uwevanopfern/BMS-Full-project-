import React from "react";
import "../App.css";
import { login, BEARERTOKEN } from "../store";
import axios from "axios";
import SearchBuilding from "./SearchBuilding";
import Contact from "./Contact";
import { Redirect } from "react-router";

import { Form, Input, Button, Row, Col, Alert, Card } from "antd";

import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";

class Login extends React.Component {
  state = {
    errorMessage: "",
    badRequest: "",
    redirect: false,
    loadings: [],
  };
  handleLoginForm = (values) => {
    const username = values.email;
    const password = values.password;

    axios
      .post(
        login,
        {
          username: username,
          password: password,
        },
        {
          headers: { Authorization: BEARERTOKEN },
        }
      )
      .then((res) => {
        let response = JSON.stringify(res.data.response);
        localStorage.setItem("user_object", response);
        // console.log (res.data.response);
        // console.log (res.status);
        this.setState({ redirect: true });
      })
      .catch((err) => {
        this.setState({ badRequest: err.response.status });
        console.log(err.response);
        this.setState({ errorMessage: err.response.data.response });
        // console.log (this.state.errorMessage);
      });
  };

  onClose = (e) => {
    console.log(e, "I was closed.");
  };

  render() {
    const { redirect } = this.state;
    const { loadings } = this.state;

    if (redirect) {
      return <Redirect to="/home" />;
    }
    return (
      <div className="container" style={{ marginTop: 50 }}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={10} xl={10} offset={8}>
            <Card title="Login">
              {this.state.errorMessage ? (
                <Alert
                  message={this.state.errorMessage}
                  type="error"
                  closable
                  onClose={this.onClose}
                />
              ) : (
                ""
              )}
              <br></br>
              <Form onFinish={this.handleLoginForm}>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                  ]}
                >
                  <Input
                    name="email"
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Email"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password
                    name="password"
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                  />
                </Form.Item>
                <Form.Item>
                  <a className="login-form-forgot" href="">
                    Forgot password
                  </a>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="default"
                    htmlType="submit"
                    size="medium"
                    icon={<LoginOutlined />}
                  >
                    Log in
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Login;
