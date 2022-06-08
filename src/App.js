import React,{useState,useEffect} from "react"
import Confetti from 'react-confetti'
import images from "./components/images"
import Card from "./components/Card"
import { v4 as uuidv4 } from 'uuid'

export default function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [guess,setGuess] = useState(null)
  const [checkingGuess, setCheckingGuess] = useState(false)
  const [gameWon, setGameWon] = useState(true)

  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    } 
    return array;
  }
  
  function startGame() {
    setGameWon(false)
    setShuffled(prevState => {
      return prevState.map(item => {
        return {...item,hidden: false}
      })
    })
  }
  function resetGame() {
    setGameStarted(false)
    setShuffled(shuffle(images.concat(images)))
    setShuffled(prevState => {
      return prevState.map((item,i) => {
        return {...item,hidden: true, isPaired: false,number: i+1}
      })
    })
  }

  const [shuffled,setShuffled] = useState(shuffle(images.concat(images)))
  
  useEffect(() => {
    setShuffled(prevState => {
      return prevState.map((item,i) => {
        return {...item,hidden: true, isPaired: false,number: i+1}
      })
    })
  },[])

  useEffect(() => {
    if (!gameWon ) { 
    const gameStartTimeout = setTimeout(() => {
      setShuffled(prevState => {
        return prevState.map(item => {
          return {...item,hidden: true}
        })
      })
      setGameStarted(true)
      console.log(gameStarted)
    }, 5000)
    return () => {clearTimeout(gameStartTimeout)}
// eslint-disable-next-line
  }},[gameWon])

  useEffect(() => {
    const allPaired = shuffled.every(item => item.isPaired)
    if (allPaired) {
      setGameWon(true)
    }
  },[shuffled])


  function press(number,name) {
    if (gameStarted) {
    if (!checkingGuess) {
      setShuffled(prevState => {
        return prevState.map(item => {
          return item.number === number ? {...item, hidden: false} : item
        })
      })
      if (guess === null) {
        setGuess(name)
      } 
      else {
        if (guess === name) { 
          setShuffled(prevState => {
            return prevState.map(item => {
              return (item.image === guess ? 
              {...item, isPaired: true} : item
            )})
          })
        }
        else {
          setCheckingGuess(true)
          setTimeout(() => {
            setCheckingGuess(false)
            setShuffled(prevState => {
              return prevState.map(item => {
                return item.isPaired ? item : {...item, hidden: true}
              })
            })
          },1000)
        }
        setGuess(null)
      }  
  }}
}

  let card = shuffled.map(item => {
    return (<Card 
      key = {uuidv4()}
      number={item.number} 
      name={item.image} 
      isHidden={item.hidden} 
      isPaired={item.isPaired} 
      press={press} 
      />)
  })

  return (
      <div className="game-container">
          {(gameWon && gameStarted) && <Confetti />}
          <h1 className="game-title">Memory Game</h1>
          <div className="card-board">
            {card}
          </div>
          {(!gameStarted && gameWon) ? <button className="memory-game-button" onClick={() =>  startGame()}>Start Game</button> : 
          gameWon ? <button className="memory-game-button" onClick={() =>  resetGame()}>New Game</button> : <></>}
      </div>
    )
  }

