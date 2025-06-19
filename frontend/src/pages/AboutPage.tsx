import React from 'react';
import { Link } from 'react-router-dom';
import { NotebookPen, ArrowLeft, Heart, Code, Zap, Shield, Users, Star } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <NotebookPen className="relative h-16 w-16 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Notebook Abhay
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Born from a passion for organization and simplicity, Notebook Abhay is designed to be your perfect digital companion for capturing and organizing thoughts.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12 border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center mb-6">
            <Heart className="h-6 w-6 text-red-500 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Our Story</h2>
          </div>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Notebook Abhay was created with a simple vision: to make note-taking beautiful, intuitive, and powerful. 
              In a world full of complex productivity tools, we believe that sometimes the best solutions are the simplest ones.
            </p>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Whether you're a student capturing lecture notes, a professional organizing meeting minutes, or someone who just loves to jot down thoughts, 
              Notebook Abhay provides the perfect balance of functionality and elegance.
            </p>
            
            <p className="text-gray-600 dark:text-gray-400">
              Every feature has been thoughtfully designed to enhance your note-taking experience without getting in your way. 
              From the smooth dark mode transitions to the intuitive categorization system, we've paid attention to every detail.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <Code className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Modern Technology
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Built with React, TypeScript, and Tailwind CSS for a fast, responsive, and maintainable experience.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <Zap className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Lightning Fast
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Optimized for speed with instant note creation, real-time editing, and smooth animations.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <Shield className="h-8 w-8 text-green-600 dark:text-green-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Your Data, Your Control
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              All notes are stored locally in your browser, giving you complete control over your data.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <Users className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              User-Centric Design
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Every feature is designed based on real user needs and feedback for maximum usability.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <Star className="h-8 w-8 text-orange-600 dark:text-orange-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Attention to Detail
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              From micro-interactions to accessibility, every aspect has been carefully crafted.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <NotebookPen className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Constantly Evolving
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Regular updates and new features based on user feedback and emerging needs.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Our Mission
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            To democratize digital note-taking by providing a beautiful, powerful, and accessible platform 
            that helps people organize their thoughts and ideas effortlessly.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of users who have made Notebook Abhay their go-to note-taking solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;