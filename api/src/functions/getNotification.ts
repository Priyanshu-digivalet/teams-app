import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import {
  OnBehalfOfCredentialAuthConfig,
  OnBehalfOfUserCredential,
} from "@microsoft/teamsfx";
import config from "../config";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import { Client } from "@microsoft/microsoft-graph-client";

export async function sendActivityNotification(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("Processing notification request.");

  // Initialize response.
  const body = Object();

  // Put an echo into response body.
  body.receivedHTTPRequestBody = (await req.text()) || "";

  const accessToken: string = req.headers
    .get("Authorization")
    ?.replace("Bearer ", "")
    .trim();
  if (!accessToken) {
    return {
      status: 400,
      body: JSON.stringify({
        error: "No access token found in request header.",
      }),
    };
  }

  const oboAuthConfig: OnBehalfOfCredentialAuthConfig = {
    authorityHost: config.authorityHost,
    clientId: config.clientId,
    tenantId: config.tenantId,
    clientSecret: config.clientSecret,
  };

  try {
    const oboCredential = new OnBehalfOfUserCredential(
      accessToken,
      oboAuthConfig
    );

    const authProvider = new TokenCredentialAuthenticationProvider(
      oboCredential,
      {
        scopes: ["https://graph.microsoft.com/.default"],
      }
    );

    const graphClient = Client.initWithMiddleware({ authProvider });

    // 📌 Send Activity Feed Notification
    const sendActivityNotification = {
      topic: {
        source: "entityUrl",
        value: "https://graph.microsoft.com/v1.0/teams/{teamId}",
      },
      activityType: "systemDefault",
      previewText: {
        content: "Take a break",
      },
      recipient: {
        "@odata.type": "microsoft.graph.aadUserNotificationRecipient",
        userId: "569363e2-4e49-4661-87f2-16f245c5d66a",
      },
      templateParameters: [
        {
          name: "systemDefaultText",
          value: "You need to take a short break",
        },
      ],
    };

    await graphClient
      .api("/sendActivityNotification")
      .post(sendActivityNotification);

    return {
      status: 200,
      body: JSON.stringify({ success: true, message: "Notification sent!" }),
    };
  } catch (e) {
    context.error(e);
    return {
      status: 500,
      body: JSON.stringify({ error: e }),
    };
  }
}

// Register function
app.http("sendActivityNotification", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: sendActivityNotification,
});
