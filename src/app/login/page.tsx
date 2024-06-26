import React from "react";
import styles from "../page.module.css";
import LoginForm from "@/components/LoginForm";

const Login: React.FC = async (): Promise<React.ReactElement> => {
  return (
    <div>
      <div className={styles.row}>
        <div className={styles.column} style={{ display: "flex", justifyContent: "center" }}>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;