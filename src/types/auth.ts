// Super Admin Authentication Types

// Request payload
export interface SuperAdminLoginRequest {
  emailAddress: string;
  password: string;
}

// JWT Tokens
export interface AuthTokens {
  access: string;
  refresh: string;
}

// Super Admin User
export interface SuperAdminUser {
  id: string;
  emailAddress: string;
  name: string;
  role: "SUPERADMIN";
}

// Response from login endpoint
export interface SuperAdminLoginResponse {
  authorization: {
    user: SuperAdminUser;
    tokens: AuthTokens;
  };
}

