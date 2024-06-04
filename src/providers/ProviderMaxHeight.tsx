'use client';

import useWindowSize from "../utils/useWindowDimensions";

interface ProviderMaxHeightProps {
  children: React.ReactNode;
};

const ProviderMaxHeight: React.FC<ProviderMaxHeightProps> = (props): React.ReactElement => {
  return (
    <div>
      { props.children }   
    </div>
  );
};

export default ProviderMaxHeight;