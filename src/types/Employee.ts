export type Employee = {
  PK: string;
  SK: string;
  name: string;
  take: number;
  customerID: string;
};

export type EmployeeHttpResponse = {
  employees: Employee[];
};