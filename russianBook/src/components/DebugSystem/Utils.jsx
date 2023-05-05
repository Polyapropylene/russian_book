import { useState, useEffect, useRef } from 'react';
import { typography } from '@salutejs/plasma-tokens';
import { IconPlus, IconChevronLeft, IconCall, IconChevronRight } from '@salutejs/plasma-icons';
import "./Alert.css";


function GeneralHeader(props) {
  return <div className="head">
    <div id="goBack" className="lhs" onClick={
      () => {
        window.get_evg_func("sendAE")("GO_BACK", {
          nextObject: window.evg_next_object,
          field: window.evg_field,
          itemNumber: window.evg_item_number,
          itemsTotal: window.evg_items_total,
          startDate: props.startDate,
          endDate: props.endDate,
          chosenDateStart: props.chosenDate,
          chosenDateEnd: props.anotherChosenDate
        }
        );
      }
    }>
      <IconChevronLeft size="s" color="white" />
    </div>
    <div className="mid" style={typography.body2}>
      <div>
        {props.title}
      </div>
      {
        props.year && <div className="year" onClick={() => {
          window.showYearSelect();
        }}>
          {props.year}
        </div>
      }
    </div>
    <div className="rhs" id="defaultItem" >
      {props.children}
    </div>
  </div>
}


function AlertItem(props) {
  return <div className="alertItem">
    <div className="img">
      <img src="./err.svg" alt="none" />
    </div>
    <div style={typography.headline3} className="altxt upper">
      {props.upperText}
    </div>
    {
      props.lowerText.split("#").map((i, pos) =>
        <div style={typography.footnote1} key={pos} className="altxt lower">
          {i}
        </div>
      )
    }

  </div>;
}

function ModalDebug(props) {
  const [mode, setMode] = useState("input");
  let dst = {
    width: "95%",
    marginTop: "30px"
  }

  let btn_style = {
    position: "fixed",
    top: "4em",
  }

  let btns = <div style={btn_style}>
    <button style={{ padding: "15px", margin: "5px" }} onClick={() => setMode("data")}>Data</button>
    <button style={{ padding: "15px", margin: "5px" }} onClick={() => setMode("input")}>Input</button>
  </div>

  if (props.inner === undefined)
    btns = <></>;

  let ret = <></>;
  if (mode === "input") {
    ret = <div style={dst} Class="debugField">
      {props.data.map(
        (item) =>
          <div Class="debugRow">
            <div style={{ color: "grey" }} Class="first">{item.date}</div>
            <div style={{ color: "white" }} Class="second">{item.val}</div>
          </div>
      )}
      <div style={{ height: "200px" }} />
    </div>
  }
  else if (mode === "data") {
    let out = JSON.stringify(props.inner);
    out = out.replaceAll(',', ", ");
    ret = <div style={dst} Class="debugField">
      {out}
    </div>
  }

  return <>

    {ret}
    {btns}
  </>;
}

function add_evg_func(name, func) {
  if (window.evg_functions === undefined)
    window.evg_functions = [];
  window.evg_functions.push(
    {
      name: name,
      func: func
    }
  );
}

function revert_to_old_debug(obj) {
  let ret = new Array;
  for (let i = 0; i < obj.length; i++) {
    ret.push({
      "date": String(Date()).replace(/\(.*\)/, "").replace(/GMT.*$/, ""),
      "val": String(JSON.stringify(obj[i])).replaceAll("{", " {").replaceAll(",", ", ")
    }
    )
  }
  return ret;
}

function exec_evg_func(name, arg) {
  if (window.evg_functions === undefined || !Array.isArray(window.evg_functions))
    return;
  let y = window.evg_functions.find((i) => i.name === name);
  y.func(arg);
}

function get_evg_func(name) {
  try {
    if (window.evg_functions === undefined || !Array.isArray(window.evg_functions))
      throw "n/e";
    let y = window.evg_functions.find((i) => i.name === name);
    if (y === undefined)
      throw "n/e";
    return y.func;
  }
  catch (e) {
    if (e === "n/e") {
      alert("function '" + name + "' doesn't exist :(");
    }
    else {
      alert("Something unexpected happened when executing function get_evg_func: " + e);
    }
  }
}

