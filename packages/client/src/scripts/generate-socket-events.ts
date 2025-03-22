// scripts/generate-socket-events.ts
import * as fs from "fs";
import * as path from "path";

interface OpenAPISpec {
  paths: {
    [key: string]: any;
  };
}

// Paths to your spec and output file.
const specPath = path.join(__dirname, "../openapi.json");
const outputPath = path.join(__dirname, "../sockets/events.types.generated.ts");

// Adjust this import path as needed—this is where your DTOs are defined.
const DTO_IMPORT_PATH = "../client";

function generateEventTypes() {
  const spec: OpenAPISpec = JSON.parse(fs.readFileSync(specPath, "utf8"));

  // Group events by namespace.
  interface GroupedEvents {
    client: { [event: string]: string };
    server: { [event: string]: string };
  }
  const grouped: { [namespace: string]: GroupedEvents } = {};

  // Iterate over all paths.
  for (const [route, methods] of Object.entries(spec.paths)) {
    // For each method in the path.
    for (const [method, details] of Object.entries(methods) as any) {
      const eventName: string | undefined = details["x-event"];
      if (!eventName) continue;

      // Get the namespace from x-namespace; if not provided, use "Default".
      const namespace: string = details["x-namespace"] || "Default";
      if (!grouped[namespace]) {
        grouped[namespace] = { client: {}, server: {} };
      }

      // For POST, assume it's a client-to-server event.
      if (method.toLowerCase() === "post") {
        const ref =
          details.requestBody?.content?.["application/json"]?.schema?.$ref;
        if (ref) {
          const typeName = ref.split("/").pop()!;
          grouped[namespace].client[eventName] = typeName;
        }
      }
      // For GET, assume it's a server-to-client event.
      else if (method.toLowerCase() === "get") {
        const ref =
          details.responses?.["200"]?.content?.["application/json"]?.schema
            ?.$ref;
        if (ref) {
          const typeName = ref.split("/").pop()!;
          grouped[namespace].server[eventName] = typeName;
        }
      }
    }
  }

  // Collect unique type names for the import statement.
  const typeNames = new Set<string>();
  for (const ns of Object.values(grouped)) {
    Object.values(ns.client).forEach((t) => typeNames.add(t));
    Object.values(ns.server).forEach((t) => typeNames.add(t));
  }
  const importLine = `import type { ${Array.from(typeNames).join(
    ", "
  )} } from "${DTO_IMPORT_PATH}";`;

  // Generate interfaces for each namespace.
  let namespaceInterfaces = "";
  const clientInterfaceNames: string[] = [];
  const serverInterfaceNames: string[] = [];

  const namespaces = Object.keys(grouped).sort();
  for (const ns of namespaces) {
    // Use the namespace value as a prefix. For example, if ns is "HealthGateway" then:
    // - HealthGatewayWebSocketEventsClientServer
    // - HealthGatewayWebSocketEventsServerClient
    const clientInterfaceName = `${ns}WebSocketEventsClientServer`;
    const serverInterfaceName = `${ns}WebSocketEventsServerClient`;
    clientInterfaceNames.push(clientInterfaceName);
    serverInterfaceNames.push(serverInterfaceName);

    const clientEvents = Object.entries(grouped[ns]?.client!)
      .map(([event, type]) => `  "${event}": (payload: ${type}) => void;`)
      .join("\n");
    const serverEvents = Object.entries(grouped[ns]?.server!)
      .map(([event, type]) => `  "${event}": (payload: ${type}) => void;`)
      .join("\n");

    namespaceInterfaces += `
export interface ${clientInterfaceName} {
${clientEvents}
}

export interface ${serverInterfaceName} {
${serverEvents}
}
`;
  }

  // Build union types for all namespaces.
  const unionClient =
    clientInterfaceNames.length > 0 ? clientInterfaceNames.join(" | ") : "{}";
  const unionServer =
    serverInterfaceNames.length > 0 ? serverInterfaceNames.join(" | ") : "{}";

  // Build the final output.
  const output = `
/**
 * This file is auto-generated.
 */
${importLine}

${namespaceInterfaces}

export type WebSocketEventsClientServer = ${unionClient};
export type WebSocketEventsServerClient = ${unionServer};
`;

  fs.writeFileSync(outputPath, output.trim(), "utf8");
  console.log("Generated socket events mapping:", outputPath);
}

generateEventTypes();
