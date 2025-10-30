"use client";
import { Card } from "@heroui/card";
import { Spacer } from "@heroui/spacer";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { useState } from "react";

interface State {
  name: string;
  businessUrl: string;
  isSubmitting: boolean;
  refresh_url: string;
  stripeID: string;
}

type ApiCreateAccountSuccess = {
  businessUrl: string;
  stripeID: string;
};

type ApiCreateAccountError = {
  error: {
    message: string;
  };
};

type ApiCreateAccountResponse = ApiCreateAccountSuccess | ApiCreateAccountError;

const CustomerCreation = (): React.ReactElement => {
  const [state, setState] = useState<State>({
    name: "",
    businessUrl: "",
    isSubmitting: false,
    refresh_url: "",
    stripeID: "",
  });

  const createAccount = async <T,>(createAccountInput: State): Promise<T> => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_URL + "/api/createAccount",
      {
        method: "POST",
        body: JSON.stringify({
          ...createAccountInput,
        }),
        // headers: {
        //   "Content-type": "application/json; charset=UTF-8",
        //   Authorization: `Bearer ${localStorage.getItem("auth-public-token")}`,
        // },
      }
    );

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data");
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

      const account = await createAccount<ApiCreateAccountResponse>(state);

      if ("error" in account) throw new Error(account.error.message);

      setState({
        name: "",
        businessUrl: "",
        isSubmitting: false,
        refresh_url: state.name.toLowerCase().replaceAll(" ", "-"),
        stripeID: account.stripeID,
      });
    } catch (error) {
      setState({
        name: "",
        businessUrl: "",
        isSubmitting: false,
        refresh_url: "",
        stripeID: "",
      });
      console.error("Error creating new account: ", error);
    }
  };

  const isSubmitDisabled = (): boolean => {
    if (!state.name || !state.businessUrl) return true;

    return false;
  };

  const closeCodeSnippet = (): void => {
    setState({
      name: "",
      businessUrl: "",
      isSubmitting: false,
      refresh_url: "",
      stripeID: "",
    });
  };

  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50"
      shadow="sm"
      style={{ padding: "12px 12px 12px 12px", width: "100%" }}
    >
      <h3>Account Creation</h3>
      <p>Create a new Instapaytient customer account.</p>
      <Spacer y={4} />
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <Input
          label="name"
          name={"name"}
          placeholder="Company Name"
          type="text"
          value={state.name}
          onChange={onUpdateFormData}
        />
        <Input
          label="url"
          name={"businessUrl"}
          placeholder="Company URL"
          type="url"
          value={state.businessUrl}
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
          Create Account
        </Button>
      </div>
      <Spacer y={4} />
      {!state.refresh_url ? null : (
        <>
          <p>
            ✅ Customer created successfully. Your script is ready. Please copy
            and inject it in the body of your website.
          </p>
          <Spacer y={2} />
          <div style={{ display: "flex", justifyContent: "end" }}>
            <Button isIconOnly onPress={closeCodeSnippet}>
              <svg
                fill="none"
                height="20px"
                viewBox="0 0 24 24"
                width="20px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6L18 18M18 6L6 18"
                  stroke="#FFF"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </Button>
          </div>
          <Spacer y={2} />
          <Snippet
            hideCopyButton={true}
            style={{ overflow: "scroll" }}
            symbol={""}
          >
            <pre>
              <Code
                style={{
                  whiteSpace: "pre-wrap",
                  overflowWrap: "break-word",
                  marginLeft: 0,
                }}
              >{`<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>`}</Code>
            </pre>
            <pre>
              <Code
                style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
              >{`<script>`}</Code>
            </pre>
            <pre>
              <Code
                style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
              >{`    $("#generate-dash-link-button").click(function (event) {`}</Code>
            </pre>
            <pre>
              <Code
                style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
              >{`        event.preventDefault();`}</Code>
            </pre>
            <pre>
              <Code
                style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
              >{`        $.ajax({`}</Code>
            </pre>
            <pre>
              <Code
                style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
              >{`            url: "https://apistripe.joymd.com/api/shopify/express/create-link",`}</Code>
            </pre>
            <pre>
              <Code
                style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
              >{`            type: 'POST',`}</Code>
            </pre>
            <pre>
              <Code
                style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
              >{`            dataType: 'json',`}</Code>
            </pre>
            <pre>
              <Code
                style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
              >{`            data: {`}</Code>
            </pre>
            <pre>
              <Code
                style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
              >{`                account: "${state.stripeID}",`}</Code>
            </pre>
            <pre>
              <Code
                style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
              >{`                refresh_url: "https://www.medaestheticsgroup.com/sign-up-for-pay-outs-${state.refresh_url}",`}</Code>
            </pre>
            <pre>
              <Code
                style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
              >{`                return_url: "https://www.medaestheticsgroup.com/sign-up-for-pay-outs-${state.refresh_url}",`}</Code>
            </pre>
            <pre>
              <Code
                style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
              >{`            },`}</Code>
            </pre>
            <pre>
              <Code
                style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
              >{`            success: function (response) {`}</Code>
            </pre>
            <pre>
              <Code
                style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
              >{`                const collection = document.getElementsByClassName("generate-link-text");`}</Code>
            </pre>
            <pre>
              <Code
                style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
              >
                {
                  '                collection[0].innerHTML = "Here is your link to: " + `<a href="${response.data.link}" target="_blank" > SIGN UP.</a>`;'
                }
              </Code>
            </pre>
            <pre>
              <Code
                style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
              >{`            }`}</Code>
            </pre>
            <pre>
              <Code
                style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
              >{`        });`}</Code>
            </pre>
            <pre>
              <Code
                style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
              >{`    });`}</Code>
            </pre>
            <pre>
              <Code
                style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
              >{`</script>`}</Code>
            </pre>
          </Snippet>
        </>
      )}
    </Card>
  );
};

export default CustomerCreation;
