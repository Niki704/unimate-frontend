"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { handleActionState } from "@/lib/toast-utils";
import { upsertProfileAction } from "@/actions/profile.actions";
import type { ProfileResponseDTO } from "@/types/profile";

interface Props {
  existing: ProfileResponseDTO | null;
}

const initial = { error: null };

export function ProfileClient({ existing }: Props) {
  const router = useRouter();
  const { addToast } = useToast();
  const [editing, setEditing] = useState(!existing);
  const [state, formAction, isPending] = useActionState(
    upsertProfileAction,
    initial,
  );
  const prevPending = useRef(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (prevPending.current && !isPending) {
      const wasError = handleActionState(state, addToast, "Profile saved.");
      if (!wasError) {
        startTransition(() => {
          setEditing(false);
        });
        router.refresh();
      }
    }
    prevPending.current = isPending;
  }, [isPending, state, addToast, router]);

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {editing
              ? existing
                ? "Edit Profile"
                : "Create Profile"
              : "My Profile"}
          </CardTitle>
          {!editing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(true)}
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
          ) : existing ? (
            <Button variant="icon" size="sm" onClick={() => setEditing(false)}>
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        {editing ? (
          <form action={formAction} className="space-y-4">
            <Textarea
              label="Bio"
              name="bio"
              placeholder="Tell us a bit about yourself…"
              defaultValue={existing?.bio ?? ""}
            />
            <Input
              label="Profile Picture URL"
              name="profilePictureUrl"
              type="url"
              placeholder="https://…"
              defaultValue={existing?.profilePictureUrl ?? ""}
            />
            <Input
              label="Address"
              name="address"
              placeholder="City, Country"
              defaultValue={existing?.address ?? ""}
            />
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="GitHub URL"
                name="githubUrl"
                type="url"
                placeholder="https://github.com/…"
                defaultValue={existing?.githubUrl ?? ""}
              />
              <Input
                label="LinkedIn URL"
                name="linkedinUrl"
                type="url"
                placeholder="https://linkedin.com/…"
                defaultValue={existing?.linkedinUrl ?? ""}
              />
              <Input
                label="Facebook URL"
                name="facebookUrl"
                type="url"
                placeholder="https://facebook.com/…"
                defaultValue={existing?.facebookUrl ?? ""}
              />
              <Input
                label="X (Twitter)"
                name="xUrl"
                type="url"
                placeholder="https://x.com/…"
                defaultValue={existing?.xUrl ?? ""}
              />
              <Input
                label="YouTube URL"
                name="youtubeUrl"
                type="url"
                placeholder="https://youtube.com/…"
                defaultValue={existing?.youtubeUrl ?? ""}
              />
            </div>
            {state.error && (
              <p className="text-sm text-red-600">{state.error}</p>
            )}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isPending}
            >
              Save Profile
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            {existing?.bio && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">
                  Bio
                </p>
                <p className="text-sm text-slate-700">{existing.bio}</p>
              </div>
            )}
            {existing?.address && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">
                  Address
                </p>
                <p className="text-sm text-slate-700">{existing.address}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              {existing?.githubUrl && (
                <SocialLink
                  href={existing.githubUrl}
                  icon={
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  }
                  label="GitHub"
                />
              )}
              {existing?.linkedinUrl && (
                <SocialLink
                  href={existing.linkedinUrl}
                  icon={
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  }
                  label="LinkedIn"
                />
              )}
              {existing?.xUrl && (
                <SocialLink
                  href={existing.xUrl}
                  icon={
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  }
                  label="X"
                />
              )}
              {existing?.youtubeUrl && (
                <SocialLink
                  href={existing.youtubeUrl}
                  icon={
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  }
                  label="YouTube"
                />
              )}
            </div>
            {!existing?.bio && !existing?.address && (
              <p className="text-sm text-slate-400">
                Profile is empty — click Edit to add information.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
    >
      {icon} {label}
    </a>
  );
}
