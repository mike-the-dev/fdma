"use client";
import React from "react";
import { Divider, Spacer, Card } from "@nextui-org/react";
import AccountTable from "@/components/AccountTable";
import UserForm from "@/components/UserForm";
import styles from "./page.module.css"
import EmployeeTable from "@/components/EmployeeTable";
import { Suspense } from "react";
import Loading from "@/components/AccountTable/loading";
import { AccountHttpResponse } from "@/types/Account";

interface HomeProps {

};

const getData = async <T,>(): Promise<T> => {
  // await new Promise(resolve => setTimeout(resolve, 30000));

  const res = await fetch(process.env.NEXT_PUBLIC_URL + "/api", {
    cache: "no-cache",
    method: "GET",
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    // throw new Error('Failed to fetch data');
  };

  return res.json() as Promise<T>;
};

const getEmployeeData = async <T,>(): Promise<T> => {
  const res = await fetch(process.env.NEXT_PUBLIC_URL + "/api/employee", {
    method: "GET",
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    // throw new Error('Failed to fetch data');
    throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
  };

  return res.json() as Promise<T>;
};

const Home: React.FC<HomeProps> = (): React.ReactElement => {
  // const { accounts } = await getData<AccountHttpResponse>();
  // const { employees } = await getEmployeeData<EmployeeHttpResponse>();

  // console.log("accounts: ", accounts);

  const [accounts, setAccounts] = React.useState<any>([]);

  const onMount = async () => {
    const { accounts } = await getData<AccountHttpResponse>();

    setAccounts(accounts);
  };

  React.useEffect(() => {
    onMount(); 
  }, []);

  if (accounts.length !== 0) console.log("accounts available: ", accounts);

  return (
    <div>
      <div className={styles.row}>
        <div className={styles.column}>
          <Card
            isBlurred
            className="border-none bg-background/60 dark:bg-default-100/50"
            shadow="sm"
            style={{ padding: "12px 12px 12px 12px", width: "100%" }}
          > 
            <h3>User Accounts</h3>
            <p className="text-small text-default-500">List of user customer accounts.</p>
            <Spacer y={4} />
            <Suspense fallback={<Loading />}>
              <AccountTable accounts={accounts} />
            </Suspense>
            <Spacer y={6} />
            {/* <UserForm heading={"CREATE NEW USER"} /> */}
          </Card>
          {/* <Spacer y={10} /> */}
          {/* <Divider /> */}
          {/* <Spacer y={4} /> */}
          {/* <EmployeeTable accounts={accounts} employees={employees} /> */}
        </div>
      </div> 
    </div>
  );
};

export default Home;