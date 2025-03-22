import { api, PaginatedClientListResponse } from "@repo/client";
import { useEffect, useState } from "react";

export default function ClientsPage() {
  const [] = useState<PaginatedClientListResponse>();

  // const getClients = async () => {
  // import { socketApi } from "@repo/client";

  //   const chat = socketApi.chat.socket.connect();
  //   socketApi.chat.socket.on("server:pong", {});

  //   const response = await api.users.userControllerGet();
  //   const data = await response.data;
  //   console.log(data);
  // };

  const getClients = async () => {
    api.users.userControllerGet();
    const response = await api.users.userControllerCreate();
    const data = await response.data;
    console.log(data);
  };

  useEffect(() => {
    console.log("ClientsPage");
    getClients();
  }, []);

  return <div>Clients</div>;
}
