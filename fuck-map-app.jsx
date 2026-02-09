import React, { useState, useEffect } from 'react';
import { Share2, Trophy, MapPin, Info, X, RotateCcw, AlertTriangle, Scale, Shield } from 'lucide-react';



// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA58NkMScdRYNUXlPyUUJmZX7w2OM0njtY",
  authDomain: "the-fm-95adb.firebaseapp.com",
  databaseURL: "https://the-fm-95adb-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "the-fm-95adb",
  storageBucket: "the-fm-95adb.firebasestorage.app",
  messagingSenderId: "1075997758557",
  appId: "1:1075997758557:web:050e9e26795006ae2069b4",
  measurementId: "G-PMWCM1HZVL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Complete country data with population (in millions) - all UN member states
const COUNTRY_DATA = {
  // Asia
  'Afghanistan': 42, 'Armenia': 3, 'Azerbaijan': 10, 'Bahrain': 1, 'Bangladesh': 172,
  'Bhutan': 1, 'Brunei': 1, 'Cambodia': 17, 'China': 1425, 'Cyprus': 1,
  'Georgia': 4, 'India': 1428, 'Indonesia': 277, 'Iran': 89, 'Iraq': 45,
  'Israel': 9, 'Japan': 123, 'Jordan': 11, 'Kazakhstan': 19, 'Kuwait': 4,
  'Kyrgyzstan': 7, 'Laos': 8, 'Lebanon': 5, 'Malaysia': 34, 'Maldives': 1,
  'Mongolia': 3, 'Myanmar': 54, 'Nepal': 30, 'North Korea': 26, 'Oman': 5,
  'Pakistan': 240, 'Palestine': 5, 'Philippines': 117, 'Qatar': 3, 'Saudi Arabia': 36,
  'Singapore': 6, 'South Korea': 52, 'Sri Lanka': 22, 'Syria': 23, 'Tajikistan': 10,
  'Thailand': 71, 'Timor-Leste': 1, 'Turkey': 85, 'Turkmenistan': 6, 'United Arab Emirates': 9,
  'Uzbekistan': 35, 'Vietnam': 98, 'Yemen': 34,
  
  // Europe
  'Albania': 3, 'Andorra': 0.08, 'Austria': 9, 'Belarus': 9, 'Belgium': 11,
  'Bosnia and Herzegovina': 3, 'Bulgaria': 6, 'Croatia': 4, 'Czech Republic': 10, 'Denmark': 6,
  'Estonia': 1, 'Finland': 6, 'France': 64, 'Germany': 84, 'Greece': 10,
  'Hungary': 10, 'Iceland': 0.4, 'Ireland': 5, 'Italy': 59, 'Kosovo': 2,
  'Latvia': 2, 'Liechtenstein': 0.04, 'Lithuania': 3, 'Luxembourg': 1, 'Malta': 1,
  'Moldova': 3, 'Monaco': 0.04, 'Montenegro': 1, 'Netherlands': 17, 'North Macedonia': 2,
  'Norway': 5, 'Poland': 38, 'Portugal': 10, 'Romania': 19, 'Russia': 144,
  'San Marino': 0.03, 'Serbia': 7, 'Slovakia': 5, 'Slovenia': 2, 'Spain': 48,
  'Sweden': 10, 'Switzerland': 9, 'Ukraine': 37, 'United Kingdom': 68, 'Vatican City': 0.001,
  
  // Africa
  'Algeria': 45, 'Angola': 36, 'Benin': 13, 'Botswana': 3, 'Burkina Faso': 23,
  'Burundi': 13, 'Cabo Verde': 1, 'Cameroon': 28, 'Central African Republic': 5, 'Chad': 18,
  'Comoros': 1, 'Congo': 6, 'DR Congo': 102, 'Djibouti': 1, 'Egypt': 112,
  'Equatorial Guinea': 2, 'Eritrea': 3, 'Eswatini': 1, 'Ethiopia': 126, 'Gabon': 2,
  'Gambia': 3, 'Ghana': 34, 'Guinea': 14, 'Guinea-Bissau': 2, 'Ivory Coast': 28,
  'Kenya': 55, 'Lesotho': 2, 'Liberia': 5, 'Libya': 7, 'Madagascar': 30,
  'Malawi': 20, 'Mali': 23, 'Mauritania': 5, 'Mauritius': 1, 'Morocco': 37,
  'Mozambique': 33, 'Namibia': 3, 'Niger': 27, 'Nigeria': 223, 'Rwanda': 14,
  'Sao Tome and Principe': 0.2, 'Senegal': 18, 'Seychelles': 0.1, 'Sierra Leone': 9, 'Somalia': 18,
  'South Africa': 60, 'South Sudan': 11, 'Sudan': 48, 'Tanzania': 67, 'Togo': 9,
  'Tunisia': 12, 'Uganda': 48, 'Zambia': 20, 'Zimbabwe': 16,
  
  // North America
  'Antigua and Barbuda': 0.1, 'Bahamas': 1, 'Barbados': 0.3, 'Belize': 1, 'Canada': 39,
  'Costa Rica': 5, 'Cuba': 11, 'Dominica': 0.07, 'Dominican Republic': 11, 'El Salvador': 6,
  'Grenada': 0.1, 'Guatemala': 18, 'Haiti': 12, 'Honduras': 10, 'Jamaica': 3,
  'Mexico': 128, 'Nicaragua': 7, 'Panama': 4, 'Saint Kitts and Nevis': 0.05, 'Saint Lucia': 0.2,
  'Saint Vincent and the Grenadines': 0.1, 'Trinidad and Tobago': 1, 'United States': 339,
  
  // South America
  'Argentina': 46, 'Bolivia': 12, 'Brazil': 216, 'Chile': 19, 'Colombia': 52,
  'Ecuador': 18, 'Guyana': 1, 'Paraguay': 7, 'Peru': 34, 'Suriname': 1,
  'Uruguay': 3, 'Venezuela': 28,
  
  // Oceania
  'Australia': 26, 'Fiji': 1, 'Kiribati': 0.1, 'Marshall Islands': 0.04, 'Micronesia': 0.1,
  'Nauru': 0.01, 'New Zealand': 5, 'Palau': 0.02, 'Papua New Guinea': 10, 'Samoa': 0.2,
  'Solomon Islands': 1, 'Tonga': 0.1, 'Tuvalu': 0.01, 'Vanuatu': 0.3
};

