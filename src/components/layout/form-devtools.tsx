"use client";

import { TanStackDevtools } from "@tanstack/react-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";

const plugins = [formDevtoolsPlugin()];

export function FormDevtools() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <TanStackDevtools
      config={{ position: "bottom-left", triggerMode: "fixed" }}
      plugins={plugins}
    />
  );
}
