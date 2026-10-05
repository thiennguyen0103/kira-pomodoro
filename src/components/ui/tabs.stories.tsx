import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Segmented switch between panels. `TabsList` `variant` is `default` (filled) or `line` (underline). Each `TabsTrigger` `value` matches a `TabsContent` panel.",
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Intervals: Story = {
  render: () => (
    <Tabs defaultValue="focus" className="max-w-lg">
      <TabsList>
        <TabsTrigger value="focus">Focus (25m)</TabsTrigger>
        <TabsTrigger value="short">Short break (5m)</TabsTrigger>
        <TabsTrigger value="long">Long break (15m)</TabsTrigger>
      </TabsList>
      <TabsContent value="focus">One uninterrupted focus block.</TabsContent>
      <TabsContent value="short">A short rest between blocks.</TabsContent>
      <TabsContent value="long">
        A longer rest after several blocks.
      </TabsContent>
    </Tabs>
  ),
};

export const Line: Story = {
  render: () => (
    <Tabs defaultValue="today" className="max-w-lg">
      <TabsList variant="line">
        <TabsTrigger value="today">Today</TabsTrigger>
        <TabsTrigger value="week">This week</TabsTrigger>
      </TabsList>
      <TabsContent value="today">2h 15m recorded today.</TabsContent>
      <TabsContent value="week">11h 40m recorded this week.</TabsContent>
    </Tabs>
  ),
};
