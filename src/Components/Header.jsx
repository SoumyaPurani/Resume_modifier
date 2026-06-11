import {useState} from 'react'
function Header() {

  const [DarkMode, setDarkMode] = useState(false);

  return (
    <header className='flex justify-between items-center p-4 shadow-sm border-b bg-black '>
        <div className='font-bold text-2xl text-[#FFFF00]'>Resume Modifier</div>
        <button onClick={() => setDarkMode(!DarkMode)} className={DarkMode ? "bg-white text-black px-4 py-2 rounded cursor-pointer" : "bg-black text-white px-4 py-2 rounded cursor-pointer"}>{DarkMode ? "Light Mode" : "Dark Mode"}</button>
    </header>
  )
}

export default Header