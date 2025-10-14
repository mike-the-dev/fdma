"use client";
import { Input } from "@heroui/input";
import { Spacer } from "@heroui/spacer";
import { Button } from "@heroui/button";
import { useState } from "react";

import { AccountInputForm } from "@/types/Account";

interface UserFormProps {
  heading: string;
}

const UserForm: React.FC<UserFormProps> = (props): React.ReactElement => {
  const [state, setState] = useState<AccountInputForm>({
    name: "",
    currency: "usd",
    take: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const createUser = async <T,>(
    createUserInput: AccountInputForm
  ): Promise<T> => {
    const res = await fetch(process.env.NEXT_PUBLIC_URL + "/api/createUser", {
      method: "POST",
      body: JSON.stringify({
        ...createUserInput,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

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

    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const onSubmitFormData = async (): Promise<void> => {
    try {
      setIsSubmitting(true);

      await createUser(state);

      setIsSubmitting(false);
      setState({
        name: "",
        currency: "usd",
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
        <Input
          label="Company Name"
          name={"name"}
          type="text"
          value={state.name}
          onChange={onUpdateFormData}
        />
        <Input
          label="Currency"
          name={"currency"}
          type="text"
          value={state.currency}
          onChange={onUpdateFormData}
        />
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
          Create User
        </Button>
      </div>
    </>
  );
};

export default UserForm;
