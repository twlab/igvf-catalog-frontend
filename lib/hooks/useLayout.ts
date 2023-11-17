import { useEffect, useState } from "react";

const headerEl = typeof document !== "undefined" ? document.getElementById('header') : null;
const footerEl = typeof document !== "undefined" ? document.getElementById('footer') : null;

export default function useLayout() {
    const [headerHeight, setHeaderHeight] = useState(headerEl?.offsetHeight || 73);
    const [footerHeight, setFooterHeight] = useState(footerEl?.offsetHeight || 73);
    const [contentHeight, setContentHeight] = useState(1000);

    useEffect(() => {
        const updateHeight = () => {
            setHeaderHeight(headerEl?.offsetHeight || 72);
            setFooterHeight(footerEl?.offsetHeight || 72);
            setContentHeight((typeof window !== "undefined" ? window.innerHeight : 1000) - headerHeight);
        }

        updateHeight();
        
        window.addEventListener('resize', updateHeight);
        
        return () => {
            window.removeEventListener('resize', updateHeight);
        }
    }, []);

    return {
        headerHeight,
        footerHeight,
        contentHeight,
    }
}
