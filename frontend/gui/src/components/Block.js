import React from "react";
import "../App.css";
import {
  buildingBlocks,
  buildingFloors,
  addBlock,
  deleteBlock,
  BEARERTOKEN,
} from "../store";
import axios from "axios";
import { Link } from "react-router-dom";
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
  Select,
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
const { Option } = Select;

class Block extends React.Component {
  state = {
    id: "",
    email: "",
    name: "",
    buildingId: "",
    building_name: "",
    building_acronym: "",
    is_manager: "",
    is_employee: "",
    allBuildingBlocks: [],
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
      .get(buildingBlocks(convertedUserObject.buildingId), {
        headers: { Authorization: BEARERTOKEN },
      })
      .then((res) => {
        // console.log (res.data.response);
        this.setState({
          allBuildingBlocks: res.data.response,
        });
      });

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

  handleViewBlockDetails = (id) => {
    return this.props.history.push(`/block-details/${id}`);
  };

  handleBlockCreation = (values) => {
    const name = values.name;
    const floor = values.floor;
    const number = values.number;
    axios
      .post(
        addBlock,
        {
          floor: floor,
          name: name,
          number: number,
        },
        {
          headers: { Authorization: BEARERTOKEN },
        }
      )
      .then(() => {
        message.success("Block added with successfully");
        setTimeout("location.reload(true);", 1500);
      })
      .catch((err) => {
        this.setState({ badRequest: err.response.status });
        this.setState({ errorMessage: err.response.data.response });
        console.log(this.state.errorMessage);
      });
  };

  handleDeleteBlock = (id) => {
    // console.log(id);
    axios
      .delete(deleteBlock(id), {
        headers: { Authorization: BEARERTOKEN },
      })
      .then(() => {
        message.error("Block deleted with successfully");
        setTimeout("location.reload(true);", 1000);
      })
      .catch((err) => {
        this.setState({ errorMessage: err.response.data });
      });
  };

  render() {
    const columns = [
      {
        title: "Block name",
        dataIndex: "name",
        fixed: "left",
        width: "15%",
        ...this.getColumnSearchProps("name"),
      },
      {
        title: "Block number",
        dataIndex: "number",
        width: "16%",
        ...this.getColumnSearchProps("number"),
      },
      {
        title: "Floor name",
        dataIndex: "floor_name",
        width: "12%",
        ...this.getColumnSearchProps("floor_name"),
      },
      {
        title: "Action",
        dataIndex: "id",
        fixed: "right",
        width: "6%",

        render: (record) =>
          this.state.allBuildingBlocks.length >= 1 ? (
            <>
              <Popconfirm
                title="View block details"
                onConfirm={() => this.handleViewBlockDetails(record)}
              >
                <a>
                  <EyeOutlined />
                </a>
              </Popconfirm>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Popconfirm
                title="Are you sure you want to delete this block"
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                onConfirm={() => this.handleDeleteBlock(record)}
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
            <h3>Add a new block</h3>
            <br></br>
            <Form onFinish={this.handleBlockCreation}>
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input block name!",
                  },
                ]}
              >
                <Input placeholder="Block name" />
              </Form.Item>
              <Form.Item
                name="floor"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please select floor",
                  },
                ]}
              >
                <Select placeholder="Please select tenant floor" name="floor">
                  {this.state.allBuildingFloors.map((floor) => (
                    <Option key={floor.id} value={floor.id}>
                      {floor.name}
                    </Option>
                  ))}
                </Select>
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
                    message: "Please input block number",
                  },
                ]}
              >
                <Input placeholder="Block number" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Add a new block
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
              dataSource={this.state.allBuildingBlocks}
              pagination={{ pageSize: 13 }}
            />
          </Col>
        </Row>
      </>
    );
  }
}

export default Block;
