import "./FrameContainer.css"
import { typography } from '@salutejs/plasma-tokens';
import { useState, useEffect } from 'react';
import { useTransition, animated, config } from 'react-spring'
import { FRAMESWEB } from "./FramesWeb.js";

/**
 * Shuffle array in place
 * @param {Array} array - should be always array
 * @returns {Array} - shuffled array
 */
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}


/**
 * Generate Array of objects that contains corresponding randomized images and poems, themes order saves
 * @param {object} framesObject - {"theme1": {"images": [string], "poems": [string]}, "theme2": {"images": [string], "poems": [string]}}
 * @returns {Array} - [{url - random theme and random url; poem - random theme, default text order}, {url: string, poem: string}]
 */
function generateRandomizedFrames(framesObject) {
    let themes = Object.keys(framesObject);
    let resultArray = [];
    let arrayOfFrames = [];
    shuffle(themes);
    let idCounter = 0;
    for (let theme of themes) {
        console.log(theme);
        shuffle(framesObject[theme]["images_web"]);
        arrayOfFrames = framesObject[theme]["images_web"].map((image, index) => {
            return {
                id: index + idCounter,
                url: framesObject[theme]["images_web"][index],
                poem: framesObject[theme]["poems"][index]
            }
        })
        idCounter = idCounter + arrayOfFrames.length;
        resultArray.push(...arrayOfFrames);
    }
    return resultArray;
}

let slides = generateRandomizedFrames(FRAMESWEB);

export const FrameContainerWeb = () => {
    // let slides = generateRandomizedFrames(FRAMES, isMobile);
    const [index, setIndex] = useState(0)
    const transitions = useTransition(slides[index], (item) => item.id, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: config.molasses,
    })
    console.log(transitions);
    useEffect(() => void setInterval(() => setIndex((index) => (index + 1) % slides.length), 6000), [])
    // You can split poem text and image, just put it in another animated.div with key and style props - and wrap all in other div
    return transitions.map(({ item, props, key }) => (
        <animated.div key={key} className="bg" style={{ ...props, backgroundImage: `url(${item.url})` }}>
            <div className="textContainer">
                <div style={typography.body1}>
                    <span style={{ left: '1rem', whiteSpace: 'pre-line', color: 'white', transition: 'all 500ms ease' }}>{item.poem}</span>
                </div>
            </div>
        </animated.div>
    ))
}