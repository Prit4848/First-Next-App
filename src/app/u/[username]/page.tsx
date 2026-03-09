"use client";
import React, { useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Send, Sparkles, UserCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea"; // Using Textarea for better message UX
import { Separator } from "@/components/ui/separator";
import { MessageSchema } from "@/Schemas/messageSchema";
import { ApiResponse } from "@/types/ApiREsponse";

function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionMessages, setSuggestionMessages] = useState<string[]>([]);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const { username } = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: { content: "" },
  });

  const handleSendMessage = async (data: z.infer<typeof MessageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/send-message", {
        content: data.content,
        username,
      });
      toast.success(response?.data?.message || "Message sent successfully");
      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError?.response?.data.message || "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    setIsSuggestionLoading(true);
    try {
      const response = await axios.get<string>(`/api/suggest-messages`);
      const messages = response.data.split("||").map(m => m.trim()).filter(Boolean);
      setSuggestionMessages(messages);
    } catch (error) {
      toast.error("Could not fetch suggestions at this time");
    } finally {
      setIsSuggestionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-10">
        
        {/* Header / Profile Info */}
        <section className="text-center space-y-4">
          <p className="text-slate-400 text-lg">Send an anonymous message below!</p>
        </section>

        {/* Message Input Form */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-100 uppercase tracking-wider">
              Your Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSendMessage)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Write something anonymous..."
                          className="min-h-[120px] resize-none border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-400 focus:ring-purple-500/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center">
                  <Button 
                    type="submit" 
                    disabled={isLoading || !form.watch("content")}
                    className="bg-white text-black hover:bg-slate-200 px-8 py-6 rounded-full font-bold transition-all shadow-lg hover:shadow-purple-500/10"
                  >
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                    Send Message
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Suggestion Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-xl font-bold">Quick Suggestions</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSuggestions}
              disabled={isSuggestionLoading}
              className="border-slate-800 bg-slate-900 text-slate-100 hover:bg-slate-800"
            >
              {isSuggestionLoading ? <Loader2 className="animate-spin" /> : "Refresh Suggestions"}
            </Button>
          </div>
          
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-6">
              {suggestionMessages.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {suggestionMessages.map((msg, i) => (
                    <button
                      key={i}
                      onClick={() => form.setValue("content", msg)}
                      className="text-left p-4 rounded-xl border border-slate-800 bg-slate-950/50 hover:border-purple-500/50 hover:bg-slate-900 transition-all text-slate-300 text-sm italic"
                    >
                      "{msg}"
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-4">Click "Refresh Suggestions" to see some ideas!</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Separator className="bg-slate-800" />

        {/* CTA Section */}
        <footer className="text-center pb-12">
          <p className="text-slate-400 mb-6">Want to receive anonymous messages yourself?</p>
          <Link href="/sign-up">
            <Button variant="outline" className="border-purple-500/50 bg-slate-900 text-purple-300 hover:bg-purple-500/10">
              Create Your Own Board
            </Button>
          </Link>
        </footer>
      </div>
    </div>
  );
}

export default Page;
