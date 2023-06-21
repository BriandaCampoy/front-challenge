import React, { useRef, useState, useEffect } from 'react';
import Moveable from 'react-moveable';
import './styles.css';
let image = 1;

const App = () => {
  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);
  const parentRef = useRef(null);

  const addMoveable = async () => {
    // Create a new moveable component and add it to the array
    // const COLORS = ["red", "blue", "yellow", "green", "purple"];
    const Image = await getImage(image);
    image++;
    setMoveableComponents([
      ...moveableComponents,
      {
        id: Math.floor(Math.random() * Date.now()),
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        // color: COLORS[Math.floor(Math.random() * COLORS.length)],
        image: Image.url,
        updateEnd: true
      }
    ]);
  };

  const updateMoveable = (id, newComponent, updateEnd = false) => {
    const updatedMoveables = moveableComponents.map((moveable, i) => {
      if (moveable.id === id) {
        return { id, ...newComponent, updateEnd };
      }
      return moveable;
    });
    setMoveableComponents(updatedMoveables);
    // };
  };

  const handleResizeStart = (index, e) => {
    console.log('e', e.direction);
    // Check if the resize is coming from the left handle
    const [handlePosX, handlePosY] = e.direction;
    // 0 => center
    // -1 => top or left
    // 1 => bottom or right

    // -1, -1
    // -1, 0
    // -1, 1
    if (handlePosX === -1) {
      console.log('width', moveableComponents, e);
      // Save the initial left and width values of the moveable component
      const initialLeft = e.left;
      const initialWidth = e.width;

      // Set up the onResize event handler to update the left value based on the change in width
    }
  };

  return (
    <main style={{ height: '100vh', width: '100vw' }}>
      <button onClick={addMoveable}>Add Moveable1</button>
      <div
        id="parent"
        ref={parentRef}
        style={{
          position: 'relative',
          background: 'black',
          height: '80vh',
          width: '80vw'
        }}
      >
        {moveableComponents.map((item, index) => (
          <Component
            {...item}
            key={index}
            updateMoveable={updateMoveable}
            handleResizeStart={handleResizeStart}
            setSelected={setSelected}
            isSelected={selected === item.id}
          />
        ))}
      </div>
      <ComponentList
        list={moveableComponents}
        setList={setMoveableComponents}
        select={setSelected}
      />
    </main>
  );
};

export default App;

const Component = ({
  updateMoveable,
  top,
  left,
  width,
  height,
  index,
  // color,
  image,
  id,
  setSelected,
  isSelected = false,
  updateEnd
}) => {
  const ref = useRef();
  const [nodoReferencia, setNodoReferencia] = useState({
    top,
    left,
    width,
    height,
    index,
    // color,
    image,
    id
  });

  let parent = document.getElementById('parent');
  let parentBounds = parent?.getBoundingClientRect();
  const onResize = async (e) => {
    // ACTUALIZAR ALTO Y ANCHO
    let newWidth = e.width;
    let newHeight = e.height;

    const positionMaxTop = top + newHeight;
    const positionMaxLeft = left + newWidth;

    if (positionMaxTop > parentBounds?.height)
      // console.log(positionMaxTop, parentBounds?.height);
      newHeight = parentBounds?.height - top;
    if (positionMaxLeft > parentBounds?.width)
      newWidth = parentBounds?.width - left;

    updateMoveable(id, {
      top,
      left,
      width: newWidth,
      height: newHeight,
      // color,
      image
    });

    // ACTUALIZAR NODO REFERENCIA
    const beforeTranslate = e.drag.beforeTranslate;

    ref.current.style.width = `${e.width}px`;
    ref.current.style.height = `${e.height}px`;

    let translateX = beforeTranslate[0];
    let translateY = beforeTranslate[1];

    ref.current.style.transform = `translate(${translateX}px, ${translateY}px)`;

    setNodoReferencia({
      ...nodoReferencia,
      translateX,
      translateY,
      top: top + translateY < 0 ? 0 : top + translateY,
      left: left + translateX < 0 ? 0 : left + translateX
    });
  };

  const onResizeEnd = async (e) => {
    let newWidth = e.lastEvent?.width;
    let newHeight = e.lastEvent?.height;

    // const positionMaxTop = top + newHeight;
    // const positionMaxLeft = left + newWidth;

    // if (positionMaxTop > parentBounds?.height)
    //   newHeight = parentBounds?.height - top;
    // if (positionMaxLeft > parentBounds?.width)
    //   newWidth = parentBounds?.width - left;

    // const { lastEvent } = e;
    // const { drag } = lastEvent;
    // const { beforeTranslate } = drag;

    // const absoluteTop = top + beforeTranslate[1];
    // const absoluteLeft = left + beforeTranslate[0];

    updateMoveable(
      id,
      {
        top,
        left,
        width: newWidth,
        height: newHeight,
        // color,
        image
      },
      true
    );
  };

  const handleDrag = (e) => {
    let parent = document.getElementById('parent');
    let parentBounds = parent?.getBoundingClientRect();
    if (
      e.left + width +parentBounds.left <= parentBounds.right &&
      e.top + height +parentBounds.top<= parentBounds.bottom &&
      e.top >= 0 &&
      e.left >= 0
    )  {
      updateMoveable(id, {
        top: e.top,
        left: e.left,
        width,
        height,
        // color,
        image
      });
    }
  };

  return (
    <>
      <div
        ref={ref}
        className="draggable"
        id={'component-' + id}
        style={{
          position: 'absolute',
          top: top,
          left: left,
          width: width,
          height: height,
          backgroundImage: `url(${image})`,
          backgroundSize: `${(width, width)}px ${height}px`,
          backgroundPosition: 'center'
          // background: color,
        }}
        onClick={() => setSelected(id)}
      />

      <Moveable
        target={isSelected && ref.current}
        resizable
        draggable
        onDrag={handleDrag}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
        keepRatio={false}
        throttleResize={1}
        renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']}
        edge={false}
        zoom={1}
        origin={false}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
      />
    </>
  );
};

const ComponentList = ({ list, setList, select }) => {
  function handleDeleteComponent(id) {
    const newList = list.filter((item) => item.id !== id);
    setList(newList);
  }
  function handleSelectComponent(id) {
    select(id);
  }
  return (
    <div>
      <h4>Componentes</h4>
      {list.map((component) => (
        <div className="component-list-item" key={component.id}>
          <p
            className="component-list-id"
            onClick={() => {
              handleSelectComponent(component.id);
            }}
          >
            {component.id}
          </p>
          <p
            className="component-list-delete"
            onClick={() => {
              handleDeleteComponent(component.id);
            }}
          >
            Delete
          </p>
        </div>
      ))}
    </div>
  );
};

async function getImage(num) {
  const response = await fetch(
    'https://jsonplaceholder.typicode.com/photos/' + num
  );
  const data = response.json();
  return data;
}
