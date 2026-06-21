import { useEffect, useRef, useState } from 'react'

function useInView() {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.8 }
        )
        if (ref.current) observer.observe(ref.current);

        return () => observer.disconnect();
    }, [])
    return { ref, isVisible };
}

export default useInView;
