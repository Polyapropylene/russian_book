import './PopUp.css';
import { typography } from '@salutejs/plasma-tokens';
import { get_evg_func } from "./Utils.jsx";

export function PopUp({ data }) {
    return <div className="popUp" onClick={
        () => {
            window.get_evg_func("hidePopUp")("popUp", "mainThing")
        }
    }>
        <div className="back">
        </div>
        <div className="mainThing">
            <div style={typography.headline3} className="text">
                {
                    data && data.upperText && data.upperText.split("#").map(
                        (i, pos) =>
                            <div key={pos}>
                                {i}
                            </div>
                    )
                }
                <div style={{ height: "20px" }} />
                {
                    data && data.lowerText && data.lowerText.split("#").map(
                        (i, pos) =>
                            <div style={typography.body2} key={pos}>
                                {i}
                            </div>
                    )
                }
            </div>
            <div className="btns">
                {
                    data && data.buttons && data.buttons.map((i, pos) =>
                        <div key={pos} className={pos === data.buttons.length - 1 ? "" : "boring"} style={typography.button1} onClick={() => { window.get_evg_func("sendAE")(i.eventName) }}>
                            {i.text}
                        </div>
                    )
                }
            </div>
            <div style={{ height: "150px" }} />
        </div>
    </div>;
}