import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { Resume } from '@/types/resume';
import { useAIAssistant, AISuggestion, AIAnalysisResult } from '@/hooks/useAIAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface AISuggestionPanelProps {
  resume: Resume;
  onApplySuggestion?: (section: string, value: string) => void;
}

const priorityConfig = {
  high: { color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30', badge: 'destructive' as const },
  medium: { color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950/30', badge: 'secondary' as const },
  low: { color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30', badge: 'outline' as const },
};

const typeIcons: Record<string, React.ReactNode> = {
  improvement: <Zap className="w-3.5 h-3.5 text-amber-500" />,
  missing: <AlertTriangle className="w-3.5 h-3.5 text-red-500" />,
  grammar: <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />,
  keyword: <Sparkles className="w-3.5 h-3.5 text-purple-500" />,
};

const AISuggestionPanel = ({ resume, onApplySuggestion }: AISuggestionPanelProps) => {
  const { getSuggestions, isLoading } = useAIAssistant();
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    const result = await getSuggestions(resume);
    if (result) {
      setAnalysis(result);
      setHasAnalyzed(true);
    }
  };

  const toggleItem = (index: number) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-5 h-5 text-purple-500" />
            </motion.div>
            AI Suggestions
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAnalyze}
            disabled={isLoading}
            className="h-7 text-xs gap-1.5"
          >
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <RefreshCw className="w-3 h-3" />
            )}
            {hasAnalyzed ? 'Refresh' : 'Analyze'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {!hasAnalyzed && !isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 text-center space-y-3"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-purple-500" />
            </div>
            <p className="text-sm text-muted-foreground">
              Get AI-powered suggestions to improve your resume's quality and ATS score.
            </p>
            <Button onClick={handleAnalyze} className="gap-2" size="sm">
              <Sparkles className="w-4 h-4" />
              Analyze Resume
            </Button>
          </motion.div>
        ) : isLoading ? (
          <div className="p-6 text-center space-y-3">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-purple-500" />
            <p className="text-sm text-muted-foreground animate-pulse">Analyzing your resume with AI...</p>
          </div>
        ) : analysis ? (
          <ScrollArea className="max-h-[calc(100vh-400px)]">
            <div className="p-4 space-y-4">
              {/* Strength Score */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">AI Strength Score</span>
                  <span className={cn(
                    "font-bold",
                    analysis.strengthScore >= 80 ? 'text-green-500' :
                    analysis.strengthScore >= 60 ? 'text-yellow-500' : 'text-red-500'
                  )}>
                    {analysis.strengthScore}/100
                  </span>
                </div>
                <Progress value={analysis.strengthScore} className="h-2" />
              </motion.div>

              {/* Overall Feedback */}
              {analysis.overallFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground"
                >
                  {analysis.overallFeedback}
                </motion.div>
              )}

              {/* Missing Sections */}
              {analysis.missingSections?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-1.5"
                >
                  <p className="text-xs font-medium text-red-500 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Missing Sections
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {analysis.missingSections.map((s, i) => (
                      <Badge key={i} variant="destructive" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Suggestions */}
              <div className="space-y-2">
                <p className="text-xs font-medium flex items-center gap-1">
                  <Lightbulb className="w-3 h-3 text-amber-500" />
                  Improvement Suggestions ({analysis.suggestions?.length || 0})
                </p>
                <AnimatePresence>
                  {analysis.suggestions?.map((suggestion, i) => (
                    <SuggestionItem
                      key={i}
                      suggestion={suggestion}
                      index={i}
                      expanded={expandedItems.has(i)}
                      onToggle={() => toggleItem(i)}
                      onApply={onApplySuggestion}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </ScrollArea>
        ) : null}
      </CardContent>
    </Card>
  );
};

const SuggestionItem = ({
  suggestion,
  index,
  expanded,
  onToggle,
  onApply,
}: {
  suggestion: AISuggestion;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onApply?: (section: string, value: string) => void;
}) => {
  const config = priorityConfig[suggestion.priority];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn("rounded-lg border p-2.5 cursor-pointer transition-all hover:shadow-sm", config.bg)}
      onClick={onToggle}
    >
      <div className="flex items-start gap-2">
        {typeIcons[suggestion.type] || typeIcons.improvement}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Badge variant={config.badge} className="text-[10px] px-1.5 py-0">
              {suggestion.priority}
            </Badge>
            <span className="text-[10px] text-muted-foreground capitalize">{suggestion.section}</span>
          </div>
          <p className="text-xs font-medium leading-snug">{suggestion.reason}</p>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 space-y-1.5">
                  {suggestion.current && (
                    <div className="text-xs">
                      <span className="text-muted-foreground">Current: </span>
                      <span className="line-through opacity-60">{suggestion.current}</span>
                    </div>
                  )}
                  <div className="text-xs">
                    <span className="text-muted-foreground">Suggested: </span>
                    <span className="text-green-600 dark:text-green-400 font-medium">{suggestion.suggested}</span>
                  </div>
                  {onApply && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs gap-1 text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onApply(suggestion.section, suggestion.suggested);
                      }}
                    >
                      Apply <ArrowRight className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {expanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        )}
      </div>
    </motion.div>
  );
};

export default AISuggestionPanel;
