import {
  EventBridgeClient,
  ListRulesCommand,
  ListRulesCommandOutput,
} from "@aws-sdk/client-eventbridge";
import {
  SchedulerClient,
  ListSchedulesCommand,
  ListSchedulesCommandOutput,
  GetScheduleCommand,
  GetScheduleCommandOutput,
} from "@aws-sdk/client-scheduler";
import type { Scheduler } from "@/types/Scheduler";

const eventBridgeClient = new EventBridgeClient({
  region: process.env.AWS_PROD_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_PROD_ACCESS_KEY || "",
    secretAccessKey: process.env.AWS_PROD_SECRET_KEY || "",
  },
});

const schedulerClient = new SchedulerClient({
  region: process.env.AWS_PROD_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_PROD_ACCESS_KEY || "",
    secretAccessKey: process.env.AWS_PROD_SECRET_KEY || "",
  },
});

const listSchedulers = async (): Promise<Scheduler[]> => {
  try {
    console.log("🔍 Fetching schedulers from EventBridge Scheduler...");
    console.log("🌍 AWS Region:", process.env.AWS_PROD_REGION);

    // Try EventBridge Scheduler first (newer service)
    console.log("📅 Trying EventBridge Scheduler...");
    const schedulerCommand = new ListSchedulesCommand({
      GroupName: process.env.AWS_SCHEDULER_GROUP_NAME || "default",
    });

    const schedulerResponse: ListSchedulesCommandOutput =
      await schedulerClient.send(schedulerCommand);

    console.log(
      "📊 Raw EventBridge Scheduler response:",
      JSON.stringify(schedulerResponse, null, 2)
    );
    console.log(
      "📋 Number of schedules found:",
      schedulerResponse.Schedules?.length || 0
    );

    // Get detailed information for each schedule
    const schedulers: Scheduler[] = [];

    if (schedulerResponse.Schedules) {
      for (const schedule of schedulerResponse.Schedules) {
        try {
          console.log(`🔍 Fetching details for schedule: ${schedule.Name}`);
          const getScheduleCommand = new GetScheduleCommand({
            Name: schedule.Name!,
            GroupName: schedule.GroupName || "default",
          });

          const scheduleDetails: GetScheduleCommandOutput =
            await schedulerClient.send(getScheduleCommand);

          schedulers.push({
            Name: scheduleDetails.Name || "",
            Arn: scheduleDetails.Arn || "",
            State: scheduleDetails.State || "",
            Description: scheduleDetails.Description,
            ScheduleExpression: scheduleDetails.ScheduleExpression,
            Target: scheduleDetails.Target,
            FlexibleTimeWindow: scheduleDetails.FlexibleTimeWindow,
            ScheduleExpressionTimezone:
              scheduleDetails.ScheduleExpressionTimezone,
            StartDate: scheduleDetails.StartDate,
            EndDate: scheduleDetails.EndDate,
            GroupName: scheduleDetails.GroupName,
            KmsKeyArn: scheduleDetails.KmsKeyArn,
            CreationDate: scheduleDetails.CreationDate,
            LastModificationDate: scheduleDetails.LastModificationDate,
          });
        } catch (error) {
          console.error(
            `Error fetching details for schedule ${schedule.Name}:`,
            error
          );
          // Fallback to basic info if detailed fetch fails
          schedulers.push({
            Name: schedule.Name || "",
            Arn: schedule.Arn || "",
            State: schedule.State || "",
            Description: undefined,
            ScheduleExpression: undefined,
            Target: undefined,
            FlexibleTimeWindow: undefined,
            ScheduleExpressionTimezone: undefined,
            StartDate: undefined,
            EndDate: undefined,
            GroupName: schedule.GroupName,
            KmsKeyArn: undefined,
            CreationDate: undefined,
            LastModificationDate: undefined,
          });
        }
      }
    }

    console.log(
      "🎯 Processed schedulers:",
      JSON.stringify(schedulers, null, 2)
    );

    // If no schedules found, try EventBridge Rules as fallback
    if (schedulers.length === 0) {
      console.log(
        "📋 No schedules found, trying EventBridge Rules as fallback..."
      );

      const eventBusName = process.env.AWS_EVENTBRIDGE_BUS_NAME || "default";

      console.log("📋 Trying EventBus Name:", eventBusName);

      const command = new ListRulesCommand({
        EventBusName: eventBusName,
      });

      const response: ListRulesCommandOutput =
        await eventBridgeClient.send(command);

      console.log(
        "📊 Raw EventBridge Rules response:",
        JSON.stringify(response, null, 2)
      );
      console.log("📋 Number of rules found:", response.Rules?.length || 0);

      const ruleSchedulers: Scheduler[] =
        response.Rules?.map((rule) => ({
          Name: rule.Name || "",
          Arn: rule.Arn || "",
          State: rule.State || "",
          Description: rule.Description,
          ScheduleExpression: rule.ScheduleExpression,
        })) || [];

      schedulers.push(...ruleSchedulers);
    }

    // Sort by name for consistent ordering
    schedulers.sort((a, b) => (a.Name > b.Name ? 1 : -1));

    return schedulers;
  } catch (error) {
    console.error("Error fetching schedulers:", error);

    return [];
  }
};

export default listSchedulers;
