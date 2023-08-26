import Draggable from "react-draggable"

export function DndList() {
  const names = [
    "Agus",
    "Pedro",
    "Javi",
    "Aldo",
    "Joni",
    "Jono",
    "Agus",
    "Pedro",
    "Javi",
    "Aldo",
    "Joni",
    "Jono",
  ]
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "lime",
      }}
    >
      {names.map((name, index) => (
        <Draggable defaultPosition={{ x: 0, y: index * 10 }}>
          <div
            style={{
              fontSize: "2rem",
            }}
          >
            {name}
          </div>
        </Draggable>
      ))}
    </div>
  )
}
