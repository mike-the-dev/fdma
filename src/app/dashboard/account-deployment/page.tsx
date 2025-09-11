import AccountDeploymentForm from "@/components/AccountDeploymentForm";
import styles from "../../page.module.css";

const AccountDeployment = () => {
  return (
    <div>
      <div className={styles.row}>
        <div className={styles.column}>
          <AccountDeploymentForm />
        </div>
      </div>
    </div>
  );
};

export default AccountDeployment;
