import { LuEyeOff} from 'react-icons/lu'

interface FormControlProps {
   type: string
}

const LoginFormControl = ({ type }: FormControlProps) => {
   const labelString =
      type.slice(0, 1).toUpperCase() + type.slice(1, type.length)

   const handlePasswordToggle = (e: React.MouseEvent) => {
      const target = (e.target as HTMLElement).closest('svg')
      const input = target?.previousElementSibling as HTMLInputElement
      if(input?.getAttribute('type') === 'password'){
         input?.setAttribute('type', 'text')
      } else {
         input?.setAttribute('type', 'password')
      }
   }
   
   return (
      <div className='grid text-left gap-2 relative'>
         <label htmlFor={type}>{labelString}</label>
         <input
            autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'username'}
            className='font-normal appearance-none outline-none bg-inherit border-b-[5px] border-b-slate-600 autofill-reset py-1 px-2 valid:border-b-emerald-900 focus-within:border-b-gray-900'
            id={type}
            name={type}
            type={type === 'username' ? 'text' : type}
            required
            minLength={type === 'username' ? 3 : 6}
         />
         {type === 'password' ? <LuEyeOff onClick={handlePasswordToggle} className="cursor-pointer absolute right-0 top-10"/> : null}
      </div>
   )
}

export default LoginFormControl
