import React from "react";
import styles from "../page.module.css";
import LoginForm from "@/components/LoginForm";
import JoymdLogo from "@/components/Logos/JoymdLogo";
import { Spacer } from "@nextui-org/react";

const Login = async (): Promise<React.ReactElement> => {
  return (
    <div>
      <div className={styles.row}>
        <div className={styles.column} style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
          <JoymdLogo />
          <Spacer y={6} />
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;