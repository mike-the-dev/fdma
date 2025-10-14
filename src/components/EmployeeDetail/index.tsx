import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { Divider } from "@heroui/divider";
import { Skeleton } from "@heroui/skeleton";
import { useEffect } from "react";

interface EmployeeDetailProps {
  customers: any[];
  isLoading: boolean;
};

const EmployeeDetail: React.FC<EmployeeDetailProps> = (props): React.ReactElement => {
  useEffect(() => {

  }, [props.customers]);

  if (props.isLoading) return <></>;

  if (props.customers.length === 0) return <></>;

  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
      shadow="sm"
    >
      <CardHeader className="flex gap-3">
        <Image
          alt="nextui logo"
          height={40}
          radius="sm"
          src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">Customers</p>
          <p className="text-small text-default-500">A list of customers for employee.</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        {props.customers.map((customer) => {
          return (
            <p key={customer.SK}>{customer.name}</p>
          );
        })}
      </CardBody>
      <Divider />
      <CardFooter>
        <p style={{ color: "aqua" }}>This card will dynamically change based on customer.</p>
      </CardFooter>
    </Card>
  );
};

export default EmployeeDetail;