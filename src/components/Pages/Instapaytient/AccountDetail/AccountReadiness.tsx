import React from "react";
import { Icon } from "@iconify/react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import Image from "next/image";

interface AccountReadinessProps {
  affirm: {
    enabled: boolean;
  };
  readiness: {
    affirmEnabled: boolean;
    bankAccountLinked: boolean;
    stripeLinked: boolean;
  };
}

export const AccountReadiness: React.FC<AccountReadinessProps> = ({ affirm, readiness }) => {
  const allReady = readiness.affirmEnabled && readiness.bankAccountLinked && readiness.stripeLinked;

   return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      {/* Affirm Capability Card */}
      <Card className="md:col-span-1">
        <CardBody className="flex flex-col items-center justify-center py-6">
          <div className={`flex h-16 w-16 items-center justify-center rounded-full ${affirm.enabled ? 'bg-success-100 dark:bg-success-900/30' : 'bg-danger-100 dark:bg-danger-900/30'} mb-3`}>
            <Icon 
              icon={affirm.enabled ? "lucide:check-circle" : "lucide:alert-circle"} 
              className={`text-3xl ${affirm.enabled ? 'text-success-500 dark:text-success-400' : 'text-danger-500 dark:text-danger-400'}`} 
            />
          </div>
          <h3 className="text-lg font-medium text-center"> Affirm Capability</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
            {affirm.enabled ? "Enabled" : "Disabled"}
          </p>
          <Chip
            size="sm"
            color={affirm.enabled ? "success" : "danger"}
            variant="flat"
            className="mt-3"
          >
            {affirm.enabled ? "Active" : "Inactive"}
          </Chip>
        </CardBody>
      </Card>
      
      {/* Ready To Go Live Card */}
      <Card className="flex-row md:col-span-2">
         <CardBody className="flex flex-col items-center justify-center py-6">
           <div className={`flex h-16 w-16 items-center justify-center rounded-full ${affirm.enabled ? 'bg-success-100 dark:bg-success-900/30' : 'bg-danger-100 dark:bg-danger-900/30'} mb-3`}>
             <Icon
               icon={affirm.enabled ? "lucide:check-circle" : "lucide:alert-circle"}
               className={`text-3xl ${affirm.enabled ? 'text-success-500 dark:text-success-400' : 'text-danger-500 dark:text-danger-400'}`}
             />
           </div>
           <h3 className="text-lg font-medium text-center">Ready To Go Live</h3>
           <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
             {affirm.enabled ? "Enabled" : "Disabled"}
           </p>
           <Chip
             size="sm"
             color={affirm.enabled ? "success" : "danger"}
             variant="flat"
             className="mt-3"
           >
             {affirm.enabled ? "Active" : "Inactive"}
           </Chip>
         </CardBody>
        {/* <CardHeader className="flex flex-row items-center">
          <h3 className="text-lg font-medium">Ready To Go Live</h3>
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ml-3 ${allReady ? 'bg-success-100 dark:bg-success-900/30' : 'bg-danger-100 dark:bg-danger-900/30'}`}>
            <Icon 
              icon={allReady ? "lucide:check-circle" : "lucide:alert-circle"} 
              className={`text-xl ${allReady ? 'text-success-500 dark:text-success-400' : 'text-danger-500 dark:text-danger-400'}`} 
            />
          </div>
        </CardHeader> */}
        <CardBody className="flex flex-col justify-center px-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-6 w-6 items-center justify-center rounded-full ${readiness.affirmEnabled ? 'bg-success-100 dark:bg-success-900/30' : 'bg-danger-100 dark:bg-danger-900/30'}`}>
                <Icon 
                  icon={readiness.affirmEnabled ? "lucide:check" : "lucide:alert-circle"} 
                  className={`text-sm ${readiness.affirmEnabled ? 'text-success-500 dark:text-success-400' : 'text-danger-500 dark:text-danger-400'}`} 
                />
              </div>
              <span className="text-gray-700 dark:text-gray-300">Affirm capability payments enabled</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`flex h-6 w-6 items-center justify-center rounded-full ${readiness.bankAccountLinked ? 'bg-success-100 dark:bg-success-900/30' : 'bg-danger-100 dark:bg-danger-900/30'}`}>
                <Icon 
                  icon={readiness.bankAccountLinked ? "lucide:check" : "lucide:alert-circle"} 
                  className={`text-sm ${readiness.bankAccountLinked ? 'text-success-500 dark:text-success-400' : 'text-danger-500 dark:text-danger-400'}`} 
                />
              </div>
              <span className="text-gray-700 dark:text-gray-300">Bank account linked to Stripe</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`flex h-6 w-6 items-center justify-center rounded-full ${readiness.stripeLinked ? 'bg-success-100 dark:bg-success-900/30' : 'bg-danger-100 dark:bg-danger-900/30'}`}>
                <Icon 
                  icon={readiness.stripeLinked ? "lucide:check" : "lucide:alert-circle"} 
                  className={`text-sm ${readiness.stripeLinked ? 'text-success-500 dark:text-success-400' : 'text-danger-500 dark:text-danger-400'}`} 
                />
              </div>
              <span className="text-gray-700 dark:text-gray-300">Stripe linked to Instapatient</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};