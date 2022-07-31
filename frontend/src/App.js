// routes
import Router from './routes';
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

// theme
import ThemeProvider from './theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// components
import ScrollToTop from './components/ScrollToTop';
import moment from 'moment';

// ----------------------------------------------------------------------

export default function App() {

  const [isLogout, setLogout] = useState(false);
  const navigate = useNavigate();

  let timer = undefined;

  const events = ['click', 'keydown'];

  useEffect(() => {
    addEvents();
    return () => {
      removeEvents();
      clearTimeout(timer);
    };
  }, []);

  const eventHandler = (eventType) => {
    if (!isLogout) {
      localStorage.setItem('lastInteractionTime', moment());
      if (timer) {
        startTimer();
      }
    }
  };

  const addEvents = () => {
    events.forEach((eventName) => {
      window.addEventListener(eventName, eventHandler);
    });
    startTimer();
  };

  const removeEvents = () => {
    events.forEach((eventName) => {
      window.removeEventListener(eventName, eventHandler);
    });
  };


  const startTimer = () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      let lastInteractionTime = localStorage.getItem('lastInteractionTime');
      const diff = moment.duration(moment().diff(moment(lastInteractionTime)));
      console.log("diff", diff._milliseconds);
      if (diff._milliseconds > 600000) { // setIdle Timeout 10 minutes.
        console.log("logout Triggereddddd");
        removeEvents();
        setLogout(true);
        localStorage.clear();
        navigate('/admin/login', { replace: true });
      }
    }, 1000);

  };

  return (
    <ThemeProvider>
      <ScrollToTop />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* Same as */}
      <ToastContainer />
      <Router />
    </ThemeProvider>
  );
}
