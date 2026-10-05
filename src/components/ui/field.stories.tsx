import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AlertCircleIcon } from "lucide-react";

import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const meta = {
  title: "UI/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Vertical stack for a label, control, and helper text. `FieldDescription` explains the input. `FieldError` announces a validation message and should sit under an `aria-invalid` control.",
      },
    },
  },
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithDescription: Story = {
  render: () => (
    <Field className="max-w-md">
      <Label htmlFor="skill-name">Skill name</Label>
      <Input id="skill-name" defaultValue="Programming" />
      <FieldDescription>
        Enter a skill or domain you wish to practice.
      </FieldDescription>
    </Field>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field className="max-w-md">
      <Label htmlFor="skill-error" className="text-destructive">
        Skill name
      </Label>
      <Input
        id="skill-error"
        aria-invalid="true"
        placeholder="Skill name required"
      />
      <FieldError>
        <AlertCircleIcon className="size-3.5" />
        Skill title cannot be blank.
      </FieldError>
    </Field>
  ),
};