//TODO make it more concrete
function send_object(str) {
  let h = "";
  let r = document.getElementById("searchBar");
  if (r)
    h = r.value;
  h = h.toLowerCase();
  if (h.length >= 3 || h.length === 0)
    window.get_evg_func("sendAE")(str, { text: h, field: window.evg_field });
}

function send_object1() {
  let h = "";
  let r = document.getElementById("searchBar");
  if (r)
    h = r.value;
  h = h.toLowerCase();
  if (h.length >= 3 || h.length === 0)
    window.get_evg_func("sendAE")("GOAL_SEARCH", { text: h });
}
var t
function fucking_hell(str) {
  if (t !== undefined)
    clearTimeout(t);
  t = setTimeout(() => { send_object(str) }, 200);
}


var what_the_hell;

function press_on_item(str) {
  let r = document.getElementById(str);
  if (r)
    r.click();
}

const max = 200;

function show_legend() {
  let r = document.getElementsByClassName("legend");
  window.legend_show = 1;
  if (!r || r.length === 0)
    return;
  r[0].style.opacity = "0";
  r[0].style.display = "block";
  let r1 = r[0].querySelector(".mainThing");
  let offc = r1.offsetHeight;
  r1.style.bottom = (0 - offc) + "px";
  r[0].style.opacity = "";
  let p = 0;
  let delta = 10;
  let id = setInterval(move_legend, delta);
  function move_legend() {
    p += delta;

    // console.log((0 - (offc * ( 1.0 - p / max))));
    if (p >= max)
      clearInterval(id);
    r1.style.bottom = (0 - (offc * (1.0 - p / max))) + "px";
  }
}

function hide_legend() {
  let r = document.getElementsByClassName("legend")
  // debugger;
  if (!r || r.length === 0)
    return;
  let r1 = r[0].querySelector(".mainThing");
  if (r1.style.bottom !== "0px")
    return;
  let offc = r1.offsetHeight;
  let p = 0;
  let delta = 10;
  let id = setInterval(move_legend, delta);
  function move_legend() {
    p += delta;
    // debugger;
    let t1 = (0 - (offc * (p / max))) + "px";
    if (p >= max) {
      r[0].style.display = "none";
      window.get_evg_func("setUPD")(0);
      clearInterval(id);
    }
    r1.style.bottom = t1;
    // console.log(t1);
  }
}

function show_info(fun) {
  window.evg_info_func = fun;
  let r = document.getElementsByClassName("infoItem");
  window.legend_show = 1;
  if (!r || r.length === 0)
    return;
  r[0].style.opacity = "0";
  r[0].style.display = "block";
  let r1 = r[0].querySelector(".mainThing");
  let offc = r1.offsetHeight;
  r1.style.bottom = (0 - offc) + "px";
  r[0].style.opacity = "";
  let p = 0;
  let delta = 10;
  let id = setInterval(move_legend, delta);
  function move_legend() {
    p += delta;

    // console.log((0 - (offc * ( 1.0 - p / max))));
    if (p >= max)
      clearInterval(id);
    r1.style.bottom = (0 - (offc * (1.0 - p / max))) + "px";
  }
}

function hide_info() {
  let r = document.getElementsByClassName("infoItem");
  if (!r || r.length === 0)
    return;
  let r1 = r[0].querySelector(".mainThing");
  let offc = r1.offsetHeight;
  if (r1.style.bottom !== "0px")
    return;
  let p = 0;
  let delta = 10;
  let id = setInterval(move_legend, delta);
  function move_legend() {
    p += delta;
    let t1 = (0 - (offc * (p / max))) + "px";
    if (p >= max) {
      r[0].style.display = "none";
      clearInterval(id);
      window.evg_info_func();
    }
    r1.style.bottom = t1;
  }
}

