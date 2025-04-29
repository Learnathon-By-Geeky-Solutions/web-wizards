import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetNewsDetailQuery } from '../store/api/newsApi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function NewsDetail() {
  const { slug } = useParams();
  const { data: article, isLoading, error } = useGetNewsDetailQuery(slug);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>Failed to load the news article. It might have been removed or is unavailable.</p>
            <Link to="/news" className="text-red-700 font-bold hover:underline mt-2 inline-block">
              Return to News List
            </Link>
          </div>
        )}

        {/* Article content */}
        {!isLoading && article && (
          <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            {/* Back to news list */}
            <div className="px-6 pt-4">
              <Link 
                to="/news" 
                className="text-green-600 hover:text-green-800 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to News
              </Link>
            </div>
            
            {/* Featured image */}
            {article.featured_image && (
              <div className="w-full h-96 overflow-hidden">
                <img 
                  src={article.featured_image} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              {/* Category badge */}
              {article.category_name && (
                <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full mb-3">
                  {article.category_name}
                </span>
              )}
              
              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
              
              {/* Date */}
              <div className="text-gray-600 mb-6">
                Published on {formatDate(article.created_at)}
                {article.updated_at !== article.created_at && 
                  ` • Updated on ${formatDate(article.updated_at)}`}
              </div>
              
              {/* Content - using dangerouslySetInnerHTML in case content has HTML */}
              <div 
                className="prose max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </article>
        )}
      </main>
      <Footer />
    </>
  );
}

export default NewsDetail;