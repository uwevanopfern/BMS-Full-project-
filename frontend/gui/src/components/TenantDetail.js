import React from "react";
import "../App.css";
import { tenantDetail, billingDetail, addBill, BEARERTOKEN } from "../store";
import axios from "axios";
import html2canvas from "html2canvas";

import {
  List,
  Typography,
  Space,
  Col,
  Row,
  Modal,
  Statistic,
  Tooltip,
  Form,
  Input,
  DatePicker,
  Switch,
  Button,
  Tag,
  message,
} from "antd";
import {
  CalendarOutlined,
  PercentageOutlined,
  FieldNumberOutlined,
  FileAddFilled,
  MailTwoTone,
  FileAddOutlined,
  FolderOpenOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { Text, Title } = Typography;

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const dateFormat = "YYYY-MM-DD";

class TenantDetail extends React.Component {
  state = {
    id: "",
    email: "",
    name: "",
    buildingId: "",
    building_name: "",
    building_acronym: "",
    is_manager: "",
    is_employee: "",
    tenant: "",
    visible: false,
    billedVisibilityModal: false,
    isBilledModelOkBtnPressed: false,
    isUnBilledModelOkBtnPressed: false,
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
      // (convertedUserObject.buildingId, 'TENANTS')
      .get(tenantDetail(params.tenantID, convertedUserObject.buildingId), {
        headers: { Authorization: BEARERTOKEN },
      })
      .then((res) => {
        this.setState({
          tenant: res.data,
        });
      });
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
    });
  };

  handleBillCreation = (values) => {
    const ebmInvoice = values.ebm_invoice;
    const ebmDate = this.state.date_created.format("YYYY-MM-DD");
    const taxRate = values.tax_rate;
    const total = values.total;
    const isPaid = values.isPaid === false ? 0 : 1;

    axios
      .post(
        addBill,
        {
          tenant: this.state.tenant.id,
          building: this.state.buildingId,
          ebm_invoice: ebmInvoice,
          ebm_receipt_create_on: ebmDate,
          tax_rate: taxRate,
          total: total,
          is_paid: isPaid,
        },
        {
          headers: { Authorization: BEARERTOKEN },
        }
      )
      .then((res) => {
        // console.log (res);
        message.success("Bill added successfully");
        this.setState({ successAction: res.status });
      })
      .catch((err) => {
        this.setState({ errorMessage: err.response.data });
        // console.log (this.state.errorMessage);
      });

    setTimeout("location.reload(true);", 1500);
  };

  layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 16 },
  };

  takeBilledshot = () => {
    let div = document.getElementById("paidBillScreenshots");

    // Use the html2canvas
    // function to take a screenshot
    // and append it
    // to the output div
    html2canvas(div).then(function (canvas) {
      document.getElementById("billedOutput").appendChild(canvas);
    });

    this.setState({
      isBilledModelOkBtnPressed: true,
    });
  };

  takeUnBilledshot = () => {
    let div = document.getElementById("paidUnBillScreenshots");

    // Use the html2canvas
    // function to take a screenshot
    // and append it
    // to the output div
    html2canvas(div).then(function (canvas) {
      document.getElementById("unBilledOutput").appendChild(canvas);
    });

    this.setState({
      isUnBilledModelOkBtnPressed: true,
    });
  };

  showBilledModal = () => {
    this.setState({
      billedVisibilityModal: true,
    });
  };

  hideBilledVisibilityModal = () => {
    this.setState({
      billedVisibilityModal: false,
    });
  };

  showUnBilledModal = () => {
    this.setState({
      UnBilledVisibilityModal: true,
    });
  };

  hideUnBilledVisibilityModal = () => {
    this.setState({
      UnBilledVisibilityModal: false,
    });
  };

  isPaidSwitchChanged(checked) {
    console.log(`switch to ${checked}`);
  }

  printBillInvoice() {
    var content = document.getElementById("billedOutput");
    var pri = document.getElementById("ifmcontentstoprint").contentWindow;
    pri.document.open();
    pri.document.write(content.innerHTML);
    pri.document.close();
    pri.focus();
    pri.print();
  }

  handlePayUnbilledInvoice = () => {
    const id = document.getElementById("id").value;
    const building = document.getElementById("building").value;
    const invoiceNo = document.getElementById("ebm_invoice").value;
    const ebmDate = this.state.date_created.format("YYYY-MM-DD");
    const taxRate = document.getElementById("tax_rate").value;
    const total = document.getElementById("total").value;
    const isPaid = 1;

    // console.log(invoiceNo);
    // console.log(ebmDate);
    // console.log(taxRate);
    // console.log(total);
    // console.log(isPaid);

    axios
      .put(
        billingDetail(id, building),
        {
          ebm_invoice: invoiceNo,
          ebm_receipt_create_on: ebmDate,
          tax_rate: taxRate,
          total: total,
          is_paid: isPaid,
        },
        {
          headers: { Authorization: BEARERTOKEN },
        }
      )
      .then((res) => {
        message.success("Bill paid successfully");
        this.setState({ successAction: res.status });
        // console.log(res);
      })
      .catch((err) => {
        this.setState({ errorMessage: err.response.data });
      });

    setTimeout("location.reload(true);", 1500);
  };

  render() {
    return (
      <div className="site-card-wrapper">
        <Modal
          title="Add a new bill bellow"
          visible={this.state.visible}
          onOk={this.handleBillCreation}
          onCancel={this.hideModal}
          okText="Add a bill"
          cancelText="Cancel"
          width={300}
          footer={null}
        >
          <Form
            onFinish={this.handleBillCreation}
            className="login-form"
            {...this.layout}
          >
            <Form.Item
              name="ebm_invoice"
              rules={[{ required: true, message: "Enter Ebm invoice no" }]}
            >
              <Input
                name="ebm_invoice"
                size="small"
                placeholder="Ebm invoicer no"
              />
            </Form.Item>
            <Form.Item name="ebmDate">
              <DatePicker
                style={{ width: 169 }}
                value={moment(this.state.date_created, dateFormat)}
                name="ebmDate"
                size="small"
              />
            </Form.Item>
            <Form.Item
              name="tax_rate"
              rules={[{ required: true, message: "Enter Tax Rate %, E:g: 18" }]}
            >
              <Input
                name="taxRate"
                size="small"
                placeholder="Tax Rate, E:g: 18"
              />
            </Form.Item>
            <Form.Item
              name="total"
              rules={[{ required: true, message: "Enter Total Amount" }]}
            >
              <Input
                name="totalAmount"
                size="small"
                placeholder="Total Amount"
              />
            </Form.Item>
            <Form.Item
              name="isPaid"
              label="Is Invoice Paid"
              rules={[{ required: true, message: "Slide the switch" }]}
            >
              <Switch
                name="isPaid"
                defaultChecked
                onChange={this.isPaidSwitchChanged}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="default"
                htmlType="submit"
                size="medium"
                icon={<FileAddOutlined />}
              >
                Add
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Row>
          <Title level={3}>
            All bills of {this.state.tenant.tenant_names} with a TIN of :{" "}
            <Text code> {this.state.tenant.tenant_tin}</Text>
          </Title>
        </Row>
        <Row>
          <Col span={3}>
            <Tooltip title="Add a new bill" color="#09c">
              <FileAddFilled
                onClick={this.showModal}
                style={{
                  fontSize: "30px",
                  color: "#09c",
                }}
              />
            </Tooltip>
          </Col>
          <Col span={12}>
            <Space direction="vertical">
              <Text
                style={{ fontSize: "16px", color: "#08c", fontWeight: "bold" }}
              >
                {this.state.tenant.total_paid_bills} paid bills
              </Text>
            </Space>
          </Col>
          <Col span={8}>
            <Space direction="vertical">
              <Text
                style={{
                  fontSize: "16px",
                  color: "#ff6666",
                  fontWeight: "bold",
                }}
              >
                {this.state.tenant.total_unpaid_bills} unpaid bills
              </Text>
            </Space>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <br></br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button>
              {" "}
              Print this invoice
              <DownloadOutlined />
            </Button>
            <Modal
              title={`Load invoice and send it to ${this.state.tenant.tenant_main_email}`}
              visible={this.state.billedVisibilityModal}
              onOk={this.takeBilledshot}
              // onOk={this.hideModal}
              onCancel={this.hideBilledVisibilityModal}
              okText="Load"
              cancelText="Cancel"
              width={560}
            >
              <div id="billedOutput">
                {this.state.isBilledModelOkBtnPressed ? (
                  <Button>
                    Send email <MailTwoTone />
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </Modal>
            <List
              id="paidBillScreenshots"
              itemLayout="vertical"
              size="large"
              pagination={{
                pageSize: 1,
              }}
              dataSource={this.state.tenant.paid_bills}
              renderItem={(billing) => (
                <List.Item
                  key={billing.id}
                  actions={[
                    <IconText
                      icon={FieldNumberOutlined}
                      text={`${billing.ebm_invoice}`}
                      key="list-vertical-like-o"
                    />,
                    <IconText
                      icon={PercentageOutlined}
                      text={`Tax rate: ${billing.tax_rate}`}
                      key="list-vertical-message"
                    />,
                    <IconText
                      icon={CalendarOutlined}
                      text={`Bill date: ${billing.ebm_receipt_create_on}`}
                      key="list-vertical-message"
                    />,
                  ]}
                >
                  <Title level={5}>{`Invoice No: ${billing.invoice_no}`}</Title>
                  Status: <Tag color="success">PAID</Tag>
                  <br></br>
                  <br></br>
                  <Statistic
                    valueStyle={{
                      fontSize: "11px",
                    }}
                    title="Sub total amount"
                    value={`${billing.sub_total.toLocaleString()} RWF`}
                  />
                  <hr
                    style={{
                      borderTop: "1px dashed",
                      width: 200,
                      marginLeft: "0",
                    }}
                  ></hr>
                  <Statistic
                    valueStyle={{
                      fontSize: "11px",
                    }}
                    title="Tax amount"
                    value={`${billing.tax_amount.toLocaleString()} RWF`}
                  />
                  <hr
                    style={{
                      borderTop: "1px dashed",
                      width: 200,
                      marginLeft: "0",
                    }}
                  ></hr>
                  <Statistic
                    valueStyle={{
                      fontSize: "13px",
                      fontWeight: "bold",
                    }}
                    title="Total paid amount"
                    value={`${billing.total.toLocaleString()} RWF`}
                  />
                  <hr
                    style={{
                      borderTop: "1px dashed",
                      marginLeft: "0",
                    }}
                  ></hr>
                </List.Item>
              )}
            />
          </Col>
          <Col span={12}>
            <br></br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button onClick={this.showUnBilledModal}>
              {" "}
              Load invoice and send it email
              <DownloadOutlined />
            </Button>
            &nbsp;
            <Button onClick={this.handlePayUnbilledInvoice} type="primary">
              Pay
            </Button>
            <Modal
              title={`Load invoice and send it to ${this.state.tenant.tenant_main_email}`}
              visible={this.state.UnBilledVisibilityModal}
              onOk={this.takeUnBilledshot}
              // onOk={this.hideModal}
              onCancel={this.hideUnBilledVisibilityModal}
              okText="Load"
              cancelText="Cancel"
              width={560}
            >
              <div id="unBilledOutput">
                {this.state.isUnBilledModelOkBtnPressed ? (
                  <Button>
                    Send email <MailTwoTone />
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </Modal>
            <List
              id="paidUnBillScreenshots"
              itemLayout="vertical"
              size="large"
              pagination={{
                pageSize: 1,
              }}
              dataSource={this.state.tenant.unpaid_bills}
              renderItem={(billing) => (
                <>
                  <input type="hidden" id="id" value={billing.id}></input>
                  <input
                    type="hidden"
                    id="ebm_invoice"
                    value={billing.ebm_invoice}
                  ></input>
                  <input
                    type="hidden"
                    id="building"
                    value={billing.building}
                  ></input>
                  <input
                    type="hidden"
                    id="tax_rate"
                    value={billing.tax_rate}
                  ></input>
                  <input
                    type="hidden"
                    id="ebm_receipt_create_on"
                    value={billing.ebm_receipt_create_on}
                  ></input>
                  <input type="hidden" id="total" value={billing.total}></input>

                  <List.Item
                    key={billing.id}
                    actions={[
                      <IconText
                        icon={FieldNumberOutlined}
                        text={`${billing.ebm_invoice}`}
                        key="list-vertical-like-o"
                      />,
                      <IconText
                        icon={PercentageOutlined}
                        text={`Tax rate: ${billing.tax_rate}`}
                        key="list-vertical-message"
                      />,
                      <IconText
                        id="ebm_receipt_create_on"
                        icon={CalendarOutlined}
                        text={`Bill date: ${billing.ebm_receipt_create_on}`}
                        key="list-vertical-message"
                      />,
                    ]}
                  >
                    <Title
                      level={5}
                    >{`Invoice No: ${billing.invoice_no}`}</Title>
                    Status: <Tag color="error">UNPAID</Tag>
                    <br></br>
                    <br></br>
                    <Statistic
                      valueStyle={{
                        fontSize: "11px",
                      }}
                      title="Sub total amount"
                      value={`${billing.sub_total.toLocaleString()} RWF`}
                    />
                    <hr
                      style={{
                        borderTop: "1px dashed",
                        width: 200,
                        marginLeft: "0",
                      }}
                    ></hr>
                    <Statistic
                      valueStyle={{
                        fontSize: "11px",
                      }}
                      title="Tax amount"
                      value={`${billing.tax_amount.toLocaleString()} RWF`}
                    />
                    <hr
                      style={{
                        borderTop: "1px dashed",
                        width: 200,
                        marginLeft: "0",
                      }}
                    ></hr>
                    <Statistic
                      valueStyle={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        color: "#ff6666",
                      }}
                      id="total"
                      title="Total paid amount"
                      value={`${billing.total.toLocaleString()} RWF`}
                    />
                    <hr
                      style={{
                        borderTop: "1px dashed",
                        marginLeft: "0",
                      }}
                    ></hr>
                  </List.Item>
                </>
              )}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default TenantDetail;
