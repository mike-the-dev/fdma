import EmployeePayoutForm from "@/components/EmployeePayoutForm";
import CustomerCreation from "@/components/CustomerCreation";
import React from "react";
import styles from "../page.module.css";
import Navigation from "@/components/Navigation";

const Dashboard: React.FC = async (): Promise<React.ReactElement> => {
  return (
    <div>
      <Navigation />
      <div className={styles.row}>
        <div className={styles.column}>
          <CustomerCreation />
          {/* <EmployeePayoutForm /> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;