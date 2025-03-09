'use client';

interface WeatherForecastProps {
  date: string;
  location: string;
}

export default async function WeatherForecast({ date, location }: WeatherForecastProps) {
  // Note: You'll need to sign up for a weather API service
  const weatherData = {
    temperature: "22°C",
    condition: "Partly Cloudy",
    icon: "🌤️"
  };

  return (
    <div className="p-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg">
      <p className="text-sm text-gray-500 mb-2">Weather Forecast</p>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{weatherData.icon}</span>
        <div>
          <p className="font-semibold">{weatherData.temperature}</p>
          <p className="text-sm text-gray-600">{weatherData.condition}</p>
        </div>
      </div>
    </div>
  );
} 