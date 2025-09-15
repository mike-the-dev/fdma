"use client";

import React from "react";
import { AccountInstapaytient } from "@/types/AccountInstapaytient";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface ModalInstapaytientProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
  setInitialState: () => void;
  account: AccountInstapaytient;
};

const ModalInstapaytient: React.FC<ModalInstapaytientProps> = (props): React.ReactElement => {
  const Router = useRouter();
  const initialState: AccountInstapaytient = {
    entity: "",
    _createdAt_: "",
    payout: {
      name: "",
      total_payout_amount: 0,
      take: 0,
      currency: "",
      instant_payout_enabled: false,
      stripe_id: ""
    },
    company: "",
    'GSI1-SK': "",
    SK: "",
    'GSI1-PK': "",
    PK: "",
    name: "",
    _lastUpdated_: "",
    state: ""
  };
  const [state, setState] = React.useState<AccountInstapaytient>(initialState);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const updateAccount = async <T,>(updateInput: AccountInstapaytient): Promise<T> => {
    // Extract only the fields that have changed from the original account
    const changes: Partial<AccountInstapaytient> = {};
    
    if (updateInput.name !== props.account.name) changes.name = updateInput.name;
    if (updateInput.company !== props.account.company) changes.company = updateInput.company;
    if (updateInput.state !== props.account.state) changes.state = updateInput.state;
    if (JSON.stringify(updateInput.payout) !== JSON.stringify(props.account.payout)) {
      changes.payout = updateInput.payout;
    }

    const res = await fetch(process.env.NEXT_PUBLIC_URL + `/api/instapaytient/update`, {
      method: "POST",
      body: JSON.stringify({
        PK: updateInput.PK,
        SK: updateInput.SK,
        updates: changes
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": `Bearer ${localStorage.getItem("auth-public-token")}`
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    };

    return res.json() as Promise<T>;
  };

  const onUpdateFormData = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const key: string = event.target.name;
    const value: string = event.target.value;
    
    if (key === "take") {
      const takeValue = parseFloat(value) || 0;
      setState(prevState => ({
        ...prevState,
        payout: {
          ...prevState.payout!,
          take: Math.max(0, Math.min(100, takeValue)) // Ensure take is between 0-100
        }
      }));
    } else if (key === "stripe_id") {
      setState(prevState => ({
        ...prevState,
        payout: {
          ...prevState.payout!,
          stripe_id: value
        }
      }));
    } else {
      setState(prevState => ({
        ...prevState,
        [key]: value
      }));
    }
  };

  const onUpdateCheckboxData = (isSelected: boolean) => {
    setState(prevState => ({
      ...prevState,
      payout: {
        ...prevState.payout!,
        instant_payout_enabled: isSelected
      }
    }));
  };

  const onSubmitFormData = async (): Promise<void> => {
    try {
      setIsSubmitting(true);

      await updateAccount(state);
      Router.refresh();
      
      toast.success(`✅ ${state.name} has been updated successfully!`, { duration: 4000 });
      props.onClose();
    } catch (error) {
      console.error("Error updating account: ", error);
      toast.error(`❌ Failed to update ${state.name}. Please try again.`, { duration: 4000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled = (): boolean => {
    if (!state.name || !state.company) return true;

    if (
      state.name === props.account.name 
      && state.company === props.account.company 
      && state.state === props.account.state
      && state.payout?.take === props.account.payout?.take
      && state.payout?.instant_payout_enabled === props.account.payout?.instant_payout_enabled
      && state.payout?.stripe_id === props.account.payout?.stripe_id
    ) return true;

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
          stripe_id: ""
        },
        company: props.account.company || "",
        'GSI1-SK': props.account['GSI1-SK'] || "",
        SK: props.account.SK || "",
        'GSI1-PK': props.account['GSI1-PK'] || "",
        PK: props.account.PK || "",
        name: props.account.name || "",
        _lastUpdated_: props.account._lastUpdated_ || "",
        state: props.account.state || ""
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
              <ModalHeader className="flex flex-col gap-1">Modify Instapaytient Account</ModalHeader>
              <ModalBody>
              <p>{state.name}</p>
              <Input 
                type="text" 
                label="Company Name" 
                onChange={onUpdateFormData} 
                name={"company"} 
                value={state.company} 
              />
              <Input 
                type="text" 
                label="State" 
                onChange={onUpdateFormData} 
                name={"state"} 
                value={state.state} 
              />
              <Input 
                type="number" 
                label="Take (%)" 
                placeholder="0" 
                min={0} 
                max={100}
                step={0.1}
                onChange={onUpdateFormData} 
                name={"take"} 
                value={state.payout?.take?.toString() || "0"} 
              />
              <Input
                type="text"
                label="Stripe ID"
                onChange={onUpdateFormData}
                name={"stripe_id"}
                value={state.payout?.stripe_id || ""}
              />
              <Checkbox 
                isSelected={state.payout?.instant_payout_enabled || false}
                onValueChange={onUpdateCheckboxData}
              >
                Enable instant payout.
              </Checkbox>
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="danger" 
                  variant="light" 
                  onPress={onCloseHandler}
                >
                  Close
                </Button>
                <Button 
                  color="primary" 
                  variant="shadow"
                  isDisabled={isSubmitDisabled() || isSubmitting}
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
