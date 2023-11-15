import { useEffect, useState } from "react";
import { createCode } from "./code";

function App() {
  const [code, setCode] = useState(<></>);
  const [bg, setBg] = useState("");
  const [text, setText] = useState([""]);
  const [cursor, setCursor] = useState({ top: 0, left: 0 });
  const [isShift, setIsShift] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  useEffect(() => {
    const [localCode, localBg] = createCode(text.join("\n"));
    setCode(localCode);
    setBg(localBg);
  }, [text.join("\n")]);
  useEffect(() => {
    let sumText = text[currentLine].slice(0, currentIndex);
    let sumTextEmpty = false;
    if (sumText === "") {
      sumText = " ";
      sumTextEmpty = true;
    }
    const span = document.createElement("span");
    span.textContent = sumText;
    span.style.opacity = "0";
    span.style.position = "absolute";
    span.style.fontFamily = "Source Code Pro";
    span.style.fontSize = "1.2rem";
    span.style.whiteSpace = "break-spaces";
    document.body.appendChild(span);
    const rect = span.getBoundingClientRect();
    document.body.removeChild(span);
    let left = rect.width;
    if (sumTextEmpty) {
      left = 0;
    }
    setCursor({ left, top: rect.height * currentLine });
  }, [currentIndex, currentLine, text.join("\n")]);
  return (
    <>
      <div
        className="absolute w-[0.1rem] h-[1.2rem] bg-white animate-blink mt-[0.2rem]"
        style={{ top: cursor.top, left: cursor.left }}
      />
      <div
        contentEditable
        className="w-[100vw] h-[100vh] text-white editor"
        style={{ backgroundColor: bg, caretColor: bg }}
        spellCheck={false}
        suppressContentEditableWarning
        onKeyDown={(e) => {
          e.preventDefault();
          let localText = text;
          switch (e.key) {
            case "Backspace":
              (() => {
                const localCurrentIndex =
                  localText[currentLine].length - 1 > currentIndex
                    ? currentIndex
                    : localText[currentLine].length - 1;
                if (localCurrentIndex > -1) {
                  localText[currentLine] =
                    localText[currentLine].slice(0, currentIndex - 1) +
                    localText[currentLine].slice(currentIndex);
                  setCurrentIndex((current) => current - 1);
                } else if (currentLine > 0) {
                  localText = [
                    ...localText.slice(0, currentLine),
                    ...localText.slice(currentLine + 1),
                  ];
                  setCurrentLine((current) => current - 1);
                  setCurrentIndex(localText[currentLine - 1].length);
                }
              })();
              break;
            case "Enter":
              (() => {
                const currentLineText = localText[currentLine];
                const indent = currentLineText.match(/^ +/);
                let indentText = "";
                if (indent) {
                  indentText += indent[0];
                }
                localText = [
                  ...localText.slice(0, currentLine),
                  currentLineText.slice(0, currentIndex),
                  indentText + currentLineText.slice(currentIndex),
                  ...localText.slice(currentLine + 1),
                ];
                setCurrentIndex(indentText.length);
                setCurrentLine((current) => current + 1);
              })();
              break;
            case "Tab":
              localText[currentLine] += "  ";
              setCurrentIndex((current) => current + 2);
              break;
            case "Shift":
              setIsShift(true);
              break;
            case "ArrowLeft":
              if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
              } else if (currentLine > 0) {
                setCurrentLine(currentLine - 1);
              }
              break;
            case "ArrowRight":
              if (currentIndex < localText[currentLine].length) {
                setCurrentIndex(currentIndex + 1);
              } else if (currentLine < localText.length - 1) {
                setCurrentLine(currentLine + 1);
              }
              break;
            case "ArrowUp":
              if (currentLine > 0) {
                setCurrentLine((line) => line - 1);
              }
              break;
            case "ArrowDown":
              if (currentLine < localText.length - 1) {
                setCurrentLine((line) => line + 1);
              }
              break;
            default:
              if (e.key.length !== 1) {
                console.log(e.key);
                break;
              }
              (() => {
                let addText = e.key;
                if (isShift) {
                  addText = addText.toUpperCase();
                }
                localText[currentLine] =
                  localText[currentLine].slice(0, currentIndex) +
                  addText +
                  localText[currentLine].slice(currentIndex);
                setCurrentIndex((current) => current + addText.length);
              })();
              break;
          }
          setText(localText);
        }}
        onKeyUp={(e) => {
          e.preventDefault();
          switch (e.key) {
            case "Shift":
              if (isShift) {
                setIsShift(false);
              }
              break;
            default:
              break;
          }
        }}
      >
        {code}
      </div>
    </>
  );
}

export default App;
