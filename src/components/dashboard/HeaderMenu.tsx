import { BellOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Dropdown, Layout, MenuProps } from "antd";
import Link from "next/link";

const { Header } = Layout;
const HeaderMenu = () => {
  const items: MenuProps["items"] = [
    {
      label: <Link href={`/me`}>Profile</Link>,
      key: "profile",
    },
    {
      label: <Link href={`/settings`}>Settings</Link>,
      key: "settings",
    },

    {
      type: "divider",
    },
    {
      label: (
        <Button
        // onClick={() => dispatch(logout())}
        >
          Logout
        </Button>
      ),
      key: "logout",
    },
  ];
  const date = new Date();

  return (
    <Header
      style={{ position: "sticky", top: 0, zIndex: 1, width: "100%" }}
      className="flex items-center gap-1 md:gap-5 justify-between"
    >
      <div className="flex items-center md:px-8 text-white justify-center">
        <h3 className="text-sm md:font-bold md:text-2xl lg:text-3xl capitalize text-primary ">
          Hello User,
        </h3>
        <small className=" hidden md:block mt-3 md:mr-3 md:font-bold md:text-lg text-[#00A9EA]">
          User Role
        </small>
        <p className="hidden md:block lg:mt-3"> {date.toDateString()}</p>
      </div>

      <div className="flex gap-4 justify-center items-center">
        <Dropdown trigger={["click"]}>
          <Badge count={2} size="small" offset={[-2, 4]}>
            <Avatar
              alt="avatar"
              icon={<BellOutlined />}
              style={{ fontSize: "24px", cursor: "pointer" }}
            />
          </Badge>
        </Dropdown>
        <Dropdown menu={{ items }} trigger={["click"]}>
          <a onClick={(e) => e.preventDefault()}>
            <Avatar
              src="https://joeschmoe.io/api/v1/random"
              alt="avatar"
              icon={<UserOutlined />}
              size={{ xs: 24, sm: 32, md: 40, lg: 50, xl: 56, xxl: 60 }}
            />
          </a>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderMenu;
