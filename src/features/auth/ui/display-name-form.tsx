"use client";

import { useForm } from "@tanstack/react-form";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  displayNameUpdateMessage,
  normalizeDisplayNameUpdate,
} from "../domain/display-name";

const displayNameSchema = z.string().superRefine((value, context) => {
  if (normalizeDisplayNameUpdate(value)) {
    return;
  }

  context.addIssue({
    code: "custom",
    message: displayNameUpdateMessage,
  });
});

type SaveResult = { ok: true } | { ok: false; message: string };

type DisplayNameFormProps = {
  savedName: string;
  onSave: (displayName: string) => Promise<SaveResult>;
};

export function DisplayNameForm({ savedName, onSave }: DisplayNameFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const savedNameRef = useRef(savedName);

  const form = useForm({
    defaultValues: { displayName: savedName },
    onSubmitInvalid: () => {
      inputRef.current?.focus();
    },
    onSubmit: async ({ value }) => {
      const displayName = normalizeDisplayNameUpdate(value.displayName);

      if (!displayName) {
        return;
      }

      setPending(true);
      setServerMessage(null);
      setSavedMessage(null);

      const result = await onSave(displayName);
      setPending(false);

      if (!result.ok) {
        setServerMessage(result.message);
        inputRef.current?.focus();
        return;
      }

      setSavedMessage("Display name saved.");
    },
  });

  useEffect(() => {
    if (savedNameRef.current === savedName) {
      return;
    }

    savedNameRef.current = savedName;
    form.setFieldValue("displayName", savedName);
  }, [form, savedName]);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field
        name="displayName"
        validators={{
          onSubmit: ({ value }) => {
            const parsed = displayNameSchema.safeParse(value);

            if (!parsed.success) {
              return (
                parsed.error.issues[0]?.message ?? displayNameUpdateMessage
              );
            }

            return undefined;
          },
        }}
      >
        {(field) => {
          const validationMessage = field.state.meta.errors.find(
            (error): error is string =>
              typeof error === "string" && error.length > 0,
          );
          const message = validationMessage ?? serverMessage;
          const describedBy = [
            "display-name-hint",
            message ? "display-name-error" : null,
            savedMessage ? "display-name-status" : null,
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <Field>
              <Label htmlFor="display-name">Display name</Label>
              <Input
                ref={inputRef}
                id="display-name"
                name={field.name}
                className="h-11"
                autoComplete="nickname"
                value={field.state.value}
                disabled={pending}
                aria-invalid={message ? true : undefined}
                aria-describedby={describedBy}
                onBlur={field.handleBlur}
                onChange={(event) => {
                  field.handleChange(event.target.value);
                  setSavedMessage(null);
                }}
              />
              <FieldDescription id="display-name-hint">
                Use 1–80 characters. This public name is separate from your
                email address.
              </FieldDescription>
              {message ? (
                <FieldError id="display-name-error">{message}</FieldError>
              ) : null}
            </Field>
          );
        }}
      </form.Field>
      {savedMessage ? (
        <p
          id="display-name-status"
          role="status"
          className="text-sm text-success"
        >
          {savedMessage}
        </p>
      ) : null}
      <p className="text-sm text-muted-foreground">
        Saved name:{" "}
        <span className="font-medium text-foreground">{savedName}</span>
      </p>
      <Button type="submit" size="lg" className="w-full" loading={pending}>
        {pending ? "Saving name…" : "Save name"}
      </Button>
    </form>
  );
}
