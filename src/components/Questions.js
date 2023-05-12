import React, { useEffect, useState } from "react"
import Blobs from "./Blobs"
import ReactLoading from 'react-loading'
import { Button } from "react-bootstrap"
import he from 'he'

export default function Questions() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedChoice, setSelectedChoice] = useState([])
  const [shuffledChoices, setShuffledChoices] = useState([])
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false)
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [playAgain, setPlayAgain] = useState(false)

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5")
      .then(res => res.json())
      .then(data => {
        setTimeout(() => {
          setLoading(false)
        }, 1000);
        setQuestions(data.results)
      })
  }, [])

  useEffect(() => {
    const shuffledChoices = questions.map((question) => {
      const choices = [
        ...question.incorrect_answers,
        question.correct_answer,
      ]
      return shuffleChoices(choices)
    })
    setShuffledChoices(shuffledChoices)
  }, [questions])

  if (loading) {
    return (
      <>
        <Blobs className="blobs-background" />
        <ReactLoading
          type="spin"
          color="#4D5B9E"
          height={100}
          width={50}
        />
      </>
    )
  }

  // Highlight selected choice
  const handleChoiceClick = (questionIndex, choiceIndex) => {
    if(!showResult){
      setSelectedChoice(prevChoice => {
        const updatedChoice = [...prevChoice]
        updatedChoice[questionIndex] = choiceIndex
        return updatedChoice
      })
    }
  }

  // Function to check answer and show correct answers and display the score when 'Check Answers' button is clicked
  const handleCheckAnswers = () => {
    setShowResult(true)
    setShowCorrectAnswers(true)
  
    let count = 0
    questions.forEach((question, questionIndex) => {
      const selectedAnswer = shuffledChoices[questionIndex][selectedChoice[questionIndex]]
      const isCorrectAnswer = selectedAnswer === question.correct_answer
      if (isCorrectAnswer) {
        count++
      }
    })
    setCorrectAnswerCount(count)
  }  

  //function to reset the game and load new set of questions
  const handlePlayAgain = () => {
    setLoading(true)
    setSelectedChoice([])
    setShowCorrectAnswers(false)
    setShowResult(false)
    setCorrectAnswerCount(0)

    fetch("https://opentdb.com/api.php?amount=5")
    .then(res => res.json())
    .then(data => {
      setTimeout(() => {
        setLoading(false)
      }, 1000)
      setQuestions(data.results)
    })

    setPlayAgain(true)
  }

  return (
    <div className="container justify-content-center">
      <Blobs className="blobs-background" />
      <div className="d-flex flex-column align-items-start justify-content-center vh-100 choices-text">
        {questions.map((question, questionIndex) => {
          const decodedQuestion = he.decode(question.question)
          const decodedChoices = shuffledChoices[questionIndex].map(choice => he.decode(choice))
          const isSelected = selectedChoice[questionIndex] !== undefined

          return (
            <div key={questionIndex}>
              <p className="questions-text">{decodedQuestion}</p>
              <div className="d-flex gap-2">
                {decodedChoices.map((choice, choiceIndex) => {
                  const isCorrectAnswer = choiceIndex === shuffledChoices[questionIndex].indexOf(he.decode(question.correct_answer))
                  const isCorrect = showCorrectAnswers && isCorrectAnswer

                  const buttonStyle = {
                    backgroundColor: isSelected && selectedChoice[questionIndex] === choiceIndex ? "#D6DBF5" : isCorrect ? "#94D7A2" : "transparent",
                    color: isSelected && selectedChoice[questionIndex] === choiceIndex ? "#293264" : "#4D5B9E"
                  };

                  return (
                    <Button
                      key={choiceIndex}
                      variant="primary"
                      className="mb-1 choices-btn"
                      style={buttonStyle}
                      onClick={() => handleChoiceClick(questionIndex, choiceIndex)}
                      disabled={showResult}
                    >
                      {choice}
                    </Button>
                  )
                })}
              </div>
              <hr />
            </div>
          );
        })}
              <div className="container text-center">
                {showResult && <p><strong>Score: {correctAnswerCount}/5</strong></p>}
              </div>
              <div className="container text-center d-inline">
                <button className="btn submit-btn m-2" onClick={handleCheckAnswers}>
                  Check Answers
                </button>
                {showResult && <button className="btn submit-btn play-again-btn m-2" onClick={handlePlayAgain}>Play Again</button>}
              </div>
        </div>
    </div>
  )
}

// Function to shuffle choices
const shuffleChoices = (choices) => {
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]]
  }
  return choices
}

