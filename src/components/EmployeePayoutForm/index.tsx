"use client";
import { Card } from "@heroui/card";
import { Spacer } from "@heroui/spacer";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useState } from "react";

interface State {
  amount: number;
  payout_account_id: string;
  order_name: string;
  isSubmitting: boolean;
}

const EmployeePayoutForm = (): React.ReactElement => {
  const [state, setState] = useState<State>({
    amount: 0,
    payout_account_id: "",
    order_name: "",
    isSubmitting: false,
  });

  const payoutEmployees = async <T,>(payoutEmployeesInput: {
    amount: number;
  }): Promise<T> => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_URL + "/api/payoutEmployees",
      {
        method: "POST",
        body: JSON.stringify({
          ...payoutEmployeesInput,
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
    const value: any =
      event.target.name === "amount"
        ? parseFloat(event.target.value)
        : event.target.value;

    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const onSubmitFormData = async (): Promise<void> => {
    try {
      setState((prevState) => ({ ...prevState, isSubmitting: true }));

      await payoutEmployees(state);

      setState({
        amount: 0,
        payout_account_id: "",
        order_name: "",
        isSubmitting: false,
      });
    } catch (error) {
      setState({
        amount: 0,
        payout_account_id: "",
        order_name: "",
        isSubmitting: false,
      });
      console.error("Error paying out user: ", error);
    }
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
        <Input
          label="amount"
          max="10000.00"
          min="0.00"
          name={"amount"}
          placeholder="0"
          step="0.01"
          type="number"
          value={state.amount.toString()}
          onChange={onUpdateFormData}
        />
        <Input
          label="payout account id"
          name={"payout_account_id"}
          placeholder="Payout Account ID"
          type="text"
          value={state.payout_account_id}
          onChange={onUpdateFormData}
        />
        <Input
          label="order name"
          name={"order_name"}
          placeholder="Order Name"
          type="text"
          value={state.order_name}
          onChange={onUpdateFormData}
        />
      </div>
      <Spacer y={4} />
      <div>
        <Button
          color="primary"
          isDisabled={isSubmitDisabled() || state.isSubmitting}
          variant="shadow"
          onClick={onSubmitFormData}
        >
          Payout
        </Button>
      </div>
    </Card>
  );
};

export default EmployeePayoutForm;
