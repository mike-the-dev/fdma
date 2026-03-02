export interface UpdateAccountStatusRequest {
  accountId: string;
  status: {
    isActive: boolean;
    code: string;
    message: string;
  };
}

export interface UpdateAccountStatusResponse {
  success: boolean;
  message: string;
  data: {
    accountId: string;
    status: {
      isActive: boolean;
      code: string;
      message: string;
      updatedAt: string;
    };
  };
}
