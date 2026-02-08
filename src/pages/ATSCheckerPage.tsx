import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileCheck, 
  Sparkles,
  Shield,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResumeUploader from '@/components/ats-checker/ResumeUploader';
import ATSScoreDisplay from '@/components/ats-checker/ATSScoreDisplay';
import KeywordMatcher from '@/components/ats-checker/KeywordMatcher';
import OptimizedResumePreview from '@/components/ats-checker/OptimizedResumePreview';
import { parseResume, ParsedResume } from '@/lib/pdfParser';
import { analyzeResumeText, ATSAnalysisResult } from '@/lib/atsAnalyzer';
import { useToast } from '@/hooks/use-toast';

const ATSCheckerPage = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
  const [analysis, setAnalysis] = useState<ATSAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState('score');
  const { toast } = useToast();

  const handleFileSelect = useCallback(async (file: File) => {
    setUploadedFile(file);
    setIsLoading(true);
    
    try {
      const parsed = await parseResume(file);
      setParsedResume(parsed);
      
      const analysisResult = analyzeResumeText(parsed);
      setAnalysis(analysisResult);
      
      toast({
        title: 'Resume Analyzed',
        description: `ATS Score: ${analysisResult.overallScore}/100`,
      });
    } catch (error) {
      console.error('Error parsing PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to parse the PDF. Please try another file.',
        variant: 'destructive',
      });
      setUploadedFile(null);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleClear = useCallback(() => {
    setUploadedFile(null);
    setParsedResume(null);
    setAnalysis(null);
  }, []);

  const handleExportPDF = useCallback(async () => {
    if (!parsedResume) return;
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const element = document.getElementById('ats-optimized-resume');
      
      if (!element) {
        toast({
          title: 'Error',
          description: 'Could not find resume preview element',
          variant: 'destructive',
        });
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const A4_WIDTH_MM = 210;
      const A4_HEIGHT_MM = 297;
      const imgWidth = A4_WIDTH_MM;
      const imgHeight = (canvas.height * A4_WIDTH_MM) / canvas.width;

      let finalWidth = imgWidth;
      let finalHeight = imgHeight;
      if (imgHeight > A4_HEIGHT_MM) {
        const scaleFactor = A4_HEIGHT_MM / imgHeight;
        finalWidth = imgWidth * scaleFactor;
        finalHeight = A4_HEIGHT_MM;
      }

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      const xOffset = (A4_WIDTH_MM - finalWidth) / 2;
      pdf.addImage(imgData, 'JPEG', xOffset, 0, finalWidth, finalHeight);
      pdf.save(`ATS-Optimized-Resume-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: 'PDF Downloaded',
        description: 'Your ATS-optimized resume has been saved.',
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: 'Export Failed',
        description: 'Could not generate PDF. Please try again.',
        variant: 'destructive',
      });
    }
  }, [parsedResume, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">ATS Resume Checker</h1>
            </div>
          </div>
          <Link to="/dashboard">
            <Button variant="outline">Go to Resume Builder</Button>
          </Link>
        </div>
      </header>

      <main className="container py-8">
        {/* Hero Section */}
        {!analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold mb-3">
              Check Your Resume's ATS Compatibility
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Upload your resume and get instant feedback on how well it will perform 
              with Applicant Tracking Systems used by 90% of Fortune 500 companies.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-green-500" />
                <span>100% Private - Files processed locally</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>Instant Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>AI-Powered Suggestions</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Upload Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <ResumeUploader
            onFileSelect={handleFileSelect}
            isLoading={isLoading}
            uploadedFile={uploadedFile}
            onClear={handleClear}
          />
        </div>

        {/* Results Section */}
        {analysis && parsedResume && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
                <TabsTrigger value="score">ATS Score</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="score" className="max-w-3xl mx-auto">
                <ATSScoreDisplay analysis={analysis} />
              </TabsContent>

              <TabsContent value="keywords" className="max-w-3xl mx-auto">
                <KeywordMatcher resumeText={parsedResume.fullText} />
              </TabsContent>

              <TabsContent value="preview" className="max-w-3xl mx-auto">
                <OptimizedResumePreview 
                  parsedResume={parsedResume} 
                  onExport={handleExportPDF}
                />
              </TabsContent>
            </Tabs>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold text-primary">{parsedResume.metadata.pageCount}</p>
                <p className="text-xs text-muted-foreground">Pages</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold text-primary">{parsedResume.metadata.wordCount}</p>
                <p className="text-xs text-muted-foreground">Words</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold text-green-500">
                  {analysis.categories.filter(c => c.status === 'good').length}
                </p>
                <p className="text-xs text-muted-foreground">Sections Passed</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold text-red-500">
                  {analysis.criticalIssues.length}
                </p>
                <p className="text-xs text-muted-foreground">Issues Found</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Features Section (when no analysis) */}
        {!analysis && (
          <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-xl bg-card border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">7-Point Analysis</h3>
              <p className="text-sm text-muted-foreground">
                We check contact info, summary, experience, skills, education, keywords, and formatting.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-card border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Keyword Matching</h3>
              <p className="text-sm text-muted-foreground">
                Compare your resume against any job description to see which keywords you're missing.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-card border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">ATS-Optimized Export</h3>
              <p className="text-sm text-muted-foreground">
                Get a reformatted, single-page version optimized for maximum ATS compatibility.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ATSCheckerPage;
