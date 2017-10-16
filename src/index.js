import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  render() {
		return (
			<button
        className="square"
        onClick={() => this.props.onClick()}>
        {this.props.value}
			</button>
		);
	}
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} />
    );
  }

  render() {
    var board = Array(this.props.size).fill(null).map((item, i) => {
      return (
        <div key={i} className="board-row">
          {Array(this.props.size).fill(null).map((item, j) => {
            return this.renderSquare(this.props.size * i + j)
          })}
        </div>
      );
    });
    return (
      <div>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(props.boardSize ** 2).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move #${move}` :
        `Go to game start`;
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            size={this.props.boardSize}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const boardSize = Math.sqrt(squares.length);
  var winner = null;
  
  // Check rows
  for (let i = 0; i < boardSize; i++) {
    const begin = boardSize * i;
    const row = squares.slice(begin, begin + boardSize);
    winner = row.reduce((acc, value) => {
      return acc === value ? acc : null;
    });
    if (winner) {
      break;
    }
  }
  if (winner) {
    return winner;
  }

  // Check columns
  for (let i = 0; i < boardSize; i++) {
    const column = [];
    for (let j = 0; j < boardSize; j++) {
      column.push(squares[i + boardSize * j]);
    }
    winner = column.reduce((acc, value) => {
      return acc === value ? acc : null;
    });
    if (winner) {
      break;
    }
  }
  if (winner) {
    return winner;
  }

  // Check diagonals
  let prev = false;
  for (let i = 0; i < boardSize; i++) {
    const value = squares[i + boardSize * i];
    if (prev === false || prev === value) {
      prev = value;
    }
  }
  winner = prev ? prev : winner;
  if (winner) {
    return winner;
  }
  prev = false;
  for (let i = 0; i < boardSize; i++) {
    const value = squares[(boardSize - 1) * (i + 1)];
    if (prev === false || prev === value) {
      prev = value;
    }
  }
  winner = prev ? prev : winner;
  if (winner) {
    return winner;
  }
  return winner;
}

ReactDOM.render(
  <Game boardSize={4} />,
  document.querySelector("#root")
);