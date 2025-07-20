import { useState } from 'react';
import { Copy, Edit, Search, RefreshCw, Plus } from 'lucide-react';

const HashtagResearch = () => {
  const [activeTab, setActiveTab] = useState('trending');
  const [selectedPlatform, setSelectedPlatform] = useState('Instagram');
  
  const platformOptions = ['Instagram', 'Twitter', 'TikTok', 'LinkedIn', 'Facebook'];
  
  const hashtagGroups = [
    {
      name: 'Marketing Essentials',
      count: 5,
      tags: ['#marketing', '#digitalmarketing', '#socialmedia', '#contentmarketing', '#branding']
    },
    {
      name: 'Instagram Growth',
      count: 5,
      tags: ['#instagramtips', '#instagramgrowth', '#instagrammarketing', '#igdaily', '#instagramstrategy']
    }
  ];
  
  const trendingHashtags = [
    {
      name: '#digitalmarketing',
      posts: '2,500,000',
      engagement: '4.2%',
      growth: '+12.5%',
      difficulty: 85
    },
    {
      name: '#socialmediatips',
      posts: '1,800,000',
      engagement: '3.8%',
      growth: '+8.3%',
      difficulty: 75
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Hashtag Research</h2>
            <p className="text-gray-600">Discover and analyze trending hashtags for your content</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </button>
            
            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-skilllink-green hover:bg-skilllink-dark-green">
              <Plus className="h-4 w-4 mr-2" />
              Save Hashtag Group
            </button>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-7 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Hashtag Explorer</h3>
              <p className="text-sm text-gray-600 mb-4">Search and analyze hashtags across platforms</p>
              
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search hashtags..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-skilllink-green focus:border-skilllink-green"
                  />
                </div>
                
                <div className="w-full md:w-48">
                  <select 
                    className="block w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-skilllink-green focus:border-skilllink-green"
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                  >
                    {platformOptions.map(platform => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                </div>
                
                <button className="px-4 py-2 bg-skilllink-green text-white rounded-md text-sm font-medium hover:bg-skilllink-dark-green">
                  Search
                </button>
              </div>
              
              <div className="mt-4">
                <div className="flex border-b">
                  <button
                    className={`py-2 px-4 text-sm font-medium ${activeTab === 'trending' ? 'border-b-2 border-skilllink-green text-skilllink-green' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('trending')}
                  >
                    Trending
                  </button>
                  <button
                    className={`py-2 px-4 text-sm font-medium ${activeTab === 'related' ? 'border-b-2 border-skilllink-green text-skilllink-green' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('related')}
                  >
                    Related
                  </button>
                  <button
                    className={`py-2 px-4 text-sm font-medium ${activeTab === 'saved' ? 'border-b-2 border-skilllink-green text-skilllink-green' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('saved')}
                  >
                    Saved
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendingHashtags.map((hashtag, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-lg font-medium text-blue-600">{hashtag.name}</h4>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Copy className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Posts</p>
                      <p className="font-medium">{hashtag.posts}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Growth</p>
                      <p className="font-medium text-green-600">{hashtag.growth}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Engagement</p>
                      <p className="font-medium">{hashtag.engagement}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Difficulty</p>
                      <div className="mt-1 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500" 
                          style={{ width: `${hashtag.difficulty}%` }}
                        />
                      </div>
                      <p className="text-xs text-right mt-1">{hashtag.difficulty}/100</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <span className="inline-block h-4 w-4 rounded-full bg-pink-500"></span>
                    <span className="inline-block h-4 w-4 rounded-full bg-blue-400"></span>
                    <span className="inline-block h-4 w-4 rounded-full bg-blue-700"></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Hashtag Groups</h3>
              <p className="text-sm text-gray-600 mb-4">Your saved hashtag collections</p>
              
              <div className="space-y-4">
                {hashtagGroups.map((group, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{group.name}</h4>
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                        {group.count}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {group.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-2">
                      <button className="text-gray-500 hover:text-gray-700">
                        <Copy className="h-4 w-4" />
                      </button>
                      <button className="text-gray-500 hover:text-gray-700">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HashtagResearch;
