"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Palette, Mail, Shield, Globe, Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const siteSettingsSchema = z.object({
  site_name: z.string().optional(),
  site_description: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal("")),
  contact_phone: z.string().optional(),
  contact_address: z.string().optional(),
  social_instagram: z.string().optional(),
  social_facebook: z.string().optional(),
  social_twitter: z.string().optional(),
});

const commissionSettingsSchema = z.object({
  commission_enabled: z.boolean().default(true),
  min_budget: z.coerce.number().default(500),
  response_time_hours: z.coerce.number().default(24),
});

const emailSettingsSchema = z.object({
  smtp_host: z.string().optional(),
  smtp_port: z.coerce.number().optional(),
  smtp_user: z.string().optional(),
  smtp_password: z.string().optional(),
  from_email: z.string().email().optional().or(z.literal("")),
});

type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>;
type CommissionSettingsFormData = z.infer<typeof commissionSettingsSchema>;
type EmailSettingsFormData = z.infer<typeof emailSettingsSchema>;

export default function AdminSettingsPage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettingsFormData>({});
  const [commissionSettings, setCommissionSettings] = useState<CommissionSettingsFormData>(
    commissionSettingsSchema.parse({})
  );
  const [emailSettings, setEmailSettings] = useState<EmailSettingsFormData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const siteForm = useForm<SiteSettingsFormData>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: siteSettings,
  });

  const commissionForm = useForm<CommissionSettingsFormData>({
    resolver: zodResolver(commissionSettingsSchema),
    defaultValues: commissionSettings,
  });

  const emailForm = useForm<EmailSettingsFormData>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: emailSettings,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const [siteRes, commissionRes, emailRes] = await Promise.all([
        api.get("/admin/settings/site/"),
        api.get("/admin/settings/commission/"),
        api.get("/admin/settings/email/"),
      ]);
      setSiteSettings(siteRes.data);
      setCommissionSettings(commissionRes.data);
      setEmailSettings(emailRes.data);
      siteForm.reset(siteRes.data);
      commissionForm.reset(commissionRes.data);
      emailForm.reset(emailRes.data);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSiteSave = async (data: SiteSettingsFormData) => {
    setSaving(true);
    try {
      await api.patch("/admin/settings/site/", data);
      setSiteSettings(data);
      toast.success("Site settings saved");
    } catch {
      toast.error("Failed to save site settings");
    } finally {
      setSaving(false);
    }
  };

  const handleCommissionSave = async (data: CommissionSettingsFormData) => {
    setSaving(true);
    try {
      await api.patch("/admin/settings/commission/", data);
      setCommissionSettings(data);
      toast.success("Commission settings saved");
    } catch {
      toast.error("Failed to save commission settings");
    } finally {
      setSaving(false);
    }
  };

  const handleEmailSave = async (data: EmailSettingsFormData) => {
    setSaving(true);
    try {
      await api.patch("/admin/settings/email/", data);
      setEmailSettings(data);
      toast.success("Email settings saved");
    } catch {
      toast.error("Failed to save email settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-8 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure your gallery settings</p>
      </div>

      <Tabs defaultValue="site" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="site">
            <Globe className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="commissions">
            <Palette className="mr-2 h-4 w-4" />
            Commissions
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </TabsTrigger>
        </TabsList>

        <TabsContent value="site">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic site information and contact details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={siteForm.handleSubmit(handleSiteSave)} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="site_name">Site Name</Label>
                    <Input id="site_name" {...siteForm.register("site_name")} className="mt-1" placeholder="Duluwa Art Gallery" />
                  </div>
                  <div>
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input id="contact_email" type="email" {...siteForm.register("contact_email")} className="mt-1" placeholder="hello@duluwa.art" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="site_description">Site Description</Label>
                  <textarea id="site_description" rows={3} {...siteForm.register("site_description")} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Curating exceptional artworks..." />
                </div>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="contact_phone">Phone</Label>
                    <Input id="contact_phone" {...siteForm.register("contact_phone")} className="mt-1" placeholder="+1 (555) 123-4567" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="contact_address">Address</Label>
                    <Input id="contact_address" {...siteForm.register("contact_address")} className="mt-1" placeholder="123 Art Street, Creative City" />
                  </div>
                </div>
                <div>
                  <Label>Social Media Links</Label>
                  <div className="mt-2 space-y-3">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="social_instagram">Instagram</Label>
                        <Input id="social_instagram" {...siteForm.register("social_instagram")} className="mt-1" placeholder="https://instagram.com/duluwaart" />
                      </div>
                      <div>
                        <Label htmlFor="social_facebook">Facebook</Label>
                        <Input id="social_facebook" {...siteForm.register("social_facebook")} className="mt-1" placeholder="https://facebook.com/duluwaart" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="social_twitter">Twitter</Label>
                      <Input id="social_twitter" {...siteForm.register("social_twitter")} className="mt-1" placeholder="https://twitter.com/duluwaart" />
                    </div>
                  </div>
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions">
          <Card>
            <CardHeader>
              <CardTitle>Commission Settings</CardTitle>
              <CardDescription>Configure commission inquiry handling</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={commissionForm.handleSubmit(handleCommissionSave)} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable Commissions</p>
                      <p className="text-sm text-muted-foreground">Allow customers to request custom artwork</p>
                    </div>
                    <Switch
                      checked={commissionForm.watch("commission_enabled")}
                      onCheckedChange={(checked) => commissionForm.setValue("commission_enabled", checked)}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="min_budget">Minimum Budget ($)</Label>
                      <Input id="min_budget" type="number" {...commissionForm.register("min_budget")} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="response_time_hours">Response Time (hours)</Label>
                      <Input id="response_time_hours" type="number" {...commissionForm.register("response_time_hours")} className="mt-1" />
                    </div>
                  </div>
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Commission Settings"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>SMTP settings for transactional emails</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={emailForm.handleSubmit(handleEmailSave)} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="smtp_host">SMTP Host</Label>
                    <Input id="smtp_host" {...emailForm.register("smtp_host")} className="mt-1" placeholder="smtp.gmail.com" />
                  </div>
                  <div>
                    <Label htmlFor="smtp_port">SMTP Port</Label>
                    <Input id="smtp_port" type="number" {...emailForm.register("smtp_port")} className="mt-1" placeholder="587" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="smtp_user">SMTP Username</Label>
                  <Input id="smtp_user" {...emailForm.register("smtp_user")} className="mt-1" placeholder="your-email@gmail.com" />
                </div>
                <div>
                  <Label htmlFor="smtp_password">SMTP Password</Label>
                  <Input id="smtp_password" type="password" {...emailForm.register("smtp_password")} className="mt-1" placeholder="App password" />
                </div>
                <div>
                  <Label htmlFor="from_email">From Email</Label>
                  <Input id="from_email" type="email" {...emailForm.register("from_email")} className="mt-1" placeholder="Duluwa Art <noreply@duluwa.art>" />
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Email Settings"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}