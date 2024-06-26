"use client";
import auth from "@/utils/auth";
import { Button, Card, Input, Spacer } from "@nextui-org/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useState } from "react";


interface State {
  code: string;
  isSubmitting: boolean;
}; 

const LoginForm = (): React.ReactElement => {
  const [state, setState] = useState<State>({
    code: "",
    isSubmitting: false
  });
  const router: AppRouterInstance = useRouter();

  const onSubmitFormData = async (): Promise<void> => {
    try {
      setState(prevState => ({ ...prevState, isSubmitting: true }));

      await auth().login(state.code);

      localStorage.setItem("auth-public-token", state.code);

      setState(({ code: "", isSubmitting: false }));

      router.push("/dashboard");
    } catch (error) {
      localStorage.removeItem("auth-public-token");
      setState((prevState => ({ code: prevState.code, isSubmitting: false })));
      console.error("Error creating new account: ", error);
    };
  };

  const onUpdateFormData = (event: any): void => {
    const key: string = event.target.name;
    const value: string =  event.target.value;
    setState(prevState => ({
      ...prevState,
      [key]: value
    }))
  };

  const isSubmitDisabled = (): boolean => {
    if (!state.code) return true;

    return false;
  }; 

  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50"
      shadow="sm"
      style={{ padding: "12px 12px 12px 12px", width: "100%", maxWidth: 500 }}
    >
      <h1>Login</h1>
      <Spacer y={4} />
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <Input type="text" label="code" placeholder="Code" onChange={onUpdateFormData} name={"code"} value={state.code} />
      </div>
      <Spacer y={4} />
      <div>
        <Button color="primary" variant="shadow" isDisabled={isSubmitDisabled() || state.isSubmitting} onClick={onSubmitFormData}>
          Login
        </Button>
      </div>
    </Card>
  );
};

export default LoginForm