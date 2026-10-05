import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CoffeeIcon, PauseIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Action control for focus, breaks, and secondary tasks. `variant` sets the intent color. `size` sets the height, including icon-only sizes. `loading` prepends a spinner and disables the button.",
      },
    },
  },
  args: {
    children: "Start focus",
    variant: "default",
    size: "default",
    loading: false,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "break",
        "outline",
        "secondary",
        "ghost",
        "destructive",
        "link",
      ],
    },
    size: {
      control: "select",
      options: [
        "xs",
        "sm",
        "default",
        "lg",
        "icon",
        "icon-xs",
        "icon-sm",
        "icon-lg",
      ],
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  parameters: {
    docs: {
      description: {
        story: "Default focus action, filled with the teal primary color.",
      },
    },
  },
};

export const Break: Story = {
  args: {
    variant: "break",
    children: (
      <>
        <CoffeeIcon />
        Start break
      </>
    ),
  },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Skip interval" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "Adjust goal" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Dismiss" },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: (
      <>
        <Trash2Icon />
        Reset history
      </>
    ),
  },
};

export const Link: Story = {
  args: { variant: "link", children: "View session notes" },
};

export const Loading: Story = {
  args: { loading: true, children: "Preparing" },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Unavailable" },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-3">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" variant="outline" aria-label="Pause current session">
        <PauseIcon />
      </Button>
    </div>
  ),
};
