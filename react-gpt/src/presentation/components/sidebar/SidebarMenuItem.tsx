import { NavLink } from "react-router-dom";

interface Props {
    option: {
        to: string;
        icon: string;
        title: string;
        description: string;
    }
}

const SidebarMenuItem =({ option }: Props ) => {
  return (
    <NavLink 
        key={ option.to }
        to={ option.to } 
        className={({ isActive}) =>
            isActive
            ? 'flex justify-center items-center text-white bg-gray-800 rounded-md p-2 transition-colors'
            : 'flex justify-center items-center text-gray-500 hover:text-white hover:bg-gray-800 rounded-md p-2 transition-colors'
        }    
    >
        <i className={`${ option.icon } text-2xl mr-4 text-indigo-400`}></i>
        <div className="flex flex-col flex-grow">
            <span className="text-white text-lg font-semibold">
                { option.title }
            </span>
            <span className="text-gray-400 text-sm">
                { option.description }
            </span>
        </div>
    </NavLink>
  )
}

export default SidebarMenuItem;