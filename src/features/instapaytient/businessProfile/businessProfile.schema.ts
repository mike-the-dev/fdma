// UI Form shape
export type BusinessProfileFormData = {
  mccCode: string;
};

// Validators type for TanStack Form
export type BusinessProfileValidators = {
  mccCode: {
    onChange: ({ value }: { value: string }) => string | undefined;
  };
};

