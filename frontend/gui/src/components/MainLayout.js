import React from "react";
import "../App.css";
import { Link } from "react-router-dom";
import { Menu, Layout, message, Button } from "antd";
import {
  BlockOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  DollarCircleOutlined,
  BuildOutlined,
  BankOutlined,
  UsergroupAddOutlined,
  BookOutlined,
  CarOutlined,
  SettingOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

let isLoggedIn = !!localStorage.getItem("user_object");

const $ = window.$;

class MainLayout extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
  }

  state = {
    id: "",
    email: "",
    name: "",
    buildingId: "",
    building_name: "",
    building_acronym: "",
    is_manager: "",
    is_employee: "",
    collapsed: false,
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
      building_name: convertedUserObject.building_name,
      is_employee: convertedUserObject.is_employee,
    });
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  logoutUser() {
    localStorage.removeItem("user_object");
  }

  parking = () => {
    message.success({
      content: "Parking feature is underdevelopment, coming soon!",
      className: "custom-class",
      style: {
        marginTop: "20vh",
      },
    });
  };

  booking = () => {
    message.success({
      content: "Booking feature is underdevelopment, coming soon!",
      className: "custom-class",
      style: {
        marginTop: "20vh",
      },
    });
  };

  render() {
    var link = window.location.origin;
    return (
      <div>
        <Layout>
          <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
            <div className="logo">
              <h5>BMS</h5>
            </div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
              <Menu.Item key="1" icon={<HomeOutlined />}>
                <a href={`${link}/home/`}>Home</a>{" "}
              </Menu.Item>{" "}
              <Menu.Item key="2" icon={<DollarCircleOutlined />}>
                <a href={`${link}/bills/`}>Bills</a>{" "}
              </Menu.Item>
              <Menu.Item key="3" icon={<BuildOutlined />} title="Floors">
                <a href={`${link}/floors/`}>Floors</a>
              </Menu.Item>
              <Menu.Item key="4" icon={<BlockOutlined />} title="Blocks">
                <a href={`${link}/blocks/`}>Blocks</a>
              </Menu.Item>
              <Menu.Item key="5" icon={<BankOutlined />} title="Rooms">
                <a href={`${link}/rooms/`}>Rooms</a>
              </Menu.Item>
              <Menu.Item key="10" icon={<UsergroupAddOutlined />}>
                <a href={`${link}/users/`}>Users</a>
              </Menu.Item>{" "}
              <Menu.Item key="11" icon={<TeamOutlined />}>
                <a href={`${link}/tenants/`}>Tenants</a>
              </Menu.Item>{" "}
              <SubMenu
                key="sub6"
                icon={<FileOutlined />}
                title="Archives(docs)"
              >
                <Menu.Item key="12">
                  <a href={`${link}/add-users/`}>Add new doc</a>
                </Menu.Item>
                <Menu.Item key="13">
                  <a href={`${link}/users/`}>View archives(docs)</a>
                </Menu.Item>
              </SubMenu>
              <Menu.Item key="14" icon={<CarOutlined />}>
                <a href="#" onClick={this.parking}>
                  Parking
                </a>
              </Menu.Item>
              <Menu.Item key="15" icon={<BookOutlined />}>
                <a href="#" onClick={this.booking}>
                  Booking
                </a>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header
              className="site-layout-background"
              style={{
                padding: "0 15px",
                fontSize: 18,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                // height: "100vh"
              }}
            >
              {React.createElement(
                this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: "trigger",
                  onClick: this.toggle,
                }
              )}
              <Menu onClick={this.handleClick} mode="horizontal">
                <SubMenu
                  key="SubMenu"
                  icon={<UserOutlined />}
                  title={this.state.email}
                >
                  <Menu.Item key="setting:1">
                    <SettingOutlined />
                    Settings
                  </Menu.Item>
                  <Menu.Item key="setting:2">
                    <Link to="/login">
                      <LogoutOutlined />
                      <a
                        href="#"
                        className="waves-effect"
                        onClick={this.logoutUser}
                      >
                        Logout
                      </a>
                    </Link>
                  </Menu.Item>
                </SubMenu>
              </Menu>
            </Header>
            <Content
              className="site-layout-background"
              style={{
                margin: "24px 16px",
                padding: 24,
                minHeight: 280,
              }}
            >
              {this.props.children}
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Building Management System ©2020 Created by NiiPO Network Ltd,
              Call/Whatsapp (+250) 782 816 597
            </Footer>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default MainLayout;
