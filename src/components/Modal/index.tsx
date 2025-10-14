"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { Account, AccountUpdateInputForm } from "@/types/Account";

interface ModalProps {
  isOpen: any;
  onOpenChange: any;
  onClose: () => void;
  setInitialState: () => void;
  account: Account;
}

const ModalApp: React.FC<ModalProps> = (props): React.ReactElement => {
  const Router = useRouter();
  const initalState: AccountUpdateInputForm = {
    PK: "",
    SK: "",
    name: "",
    currency: "usd",
    take: 0,
    instantPayoutEnabled: false,
    stripeID: "",
    ecwidAppSecretKey: "",
    ecwidPublicKey: "",
    ecwidSecretKey: "",
    "GSI1-PK": "",
  };
  const [state, setState] = React.useState<AccountUpdateInputForm>(initalState);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const updateAccount = async <T,>(
    createUpdateInput: AccountUpdateInputForm
  ): Promise<T> => {
    // Just a comment
    const res = await fetch(
      process.env.NEXT_PUBLIC_URL + `/api/updateAccount`,
      {
        method: "POST",
        body: JSON.stringify({
          ...createUpdateInput,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("auth-public-token")}`,
        },
      }
    );

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
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

  const onUpdateCheckboxData = (isSelected: boolean) => {
    setState((prevState) => ({
      ...prevState,
      instantPayoutEnabled: isSelected,
    }));
  };

  const onSubmitFormData = async (): Promise<void> => {
    try {
      setIsSubmitting(true);

      // Update a user.
      await updateAccount(state);
      setIsSubmitting(false);
      Router.refresh();
      console.log("Thank you for everything! Router.refresh() did run!");

      toast.success(`✅ ${state.name} has been updated successfully!`, {
        duration: 4000,
      });
      props.onClose();
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error creating use r: ", error);
    }
  };

  const isSubmitDisabled = (): boolean => {
    if (!state.name) return true;

    if (
      state.name === props.account.name &&
      state.currency === props.account.currency &&
      state.take === props.account.take &&
      state.instantPayoutEnabled === props.account.instantPayoutEnabled &&
      state.stripeID === props.account.stripeID &&
      state.ecwidAppSecretKey === props.account.ecwidAppSecretKey &&
      state.ecwidPublicKey === props.account.ecwidPublicKey &&
      state.ecwidSecretKey === props.account.ecwidSecretKey &&
      state["GSI1-PK"] === props.account["GSI1-PK"]
    )
      return true;

    return false;
  };

  const onCloseHandler = (): void => {
    props.setInitialState();
    props.onClose();
  };

  React.useEffect(() => {
    setState({
      PK: props.account.PK,
      SK: props.account.SK,
      name: props.account.name,
      currency: props.account.currency,
      take: props.account.take,
      instantPayoutEnabled: props.account.instantPayoutEnabled
        ? props.account.instantPayoutEnabled
        : false,
      stripeID: props.account.stripeID ? props.account.stripeID : "",
      ecwidAppSecretKey: props.account.ecwidAppSecretKey
        ? props.account.ecwidAppSecretKey
        : "",
      ecwidPublicKey: props.account.ecwidPublicKey
        ? props.account.ecwidPublicKey
        : "",
      ecwidSecretKey: props.account.ecwidSecretKey
        ? props.account.ecwidSecretKey
        : "",
      "GSI1-PK": props.account["GSI1-PK"] ? props.account["GSI1-PK"] : "",
    });
  }, [props.account]);

  return (
    <>
      <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modify Account
              </ModalHeader>
              <ModalBody>
                <p>{state.name}</p>
                {/* Build Form */}
                {/* <Input 
                type="text" 
                label="Company Name" 
                onChange={onUpdateFormData} 
                name={"name"} 
                value={state.name} 
              /> */}
                {/* <Input 
                type="text" 
                label="Currency" 
                onChange={onUpdateFormData} 
                name={"currency"} 
                value={state.currency} 
              /> */}
                <Input
                  label="Take"
                  min={0}
                  name={"take"}
                  placeholder="0"
                  type="number"
                  value={state.take.toString()}
                  onChange={onUpdateFormData}
                />
                <Input
                  isDisabled
                  label="Stripe ID"
                  name={"stripeID"}
                  type="text"
                  value={state.stripeID}
                  onChange={onUpdateFormData}
                />
                <Input
                  label="Ecwid App Secret Key"
                  name={"ecwidAppSecretKey"}
                  type="text"
                  value={state.ecwidAppSecretKey}
                  onChange={onUpdateFormData}
                />
                <Input
                  label="Ecwid Public Key"
                  name={"ecwidPublicKey"}
                  type="text"
                  value={state.ecwidPublicKey}
                  onChange={onUpdateFormData}
                />
                <Input
                  label="Ecwid Secret Key"
                  name={"ecwidSecretKey"}
                  type="text"
                  value={state.ecwidSecretKey}
                  onChange={onUpdateFormData}
                />
                <Input
                  isDisabled
                  label="Ecwid Store ID"
                  name={"GSI1-PK"}
                  type="text"
                  value={state["GSI1-PK"]}
                  onChange={onUpdateFormData}
                />
                {/* <Checkbox 
                isSelected={state.instantPayoutEnabled}
                onValueChange={onUpdateCheckboxData}
              >
                Enable instant checkout.
              </Checkbox> */}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onCloseHandler}>
                  Close
                </Button>
                <Button
                  color="primary"
                  isDisabled={isSubmitDisabled() || isSubmitting}
                  variant="shadow"
                  onPress={onSubmitFormData}
                >
                  Update
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalApp;
