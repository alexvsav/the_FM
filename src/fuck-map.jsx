import React, { useState, useEffect } from 'react';
import { Share2, Trophy, MapPin, Info, X, RotateCcw, AlertTriangle, Instagram } from 'lucide-react';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { 
  getDatabase, 
  ref, 
  set, 
  onValue,
  query,
  orderByChild,
  limitToLast 
} from 'firebase/database';

// Firebase configuration - REPLACE WITH YOUR ACTUAL VALUES
const firebaseConfig = {
  apiKey: "AIzaSyDemoKey-ReplaceWithYourActualKey",
  authDomain: "fuck-map.firebaseapp.com",
  databaseURL: "https://fuck-map-default-rtdb.firebaseio.com",
  projectId: "fuck-map",
  storageBucket: "fuck-map.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
let app, database;
try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
} catch (error) {
  console.log("Firebase initialization failed, will use localStorage only", error);
}

// Complete country data with population (in millions)
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

// Countries organized by continent
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

// Calculate score based on population
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('map');
  const [myPosition, setMyPosition] = useState(null);
  const [countryPosition, setCountryPosition] = useState(null);

  // Load data from localStorage
  useEffect(() => {
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

  // Calculate positions when leaderboard or user changes
  useEffect(() => {
    if (userInfo && leaderboard.length > 0) {
      // Global position
      const globalPos = leaderboard.findIndex(entry => 
        entry.userInfo.username === userInfo.username
      );
      setMyPosition(globalPos >= 0 ? globalPos + 1 : null);

      // Country position
      const countryBoard = leaderboard.filter(entry => 
        entry.userInfo.citizenship === userInfo.citizenship
      );
      const countryPos = countryBoard.findIndex(entry => 
        entry.userInfo.username === userInfo.username
      );
      setCountryPosition(countryPos >= 0 ? countryPos + 1 : null);
    }
  }, [leaderboard, userInfo, totalScore]);

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

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  const shareToSocial = (platform) => {
    const siteUrl = window.location.origin;
    const text = `🔥 I've scored ${totalScore} points across ${selectedCountries.size} countries on The F*** Map!\n\nThink you can beat me? Calculate your own score:`;
    
    let url;
    switch(platform) {
      case 'instagram':
        // Instagram doesn't support direct sharing URLs, so copy to clipboard
        navigator.clipboard.writeText(`${text}\n${siteUrl}`);
        alert('📋 Copied to clipboard! Paste this in your Instagram story or post.');
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(siteUrl)}`;
        window.open(url, '_blank', 'width=600,height=400');
        break;
      case 'bluesky':
        url = `https://bsky.app/intent/compose?text=${encodeURIComponent(text + '\n' + siteUrl)}`;
        window.open(url, '_blank', 'width=600,height=600');
        break;
    }
    setShowShareModal(false);
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

  // PornHub color scheme: Black background (#000000), Orange accent (#FF9000), White text
  const phColors = {
    bg: '#000000',
    bgLight: '#1a1a1a',
    bgCard: '#141414',
    accent: '#FF9000',
    accentHover: '#FFA500',
    text: '#FFFFFF',
    textGray: '#B3B3B3',
    border: '#2a2a2a'
  };

  // Age Gate Screen
  if (showAgeGate) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: phColors.bg, fontFamily: 'Montserrat, sans-serif'}}>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <div className="rounded-3xl shadow-2xl p-8 max-w-lg w-full" style={{backgroundColor: phColors.bgCard, border: `1px solid ${phColors.border}`}}>
          <div className="text-center mb-6">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4" style={{color: phColors.accent}} />
            <h1 className="text-4xl font-bold mb-2" style={{color: phColors.text}}>🔞 Adult Content Warning</h1>
            <p className="text-lg" style={{color: phColors.textGray}}>Age Verification Required</p>
          </div>
          
          <div className="rounded-2xl p-6 mb-6" style={{backgroundColor: phColors.bgLight, border: `1px solid ${phColors.border}`}}>
            <h2 className="text-xl font-bold mb-3" style={{color: phColors.text}}>Before You Enter:</h2>
            <ul className="space-y-2 text-sm" style={{color: phColors.textGray}}>
              <li className="flex items-start">
                <span className="mr-2" style={{color: phColors.accent}}>•</span>
                <span>This website tracks sexual encounters by citizenship</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{color: phColors.accent}}>•</span>
                <span>You must be 18+ to enter</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{color: phColors.accent}}>•</span>
                <span>Content is sexually explicit in nature</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{color: phColors.accent}}>•</span>
                <span>By entering, you confirm legal age in your jurisdiction</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleAgeVerify(true)}
              className="w-full py-4 rounded-xl font-bold text-lg transition shadow-lg"
              style={{backgroundColor: phColors.accent, color: phColors.bg}}
              onMouseEnter={(e) => e.target.style.backgroundColor = phColors.accentHover}
              onMouseLeave={(e) => e.target.style.backgroundColor = phColors.accent}
            >
              I am 18+ - Enter Site
            </button>
            <button
              onClick={() => handleAgeVerify(false)}
              className="w-full py-4 rounded-xl font-semibold transition"
              style={{backgroundColor: phColors.bgLight, color: phColors.text}}
            >
              I am under 18 - Exit
            </button>
          </div>

          <p className="text-xs text-center mt-6" style={{color: phColors.textGray}}>
            By clicking "I am 18+", you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    );
  }

  // Onboarding Screen
  if (showOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: phColors.bg, fontFamily: 'Montserrat, sans-serif'}}>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <div className="rounded-3xl shadow-2xl p-8 max-w-md w-full" style={{backgroundColor: phColors.bgCard, border: `1px solid ${phColors.border}`}}>
          <h1 className="text-4xl font-bold text-center mb-2" style={{color: phColors.accent}}>The F*** Map</h1>
          <p className="text-center mb-6" style={{color: phColors.textGray}}>Track your international conquests</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: phColors.textGray}}>
                Username
              </label>
              <input
                type="text"
                value={selectedUsername}
                onChange={(e) => setSelectedUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:border-transparent"
                style={{backgroundColor: phColors.bgLight, border: `1px solid ${phColors.border}`, color: phColors.text}}
                maxLength={20}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: phColors.textGray}}>
                Your Citizenship
              </label>
              <select
                value={selectedCitizenship}
                onChange={(e) => setSelectedCitizenship(e.target.value)}
                className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:border-transparent"
                style={{backgroundColor: phColors.bgLight, border: `1px solid ${phColors.border}`, color: phColors.text}}
              >
                <option value="">Select your country...</option>
                {Object.keys(COUNTRY_DATA).sort().map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleOnboardingSubmit}
              className="w-full py-4 rounded-xl font-bold text-lg transition shadow-lg"
              style={{backgroundColor: phColors.accent, color: phColors.bg}}
              onMouseEnter={(e) => e.target.style.backgroundColor = phColors.accentHover}
              onMouseLeave={(e) => e.target.style.backgroundColor = phColors.accent}
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
      <div className="min-h-screen" style={{backgroundColor: phColors.bg, fontFamily: 'Montserrat, sans-serif'}}>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet" />
        
        {/* Header */}
        <div className="border-b sticky top-0 z-10" style={{backgroundColor: phColors.bgCard, borderColor: phColors.border}}>
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <button onClick={() => setCurrentPage('map')} className="text-2xl font-bold transition" style={{color: phColors.accent}}>
              The F*** Map
            </button>
            <div className="flex gap-4">
              <button onClick={() => setCurrentPage('map')} style={{color: phColors.textGray}}>Map</button>
              <button style={{color: phColors.accent}} className="font-semibold">About</button>
              <button onClick={() => setCurrentPage('blog')} style={{color: phColors.textGray}}>Blog</button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-5xl font-bold mb-6" style={{color: phColors.text}}>About The F*** Map</h1>
          
          <div className="rounded-3xl p-8 mb-6 shadow-xl" style={{backgroundColor: phColors.bgCard, border: `1px solid ${phColors.border}`}}>
            <h2 className="text-2xl font-bold mb-4" style={{color: phColors.accent}}>What is this?</h2>
            <p className="leading-relaxed mb-4" style={{color: phColors.textGray}}>
              The F*** Map is an adult-oriented platform where users track sexual encounters by the citizenship 
              of their partners. Select countries to mark your "conquests" and compete on global leaderboards.
            </p>
            <p className="leading-relaxed" style={{color: phColors.textGray}}>
              This is not a travel tracker. This is not a friendship map. This is explicitly designed to track 
              sexual encounters with people from different countries.
            </p>
          </div>

          <div className="rounded-3xl p-8 mb-6 shadow-xl" style={{backgroundColor: phColors.bgCard, border: `1px solid ${phColors.border}`}}>
            <h2 className="text-2xl font-bold mb-4" style={{color: phColors.accent}}>How Scoring Works</h2>
            <p className="leading-relaxed mb-4" style={{color: phColors.textGray}}>
              Countries are worth different points based on population size. Smaller countries are harder to 
              "collect," so they're worth more points.
            </p>
            <div className="rounded-2xl p-6 space-y-2" style={{backgroundColor: phColors.bgLight}}>
              <div className="flex justify-between" style={{color: phColors.textGray}}>
                <span>1+ billion people</span>
                <span className="font-bold" style={{color: phColors.accent}}>1 point</span>
              </div>
              <div className="flex justify-between" style={{color: phColors.textGray}}>
                <span>100M - 1B</span>
                <span className="font-bold" style={{color: phColors.accent}}>2 points</span>
              </div>
              <div className="flex justify-between" style={{color: phColors.textGray}}>
                <span>50M - 100M</span>
                <span className="font-bold" style={{color: phColors.accent}}>3 points</span>
              </div>
              <div className="flex justify-between" style={{color: phColors.textGray}}>
                <span>10M - 50M</span>
                <span className="font-bold" style={{color: phColors.accent}}>5 points</span>
              </div>
              <div className="flex justify-between" style={{color: phColors.textGray}}>
                <span>5M - 10M</span>
                <span className="font-bold" style={{color: phColors.accent}}>8 points</span>
              </div>
              <div className="flex justify-between" style={{color: phColors.textGray}}>
                <span>1M - 5M</span>
                <span className="font-bold" style={{color: phColors.accent}}>12 points</span>
              </div>
              <div className="flex justify-between" style={{color: phColors.textGray}}>
                <span>100K - 1M</span>
                <span className="font-bold" style={{color: phColors.accent}}>20 points</span>
              </div>
              <div className="flex justify-between" style={{color: phColors.textGray}}>
                <span>Under 100K</span>
                <span className="font-bold" style={{color: phColors.accent}}>50 points</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl p-8 mb-6 shadow-xl" style={{backgroundColor: phColors.bgCard, border: `1px solid ${phColors.border}`}}>
            <h2 className="text-2xl font-bold mb-4" style={{color: phColors.accent}}>Privacy & Data</h2>
            <p className="leading-relaxed mb-4" style={{color: phColors.textGray}}>
              Your data is stored in Firebase (Google Cloud) and locally in your browser. We collect:
            </p>
            <ul className="space-y-2" style={{color: phColors.textGray}}>
              <li className="flex items-start">
                <span className="mr-2" style={{color: phColors.accent}}>•</span>
                <span>Username (public on leaderboards)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{color: phColors.accent}}>•</span>
                <span>Citizenship (public on leaderboards)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{color: phColors.accent}}>•</span>
                <span>Selected countries (stored privately)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{color: phColors.accent}}>•</span>
                <span>Score and timestamp</span>
              </li>
            </ul>
            <p className="text-sm mt-4" style={{color: phColors.textGray}}>
              We do NOT collect: IP addresses, emails, real names, or any identifying information beyond what you provide.
            </p>
          </div>

          <div className="rounded-3xl p-8 shadow-xl" style={{backgroundColor: phColors.bgCard, border: `1px solid ${phColors.border}`}}>
            <h2 className="text-2xl font-bold mb-4" style={{color: phColors.accent}}>Legal & Safety</h2>
            <p className="leading-relaxed mb-4" style={{color: phColors.textGray}}>
              By using this site, you confirm you are 18+ and understand this is adult content. 
              This platform is for entertainment purposes only.
            </p>
            <p className="leading-relaxed" style={{color: phColors.textGray}}>
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
      <div className="min-h-screen" style={{backgroundColor: phColors.bg, fontFamily: 'Montserrat, sans-serif'}}>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet" />
        
        {/* Header */}
        <div className="border-b sticky top-0 z-10" style={{backgroundColor: phColors.bgCard, borderColor: phColors.border}}>
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <button onClick={() => setCurrentPage('map')} className="text-2xl font-bold transition" style={{color: phColors.accent}}>
              The F*** Map
            </button>
            <div className="flex gap-4">
              <button onClick={() => setCurrentPage('map')} style={{color: phColors.textGray}}>Map</button>
              <button onClick={() => setCurrentPage('about')} style={{color: phColors.textGray}}>About</button>
              <button style={{color: phColors.accent}} className="font-semibold">Blog</button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-5xl font-bold mb-6" style={{color: phColors.text}}>Blog</h1>
          
          <div className="rounded-3xl p-8 mb-6 shadow-xl hover:border-opacity-100 transition cursor-pointer" style={{backgroundColor: phColors.bgCard, border: `1px solid ${phColors.border}`}}>
            <h2 className="text-2xl font-bold mb-3" style={{color: phColors.text}}>Welcome to The F*** Map</h2>
            <p className="text-sm mb-4" style={{color: phColors.textGray}}>January 15, 2024</p>
            <p className="leading-relaxed" style={{color: phColors.textGray}}>
              We're launching The F*** Map - a bold, unapologetic platform for tracking your international 
              sexual experiences. No euphemisms, no pretending this is about "travel" or "friendships." 
              This is exactly what it sounds like, and we're not ashamed of it.
            </p>
          </div>

          <div className="rounded-3xl p-8 mb-6 shadow-xl hover:border-opacity-100 transition cursor-pointer" style={{backgroundColor: phColors.bgCard, border: `1px solid ${phColors.border}`}}>
            <h2 className="text-2xl font-bold mb-3" style={{color: phColors.text}}>How to Increase Your Score</h2>
            <p className="text-sm mb-4" style={{color: phColors.textGray}}>January 10, 2024</p>
            <p className="leading-relaxed" style={{color: phColors.textGray}}>
              Want to top the leaderboards? Small countries = big points. Focus on rare citizenships like 
              Vatican City (50 points!), Nauru, Tuvalu, and other micro-nations. Or go for quantity with 
              the major population centers.
            </p>
          </div>

          <div className="rounded-3xl p-8 shadow-xl hover:border-opacity-100 transition cursor-pointer" style={{backgroundColor: phColors.bgCard, border: `1px solid ${phColors.border}`}}>
            <h2 className="text-2xl font-bold mb-3" style={{color: phColors.text}}>Safety First: Our Community Guidelines</h2>
            <p className="text-sm mb-4" style={{color: phColors.textGray}}>January 5, 2024</p>
            <p className="leading-relaxed" style={{color: phColors.textGray}}>
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
    <div className="min-h-screen" style={{backgroundColor: phColors.bg, fontFamily: 'Montserrat, sans-serif'}}>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet" />
      
      {/* Header */}
      <div className="border-b sticky top-0 z-10" style={{backgroundColor: phColors.bgCard, borderColor: phColors.border}}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-2xl font-bold" style={{color: phColors.accent}}>The F*** Map</h1>
              <p className="text-sm" style={{color: phColors.textGray}}>
                <MapPin className="inline w-4 h-4" /> {userInfo?.username} ({userInfo?.citizenship})
              </p>
            </div>
            <div className="flex gap-4">
              <button style={{color: phColors.accent}} className="font-semibold">Map</button>
              <button onClick={() => setCurrentPage('about')} style={{color: phColors.textGray}}>About</button>
              <button onClick={() => setCurrentPage('blog')} style={{color: phColors.textGray}}>Blog</button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-3xl font-bold" style={{color: phColors.accent}}>{totalScore}</div>
              <div className="text-sm" style={{color: phColors.textGray}}>{selectedCountries.size} countries</div>
              {myPosition && (
                <div className="text-xs" style={{color: phColors.textGray}}>
                  Global: #{myPosition} | {userInfo?.citizenship}: #{countryPosition}
                </div>
              )}
            </div>
            <button
              onClick={handleReset}
              className="transition"
              style={{color: phColors.textGray}}
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
            <div className="rounded-2xl shadow-xl p-4" style={{backgroundColor: phColors.bgCard, border: `1px solid ${phColors.border}`}}>
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:border-transparent"
                style={{backgroundColor: phColors.bgLight, border: `1px solid ${phColors.border}`, color: phColors.text}}
              />
            </div>

            {/* Country Grid by Continent */}
            <div className="rounded-2xl shadow-xl p-6" style={{backgroundColor: phColors.bgCard, border: `1px solid ${phColors.border}`}}>
              <div className="space-y-6 max-h-[600px] overflow-y-auto">
                {Object.entries(getFilteredCountriesByContinent()).map(([continent, countries]) => (
                  <div key={continent}>
                    <h3 className="text-lg font-bold mb-3 sticky top-0 py-2 border-b" style={{backgroundColor: phColors.bgCard, color: phColors.text, borderColor: phColors.border}}>
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
                            className="p-3 rounded-xl text-left transition shadow-lg"
                            style={{
                              backgroundColor: isSelected ? phColors.accent : phColors.bgLight,
                              color: isSelected ? phColors.bg : phColors.textGray,
                              border: `1px solid ${isSelected ? phColors.accent : phColors.border}`
                            }}
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
              onClick={handleShareClick}
              className="w-full py-4 rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2"
              style={{backgroundColor: phColors.accent, color: phColors.bg}}
              onMouseEnter={(e) => e.target.style.backgroundColor = phColors.accentHover}
              onMouseLeave={(e) => e.target.style.backgroundColor = phColors.accent}
            >
              <Share2 className="w-5 h-5" />
              Share My Score
            </button>
          </div>

          {/* Right Sidebar - Leaderboards */}
          <div className="space-y-4">
            {/* Global Leaderboard */}
            <div className="rounded-2xl shadow-xl p-4 sticky top-24" style={{backgroundColor: phColors.bgCard, border: `1px solid ${phColors.border}`}}>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5" style={{color: phColors.accent}} />
                <h2 className="font-bold text-lg" style={{color: phColors.text}}>Global Top 10</h2>
              </div>
              <div className="space-y-2">
                {leaderboard.slice(0, 10).map((entry, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <div className="flex-1 min-w-0">
                      <span className="font-bold" style={{color: phColors.textGray}}>#{idx + 1}</span>
                      <span className="ml-2 truncate" style={{color: phColors.text}}>{entry.userInfo.username}</span>
                      <span className="ml-1 text-xs" style={{color: phColors.textGray}}>({entry.userInfo.citizenship})</span>
                    </div>
                    <span className="font-bold ml-2" style={{color: phColors.accent}}>{entry.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Country Leaderboard */}
            {myLeaderboard.length > 0 && (
              <div className="rounded-2xl shadow-xl p-4" style={{backgroundColor: phColors.bgCard, border: `1px solid ${phColors.border}`}}>
                <h3 className="font-bold mb-2" style={{color: phColors.text}}>{userInfo.citizenship} Rankings</h3>
                <div className="space-y-2">
                  {myLeaderboard.slice(0, 5).map((entry, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="truncate" style={{color: phColors.textGray}}>
                        {entry.userInfo.username === userInfo.username
                          ? '⭐ You' 
                          : entry.userInfo.username}
                      </span>
                      <span className="font-bold ml-2" style={{color: phColors.accent}}>{entry.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div 
          className="fixed inset-0 bg-opacity-70 flex items-center justify-center p-4 z-50"
          style={{backgroundColor: 'rgba(0,0,0,0.9)'}}
          onClick={() => setShowShareModal(false)}
        >
          <div 
            className="rounded-3xl shadow-2xl max-w-md w-full p-6"
            style={{backgroundColor: phColors.bgCard, border: `1px solid ${phColors.border}`}}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{color: phColors.text}}>Share Your Score</h3>
              <button onClick={() => setShowShareModal(false)} style={{color: phColors.textGray}}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="rounded-2xl p-4 mb-6" style={{backgroundColor: phColors.bgLight}}>
              <p className="text-center text-lg mb-2" style={{color: phColors.text}}>
                🔥 I scored <span style={{color: phColors.accent}} className="font-bold">{totalScore} points</span> across {selectedCountries.size} countries!
              </p>
              {countryPosition && (
                <p className="text-center text-sm" style={{color: phColors.textGray}}>
                  Ranked #{countryPosition} in {userInfo?.citizenship}
                </p>
              )}
            </div>
            
            <p className="text-sm mb-4 text-center" style={{color: phColors.textGray}}>
              Challenge your friends to beat your score!
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => shareToSocial('instagram')}
                className="w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                style={{backgroundColor: '#E4405F', color: '#FFFFFF'}}
              >
                <Instagram className="w-5 h-5" />
                Share to Instagram
              </button>
              <button
                onClick={() => shareToSocial('twitter')}
                className="w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                style={{backgroundColor: '#1DA1F2', color: '#FFFFFF'}}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Share to X (Twitter)
              </button>
              <button
                onClick={() => shareToSocial('bluesky')}
                className="w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                style={{backgroundColor: '#0085ff', color: '#FFFFFF'}}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 01-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z"/>
                </svg>
                Share to Bluesky
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div 
          className="fixed inset-0 bg-opacity-70 flex items-center justify-center p-4 z-50"
          style={{backgroundColor: 'rgba(0,0,0,0.9)'}}
          onClick={() => setShowResetConfirm(false)}
        >
          <div 
            className="rounded-3xl shadow-2xl max-w-md w-full p-6"
            style={{backgroundColor: phColors.bgCard, border: `1px solid ${phColors.border}`}}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4" style={{color: phColors.text}}>Reset Your Progress?</h3>
            <p className="mb-6" style={{color: phColors.textGray}}>
              This will clear all your selected countries and reset your score to 0. 
              You'll be able to start over with a new username. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 rounded-xl font-semibold transition"
                style={{backgroundColor: phColors.bgLight, color: phColors.text}}
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="flex-1 py-3 rounded-xl font-bold transition shadow-lg"
                style={{backgroundColor: phColors.accent, color: phColors.bg}}
                onMouseEnter={(e) => e.target.style.backgroundColor = phColors.accentHover}
                onMouseLeave={(e) => e.target.style.backgroundColor = phColors.accent}
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
