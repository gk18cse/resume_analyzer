import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  ChevronDown,
  ChevronUp,
  User,
  FileText,
  Briefcase,
  Code,
  GraduationCap,
  Search,
  Layout
} from 'lucide-react';
import { ATSAnalysisResult, CategoryResult } from '@/lib/atsAnalyzer';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ATSScoreDisplayProps {
  analysis: ATSAnalysisResult;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'Contact Information': <User className="w-4 h-4" />,
  'Professional Summary': <FileText className="w-4 h-4" />,
  'Work Experience': <Briefcase className="w-4 h-4" />,
  'Skills Section': <Code className="w-4 h-4" />,
  'Education Section': <GraduationCap className="w-4 h-4" />,
  'Keyword Optimization': <Search className="w-4 h-4" />,
  'Formatting & Layout': <Layout className="w-4 h-4" />,
};

const ATSScoreDisplay = ({ analysis }: ATSScoreDisplayProps) => {
  const [expandedCategories, setExpandedCategories] = React.useState<string[]>([]);

  const toggleCategory = (name: string) => {
    setExpandedCategories(prev =>
      prev.includes(name)
        ? prev.filter(c => c !== name)
        : [...prev, name]
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-400';
    if (score >= 70) return 'from-yellow-500 to-amber-400';
    if (score >= 50) return 'from-orange-500 to-amber-500';
    return 'from-red-500 to-rose-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (status: CategoryResult['status']) => {
    switch (status) {
      case 'good':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusBadge = (status: CategoryResult['status']) => {
    switch (status) {
      case 'good':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Good</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Needs Work</Badge>;
      case 'error':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Critical</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative p-8 bg-gradient-to-br from-background to-muted/50">
            <div className="flex items-center gap-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className={cn(
                  "relative w-32 h-32 rounded-full flex items-center justify-center",
                  "bg-gradient-to-br shadow-lg",
                  getScoreGradient(analysis.overallScore)
                )}
              >
                <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
                  <div className="text-center">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className={cn("text-4xl font-bold", getScoreColor(analysis.overallScore))}
                    >
                      {analysis.overallScore}
                    </motion.span>
                    <p className="text-xs text-muted-foreground">/100</p>
                  </div>
                </div>
              </motion.div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">ATS Compatibility Score</h2>
                <p className="text-muted-foreground mb-4">
                  {analysis.overallScore >= 90
                    ? 'Excellent! Your resume is highly ATS-friendly.'
                    : analysis.overallScore >= 70
                    ? 'Good start! A few improvements will boost your score.'
                    : analysis.overallScore >= 50
                    ? 'Fair. Several areas need attention for better ATS parsing.'
                    : 'Needs work. Focus on the critical issues below.'}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {analysis.categories.filter(c => c.status === 'error').length > 0 && (
                    <Badge variant="destructive">
                      {analysis.categories.filter(c => c.status === 'error').length} Critical Issues
                    </Badge>
                  )}
                  {analysis.categories.filter(c => c.status === 'warning').length > 0 && (
                    <Badge variant="secondary">
                      {analysis.categories.filter(c => c.status === 'warning').length} Warnings
                    </Badge>
                  )}
                  {analysis.categories.filter(c => c.status === 'good').length > 0 && (
                    <Badge className="bg-green-500/10 text-green-600">
                      {analysis.categories.filter(c => c.status === 'good').length} Passed
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {analysis.categories.map((category, index) => (
            <Collapsible
              key={category.name}
              open={expandedCategories.includes(category.name)}
              onOpenChange={() => toggleCategory(category.name)}
            >
              <CollapsibleTrigger className="w-full">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    category.status === 'good' ? 'bg-green-500/10 text-green-500' :
                    category.status === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-red-500/10 text-red-500'
                  )}>
                    {categoryIcons[category.name]}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{category.name}</span>
                      <span className={cn("text-sm font-semibold", getScoreColor(
                        (category.score / category.maxScore) * 100
                      ))}>
                        {category.score}/{category.maxScore}
                      </span>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(category.score / category.maxScore) * 100}%` }}
                        transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                        className={cn("h-full rounded-full", getProgressColor(
                          (category.score / category.maxScore) * 100
                        ))}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusBadge(category.status)}
                    {expandedCategories.includes(category.name) ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </motion.div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="pl-16 pr-4 pb-3 space-y-3">
                  {category.issues.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-red-600 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Issues Found
                      </p>
                      {category.issues.map((issue, i) => (
                        <p key={i} className="text-sm text-muted-foreground pl-4 flex items-start gap-2">
                          <span className="text-red-400">•</span> {issue}
                        </p>
                      ))}
                    </div>
                  )}
                  
                  {category.suggestions.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Suggestions
                      </p>
                      {category.suggestions.map((suggestion, i) => (
                        <p key={i} className="text-sm text-muted-foreground pl-4 flex items-start gap-2">
                          <span className="text-blue-400">•</span> {suggestion}
                        </p>
                      ))}
                    </div>
                  )}
                  
                  {category.issues.length === 0 && category.suggestions.length === 0 && (
                    <p className="text-sm text-green-600 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> 
                      This section looks great! No improvements needed.
                    </p>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ATSScoreDisplay;
