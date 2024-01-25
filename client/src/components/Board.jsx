import React from "react";
import classes from "./board.module.css";
import Task from "./Task";

const Board = ({ status, tasks }) => {
  return (
    <div
      className={`${classes.board} rounded-3xl flex flex-col items-center gap-4 relative`}
    >
      <div className="flex items-center justify-between w-full">
        <p className="text-gray-600 font-semibold text-xl tab:text-sm">
          {status}
        </p>
        <div
          className={`w-8 h-8 rounded-full tab:w-5 tab:h-5 tab:text-xs ${
            status === "In Complete"
              ? "bg-blue-700"
              : status === "On Going"
              ? "bg-orange-700"
              : "bg-green-600"
          } flex items-center justify-center text-white`}
        >
          {tasks?.length}
        </div>
      </div>
      {tasks?.length === 0 && (
        <h1 className="my-2 text-2xl font-bold">{`0 ${status} Tasks!`}</h1>
      )}
      {tasks?.map((task) => {
        return (
          <Task
            key={task.id}
            id={task.id}
            status={task.status}
            title={task.title}
            description={task.description}
            category={task.category}
            image={task?.image}
            startDate={task.startDate}
            endDate={task.endDate}
            board
          />
        );
      })}
    </div>
  );
};

export default Board;
