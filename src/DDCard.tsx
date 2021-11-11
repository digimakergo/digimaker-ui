import React, { useRef } from 'react'
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd'
import { XYCoord } from 'dnd-core'
import './digimaker-ui.css';

interface DragItem {
  index: number
  id: string
  type: string
}

//todo: only allow vertical move when it's in tr mode, no left-right move.
export const DDCard: React.FC<any> = ({ id, as, canDrag, index, moveCard, dropCard, children, ...props }) => {
  const ref = useRef<HTMLTableCellElement>(null)
  const [, drop] = useDrop({
    accept: 'card',
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }

      const dragIndex = item.index
      const hoverIndex = index

      // // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      //perform the action
      moveCard(dragIndex, hoverIndex)

      item.index = hoverIndex
    },
    drop(item: DragItem, monitor: DropTargetMonitor){
      dropCard(index);
    }
  })

  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: 'card', id, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag(monitor){
      return canDrag;
    }
  })

  const opacity = isDragging ? 0 : 1
  const draggableClass = canDrag?' draggable':'';
  if( props.className ){
    props.className += draggableClass;
  }else{
    props.className = draggableClass;
  }
  drag(drop(ref))
  if( as == 'tr' ){
    return (
      <tr ref={preview} style={{opacity }} {...props}>
        {children}
        <td ref={ref}>
          <a href="#" style={{cursor:'move'}} onClick={e=>e.preventDefault()}><i className="fas fa-sort"></i></a>
        </td>
      </tr>
    )
  }else{
    return (
      <div ref={ref} style={{opacity }} {...props}>
        {children}
      </div>)
  }
}
