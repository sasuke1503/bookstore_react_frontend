import { Button, Form, Input, message, Spin } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import PageTitle from "../../components/Layout/PageTitle";
import { UserInfo } from "../../models/auth";
import { httpClient } from "../../httpClient/httpServices";
import { APP_API } from "../../httpClient/config";
import { appRoutes } from "../../routers/config";
import { LoginForm } from "../../models/login";
import { Link, useNavigate } from "react-router-dom";
import "./MyAccount.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { userLogIn } from "../../redux/slices/authSlice";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

/* eslint-disable no-template-curly-in-string */

/* eslint-enable no-template-curly-in-string */

const UpdateProfile = () => {
  const userInfo = useSelector(
    (state: RootStateOrAny) => state.authSlice.userInfo as UserInfo
  );
  const dispatch = useDispatch();
  const [accountForm] = useForm();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const onFinish = (values: any) => {
    setSubmitting(true);
    httpClient()
      .put(APP_API.editProfile, values)
      .then((res) => {
        const userInfo: UserInfo = res.data as UserInfo;
        message.success("Update Successfully");
        navigate(appRoutes.myAccount);
      })
      .catch((err) => {
        console.error(err);
        message.error(err.response.data);
      })
      .finally(() => setSubmitting(false));
  };

  useEffect(() => {
    httpClient()
      .get(APP_API.userInfo)
      .then((res) => {
        console.log(res);
        accountForm.setFieldsValue(res.data);
      });
  }, []);

  // useEffect(() => {
  //   if (userInfo?.firstName) {
  //     accountForm.setFieldsValue({
  //       firstName: userInfo.firstName,
  //       lastName: userInfo.lastName,
  //       email: userInfo.email,
  //     });
  //   }
  //   //eslint-disable-next-line
  // }, [userInfo]);

  return (
    <Spin spinning={submitting}>
      <div className="profile-background">
        <PageTitle>Update Profile</PageTitle>
        <div className="site-layout-background d-flex align-items-center justify-content-center ">
          <Form
            {...layout}
            name="nest-messages"
            form={accountForm}
            onFinish={onFinish}
          >
            <Form.Item
              name="firstName"
              label="First name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ type: "email", required: true }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Link to={appRoutes.myAccount}>
                <FontAwesomeIcon className="mr-2" icon={faArrowLeft} />
                Turn Back
              </Link>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Spin>
  );
};

export default UpdateProfile;
