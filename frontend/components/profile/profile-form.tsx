"use client";

import type React from "react";
import { useState } from "react";
import { Save, X } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { SkillsInput } from "@/components/profile/skills-input";
import { ResumeUpload } from "@/components/profile/resume-upload";

import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";

interface ProfileFormProps {
  profile: any;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [form, setForm] = useState({
    fullName: profile.fullName || "",
    college: profile.college || "",
    branch: profile.branch || "",
    graduationYear: profile.graduationYear || "",
    skills: profile.skills || [],
    github: profile.github || "",
    linkedin: profile.linkedin || "",
    bio: profile.bio || "",
    resume: profile.resume || "",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  function update(key: string, value: any) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("fullName", form.fullName);
      formData.append("college", form.college);
      formData.append("branch", form.branch);
      formData.append("graduationYear", String(form.graduationYear));
      formData.append("github", form.github);
      formData.append("linkedin", form.linkedin);
      formData.append("bio", form.bio);
      formData.append("skills", JSON.stringify(form.skills));

      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile`,
        {
          method: "PATCH",
          credentials: "include",
          body: formData,
        }
      );
      if (res.ok) {
        setSaved(true);
      }
    } catch (err) {
      console.log(err);
    }

    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="name">Full Name</Label>

            <Input
              id="name"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="college">College</Label>

            <Input
              id="college"
              value={form.college}
              onChange={(e) => update("college", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="branch">Branch</Label>

            <Input
              id="branch"
              value={form.branch}
              onChange={(e) => update("branch", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="gradYear">Graduation Year</Label>

            <Input
              id="gradYear"
              type="number"
              value={form.graduationYear}
              onChange={(e) =>
                update("graduationYear", Number(e.target.value))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills & Links</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label>Skills</Label>

            <SkillsInput
              skills={form.skills}
              onChange={(skills) => update("skills", skills)}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="github">GitHub</Label>

              <div className="relative">
                <GithubIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="github"
                  className="pl-9"
                  value={form.github}
                  onChange={(e) => update("github", e.target.value)}
                  placeholder="github.com/username"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="linkedin">LinkedIn</Label>

              <div className="relative">
                <LinkedinIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="linkedin"
                  className="pl-9"
                  value={form.linkedin}
                  onChange={(e) => update("linkedin", e.target.value)}
                  placeholder="linkedin.com/in/username"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="bio">Bio</Label>

            <Textarea
              id="bio"
              rows={4}
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              placeholder="Tell us a little about yourself..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resume</CardTitle>
        </CardHeader>

        <CardContent>
          <ResumeUpload
            initialName={form.resume?.url}
            onFileSelect={setResumeFile}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
        {saved && (
          <span className="text-sm text-accent sm:mr-auto">
            Changes saved successfully.
          </span>
        )}

        <Button type="button" variant="outline">
          <X className="size-4" />
          Cancel
        </Button>

        <Button
          type="submit"
          variant="gradient"
          disabled={saving}
        >
          <Save className="size-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}