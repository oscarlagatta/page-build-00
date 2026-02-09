"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { PortalSidebar } from "@/components/portal-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, ArrowLeft, Save } from "lucide-react";
import newslettersData from "@/data/newsletters_synthetic.json";

type Newsletter = {
  id: string;
  title: string;
  status: "Draft" | "Submitted" | "Approved" | "Published";
  created_by: string;
  created_date: string;
  updated_by: string;
  updated_date: string;
  submitted_date: string | null;
  approved_date: string | null;
  published_date: string | null;
  content: string;
};

export default function NewsletterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [newsletter, setNewsletter] = React.useState<Newsletter | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: "",
    status: "",
    content: "",
  });

  React.useEffect(() => {
    const found = newslettersData.find((n) => n.id === id);
    if (found) {
      setNewsletter(found as Newsletter);
      setFormData({
        title: found.title,
        status: found.status,
        content: found.content,
      });
    }
  }, [id]);

  const handleSave = () => {
    // In a real app, this would call an API
    console.log("[v0] Saving newsletter:", formData);
    setIsEditing(false);
    // Simulate update
    if (newsletter) {
      setNewsletter({
        ...newsletter,
        ...formData,
        updated_date: new Date().toISOString(),
      });
    }
  };

  const handleBackToList = () => {
    router.push("/newsletters");
  };

  if (!newsletter) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Newsletter not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <PortalSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/"
                  className="flex items-center gap-1.5 text-muted-foreground"
                >
                  <Home className="h-3.5 w-3.5" />
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/newsletters"
                  className="text-muted-foreground"
                >
                  Newsletter Service
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-foreground">
                  {newsletter.id}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToList}
              className="gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to List
            </Button>
            {isEditing ? (
              <Button size="sm" onClick={handleSave} className="gap-1.5">
                <Save className="h-3.5 w-3.5" />
                Save Changes
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-1.5"
              >
                Edit Newsletter
              </Button>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {isEditing ? "Edit Newsletter" : "View Newsletter"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Newsletter ID: {newsletter.id}
                </p>
              </div>
              <Badge
                variant="outline"
                className={
                  newsletter.status === "Published"
                    ? "border-green-300 bg-green-50 text-green-700"
                    : newsletter.status === "Approved"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : newsletter.status === "Submitted"
                        ? "border-blue-300 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-gray-50 text-gray-700"
                }
              >
                {newsletter.status}
              </Badge>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Newsletter Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  {isEditing ? (
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm">{newsletter.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  {isEditing ? (
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Submitted">Submitted</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm">{newsletter.status}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  {isEditing ? (
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      rows={8}
                    />
                  ) : (
                    <p className="text-sm">{newsletter.content}</p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Created By</Label>
                    <p className="text-sm text-muted-foreground">
                      {newsletter.created_by}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Created Date</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(newsletter.created_date).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Updated By</Label>
                    <p className="text-sm text-muted-foreground">
                      {newsletter.updated_by}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Updated Date</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(newsletter.updated_date).toLocaleString()}
                    </p>
                  </div>
                </div>

                {(newsletter.submitted_date ||
                  newsletter.approved_date ||
                  newsletter.published_date) && (
                  <div className="grid gap-4 border-t pt-4 md:grid-cols-3">
                    {newsletter.submitted_date && (
                      <div className="space-y-2">
                        <Label>Submitted Date</Label>
                        <p className="text-sm text-muted-foreground">
                          {new Date(newsletter.submitted_date).toLocaleString()}
                        </p>
                      </div>
                    )}
                    {newsletter.approved_date && (
                      <div className="space-y-2">
                        <Label>Approved Date</Label>
                        <p className="text-sm text-muted-foreground">
                          {new Date(newsletter.approved_date).toLocaleString()}
                        </p>
                      </div>
                    )}
                    {newsletter.published_date && (
                      <div className="space-y-2">
                        <Label>Published Date</Label>
                        <p className="text-sm text-muted-foreground">
                          {new Date(newsletter.published_date).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
