import React from "react";
import "../App.css";
import {
  buildingRooms,
  buildingFloors,
  deleteRoom,
  BEARERTOKEN,
  addRoom,
  buildingBlocks,
} from "../store";
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
  Select,
  Switch,
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

class Room extends React.Component {
  state = {
    id: "",
    email: "",
    name: "",
    buildingId: "",
    building_name: "",
    building_acronym: "",
    is_manager: "",
    is_employee: "",
    allBuildingRooms: [],
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
      .get(buildingRooms(convertedUserObject.buildingId), {
        headers: { Authorization: BEARERTOKEN },
      })
      .then((res) => {
        // console.log (res.data.response);
        this.setState({
          allBuildingRooms: res.data.response,
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

    //Get all blocks of specific building
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

  handleViewRoomDetails = (id) => {
    return this.props.history.push(`/room-details/${id}`);
  };

  handleDeleteRoom = (id) => {
    axios
      .delete(deleteRoom(id), {
        headers: { Authorization: BEARERTOKEN },
      })
      .then(() => {
        message.error("Room deleted successfully");
        setTimeout("location.reload(true);", 1000);
      })
      .catch((err) => {
        this.setState({ errorMessage: err.response.data });
      });
  };

  handleRoomCreation = (values) => {
    console.log(values);
    const floor = values.floor;
    const block = values.block;
    const name = values.name;
    const number = values.number;
    const price = values.price;
    const isOccupied = values.isOccupied === false ? 0 : 1;
    axios
      .post(
        addRoom,
        {
          floor: floor,
          block: block,
          name: name,
          number: number,
          price: price,
          is_occupied: isOccupied,
          // building: this.state.buildingId,
        },
        {
          headers: { Authorization: BEARERTOKEN },
        }
      )
      .then((res) => {
        // console.log (res.data.response);
        console.log(res.status);
        message.success("Room added with successfully");
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
        title: "Name",
        dataIndex: "name",
        fixed: "left",
        width: "15%",
        ...this.getColumnSearchProps("name"),
      },
      {
        title: "Number",
        dataIndex: "number",
        width: "16%",
        ...this.getColumnSearchProps("number"),
      },
      {
        title: "Price",
        dataIndex: "price",
        width: "15%",
        ...this.getColumnSearchProps("price"),
        render: (record) => {
          return (
            <>
              <Text code>{`${record.toLocaleString()} RWF`}</Text>
            </>
          );
        },
      },
      {
        title: "Block name",
        dataIndex: "block_name",
        width: "10%",
      },
      {
        title: "Floor name",
        dataIndex: "floor_name",
        width: "12%",
      },
      {
        title: "Is Occupied",
        dataIndex: "is_occupied",
        width: "12%",
        render: (record) => {
          return (
            <>
              {record === true ? (
                <Text type="success">YES</Text>
              ) : (
                <Text type="danger">NO</Text>
              )}
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
          this.state.allBuildingRooms.length >= 1 ? (
            <>
              <Popconfirm
                title="View room details"
                onConfirm={() => this.handleViewRoomDetails(record)}
              >
                <a>
                  <EyeOutlined />
                </a>
              </Popconfirm>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Popconfirm
                title="Are you sure you want to delete this room"
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                onConfirm={() => this.handleDeleteRoom(record)}
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
            <h3>Add a new room</h3>
            <br></br>
            <Form onFinish={this.handleRoomCreation}>
              <Form.Item
                name="floor"
                rules={[
                  {
                    required: true,
                    message: "Please select floor!",
                  },
                ]}
              >
                <Select
                  placeholder="Please select floor which room is located in"
                  name="floor"
                >
                  {this.state.allBuildingFloors.map((floor) => (
                    <Option key={floor.id} value={floor.id}>
                      {floor.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="block">
                <Select
                  placeholder="Please select block which room is located in"
                  name="block"
                >
                  {this.state.allBuildingBlocks.map((block) => (
                    <Option key={block.id} value={block.id}>
                      {block.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input room name!",
                  },
                ]}
              >
                <Input placeholder="Room name" />
              </Form.Item>
              <Form.Item
                name="number"
                rules={[
                  {
                    required: true,
                    message: "Please input room number",
                  },
                ]}
              >
                <Input placeholder="Room number" />
              </Form.Item>
              <Form.Item
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Please input room price",
                  },
                ]}
              >
                <Input placeholder="Room price" />
              </Form.Item>
              <Form.Item
                name="isOccupied"
                label="Is Room Occupied"
                rules={[{ required: true, message: "Slide the switch" }]}
              >
                <Switch name="isOccupied" defaultChecked />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Add a new room
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
            <h3>List of rooms</h3>
            <br></br>
            <br></br>
            <Table
              size="small"
              columns={columns}
              dataSource={this.state.allBuildingRooms}
              pagination={{ pageSize: 13 }}
            />
          </Col>
        </Row>
      </>
    );
  }
}

export default Room;
