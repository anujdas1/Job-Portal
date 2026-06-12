import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Briefcase, Users, LayoutDashboard } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 selection:bg-indigo-200 dark:selection:bg-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">AI Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/sign-in" className="text-sm font-medium hover:text-indigo-600 transition-colors">
              Sign In
            </Link>
            <Link to="/register">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-white to-white dark:from-indigo-950/20 dark:via-gray-950 dark:to-gray-950"></div>
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8 border border-indigo-100 dark:border-indigo-800/50">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Matching Engine</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8">
            Hire Smarter. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Find Work Faster.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
            The next generation job portal powered by advanced AI algorithms. 
            We instantly match top candidates with the right companies through intelligent resume scoring and adaptive workflows.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 group">
                Join as Candidate
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-12 px-8 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
                I'm a Recruiter
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="max-w-7xl mx-auto px-6 mt-32">
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-6">
                <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Job Feed</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Candidates get highly relevant job recommendations based on their skills and preferences, filtered dynamically.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center mb-6">
                <LayoutDashboard className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Recruiter Kanban</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Manage your hiring pipeline effortlessly with our drag-and-drop Kanban board designed for speed.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-violet-50 dark:bg-violet-900/20 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Resume Scoring</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Automatically score and rank incoming applications using our Python-powered AI microservice.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
