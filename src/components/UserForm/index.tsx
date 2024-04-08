"use client";
import { AccountInputForm } from "@/types/Account";
import { Input, Spacer, Button } from "@nextui-org/react";
import { useState } from "react";

interface UserFormProps {
  heading: string;
};

const UserForm: React.FC<UserFormProps> = (props): React.ReactElement => {
  const [state, setState] = useState<AccountInputForm>({
    name: "",
    currency: "usd",
    take: 0
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const createUser = async <T,>(createUserInput: AccountInputForm): Promise<T> => {
    const res = await fetch("http://localhost:3000/api/createUser", {
      method: "POST",
      body: JSON.stringify({
        ...createUserInput
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
    setState(prevState => ({
      ...prevState,
      [key]: value
    }))
  };

  const onSubmitFormData = async (): Promise<void> => {
    try {
      setIsSubmitting(true);
  
      await createUser(state);
  
      setIsSubmitting(false);
      setState({
        name: "",
        currency: "usd",
        take: 0
      })
    } catch(error) {
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
      <h3>{ props.heading }</h3>
      <Spacer y={4} />
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <Input type="text" label="Company Name" onChange={onUpdateFormData} name={"name"} value={state.name} />
        <Input type="text" label="Currency" onChange={onUpdateFormData}  name={"currency"} value={state.currency}/>
        <Input type="number" label="Take" placeholder="0" min={0} onChange={onUpdateFormData} name={"take"} value={state.take.toString()} />
      </div>
      <Spacer y={4} />
      <div>
        <Button color="primary" variant="shadow" isDisabled={isSubmitDisabled() || isSubmitting} onClick={onSubmitFormData}>
          Create User
        </Button>
      </div>
    </>
  );
};

export default UserForm;