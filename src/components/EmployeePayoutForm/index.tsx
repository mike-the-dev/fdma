"use client";
import { Card, Spacer, Input, Button } from "@nextui-org/react";
import { useState } from "react";

interface State {
  amount: number;
  payout_account_id:  string;
  order_name: string;
  isSubmitting: boolean;
};

const EmployeePayoutForm = (): React.ReactElement => {
  const [state, setState] = useState<State>({
    amount: 0,
    payout_account_id: "",
    order_name: "",
    isSubmitting: false
  });

  const payoutEmployees = async <T,>(payoutEmployeesInput: { amount: number }): Promise<T> => {
    const res = await fetch(`http://localhost:3000/api/payoutEmployees`, {
      method: "POST",
      body: JSON.stringify({
        ...payoutEmployeesInput
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
    const value: any = event.target.name === "amount" ? parseFloat(event.target.value) : event.target.value;
    setState(prevState => ({
      ...prevState,
      [key]: value
    }))
  };

  const onSubmitFormData = async (): Promise<void> => {
    try {
      setState(prevState => ({ ...prevState, isSubmitting: true }));

      await payoutEmployees(state);

      setState(({ amount: 0, payout_account_id: "", order_name: "", isSubmitting: false }));
    } catch (error) {
      setState(({ amount: 0, payout_account_id: "", order_name: "", isSubmitting: false }));
      console.error("Error paying out user: ", error);
    };
  };

  const isSubmitDisabled = (): boolean => {
    if (!state.amount) return true;

    return false;
  }; 

  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50"
      shadow="sm"
      style={{ padding: "12px 12px 12px 12px", width: "100%" }}
    >
      <h3>Employee Payout</h3>
      <p>Payout any individual employee or founder.</p>
      <Spacer y={4} />
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <Input type="number" label="amount" placeholder="0" min="0.00" max="10000.00" step="0.01" onChange={onUpdateFormData} name={"amount"} value={state.amount.toString()} />
        <Input type="text" label="payout account id" placeholder="Payout Account ID" onChange={onUpdateFormData} name={"payout_account_id"} value={state.payout_account_id} />
        <Input type="text" label="order name" placeholder="Order Name" onChange={onUpdateFormData} name={"order_name"} value={state.order_name} />
      </div>
      <Spacer y={4} />
      <div>
        <Button color="primary" variant="shadow" isDisabled={isSubmitDisabled() || state.isSubmitting} onClick={onSubmitFormData}>
          Payout
        </Button>
      </div>
    </Card>
  );
};

export default EmployeePayoutForm;