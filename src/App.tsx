import { ChakraProvider } from "@chakra-ui/react";
import "./App.css";
import { Chart } from "./pages/chart";

function App() {
  return (
      <ChakraProvider>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Chart />
        </div>
      </ChakraProvider>
  );
}

export default App;
