import React from "react";
import "../App.css";
import { floorDetail, BEARERTOKEN } from "../store";
import axios from "axios";
import {
  Input,
  Button,
  Space,
  Col,
  Row,
  Form,
  Typography,
  message,
  List,
} from "antd";

import {
  BankOutlined,
  FieldNumberOutlined,
  DollarTwoTone,
} from "@ant-design/icons";



const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

class FloorDetail extends React.Component {
  state = {
    id: "",
    email: "",
    name: "",
    buildingId: "",
    building_name: "",
    building_acronym: "",
    is_manager: "",
    is_employee: "",
    floor: "",
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
      .get(floorDetail(params.floorID), {
        headers: { Authorization: BEARERTOKEN },
      })
      .then((res) => {
        this.setState({
          floor: res.data,
        });
        console.log(res.data);
      });
  }

  handleFloorUpdate = () => {
    const {
      match: { params },
    } = this.props;

    const floorName = document.getElementById("name").value;
    const floorNumber = document.getElementById("number").value;

    axios
      .put(
        floorDetail(params.floorID),
        {
          building: this.state.buildingId,
          name: floorName,
          number: floorNumber,
        },
        {
          headers: { Authorization: BEARERTOKEN },
        }
      )
      .then((res) => {
        message.success("Floor updated successfully");
        this.setState({ successAction: res.status });
        setTimeout("location.reload(true);", 1500);
      })
      .catch((err) => {
        this.setState({ errorMessage: err.response.data });
      });
  };

  render() {
    return (
      <>
        <Row>
          <Col xs={24} sm={24} md={4} lg={4} xl={4}>
            <h3>Update floor</h3>
            <br></br>
            <Form onFinish={this.handleFloorUpdate}>
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input floor name!",
                  },
                ]}
              >
                <Input
                  id="name"
                  defaultValue={`${this.state.floor.name}`}
                  key={`${this.state.floor.name}`}
                />
              </Form.Item>
              <Form.Item
                name="number"
                rules={[
                  {
                    required: true,
                    message: "Please input floor number",
                  },
                ]}
              >
                <Input
                  id="number"
                  defaultValue={`${this.state.floor.number}`}
                  key={`${this.state.floor.number}`}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update floor
                </Button>
              </Form.Item>
            </Form>
          </Col>

          <Col
            xs={24}
            sm={24}
            md={{ span: 8, offset: 1 }}
            lg={{ span: 8, offset: 1 }}
            xl={{ span: 8, offset: 1 }}
          >
            <h3>Occupied rooms</h3>
            <br></br>
            <List
              itemLayout="vertical"
              size="large"
              pagination={{
                onChange: (page) => {
                  console.log(page);
                },
                pageSize: 3,
              }}
              dataSource={this.state.floor.occupied_rooms}
              renderItem={(room) => (
                <List.Item
                  key={room.id}
                  actions={[
                    <IconText
                      icon={BankOutlined}
                      text={`Room name: ${room.name}`}
                      key="list-vertical-star-o"
                    />,
                    <IconText
                      icon={FieldNumberOutlined}
                      text={`Room number: ${room.number}`}
                      key="list-vertical-like-o"
                    />,
                    <IconText
                      icon={DollarTwoTone}
                      text={`Room price: ${`${room.price.toLocaleString()} RWF`}`}
                      key="list-vertical-like-o"
                    />,
                  ]}
                ></List.Item>
              )}
            />
            ,
          </Col>

          <Col
            xs={24}
            sm={24}
            md={{ span: 8, offset: 1 }}
            lg={{ span: 8, offset: 1 }}
            xl={{ span: 8, offset: 1 }}
          >
            <h3>Available rooms</h3>
            <br></br>
            <List
              itemLayout="vertical"
              size="large"
              pagination={{
                onChange: (page) => {
                  console.log(page);
                },
                pageSize: 3,
              }}
              dataSource={this.state.floor.available_rooms}
              renderItem={(room) => (
                <List.Item
                  key={room.id}
                  actions={[
                    <IconText
                      icon={BankOutlined}
                      text={`Room name: ${room.name}`}
                      key="list-vertical-star-o"
                    />,
                    <IconText
                      icon={FieldNumberOutlined}
                      text={`Room number: ${room.number}`}
                      key="list-vertical-like-o"
                    />,
                    <IconText
                      icon={DollarTwoTone}
                      text={`Room price: ${`${room.price.toLocaleString()} RWF`}`}
                      key="list-vertical-like-o"
                    />,
                  ]}
                ></List.Item>
              )}
            />
            ,
          </Col>
        </Row>
      </>
    );
  }
}

export default FloorDetail;
