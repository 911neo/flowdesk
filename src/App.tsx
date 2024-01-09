import React, { useState } from 'react';
import './App.css';
import { Button } from "@/components/ui/button"
import { DataTableDemo } from '../src/bi_components/tableView';

const Spinner = () => (
  <div className="spinner-container flex items-center justify-center">
    <div className="spinner border-t-8 border-blue-500 rounded-full w-16 h-16"></div>
  </div>
);

const App = () => {
  const [pair, setPair] = useState('BTCUSDT');
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setPair(event.target.value.toUpperCase());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    try {
      const tickerResponse = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${pair}`);
      const tickerData = await tickerResponse.json();

      const twentyFourHourTickerResponse = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${pair}`);
      const twentyFourHourTickerData = await twentyFourHourTickerResponse.json();

      const recentTradesResponse = await fetch(`https://api.binance.com/api/v3/trades?symbol=${pair}`);
      const recentTradesData = await recentTradesResponse.json();

      setMarketData({
        ticker: tickerData,
        twentyFourHourTicker: twentyFourHourTickerData,
        recentTrades: recentTradesData,
      });
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container shadow-lg p-6 rounded-md" style={{ background: 'linear-gradient(to right, #000000, #000066)' }}>
      <form onSubmit={handleSubmit} className="mb-4">
        <label className="block mb-2 text-lg text-white">
          Select a trading pair:
          <select
            value={pair}
            onChange={handleChange}
            className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white text-gray-800"
          >
            <option value="BTCUSDT">BTC/USDT</option>
            <option value="ETHUSDT">ETH/USDT</option>
            <option value="BNBUSDT">BNB/USDT</option>
            <option value="XRPUSDT">XRP/USDT</option>
            <option value="LTCUSDT">LTC/USDT</option>
            <option value="ADAUSDT">ADA/USDT</option>
            <option value="DOTUSDT">DOT/USDT</option>
          </select>
        </label>

        <Button
          type="submit"
          className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none transition-all duration-300"
          disabled={loading}
        >
          {loading ? <Spinner /> : 'Fetch Market Data'}
        </Button>
      </form>

      {marketData && (
        <div className="market-data-container shadow-lg p-6 rounded-md bg-white mt-4">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Market Data for {pair}</h2>
          <div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Ticker Price: {marketData.ticker.price}</h3>
            <h3 className="text-xl font-bold mb-2 text-gray-800">24h Ticker Data:</h3>
            <p className="text-gray-800">High: {marketData.twentyFourHourTicker.highPrice}</p>
            <p className="text-gray-800">Low: {marketData.twentyFourHourTicker.lowPrice}</p>
          </div>
          <h3 className="text-xl font-bold mt-4 mb-2 text-gray-800">Recent Trades:</h3>

          <DataTableDemo data={marketData?.recentTrades || []} />
        </div>
      )}
    </div>
  );
};

export default App;

