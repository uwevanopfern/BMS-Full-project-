import React from "react";
import "../App.css";
import axios from "axios";
import {
  buildingTenants,
  buildingRooms,
  addTenant,
  BEARERTOKEN,
} from "../store";
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
  message,
} from "antd";

import moment from "moment";

import {
  SearchOutlined,
  EyeOutlined,
  DownloadOutlined,
  UploadOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const { Option } = Select;

class Tenant extends React.Component {
  state = {
    searchText: "",
    searchedColumn: "",
    allBuildingTenants: [],
    allBuildingRooms: [],
    errorMessage: "",
  };

  componentDidMount() {
    const userObject = localStorage.getItem("user_object")
      ? localStorage.getItem("user_object")
      : "";

    let convertedUserObject = JSON.parse(userObject);
    this.setState({
      id: convertedUserObject.id,
      buildingId: convertedUserObject.buildingId,
    });

    //Get all rooms of specific building
    axios
      .get(buildingRooms(convertedUserObject.buildingId), {
        headers: { Authorization: BEARERTOKEN },
      })
      .then((res) => {
        this.setState({
          allBuildingRooms: res.data.response,
        });
      })
      .catch((err) => {
        this.setState({ errorMessage: err.response.data });
      });
    //Get all tenants of specific building
    axios
      .get(buildingTenants(convertedUserObject.buildingId), {
        headers: { Authorization: BEARERTOKEN },
      })
      .then((res) => {
        this.setState({
          allBuildingTenants: res.data,
        });
      });
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

  handleViewTenantContract = (record) => {
    let file = record.split("/");
    // console.log("File Name", file[5]);
    const link = document.createElement("a");
    link.href = record;
    link.setAttribute("download", `${file[5]}`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
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

  handleTenantCreation = (values) => {
    const formData = new FormData();
    //Append files to form data
    formData.append("tenant_names", values.tenant_names);
    formData.append("tenant_tin", values.tenant_tin);
    formData.append("tenant_main_phone", values.tenant_main_phone);
    formData.append("tenant_main_email", values.tenant_main_email);
    formData.append("payment_date", values.payment_date);
    formData.append("payment_method", values.payment_method);
    formData.append("rental_amount", values.rental_amount);
    formData.append("business_desc", values.business_desc);
    formData.append("room", values.room);
    formData.append("contract", values.contract.file.originFileObj);

    axios
      .post(addTenant, formData, {
        headers: { Authorization: BEARERTOKEN },
      })
      .then((res) => {
        message.success("Tennant added successfully", 10);
        // this.state.allBuildingTenants.push(res.data);
      })
      .catch((err) => {
        this.setState({ errorMessage: err.response.data });
      });

    setTimeout("location.reload(true);", 2000);
  };

  render() {
    const columns = [
      {
        title: "Name",
        dataIndex: "tenant_names",
        fixed: "left",
        width: "15%",
        ...this.getColumnSearchProps("tenant_names"),
      },
      {
        title: "Email",
        dataIndex: "tenant_main_email",
        width: "16%",
        ...this.getColumnSearchProps("tenant_main_email"),
      },
      {
        title: "Phone",
        dataIndex: "tenant_main_phone",
        width: "12%",
        ...this.getColumnSearchProps("tenant_main_phone"),
      },
      {
        title: "TIN",
        dataIndex: "tenant_tin",
        width: "10%",
        ...this.getColumnSearchProps("tenant_tin"),
      },
      {
        title: "Pmt date",
        dataIndex: "payment_date",
        width: "12%",
        render: (record) => moment(record).format("YYYY-MM-DD HH:mm"),
      },
      {
        title: "Pmt method",
        dataIndex: "payment_method",
        width: "12%",
        ...this.getColumnSearchProps("payment_method"),
      },
      {
        title: "Rental amount",
        dataIndex: "rental_amount",
        width: "12%",
        // render: (record) => `${record.toLocaleString()} RWF`,
        render: (record) => {
          return (
            <>
              <Text code>{`${record.toLocaleString()} RWF`}</Text>
            </>
          );
        },
      },
      {
        title: "Rm name",
        dataIndex: "room_name",
        width: "10%",
        ...this.getColumnSearchProps("room_name"),
      },
      {
        title: "Rm number",
        dataIndex: "room_number",
        width: "9%",
      },
      {
        title: <DownloadOutlined />,
        dataIndex: "contract",
        width: "5%",
        render: (record) => {
          return (
            <>
              <a onClick={() => this.handleViewTenantContract(record)}>
                <DownloadOutlined />
              </a>
            </>
          );
        },
      },
      {
        title: "Action",
        dataIndex: "id",
        fixed: "right",
        width: "6%",

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
        <Row>
          <Col xs={24} sm={24} md={4} lg={4} xl={4}>
            <h3>Add a new tenant</h3>
            <br></br>
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              onFinish={this.handleTenantCreation}
            >
              <Form.Item
                name="tenant_names"
                rules={[
                  {
                    required: true,
                    message: "Please input tenant name!",
                  },
                ]}
              >
                <Input name="tenant_names" placeholder="Tenant names" />
              </Form.Item>
              <p>
                {this.state.errorMessage ? (
                  <Text type="danger">
                    {this.state.errorMessage.tenant_tin[0]
                      .charAt(0)
                      .toUpperCase() +
                      this.state.errorMessage.tenant_tin[0].slice(1)}
                  </Text>
                ) : (
                  ""
                )}
              </p>
              <Form.Item
                name="tenant_tin"
                rules={[
                  {
                    required: true,
                    message: "Please input tenant TIN!",
                  },
                ]}
              >
                <Input name="tenant_tin" placeholder="Tenant TIN" />
              </Form.Item>
              <p>
                {this.state.errorMessage ? (
                  <Text type="danger">
                    {this.state.errorMessage.tenant_main_email[0]
                      .charAt(0)
                      .toUpperCase() +
                      this.state.errorMessage.tenant_main_email[0].slice(1)}
                  </Text>
                ) : (
                  ""
                )}
              </p>

              <Form.Item
                name="tenant_main_email"
                rules={[
                  {
                    required: true,
                    message: "Please input tenant Email!",
                  },
                ]}
              >
                <Input name="tenant_main_email" placeholder="Tenant Email" />
              </Form.Item>
              <Form.Item
                name="tenant_main_phone"
                rules={[
                  {
                    required: true,
                    message: "Please input tenant phone number!",
                  },
                ]}
              >
                <Input name="tenant_main_phone" placeholder="Phone number" />
              </Form.Item>
              <Form.Item
                name="payment_date"
                rules={[
                  {
                    required: true,
                    message: "Please select payment_date!",
                  },
                ]}
              >
                <DatePicker name="payment_date" />
              </Form.Item>
              <Form.Item
                name="payment_method"
                rules={[
                  {
                    required: true,
                    message: "Please input tenant payment method!",
                  },
                ]}
              >
                <Input name="payment_method" placeholder="Payment method" />
              </Form.Item>
              <Form.Item
                name="rental_amount"
                rules={[
                  {
                    required: true,
                    message: "Please input tenant rental amount",
                  },
                ]}
              >
                <Input name="rental_amount" placeholder="Rental amount" />
              </Form.Item>
              <Form.Item
                name="business_desc"
                rules={[
                  {
                    required: true,
                    message: "Please input tenant business description",
                  },
                ]}
              >
                <Input
                  name="business_desc"
                  placeholder="Business description"
                />
              </Form.Item>
              <Form.Item
                name="room"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please select tenant room!",
                  },
                ]}
              >
                <Select placeholder="Please select tenant room" name="room">
                  {this.state.allBuildingRooms.map((room) => (
                    <Option key={room.id} value={room.id}>
                      {room.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="contract" noStyle>
                <Upload action="/upload.do" listType="picture">
                  <Button icon={<UploadOutlined />}>
                    Upload contract file
                  </Button>
                </Upload>
              </Form.Item>
              <br></br>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  <UserAddOutlined />
                  Add a new tenant
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={{ span: 18, offset: 1 }}
            lg={{ span: 18, offset: 1 }}
            xl={{ span: 18, offset: 1 }}
          >
            <h3>List of tenants</h3>
            <br></br>
            <br></br>
            <Table
              size="small"
              columns={columns}
              dataSource={this.state.allBuildingTenants}
              pagination={{ pageSize: 13 }}
              scroll={{ x: 1300 }}
            />
          </Col>
        </Row>
      </>
    );
  }
}

export default Tenant;