// Countries organized by continent - all 193 UN member states
const CONTINENTS = {
  'Asia': [
    'Afghanistan', 'Armenia', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Bhutan', 'Brunei',
    'Cambodia', 'China', 'Cyprus', 'Georgia', 'India', 'Indonesia', 'Iran', 'Iraq',
    'Israel', 'Japan', 'Jordan', 'Kazakhstan', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Lebanon',
    'Malaysia', 'Maldives', 'Mongolia', 'Myanmar', 'Nepal', 'North Korea', 'Oman',
    'Pakistan', 'Palestine', 'Philippines', 'Qatar', 'Saudi Arabia', 'Singapore',
    'South Korea', 'Sri Lanka', 'Syria', 'Tajikistan', 'Thailand', 'Timor-Leste',
    'Turkey', 'Turkmenistan', 'United Arab Emirates', 'Uzbekistan', 'Vietnam', 'Yemen'
  ],
  'Africa': [
    'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde',
    'Cameroon', 'Central African Republic', 'Chad', 'Comoros', 'Congo', 'DR Congo',
    'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon',
    'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Kenya', 'Lesotho',
    'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius',
    'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda',
    'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia',
    'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda',
    'Zambia', 'Zimbabwe'
  ],
  'Europe': [
    'Albania', 'Andorra', 'Austria', 'Belarus', 'Belgium', 'Bosnia and Herzegovina',
    'Bulgaria', 'Croatia', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France',
    'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Kosovo', 'Latvia',
    'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Moldova', 'Monaco',
    'Montenegro', 'Netherlands', 'North Macedonia', 'Norway', 'Poland', 'Portugal',
    'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia', 'Spain',
    'Sweden', 'Switzerland', 'Ukraine', 'United Kingdom', 'Vatican City'
  ],
  'North America': [
    'Antigua and Barbuda', 'Bahamas', 'Barbados', 'Belize', 'Canada', 'Costa Rica',
    'Cuba', 'Dominica', 'Dominican Republic', 'El Salvador', 'Grenada', 'Guatemala',
    'Haiti', 'Honduras', 'Jamaica', 'Mexico', 'Nicaragua', 'Panama',
    'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines',
    'Trinidad and Tobago', 'United States'
  ],
  'South America': [
    'Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Ecuador', 'Guyana',
    'Paraguay', 'Peru', 'Suriname', 'Uruguay', 'Venezuela'
  ],
  'Oceania': [
    'Australia', 'Fiji', 'Kiribati', 'Marshall Islands', 'Micronesia', 'Nauru',
    'New Zealand', 'Palau', 'Papua New Guinea', 'Samoa', 'Solomon Islands', 'Tonga',
    'Tuvalu', 'Vanuatu'
  ]
};

