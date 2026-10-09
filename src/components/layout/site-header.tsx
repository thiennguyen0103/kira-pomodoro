"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { displayNameInitials } from "@/features/auth/domain/display-name";
import { clearPrivateClientState } from "@/features/auth/ui/account-cache";
import {
  readAccount,
  requestSignOut,
  sessionQueryKey,
  type AccountUser,
} from "@/features/auth/ui/session-client";
import { cn } from "cn";

const links = [
  { href: "/", label: "Practice" },
  { href: "/skills", label: "Skills" },
  { href: "/history", label: "History" },
  { href: "/ranking", label: "Ranking" },
] as const;

function avatarSource(image: string | null): string | undefined {
  if (!image) {
    return undefined;
  }

  try {
    const url = new URL(image);

    if (url.protocol === "https:" || url.protocol === "http:") {
      return image;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function AccountMenu({ name, image }: { name: string; image: string | null }) {
  const queryClient = useQueryClient();
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const source = avatarSource(image);

  function showMenu() {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }

    setOpen(true);
  }

  function hideMenu() {
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
    }, 140);
  }

  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) {
        window.clearTimeout(closeTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function signOut() {
    setSigningOut(true);
    setSignOutError(null);
    const result = await requestSignOut();
    setSigningOut(false);

    if (!result.ok) {
      setSignOutError(result.message);
      setOpen(true);
      return;
    }

    clearPrivateClientState(queryClient);
    queryClient.setQueryData<AccountUser | null>(sessionQueryKey, null);
    setOpen(false);
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={showMenu}
      onMouseLeave={hideMenu}
      onFocus={showMenu}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex h-10 max-w-48 items-center gap-2 rounded-full pr-1 text-sm font-medium text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        onClick={showMenu}
      >
        <span className="truncate">{name}</span>
        <Avatar>
          {source ? <AvatarImage src={source} alt="" /> : null}
          <AvatarFallback>{displayNameInitials(name)}</AvatarFallback>
        </Avatar>
      </button>
      {open ? (
        <div className="absolute top-full right-0 z-50 pt-2">
          <div
            role="menu"
            aria-label="Account"
            className="w-44 rounded-2xl border border-border bg-popover p-1 text-popover-foreground shadow-dropdown"
          >
            <Link
              href="/sign-in?profile=1"
              role="menuitem"
              className="flex min-h-11 items-center rounded-xl px-3 text-sm font-medium hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              onClick={() => {
                setOpen(false);
              }}
            >
              Profile
            </Link>
            <button
              type="button"
              role="menuitem"
              className="flex min-h-11 w-full items-center rounded-xl px-3 text-left text-sm font-medium hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-60"
              disabled={signingOut}
              onClick={() => {
                void signOut();
              }}
            >
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
            {signOutError ? (
              <p role="alert" className="px-3 py-2 text-sm text-destructive">
                {signOutError}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function AccountIdentity() {
  const pathname = usePathname();
  const session = useQuery({
    queryKey: sessionQueryKey,
    queryFn: readAccount,
  });

  if (session.isPending) {
    return (
      <span
        aria-hidden
        className="inline-flex h-10 w-24 shrink-0 rounded-full bg-muted"
      />
    );
  }

  if (!session.data) {
    return (
      <Link
        href="/sign-in"
        aria-current={pathname === "/sign-in" ? "page" : undefined}
        className={cn(buttonVariants(), "h-10 shrink-0 rounded-full px-4")}
      >
        Sign in
      </Link>
    );
  }

  return (
    <AccountMenu name={session.data.displayName} image={session.data.image} />
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-5xl flex-col px-4 sm:h-16 sm:flex-row sm:items-center">
        <div className="flex h-14 items-center justify-between sm:contents">
          <Link
            href="/"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-semibold tracking-tight text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-xs text-primary-foreground">
              K
            </span>
            Kira
          </Link>
          <div className="sm:order-3">
            <AccountIdentity />
          </div>
        </div>
        <nav
          aria-label="Main"
          className="flex justify-center gap-1 overflow-x-auto pb-3 [scrollbar-width:none] sm:order-2 sm:flex-1 sm:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center rounded-full px-3 text-sm font-medium text-muted-foreground transition-[background-color,color,transform] duration-200 hover:bg-primary-subtle hover:text-foreground active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none motion-reduce:active:scale-100",
                  active &&
                    "bg-primary text-primary-foreground shadow-subtle hover:bg-primary-hover hover:text-primary-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
