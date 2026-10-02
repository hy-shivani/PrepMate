"use client";

import { useEffect, useState } from "react";

import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileForm } from "@/components/profile/profile-form";
import { Reveal } from "@/components/motion/reveal";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (res.ok) {
          setProfile(data.user);
        } else {
          console.log(data.message);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Profile
        </h1>

        <p className="text-sm text-muted-foreground">
          Manage your personal information and preferences.
        </p>
      </div>

      <Reveal>
        <ProfileHeader
          name={profile.fullName}
          email={profile.email}
          headline={`${profile.branch} · ${profile.college}`}
        />
      </Reveal>

      <Reveal delay={0.1}>
        <ProfileForm profile={profile} />
      </Reveal>
    </div>
  );
}