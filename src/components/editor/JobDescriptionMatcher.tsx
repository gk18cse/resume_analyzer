import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  FileSearch,
  TrendingUp,
  MessageSquare,
  Wrench,
} from 'lucide-react';
import { Resume } from '@/types/resume';
import { useAIAssistant, JobMatchResult } from '@/hooks/useAIAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface JobDescriptionMatcherProps {
  resume: Resume;
}

const JobDescriptionMatcher = ({ resume }: JobDescriptionMatcherProps) => {
  const { matchJobDescription, isLoading } = useAIAssistant();
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<JobMatchResult | null>(null);

  const handleMatch = async () => {
    if (!jobDescription.trim()) return;
    const matchResult = await matchJobDescription(resume, jobDescription);
    if (matchResult) setResult(matchResult);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-amber-500';
    if (score >= 40) return 'from-orange-500 to-amber-600';
    return 'from-red-500 to-rose-500';
  };

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="w-5 h-5 text-blue-500" />
          Job Match Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* JD Input */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Paste a job description to see how well your resume matches.
          </p>
          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            rows={4}
            className="text-sm resize-none"
          />
          <Button
            onClick={handleMatch}
            disabled={isLoading || !jobDescription.trim()}
            className="w-full gap-2"
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {isLoading ? 'Analyzing...' : 'Analyze Match'}
          </Button>
        </div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Match Score */}
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br text-white font-bold text-xl shrink-0",
                  getScoreGradient(result.matchScore)
                )}>
                  {result.matchScore}%
                </div>
                <div>
                  <p className="font-semibold text-sm">Match Score</p>
                  <p className="text-xs text-muted-foreground">
                    {result.matchScore >= 80 ? 'Excellent match! Great fit for this role.' :
                     result.matchScore >= 60 ? 'Good match with room for optimization.' :
                     result.matchScore >= 40 ? 'Moderate match. Consider tailoring your resume.' :
                     'Low match. Significant tailoring needed.'}
                  </p>
                </div>
              </div>

              {/* Tabbed Details */}
              <Tabs defaultValue="keywords" className="w-full">
                <TabsList className="grid w-full grid-cols-4 h-8">
                  <TabsTrigger value="keywords" className="text-xs px-1">
                    <FileSearch className="w-3 h-3 mr-1" />
                    Keywords
                  </TabsTrigger>
                  <TabsTrigger value="tips" className="text-xs px-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Tips
                  </TabsTrigger>
                  <TabsTrigger value="grammar" className="text-xs px-1">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Grammar
                  </TabsTrigger>
                  <TabsTrigger value="sections" className="text-xs px-1">
                    <Wrench className="w-3 h-3 mr-1" />
                    Sections
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="keywords" className="mt-3">
                  <ScrollArea className="max-h-48">
                    <div className="space-y-2">
                      {/* Matched Keywords */}
                      <p className="text-xs font-medium text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Matched Keywords
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {result.matchedKeywords?.filter(k => k.found).map((k, i) => (
                          <Badge key={i} variant="default" className="text-[10px]">
                            {k.keyword}
                          </Badge>
                        ))}
                        {(!result.matchedKeywords?.filter(k => k.found).length) && (
                          <span className="text-xs text-muted-foreground">No matched keywords found</span>
                        )}
                      </div>

                      {/* Missing Keywords */}
                      <p className="text-xs font-medium text-red-500 flex items-center gap-1 mt-3">
                        <XCircle className="w-3 h-3" />
                        Missing Keywords
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {result.missingKeywords?.map((k, i) => (
                          <Badge key={i} variant="destructive" className="text-[10px]">
                            {k}
                          </Badge>
                        ))}
                        {(!result.missingKeywords?.length) && (
                          <span className="text-xs text-muted-foreground">No critical keywords missing</span>
                        )}
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="tips" className="mt-3">
                  <ScrollArea className="max-h-48">
                    <div className="space-y-2">
                      {result.optimizationTips?.map((tip, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-2 text-xs p-2 bg-muted/50 rounded"
                        >
                          <TrendingUp className="w-3 h-3 text-blue-500 mt-0.5 shrink-0" />
                          <span>{tip}</span>
                        </motion.div>
                      ))}
                      {result.formattingFeedback?.map((fb, i) => (
                        <motion.div
                          key={`fmt-${i}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (result.optimizationTips?.length || 0 + i) * 0.05 }}
                          className="flex items-start gap-2 text-xs p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded"
                        >
                          <AlertCircle className="w-3 h-3 text-yellow-500 mt-0.5 shrink-0" />
                          <span>{fb}</span>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="grammar" className="mt-3">
                  <ScrollArea className="max-h-48">
                    <div className="space-y-2">
                      {result.grammarIssues?.length > 0 ? (
                        result.grammarIssues.map((issue, i) => (
                          <div key={i} className="text-xs p-2 bg-muted/50 rounded space-y-1">
                            <p className="line-through text-red-400">{issue.text}</p>
                            <p className="text-green-600 dark:text-green-400 font-medium">{issue.suggestion}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          No grammar issues detected! ✨
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="sections" className="mt-3">
                  <ScrollArea className="max-h-48">
                    <div className="space-y-2">
                      {result.sectionFeedback && Object.entries(result.sectionFeedback).map(([section, feedback], i) => (
                        <div key={i} className="text-xs p-2 bg-muted/50 rounded">
                          <p className="font-medium capitalize mb-0.5">{section}</p>
                          <p className="text-muted-foreground">{feedback}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default JobDescriptionMatcher;
