import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Sparkles, Download, Layout, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const features = [
  {
    icon: FileText,
    title: 'Multiple Templates',
    description: 'Choose from professional, modern, creative, and minimalist designs',
  },
  {
    icon: Sparkles,
    title: 'Live Preview',
    description: 'See your changes instantly with real-time preview',
  },
  {
    icon: Download,
    title: 'PDF Export',
    description: 'Download your resume as a professionally formatted PDF',
  },
  {
    icon: Layout,
    title: 'Smart Editor',
    description: 'Intuitive forms with action word suggestions and auto-save',
  },
];

const templates = [
  { name: 'Modern', color: 'bg-primary' },
  { name: 'Minimalist', color: 'bg-foreground' },
  { name: 'Creative', color: 'bg-template-creative' },
  { name: 'Professional', color: 'bg-template-professional' },
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">ResumeBuilder</span>
            </Link>
            
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Log in</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary mb-6">
                Build Your Career Story
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Create Professional Resumes
                <span className="block text-primary">In Minutes</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Build stunning, ATS-friendly resumes with our intuitive builder. Choose from beautiful templates, 
                get smart suggestions, and download your resume instantly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                  <Button size="lg" className="w-full sm:w-auto gap-2 shadow-soft">
                    Start Building Free <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="#templates">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    View Templates
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span>Free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span>No signup required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span>PDF export</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful features to help you create the perfect resume
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-background shadow-card hover:shadow-elevated transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview Section */}
      <section id="templates" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Beautiful Templates</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from professionally designed templates that make your resume stand out
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {templates.map((template, index) => (
              <motion.div
                key={template.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] rounded-lg bg-card shadow-card overflow-hidden border border-border group-hover:shadow-elevated transition-all">
                  <div className={`h-16 ${template.color}`} />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-muted rounded w-2/3" />
                    <div className="h-2 bg-muted/60 rounded w-1/2" />
                    <div className="pt-3 space-y-1.5">
                      <div className="h-2 bg-muted/40 rounded" />
                      <div className="h-2 bg-muted/40 rounded w-5/6" />
                      <div className="h-2 bg-muted/40 rounded w-4/6" />
                    </div>
                    <div className="pt-3 space-y-1.5">
                      <div className="h-2 bg-muted/40 rounded" />
                      <div className="h-2 bg-muted/40 rounded w-3/4" />
                    </div>
                  </div>
                </div>
                <p className="text-center mt-3 font-medium">{template.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Build Your Resume?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join thousands of job seekers who've landed their dream jobs with our resume builder.
          </p>
          <Link to={isAuthenticated ? "/dashboard" : "/register"}>
            <Button size="lg" variant="secondary" className="gap-2">
              Get Started Now <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded gradient-primary flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-medium">ResumeBuilder</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 ResumeBuilder. Built for professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
