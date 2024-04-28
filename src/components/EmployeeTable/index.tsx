"use client";

import { useEffect, useState } from "react";
import { Spacer, Card } from "@nextui-org/react";
import { Employee } from "@/types/Employee";
import Table from "@/components/EmployeeTable/table";
import EmployeeDetail from "@/components/EmployeeDetail";
import EmployeeCustomerForm from "@/components/EmployeeCustomerForm";

interface EmployeeTableProps {
  accounts: any;
  employees: any;
};

const getCustomersByEmployeeData = async <T,>(ID: string): Promise<T> => {
  const res = await fetch(process.env.NEXT_PUBLIC_URL + "/api/customersByEmployee", {
    method: "POST",
    body: JSON.stringify({
      ID: ID
    }),
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

const EmployeeTable: React.FC<EmployeeTableProps> = (props): React.ReactElement => {
  const [state, setState] = useState<{
    selectedID: string;
    isToggled: number;
  }>({
    selectedID: "",
    isToggled: 0,
  });

  const [employee, setEmployee] = useState<{
    employee: any;
    isLoading: boolean
  }>({
    employee: null,
    isLoading: true
  });

  const updateSelectedID = (selectedID: string, isToggled: number): void => {
    setState({
      selectedID: !isToggled ? "" :  selectedID,
      isToggled: isToggled
    });
  };

  const onMount = async (): Promise<void> => {
    setEmployee({
      employee: null,
      isLoading: true
    });

    const customers = await getCustomersByEmployeeData<Employee>(state.selectedID);

    setEmployee({
      employee: customers,
      isLoading: false
    });
  };

  useEffect(() => {
    if (state.isToggled) {
      onMount();
    };
  }, [state.selectedID]);

  return (
    <>
      { state.isToggled ? (
        <>
          <EmployeeDetail customers={employee.employee ? employee.employee.customers : []} isLoading={employee.isLoading} /> 
          <Spacer y={4} />
          <EmployeeCustomerForm heading={"LINK CUSTOMER"} accounts={props.accounts} employeeID={state.selectedID} />
        </>
        ) 
        : null}
      <Spacer y={6} />
      <Card
        isBlurred
        className="border-none bg-background/60 dark:bg-default-100/50"
        shadow="sm"
        style={{ padding: "12px 12px 12px 12px", width: "100%" }}
      > 
        <Table 
          heading={ "EMPLOYEE ACCOUNTS" } 
          employees={ props.employees } 
          updateSelectedID={updateSelectedID}
        />
      </Card>
    </>
  );
};

export default EmployeeTable;