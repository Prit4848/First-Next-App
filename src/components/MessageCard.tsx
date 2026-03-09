"use client";
import { Message } from "../model/User";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiREsponse";
import axios, { AxiosError } from "axios";
import { X, MessageSquare, Clock } from "lucide-react"; // Icons for better UI
import dayjs from "dayjs";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const handleDeleteMessage = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`,
      );
      toast.success(response?.data?.message || "Message deleted");
      if (message?._id) {
        onMessageDelete(message._id.toString());
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError?.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-all duration-300 group relative">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-500/10 rounded-lg">
              <MessageSquare className="w-4 h-4 text-purple-400" />
            </div>
            <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              Anonymous Feedback
            </CardTitle>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              {/* Delete button only visible on card hover for a cleaner look */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-50">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Message?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  This action is permanent and cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteMessage}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>

      <CardContent>
        {/* Main feedback text - High contrast white */}
        <p className="text-slate-100 text-lg leading-relaxed break-words">
          {message.content}
        </p>
      </CardContent>

      <CardFooter className="pt-2 border-t border-slate-800/50 mt-2">
        <div className="flex items-center gap-2 text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">
            {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}

export default MessageCard;