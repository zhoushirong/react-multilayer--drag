import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import './index.css'

export default class SubItems extends React.Component {
  render() {
    return (
      <Droppable
        droppableId={this.props.droppableId}
        type={this.props.type}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            className={`child-draggable-box ${snapshot.isDraggingOver ? 'child-draggable-box-over' : ''}`}
          >
            {this.props.items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div {...provided.dragHandleProps}>
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`child-draggable-box ${snapshot.isDragging ? 'child-draggable-box-ing' : ''}`}
                    >
                      {item.content}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }
}
