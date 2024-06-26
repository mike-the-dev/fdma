import { Card, Skeleton, Spacer } from "@nextui-org/react";
import styles from "./page.module.css"

interface LoadingProps {

};

const Loading: React.FC<LoadingProps> = (): React.ReactElement => {
  return (
    <div>
      <h1>Loading!!</h1>
      {/* <div className={styles.row}>
        <div className={styles.column}>
          <Card 
            isBlurred
            className="border-none bg-background/60 dark:bg-default-100/50"
            shadow="sm"
            style={{ padding: "12px 12px 12px 12px", width: "100%" }}
          >
            <h3>Loading dashboard</h3>
            <p className="text-small text-default-500">Hopefully not too long.</p>
            <Spacer y={4} />
            <Skeleton className="rounded-lg" style={{ height: 973 }}>
              <div className="h-24 rounded-lg bg-default-300"></div>
            </Skeleton>
            <Spacer y={5} />
            <div className="">
              <Skeleton className="w-2/5 rounded-lg">
                <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
              </Skeleton>
            </div>
          </Card>
         </div>
       </div> */}
     </div>
  );
};

export default Loading;