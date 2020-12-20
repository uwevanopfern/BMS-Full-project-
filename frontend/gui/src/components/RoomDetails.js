import React from "react";
import "../App.css";
import { roomDetail, buildingFloors, BEARERTOKEN } from "../store";
import axios from "axios";

import {
  Input,
  Button,
  message,
  Col,
  Row,
  Form,
  Statistic,
  Switch,
  Select,
} from "antd";

const { Option } = Select;

class RoomDetail extends React.Component {
  state = {
    id: "",
    email: "",
    name: "",
    buildingId: "",
    building_name: "",
    building_acronym: "",
    is_manager: "",
    is_employee: "",
    room: "",
    allBuildingFloors: [],
  };
  componentDidMount() {
    const {
      match: { params },
    } = this.props;

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
    axios
      .get(roomDetail(params.roomID), {
        headers: { Authorization: BEARERTOKEN },
      })
      .then((res) => {
        this.setState({
          room: res.data,
        });
        console.log(res.data);
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

  handleRoomUpdate = (values) => {
    const {
      match: { params },
    } = this.props;

    const floor = values.floor;
    const roomName = document.getElementById("name").value;
    const roomNumber = document.getElementById("number").value;
    const price = document.getElementById("price").value;
    const isRoomOccupied = values.isOccupied === false ? 0 : 1;

    axios
      .put(
        roomDetail(params.roomID),
        {
          floor: floor,
          name: roomName,
          number: roomNumber,
          price: price,
          is_occupied: isRoomOccupied,
        },
        {
          headers: { Authorization: BEARERTOKEN },
        }
      )
      .then(() => {
        message.success("Room updated successfully");
      })
      .catch((err) => {
        this.setState({ errorMessage: err.response.data });
        message.error(this.state.errorMessage);
      });

    setTimeout("location.reload(true);", 1000);
  };

  testRejectBooking() {
    console.log("Rejected button was pressed.");
  }

  render() {
    return (
      <>
        <Row>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            <h3>Update room</h3>
            <br></br>
            <Form onFinish={this.handleRoomUpdate}>
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
              <Form.Item name="name">
                <Input
                  id="name"
                  defaultValue={`${this.state.room.name}`}
                  key={`${this.state.room.name}`}
                  placeholder="Room name"
                />
              </Form.Item>
              <Form.Item name="number">
                <Input
                  id="number"
                  defaultValue={`${this.state.room.number}`}
                  key={`${this.state.room.number}`}
                  placeholder="Room number"
                />
              </Form.Item>
              <Form.Item name="price">
                <Input
                  id="price"
                  defaultValue={`${this.state.room.price}`}
                  key={`${this.state.room.price}`}
                  placeholder="Room price"
                />
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
                  Update room
                </Button>
              </Form.Item>
            </Form>
          </Col>

          <Col
            xs={24}
            sm={24}
            md={{ span: 4, offset: 3 }}
            lg={{ span: 4, offset: 3 }}
            xl={{ span: 4, offset: 3 }}
          >
            <Statistic
              title={`Block name`}
              value={this.state.room.block_name}
            />
          </Col>
          <Col
            xs={24}
            sm={24}
            md={{ span: 4, offset: 2 }}
            lg={{ span: 4, offset: 2 }}
            xl={{ span: 4, offset: 2 }}
          >
            <Statistic
              title={`Floor name`}
              value={this.state.room.floor_name}
            />
          </Col>
        </Row>
      </>
    );
  }
}

export default RoomDetail;
