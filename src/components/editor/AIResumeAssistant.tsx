import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  Loader2,
  Wand2,
  MessageCircle,
  PenLine,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';
import { Resume } from '@/types/resume';
import { useAIAssistant, SmartQuestion } from '@/hooks/useAIAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AIResumeAssistantProps {
  resume: Resume;
  onApplyBullets?: (bullets: string[], experienceId: string) => void;
  onApplySummary?: (summary: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user' | 'system';
  content: string;
  type?: 'text' | 'bullets' | 'summary' | 'questions';
  data?: any;
}

const AIResumeAssistant = ({ resume, onApplyBullets, onApplySummary }: AIResumeAssistantProps) => {
  const { generateBulletPoints, generateSummary, getSmartQuestions, isLoading } = useAIAssistant();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI resume assistant. I can help you generate professional bullet points, write a compelling summary, or suggest improvements. What would you like to work on?",
      type: 'text',
    },
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const addMessage = (msg: Omit<ChatMessage, 'id'>) => {
    setMessages(prev => [...prev, { ...msg, id: Date.now().toString() }]);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: 'Copied to clipboard!' });
  };

  const handleGenerateBullets = async (expIndex: number) => {
    const exp = resume.experience[expIndex];
    if (!exp) return;

    addMessage({
      role: 'user',
      content: `Generate bullet points for my role as ${exp.position || 'this position'} at ${exp.company || 'this company'}.`,
      type: 'text',
    });

    const bullets = await generateBulletPoints({
      position: exp.position,
      company: exp.company,
      description: exp.description,
    });

    if (bullets) {
      addMessage({
        role: 'assistant',
        content: 'Here are some professional bullet points for this role:',
        type: 'bullets',
        data: { bullets, experienceId: exp.id },
      });
    }
  };

  const handleGenerateSummary = async () => {
    addMessage({
      role: 'user',
      content: 'Generate a professional summary for my resume.',
      type: 'text',
    });

    const summary = await generateSummary(resume);

    if (summary) {
      addMessage({
        role: 'assistant',
        content: summary,
        type: 'summary',
        data: { summary },
      });
    }
  };

  const handleAskQuestions = async () => {
    addMessage({
      role: 'user',
      content: 'What questions should I answer to improve my resume?',
      type: 'text',
    });

    const questions = await getSmartQuestions(resume);

    if (questions) {
      addMessage({
        role: 'assistant',
        content: 'Here are some questions that could strengthen your resume:',
        type: 'questions',
        data: { questions },
      });
    }
  };

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
        <CardTitle className="flex items-center gap-2 text-base">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <Bot className="w-5 h-5 text-emerald-500" />
          </motion.div>
          AI Resume Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Quick Actions */}
        <div className="p-3 border-b flex flex-wrap gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={handleGenerateSummary}
            disabled={isLoading}
            className="h-7 text-xs gap-1"
          >
            <PenLine className="w-3 h-3" />
            Generate Summary
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAskQuestions}
            disabled={isLoading}
            className="h-7 text-xs gap-1"
          >
            <HelpCircle className="w-3 h-3" />
            Smart Questions
          </Button>
          {resume.experience.map((exp, i) => (
            <Button
              key={exp.id}
              size="sm"
              variant="outline"
              onClick={() => handleGenerateBullets(i)}
              disabled={isLoading}
              className="h-7 text-xs gap-1"
            >
              <Wand2 className="w-3 h-3" />
              Bullets: {exp.position || `Exp ${i + 1}`}
            </Button>
          ))}
        </div>

        {/* Chat Messages */}
        <ScrollArea className="h-[300px]">
          <div className="p-3 space-y-3">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex",
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[90%] rounded-lg p-3 text-xs",
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/70'
                    )}
                  >
                    <p className="leading-relaxed">{msg.content}</p>

                    {/* Bullet Points */}
                    {msg.type === 'bullets' && msg.data?.bullets && (
                      <div className="mt-2 space-y-1.5">
                        {msg.data.bullets.map((bullet: string, i: number) => (
                          <div key={i} className="flex items-start gap-1.5 group">
                            <span className="text-primary mt-0.5">•</span>
                            <span className="flex-1">{bullet}</span>
                            <button
                              onClick={() => copyToClipboard(bullet, `${msg.id}-${i}`)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {copiedId === `${msg.id}-${i}` ? (
                                <Check className="w-3 h-3 text-green-500" />
                              ) : (
                                <Copy className="w-3 h-3 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                        ))}
                        {onApplyBullets && msg.data.experienceId && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-6 text-[10px] mt-1 gap-1"
                            onClick={() => onApplyBullets(msg.data.bullets, msg.data.experienceId)}
                          >
                            <Wand2 className="w-3 h-3" />
                            Apply to Resume
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Summary */}
                    {msg.type === 'summary' && msg.data?.summary && (
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => copyToClipboard(msg.data.summary, msg.id)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                          <span className="text-[10px] text-muted-foreground">Copy summary</span>
                        </div>
                        {onApplySummary && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-6 text-[10px] gap-1"
                            onClick={() => onApplySummary(msg.data.summary)}
                          >
                            <PenLine className="w-3 h-3" />
                            Apply to Resume
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Smart Questions */}
                    {msg.type === 'questions' && msg.data?.questions && (
                      <div className="mt-2 space-y-2">
                        {msg.data.questions.map((q: SmartQuestion, i: number) => (
                          <div key={i} className="p-2 bg-background/50 rounded border">
                            <Badge variant="outline" className="text-[9px] mb-1">{q.section}</Badge>
                            <p className="font-medium">{q.question}</p>
                            {q.context && (
                              <p className="text-muted-foreground mt-0.5">{q.context}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <Loader2 className="w-3 h-3 animate-spin" />
                AI is thinking...
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AIResumeAssistant;
