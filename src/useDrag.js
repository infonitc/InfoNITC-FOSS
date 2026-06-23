import { useRef, useState } from "react";

/**
 * Minimal drag-to-reorder for both mouse and touch.
 * Returns { dragProps(index), isDragging(index), reorderStyle(index) }
 */
export function useDragReorder(items, onReorder) {
  const dragging = useRef(null);
  const over     = useRef(null);
  const [dragIdx, setDragIdx] = useState(null);

  const commit = () => {
    if (dragging.current !== null && over.current !== null && dragging.current !== over.current) {
      const copy = [...items];
      const [moved] = copy.splice(dragging.current, 1);
      copy.splice(over.current, 0, moved);
      onReorder(copy);
    }
    dragging.current = null;
    over.current     = null;
    setDragIdx(null);
  };

  const dragProps = (i) => ({
    draggable: true,
    onDragStart: () => { dragging.current = i; setDragIdx(i); },
    onDragEnter: () => { over.current = i; },
    onDragEnd:   commit,
    onDragOver:  (e) => e.preventDefault(),
  });

  const isDragging   = (i) => dragIdx === i;
  const reorderStyle = (i) => ({
    opacity:   isDragging(i) ? 0.4 : 1,
    cursor:    "grab",
    transition:"opacity .15s",
  });

  return { dragProps, isDragging, reorderStyle };
}
