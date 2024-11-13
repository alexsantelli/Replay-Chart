/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  CardBody,
  SimpleGrid,
  Stack,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
const ActionButton = ({
  currentPrice,
  initialDuration,
  setInitialDuration,
  initHistoryDuration,
  slTpAction,
  stopLossPrice,
  takeProfitPrice,
  resetLines,
  limitOrderPrice,
  limitOrderExecuted
}: {
  currentPrice: number;
  initialDuration: any;
  setInitialDuration: any;
  slTpAction: any;
  stopLossPrice: number;
  takeProfitPrice: number;
  resetLines: any;
  initHistoryDuration: {
    start: number;
    end: number;
  };
  limitOrderPrice: number;
  limitOrderExecuted:any
}) => {
  const [value, onChange] = useState<Value>([
    new Date(initHistoryDuration.start),
    new Date(initHistoryDuration.end),
  ]);
  const [buyPrice, setBuyPrice] = useState<number>(0);
  const [sellPrice, setSellPrice] = useState<number>(0);
  const [pnl, setPnl] = useState<number>(0);
  const [tradeClosed, setTradeClosed] = useState<boolean>(true);

  useEffect(() => {
    if (buyPrice > 0 && !tradeClosed) {
      setPnl(((currentPrice - buyPrice) / buyPrice) * 100);
      if (currentPrice <= stopLossPrice || currentPrice >= takeProfitPrice) {
     
        setTradeClosed(true);
        setSellPrice(currentPrice);
        resetLines();
      }
     
      // if (currentPrice <= stopLossPrice || currentPrice >= takeProfitPrice) {
      //   setTradeClosed(true);
      //   resetLines();
      // }
    }
    console.log("limit order hit", currentPrice, limitOrderPrice,tradeClosed);
    if (currentPrice < limitOrderPrice && tradeClosed)  {
      setBuyPrice(currentPrice);
      setSellPrice(0);
      setTradeClosed(false);
      limitOrderExecuted();
      slTpAction();
    }
  }, [currentPrice]);
  return (
    <Stack marginTop={35}>
      <SimpleGrid
        spacing={1}
        templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
      >
        <Card>
          <CardBody>
            <Text>
              Start: {new Date(initialDuration.start).toDateString()} - End:{" "}
              {new Date(initialDuration.end).toDateString()}
            </Text>
            <DateRangePicker
              onChange={(value: Value) => {
                if (value instanceof Array && value[0] && value[1]) {
                  const selectedDate = {
                    start: new Date(value[0].getTime()),
                    end: new Date(value[1].getTime()),
                  };
                  setInitialDuration(selectedDate);
                  console.log(selectedDate);
                }

                onChange(value);
              }}
              value={value}
              minDate={new Date(initHistoryDuration.start)}
              maxDate={new Date(initHistoryDuration.end)}
            />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stack justifyContent={"center"} flexDirection={"row"}>
              <Button
                colorScheme="green"
                variant="outline"
                size="lg"
                onClick={() => {
                  setBuyPrice(currentPrice);
                  setSellPrice(0);
                  setTradeClosed(false);
                  slTpAction();

                  //   pnl percentage
                }}
              >
                Buy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setBuyPrice(0);
                  setSellPrice(0);
                  setTradeClosed(false);
                  setPnl(0);
                  resetLines();
                }}
              >
                Reset
              </Button>
              <Button
                colorScheme="red"
                variant="outline"
                size="lg"
                onClick={() => {
                  setSellPrice(currentPrice);
                  setTradeClosed(true);
                  resetLines();
                }}
              >
                Sell
              </Button>
            </Stack>
            <Stack justifyContent={"center"} flexDirection={"row"}>
              <Text>Buy Price: {buyPrice}</Text>
              <Text>Sell Price: {sellPrice}</Text>
            </Stack>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatNumber>Current Price: {currentPrice}</StatNumber>
              <StatLabel>PnL {tradeClosed ? " (closed)" : ""}</StatLabel>
              <StatHelpText>
                <StatArrow type={pnl < 0 ? "decrease" : "increase"} />
                {pnl.toFixed(2)} %
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Stack>
  );
};

export default ActionButton;
