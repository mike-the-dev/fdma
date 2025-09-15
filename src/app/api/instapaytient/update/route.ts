import authorizeRequest from "@/utils/authorizeRequest";
import updateItem from "@/utils/updateItem";
import { AccountInstapaytient } from "@/types/AccountInstapaytient";

type UpdateRequestData = {
  PK: string;
  SK: string;
  updates: Partial<AccountInstapaytient>;
};

export async function POST(request: Request, response: Response) {
  try {
    const body: UpdateRequestData = await request.json();

    // Validate required fields
    if (!body.PK || !body.SK) {
      return Response.json({
        success: false,
        error: {
          message: "PK and SK are required for updating an account"
        }
      }, { status: 400 });
    }

    await authorizeRequest(request.headers.get("authorization")?.split("Bearer ")[1].trim() || "");

    // Add _lastUpdated_ timestamp to track when the account was last modified
    const updatesWithTimestamp = {
      ...body.updates,
      _lastUpdated_: new Date().toISOString()
    };

    // Use the generic updateItem function
    await updateItem<AccountInstapaytient>(
      { PK: body.PK, SK: body.SK },
      updatesWithTimestamp
    );

    return Response.json({ 
      success: true,
      message: "Account updated successfully",
      data: {
        PK: body.PK,
        SK: body.SK,
        updatedFields: Object.keys(body.updates)
      }
    });
  } catch (error: any) {
    console.error("Error updating Instapaytient account: ", error);
    return Response.json({
      success: false,
      error: {
        message: error.message || "Failed to update account"
      }
    }, { status: 500 });
  }
}
