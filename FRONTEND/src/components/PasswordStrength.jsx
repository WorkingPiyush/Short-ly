import React from 'react'

// eslint-disable-next-line react/prop-types
function PasswordStrength({ password }) {

    const getStrength = (pwd) => {
        let score = 0;

        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;

        return score;
    };
    
    const strength = getStrength(password);

    return (
        <div className="flex gap-2 mt-3">
            {[1, 2, 3, 4].map((level) => (
                <div
                    key={level}
                    className={`h-1 flex-1 rounded transition-all duration-300 ${strength >= level
                        ? "bg-green-500"
                        : "bg-gray-700"
                        }`}
                />
            ))}
        </div>
    )
}

export default PasswordStrength
