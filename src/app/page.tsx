import { Card, CardDescription, CardHeader } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-16">
      <Card>
        <CardHeader>
          <p className="text-sm font-medium text-primary">Focus practice</p>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-card-foreground sm:text-4xl">
            Kira Pomodoro
          </h1>
          <CardDescription className="max-w-prose text-base leading-7">
            A calm timer for deliberate practice. You keep the session on
            screen, and the server checks recorded focus time before it counts.
          </CardDescription>
        </CardHeader>
      </Card>
    </main>
  );
}
