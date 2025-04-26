import { NavLink } from "react-router"

function Navbar() {
    return (
        <div className="flex items-center justify-between">
            <ul className="sm:flex gap-5 hidden">
                <NavLink to='/' className={({ isActive }) =>
                    `flex flex-col items-center gap-1 ${isActive ? 'text-blue-600 font-bold' : ''}`
                }>
                    <p>HOME</p>
                    <hr className="hidden h-[1.5px] w-2/4 border-none bg-gray-700" />
                </NavLink>
                <NavLink to='register' className={({ isActive }) =>
                    `flex flex-col items-center gap-1 ${isActive ? 'text-blue-600 font-bold' : ''}`
                }>
                    <p>REGISTER</p>
                    <hr className="hidden h-[1.5px] w-2/4 border-none bg-gray-700" />
                </NavLink>
                <NavLink to='login' className={({ isActive }) =>
                    `flex flex-col items-center gap-1 ${isActive ? 'text-blue-600 font-bold' : ''}`
                }>
                    <p>LOGIN</p>
                    <hr className="hidden h-[1.5px] w-2/4 border-none bg-gray-700" />
                </NavLink>
            </ul>

        </div >
    )
}

export default Navbar
