import { NextUIProvider } from "@nextui-org/react";

export default function NextUiShell({ children }) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
