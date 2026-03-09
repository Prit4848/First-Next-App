"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { acceptMessageSchema } from "@/Schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiREsponse";
import { useSession } from "next-auth/react";
import { Message, User } from "@/model/User";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw, Copy, ExternalLink, Inbox } from "lucide-react";
import { z } from "zod";

type AcceptMessageFormData = z.infer<typeof acceptMessageSchema>;

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { data: session } = useSession();
  const username = (session?.user as User | undefined)?.username ?? "";

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((m) => m._id.toString() !== messageId));
  };

  const form = useForm<AcceptMessageFormData>({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: { isacceptMessage: false },
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("isacceptMessage");

  // API Logic (Unchanged but consolidated)
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/accept-messages`);
      setValue("isacceptMessage", Boolean(response.data.isAcceptingMessage));
    } catch (error) {
      toast.error("Failed to fetch settings");
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/get-messages`);
      setMessages(response?.data?.messages || []);
      if (refresh) toast.info("Inbox updated");
    } catch (error) {
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const nextValue = !acceptMessages;
      await axios.post<ApiResponse>(`/api/accept-messages`, { acceptMessage: nextValue });
      setValue("isacceptMessage", nextValue);
      toast.success(`Accepting messages: ${nextValue ? 'Enabled' : 'Disabled'}`);
    } catch (error) {
      toast.error("Failed to toggle status");
    }
  };

  const profileUrl = typeof window === "undefined" ? "" : `${window.location.origin}/u/${username}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Link copied to clipboard!");
  };

  if (!session || !session.user) {
    return <div className="flex justify-center items-center min-h-[60vh] text-slate-400">Please log in to view your dashboard.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">User Dashboard</h1>
            <p className="text-slate-400 mt-1">Manage your anonymous feedback and public link.</p>
          </div>
          <Button
            variant="outline"
            className="w-fit border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200"
            onClick={() => fetchMessages(true)}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <RefreshCcw className="h-4 w-4 mr-2" />}
            Refresh Inbox
          </Button>
        </header>

        {/* Action Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Link Copier */}
          <div className="lg:col-span-2 p-6 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Your Unique Link</h2>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={profileUrl}
                  readOnly
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>
              <Button onClick={copyToClipboard} className="bg-white text-black hover:bg-slate-200 shrink-0 px-6">
                <Copy className="h-4 w-4 mr-2" /> Copy
              </Button>
            </div>
          </div>

          {/* Settings Switch */}
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm flex flex-col justify-center">
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Status</h2>
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="font-medium text-slate-200">Accept Messages</span>
              <Switch
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>
          </div>
        </div>

        <Separator className="bg-slate-800" />

        {/* Messages Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Inbox className="text-purple-400 h-5 w-5" />
            <h2 className="text-2xl font-bold">Your Inbox</h2>
          </div>

          {messages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {messages.map((message) => (
                <MessageCard
                  key={message._id as string}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl">
              <p className="text-slate-500">No messages yet. Share your link to start receiving feedback!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Page;