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
import { Checkbox } from "@heroui/checkbox";
import { toast } from "react-hot-toast";

import { AccountInstapaytient } from "@/types/AccountInstapaytient";
import apiClient from "@/utils/apiClient";

interface ModalInstapaytientProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
  setInitialState: () => void;
  account: AccountInstapaytient;
  refetchAccounts: () => Promise<void>;
}

const ModalInstapaytient: React.FC<ModalInstapaytientProps> = (
  props
): React.ReactElement => {
  const initialState: AccountInstapaytient = {
    entity: "",
    _createdAt_: "",
    payout: {
      name: "",
      total_payout_amount: 0,
      take: 0,
      currency: "",
      instant_payout_enabled: false,
      stripe_id: "",
    },
    company: "",
    "GSI1-SK": "",
    SK: "",
    "GSI1-PK": "",
    PK: "",
    name: "",
    _lastUpdated_: "",
    state: "",
  };
  const [state, setState] = React.useState<AccountInstapaytient>(initialState);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  interface UpdateAccountPayload extends Partial<AccountInstapaytient> {
    PK: string;
    SK: string;
  }

  interface UpdateAccountResponse {
    success: boolean;
    message: string;
    data?: {
      PK: string;
      SK: string;
      updatedFields: string[];
    };
  }

  const updateAccount = async (
    updateInput: AccountInstapaytient
  ): Promise<UpdateAccountResponse> => {
    const response = await apiClient.post<
      UpdateAccountResponse,
      any,
      UpdateAccountPayload
    >("/api/user/updateAccount", {
      PK: updateInput.PK,
      SK: updateInput.SK,
      name: updateInput.name,
      company: updateInput.company,
      state: updateInput.state,
      payout: updateInput.payout,
    });

    return response.data;
  };

  const onUpdateFormData = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const key: string = event.target.name;
    const value: string = event.target.value;

    if (key === "take") {
      const takeValue = parseFloat(value) || 0;

      setState((prevState) => ({
        ...prevState,
        payout: {
          ...prevState.payout!,
          take: Math.max(0, Math.min(100, takeValue)), // Ensure take is between 0-100
        },
      }));
    } else if (key === "stripe_id") {
      setState((prevState) => ({
        ...prevState,
        payout: {
          ...prevState.payout!,
          stripe_id: value,
        },
      }));
    } else if (key === "stripe_name") {
      setState((prevState) => ({
        ...prevState,
        payout: {
          ...prevState.payout!,
          name: value,
        },
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        [key]: value,
      }));
    }
  };

  const onUpdateCheckboxData = (isSelected: boolean) => {
    setState((prevState) => ({
      ...prevState,
      payout: {
        ...prevState.payout!,
        instant_payout_enabled: isSelected,
      },
    }));
  };

  const onSubmitFormData = async (): Promise<void> => {
    try {
      setIsSubmitting(true);

      // console.log("Form Payload State:", state);

      await updateAccount(state);

      // Refresh the accounts data instead of using router.refresh()
      await props.refetchAccounts();

      toast.success(`✅ ${state.name} has been updated successfully!`, {
        duration: 4000,
      });
      props.onClose();
    } catch (error: any) {
      console.error("Error updating account: ", error);

      // If it's a token expiration error, don't show error message as user will be logged out
      if (error.isTokenExpired) {
        return;
      }

      toast.error(`❌ Failed to update ${state.name}. Please try again.`, {
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled = (): boolean => {
    if (!state.name || !state.company) return true;

    if (
      state.name === props.account.name &&
      state.company === props.account.company &&
      state.state === props.account.state &&
      state.payout?.name === props.account.payout?.name &&
      state.payout?.take === props.account.payout?.take &&
      state.payout?.instant_payout_enabled ===
        props.account.payout?.instant_payout_enabled &&
      state.payout?.stripe_id === props.account.payout?.stripe_id
    )
      return true;

    return false;
  };

  const onCloseHandler = (): void => {
    props.setInitialState();
    props.onClose();
  };

  React.useEffect(() => {
    if (props.account && props.account.PK) {
      setState({
        entity: props.account.entity || "",
        _createdAt_: props.account._createdAt_ || "",
        payout: props.account.payout || {
          name: "",
          total_payout_amount: 0,
          take: 0,
          currency: "",
          instant_payout_enabled: false,
          stripe_id: "",
        },
        company: props.account.company || "",
        "GSI1-SK": props.account["GSI1-SK"] || "",
        SK: props.account.SK || "",
        "GSI1-PK": props.account["GSI1-PK"] || "",
        PK: props.account.PK || "",
        name: props.account.name || "",
        _lastUpdated_: props.account._lastUpdated_ || "",
        state: props.account.state || "",
      });
    } else {
      setState(initialState);
    }
  }, [props.account]);

  return (
    <>
      <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modify Instapaytient Account
              </ModalHeader>
              <ModalBody>
                <p>{state.name}</p>
                <Input
                  description={
                    state.company
                      ? "Company name cannot be changed after initial setup"
                      : ""
                  }
                  isDisabled={!!state.company}
                  label="Company Name"
                  name={"company"}
                  placeholder="Enter company name (cannot be changed once set)"
                  type="text"
                  value={state.company}
                  onChange={onUpdateFormData}
                />
                <Input
                  label="State"
                  name={"state"}
                  type="text"
                  value={state.state}
                  onChange={onUpdateFormData}
                />
                {/* Stripe Settings */}
                <Input
                  label="Stripe Name"
                  name={"stripe_name"}
                  type="text"
                  value={state.payout?.name || ""}
                  onChange={onUpdateFormData}
                />
                <Input
                  label="Stripe Take (%)"
                  max={100}
                  min={0}
                  name={"take"}
                  placeholder="0"
                  step={0.1}
                  type="number"
                  value={state.payout?.take?.toString() || "0"}
                  onChange={onUpdateFormData}
                />
                <Input
                  label="Stripe ID"
                  name={"stripe_id"}
                  type="text"
                  value={state.payout?.stripe_id || ""}
                  onChange={onUpdateFormData}
                />
                <Checkbox
                  isSelected={state.payout?.instant_payout_enabled || false}
                  onValueChange={onUpdateCheckboxData}
                >
                  Enable instant payout.
                </Checkbox>
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

export default ModalInstapaytient;
