import { ShoppingCartOutlined } from "@ant-design/icons";
import {
  faCommentDollar,
  faSearchLocation,
  faSignInAlt,
  faSignOutAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Col, Layout, Menu, Row } from "antd";
import Search from "antd/lib/input/Search";
import SubMenu from "antd/lib/menu/SubMenu";
import { ChangeEvent, useEffect, useState } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../../image/doubhlogo3.png";
import background from "../../../image/back.jpg";
import { UserInfo } from "../../../models/auth";
import {
  closeAccountManage,
  openAccountManage,
  userLogOut,
} from "../../../redux/slices/authSlice";
import { updateKeySearch } from "../../../redux/slices/keySearchSlice";
import { appRoutes } from "../../../routers/config";
import BreadCrumb from "../../BreadCrumb";
import PageFooter from "../../Footer/Footer";
import "./NavBar.css";
import { url } from "inspector";

const { Header, Content } = Layout;

const NavBar: React.FC = ({ children }) => {
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState(
    location.pathname.split("/")[1] || "home"
  );
  const isLoggedIn = useSelector((state: RootStateOrAny) => {
    return state.authSlice.isAuth;
  });

  const totalCartItem = useSelector((state: RootStateOrAny) => {
    return state.cartSlice.total;
  });

  const localNoAuthCart = localStorage.getItem("noAuthCart");
  const cartLocalItemArray = JSON.parse(localNoAuthCart || "[]");
  const totalLocalCartItem = Object.keys(cartLocalItemArray).length;

  const userName = useSelector((state: RootStateOrAny) => {
    if (state.authSlice.userInfo) {
      return (
        state.authSlice.userInfo.lastName +
        " " +
        state.authSlice.userInfo.firstName
      );
    } else return "";
  });
  const userInfo = useSelector((state: RootStateOrAny) => {
    if (state.authSlice.userInfo) {
      return state.authSlice.userInfo as UserInfo;
    }
  });
  const booksSearch = useSelector((state: RootStateOrAny) => {
    return state.keySearchSlice.booksSearch;
  });
  const isAccountManage = useSelector((state: RootStateOrAny) => {
    return state.authSlice.isAccountManage;
  });
  const dispatch = useDispatch();
  // const onSearch = (key: String) => {
  //   <Link to={appRoutes.books.replace(":search", key)}>
  //     <img src={logo} alt="logo" className="logo" />
  //   </Link>;
  // };
  const [keyWordSearch, setKeyWordSearch] = useState("");
  const [bookSearch, setBookSearch] = useState({});
  const onKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (booksSearch.keyWord != null) {
      setKeyWordSearch(e.target.value);
      console.log(booksSearch);
      dispatch(
        updateKeySearch({
          idCategory: booksSearch.idCategory,
          keyWord: e.target.value,
          minPrice: 0,
          maxPrice: 100000000,
        })
      );
    }
  };

  const navigate = useNavigate();
  useEffect(() => {}, [userInfo]);
  return (
    <Layout className="layout">
      <Header
        style={{
          position: "fixed",
          zIndex: 1,
          width: "100%",
          height: "80px",
        }}
      >
        <Row className="headerNavBar">
          <Col className="gutter-row menu" span={4} pull={0.5}>
            <Menu
              mode="horizontal"
              triggerSubMenuAction="hover"
              selectedKeys={[selectedMenu]}
              className="bg-transparent"
            >
              <Menu.Item key="home" onClick={() => setSelectedMenu("home")}>
                <Link
                  to={appRoutes.home}
                  onClick={() => {
                    window.scrollTo(0, 0);
                  }}
                >
                  <img src={logo} alt="logo" className="logo" />
                </Link>
              </Menu.Item>
            </Menu>
          </Col>
          <Col className="gutter-row menu bg-transparent" span={13} push={0}>
            <Search
              placeholder="Hôm nay bạn tìm sách gì..."
              enterButton="Tìm Kiếm"
              size="large"
              onChange={onKeyChange}
              onSearch={() => {
                if (booksSearch.keyWord != null) {
                  dispatch(
                    updateKeySearch({
                      idCategory: booksSearch.idCategory,
                      keyWord: keyWordSearch,
                      minPrice: 0,
                      maxPrice: 100000000,
                    })
                  );
                }
                console.log(bookSearch);
                navigate(appRoutes.books);
                window.scrollTo(0, 0);
              }}
              className="bg-transparent"
            />
          </Col>

          <Col className="gutter-row" span="7" push={1}>
            {isLoggedIn && (
              <>
                <Menu
                  mode="horizontal"
                  style={{ background: "Transparent" }}
                  selectedKeys={[selectedMenu]}
                  theme="dark"
                >
                  <SubMenu
                    key="name"
                    title={userName}
                    className=" font-text"
                    icon={
                      <>
                        {
                          <img
                            src={userInfo?.image}
                            height={30}
                            width={30}
                            style={{ borderRadius: "50%", objectFit: "cover" }}
                          ></img>
                        }
                        &nbsp;
                      </>
                    }
                  >
                    <Menu.Item key="my-account">
                      <Link
                        to={appRoutes.myAccount}
                        className="font-submenu"
                        color="#555555"
                        onClick={() => {
                          window.scrollTo(0, 0);
                        }}
                      >
                        <FontAwesomeIcon
                          className="mr-2"
                          icon={faUser}
                          color="#0099FF"
                        />
                        Thông Tin Cá Nhân
                      </Link>
                    </Menu.Item>

                    <Menu.Item
                      key="address"
                      onClick={() => dispatch(closeAccountManage())}
                    >
                      <Link
                        to={appRoutes.address}
                        className="font-submenu"
                        color="#555555"
                        onClick={() => {
                          window.scrollTo(0, 0);
                        }}
                      >
                        <FontAwesomeIcon
                          className="mr-2"
                          icon={faSearchLocation}
                          color="#339900"
                        />
                        Địa Chỉ
                      </Link>
                    </Menu.Item>

                    <Menu.Item
                      key="bill"
                      onClick={() => dispatch(openAccountManage())}
                    >
                      <Link
                        to={appRoutes.purchase}
                        className="font-submenu"
                        color="#555555"
                        onClick={() => {
                          window.scrollTo(0, 0);
                        }}
                      >
                        <FontAwesomeIcon
                          className="mr-2"
                          icon={faCommentDollar}
                          color="#FF9900"
                        />
                        Đơn Hàng
                      </Link>
                    </Menu.Item>
                    <Menu.Item
                      key="logout"
                      onClick={() => dispatch(userLogOut())}
                    >
                      <Link
                        to={appRoutes.login}
                        className="font-submenu"
                        color="#555555"
                        onClick={() => {
                          window.scrollTo(0, 0);
                        }}
                      >
                        <FontAwesomeIcon
                          className="mr-2"
                          icon={faSignOutAlt}
                          color="#CC6633"
                        />
                        Đăng Xuất
                      </Link>
                    </Menu.Item>
                  </SubMenu>
                  <Menu.Item key="cart">
                    <Link
                      to={appRoutes.cart}
                      className=" font-text"
                      onClick={() => {
                        window.scrollTo(0, 0);
                      }}
                    >
                      <Badge count={totalCartItem} className="mr-2">
                        <ShoppingCartOutlined
                          style={{ fontSize: 40, color: "white" }}
                        />
                      </Badge>
                      Giỏ Hàng
                    </Link>
                  </Menu.Item>
                </Menu>
              </>
            )}
            {!isLoggedIn && (
              <>
                <Menu
                  mode="horizontal"
                  style={{ background: "Transparent" }}
                  selectedKeys={[selectedMenu]}
                >
                  <Menu.Item
                    key="login"
                    onClick={() => setSelectedMenu("login")}
                  >
                    <FontAwesomeIcon
                      className="mr-2  text-white"
                      icon={faSignInAlt}
                    />
                    <Link
                      to={appRoutes.login}
                      className=" font-text"
                      onClick={() => {
                        window.scrollTo(0, 0);
                      }}
                    >
                      Đăng Nhập/Đăng Ký
                    </Link>
                  </Menu.Item>

                  <Menu.Item key="cart">
                    <Link
                      to={appRoutes.cart}
                      className=" font-text"
                      onClick={() => {
                        window.scrollTo(0, 0);
                      }}
                    >
                      <Badge count={totalCartItem} className="mr-2">
                        <ShoppingCartOutlined
                          style={{ fontSize: 40, color: "white" }}
                        />
                      </Badge>
                      Giỏ Hàng
                    </Link>
                  </Menu.Item>
                </Menu>
              </>
            )}
          </Col>
        </Row>
      </Header>

      <Content
        className="site-layout-background"
        style={{
          paddingTop: 75,
          paddingBottom: 0,
          paddingLeft: 150,
          paddingRight: 150,
          margin: 0,
          backgroundImage: "url(background)",
        }}
      >
        <BreadCrumb></BreadCrumb>
        {children}

        <PageFooter></PageFooter>
      </Content>
    </Layout>
  );
};

export default NavBar;
