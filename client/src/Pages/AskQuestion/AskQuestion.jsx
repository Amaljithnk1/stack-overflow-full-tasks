import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./AskQuestion.css";
import { askQuestion } from "../../actions/question";

const AskQuestion = () => {
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionTags, setQuestionTags] = useState("");
  const [activeFormats, setActiveFormats] = useState({});
  const [inCodeBlock, setInCodeBlock] = useState(false);

  const editorRef = useRef(null);
  const videoInputRef = useRef(null);
  const dispatch = useDispatch();
  const User = useSelector((state) => state.currentUserReducer);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (User) {
      if (questionTitle && editorRef.current.innerHTML && questionTags) {
        dispatch(
          askQuestion(
            {
              questionTitle,
              questionBody: editorRef.current.innerHTML,
              questionTags,
              userPosted: User.result.name,
            },
            navigate
          )
        );
      } else alert("Please enter all the fields");
    } else alert("Login to ask question");
  };

  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    updateActiveFormats();
  };

  const getClosestElement = (node, selector) => {
    while (node && node.nodeType !== Node.ELEMENT_NODE) {
      node = node.parentNode;
    }
    return node && node.closest(selector);
  };

  const handleCodeSnippet = () => {
    const selection = window.getSelection();
    if (!editorRef.current.contains(selection.anchorNode)) return;

    const range = selection.getRangeAt(0);
    const pre = getClosestElement(range.startContainer, "pre");

    if (pre) {
      setInCodeBlock(false);
      const p = document.createElement("p");
      p.style.fontSize = "16px";
      p.innerHTML = pre.innerHTML;
      pre.parentNode.replaceChild(p, pre);
      range.selectNodeContents(p);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      setInCodeBlock(true);
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.style.fontSize = "14px";
      pre.appendChild(code);
      if (range.toString()) {
        code.appendChild(document.createTextNode(range.toString()));
        range.deleteContents();
      }
      range.insertNode(pre);
      range.selectNodeContents(pre);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    updateActiveFormats();
  };

  const handleEmbedVideo = (e) => {
    const selection = window.getSelection();
    if (!editorRef.current.contains(selection.anchorNode)) return;

    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const videoElement = document.createElement("video");
        videoElement.controls = true;
        videoElement.src = event.target.result;

        const placeholder = document.createElement("p");
        placeholder.appendChild(document.createElement("br"));

        const range = selection.getRangeAt(0);
        range.insertNode(placeholder);
        range.insertNode(videoElement);

        range.setStartAfter(videoElement);
        range.setEndAfter(videoElement);
        selection.removeAllRanges();
        selection.addRange(range);

        videoInputRef.current.value = "";
      };
      reader.readAsDataURL(file);
    }
  };

  const updateActiveFormats = () => {
    const selection = window.getSelection();
    const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    const parentElement = range ? (range.startContainer.nodeType === 3 ? range.startContainer.parentElement : range.startContainer) : null;

    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      orderedList: document.queryCommandState("insertOrderedList"),
      unorderedList: parentElement && getClosestElement(parentElement, "ul") !== null,
    });
  };

  const handleKeyDown = useCallback((e) => {
    const selection = window.getSelection();
    if (!editorRef.current.contains(selection.anchorNode)) return;

    const range = selection.getRangeAt(0);
    const startContainer = range.startContainer;
    const parentElement = startContainer.nodeType === 3 ? startContainer.parentElement : startContainer;

    const codeElement = parentElement.closest('code');
    const preElement = parentElement.closest('pre');
    const liElement = parentElement.closest('li');

    const isInCodeBlock = codeElement || preElement;

    if (e.key === "Enter" && codeElement) {
      e.preventDefault();
      const br = document.createElement("br");
      range.insertNode(br);
      range.setStartAfter(br);
      selection.removeAllRanges();
      selection.addRange(range);
      updateActiveFormats();
    } else if (e.key === "Enter" && e.ctrlKey && isInCodeBlock) {
      e.preventDefault();
      const p = document.createElement("p");
      p.style.fontSize = "16px";
      const pre = preElement || codeElement.closest("pre");
      pre.parentNode.insertBefore(p, pre.nextSibling);
      const newRange = document.createRange();
      newRange.setStart(p, 0);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
      setInCodeBlock(false);

      const br = document.createElement("br");
      p.appendChild(br);
      newRange.setStartAfter(br);
      selection.removeAllRanges();
      selection.addRange(newRange);
      updateActiveFormats();
    } else if (e.key === "Enter" && liElement) {
      // Allow default behavior for list items
      updateActiveFormats();
      return;
    } else if (e.key === "Enter") {
      e.preventDefault();
      const newLine = document.createElement("div");
      const br = document.createElement("br");
      newLine.appendChild(br);
      range.insertNode(newLine);
      range.setStartAfter(newLine);
      selection.removeAllRanges();
      selection.addRange(range);
      updateActiveFormats();
    } else if (e.key === "Backspace") {
      updateActiveFormats();
    }
  }, []);

  const handleClick = useCallback(() => {
    const selection = window.getSelection();
    if (!editorRef.current.contains(selection.anchorNode)) return;

    const range = selection.getRangeAt(0);
    const parentElement = range.startContainer.parentElement;
    setInCodeBlock(parentElement.nodeName === "CODE" || getClosestElement(range.startContainer, "pre"));
    updateActiveFormats();
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClick);
    };
  }, [handleClick]);

  return (
    <div className="ask-question">
      <div className="ask-ques-container">
        <h1>Ask a public Question</h1>
        <form onSubmit={handleSubmit}>
          <div className="ask-form-container">
            <label htmlFor="ask-ques-title">
              <h4>Title</h4>
              <p>
                Be specific and imagine you’re asking a question to another person
              </p>
              <input
                type="text"
                id="ask-ques-title"
                onChange={(e) => setQuestionTitle(e.target.value)}
                placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
              />
            </label>
            <label htmlFor="ask-ques-body">
              <h4>Body</h4>
              <p>Include all the information someone would need to answer your question</p>
              <div>
                <div className="toolbar">
                  <button
                    type="button"
                    onClick={() => handleFormat("bold")}
                    className={activeFormats.bold ? "active" : ""}
                  >
                    Bold
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormat("italic")}
                    className={activeFormats.italic ? "active" : ""}
                  >
                    Italic
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormat("underline")}
                    className={activeFormats.underline ? "active" : ""}
                  >
                    Underline
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormat("insertOrderedList")}
                    className={activeFormats.orderedList ? "active" : ""}
                  >
                    OL
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormat("insertUnorderedList")}
                    className={activeFormats.unorderedList ? "active" : ""}
                  >
                    UL
                  </button>
                  <button type="button" onClick={handleCodeSnippet}>
                    Code
                  </button>
                  <input
                    type="file"
                    ref={videoInputRef}
                    style={{ display: "none" }}
                    onChange={handleEmbedVideo}
                    accept="video/*"
                  />
                  <button
                    type="button"
                    onClick={() => videoInputRef.current.click()}
                  >
                    Video
                  </button>
                  {inCodeBlock && (
                    <div className="exit-code-block">
                      Press <strong>Ctrl + Enter</strong> to exit code block
                    </div>
                  )}
                </div>
                <div className={`editor-container ${inCodeBlock ? "in-code-block" : ""}`}>
                  <div
                    className="editor"
                    contentEditable
                    ref={editorRef}
                    onBlur={updateActiveFormats}
                  ></div>
                </div>
              </div>
            </label>
            <label htmlFor="ask-ques-tags">
              <h4>Tags</h4>
              <p>Add up to 5 tags to describe what your question is about</p>
              <input
                type="text"
                id="ask-ques-tags"
                onChange={(e) => setQuestionTags(e.target.value.split(" "))}
                placeholder="e.g. (xml typescript wordpress)"
              />
            </label>
          </div>
          <input
            type="submit"
            value="Review your question"
            className="review-btn"
          />
        </form>
      </div>
    </div>
  );
};

export default AskQuestion;
