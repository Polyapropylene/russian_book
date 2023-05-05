import './App.css';

import { useState, useEffect } from 'react';
import { typography } from '@salutejs/plasma-tokens';
import { IconChevronLeft } from '@salutejs/plasma-icons';
import { createAssistant, AssistantAppState, createSmartappDebugger } from '@salutejs/client';
import { FrameContainer } from './components/FrameContainer/FrameContainer.jsx';
import { FrameContainerWeb } from './components/FrameContainer/FrameContainerWeb.jsx';
//import { FRAMES } from './components/FrameContainer/Frames.js'

import {
  AlertItem, ModalDebug, add_evg_func,
  revert_to_old_debug,
  get_evg_func, show_alert,
  Junk, showPopUp, hidePopUp
} from "./components/DebugSystem/Utils.jsx";
import { PopUp } from './components/DebugSystem/PopUp.jsx';

const initialize = (getState) => {
  if (process.env.NODE_ENV === "development") {
    return createSmartappDebugger({
      token: process.env.REACT_APP_TOKEN,
      initPhrase: process.env.REACT_APP_INIT_PHRASE,
      getState,
      enableRecord: true,
      recordParams: {
        defaultActive: true,
      }
    });
  }
  return createAssistant({ getState });
}

function App() {
  // --          DEBUG MODE controls and hooks              --
  const [currObject, setCurrObject] = useState([]);
  const [mode, setMode] = useState("normal");
  const [totObject, setTotObject] = useState([]);
  const [alertItem, setAlertItem] = useState([]);
  const [popUpObject, setPopUpObject] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  //const [themes, setThemes] = useState(Object.keys(FRAMES))


  function debugModeToggle() {
    if (mode === "debug")
      setMode("normal");
    else
      setMode("debug");
  }

  function sendAE(act, stf = {}) {
    window.evg_assistant.sendData({ action: { action_id: act, parameters: stf } });
  }

  function closeApp() {
    sendAE("FINAL", {});
    window.evg_assistant.close();
  }

  useEffect(() => {
    window.add_evg_func = add_evg_func;
    window.get_evg_func = get_evg_func;
    window.add_evg_func("sendAE", sendAE);
    window.add_evg_func("closeApp", closeApp);
    window.add_evg_func("showAlert", show_alert);
    window.add_evg_func("showPopUp", showPopUp);
    window.add_evg_func("hidePopUp", hidePopUp);
    window.evg_assistant = initialize(() => window.evg_assistant_state);
  }, []);

  useEffect(() => {
    window.evg_assistant.on("data", (input) => {
      if (input.smart_app_data) {
        setCurrObject(input.smart_app_data);
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  useEffect(() => {
    if (width <= 1024) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [width]);


  useEffect(() => {
    let t = new Array;
    Object.assign(t, totObject);
    let t1 = new Object();
    Object.assign(t1, currObject);
    t.push(t1);
    setTotObject(t);

    const complex_func_arr = [
      {
        name: "closeApp",
        func: () => {
          window.get_evg_func("sendAE")("CLOSE_APP");
          window.get_evg_func("closeApp")();
        }
      },
      {
        name: "test",
        func: () => {
          alert("Test func");
        }
      },
      {
        name: "showAlert",
        func: () => {
          setAlertItem({
            upperText: currObject.commandParams.upperText || "",
            lowerText: currObject.commandParams.lowerText || ""
          });
          window.get_evg_func("showAlert")();
        }
      },
      {
        name: "showPopUp",
        func: () => {
          setPopUpObject(currObject.commandParams);
          window.get_evg_func("showPopUp")("popUp", "mainThing", null);
        }
      },
      {
        name: "hidePopUp",
        func: () => {
          window.get_evg_func("hidePopUp")("popUp", "mainThing");
        }
        },
    ];


    let complex_func = complex_func_arr.find(
      (i) => (i.name === currObject.commandName))

    if (complex_func !== undefined) {
      complex_func.func();
    }
  }, [currObject]);

  // --          DEBUG MODE end            --

  // If DEBUG
  if (mode === "debug") {
    let inner = {
    }
    return (
      <>
        <Junk dmt={debugModeToggle} />
        <ModalDebug data={revert_to_old_debug(totObject)} inner={inner} />
      </>
    );
  }

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  // DEV Return Component for render


  
  return (
    <div className="App" style={{ width: "100%" }}>
      <div id="frameContainer"></div>
      {(isMobile) ? (<FrameContainer />) : (<FrameContainerWeb />)}
      <div style={{ position: "fixed", left: "1rem", top: "1rem", display: "flex" }}>
        <div style={{ marginRight: "10px", zIndex: "1" }} id="goBack" onClick={
          () => {
            window.get_evg_func("sendAE")("CLOSE_APP");
            window.get_evg_func("closeApp")();
          }
        }>
          <IconChevronLeft size="s" color="white" />
        </div>
        <div className="headerText" style={typography.body1}>
          Иллюстрации на стихи из <br /> «Русской книги вопросов»
        </div>
      </div>

      <AlertItem upperText={alertItem.upperText || ""} lowerText={alertItem.lowerText || ""} />
      <PopUp data={popUpObject} />
    </div>

  );
}
export default App;