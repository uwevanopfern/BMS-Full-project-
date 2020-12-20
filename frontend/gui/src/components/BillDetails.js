import React from "react";
import "../App.css";
import { billingDetail, BEARERTOKEN } from "../store";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  Switch,
  Col,
  Row,
  DatePicker,
  Typography,
  message,
} from "antd";

import { FileAddOutlined } from "@ant-design/icons";
import moment from "moment";
const { Text, Title } = Typography;

const dateFormat = "YYYY-MM-DD";

class BillDetails extends React.Component {
  state = {
    id: "",
    email: "",
    name: "",
    buildingId: "",
    building_name: "",
    building_acronym: "",
    is_manager: "",
    is_employee: "",
    bill: {},
    checked: false,
    date_created: moment(),
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
      .get(billingDetail(params.billID, convertedUserObject.buildingId), {
        headers: { Authorization: BEARERTOKEN },
      })
      .then((res) => {
        this.setState({
          bill: res.data,
        });
      });
  }

  handleBillUpdate = (values) => {
    const {
      match: { params },
    } = this.props;

    // let ebm_invoice =
    // console.log(ebm_invoice);

    const invoiceNo = document.getElementById("ebm_invoice").value;
    const ebmDate = this.state.date_created.format("YYYY-MM-DD");
    const taxRate = document.getElementById("tax_rate").value;
    const total = document.getElementById("total").value;
    const is_paid = values.isPaid === false ? 0 : 1;

    // console.log(invoiceNo);
    axios
      .put(
        billingDetail(params.billID, this.state.bill.building),
        {
          tenant: this.state.bill.tenant,
          building: this.state.bill.building,
          ebm_invoice: invoiceNo,
          ebm_receipt_create_on: ebmDate,
          tax_rate: taxRate,
          total: total,
          is_paid: is_paid,
        },
        {
          headers: { Authorization: BEARERTOKEN },
        }
      )
      .then((res) => {
        message.success("Bill updated successfully");
        this.setState({ successAction: res.status });
        console.log(res);
      })
      .catch((err) => {
        this.setState({ errorMessage: err.response.data });
      });

    setTimeout("location.reload(true);", 1500);
  };

  render() {
    return (
      <>
        <Row>
          <Col xs={24} sm={24} md={8} lg={8} xl={8} offset={6}>
            <Title level={2}>Bill details </Title>
            <Text type="secondary">
              {" "}
              Update bill bellow of{" "}
              <strong>{this.state.bill.tenant_name}</strong>
            </Text>
            <br></br> <br></br>
            <Form onFinish={this.handleBillUpdate}>
              <Form.Item name="ebm_invoice" label="Ebm invoice">
                <Input
                  size="small"
                  id="ebm_invoice"
                  defaultValue={`${this.state.bill.ebm_invoice}`}
                  key={`${this.state.bill.ebm_invoice}`}
                />
              </Form.Item>
              <Form.Item
                name="ebmDate"
                label="Ebm date"
                rules={[{ required: true, message: "Enter Ebm created date" }]}
              >
                <DatePicker
                  // style={{ width: 279 }}
                  value={moment(this.state.date_created, dateFormat)}
                  size="small"
                />
              </Form.Item>
              <Form.Item name="tax_rate" label="Tax rate">
                <Input
                  size="small"
                  id="tax_rate"
                  defaultValue={`${this.state.bill.tax_rate}`}
                  key={`${this.state.bill.tax_rate}`}
                />
              </Form.Item>
              <Form.Item name="total" label="Total amount">
                <Input
                  size="small"
                  id="total"
                  defaultValue={`${this.state.bill.total}`}
                  key={`${this.state.bill.total}`}
                />
              </Form.Item>
              <Form.Item
                name="isPaid"
                label="Is Invoice Paid"
                rules={[{ required: true, message: "Slide the switch" }]}
              >
                <Switch name="isPaid" defaultChecked />
              </Form.Item>
              <Form.Item>
                <Button
                  type="default"
                  htmlType="submit"
                  size="medium"
                  icon={<FileAddOutlined />}
                >
                  Update bill
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </>
    );
  }
}

export default BillDetails;
