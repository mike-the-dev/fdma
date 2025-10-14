import { Skeleton } from "@heroui/skeleton";
import { Spacer } from "@heroui/spacer";

interface LoadingProps {}

const Loading: React.FC<LoadingProps> = (): React.ReactElement => {
  return (
    <div>
      <Skeleton className="rounded-lg" style={{ height: 973 }}>
        <div className="h-24 rounded-lg bg-default-300" />
      </Skeleton>
      <Spacer y={5} />
      {/* <div className="">
        <Skeleton className="w-2/5 rounded-lg">
          <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
          <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
          <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
        </Skeleton>
      </div> */}
    </div>
  );
};

export default Loading;
