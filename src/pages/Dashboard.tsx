import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, FileText, MoreVertical, Edit, Download, Trash2, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useResume } from '@/context/ResumeContext';
import { exportToPDF, generateResumeFilename } from '@/lib/pdfExport';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
} from '@/components/ui/alert-dialog';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { resumes, createResume, deleteResume, setCurrentResume, canCreateMore } = useResume();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateResume = () => {
    if (!canCreateMore) {
      toast({
        title: 'Resume limit reached',
        description: 'You can save up to 5 resumes. Delete an existing one to create a new one.',
        variant: 'destructive',
      });
      return;
    }
    
    const newResume = createResume();
    if (newResume) {
      navigate(`/editor/${newResume.id}`);
    }
  };

  const handleEditResume = (resumeId: string) => {
    const resume = resumes.find(r => r.id === resumeId);
    if (resume) {
      setCurrentResume(resume);
      navigate(`/editor/${resumeId}`);
    }
  };

  const handleDeleteResume = (resumeId: string) => {
    deleteResume(resumeId);
    toast({
      title: 'Resume deleted',
      description: 'Your resume has been deleted successfully.',
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTemplateColor = (template: string) => {
    switch (template) {
      case 'minimalist': return 'bg-foreground';
      case 'modern': return 'bg-primary';
      case 'creative': return 'bg-template-creative';
      case 'professional': return 'bg-template-professional';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">ResumeBuilder</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="hidden sm:block font-medium">{user?.name}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">My Resumes</h1>
            <p className="text-muted-foreground mt-1">
              {resumes.length} of 5 resumes created
            </p>
          </div>
          <Button onClick={handleCreateResume} disabled={!canCreateMore} className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Resume
          </Button>
        </div>

        {resumes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-2xl bg-muted mx-auto mb-6 flex items-center justify-center">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No resumes yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first resume to get started
            </p>
            <Button onClick={handleCreateResume} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Your First Resume
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resumes.map((resume, index) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-card rounded-xl shadow-card overflow-hidden border border-border hover:shadow-elevated transition-all cursor-pointer"
                  onClick={() => handleEditResume(resume.id)}
                >
                  {/* Preview thumbnail */}
                  <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                    <div className={`h-12 ${getTemplateColor(resume.template)}`} />
                    <div className="p-3 space-y-2">
                      <div className="h-2.5 bg-muted-foreground/20 rounded w-3/4" />
                      <div className="h-2 bg-muted-foreground/10 rounded w-1/2" />
                      <div className="pt-2 space-y-1">
                        <div className="h-1.5 bg-muted-foreground/10 rounded" />
                        <div className="h-1.5 bg-muted-foreground/10 rounded w-5/6" />
                        <div className="h-1.5 bg-muted-foreground/10 rounded w-2/3" />
                      </div>
                    </div>
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button size="sm" variant="secondary" className="gap-2">
                        <Edit className="w-4 h-4" />
                        Edit Resume
                      </Button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{resume.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Updated {formatDate(resume.updatedAt)}
                        </p>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleEditResume(resume.id);
                          }}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                onClick={(e) => e.stopPropagation()}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Resume?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your resume.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteResume(resume.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`w-2 h-2 rounded-full ${getTemplateColor(resume.template)}`} />
                      <span className="text-xs text-muted-foreground capitalize">{resume.template}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
