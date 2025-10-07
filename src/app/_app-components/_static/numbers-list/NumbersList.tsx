import "./NumbersList.css";
import { Fab } from "@mui/material";

type NumbersListProps = {
  euroNumber1: number;
  euroNumber2: number;
  winningNumber1: number;
  winningNumber2: number;
  winningNumber3: number;
  winningNumber4: number;
  winningNumber5: number;
};

export default function NumbersList({
  winningNumber1 = 1,
  winningNumber2 = 2,
  winningNumber3 = 3,
  winningNumber4 = 4,
  winningNumber5 = 5,
  euroNumber1 = 6,
  euroNumber2 = 7,
}: NumbersListProps) {
  return (
    <div className="numbers-list">
      <div className="default-numbers">
        <Fab className="numbers-button" color="primary" size="small">
          {winningNumber1}
        </Fab>
        <Fab className="numbers-button" color="primary" size="small">
          {winningNumber2}
        </Fab>
        <Fab className="numbers-button" color="primary" size="small">
          {winningNumber3}
        </Fab>
        <Fab className="numbers-button" color="primary" size="small">
          {winningNumber4}
        </Fab>
        <Fab className="numbers-button" color="primary" size="small">
          {winningNumber5}
        </Fab>
        <Fab className="numbers-button" color="success" size="small">
          {euroNumber1}
        </Fab>
        <Fab className="numbers-button" color="success" size="small">
          {euroNumber2}
        </Fab>
      </div>
    </div>
  );
}
