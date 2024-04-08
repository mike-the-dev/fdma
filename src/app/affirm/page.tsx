import React from "react";
import styles from "../page.module.css";
import Affirm from "@/components/Affirm";

const Dashboard: React.FC = async (): Promise<React.ReactElement> => {
  return (
    <div>
      <div className={styles.row}>
        <div className={styles.column}>
          <Affirm /> 
        </div>
      </div>
    </div>
  );
};

export default Dashboard;