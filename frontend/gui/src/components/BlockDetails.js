import React from "react";
import "../App.css";
import { blockDetail, BEARERTOKEN } from "../store";
import axios from "axios";

import { Input, Button, message, Col, Row, Form, Statistic } from "antd";

class BlockDetail extends React.Component {
  state = {
    id: "",
    email: "",
    name: "",
    buildingId: "",
    building_name: "",
    building_acronym: "",
    is_manager: "",
    is_employee: "",
    block: "",
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
      .get(blockDetail(params.blockID), {
        headers: { Authorization: BEARERTOKEN },
      })
      .then((res) => {
        this.setState({
          block: res.data,
        });
        console.log(res.data);
      });
  }

  handleBlockUpdate = () => {
    const {
      match: { params },
    } = this.props;

    const blockName = document.getElementById("name").value;
    const blockNumber = document.getElementById("number").value;

    axios
      .put(
        blockDetail(params.blockID),
        {
          floor: this.state.block.floor,
          name: blockName,
          number: blockNumber,
        },
        {
          headers: { Authorization: BEARERTOKEN },
        }
      )
      // res.status
      .then((res) => {
        message.success("Block updated successfully");
        this.setState({ successAction: res.status });
        setTimeout("location.reload(true);", 1500);
      })
      .catch((err) => {
        this.setState({ errorMessage: err.response.data });
      });

    setTimeout("location.reload(true);", 2000);
  };

  render() {
    return (
      <>
        <Row>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            <h3>Update block</h3>
            <br></br>
            <Form onFinish={this.handleBlockUpdate}>
              <Form.Item name="name">
                <Input
                  id="name"
                  defaultValue={`${this.state.block.name}`}
                  key={`${this.state.block.name}`}
                />
              </Form.Item>
              <Form.Item name="number">
                <Input
                  id="number"
                  defaultValue={`${this.state.block.number}`}
                  key={`${this.state.block.number}`}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update block
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
            <Statistic title={`Block name`} value={this.state.block.name} />
          </Col>
          <Col>
            <Statistic title={`Block number`} value={this.state.block.number} />
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
              value={this.state.block.floor_name}
            />
          </Col>
        </Row>
      </>
    );
  }
}

export default BlockDetail;
