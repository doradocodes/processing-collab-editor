import { useState, useRef, useEffect } from 'react';
import styles from './index.module.css';

function DraggableIndicator({ onDrag, initialHeight = 100 }) {
    const [height, setHeight] = useState(initialHeight);
    const dragStartY = useRef(0);

    const handleDragStart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragStartY.current = e.clientY;

        const handleDrag = (e) => {
            const deltaY = dragStartY.current - e.clientY;
            const newHeight = height + deltaY;
            setHeight(newHeight);
            onDrag(newHeight);
        };

        const handleDragEnd = () => {
            window.removeEventListener('mousemove', handleDrag);
            window.removeEventListener('mouseup', handleDragEnd);
        };

        window.addEventListener('mousemove', handleDrag);
        window.addEventListener('mouseup', handleDragEnd);
    };

    useEffect(() => {
        setHeight(initialHeight);
    }, [initialHeight]);

    return (
        <div
            className={styles.draggableIndicator}
            aria-label={`Draggable element. Height: ${height}`}
            onMouseDown={handleDragStart}
        >
        </div>
    );
}

export default DraggableIndicator;
