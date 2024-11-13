# Trading View Replay Chart

A powerful, interactive replay charting system built with TypeScript, React, and Vite, designed to visualize historical tick data using TradingView’s charting library. This application allows users to simulate trading actions such as buying and selling while calculating profit and loss (PnL) in real-time. The example data uses tick data for the Forex pair XAUUSD.

## Features

- **Replay Historical Data**: Stream tick data from CSV format onto TradingView’s chart, creating an accurate historical playback.
- **Real-Time Simulation**: Use the play button to begin streaming data in real time.
- **Trading Simulation**: Simulate buy and sell actions and track profit and loss (PnL).
- **Customizable UI**: Styled with Chakra UI and integrated with date range selection for streamlined data analysis.

## Tech Stack

- **Frontend**: TypeScript, React, Vite
- **UI Components**: Chakra UI, Framer Motion for animations
- **Data Parsing**: Papaparse for CSV data handling

## Prerequisites

- [TradingView Charting Library](https://www.tradingview.com/HTML5-stock-forex-bitcoin-charting-library/): Request access to the library from TradingView and add it to the `assets` folder.

## Project Structure

- **CSV Data**: Load tick data in CSV format for historical data replay.
- **Chart Rendering**: Renders data using TradingView’s charting library.
- **Buy/Sell Simulation**: Actions are simulated with real-time updates to PnL calculations.

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/trading-view-replay.git
   cd trading-view-replay
   ```

2. **Add TradingView’s Charting Library**

   Request access to the TradingView charting library, download it, and place it in the `assets` folder.

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Run the Development Server**

   Start the Vite development server:

   ```bash
   npm run dev
   ```

5. **Build for Production**

   To create a production build, use:

   ```bash
   npm run build
   ```

6. **Preview Production Build**

   To preview the production build, run:

   ```bash
   npm run preview
   ```

## Scripts

- **`npm run dev`**: Runs the Vite development server.
- **`npm run build`**: Builds the project for production.
- **`npm run lint`**: Lints the project with ESLint.
- **`npm run preview`**: Previews the production build locally.

## Dependencies

- **UI Libraries**: Chakra UI, Emotion for styling
- **Data Parsing**: Papaparse, Lodash for utility functions
- **Date Handling**: Moment.js, react-daterange-picker for date range selection

## Development Dependencies

- **Linting**: ESLint with TypeScript and React hooks support
- **Types**: TypeScript definitions for lodash, react, and react-dom

## Usage

- Use the **play button** to start the replay of historical tick data.
- Set your buy/sell actions and monitor real-time PnL.
- Customize time ranges using the date range picker.
