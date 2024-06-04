
"use client";

import { Card, NextUIProvider } from '@nextui-org/react';
import { Toaster, resolveValue } from "react-hot-toast";

interface ProvidersProps {
  children: React.ReactNode;
};

const Providers = (props: ProvidersProps): React.ReactElement | any => {

  return (
    <NextUIProvider>
      <Toaster position="top-center">
        {(t) => (
          <Card
          isBlurred
          className="border-none bg-background/60 dark:bg-default-100/50"
          shadow="sm"
          style={{ opacity: t.visible ? 1 : 0, padding: "12px 12px 12px 12px" }}
          > 
            {resolveValue(t.message, t)}
          </Card>
        )}
      </Toaster>
      { props.children }
    </NextUIProvider>
  )
};

export default Providers;