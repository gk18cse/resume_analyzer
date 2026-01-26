import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Undo2, Redo2, FileText, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useResume } from '@/context/ResumeContext';
import { useAuth } from '@/context/AuthContext';
import { exportToPDF, generateResumeFilename } from '@/lib/pdfExport';
import { useToast } from '@/hooks/use-toast';
import { Resume, TemplateType } from '@/types/resume';
import EditorForm from '@/components/editor/EditorForm';
import ResumePreview from '@/components/editor/ResumePreview';
import TemplateSelector from '@/components/editor/TemplateSelector';
import ProgressIndicator from '@/components/editor/ProgressIndicator';

const EditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { resumes, currentResume, setCurrentResume, updateResume, undo, redo, canUndo, canRedo } = useResume();
  
  const [isExporting, setIsExporting] = useState(false);
  const [resumeName, setResumeName] = useState('');
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (id) {
      const resume = resumes.find(r => r.id === id);
      if (resume) {
        setCurrentResume(resume);
        setResumeName(resume.name);
      } else {
        navigate('/dashboard');
      }
    }
  }, [id, resumes, isAuthenticated]);

  useEffect(() => {
    if (currentResume) {
      setShowSaved(true);
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentResume?.updatedAt]);

  if (!currentResume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleResumeUpdate = (updatedResume: Resume) => {
    updateResume(updatedResume);
  };

  const handleNameChange = (name: string) => {
    setResumeName(name);
    handleResumeUpdate({ ...currentResume, name });
  };

  const handleTemplateChange = (template: TemplateType) => {
    handleResumeUpdate({ ...currentResume, template });
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const filename = generateResumeFilename(currentResume);
      await exportToPDF('resume-preview', filename);
      toast({
        title: 'Resume exported!',
        description: 'Your resume has been downloaded as a PDF.',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'There was an error exporting your resume. Please try again.',
        variant: 'destructive',
      });
    }
    setIsExporting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              
              <div className="flex items-center gap-2">
                <Input
                  value={resumeName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="h-8 w-40 sm:w-60 text-sm font-medium border-transparent hover:border-input focus:border-input"
                  placeholder="Resume name"
                />
                {showSaved && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1 text-xs text-accent"
                  >
                    <Check className="w-3 h-3" />
                    Saved
                  </motion.div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 mr-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={undo}
                  disabled={!canUndo}
                  className="h-8 w-8"
                >
                  <Undo2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={redo}
                  disabled={!canRedo}
                  className="h-8 w-8"
                >
                  <Redo2 className="w-4 h-4" />
                </Button>
              </div>

              <Button onClick={handleExportPDF} disabled={isExporting} className="gap-2">
                {isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Download PDF</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-3">
          <ProgressIndicator resume={currentResume} />
        </div>
      </div>

      {/* Template Selector */}
      <div className="bg-muted/50 border-b">
        <div className="container mx-auto px-4 py-3">
          <TemplateSelector
            selectedTemplate={currentResume.template}
            onTemplateChange={handleTemplateChange}
          />
        </div>
      </div>

      {/* Editor Layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* Form Section */}
          <div className="lg:sticky lg:top-[180px] lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto">
            <EditorForm
              resume={currentResume}
              onUpdate={handleResumeUpdate}
            />
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-[180px]">
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <div className="bg-muted/50 px-4 py-2 border-b flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Live Preview</span>
              </div>
              <div className="p-4 overflow-auto max-h-[calc(100vh-280px)]">
                <div className="transform origin-top scale-[0.65] sm:scale-75 lg:scale-[0.6] xl:scale-75">
                  <ResumePreview resume={currentResume} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
