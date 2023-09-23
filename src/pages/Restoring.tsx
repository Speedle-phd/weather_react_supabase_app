import { Link } from "react-router-dom"

const Restoring = () => {
   return (
      <div className='valid:shadow-whiteShadow focus-within:shadow-none my-8 text-center w-[clamp(20rem,50vw,50rem)] flex flex-col gap-8 bg-[rgba(33,33,33,.45)] p-10 rounded-md transition-all mx-auto'>
         <div className="">
            Please check your emails to get redirected to your account settings,
            where you can alter your password.
         </div>
         <Link to="/login" className="text-xs text-slate-400 hover:text-white focus-visible:text-white transition-colors">Here's a stormy link to go back to login page.</Link>
      </div>
   )
}

export default Restoring
