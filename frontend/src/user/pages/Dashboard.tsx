import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  Wallet,
  Navigation,
  Bell,
  Search,
  User,
  Settings,
  TrendingUp,
  Map,
  Heart,
  Clock,
  Sun,
  CloudRain,
  Wind,
  Mic,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {api} from '../services/api.ts';

function WeatherCard({ city, temp, condition, icon: Icon }: { city: string, temp: number, condition: string, icon: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{city}</h3>
          <p className="text-sm text-gray-500">{condition}</p>
        </div>
        <div className="flex items-center">
          <Icon className="w-8 h-8 text-emerald-500 mr-2" />
          <span className="text-2xl font-bold text-gray-800">{temp}°C</span>
        </div>
      </div>
    </motion.div>
  );
}

function TripCard({ image, title, date, location }: { image: string, title: string, date: string, location: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative">
        <img src={image} alt={title} className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-4 right-4">
          <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2">{title}</h3>
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <Calendar className="w-4 h-4 mr-2" />
          {date}
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="w-4 h-4 mr-2" />
          {location}
        </div>
      </div>
    </motion.div>
  );
}

function ExpenseCard({ category, amount, trend }: { category: string, amount: string, trend: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-600">{category}</h3>
        <span className={`text-sm ${trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-800">{amount}</p>
    </motion.div>
  );
}

function RecommendationCard({ image, title, rating, price }: { image: string, title: string, rating: number, price: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600 ml-1">{rating}</span>
          </div>
          <span className="text-emerald-600 font-semibold">{price}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [location, setLocation] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleLocationSearch = async () => {
    setIsSearching(true);
    const results = await api.searchLocations(location);
    setSearchResults(results);
    setIsSearching(false);
  };

  const startVoiceInput = () => {
    setIsListening(true);
    // Simulating voice input
    setTimeout(() => {
      setIsListening(false);
      setLocation("Paris, France");
    }, 2000);
  };

  return (
    <div>
      {/* Enhanced Search Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location (e.g., Paris, Tokyo)"
              className="w-full px-4 py-3 pl-12 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <MapPin className="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={startVoiceInput}
              className={`p-3 rounded-lg transition-colors ${
                isListening 
                  ? 'bg-red-50 text-red-600 animate-pulse'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Mic className="w-6 h-6" />
            </button>
            <button
              onClick={handleLocationSearch}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Find Places
            </button>
          </div>
        </div>

        {/* Search Results */}
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 space-y-2"
            >
              {searchResults.map(place => (
                <motion.div
                  key={place.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800">{place.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {place.address}
                      </div>
                    </div>
                    <button className="text-emerald-600 hover:text-emerald-700">
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back, Alex!</h1>
          <p className="text-gray-600">Plan your next adventure</p>
        </div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
          Plan New Trip
        </button>
      </motion.div>

      {/* Weather Updates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <WeatherCard city="Paris" temp={22} condition="Sunny" icon={Sun} />
        <WeatherCard city="Tokyo" temp={19} condition="Rainy" icon={CloudRain} />
        <WeatherCard city="New York" temp={18} condition="Windy" icon={Wind} />
      </div>

      {/* Upcoming Trips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <TripCard
            image="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2070&auto=format&fit=crop"
            title="Paris Adventure"
            date="May 15 - May 22, 2024"
            location="Paris, France"
          />
          <TripCard
            image="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=2487&auto=format&fit=crop"
            title="Tokyo Explorer"
            date="June 10 - June 20, 2024"
            location="Tokyo, Japan"
          />
          <TripCard
            image="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop"
            title="New York City Break"
            date="July 5 - July 12, 2024"
            location="New York, USA"
          />
        </div>
      </motion.div>

      {/* Expenses Overview */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col md:flex-row gap-8 mb-8"
      >
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Travel Expenses</h2>
          <div className="grid grid-cols-2 gap-4">
            <ExpenseCard category="Accommodation" amount="$2,450" trend={-5} />
            <ExpenseCard category="Transportation" amount="$850" trend={12} />
            <ExpenseCard category="Food & Dining" amount="$620" trend={-2} />
            <ExpenseCard category="Activities" amount="$340" trend={8} />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Spending Analytics</h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-4 rounded-xl shadow-lg h-[calc(100%-32px)]"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Monthly Overview</span>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
              Chart Visualization
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Recommended Destinations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <RecommendationCard
            image="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop"
            title="Bali Paradise Resort"
            rating={4.8}
            price="$180/night"
          />
          <RecommendationCard
            image="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070&auto=format&fit=crop"
            title="Swiss Alps Adventure"
            rating={4.9}
            price="$250/night"
          />
          <RecommendationCard
            image="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=2074&auto=format&fit=crop"
            title="Venice Canal Tour"
            rating={4.7}
            price="$120/night"
          />
          <RecommendationCard
            image="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop"
            title="Dubai Luxury Stay"
            rating={4.9}
            price="$350/night"
          />
        </div>
      </motion.div>
    </div>
  );
}