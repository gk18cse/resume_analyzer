import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle2, XCircle, Sparkles, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { countKeywordMatches } from '@/lib/pdfParser';
import { cn } from '@/lib/utils';

interface KeywordMatcherProps {
  resumeText: string;
}

const KeywordMatcher = ({ resumeText }: KeywordMatcherProps) => {
  const [jobDescription, setJobDescription] = useState('');
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  const keywordAnalysis = useMemo(() => {
    if (!jobDescription.trim()) return null;
    return countKeywordMatches(resumeText, jobDescription);
  }, [resumeText, jobDescription]);

  const copyToClipboard = async (keyword: string) => {
    await navigator.clipboard.writeText(keyword);
    setCopiedKeyword(keyword);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 70) return 'text-green-500';
    if (percentage >= 50) return 'text-yellow-500';
    if (percentage >= 30) return 'text-orange-500';
    return 'text-red-500';
  };

  const getMatchBg = (percentage: number) => {
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search className="w-5 h-5 text-primary" />
          Keyword Matcher
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Paste Job Description
          </label>
          <Textarea
            placeholder="Paste the job description here to analyze keyword matches..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[120px] resize-none"
          />
        </div>

        {keywordAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Match Score */}
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Keyword Match Score</span>
                <span className={cn("text-2xl font-bold", getMatchColor(keywordAnalysis.matchPercentage))}>
                  {keywordAnalysis.matchPercentage}%
                </span>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${keywordAnalysis.matchPercentage}%` }}
                  transition={{ duration: 0.5 }}
                  className={cn("h-full rounded-full", getMatchBg(keywordAnalysis.matchPercentage))}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {keywordAnalysis.matchPercentage >= 70
                  ? 'Excellent match! Your resume aligns well with this job.'
                  : keywordAnalysis.matchPercentage >= 50
                  ? 'Good match. Adding more keywords could improve your chances.'
                  : keywordAnalysis.matchPercentage >= 30
                  ? 'Fair match. Consider adding the missing keywords below.'
                  : 'Low match. This role may require significant resume tailoring.'}
              </p>
            </div>

            {/* Matched Keywords */}
            {keywordAnalysis.matchedKeywords.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Matched Keywords ({keywordAnalysis.matchedKeywords.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {keywordAnalysis.matchedKeywords.map((keyword, i) => (
                    <Badge 
                      key={i} 
                      variant="outline" 
                      className="bg-green-500/10 text-green-600 border-green-500/20"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Keywords */}
            {keywordAnalysis.missingKeywords.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  Missing Keywords ({keywordAnalysis.missingKeywords.length})
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  Click to copy and add to your resume
                </p>
                <div className="flex flex-wrap gap-2">
                  {keywordAnalysis.missingKeywords.slice(0, 20).map((keyword, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="bg-red-500/10 text-red-600 border-red-500/20 cursor-pointer hover:bg-red-500/20 transition-colors"
                      onClick={() => copyToClipboard(keyword)}
                    >
                      {keyword}
                      {copiedKeyword === keyword ? (
                        <Check className="w-3 h-3 ml-1" />
                      ) : (
                        <Copy className="w-3 h-3 ml-1 opacity-50" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
              <p className="text-sm font-medium text-blue-600 flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4" /> Pro Tips
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Naturally integrate missing keywords into your experience</li>
                <li>• Don't keyword stuff - ATS systems detect this</li>
                <li>• Use exact phrases from the job description when applicable</li>
                <li>• Focus on the most relevant missing skills first</li>
              </ul>
            </div>
          </motion.div>
        )}

        {!keywordAnalysis && jobDescription && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Analyzing keywords...
          </p>
        )}

        {!jobDescription && (
          <div className="text-center py-6 text-muted-foreground">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Paste a job description to see keyword matches</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordMatcher;
