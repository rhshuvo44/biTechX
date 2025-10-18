import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
// import { TUser, useCurrentToken } from "../../redux/features/auth/authSlice";
import { ProductFilled } from "@ant-design/icons";
import Link from "next/link";
const SideBar = () => {
  const [openKeys, setOpenKeys] = useState([]);

  //   const token = useAppSelector(useCurrentToken);
  //   let user;
  //   if (token) {
  //     user = verifyToken(token) as TUser;
  //   }
  const sidebarItems = [
    {
      key: "2",
      icon: <ProductFilled />,
      label: <Link href="/dashboard/">Products</Link>,
    },
    {
      key: "3",
      icon: <ProductFilled />,
      label: <Link href="/dashboard/categories"> Category</Link>,
    },
  ];

  const handleOpenChange = (keys: []) => {
    if (openKeys.length == 1) {
      keys.shift();
      setOpenKeys(keys);
      return;
    }
    setOpenKeys(keys);
  };
  return (
    <Sider
      style={{
        // width: "100%",
        height: "100%",
        minHeight: "100vh",
        position: "sticky",
        top: "0",
        left: "0",
      }}
      // width={250}
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={(broken) => {
        console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type);
      }}
    >
      <div className="m-5">
        {/* <img src={logo} alt="logo" /> */}

        <h1 className="text-white text-2xl font-bold">BiTechX</h1>
      </div>
      <Menu
        openKeys={openKeys}
        onOpenChange={(keys: string[]) => handleOpenChange(keys as [])}
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["4"]}
        items={sidebarItems as []}
      />
    </Sider>
  );
};

export default SideBar;
