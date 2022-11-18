import React from "react";
import { Table } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "./index.css";

import socketIOClient from "socket.io-client";
import { Button } from "antd";
const ScanPage = (props) => {
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
      const socket = await socketIOClient.connect(
        `${process.env.REACT_APP_API}`
      );
      socket.emit("fromclient", { message: "scan" });
      socket.on("scanFromServer", (dataGot) => {
        if (dataGot) {
          if (dataGot.success) {
            if (
              !listDevices.find(
                (device) => device.rfidId === dataGot.data.rfidId
              )
            ) {
              setListDevices([dataGot.data, ...listDevices]);
            }
          } else {
            if (!listDevices.find((device) => device.rfidId === dataGot.data)) {
              setListDevices([{ rfidId: dataGot.data }, ...listDevices]);
            }
          }
          setIsScan(!isScan);
          socket.disconnect();
        }
      });
    };
    scanDevices();
  }, [isScan]);
  const clearBtn = ()=>{
    setListDevices([]);
    setIsScan(!isScan)
  }
  return (
    <div>
      <div className="tool" >
        <Button
          style={{ backgroundColor: "#62aeff", color: "white", float: "right" }}
          onClick={dashboardBtn}
        >
          Dashboard
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

export default ScanPage;