// Calculate score based on population (inverse relationship)
const calculateScore = (population) => {
  if (population >= 1000) return 1;
  if (population >= 100) return 2;
  if (population >= 50) return 3;
  if (population >= 10) return 5;
  if (population >= 5) return 8;
  if (population >= 1) return 12;
  if (population >= 0.1) return 20;
  return 50;
};

export default function FuckMap() {
  const [selectedCountries, setSelectedCountries] = useState(new Set());
  const [totalScore, setTotalScore] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [showAgeGate, setShowAgeGate] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAbout, setShowAbout] = useState(false);
  const [selectedCitizenship, setSelectedCitizenship] = useState('');
  const [selectedUsername, setSelectedUsername] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [currentPage, setCurrentPage] = useState('map'); // 'map', 'about', 'blog'

  // Load data from localStorage
  useEffect(() => {
    // Check age gate
    const ageVerified = localStorage.getItem('ageVerified');
    if (ageVerified === 'true') {
      setShowAgeGate(false);
      
      const saved = localStorage.getItem('fuckMapData');
      if (saved) {
        const data = JSON.parse(saved);
        setSelectedCountries(new Set(data.countries || []));
        setUserInfo(data.userInfo);
        setShowOnboarding(!data.userInfo);
        calculateTotalScore(new Set(data.countries || []));
      } else {
        setShowOnboarding(true);
      }
      loadLeaderboard();
    }
  }, []);

  const calculateTotalScore = (countries) => {
    let score = 0;
    countries.forEach(country => {
      const pop = COUNTRY_DATA[country] || 1;
      score += calculateScore(pop);
    });
    setTotalScore(score);
  };

  const saveData = async (countries, info) => {
    let score = 0;
    countries.forEach(country => {
      const pop = COUNTRY_DATA[country] || 1;
      score += calculateScore(pop);
    });
    
    const data = {
      countries: Array.from(countries),
      userInfo: info,
      score: score,
      timestamp: Date.now()
    };
    
    localStorage.setItem('fuckMapData', JSON.stringify(data));
    
    if (database && info?.username) {
      try {
        const userRef = ref(database, 'users/' + info.username.toLowerCase().replace(/[^a-z0-9]/g, '_'));
        await set(userRef, {
          username: info.username,
          citizenship: info.citizenship,
          score: score,
          countryCount: countries.size,
          timestamp: Date.now()
        });
      } catch (error) {
        console.error('Firebase save error:', error);
      }
    }
    
    updateLeaderboard(data);
  };

  const loadLeaderboard = async () => {
    if (database) {
      try {
        const leaderboardRef = ref(database, 'users');
        const leaderboardQuery = query(leaderboardRef, orderByChild('score'), limitToLast(100));
        
        onValue(leaderboardQuery, (snapshot) => {
          const firebaseLeaderboard = [];
          snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            firebaseLeaderboard.push({
              userInfo: {
                username: data.username,
                citizenship: data.citizenship
              },
              score: data.score,
              timestamp: data.timestamp
            });
          });
          setLeaderboard(firebaseLeaderboard.reverse());
        });
        return;
      } catch (error) {
        console.error('Firebase load error:', error);
      }
    }
    
    const saved = localStorage.getItem('fuckMapLeaderboard');
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    }
  };

  const updateLeaderboard = (userData) => {
    let board = JSON.parse(localStorage.getItem('fuckMapLeaderboard') || '[]');
    board = board.filter(entry => entry.userInfo.username !== userData.userInfo.username);
    board.push(userData);
    board.sort((a, b) => b.score - a.score);
    board = board.slice(0, 100);
    localStorage.setItem('fuckMapLeaderboard', JSON.stringify(board));
    setLeaderboard(board);
  };

  const handleCountryClick = async (country) => {
    const newSelected = new Set(selectedCountries);
    if (newSelected.has(country)) {
      newSelected.delete(country);
    } else {
      newSelected.add(country);
    }
    setSelectedCountries(newSelected);
    calculateTotalScore(newSelected);
    if (userInfo) {
      await saveData(newSelected, userInfo);
    }
  };

  const handleAgeVerify = (isAdult) => {
    if (isAdult) {
      localStorage.setItem('ageVerified', 'true');
      setShowAgeGate(false);
      
      const saved = localStorage.getItem('fuckMapData');
      if (saved) {
        const data = JSON.parse(saved);
        setSelectedCountries(new Set(data.countries || []));
        setUserInfo(data.userInfo);
        setShowOnboarding(!data.userInfo);
        calculateTotalScore(new Set(data.countries || []));
      } else {
        setShowOnboarding(true);
      }
      loadLeaderboard();
    } else {
      window.location.href = 'https://www.google.com';
    }
  };

  const handleOnboardingSubmit = async () => {
    if (!selectedCitizenship) {
      alert('Please select your citizenship');
      return;
    }
    
    if (!selectedUsername || selectedUsername.trim().length < 2) {
      alert('Please enter a username (at least 2 characters)');
      return;
    }
    
    const info = {
      citizenship: selectedCitizenship,
      username: selectedUsername.trim()
    };
    setUserInfo(info);
    setShowOnboarding(false);
    await saveData(selectedCountries, info);
  };

  const handleShare = () => {
    const text = `🔥 ${userInfo?.username}'s F*** Map 🔥\n\nCountries: ${selectedCountries.size}\nScore: ${totalScore} points\n\nCan you beat my score?`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setShareMessage('✓ Copied to clipboard! Paste to share.');
          setTimeout(() => setShareMessage(''), 3000);
        })
        .catch(() => {
          setShareMessage(text);
          setTimeout(() => setShareMessage(''), 10000);
        });
    } else {
      setShareMessage(text);
      setTimeout(() => setShareMessage(''), 10000);
    }
  };

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    localStorage.removeItem('fuckMapData');
    setSelectedCountries(new Set());
    setTotalScore(0);
    setUserInfo(null);
    setSelectedCitizenship('');
    setSelectedUsername('');
    setShowOnboarding(true);
    setShowResetConfirm(false);
    setCurrentPage('map');
  };

  const getFilteredCountriesByContinent = () => {
    if (!searchTerm) return CONTINENTS;
    
    const filtered = {};
    Object.entries(CONTINENTS).forEach(([continent, countries]) => {
      const matchingCountries = countries.filter(country => 
        country.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (matchingCountries.length > 0) {
        filtered[continent] = matchingCountries;
      }
    });
    return filtered;
  };

  const myLeaderboard = userInfo ? leaderboard.filter(entry => 
    entry.userInfo.citizenship === userInfo.citizenship
  ) : [];

  // Age Gate Screen
  if (showAgeGate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4" style={{fontFamily: 'Montserrat, sans-serif'}}>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <div className="bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-lg w-full border border-gray-700">
          <div className="text-center mb-6">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">🔞 Adult Content Warning</h1>
            <p className="text-gray-300 text-lg">Age Verification Required</p>
          </div>
          
          <div className="bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-3">Before You Enter:</h2>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>This website tracks sexual encounters by citizenship</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>You must be 18+ to enter</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Content is sexually explicit in nature</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>By entering, you confirm legal age in your jurisdiction</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleAgeVerify(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg"
            >
              I am 18+ - Enter Site
            </button>
            <button
              onClick={() => handleAgeVerify(false)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl font-semibold transition"
            >
              I am under 18 - Exit
            </button>
          </div>

          <p className="text-gray-500 text-xs text-center mt-6">
            By clicking "I am 18+", you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    );
  }

  // Onboarding Screen
  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4" style={{fontFamily: 'Montserrat, sans-serif'}}>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <div className="bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-700">
          <h1 className="text-4xl font-bold text-center mb-2 text-red-500">The F*** Map</h1>
          <p className="text-gray-400 text-center mb-6">Track your international conquests</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={selectedUsername}
                onChange={(e) => setSelectedUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                maxLength={20}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Your Citizenship
              </label>
              <select
                value={selectedCitizenship}
                onChange={(e) => setSelectedCitizenship(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select your country...</option>
                {Object.keys(COUNTRY_DATA).sort().map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleOnboardingSubmit}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg"
            >
              Start Tracking
            </button>
          </div>
        </div>
      </div>
    );
  }

  // About Page
  if (currentPage === 'about') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" style={{fontFamily: 'Montserrat, sans-serif'}}>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet" />
        
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <button onClick={() => setCurrentPage('map')} className="text-2xl font-bold text-red-500 hover:text-red-400 transition">
              The F*** Map
            </button>
            <div className="flex gap-4">
              <button onClick={() => setCurrentPage('map')} className="text-gray-300 hover:text-white transition">Map</button>
              <button onClick={() => setCurrentPage('about')} className="text-red-500 font-semibold">About</button>
              <button onClick={() => setCurrentPage('blog')} className="text-gray-300 hover:text-white transition">Blog</button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-5xl font-bold text-white mb-6">About The F*** Map</h1>
          
          <div className="bg-gray-800 rounded-3xl p-8 mb-6 border border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold text-red-500 mb-4">What is this?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              The F*** Map is an adult-oriented platform where users track sexual encounters by the citizenship 
              of their partners. Select countries to mark your "conquests" and compete on global leaderboards.
            </p>
            <p className="text-gray-300 leading-relaxed">
              This is not a travel tracker. This is not a friendship map. This is explicitly designed to track 
              sexual encounters with people from different countries.
            </p>
          </div>

          <div className="bg-gray-800 rounded-3xl p-8 mb-6 border border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold text-red-500 mb-4">How Scoring Works</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Countries are worth different points based on population size. Smaller countries are harder to 
              "collect," so they're worth more points.
            </p>
            <div className="bg-gray-900 rounded-2xl p-6 space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>1+ billion people</span>
                <span className="text-red-500 font-bold">1 point</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>100M - 1B</span>
                <span className="text-red-500 font-bold">2 points</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>50M - 100M</span>
                <span className="text-red-500 font-bold">3 points</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>10M - 50M</span>
                <span className="text-red-500 font-bold">5 points</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>5M - 10M</span>
                <span className="text-red-500 font-bold">8 points</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>1M - 5M</span>
                <span className="text-red-500 font-bold">12 points</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>100K - 1M</span>
                <span className="text-red-500 font-bold">20 points</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Under 100K</span>
                <span className="text-red-500 font-bold">50 points</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-3xl p-8 mb-6 border border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Privacy & Data</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Your data is stored in Firebase (Google Cloud) and locally in your browser. We collect:
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Username (public on leaderboards)</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Citizenship (public on leaderboards)</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Selected countries (stored privately)</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Score and timestamp</span>
              </li>
            </ul>
            <p className="text-gray-400 text-sm mt-4">
              We do NOT collect: IP addresses, emails, real names, or any identifying information beyond what you provide.
            </p>
          </div>

          <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Legal & Safety</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              By using this site, you confirm you are 18+ and understand this is adult content. 
              This platform is for entertainment purposes only.
            </p>
            <p className="text-gray-300 leading-relaxed">
              We do not condone or encourage unsafe sexual practices, sex tourism, or any illegal activity. 
              Practice safe sex and respect consent always.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Blog Page
  if (currentPage === 'blog') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" style={{fontFamily: 'Montserrat, sans-serif'}}>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet" />
        
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <button onClick={() => setCurrentPage('map')} className="text-2xl font-bold text-red-500 hover:text-red-400 transition">
              The F*** Map
            </button>
            <div className="flex gap-4">
              <button onClick={() => setCurrentPage('map')} className="text-gray-300 hover:text-white transition">Map</button>
              <button onClick={() => setCurrentPage('about')} className="text-gray-300 hover:text-white transition">About</button>
              <button onClick={() => setCurrentPage('blog')} className="text-red-500 font-semibold">Blog</button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-5xl font-bold text-white mb-6">Blog</h1>
          
          {/* Blog Post 1 */}
          <div className="bg-gray-800 rounded-3xl p-8 mb-6 border border-gray-700 shadow-xl hover:border-red-500 transition cursor-pointer">
            <h2 className="text-2xl font-bold text-white mb-3">Welcome to The F*** Map</h2>
            <p className="text-gray-500 text-sm mb-4">January 15, 2024</p>
            <p className="text-gray-300 leading-relaxed">
              We're launching The F*** Map - a bold, unapologetic platform for tracking your international 
              sexual experiences. No euphemisms, no pretending this is about "travel" or "friendships." 
              This is exactly what it sounds like, and we're not ashamed of it.
            </p>
          </div>

          {/* Blog Post 2 */}
          <div className="bg-gray-800 rounded-3xl p-8 mb-6 border border-gray-700 shadow-xl hover:border-red-500 transition cursor-pointer">
            <h2 className="text-2xl font-bold text-white mb-3">How to Increase Your Score</h2>
            <p className="text-gray-500 text-sm mb-4">January 10, 2024</p>
            <p className="text-gray-300 leading-relaxed">
              Want to top the leaderboards? Small countries = big points. Focus on rare citizenships like 
              Vatican City (50 points!), Nauru, Tuvalu, and other micro-nations. Or go for quantity with 
              the major population centers.
            </p>
          </div>

          {/* Blog Post 3 */}
          <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-xl hover:border-red-500 transition cursor-pointer">
            <h2 className="text-2xl font-bold text-white mb-3">Safety First: Our Community Guidelines</h2>
            <p className="text-gray-500 text-sm mb-4">January 5, 2024</p>
            <p className="text-gray-300 leading-relaxed">
              While we celebrate sexual freedom, we take safety seriously. Always practice safe sex, 
              get tested regularly, and most importantly - respect consent. This is about mutual adult 
              experiences, not conquests over people.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main App
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" style={{fontFamily: 'Montserrat, sans-serif'}}>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet" />
      
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-2xl font-bold text-red-500">The F*** Map</h1>
              <p className="text-sm text-gray-400">
                <MapPin className="inline w-4 h-4" /> {userInfo?.username} ({userInfo?.citizenship})
              </p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setCurrentPage('map')} className="text-red-500 font-semibold">Map</button>
              <button onClick={() => setCurrentPage('about')} className="text-gray-300 hover:text-white transition">About</button>
              <button onClick={() => setCurrentPage('blog')} className="text-gray-300 hover:text-white transition">Blog</button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-3xl font-bold text-red-500">{totalScore}</div>
              <div className="text-sm text-gray-400">{selectedCountries.size} countries</div>
            </div>
            <button
              onClick={handleReset}
              className="text-gray-400 hover:text-red-500 transition"
              title="Reset"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search */}
            <div className="bg-gray-800 rounded-2xl shadow-xl p-4 border border-gray-700">
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Country Grid by Continent */}
            <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
              <div className="space-y-6 max-h-[600px] overflow-y-auto">
                {Object.entries(getFilteredCountriesByContinent()).map(([continent, countries]) => (
                  <div key={continent}>
                    <h3 className="text-lg font-bold text-white mb-3 sticky top-0 bg-gray-800 py-2 border-b border-gray-700">
                      {continent}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {countries.map(country => {
                        const isSelected = selectedCountries.has(country);
                        const score = calculateScore(COUNTRY_DATA[country]);
                        return (
                          <button
                            key={country}
                            onClick={() => handleCountryClick(country)}
                            className={`p-3 rounded-xl text-left transition ${
                              isSelected 
                                ? 'bg-red-600 text-white shadow-lg' 
                                : 'bg-gray-900 hover:bg-gray-700 text-gray-300 border border-gray-700'
                            }`}
                          >
                            <div className="font-semibold text-sm">{country}</div>
                            <div className="text-xs opacity-75">+{score} pts</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Share My Score
            </button>

            {/* Share Message */}
            {shareMessage && (
              <div className="bg-green-900 border border-green-700 rounded-xl p-4">
                <p className="text-green-200 text-sm whitespace-pre-wrap">{shareMessage}</p>
              </div>
            )}
          </div>

          {/* Right Sidebar - Leaderboards */}
          <div className="space-y-4">
            {/* Global Leaderboard */}
            <div className="bg-gray-800 rounded-2xl shadow-xl p-4 border border-gray-700 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h2 className="font-bold text-lg text-white">Global Top 10</h2>
              </div>
              <div className="space-y-2">
                {leaderboard.slice(0, 10).map((entry, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-gray-400">#{idx + 1}</span>
                      <span className="ml-2 text-white truncate">{entry.userInfo.username}</span>
                      <span className="ml-1 text-gray-500 text-xs">({entry.userInfo.citizenship})</span>
                    </div>
                    <span className="font-bold text-red-500 ml-2">{entry.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Country Leaderboard */}
            {myLeaderboard.length > 0 && (
              <div className="bg-gray-800 rounded-2xl shadow-xl p-4 border border-gray-700">
                <h3 className="font-bold mb-2 text-white">{userInfo.citizenship} Rankings</h3>
                <div className="space-y-2">
                  {myLeaderboard.slice(0, 5).map((entry, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-300 truncate">
                        {entry.userInfo.username === userInfo.username
                          ? 'You' 
                          : entry.userInfo.username}
                      </span>
                      <span className="font-bold text-red-500 ml-2">{entry.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
          onClick={() => setShowResetConfirm(false)}
        >
          <div 
            className="bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-6 border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-4">Reset Your Progress?</h3>
            <p className="text-gray-300 mb-6">
              This will clear all your selected countries and reset your score to 0. 
              You'll be able to start over with a new username. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition shadow-lg"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
