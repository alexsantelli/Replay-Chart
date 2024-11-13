/* eslint-disable @typescript-eslint/no-explicit-any */
import { Stack } from "@chakra-ui/react";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import React, { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import { CirclesWithBar } from "react-loader-spinner";
import { usePapaParse } from "react-papaparse";
import { ChartContainer } from "../../components/chart";
import { getFormattedTime } from "../../components/chart/Constant";
// import csvFile from '../../assets/tickers/XAUUSD.csv'
let firstLoad = true

// import siteListCSV from '../../assets/tickers/'
export const Chart: React.FC = () => {
  const selectedTicker = "XAUUSD.csv";
  const interval = "15";

  const [initialDuration, setInitialDuration] = useState({});
  const [initHistoryDuration, setInitHistoryDuration] = useState({
    start: 0,
    end: 0,
  });
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [fileLoaded, setFileLoaded] = useState(false);
  const { readString } = usePapaParse();

  useEffect(() => {
    if (firstLoad) {
      firstLoad = false
      const historyArray: any = [];
      fetch("/src/assets/tickers/XAUUSD.csv")
        .then((res) => res.text())
        .then((stringData) => {
          readString(stringData, {
            worker: true,
            header: true,
            step: (results) => {
              historyArray.push(results.data);
            },
            complete: () => {
              // const historyArray = results.data;
              console.log("historyArray", historyArray.length);
              setHistoryData(historyArray);
              console.log("historyArray", historyArray);
              const init = {
                start: getFormattedTime(
                  20220107,
                  historyArray[0].time
                ),
                end: getFormattedTime(
                  20220121,
                  historyArray[historyArray.length - 1].time
                ),
              };
              setInitHistoryDuration(init);
              setInitialDuration(init);
              setFileLoaded(true);
            },
          });
        })
        .catch((err) => {
          console.log(err);
          alert("Error reading file");
        });
    }
  }, []);

  return (
    <Stack>
      <CirclesWithBar
        height="100"
        width="100"
        color="#4fa94d"
        outerCircleColor="#4fa94d"
        innerCircleColor="#4fa94d"
        barColor="#4fa94d"
        ariaLabel="circles-with-bar-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={!fileLoaded}
      />
      {fileLoaded && (
        <ChartContainer
          ticker={selectedTicker}
          history={historyData}
          interval={interval}
          initialDuration={initialDuration}
          initHistoryDuration={initHistoryDuration}
          setInitialDuration={setInitialDuration}
        />
      )}
    </Stack>
  );
};
