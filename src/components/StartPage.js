import React, { useState } from "react";
import Blobs from "./Blobs";
import Questions from "./Questions";

export default function StartPage() {

  const [showQuestions, setShowQuestions] = useState(false)

  const handleStartQuiz = () => {
    setShowQuestions(true)
  }

  if (showQuestions) {
    return <Questions />;
  }

  return (
    <div className="container">
        <Blobs className="blobs-background" />
        <div className="d-flex flex-column align-items-center justify-content-center vh-100">
            <h1>Quizzical</h1>
            <div className="start-info">
                <p className="start-more-info">The simple React Quiz app by</p>
                <a className="author d-flex flex-column align-items-center justify-content-center" href="https://johnsethsalazar.netlify.app/">John Seth Salazar</a>
            </div>
            <button className="btn btn-start" onClick={handleStartQuiz}>Start Quiz</button>
        </div>
    </div>
  );
}
