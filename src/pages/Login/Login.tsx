import { Button, Checkbox, Form, Input, message, Spin } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../../components/Layout/PageTitle";
import { APP_API } from "../../httpClient/config";
import { httpClient } from "../../httpClient/httpServices";
import { UserInfo } from "../../modals/auth";
import { LoginForm } from "../../modals/login";
import { userLogIn } from "../../redux/slices/authSlice";
import { appRoutes } from "../../routers/config";
import "./Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const onFinish = (values: LoginForm) => {
    setSubmitting(true);
    httpClient()
      .post(APP_API.login, values)
      .then((res) => {
        const userInfo: UserInfo = res.data as UserInfo;
        dispatch(userLogIn(userInfo));
        navigate(appRoutes.home);
        message.success("Log In Successfully");
      })
      .catch((err) => {
        console.error(err);
        message.error(err.response.data);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <Spin spinning={submitting}>
      <div>
        <PageTitle>Login to your account</PageTitle>
        <div
          className="site-layout-background d-flex align-items-center justify-content-center"
          // style={{ background: "red" }}
        >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            className=""
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input className="w-100" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Link to={appRoutes.forgotpassword}>Forgot your password?</Link>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Spin>
  );
};

export default Login;
