import { useState } from "react";
import Login from "./pages/Login";
import Otp from "./pages/Otp";
import Chat from "./pages/Chat";


function App() {
  const [emailForOtp, setEmailForOtp] = useState(null);
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  if (loggedIn) {
    return <Chat />;
  }

  if (emailForOtp) {
    return (
      <Otp
        email={emailForOtp}
        onSuccess={() => {
          localStorage.removeItem("otp_email"); // CLEAN UP
          setLoggedIn(true);
        }}
        
      />
    );
  }

  return <Login onOtpRequired={setEmailForOtp} />;
}

export default App;
