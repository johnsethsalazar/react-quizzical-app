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
    setSelectedChoice(prevChoice => {
      const updatedChoice = [...prevChoice]
      updatedChoice[questionIndex] = choiceIndex
      return updatedChoice
    })
  }

  // Function to check answer and show correct answers
  const handleCheckAnswers = () => {
    setShowCorrectAnswers(true)
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
                      disabled={isSelected || showCorrectAnswers}
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
        <button className="btn submit-btn"
 onClick={handleCheckAnswers}>Check Answers</button>
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

