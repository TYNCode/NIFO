"use client";
import React, { useEffect, useState } from "react";

const ResponsiveCirclePage: React.FC = () => {
    const [circleSize, setCircleSize] = useState(0);
    const [startIndex, setStartIndex] = useState(0);

    const allDots = Array.from({ length: 11 }, (_, i) => i + 1);
    const visibleCount = 8;

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            const baseWidth = 1440;
            const baseCircleSize = 150;
            const scale = screenWidth / baseWidth;
            setCircleSize(baseCircleSize * scale);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Scroll listener — only updates startIndex, not angle
    useEffect(() => {
        let throttleTimeout: NodeJS.Timeout | null = null;

        const handleWheel = (e: WheelEvent) => {
            if (throttleTimeout) return;

            const delta = e.deltaY;
            const direction = delta > 0 ? 1 : -1;

            setStartIndex((prev) =>
                (prev + direction + allDots.length) % allDots.length
            );

            throttleTimeout = setTimeout(() => {
                throttleTimeout = null;
            }, 150);
        };

        window.addEventListener("wheel", handleWheel);
        return () => window.removeEventListener("wheel", handleWheel);
    }, [allDots.length]);

    // Core logic for rotating visible window
    const getVisibleDots = (arr: number[], start: number, count: number) => {
        const first = arr.slice(start);
        const remaining = count - first.length;
        const second = arr.slice(0, remaining);
        return [...first, ...second].slice(0, count);
    };

    const visibleDots = getVisibleDots(allDots, startIndex, visibleCount);

    // Orbital layout
    const outerEllipseWidth = circleSize * 2;
    const outerEllipseHeight = circleSize * 2;
    const radiusX = outerEllipseWidth;
    const radiusY = outerEllipseHeight;
    const dotSize = circleSize * 0.16;

    return (
        <div className="min-h-screen flex items-center justify-start bg-white">
            <div
                style={{
                    position: "relative",
                    width: `${circleSize}px`,
                    height: `${circleSize * 2}px`,
                }}
            >
                {/* Inner circle */}
                <img
                    src="/round1.svg"
                    alt="Inner Circle"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        zIndex: 2,
                        position: "relative",
                    }}
                />

                {/* Fixed 8 orbit slots + dynamic values */}
                {visibleDots.map((dotValue, i) => {
                    const angle = (2 * Math.PI * i) / visibleCount;
                    const x = radiusX * Math.cos(angle);
                    const y = radiusY * Math.sin(angle);

                    return (
                        <div
                            key={dotValue}
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "0%",
                                transform: `translate(${x}px, ${y}px)`,
                                width: `${dotSize}px`,
                                height: `${dotSize}px`,
                                backgroundColor: "#3AB8FF",
                                borderRadius: "50%",
                                zIndex: 3,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "12px",
                                transition: "transform 0.1s ease-out",
                            }}
                        >
                            {dotValue}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ResponsiveCirclePage;
