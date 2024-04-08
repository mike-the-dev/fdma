"use client";
import { Account } from "@/types/Account";
import { CustomerInputForm } from "@/types/Customer";
import { Input, Spacer, Button, Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";

interface EmployeeCustomerFormProps {
  heading: string;
  accounts: Account[];
  employeeID: string;
};

const EmployeeCustomerForm: React.FC<EmployeeCustomerFormProps> = (props): React.ReactElement => {
  const [state, setState] = useState<any>({
    name: "",
    customerID: "",
    take: 0
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const createCustomer = async <T,>(createCustomerInput: CustomerInputForm): Promise<T> => {
    const res = await fetch(`http://localhost:3000/api/createCustomer`, {
      method: "POST",
      body: JSON.stringify({
        ...createCustomerInput
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

  const onUpdateFormData = (event: any): void => {
    const key: string = event.target.name;
    const value: string = event.target.name === "take" ? parseFloat(event.target.value) : event.target.value;
    setState((prevState: any) => ({
      ...prevState,
      [key]: value
    }))
  };

  const onUpdateDropdownFormData = (event: any): void => {
    const foundAccount: any = props.accounts.find(account => account.PK === event.target.value) || "";
    setState((prevState: any) => ({
      ...prevState,
      name: foundAccount.name,
      customerID: foundAccount.PK
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
        take: 0
      });
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error creating user: ", error);
    };
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
          label="Company"
          placeholder="Select a company"
          className="max-w-xs"
          onChange={onUpdateDropdownFormData}
        >
          {props.accounts.map((customer) => (
            <SelectItem key={customer.PK} value={customer.name}>
              {customer.name}
            </SelectItem>
          ))}
        </Select>

        <Input type="number" label="Take" placeholder="0" min={0} onChange={onUpdateFormData} name={"take"} value={state.take.toString()} />
      </div>
      <Spacer y={4} />
      <div>
        <Button color="primary" variant="shadow" isDisabled={isSubmitDisabled() || isSubmitting} onClick={onSubmitFormData}>
          Create Customer
        </Button>
      </div>
    </>
  );
};

export default EmployeeCustomerForm;