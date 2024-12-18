import React, { useState, useEffect, useCallback } from "react";
import { TbLoader } from "react-icons/tb";
import './index.css';

const App = () => {
  const [news, setNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('React');
  const [url, setUrl] = useState(`https://hn.algolia.com/api/v1/search?query=React`);
  const [loading, setLoading] = useState(false);

  // Wrap fetchNews in useCallback to ensure it's stable across renders
  const fetchNews = useCallback(() => {
    setLoading(true);
    fetch(url)
      .then((result) => {
        if (!result.ok) {
          throw new Error('Network response was not ok');
        }
        return result.json();
      })
      .then((data) => {
        setNews(data.hits);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setLoading(false);
      });
  }, [url]); // Only re-create when `url` changes

  // useEffect to fetch news when `url` changes
  useEffect(() => {
    fetchNews();
  }, [fetchNews]); // Add fetchNews as a dependency, now it's stable

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUrl(`https://hn.algolia.com/api/v1/search?query=${searchQuery}`);
    setSearchQuery("");
  };

  const showLoading = () =>
    loading ? <h2 className="text-2xl flex justify-center items-center"><TbLoader className="mr-1"/>Loading...</h2> : "";

  const searchForm = () => (
    <form
      name="form"
      onSubmit={handleSubmit}
      className="mb-4 flex items-center justify-center"
    >
      <input
        type="text"
        name="query"
        value={searchQuery}
        onChange={handleChange}
        className="border border-gray-300 rounded p-2 mr-3"
        placeholder="Search for news..."
      />
      <button className="bg-blue-500 hover:bg-blue-100 text-white hover:text-blue-500 hover:text-blue border hover:border-blue-500 rounded p-2">
        Search
      </button>
    </form>
  );

  const showNews = () => (
    <div className="space-y-2">
      {news.map((n, i) => (
        <p key={i} className="border-b border-gray-200 pb-2">{n.title}</p>
      ))}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-3xl text-center font-bold mb-4">News</h2>
      {showLoading()}
      {searchForm()}
      {showNews()}
    </div>
  );
};

export default App;
