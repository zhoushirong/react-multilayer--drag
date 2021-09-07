import React, { Component } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import SubItems from "./subItems";
import { static_items } from "./data";
import './index.css'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: static_items,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
    this.toggleChange = this.toggleChange.bind(this);
  }

  toggleChange(index) {
    const items = this.state.items;
    if (items[index].childrenShow) {
      items[index].childrenShow = false;
    } else {
      items[index].childrenShow = true;
    }
    this.setState({ items })
  }

  onDragEnd(result) {
    console.log(result);
    if (!result.destination) return;
    // 父级元素拖动
    if (result.type === "droppableItem") {
      const items = reorder(
        this.state.items,
        result.source.index,
        result.destination.index
      );

      this.setState({
        items,
      });
      return;
    }
    // 子集元素拖动
    if (result.type.includes("droppableSubItem")) {
      const parentId = result.type.split("-")[1];
      const itemSubItemMap = this.state.items.reduce((acc, item) => {
        acc[item.id] = item.subItems;
        return acc;
      }, {});
      const subItemsForCorrespondingParent = itemSubItemMap[parentId];
      const reorderedSubItems = reorder(
        subItemsForCorrespondingParent,
        result.source.index,
        result.destination.index
      );
      let newItems = [...this.state.items];
      newItems = newItems.map((item) => {
        if (item.id === parentId) {
          item.subItems = reorderedSubItems;
        }
        return item;
      });
      this.setState({
        items: newItems,
      });
      console.log(reorderedSubItems, newItems)
    }
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable" type="droppableItem">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              className={`draggable-box ${snapshot.isDraggingOver ? 'draggable-over' : ''}`}
            >
              {this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div {...provided.dragHandleProps} className={`draggable-box ${snapshot.isDragging ? 'draggable-ing' : ''}`}>
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <div onClick={() => { this.toggleChange(index) }} className="draggable-toggle-icon">toggle</div>
                        {item.content}
                        {item.childrenShow && <SubItems items={item.subItems} droppableId={item.id} type={`droppableSubItem-${item.id}`} />}
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
      </DragDropContext>
    );
  }
}

// Put the thing into the DOM!
ReactDOM.render(
  <section>
    <App />
  </section>,
  document.getElementById("root")
);
