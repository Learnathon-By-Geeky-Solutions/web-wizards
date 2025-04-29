import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllNewsQuery, useGetCategoriesQuery } from '../store/api/newsApi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function News() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // RTK Query hooks with params
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const { data: newsData, isLoading: newsLoading, error } = useGetAllNewsQuery(
    selectedCategory ? { category: selectedCategory } : {}
  );

  const categories = categoriesData?.results || [];
  const news = newsData?.results || [];

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const loading = categoriesLoading || newsLoading;

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Latest News</h1>
        
        {/* Category filters */}
        {categories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    selectedCategory === category.id
                      ? 'bg-green-700 text-white'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="px-4 py-2 rounded-full text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Failed to fetch news. Please try again later.
          </div>
        )}

        {/* News list */}
        {!loading && !error && (
          <>
            {news.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No news articles found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map(article => (
                  <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    {article.featured_image && (
                      <img 
                        src={article.featured_image} 
                        alt={article.title} 
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-5">
                      {article.category_name && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-2">
                          {article.category_name}
                        </span>
                      )}
                      <h2 className="text-xl font-semibold mb-2 text-green-800 hover:text-green-600">
                        <Link to={`/news/${article.slug}`}>{article.title}</Link>
                      </h2>
                      <p className="text-gray-600 mb-4">{article.summary}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{formatDate(article.created_at)}</span>
                        <Link 
                          to={`/news/${article.slug}`}
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          Read more
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

export default News;