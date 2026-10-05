import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Surface for a single piece of content. Compose `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, and `CardFooter`. `size="sm"` tightens the padding.',
      },
    },
  },
  args: { size: "default" },
  argTypes: {
    size: { control: "select", options: ["default", "sm"] },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Practice: Story = {
  render: (args) => (
    <Card {...args} className="max-w-xl">
      <CardHeader>
        <p className="text-sm font-medium text-primary">Focus practice</p>
        <CardTitle className="text-3xl">Kira Pomodoro</CardTitle>
        <CardDescription className="text-base leading-7">
          A calm timer for deliberate practice.
        </CardDescription>
        <CardAction>
          <Button size="sm" variant="outline">
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>Recorded focus time is validated on the server.</CardContent>
      <CardFooter>
        <Button size="sm">Start focus</Button>
      </CardFooter>
    </Card>
  ),
};
