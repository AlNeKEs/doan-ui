import "./index.css";
import {
  PoweroffOutlined,
  UserAddOutlined,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Modal,
  Input,
  Form,
  Select,
  notification,
} from "antd";
import { AuthContext } from "../../Auth/context/AuthContext";
import { useContext, useState } from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { selectLoading } from "./store/selector";
import { asyncCreateUserAction } from "./store/action";
import { createStructuredSelector } from "reselect";

const Header = (props) => {
  const {createUser}= props;
  const { logoutUser } = useContext(AuthContext);

  const logout = () => logoutUser();

  const { Option } = Select;

  //notification
  const openNotification = (title, content, icon) => {
    notification.open({
      message: title,
      description: content,
      icon: icon ? (
        <CheckOutlined style={{ color: "green" }} />
      ) : (
        <CloseOutlined style={{ color: "red" }} />
      ),
    });
  };
  //modal
  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    setShowModal(true);
  };
  const items = [
    {
      key: "createUser",
      label: (
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={openModal}
          className="header-btn"
        >
          createUser
        </Button>
      ),
    },
    {
      key: "logOut",
      label: (
        <Button
          type="primary"
          icon={<PoweroffOutlined />}
          onClick={logout}
          className="header-btn"
        >
          Logout
        </Button>
      ),
    },
  ];

  const [register, setRegister] = useState({
    password: "",
    confirmPassword: "",
  });
  const [confirmAlert, setConfirmAlert] = useState("");
  const onChangeRegister = (e) => {
    setRegister({ ...register, [e.target.name]: e.target.value });
  };
  const handleCancel = () => {
    setShowModal(false);
  };
  const onFinish = async(values) => {
    if (register.password !== register.confirmPassword) {
      setConfirmAlert("Password don't match!");
      console.log(confirmAlert);
      openNotification("error", "password do not match!", false);
      return;
    }
    const params = {
      username: values.username,
      password: values.password,
      role: values.role,
    };
    console.log(params);
    const res = await createUser(params);
    console.log(res)
    if (res.success) {
      openNotification("Success", res.message, true);
    } else {
      openNotification("Failed", res.message, false);
    }
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light header">
      <div className="header-title">
        <h3>
          Ứng dụng quản lí thông tin thiết bị với công nghệ RFID trên hệ thống
          MongoDB
        </h3>
        <h4>Giảng viên hướng dẫn: Ths.Trương Bá Phúc</h4>
      </div>
      <Dropdown
        menu={{
          items,
        }}
        placement="bottomRight"
      >
        <Button style={{ backgroundColor: "#62aeff", color: "white" }}>
          user
        </Button>
      </Dropdown>

      {/* modal */}
      <Modal
        title={"Create User"}
        open={showModal}
        onCancel={handleCancel}
        style={{ top: 20 }}
        footer={
          <Button type="primary" htmlType="submit" form="formModal">
            Create User
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
          name="formModal"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input password!" },
              {
                pattern: new RegExp(
                  "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,16}$"
                ), //eslint-disable-line
                message:
                  "password must have min eight characters max six-teen characters, at least one letter and one number",
              },
            ]}
          >
            <Input.Password
              name="password"
              value={register.password}
              onChange={onChangeRegister}
            />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[{ required: true, message: "Please confirm password" }]}
          >
            <Input.Password
              name="confirmPassword"
              value={register.confirmPassword}
              onChange={onChangeRegister}
            />
          </Form.Item>
          <Form.Item label="role" name="role" initialValue="user">
            <Select>
              <Option value={"admin"}>admin</Option>
              <Option value={"user"}>user</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </nav>
  );
};
const mapStateToProps = createStructuredSelector({
  isLoading: selectLoading,
});

const mapDispatchToProps = (dispatch) => ({
  createUser: (payload) => asyncCreateUserAction(dispatch)(payload),
});
const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(withConnect)(Header);
