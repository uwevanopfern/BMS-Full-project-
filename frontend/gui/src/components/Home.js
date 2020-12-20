import React from "react";
import "../App.css";
import {
  addFloor,
  buildingFloors,
  buildingBlocks,
  addBlock,
  addRoom,
  countTotals,
  BEARERTOKEN,
} from "../store";
import axios from "axios";
import { Col, Row, Statistic } from "antd";
import {
  DollarCircleOutlined,
  BookOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Line, Liquid, RingProgress } from "@ant-design/charts";
import { Typography } from "antd";

const { Text } = Typography;

const $ = window.$;
class Home extends React.Component {
  state = {
    id: "",
    email: "",
    name: "",
    buildingId: "",
    building_name: "",
    building_acronym: "",
    is_manager: "",
    is_employee: "",
    redirect: true,
    TOTAL_PENDING_BOOKING: "",
    TOTAL_CONFIRMED_BOOKING: "",
    TOTAL_TENANTS: "",
    TOTAL_PAID_BILLS: "",
    TOTAL_UNPAID_BILLS: "",
    errorMessage: "",
    successAction: "",
    allBuildingFloors: [],
    allBuildingBlocks: [],
    allBuildingTenants: [],
    checked: false,
    searchInput: "",
    searchText: "",
    searchedColumn: "",
  };

