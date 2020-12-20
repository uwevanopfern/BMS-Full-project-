import React from "react";
import "../App.css";
import { buildingFloors, floorDetail, BEARERTOKEN, addFloor } from "../store";
import axios from "axios";
import {
  Table,
  Input,
  Button,
  Space,
  Popconfirm,
  Col,
  Row,
  Form,
  Typography,
  message,
} from "antd";

import Highlighter from "react-highlight-words";

import {
  SearchOutlined,
  EyeOutlined,
  DeleteFilled,
  QuestionCircleOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

class Floor extends React.Component {
  state = {
    id: "",
    email: "",
    name: "",
    buildingId: "",
    building_name: "",
    building_acronym: "",
    is_manager: "",
    is_employee: "",
    allBuildingFloors: [],
  };
  componentDidMount() {
    const userObject = localStorage.getItem("user_object")
      ? localStorage.getItem("user_object")
      : "";

    let convertedUserObject = JSON.parse(userObject);
    this.setState({
      id: convertedUserObject.id,
      email: convertedUserObject.email,
      name: convertedUserObject.name,
      buildingId: convertedUserObject.buildingId,
      building_name: convertedUserObject.building_name,
      building_acronym: convertedUserObject.building_acronym,
      is_manager: convertedUserObject.is_manager,
      is_employee: convertedUserObject.is_employee,
    });
    // console.log (convertedUserObject);

    //Get all floors of specific building
    axios
      .get(buildingFloors(convertedUserObject.buildingId), {
        headers: { Authorization: BEARERTOKEN },
      })
      .then((res) => {
        // console.log (res.data.response);
        this.setState({
          allBuildingFloors: res.data.response,
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

  handleViewFloorDetails = (id) => {
    return this.props.history.push(`/floor-details/${id}`);
  };

  handleDeleteFloor = (id) => {
    // console.log(id);
    axios
      .delete(floorDetail(id, this.state.buildingId), {
        headers: { Authorization: BEARERTOKEN },
      })
      .then(() => {
        message.error("Floor deleted successfully");
        setTimeout("location.reload(true);", 1000);
      });
  };

  handleFloorCreation = (values) => {
    const name = values.name;
    const number = values.number;
    axios
      .post(
        addFloor,
        {
          name: name,
          number: number,
          building: this.state.buildingId,
        },
        {
          headers: { Authorization: BEARERTOKEN },
        }
      )
      .then((res) => {
        // console.log (res.data.response);
        console.log(res.status);
        message.success("Floor added with successfully");
        setTimeout("location.reload(true);", 1500);
      })
      .catch((err) => {
        this.setState({ badRequest: err.response.status });
        this.setState({ errorMessage: err.response.data.response });
        console.log(this.state.errorMessage);
      });
  };

  render() {
    const columns = [
      {
        title: "Floor name",
        dataIndex: "name",
        fixed: "left",
        width: "15%",
        ...this.getColumnSearchProps("name"),
      },
      {
        title: "Floor number",
        dataIndex: "number",
        width: "16%",
        ...this.getColumnSearchProps("number"),
      },
      {
        title: "Building",
        dataIndex: "building_acronym",
        width: "12%",
        ...this.getColumnSearchProps("building_acronym"),
      },
      {
        title: "Total blocks",
        dataIndex: "total_blocks",
        width: "10%",
      },
      {
        title: "Total rooms",
        dataIndex: "total_rooms",
        width: "12%",
      },
      {
        title: "Action",
        dataIndex: "id",
        fixed: "right",
        width: "6%",

        render: (record) =>
          this.state.allBuildingFloors.length >= 1 ? (
            <>
              <Popconfirm
                title="View floor details"
                onConfirm={() => this.handleViewFloorDetails(record)}
              >
                <a>
                  <EyeOutlined />
                </a>
              </Popconfirm>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Popconfirm
                title="Are you sure you want to delete this floor"
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                onConfirm={() => this.handleDeleteFloor(record)}
              >
                <a>
                  <DeleteFilled style={{ color: "#ff6666" }} />
                </a>
              </Popconfirm>
            </>
          ) : null,
      },
    ];
    return (
      <>
        <Row>
          <Col xs={24} sm={24} md={4} lg={4} xl={4}>
            <h3>Add a new floor</h3>
            <br></br>
            <Form onFinish={this.handleFloorCreation}>
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input floor name!",
                  },
                ]}
              >
                <Input placeholder="Floor name" />
              </Form.Item>
              {this.state.errorMessage ? (
                <Text type="danger">
                  {this.state.errorMessage.number[0].charAt(0).toUpperCase() +
                    this.state.errorMessage.number[0].slice(1)}
                </Text>
              ) : (
                ""
              )}
              <Form.Item
                name="number"
                rules={[
                  {
                    required: true,
                    message: "Please input floor number",
                  },
                ]}
              >
                <Input placeholder="Floor number" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Add a new floor
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
            <h3>List of floors</h3>
            <br></br>
            <br></br>
            <Table
              size="small"
              columns={columns}
              dataSource={this.state.allBuildingFloors}
              pagination={{ pageSize: 13 }}
            />
          </Col>
        </Row>
      </>
    );
  }
}

export default Floor;
