"use client";
import HeaderMenu from "@/components/dashboard/HeaderMenu";
import SideBar from "@/components/dashboard/SideBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Layout } from "antd";
import React from "react";

const { Content } = Layout;

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ProtectedRoute>
      <Layout className="" style={{ height: "100%", minHeight: "100vh" }}>
        <SideBar />
        <Layout>
          <HeaderMenu />
          <Content style={{ margin: "24px 16px 0" }}>
            <div
              style={{
                padding: 24,
                // overflow: "hidden",
              }}
            >
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
