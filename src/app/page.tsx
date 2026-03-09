"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import messages from '@/message.json';
import Autoplay from 'embla-carousel-autoplay';
import { MessageSquare } from "lucide-react"; // For a nice icon touch

export default function Home() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-6 md:px-24 py-20 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />

      <section className="text-center mb-16 z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
          Dive into the World of <br className="hidden md:block" /> Anonymous Feedback
        </h1>
        <p className="mt-6 text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
          True Feedback — Where your identity remains a secret while your voice stays loud.
        </p>
      </section>

      <div className="w-full max-w-lg px-12 relative z-10">
        <Carousel 
          plugins={[Autoplay({ delay: 3000 })]} 
          className="w-full"
        >
          <CarouselContent>
            {messages.map((msg, index) => (
              <CarouselItem key={index}>
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-purple-500/50 transition-colors duration-300">
                  <CardContent className="flex flex-col p-8 min-h-[200px] justify-between">
                    <div className="flex items-start gap-4">
                      <MessageSquare className="w-6 h-6 text-purple-400 shrink-0" />
                      <div>
                        <h3 className="font-semibold text-xl text-purple-100">{msg.title}</h3>
                        <p className="mt-4 text-gray-300 leading-relaxed italic">
                          &ldquo;{msg.content}&rdquo;
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 text-xs text-gray-500 font-mono">
                      Received: {msg.received || "Just now"}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-slate-900 border-slate-800 hover:bg-slate-800 text-white" />
          <CarouselNext className="bg-slate-900 border-slate-800 hover:bg-slate-800 text-white" />
        </Carousel>
      </div>
    </main>
  );
}