  componentDidMount() {
    const userObject = localStorage.getItem("user_object")
      ? localStorage.getItem("user_object")
      : "";

    document.addEventListener("DOMContentLoaded", function () {
      var float_btn = document.querySelectorAll(".fixed-action-btn");
      // var instances = M.FloatingActionButton.init(float_btn, {});
    });

    $(document).ready(function () {
      // $(".sidenav").sidenav();
    });

    $(document).ready(function () {
      // $(".modal").modal();
    });

    $(document).ready(function () {
      // $(".tooltipped").tooltip();
    });

    $(document).ready(function () {
      // $("select").formSelect();
    });

    let convertedUserObject = JSON.parse(userObject);
    this.setState({
      id: convertedUserObject.id,
      email: convertedUserObject.email,
      name: convertedUserObject.name,
      buildingId: convertedUserObject.buildingId,
      building_name: convertedUserObject.building_name,
      building_acronym: convertedUserObject.building_acronym,
      is_manager: convertedUserObject.is_manager,
      building_name: convertedUserObject.building_name,
      is_employee: convertedUserObject.is_employee,
    });
    // console.log (convertedUserObject);

    //Get total TOTAL_PENDING_BOOKING
    axios
      .get(countTotals(convertedUserObject.buildingId, "PENDING_BOOKING"), {
        headers: { Authorization: BEARERTOKEN },
      })
      .then((res) => {
        this.setState({
          TOTAL_PENDING_BOOKING: res.data.total,
        });
        // console.log (this.state.TOTAL_PENDING_BOOKING);
      });

    //Get total TOTAL_CONFIRMED_BOOKING
    axios
      .get(countTotals(convertedUserObject.buildingId, "CONFIRMED_BOOKING"), {
        headers: { Authorization: BEARERTOKEN },
      })
      .then((res) => {
        this.setState({
          TOTAL_CONFIRMED_BOOKING: res.data.total,
        });
        // console.log (this.state.TOTAL_CONFIRMED_BOOKING);
      });

    //Get total TOTAL_TENANTS
    axios
      .get(countTotals(convertedUserObject.buildingId, "TENANTS"), {
        headers: { Authorization: BEARERTOKEN },
      })
      .then((res) => {
        this.setState({
          TOTAL_TENANTS: res.data.total,
        });
        // console.log (this.state.TOTAL_TENANTS);
      });

    //Get total TOTAL_PAID_BILLS
    axios
      .get(countTotals(convertedUserObject.buildingId, "PAID_BILLS"), {
        headers: { Authorization: BEARERTOKEN },
      })
      .then((res) => {
        this.setState({
          TOTAL_PAID_BILLS: res.data.total,
        });
        // console.log (this.state.TOTAL_PAID_BILLS);
      });

    //Get total TOTAL_UNPAID_BILLS
    axios
      .get(countTotals(convertedUserObject.buildingId, "UNPAID_BILLS"), {
        headers: { Authorization: BEARERTOKEN },
      })
      .then((res) => {
        this.setState({
          TOTAL_UNPAID_BILLS: res.data.total,
        });
        // console.log (this.state.TOTAL_UNPAID_BILLS);
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

  handleFloorCreation = (event) => {
    event.preventDefault();
    const floorName = event.target.elements.floorName.value;
    const floorNumber = event.target.elements.floorNumber.value;

    axios
      .post(
        addFloor,
        {
          building: this.state.buildingId,
          name: floorName,
          number: floorNumber,
        },
        {
          headers: { Authorization: BEARERTOKEN },
        }
      )
      // res.status
      .then((res) => {
        // M.toast({ html: "Floor has been added successully" });
        // console.log (res);
        this.setState({ successAction: res.status });
      })
      .catch((err) => {
        // M.toast({ html: err });
        this.setState({ errorMessage: err.response.data });
        // console.log (this.state.errorMessage);
      });

    setTimeout("location.reload(true);", 2000);
  };

  handleBlockCreation = (event) => {
    event.preventDefault();
    const blockName = event.target.elements.blockName.value;
    const blockNumber = event.target.elements.blockNumber.value;
    const blockFloor = event.target.elements.blockFloor.value;

    // console.log (blockFloor);

    axios
      .post(
        addBlock,
        {
          floor: blockFloor,
          name: blockName,
          number: blockNumber,
        },
        {
          headers: { Authorization: BEARERTOKEN },
        }
      )
      // res.status
      .then((res) => {
        // M.toast({ html: "Block has been added successully" });
        // console.log (res);
        this.setState({ successAction: res.status });
      })
      .catch((err) => {
        // M.toast({ html: err });
        this.setState({ errorMessage: err.response.data });
        // console.log (this.state.errorMessage);
      });

    setTimeout("location.reload(true);", 2000);
  };

  handleRoomCreation = (event) => {
    event.preventDefault();
    const roomName = event.target.elements.roomName.value;
    const roomFloor = event.target.elements.roomFloor.value;
    const roomPrice = event.target.elements.roomPrice.value;
    const roomNumber = event.target.elements.roomNumber.value;
    const roomBlock = event.target.elements.roomBlock.value;
    const isRoomOccupied = this.state.checked == false ? 0 : 1;

    // console.log (isRoomOccupied);

    axios
      .post(
        addRoom,
        {
          floor: roomFloor,
          number: roomNumber,
          name: roomName,
          block: roomBlock,
          is_occupied: isRoomOccupied,
          price: roomPrice,
        },
        {
          headers: { Authorization: BEARERTOKEN },
        }
      )
      .then((res) => {
        // M.toast({ html: "Room has been added successully" });
        // console.log (res);
        this.setState({ successAction: res.status });
      })
      .catch((err) => {
        // M.toast({ html: err });
        this.setState({ errorMessage: err.response.data });
        // console.log (this.state.errorMessage);
      });

    setTimeout("location.reload(true);", 2000);
  };

  addEventListener = (e) => {
    this.setState({ searchInput: e.target.value });
  };

  logoutUser() {
    localStorage.removeItem("user_object");
  }

  render() {
    const data = [
      { year: "1991", value: 3 },
      { year: "1992", value: 4 },
      { year: "1993", value: 3.5 },
      { year: "1994", value: 5 },
      { year: "1995", value: 4.9 },
      { year: "1996", value: 6 },
      { year: "1997", value: 7 },
      { year: "1998", value: 9 },
      { year: "1999", value: 13 },
    ];
    const new_tenants_charts = {
      data,
      height: 250,
      xField: "year",
      yField: "value",
      title: "My title",
      point: {
        size: 5,
        shape: "diamond",
      },
    };

    const monthly_paid_tenants = {
      percent: 0.25,
      statistic: {
        content: {
          style: {
            fontSize: 40,
            fill: "black",
            height: 100,
          },
        },
      },
    };

    const occupied_rooms_percentage = {
      height: 200,
      width: 250,
      autoFit: false,
      percent: 0.7,
      tooltip: "Occpaasd",
      color: ["#5B8FF9", "#E8EDF3"],
    };

    return (
      <>
        <div className="site-card-wrapper">
          <Row>
            <Col span={5}>
              <Statistic
                title="Confirmed bookings"
                // value={this.state.TOTAL_CONFIRMED_BOOKING}
                value="Coming soon"
              />
            </Col>
            <Col span={5}>
              <Statistic
                title="Pending bookings"
                // value={this.state.TOTAL_PENDING_BOOKING}
                value="Coming soon"
              />
            </Col>
            <Col span={5}>
              <Statistic
                title="Tenants"
                value={this.state.TOTAL_TENANTS}
                prefix={<TeamOutlined />}
              />
            </Col>
            <Col span={5}>
              <Statistic
                title="Paid bills"
                value={this.state.TOTAL_PAID_BILLS}
                prefix={<DollarCircleOutlined />}
              />
            </Col>
            <Col span={4}>
              <Statistic
                title="Unpaid bills"
                value={this.state.TOTAL_UNPAID_BILLS}
                prefix={<DollarCircleOutlined />}
              />
            </Col>
          </Row>
          <Row gutter={20} style={{ marginTop: 100 }}>
            <Col span={8} style={{ height: 200 }}>
              <Text code>Visualization of the new tenants registration</Text>
              <br></br>
              <br></br>
              <Line {...new_tenants_charts} />
            </Col>
            <Col span={8} style={{ height: 200 }}>
              <Text code>Visualization of current month paid tenants</Text>
              <br></br>
              <br></br>
              <Liquid {...monthly_paid_tenants} />
            </Col>
            <Col span={8} style={{ height: 150 }}>
              <Text code>Visualization of occupied rooms</Text>
              <br></br>
              <br></br>
              <RingProgress {...occupied_rooms_percentage} />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Home;
