import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

const meta = {
  title: "UI/Sonner",
  component: Toaster,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Toast notifications. Mount `Toaster` once near the app root, then call `toast`, `toast.success`, `toast.info`, `toast.warning`, or `toast.error`. The Storybook preview already mounts one toaster.",
      },
    },
  },
} satisfies Meta<typeof Toaster>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Messages: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="secondary"
        onClick={() => toast.success("25-minute deep block recorded")}
      >
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.info("Break starts now")}>
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning("Three intervals without a break")}
      >
        Warning
      </Button>
      <Button
        variant="destructive"
        onClick={() => toast.error("Could not sync this session")}
      >
        Error
      </Button>
    </div>
  ),
};
