"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { handleActionState } from "@/lib/toast-utils";
import {
  createPortfolioAction,
  updatePortfolioAction,
} from "@/actions/portfolio.actions";
import type { PortfolioResponseDTO } from "@/types/portfolio";

interface Props {
  existing: PortfolioResponseDTO | null;
}

const initial = { error: null };

export function PortfolioClient({ existing }: Props) {
  const router = useRouter();
  const { addToast } = useToast();
  const [editing, setEditing] = useState(!existing);
  const action = existing ? updatePortfolioAction : createPortfolioAction;
  const [state, formAction, isPending] = useActionState(action, initial);
  const prevPending = useRef(false);

  useEffect(() => {
    if (prevPending.current && !isPending) {
      const wasError = handleActionState(state, addToast, "Portfolio saved.");
      if (!wasError) {
        setEditing(false);
        router.refresh();
      }
    }
    prevPending.current = isPending;
  }, [isPending, state, addToast, router]);

  if (!existing && !editing) {
    return (
      <EmptyState
        title="No portfolio yet"
        description="Create your portfolio to showcase skills and projects."
        action={{ label: "Create Portfolio", onClick: () => setEditing(true) }}
      />
    );
  }

  if (editing) {
    return (
      <Card className="max-w-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {existing ? "Edit Portfolio" : "Create Portfolio"}
            </CardTitle>
            {existing && (
              <Button
                variant="icon"
                size="sm"
                onClick={() => setEditing(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <Input
              label="Skills"
              name="skills"
              placeholder="React, TypeScript, Java…"
              hint="Comma-separated"
              defaultValue={existing?.skills.join(", ")}
            />
            <Input
              label="Project Links"
              name="projectLinks"
              placeholder="https://github.com/…"
              hint="Comma-separated URLs"
              defaultValue={existing?.projectLinks.join(", ")}
            />
            <Input
              label="Attachments"
              name="attachments"
              placeholder="https://drive.google.com/…"
              hint="Comma-separated links"
              defaultValue={existing?.attachments.join(", ")}
            />
            {state.error && (
              <p className="text-sm text-red-600">{state.error}</p>
            )}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isPending}
            >
              {existing ? "Save Changes" : "Create Portfolio"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  // View mode
  return (
    <div className="space-y-5 max-w-xl">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
          <Pencil className="h-3.5 w-3.5" /> Edit Portfolio
        </Button>
      </div>

      <Section title="Skills">
        {existing!.skills.length === 0 ? (
          <p className="text-sm text-slate-400">None added yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {existing!.skills.map((s) => (
              <span
                key={s}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </Section>

      <Section title="Project Links">
        {existing!.projectLinks.length === 0 ? (
          <p className="text-sm text-slate-400">None added yet.</p>
        ) : (
          <div className="space-y-1.5">
            {existing!.projectLinks.map((link) => (
              <a
                key={link}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 underline underline-offset-2"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {link}
              </a>
            ))}
          </div>
        )}
      </Section>

      <Section title="Attachments">
        {existing!.attachments.length === 0 ? (
          <p className="text-sm text-slate-400">None added yet.</p>
        ) : (
          <div className="space-y-1.5">
            {existing!.attachments.map((link) => (
              <a
                key={link}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 underline underline-offset-2"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {link}
              </a>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="pt-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">{title}</h3>
        {children}
      </CardContent>
    </Card>
  );
}
