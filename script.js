document.addEventListener('DOMContentLoaded', () => {
    // Initialize with default city
    fetchWeather('Kolkata');
    
    // Set up search functionality
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    
    searchBtn.addEventListener('click', () => {
        const city = searchInput.value.trim();
        if (city) {
            fetchWeather(city);
        }
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = searchInput.value.trim();
            if (city) {
                fetchWeather(city);
            }
        }
    });
});

function fetchWeather(city) {
    const loader = document.querySelector('.loader');
    loader.classList.add('active');
    
    // For demo purposes, we'll use a free API key
    // Note: In production, you should use your own API key and secure it properly
    const apiKey = '439d4b804bc8187953eb36d2a8c26a02'; // OpenWeatherMap free tier key
    const currentWeatherUrl = `https://openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    // Fetch current weather
    fetch(currentWeatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            updateCurrentWeather(data);
            loader.classList.remove('active');
        })
        .catch(error => {
            console.error('Error fetching current weather:', error);
            alert('Error fetching weather data. Please try another city.');
            loader.classList.remove('active');
        });
}

function updateCurrentWeather(data) {
    // Update location
    document.querySelector('.location').textContent = data.name;
    
    // Update date
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.querySelector('.date').textContent = now.toLocaleDateString('en-US', options);
    
    // Update temperature
    const tempElement = document.querySelector('.temperature');
    tempElement.innerHTML = `${Math.round(data.main.temp)}<span>°C</span>`;
    
    // Update description
    const description = data.weather[0].description;
    document.querySelector('.description').textContent = description;
    
    // Update details
    document.querySelector('.detail-item:nth-child(1) .detail-value').textContent = `${data.wind.speed} km/h`;
    document.querySelector('.detail-item:nth-child(2) .detail-value').textContent = `${data.main.humidity}%`;
    document.querySelector('.detail-item:nth-child(3) .detail-value').textContent = `${data.main.pressure} hPa`;
    document.querySelector('.detail-item:nth-child(4) .detail-value').textContent = `${data.visibility / 1000} km`;
    
    // Update weather icon and animations
    updateWeatherIcon(data.weather[0].icon, data.weather[0].main);
    
    // Update background based on weather and time
    updateBackground(data.weather[0].main, data.sys.sunrise, data.sys.sunset);
}

function updateWeatherIcon(iconCode, weatherMain) {
    const iconContainer = document.getElementById('weather-icon');
    iconContainer.innerHTML = '';
    
    // Clear any previous weather animations
    document.body.className = '';
    
    // Map OpenWeatherMap icon codes to Font Awesome icons
    const iconMap = {
        '01d': 'sun',          // clear sky day
        '01n': 'moon',         // clear sky night
        '02d': 'cloud-sun',    // few clouds day
        '02n': 'cloud-moon',   // few clouds night
        '03d': 'cloud',        // scattered clouds
        '03n': 'cloud',
        '04d': 'cloud',        // broken clouds
        '04n': 'cloud',
        '09d': 'cloud-rain',   // shower rain
        '09n': 'cloud-rain',
        '10d': 'cloud-sun-rain', // rain day
        '10n': 'cloud-moon-rain', // rain night
        '11d': 'bolt',         // thunderstorm
        '11n': 'bolt',
        '13d': 'snowflake',    // snow
        '13n': 'snowflake',
        '50d': 'smog',         // mist
        '50n': 'smog'
    };
    
    const icon = document.createElement('i');
    icon.className = `fas fa-${iconMap[iconCode] || 'cloud'}`;
    icon.style.fontSize = '5rem';
    icon.style.color = iconCode.includes('d') ? '#FFA500' : '#4361ee';
    
    iconContainer.appendChild(icon);
    
    // Add weather-specific animations
    if (weatherMain === 'Clear') {
        if (iconCode.includes('d')) {
            // Sunny animation
            const sun = document.createElement('div');
            sun.className = 'sun';
            iconContainer.appendChild(sun);
            
            for (let i = 1; i <= 4; i++) {
                const ray = document.createElement('div');
                ray.className = `sun-ray ray-${i}`;
                iconContainer.appendChild(ray);
            }
        } else {
            // Night animation (stars could be added here)
            document.body.classList.add('night');
        }
    } else if (weatherMain === 'Clouds') {
        // Cloud animation
        for (let i = 1; i <= 3; i++) {
            const cloud = document.createElement('div');
            cloud.className = `cloud cloud-${i}`;
            iconContainer.appendChild(cloud);
        }
    } else if (weatherMain === 'Rain') {
        // Rain animation
        for (let i = 0; i < 20; i++) {
            const rain = document.createElement('div');
            rain.className = 'rain';
            rain.style.left = `${Math.random() * 100}%`;
            rain.style.animationDelay = `${Math.random() * 2}s`;
            iconContainer.appendChild(rain);
        }
    } else if (weatherMain === 'Thunderstorm') {
        // Thunderstorm animation (could add lightning flashes)
        document.body.style.animation = 'lightning 5s infinite';
    } else if (weatherMain === 'Snow') {
        // Snow animation
        for (let i = 0; i < 30; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.innerHTML = '❄';
            snowflake.style.left = `${Math.random() * 100}%`;
            snowflake.style.animationDelay = `${Math.random() * 5}s`;
            iconContainer.appendChild(snowflake);
        }
    }
}

function updateBackground(weatherMain, sunrise, sunset) {
    // Clear any previous weather classes
    document.body.className = '';
    
    const now = new Date().getTime() / 1000;
    const isNight = now < sunrise || now > sunset;
    
    if (isNight) {
        document.body.classList.add('night');
    }
    
    // Add weather-specific background class
    if (weatherMain) {
        document.body.classList.add(weatherMain.toLowerCase());
    }
}
