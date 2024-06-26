import { Card, Skeleton, Spacer, Spinner } from "@nextui-org/react";
import styles from "./page.module.css"

interface LoadingProps {

};

const Loading: React.FC<LoadingProps> = (): React.ReactElement => {
  return (
    <div>
      <div className={styles.row}>
        <div className={styles.column}>
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 9999 }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
              <p>Loading...</p>
              <Spacer y={2} />
              <Card
                className="border-none bg-background/60 dark:bg-default-100/50"
                shadow="sm"
                style={{ padding: "12px 12px 12px 12px" }}
              >
                <Spinner color="secondary" />
              </Card>

            </div>
          </div>
         </div>
       </div>
     </div>
  );
};

export default Loading;