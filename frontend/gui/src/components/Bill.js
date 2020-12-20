import React from "react";
import "../App.css";
import { billings, billingDetail, BEARERTOKEN } from "../store";
import axios from "axios";
import Highlighter from "react-highlight-words";
import {
  Table,
  Input,
  Button,
  Space,
  Popconfirm,
  Col,
  Row,
  Typography,
  message,
} from "antd";

import {
  SearchOutlined,
  EyeOutlined,
  DeleteFilled,
  QuestionCircleOutlined,
} from "@ant-design/icons";
const { Text, Title } = Typography;

class Bill extends React.Component {
  state = {
    id: "",
    email: "",
    name: "",
    buildingId: "",
    allBillings: [],
    searchInput: "",
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
    });
    // console.log (convertedUserObject);

    //Get all floors of specific building
    axios
      .get(billings(convertedUserObject.buildingId), {
        headers: { Authorization: BEARERTOKEN },
      })
      .then((res) => {
        console.log(res.data);
        this.setState({
          allBillings: res.data,
        });
      });
  }

  addEventListener = (e) => {
    this.setState({ searchInput: e.target.value });
  };

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

  handleViewBillDetails = (id) => {
    return this.props.history.push(`/bill-details/${id}`);
  };

  handleDeleteBill = (id) => {
    // console.log(id);

    axios
      .delete(billingDetail(id, this.state.buildingId), {
        headers: { Authorization: BEARERTOKEN },
      })
      .then(() => {
        message.error("Bill deleted successfully");
        setTimeout("location.reload(true);", 1000);
      });
  };

  render() {
    const columns = [
      {
        title: "Tenant name",
        dataIndex: "tenant_name",
        fixed: "left",
        width: "15%",
        ...this.getColumnSearchProps("tenant_name"),
      },
      {
        title: "Invoice no",
        dataIndex: "invoice_no",
        width: "16%",
        ...this.getColumnSearchProps("invoice_no"),
      },
      {
        title: "Ebm Invoice No",
        dataIndex: "ebm_invoice",
        width: "16%",
        ...this.getColumnSearchProps("ebm_invoice"),
      },
      {
        title: "Total",
        dataIndex: "total",
        width: "12%",
        render: (record) => {
          return (
            <>
              <Text code>{`${record.toLocaleString()} RWF`}</Text>
            </>
          );
        },
      },
      {
        title: "Total",
        dataIndex: "sub_total",
        width: "12%",
        render: (record) => {
          return (
            <>
              <Text code>{`${record.toLocaleString()} RWF`}</Text>
            </>
          );
        },
      },
      {
        title: "Total",
        dataIndex: "tax_amount",
        width: "12%",
        render: (record) => {
          return (
            <>
              <Text code>{`${record.toLocaleString()} RWF`}</Text>
            </>
          );
        },
      },
      {
        title: "Tax rate",
        dataIndex: "tax_rate",
        width: "10%",
      },
      {
        title: "Created On",
        dataIndex: "ebm_receipt_create_on",
        width: "12%",
      },
      {
        title: "Is Paid",
        dataIndex: "is_paid",
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
          this.state.allBillings.length >= 1 ? (
            <>
              <Popconfirm
                title="View bill details"
                onConfirm={() => this.handleViewBillDetails(record)}
              >
                <a>
                  <EyeOutlined />
                </a>
              </Popconfirm>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Popconfirm
                title="Are you sure you want to delete this bill"
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                onConfirm={() => this.handleDeleteBill(record)}
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
      <Row>
        <Col
          xs={24}
          sm={24}
          md={{ span: 24 }}
          lg={{ span: 24 }}
          xl={{ span: 24 }}
        >
          <Title level={3}>List of all bills</Title>
          <br></br>
          <br></br>
          <Table
            size="small"
            columns={columns}
            dataSource={this.state.allBillings}
            pagination={{ pageSize: 13 }}
            scroll={{ x: 1300 }}
          />
        </Col>
      </Row>
    );
  }
}

export default Bill;
