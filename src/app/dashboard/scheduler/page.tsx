import React from "react";
import { Spacer, Card } from "@nextui-org/react";
import SchedulerTable from "@/components/SchedulerTable";
import styles from "../../page.module.css"
import type { Scheduler } from "@/utils/listSchedulers";
import { cookies } from "next/headers";

interface SchedulerProps {

};

const getData = async <T,>(): Promise<T> => {
  const key: string = cookies().get("auth-public-token")?.value || "";

  const res = await fetch(process.env.NEXT_PUBLIC_URL + "/api/scheduler", {
    cache: "no-store",
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "Authorization": `Bearer ${key}}`
    }
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  };

  return res.json() as Promise<T>;
};

const Scheduler = async (): Promise<React.ReactElement> => {
  const { schedulers } = await getData<{ schedulers: Scheduler[] }>();

  console.log("schedulers: ", schedulers);

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
            <h3>Scheduler</h3>
            <p className="text-small text-default-500">Manage your scheduling and appointments.</p>
            <Spacer y={4} />
            <SchedulerTable schedules={schedulers} />
            <Spacer y={6} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Scheduler;
