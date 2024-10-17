import { ArrowDown, ArrowUp} from 'lucide-react' // Importa el icono deseado
import React from 'react'

function Card_Ratio({ icon, mount, desc, up = true, p }: { icon: any, mount: string, desc: string, up: boolean, p: string }) {
    return (
        <div className="w-full border border-gray-200 shadow rounded-xl">
            <div className="p-5 dark:border-strokedark dark:bg-boxdark flex flex-col gap-5">
                <div className="dark:bg-gray-300 light:bg-gray-300 w-10 h-10 flex items-center justify-center rounded-full">
                    {icon}
                </div>
                <div className="flex items-end justify-between">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-bold">{mount}</h2>
                        <span className="text-sm text-gray-500">{desc}</span>
                    </div>
                    <div className="">
                        <span className={`flex items-center gap-1 text-xs font-medium ${up ? 'text-green-500' : 'text-red-500'}`}>{p}% {up ? <ArrowUp width={15}/> : <ArrowDown width={15}/>}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card_Ratio;
