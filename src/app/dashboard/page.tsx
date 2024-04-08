import EmployeePayoutForm from "@/components/EmployeePayoutForm";
import React from "react";
import styles from "../page.module.css";

const Dashboard: React.FC = async (): Promise<React.ReactElement> => {
  return (
    <div>
      <div className={styles.row}>
        <div className={styles.column}>
          <EmployeePayoutForm />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;