function show_alert() {
  //TODO accomodate insets
  let r = document.getElementsByClassName("alertItem");
  if (r && r[0])
    r = r[0];
  else
    return;
  let pos = 0;

  r.style.bottom = -1000 + "px";
  r.style.display = "flex";
  let bottom_pos = 0 - Number(r.clientHeight);
  r.style.bottom = bottom_pos;

  let id = setInterval(move_alert, 10);
  function move_alert() {
    let time_anim = 200;
    let time_delay = 3000;
    if (pos <= time_anim) {
      r.style.bottom = bottom_pos + (1 - ((time_anim - pos) / time_anim)) * (0 - bottom_pos + 140) + "px";
    }
    else if (pos >= time_anim + time_delay && pos <= 2 * time_anim + time_delay) {
      r.style.bottom = bottom_pos + ((time_anim - (pos - time_anim - time_delay)) / time_anim) * (0 - bottom_pos + 140) + "px";
    }
    else if (pos > 2 * time_anim + time_delay) {
      r.style.display = "none";
      clearInterval(id);
    }
    pos += 10;
  }
}


function get_random_string(len = 10) {
  let ret = "";
  let alphabet = "qwertyuiopasdfghjklzxcvbnm1234567890QWERTYUIOPASDFGHJKLZXCVBNM";
  for (let i = 0; i < len; i++) {
    ret += alphabet.charAt(Math.round(Math.random() * alphabet.length))
  }
  return ret;
}


function Junk(props) {
  const db = {
    position: "fixed",
    top: "2em",
    right: "4em",
    padding: "10px",
    borderRadius: "2px",
    zIndex: "20",
    backgroundColor: "#00aa00"
  };
  const st = {
    position: "fixed",
    fontSize: "14px",
    left: "50%",
    top: "2em",
    color: "orange",
    zIndex: "10"
  };

  const al = {
    position: "fixed",
    fontSize: "14px",
    left: "50%",
    top: "5em",
    color: "red",
    zIndex: "10"
  };
  const tst = {
    position: "fixed",
    top: "2em",
    left: "2em",
    padding: "10px",
    borderRadius: "2px",
    zIndex: "20",
    backgroundColor: "#00aa00",
    display: "none"
  };

  return <>
    <button onClick={props.dmt} style={db} >Debug</button>
    <div id="alert" style={al}></div>
  </>;
}



function showPopUp(className, innerBlock, func) {
  // debugger;
  window.evg_info_func = func;
  let r = document.getElementsByClassName(className);
  window.legend_show = 1;
  if (!r || r.length === 0)
    return;
  r[0].style.opacity = "0";
  r[0].style.display = "block";
  let r1 = r[0].querySelector("." + innerBlock);
  let offc = r1.offsetHeight;
  r1.style.bottom = (0 - offc) + "px";
  r[0].style.opacity = "";
  let p = 0;
  let delta = 10;
  let id = setInterval(move_legend, delta);
  function move_legend() {
    p += delta;
    // console.log((0 - (offc * ( 1.0 - p / max))));
    if (p >= max)
      clearInterval(id);
    r1.style.bottom = (0 - (offc * (1.0 - p / max))) + "px";
  }
}

function hidePopUp(className, innerBlock) {
  let r = document.getElementsByClassName(className);
  if (!r || r.length === 0)
    return;
  let r1 = r[0].querySelector("." + innerBlock);
  let offc = r1.offsetHeight;
  if (r1.style.bottom !== "0px")
    return;
  let p = 0;
  let delta = 10;
  let id = setInterval(move_legend, delta);
  function move_legend() {
    p += delta;
    let t1 = (0 - (offc * (p / max))) + "px";
    if (p >= max) {
      r[0].style.display = "none";
      clearInterval(id);
      if (window.evg_info_func)
        window.evg_info_func();
    }
    r1.style.bottom = t1;
  }
}

export { GeneralHeader, AlertItem, ModalDebug, add_evg_func, revert_to_old_debug, exec_evg_func, get_evg_func, send_object, fucking_hell, press_on_item, show_alert, show_legend, hide_legend, show_info, hide_info, get_random_string, Junk, showPopUp, hidePopUp };
