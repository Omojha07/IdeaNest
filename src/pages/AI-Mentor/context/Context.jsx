import { createContext, useState, useCallback } from 'react'
import run from '../config/gemini'

export const Context = createContext()

const ContextProvider = props => {
  // State declarations inside the function
  const [input, setInput] = useState('')
  const [recentPrompt, setRecentPrompt] = useState('')
  const [prevPrompt, setPrevPrompt] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resultData, setResultData] = useState('')
  const [error, setError] = useState(null)

  // Function to delay each word with memoization to avoid recreating on each render
  const delayPara = useCallback((index, nextWord) => {
    setTimeout(() => {
      setResultData(prev => prev + nextWord) // Append the next word with a delay
    }, 75 * index)
  }, [])

  const onSent = async prompt => {
    if (!prompt || prompt.trim() === '') {
      return // Don't process empty prompts
    }

    setLoading(true) // Set loading to true when the process starts
    setResultData('') // Clear the result area before showing new data
    setError(null) // Clear any previous errors

    try {
      const result = await run(prompt) // Using the passed prompt instead of input state

      if (!result) {
        throw new Error('No response received from AI')
      }

      let responseArray = result.split('**') // Split based on **
      let newResponse = '' // Initialize newResponse as an empty string

      // Process each part of the responseArray
      for (let i = 0; i < responseArray.length; i++) {
        if (i === 0 || i % 2 !== 1) {
          newResponse += responseArray[i] // Append normally
        } else {
          newResponse += '<b>' + responseArray[i] + '</b>' // Wrap in <b> tags
        }
      }

      // Replace "*" with line breaks and split by spaces
      let newResponse_1 = newResponse.split('*').join('<br>')
      let newResponseArray = newResponse_1.split(' ')

      // Animate word by word
      for (let i = 0; i < newResponseArray.length; i++) {
        const nextWord = newResponseArray[i]
        delayPara(i, nextWord + ' ') // Call delay function to append word with a delay
      }

      setPrevPrompt(prev => [...prev, prompt]) // Add prompt to previous prompts
      setRecentPrompt(prompt) // Update the recent prompt
      setShowResult(true) // Show the result when done
    } catch (error) {
      console.error('Error sending prompt:', error)
      setError(
        error.message || 'An error occurred while processing your request'
      )
      // Even on error, we should set showResult to true to exit loading state
      setShowResult(true)
    } finally {
      setLoading(false) // Stop loading when done
      setInput('') // Clear the input field
    }
  }

  const contextValue = {
    onSent,
    prevPrompt,
    setPrevPrompt,
    recentPrompt,
    setRecentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    error
  }

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  )
}

export default ContextProvider
