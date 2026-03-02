export type AccountUserRole = "Administrator" | "Developer" | "Marketing";

export type AccountUserCreationFormData = {
  emailAddress: string;
  password: string;
  firstName: string;
  lastName: string;
  role: AccountUserRole | "";
};

export type AccountUserCreationValidators = {
  emailAddress: {
    onChange: ({ value }: { value: string }) => string | undefined;
  };
  password: {
    onChange: ({ value }: { value: string }) => string | undefined;
  };
  firstName: {
    onChange: ({ value }: { value: string }) => string | undefined;
  };
  lastName: {
    onChange: ({ value }: { value: string }) => string | undefined;
  };
  role: {
    onChange: ({ value }: { value: string }) => string | undefined;
  };
};

export interface CreateAccountUserRequest {
  accountID: string;
  emailAddress: string;
  password: string;
  firstName: string;
  lastName: string;
  role: AccountUserRole;
}

export interface AccountUserResponse {
  id: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  role: AccountUserRole;
  account: {
    id: string;
    company: string;
    payout: unknown | null;
  };
}

export interface CreateAccountUserResponse {
  authorization: {
    user: AccountUserResponse;
    tokens: {
      access: string;
      refresh: string;
    };
  };
}

export interface ListAccountUsersQuery {
  accountId: string;
}

export interface AccountUserListItem {
  id: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  role: AccountUserRole;
  createdAt: string;
  lastUpdated: string;
}

export type ListAccountUsersResponse = AccountUserListItem[];

export interface DeleteAccountUserQuery {
  accountId: string;
  userId: string;
}

export interface DeleteAccountUserResponse {
  success: boolean;
  message: string;
}
