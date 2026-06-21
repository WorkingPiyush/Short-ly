/* eslint-disable react/prop-types */
"use client"
import * as React from "react"

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"

function DropDownBtn({ time, state, setState }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="border rounded px-4 py-2 bg-[#0B0F19] cursor-pointer">
                    {`${state} Days`}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-[#0B0F19] cursor-pointer">
                <DropdownMenuRadioGroup value={state} onValueChange={setState} >
                    {time.map((item) => (
                        <DropdownMenuRadioItem key={item.value} value={String(item.value)}>
                            {item.label}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropDownBtn;