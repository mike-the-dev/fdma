"use client";

import React from "react";
import { Spacer } from "@heroui/spacer";

import styles from "../page.module.css";

import LoginForm from "@/components/LoginForm";
import JoymdLogo from "@/components/Logos/JoymdLogo";

const Login = (): React.ReactElement => {
  // AuthProvider handles redirect if already authenticated
  return (
    <div>
      <div className={styles.row}>
        <div
          className={styles.column}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <JoymdLogo />
          <Spacer y={6} />
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
