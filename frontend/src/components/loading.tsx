
import { Hourglass } from 'ldrs/react'
import 'ldrs/react/Hourglass.css'

const Loading = () => {
  return (
    <div className="flex-col max-h-screen min-h-[80vh] gap-4 w-full flex items-center justify-center ">
     <Hourglass
        size="50"
        bgOpacity="0.1"
        speed="1.75"
        color="white" 
      />
    </div>
  )
}

export default Loading
