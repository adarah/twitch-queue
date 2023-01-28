import React, { ErrorInfo } from "react"
import { ReactNode } from "react"

interface Props {
    children: ReactNode
}
interface State {
    hasError: boolean
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        // Define a state variable to track whether is an error or not
        this.state = { hasError: false }
    }
    static getDerivedStateFromError(_error: Error) {
        // Update state so the next render will show the fallback UI

        return { hasError: true }
    }
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // You can use your own error logging service here
        console.log({ error, errorInfo })
    }

    render() {
        // Check if the error is thrown
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div>
                    <h2>Oops, fatal error occurred!</h2>
                    <img src="NotLikeThis.png" className="w-1/3"/>
                    <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => self.location.reload()}
                    >
                    Refresh extension
                </button>
                </div >
            )
        }

        // Return children components in case of no error

        return this.props.children
    }
}

export default ErrorBoundary
