/* eslint-disable @typescript-eslint/no-explicit-any */

import { Stack } from "@chakra-ui/react";
import _ from "lodash";
import * as React from "react";
import { useEffect, useRef } from "react";
import * as TradingView from "../../charting_library";
import {
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from "../../charting_library";

import ActionButton from "./ActionButton";
import {
  ChartConfigurationData,
  StopButtonInnerHTML,
  getOHLC,
} from "./Constant";
import "./index.css";
let profitLine: any;
let stopLossLine: any;
let pendingOrderLine: any;

let isReplay: boolean = false;
let playPause: boolean = false;
let realtimeReplayData: any[] = [];
const sleepTimer = (ms: number) => new Promise((res) => setTimeout(res, ms));
export let widgetApi = {} as TradingView.IChartingLibraryWidget;


export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions["symbol"];
  libraryPath: ChartingLibraryWidgetOptions["library_path"];
  fullscreen: ChartingLibraryWidgetOptions["fullscreen"];
  autosize: ChartingLibraryWidgetOptions["autosize"];
  studiesOverrides: ChartingLibraryWidgetOptions["studies_overrides"];
  container: ChartingLibraryWidgetOptions["container"];
}

const ChartContainer = ({
  ticker,
  history,
  interval,
  initialDuration,
  setInitialDuration,
  initHistoryDuration,
}: {
  ticker: string;
  history: any;
  interval: string;
  initialDuration: any;
  setInitialDuration: any;
  initHistoryDuration: {
    start: number;
    end: number;
  };
}) => {
  const [currentPrice, setCurrentPrice] = React.useState<number>(0);
  const [tvWidget, setTvWIdget] = React.useState(
    {} as TradingView.IChartingLibraryWidget
  );
  const [stopLossPrice, setStopLossPrice] = React.useState<number>(0);
  const [takeProfitPrice, setTakeProfitPrice] = React.useState<number>(0);
  const [limitOrderPrice, setLimitOrderPrice] = React.useState<number>(0);

  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;


  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: ticker,
      interval: interval as ResolutionString,
      library_path: "/charting_library/",
      charts_storage_url: "https://saveload.tradingview.com",
      charts_storage_api_version: "1.1",
      client_id: "tradingview.com",
      user_id: "public_user_id",
      fullscreen: false,
      autosize: true,
      studies_overrides: {},
      datafeed: {
        onReady: (callback: any) => {
          console.log("[onReady]: Method call");
          setTimeout(() => callback(ChartConfigurationData), 20);
        },
        searchSymbols: () => {
          console.log("[searchSymbols]: Method call");
        },
        resolveSymbol: (symbolName: any, onSymbolResolvedCallback: any) => {
          console.log("[resolveSymbol]: Method call", symbolName);
          const symbol_stub = {
            name: symbolName,
            ticker: symbolName,

            has_intraday: true,
            intraday_multipliers: ["1"],
            minmov: 1,
            session: "24x7",
            pricescale: Math.pow(10, 2),
          };
          onSymbolResolvedCallback(symbol_stub);
        },

        getBars: (
          symbolInfo: any,
          resolution: any,
          periodParams: any,
          onHistoryCallback: any
        ) => {
          try {
            console.log("[getBars]: Method call", symbolInfo, resolution);
            // return   onHistoryCallback([], { noData: true });
            const { firstDataRequest } = periodParams;
            // if (isReplay) {
            if (!firstDataRequest) {
              onHistoryCallback([], {
                noData: true,
              });
              return;
            }
            const data = getOHLC(history);
            if (!data) {
              onHistoryCallback([], { noData: true });
              return;
            }
            const [historyData, a] = _.partition(data, function (item) {
              return item.time <= initialDuration.start;
            });
            setCurrentPrice(historyData[historyData.length - 1].close);
            realtimeReplayData = [...a];

            onHistoryCallback(historyData, {
              noData: true,
            });
          } catch (error) {
            console.log("error", error);
          }
        },
        subscribeBars: async (
          symbolInfo: any,
          resolution: any,
          onRealtimeCallback: any,
          subscribeUID: any
        ) => {
          if (!isReplay) {
            await sleepTimer(500);
            let lastBarIndex = 0;

            while (lastBarIndex < realtimeReplayData.length || !isReplay) {
              if (playPause) {
                setCurrentPrice(realtimeReplayData[lastBarIndex].close);
                onRealtimeCallback(realtimeReplayData[lastBarIndex]);
                let increment = 1;
                if (resolution === 5) {
                  increment = 5;
                } else if (resolution === "60") {
                  increment = 60;
                }
                lastBarIndex += increment;
              }

              await sleepTimer(100);
            }

            return;
          }
          console.log(
            "[subscribeBars]: Method call with subscribeUID:",
            subscribeUID
          );
        },

        unsubscribeBars: (subscriberUID: any) => {
          console.log(
            "[unsubscribeBars]: Method call with subscriberUID:",
            subscriberUID
          );
        },
      },
      debug: false,
      container: chartContainerRef.current,
      locale: "en",
      disabled_features: [
        "header_symbol_search",
        "header_compare",
        "symbol_search_hot_key",
        "main_series_scale_menu",
        "display_market_status",
        "uppercase_instrument_names",
        "vert_touch_drag_scroll",
        "volume_force_overlay",
        "create_volume_indicator_by_default",
      ],
      enabled_features: [
        "side_toolbar_in_fullscreen_mode",
        "header_in_fullscreen_mode",
        "hide_left_toolbar_by_default",
        "show_zoom_and_move_buttons_on_touch",
      ],
      overrides: {},
    };
    // Adding symbol to the widgetOptions to load on start of the widget.
    setTvWIdget(new TradingView.widget(widgetOptions));
  }, [initialDuration]);
  // Set widgetApi
  useEffect(() => {
    widgetApi = tvWidget;
  }, [tvWidget]);
  useEffect(() => {
    tvWidget?.onChartReady?.(() => {
      tvWidget?.headerReady().then(() => {
        if (isReplay) {
          const stopButton = tvWidget.createButton();
          stopButton.innerHTML = StopButtonInnerHTML;
          stopButton.addEventListener("click", () => {
            isReplay = false;
            playPause = false;
          });
        }
        const button = tvWidget.createButton();
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" focusable="false" viewBox="0 0 26 26">
              <circle cx="13" cy="13" r="11" fill="none" stroke="currentColor" stroke-width="2"/>
              <path fill="currentColor" d="M17 13l-6 4V9"/>
          `;

        button.addEventListener("click", () => {
          playPause = !playPause;
          button.textContent = playPause ? "Pause" : "Play";
          button.innerHTML = playPause
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M6.25 10.725a.625.625 0 0 1-.625-.625V5.9a.625.625 0 1 1 1.25 0v4.2c0 .345-.28.625-.625.625Zm3.5 0a.625.625 0 0 1-.625-.625V5.9a.625.625 0 1 1 1.25 0v4.2c0 .345-.28.625-.625.625ZM8 13.75a5.75 5.75 0 1 0 0-11.5 5.75 5.75 0 0 0 0 11.5ZM15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" clip-rule="evenodd"/>
            </svg>
            `
            : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" focusable="false" viewBox="0 0 26 26">
              <circle cx="13" cy="13" r="11" fill="none" stroke="currentColor" stroke-width="2"/>
              <path fill="currentColor" d="M17 13l-6 4V9"/>
            </svg>
            `;
        });
      });
      tvWidget?.subscribe("onAutoSaveNeeded", function () {
        tvWidget?.save(function (data) {
          localStorage.setItem("chartData", JSON.stringify(data));
        });
      });

      // Create buy order line
    });
  }, [tvWidget]);
  const addTPandSL = () => {
    setTakeProfitPrice(currentPrice * 1.01)
    setStopLossPrice(currentPrice * 0.99);

    profitLine = tvWidget
      ?.activeChart?.()
      .createOrderLine({ disableUndo: false });
    stopLossLine = tvWidget
      ?.activeChart?.()
      .createOrderLine({ disableUndo: false });
    profitLine
      .setText((currentPrice * 1.01 - currentPrice).toFixed(2) + " (" + (1).toFixed(2) + "%)")
      .setLineLength(2)
      .setPrice(currentPrice * 1.01)
      .setQuantity(1000)
      .setLineStyle(0) // Solid line
      .setLineColor("#4CAF50") // Green color
      .setBodyBorderColor("#4CAF50")
      .setBodyTextColor("#4CAF50") // Green color
      // .setBodyBackgroundColor("#4CAF50")
      .setQuantityBackgroundColor("#4CAF50")
      //  .setCancelButton(false)
      .onMove(function (this: any) {
        profitLine.setText(
          (profitLine.getPrice() - currentPrice).toFixed(2) +
          " (" +
          (
            ((profitLine.getPrice() - currentPrice) / currentPrice) *
            100
          ).toFixed(2) +
          "%)"
        );

        if (profitLine.getPrice() <= currentPrice) {
          // alert("Take profit price should be greater than current price");

          // setTakeProfitPrice(1.0001 * currentPrice);
          // profitLine.setPrice(1.0001 * currentPrice);
          setTakeProfitPrice(profitLine.getPrice());
        } else {
          setTakeProfitPrice(profitLine.getPrice());
        }
      })
      .onModify(function (this: any) { });
    // Create sell order line
    stopLossLine
      .setText(
        (currentPrice * 0.99 - currentPrice).toFixed(2) +
        " (" +
        (-1).toFixed(2) +
        "%)"
      )
      .setLineLength(2)
      .setPrice(currentPrice * 0.99)
      .setLineStyle(0) // Solid line
      .setLineColor("#F44336") // Red color
      .setBodyBorderColor("#F44336")
      .setQuantityBackgroundColor("#F44336")
      .setQuantity(1000)
      .setBodyTextColor("#F44336") // Green color
      .setCancelTooltip("Cancel order")
      .setCancellable(true)
      .setCancelButtonBorderColor("yellow")
      .onMove(function (this: any) {
        stopLossLine.setText(
          (stopLossLine.getPrice() - currentPrice).toFixed(2) +
          " (" +
          (
            ((stopLossLine.getPrice() - currentPrice) / currentPrice) *
            100
          ).toFixed(2) +
          "%)"
        );
        if (stopLossLine.getPrice() >= currentPrice) {
          // alert("Stop Loss price should be less than current price");
          // stopLossLine.setPrice(0.999 * currentPrice);
          // setStopLossPrice(0.999 * currentPrice);
          setStopLossPrice(stopLossLine.getPrice());
        } else {
          setStopLossPrice(stopLossLine.getPrice());
        }
      })
      .onModify(function (this: any) { });
  };

  return (
    <Stack>
      <ActionButton
        currentPrice={currentPrice}
        initHistoryDuration={initHistoryDuration}
        initialDuration={initialDuration}
        setInitialDuration={setInitialDuration}
        slTpAction={addTPandSL}
        resetLines={() => {
          if (profitLine && profitLine.remove) {
            profitLine.remove();
            profitLine = null;
          }
          if (stopLossLine && stopLossLine.remove) {
            stopLossLine.remove();
            stopLossLine = null;
          }
          if (pendingOrderLine && pendingOrderLine.remove) {
            pendingOrderLine.remove();
            pendingOrderLine = null;
            setLimitOrderPrice(0);
          }
          setTakeProfitPrice(0);
          setStopLossPrice(0);
        }}
        limitOrderExecuted={() => {
          if (pendingOrderLine && pendingOrderLine.remove) {
            pendingOrderLine.remove();
            pendingOrderLine = null;
            setLimitOrderPrice(0);
          }
        }}
        // setStopLossPrice={
        //   (e:Event) =>{
        //     if (e.target instanceof HTMLInputElement && !isNaN(parseFloat(e.target.value)) && parseFloat(e.target.value)>0) {
        //       setStopLossPrice(parseFloat(e.target.value));
        //       if (stopLossLine){
        //         stopLossLine.setPrice(parseFloat(e.target.value))
        //       }
        //     }
        //   }
        // }
        // setTakeProfitPrice={(e:Event) =>{
        //   if (e.target instanceof HTMLInputElement && !isNaN(parseFloat(e.target.value)) && parseFloat(e.target.value)>0) {
        //     setTakeProfitPrice(parseFloat(e.target.value));
        //     if (profitLine){
        //       profitLine.setPrice(parseFloat(e.target.value))
        //       profitLine.setText("+"+(parseFloat(e.target.value)-currentPrice).toFixed(2))
        //     }
        //   }
        // }}
        stopLossPrice={stopLossPrice}
        takeProfitPrice={takeProfitPrice}
        limitOrderPrice={limitOrderPrice}
      />
      <div ref={chartContainerRef} className={"TVChartContainer"} />
    </Stack>
  );
};

export { ChartContainer };
