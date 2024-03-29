import React from "react";
import {
  Table,
  Input,
  Modal,
  Form,
  Select,
  DatePicker,
  Popconfirm,
} from "antd";
import { Excel } from "antd-table-saveas-excel";
import { useState, useEffect } from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  getDevices,
  asyncCreateDeviceAction,
  asyncUpdateAction,
  asyncDeleteAction,
  asyncGetDetailAction,
  asyncGetRfidAction,
} from "./store/action";
import { selectLoading, selectDevice, selectDetail } from "./store/selector";
import { createStructuredSelector } from "reselect";
import "./index.css";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  SmileOutlined,
} from "@ant-design/icons";

import { Space, Button, notification } from "antd";
const Home = (props) => {
  const navigate = useNavigate();
  const {
    getDetail,
    createDevice,
    updateDevice,
    deleteDevice,
    devices,
    getAllDevices,
    getRfid,
  } = props;
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => {
        return (
          <span>
            {paginatios.paging.pageIndex * paginatios.paging.pageSize +
              index +
              1 -
              paginatios.paging.pageSize}
          </span>
        );
      },
    },
    {
      title: "RFID Tag",
      dataIndex: "rfidId",
      key: "rfidId",
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.rfidId.localeCompare(b.rfidId),
    },
    {
      title: "Device Name",
      dataIndex: "deviceName",
      key: "deviceName",
      sorter: (a, b) => a.deviceName.localeCompare(b.deviceName),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Model",
      dataIndex: "deviceModel",
      key: "deviceModel",
    },
    {
      title: "Manufactor",
      dataIndex: "manufactor",
      key: "manufactor",
    },
    {
      title: "Manufacturing Date",
      dataIndex: "mfg",
      key: "mfg",
      render: (text, record) =>
        text ? moment(text).format(dateFormat) : "date",
    },
    {
      title: "Expiry date",
      dataIndex: "exp",
      key: "exp",
      render: (text, record) =>
        text ? moment(text).format(dateFormat) : "date",
      sorter: (a, b) => moment(a.exp).unix() - moment(b.exp).unix(),
    },
    {
      title: "Date Added",
      dataIndex: "createAt",
      key: "createAt",
      render: (text, record) =>
        text ? moment(text).format(dateFormat) : "date",
      sorter: (a, b) => moment(a.createAt).unix() - moment(b.createAt).unix(),
    },
    {
      title: "Date Modified",
      dataIndex: "dateModified",
      key: "dateModified",
      render: (text, record) =>
        text ? moment(text).format(dateFormat) : "date",
      sorter: (a, b) =>
        moment(a.dateModified).unix() - moment(b.dateModified).unix(),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            style={{ backgroundColor: "RGB(10, 94, 243)", color: "white" }}
            onClick={() => modalUpdate(record._id)}
          >
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Are you sure to delete this device?"
            onConfirm={() => confirmDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            {" "}
            <Button
              style={{ backgroundColor: "RGB(10, 94, 243)", color: "white" }}
              // onClick={() => delDevice(record._id)}
            >
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  //search
  const [searchValue, setSearchValue] = useState("");
  const [searchStatus, setSearchStatus] = useState(false);
  const handleChangeSearch = (e) => {
    setSearchValue(e.target.value.trim());
  };
  const handleSearch = (e) => {
    setSearchStatus(!searchStatus);
  };

  //get current date
  const now = moment();
  // create and update
  //modal
  const dateFormat = "DD/MM/YYYY";
  const [open, setOpen] = useState(false);
  const { Option } = Select;
  const [isSubmit, setSubmit] = useState(false);
  const [formModal] = Form.useForm();
  const [createBtn, setCreateBtn] = useState(true);
  const [rfidDisable, setRfidDisable] = useState(false);

  //open modal when click Create button
  const showModal = async () => {
    setOpen(true);
    formModal.resetFields();
    setCreateBtn(true);
    setRfidDisable(false);
    const data = await getRfid();
    if(data.success){
      formModal.setFieldsValue({
        rfidId: data.rfidId,
      });
    }
  };
  //close model
  const handleCancel = () => {
    setOpen(false);
    setCreateBtn(true);
  };

  //load data to modal update
  const [createAt, setCreateAt] = useState("");
  const modalUpdate = async (id) => {
    setCreateBtn(false);
    setOpen(true);
    setRfidDisable(true);
    const response = await getDetail(id);
    if (response.success) {
      formModal.setFieldsValue({
        id: id,
        rfidId: response.device[0].rfidId,
        deviceName: response.device[0].deviceName,
        type: response.device[0].type,
        deviceModel: response.device[0].deviceModel,
        manufactor: response.device[0].manufactor,
        exp: moment(response.device[0].exp),
        mfg: moment(response.device[0].mfg),
      });
      setCreateAt(response.device[0].createAt);
    }
  };

  //submit data create or update
  const onFinish = async (values) => {
    if (!values.id) {
      const params = {
        rfidId: values.rfidId.toUpperCase(),
        deviceName: values.deviceName,
        type: values.type,
        deviceModel: values.deviceModel,
        manufactor: values.manufactor,
        exp: values.exp,
        mfg: values.mfg,
      };
      const res = await createDevice(params);
      if (res.success) {
        openNotification("Success", res.message, true);
      } else {
        openNotification("Failed", res.message, false);
      }
    } else {
      const params = {
        id: values.id,
        rfidId: values.rfidId,
        deviceName: values.deviceName,
        type: values.type,
        deviceModel: values.deviceModel,
        manufactor: values.manufactor,
        exp: values.exp,
        mfg: values.mfg,
        createAt: createAt,
      };
      const res = await updateDevice(params);
      if (res.success) {
        openNotification("Success", res.message, true);
      } else {
        openNotification("Failed", res.message, false);
      }
    }
    setSubmit(!isSubmit);
    setOpen(false);
  };

  //delete device
  const confirmDelete = (id) => {
    delDevice(id);
  };
  const delDevice = async (id) => {
    const res = await deleteDevice(id);
    if (res.success) {
      openNotification("Success", "Delete Successful !", true);
      const params = {
        searchValue: searchValue,
      };
      props.getAllDevices(params);
    } else {
      openNotification("Failed", "Delete Failed !", false);
    }
  };

  //notification
  const openNotification = (title, content, icon) => {
    notification.open({
      message: title,
      description: content,
      icon: icon ? (
        <CheckOutlined style={{ color: "green" }} />
      ) : (
        <SmileOutlined style={{ color: "red" }} />
      ),
    });
  };

  useEffect(() => {
    const params = {
      searchValue: searchValue,
    };
    getAllDevices(params);
  }, [searchStatus, isSubmit]);

  //pagnigation
  const [paginatios, setPaginatios] = useState({
    paging: { pageIndex: 1, pageSize: 10 },
  });
  const onChange = (pagination, filters, sorter, extra) => {
    const { current, pageSize } = pagination;
    const paging = { pageIndex: current, pageSize };
    const params = { ...paginatios, paging };
    setPaginatios(params);
  };

  // navigate to Scan Page
  const scanDevice = () => {
    navigate("/scan");
  };

  // export excel
  const exportColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "RFID Tag",
      dataIndex: "rfidId",
      key: "rfidId",
    },
    {
      title: "Device Name",
      dataIndex: "deviceName",
      key: "deviceName",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Model",
      dataIndex: "deviceModel",
      key: "deviceModel",
    },
    {
      title: "Manufactor",
      dataIndex: "manufactor",
      key: "manufactor",
    },
    {
      title: "Manufacturing Date",
      dataIndex: "mfg",
      key: "mfg",
    },
    {
      title: "Expiry date",
      dataIndex: "exp",
      key: "exp",
    },
    {
      title: "Date Added",
      dataIndex: "createAt",
      key: "createAt",
    },
    {
      title: "Date Modified",
      dataIndex: "dateModified",
      key: "dateModified",
    },
  ];
  const handleExport = () => {
    const excel = new Excel();
    let data = [];
    devices.forEach((device, index) => {
      data.push({
        id: index + 1,
        rfidId: device.rfidId,
        deviceName: device.deviceName,
        deviceModel: device.deviceModel,
        type: device.type,
        manufactor: device.manufactor,
        mfg: moment(device.mfg).format(dateFormat),
        exp: moment(device.exp).format(dateFormat),
        createAt: moment(device.createAt).format(dateFormat),
        dateModified: moment(device.dateModified).format(dateFormat),
      });
    });
    excel
      .addSheet("All Devices")
      .addColumns(exportColumns)
      .addDataSource(data)
      .saveAs(`device_${moment(now).format("DD_MM_YYYY")}.xlsx`);
  };

  return (
    <div>
      <div className="tool">
        <div>
          <Input
            placeholder="Search..."
            onChange={handleChangeSearch}
            style={{ width: "300px" }}
          />
          <Button
            style={{ backgroundColor: "#62aeff", color: "white" }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
        <div>
          <Button
            style={{
              backgroundColor: "#62aeff",
              color: "white",
              float: "right",
            }}
            onClick={showModal}
          >
            Create
          </Button>
          <Button
            style={{
              backgroundColor: "#62aeff",
              color: "white",
              float: "right",
            }}
            onClick={scanDevice}
          >
            Scan
          </Button>
          <Button
            style={{
              backgroundColor: "#62aeff",
              color: "white",
              float: "right",
            }}
            onClick={handleExport}
          >
            Export
          </Button>
        </div>
      </div>
      <div className="content">
        <Table
          columns={columns}
          dataSource={props.devices}
          loading={props.isLoading}
          onChange={onChange}
          rowClassName={(record) => {
            if (!now.isBefore(record.exp)) return "row-red";
            else if (moment(record.exp).diff(moment(now), "days") <= 10) {
              return "row-yellow";
            } else return " ";
          }}
        />
      </div>

      {/* modal */}
      <Modal
        title={createBtn ? "Create Device" : "Update Device"}
        open={open}
        onCancel={handleCancel}
        style={{ top: 20 }}
        footer={
          <Button type="primary" htmlType="submit" form="formModal">
            {/* Save */}
            {createBtn ? "Create" : "Update"}
          </Button>
        }
      >
        <Form
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
          form={formModal}
          name="formModal"
        >
          <Form.Item label="Id" name="id">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="RFID tag"
            name="rfidId"
            rules={[
              { required: true, message: "Please input RFID tag!" },
              {
                pattern: new RegExp("^([a-zA-Z0-9]{2}\\s{0,1}){4,7}$"), //eslint-disable-line
                message: "format error( eg: AB 5D 4S 9D)",
              },
            ]}
          >
            <Input disabled={rfidDisable} />
          </Form.Item>
          <Form.Item
            label="Device Name"
            name="deviceName"
            rules={[
              { required: true, message: "Please input Device Name!" },
              { min: 5, message: "Minimum 5 characters" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Type" name="type" initialValue="Văn phòng">
            <Select>
              <Option value={"Văn phòng"}>Văn phòng</Option>
              <Option value={"Chiếu sáng"}>Chiếu sáng</Option>
              <Option value={"Điện lạnh"}>Điện lạnh</Option>
              <Option value={"Truyền thông"}>Truyền thông</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Model"
            name="deviceModel"
            rules={[{ required: true, message: "Please input device model!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Manufactor"
            name="manufactor"
            rules={[{ required: true, message: "Please input Manufactor!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Manufacturing Date"
            name="mfg"
            initialValue={moment("10/10/2022", dateFormat)}
          >
            <DatePicker format={dateFormat} />
          </Form.Item>
          <Form.Item
            label="Expiry Date"
            name="exp"
            initialValue={moment("10/10/2022", dateFormat)}
          >
            <DatePicker format={dateFormat} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
const mapStateToProps = createStructuredSelector({
  isLoading: selectLoading,
  devices: selectDevice,
  detail: selectDetail,
});

const mapDispatchToProps = (dispatch) => ({
  getAllDevices: (payload) => dispatch(getDevices(payload)),
  getDetail: (payload) => asyncGetDetailAction(dispatch)(payload),
  createDevice: (payload) => asyncCreateDeviceAction(dispatch)(payload),
  updateDevice: (payload) => asyncUpdateAction(dispatch)(payload),
  deleteDevice: (payload) => asyncDeleteAction(dispatch)(payload),
  getRfid: (payload) => asyncGetRfidAction(dispatch)(payload),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Home);
