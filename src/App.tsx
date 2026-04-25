import { Toaster } from "sonner";
import { Layout } from "./components/layouts/Layout";

const App = () => {
  return (
    <>
      <Toaster
        position="bottom-right"
        closeButton
        toastOptions={{
          className:
            "font-sans bg-white/70 backdrop-blur-md border border-emerald-100 shadow-lg rounded-xl",
        }}
      />
      <Layout />
    </>
  );
};

export default App;
