import { useState } from "react"

function TestApp() {

    const [counter, setCounter] = useState(0)

    const handleIncrement = () => {
        setCounter(counter+1)
        console.log("counter incremented")
    }

    const handleDecrement = () => {
        setCounter(counter-1)
        console.log('counter decremented')
    }


    return (
        <div className="w-screen h-screen p-2 text-center flex justify-center items-center">
            <div className="border-2 p-4">
                <div className="text-2xl font-bold p-2">Counter: {counter}</div>
                <div className="flex-col">
                    <button className="border-2 p-2 m-2" onClick={handleIncrement}>Increment</button>
                    <button className="border-2 p-2 m-2" onClick={handleDecrement}>Decrement</button>
                </div>

            </div>
        </div>
    )
}

export default TestApp