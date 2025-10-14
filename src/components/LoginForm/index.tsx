"use client";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";
import { Spacer } from "@heroui/spacer";
import { Icon } from "@iconify/react";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import requestMagicLink from "@/utils/requestMagicLink";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// Define type for magic link login
type MagicLinkLoginData = {
  emailAddress: string;
};


const LoginForm = (): React.ReactElement => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isRememberedEmail, setIsRememberedEmail] = useState<boolean>(false);
  const router = useRouter();
  
  // Local storage for remembering email
  const [rememberedEmail, setRememberedEmail] = useLocalStorage<string>("rememberedEmail", "");
  
  // Simple email-only schema for magic link
  const magicLinkSchema = z.object({
    emailAddress: z
      .string()
      .min(1, "Email is required")
      .pipe(z.email("Please enter a valid email address")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<MagicLinkLoginData>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      emailAddress: "",
    }
  });

  // Check for remembered email on component mount
  useEffect(() => {
    if (rememberedEmail) {
      setIsRememberedEmail(true);
      setValue("emailAddress", rememberedEmail);
    }
  }, [rememberedEmail, setValue]);

  const onSubmitFormData = async (data: MagicLinkLoginData): Promise<void> => {
    try {
      setIsSubmitting(true);
      setMessage("");

      // Magic link login - send magic link to email
      await requestMagicLink({ emailAddress: data.emailAddress });
      
      // Add a 2-second delay to ensure users see the loading state
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success toast
      addToast({
        title: "Magic Link Sent",
        description: `We've sent a login link to ${data.emailAddress}. Please check your inbox.`,
        icon: <Icon icon="lucide:mail" width={24} />,
        severity: "success",
        timeout: 5000,
      });
      
      // Remember the email for future logins
      setRememberedEmail(data.emailAddress);
      setIsRememberedEmail(true);
      
      reset();
    } catch (error: any) {
      const errorMessage = error.message || "Failed to send magic link. Please try again.";
      
      // Show error toast
      addToast({
        title: "Error",
        description: errorMessage,
        icon: <Icon icon="lucide:alert-circle" width={24} />,
        severity: "danger",
        timeout: 5000,
      });
      
      console.error("Error:", errorMessage);
      console.error("Error sending magic link: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled = (): boolean => {
    return isSubmitting || Object.keys(errors).length > 0;
  };

  // Handle changing email from remembered state
  const handleChangeEmail = (): void => {
    setIsRememberedEmail(false);
    setValue("emailAddress", "");
  }; 

  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-background/60 p-8"
      shadow="sm"
      style={{ width: "100%", maxWidth: 448 }}
    >
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Sign In</h1>
        <p className="text-foreground-500">
          {isRememberedEmail 
            ? "Continue with your email" 
            : "Enter your email to receive a magic link"}
        </p>
      </div>

      <Spacer y={4} />

      <form onSubmit={handleSubmit(onSubmitFormData)}>
        <div className="flex w-full flex-col gap-4">
          {isRememberedEmail ? (
            <div className="border border-default-200 rounded-medium p-4 flex items-center justify-between bg-content1">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Icon 
                    icon="lucide:mail" 
                    className="text-primary text-lg"
                  />
                </div>
                <span className="font-medium">{rememberedEmail}</span>
              </div>
              <Button 
                size="sm" 
                variant="light" 
                onPress={handleChangeEmail}
                className="text-default-500"
              >
                Change
              </Button>
            </div>
          ) : (
            <Input 
              type="email" 
              label="Email address" 
              placeholder="Enter your email" 
              {...register("emailAddress")}
              isRequired
              isInvalid={!!errors.emailAddress}
              errorMessage={errors.emailAddress?.message}
              startContent={
                <Icon 
                  icon="lucide:mail" 
                  className="text-default-400 text-lg pointer-events-none"
                />
              }
            />
          )}
        </div>
        
        <Spacer y={6} />
        
        <div>
          <Button 
            type="submit"
            color="primary" 
            variant="shadow" 
            isDisabled={isSubmitDisabled()}
            isLoading={isSubmitting}
            fullWidth
            startContent={!isSubmitting && <Icon icon="lucide:arrow-right" />}
          >
            {isSubmitting ? 'Sending Login Link...' : 'Login'}
          </Button>
        </div>

        <Spacer y={4} />

        <div className="text-center text-small text-foreground-500">
          <p>
            Don&apos;t have an account?{" "}
            <a href="#" className="text-primary font-medium hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </form>
      
      {message && (
        <>
          <Spacer y={4} />
          <div className={`text-small ${message.includes('Failed') || message.includes('Error') ? 'text-danger' : 'text-success'}`}>
            {message}
          </div>
        </>
      )}
    </Card>
  );
};

export default LoginForm;