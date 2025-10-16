export type Scheduler = {
  Name: string;
  Arn: string;
  State: string;
  Description?: string;
  ScheduleExpression?: string;
  Target?: any;
  FlexibleTimeWindow?: any;
  ScheduleExpressionTimezone?: string;
  StartDate?: Date;
  EndDate?: Date;
  GroupName?: string;
  KmsKeyArn?: string;
  CreationDate?: Date;
  LastModificationDate?: Date;
};

export type SchedulerHttpResponse = {
  schedulers: Scheduler[];
};


