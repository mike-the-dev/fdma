"use client";
import { Input } from "@heroui/input";
import { Spacer } from "@heroui/spacer";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { useState } from "react";

import { CustomerInputForm } from "@/types/Customer";
import { Account } from "@/types/Account";

interface EmployeeCustomerFormProps {
  heading: string;
  accounts: Account[];
  employeeID: string;
}

const EmployeeCustomerForm: React.FC<EmployeeCustomerFormProps> = (
  props
): React.ReactElement => {
  const [state, setState] = useState<any>({
    name: "",
    customerID: "",
    take: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const createCustomer = async <T,>(
    createCustomerInput: CustomerInputForm
  ): Promise<T> => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_URL + "/api/createCustomer",
      {
        method: "POST",
        body: JSON.stringify({
          ...createCustomerInput,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      // throw new Error('Failed to fetch data');
    }

    return res.json() as Promise<T>;
  };

  const onUpdateFormData = (event: any): void => {
    const key: string = event.target.name;
    const value: string =
      event.target.name === "take"
        ? parseFloat(event.target.value)
        : event.target.value;

    setState((prevState: any) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const onUpdateDropdownFormData = (event: any): void => {
    const foundAccount: any =
      props.accounts.find((account) => account.PK === event.target.value) || "";

    setState((prevState: any) => ({
      ...prevState,
      name: foundAccount.name,
      customerID: foundAccount.PK,
    }));
  };

  const onSubmitFormData = async (): Promise<void> => {
    try {
      setIsSubmitting(true);

      await createCustomer({ ...state, PK: props.employeeID });

      setIsSubmitting(false);

      setState({
        name: "",
        customerID: "",
        take: 0,
      });
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error creating user: ", error);
    }
  };

  const isSubmitDisabled = (): boolean => {
    if (!state.name) return true;

    return false;
  };

  return (
    <>
      <h3>{props.heading}</h3>
      <Spacer y={4} />
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <Select
          className="max-w-xs"
          label="Company"
          placeholder="Select a company"
          onChange={onUpdateDropdownFormData}
        >
          {props.accounts.map((customer) => (
            <SelectItem key={customer.PK}>{customer.name}</SelectItem>
          ))}
        </Select>

        <Input
          label="Take"
          min={0}
          name={"take"}
          placeholder="0"
          type="number"
          value={state.take.toString()}
          onChange={onUpdateFormData}
        />
      </div>
      <Spacer y={4} />
      <div>
        <Button
          color="primary"
          isDisabled={isSubmitDisabled() || isSubmitting}
          variant="shadow"
          onClick={onSubmitFormData}
        >
          Create Customer
        </Button>
      </div>
    </>
  );
};

export default EmployeeCustomerForm;
