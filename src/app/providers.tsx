"use client";

import { NextUIProvider } from '@nextui-org/react';

interface ProvidersProps {
  children: React.ReactNode;
};

const Providers = (props: ProvidersProps): React.ReactElement => {
  return (
    <NextUIProvider>
      { props.children }
    </NextUIProvider>
  )
};

export default Providers;