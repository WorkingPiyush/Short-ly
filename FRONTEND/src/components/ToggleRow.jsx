/* eslint-disable react/prop-types */
import React from 'react'
import ToggleBtn from './ToggleBtn';

function ToggleRow({ name, desc, checked, onChange }) {
    return (
        <div className="flex items-center justify-between py-3.5
      border-b dark:border-white/5 last:border-b-0 last:pb-0 first:pt-0">
            <div className="flex-1 pr-4">
                <p className="text-[14px] font-medium dark:text-white/75 text-zinc-900 mb-0.5">{name}</p>
                <p className="text-[12px] dark:text-white/28 text-zinc-700 leading-relaxed">{desc}</p>
            </div>
            <ToggleBtn checked={checked} onChange={onChange} />
        </div>
    );
}

export default ToggleRow
