import React from "react";
import "../App.css";
import axios from "axios";
import { register, BEARERTOKEN } from "../store";
import Highlighter from "react-highlight-words";
import {
  Table,
  Input,
  Button,
  Space,
  Popconfirm,
  Col,
  Row,
  Form,
  Upload,
  DatePicker,
  Select,
  Typography,
} from "antd";

import { SearchOutlined, EyeOutlined, InboxOutlined } from "@ant-design/icons";

const { Text } = Typography;

class User extends React.Component {
  state = {
    searchText: "",
    searchedColumn: "",
    allBuildingTenants: [],
    componentSize: 0,
    errorMessage: "",
  };

  componentDidMount() {
    console.log(this.getColumnSearchProps("tenant_names"));
    const userObject = localStorage.getItem("user_object")
      ? localStorage.getItem("user_object")
      : "";

    let convertedUserObject = JSON.parse(userObject);
    this.setState({
      id: convertedUserObject.id,
      buildingId: convertedUserObject.buildingId,
    });
    //Get all tenants of specific building
    // axios
    //   .get(buildingTenants(convertedUserObject.buildingId), {
    //     headers: { Authorization: BEARERTOKEN },
    //   })
    //   .then((res) => {
    //     this.setState({
    //       allBuildingTenants: res.data,
    //     });
    //     console.log(this.allBuildingTenants);
    //   });
  }

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  handleViewTenantDetails = (id) => {
    return this.props.history.push(`/tenant-details/${id}`);
  };

  onFormLayoutChange = ({ size }) => {
    // setComponentSize(size);
    this.setState({
      componentSize: size,
    });
  };

  normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  handleUserCreation = (values) => {
    const name = values.name;
    const email = values.email;
    const password = values.password;
    const confirmPassword = values.confirmPassword;

    axios
      .post(
        register,
        {
          name: name,
          email: email,
          password: password,
          password2: confirmPassword,
          password: password,
        },
        {
          headers: { Authorization: BEARERTOKEN },
        }
      )
      .then((res) => {
        console.log(res.data.response);
      })
      .catch((err) => {
        console.log(err.response.data.response.email[0]);
        this.setState({ errorMessage: err.response.data.response });
        // console.log(this.state.errorMessage.password);
      });
  };

  render() {
    const columns = [
      {
        title: "Name",
        dataIndex: "tenant_names",
        fixed: "left",
        ...this.getColumnSearchProps("tenant_names"),
      },
      {
        title: "Email",
        dataIndex: "tenant_main_email",
        ...this.getColumnSearchProps("tenant_main_email"),
      },
      {
        title: "Phone",
        dataIndex: "tenant_main_phone",
        ...this.getColumnSearchProps("tenant_main_phone"),
      },
      {
        title: "TIN",
        dataIndex: "tenant_tin",
        ...this.getColumnSearchProps("tenant_tin"),
      },
      {
        title: "Pmt date",
        dataIndex: "payment_date",
      },
      {
        title: "Pmt method",
        dataIndex: "payment_method",
        ...this.getColumnSearchProps("payment_method"),
      },
      {
        title: "Rental amount",
        dataIndex: "rental_amount",
      },
      {
        title: "Rm name",
        dataIndex: "room_name",
        ...this.getColumnSearchProps("room_name"),
      },
      {
        title: "Rm number",
        dataIndex: "room_number",
      },
      {
        title: "Action",
        dataIndex: "id",
        // ...this.getColumnSearchProps("id"),
        fixed: "right",
        render: (record) =>
          this.state.allBuildingTenants.length >= 1 ? (
            <Popconfirm
              title="View tenant details"
              onConfirm={() => this.handleViewTenantDetails(record)}
            >
              <a>
                <EyeOutlined />
              </a>
            </Popconfirm>
          ) : null,
      },
    ];

    return (
      <>
        <div>
          <Row>
            <Col xs={24} sm={24} md={5} lg={5} xl={5}>
              <h3>Add a new user</h3>
              <br></br>
              <Form onFinish={this.handleUserCreation}>
                <Form.Item
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter User Name",
                    },
                  ]}
                >
                  <Input placeholder="UserName" />
                </Form.Item>
                <p>
                  {this.state.errorMessage ? (
                    <Text type="danger">
                      {this.state.errorMessage.email[0]
                        .charAt(0)
                        .toUpperCase() +
                        this.state.errorMessage.email[0].slice(1)}
                    </Text>
                  ) : (
                    ""
                  )}
                </p>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please enter User Email",
                    },
                  ]}
                >
                  <Input placeholder="UserEmail" />
                </Form.Item>
                <p>
                  {this.state.errorMessage ? (
                    <Text type="danger">
                      {this.state.errorMessage.password[0]
                        .charAt(0)
                        .toUpperCase() +
                        this.state.errorMessage.password[0].slice(1)}
                    </Text>
                  ) : (
                    ""
                  )}
                </p>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter User Password",
                    },
                  ]}
                >
                  <Input type="password" placeholder="Password" />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  rules={[
                    {
                      required: true,
                      message: "Please Confirm Password",
                    },
                  ]}
                >
                  <Input type="password" placeholder="confirm Password" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Add user
                  </Button>
                </Form.Item>
              </Form>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={{ span: 17, offset: 1 }}
              lg={{ span: 17, offset: 1 }}
              xl={{ span: 17, offset: 1 }}
            >
              <h3>List of tenants</h3>
              <br></br>
              <br></br>
              <Table
                columns={columns}
                dataSource={this.state.allBuildingTenants}
                pagination={{ pageSize: 4 }}
                scroll={{ x: 1300 }}
              />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default User;
