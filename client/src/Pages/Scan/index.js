import React from "react";
import { SmileOutlined } from "@ant-design/icons";
import { Table, notification } from "antd";
import { Excel } from "antd-table-saveas-excel";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { selectRfid } from "./store/selector";
import { createStructuredSelector } from "reselect";
import { compose } from "recompose";
import { connect } from "react-redux";
import moment from "moment";
import { asyncScanRfidAction } from "./store/action";
import "./index.css";

import { Button } from "antd";
const ScanPage = (props) => {
  const { scanRfid } = props;
  const navigate = useNavigate();
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
      render: (text, record) =>
        text ? moment(text).format(dateFormat) : "date",
    },
    {
      title: "Expiry date",
      dataIndex: "exp",
      key: "exp",
      render: (text, record) =>
        text ? moment(text).format(dateFormat) : "date",
    },
    {
      title: "Date Added",
      dataIndex: "createAt",
      key: "createAt",
      render: (text, record) =>
        text ? moment(text).format(dateFormat) : "date",
    },
    {
      title: "Date Modified",
      dataIndex: "dateModified",
      key: "dateModified",
      render: (text, record) =>
        text ? moment(text).format(dateFormat) : "date",
    },
  ];

  //date format
  const dateFormat = "DD/MM/YYYY";

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

  // navigate to dashboard
  const dashboardBtn = () => {
    navigate("/");
  };

  const [listDevices, setListDevices] = useState([]);
  const [isScan, setIsScan] = useState(true);
  useEffect(() => {
    const scanDevices = async () => {
      const res = await scanRfid();
      if (res.success) {
        if (!listDevices.find((device) => device.rfidId === res.data.rfidId)) {
          setListDevices([res.data, ...listDevices]);
        }
      } else {
        if (!listDevices.find((device) => device.rfidId === res.rfidId)) {
          setListDevices([{ rfidId: res.rfidId }, ...listDevices]);
        }
      }
      setIsScan(!isScan);
    };
    scanDevices();
  }, [isScan]);
  const clearBtn = () => {
    setListDevices([]);
    setIsScan(!isScan);
  };

  // export excel
  const now = moment();
  //notification
  const openNotification = (title, content, icon) => {
    notification.open({
      message: title,
      description: content,
      icon: <SmileOutlined style={{ color: "red" }} />,
    });
  };
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
  const exportScan = () => {
    const excel = new Excel();
    let data = [];
    if (!listDevices[0]) openNotification("Failed", "Nothing to export", false);
    else {
      listDevices.forEach((device, index) => {
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
        .saveAs(`device_scan_${moment(now).format("DD_MM_YYYY")}.xlsx`);
    }
  };
  return (
    <div>
      <div className="tool">
        <Button
          style={{ backgroundColor: "#62aeff", color: "white", float: "right" }}
          onClick={dashboardBtn}
        >
          Dashboard
        </Button>
        <Button
          style={{ backgroundColor: "#62aeff", color: "white", float: "right" }}
          onClick={exportScan}
        >
          Export
        </Button>
        <Button
          style={{ backgroundColor: "#cf000f", color: "white", float: "right" }}
          onClick={clearBtn}
        >
          Reset
        </Button>
      </div>
      <div className="content">
        <Table
          columns={columns}
          dataSource={listDevices}
          //loading={props.isLoading}
          onChange={onChange}
          rowClassName={(record) => (record._id ? "row-green" : "row-red")}
        />
      </div>
    </div>
  );
};
const mapStateToProps = createStructuredSelector({
  rfidTag: selectRfid,
});
const mapDispatchToProps = (dispatch) => ({
  scanRfid: (payload) => asyncScanRfidAction(dispatch)(payload),
});
const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(withConnect)(ScanPage);
