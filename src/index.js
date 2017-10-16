import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  render() {
		return (
			<button
        className={`square ${this.props.className}`}
        onClick={() => this.props.onClick()}>
        {this.props.value}
			</button>
		);
	}
}

class Board extends React.Component {
  renderSquare(i, winning) {
    return (
      <Square 
        className={winning ? 'winning-square' : ''}
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} />
    );
  }

  render() {
    console.log(this.props.winningIndices);
    var board = Array(this.props.size).fill(null).map((item, i) => {
      return (
        <div key={i} className="board-row">
          {Array(this.props.size).fill(null).map((item, j) => {
            const index = this.props.size * i + j;
            return this.renderSquare(index, this.props.winningIndices.includes(index))
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
        winningIndices: [],
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winner = calculateWinner(squares);

    if (squares[i] || winner.value) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        winningIndices: winner.value ? winner.indices : null,
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
      let classList = ['step-btn'];
      if (this.state.stepNumber === move) {
        classList.push('selected-step');
      }
      return (
        <li key={move}>
          <button className={classList.join(' ')} onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner.value) {
      status = `Winner: ${winner.value}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            size={this.props.boardSize}
            squares={current.squares}
            winningIndices={winner.indices}
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
  const winner = {
    value: null,
    indices: [],
  };
  
  // Check rows
  for (let i = 0; i < boardSize; i++) {
    const begin = boardSize * i;
    const row = squares.slice(begin, begin + boardSize);
    winner.value = row.reduce((acc, value) => {
      return acc === value ? acc : null;
    });
    if (winner.value) {
      winner.indices = Array(boardSize).fill(null).map((item, index) => {
        return begin + index;
      });
      break;
    }
  }
  if (winner.value) {
    return winner;
  }

  // Check columns
  for (let i = 0; i < boardSize; i++) {
    const column = [];
    const indices = [];
    for (let j = 0; j < boardSize; j++) {
      let index = i + boardSize * j;
      indices.push(index);
      column.push(squares[index]);
    }
    winner.value = column.reduce((acc, value) => {
      return acc === value ? acc : null;
    });
    if (winner.value) {
      winner.indices = indices;
      break;
    }
  }
  if (winner.value) {
    return winner;
  }

  // Check diagonals
  let prev = false;
  let indices = [];
  for (let i = 0; i < boardSize; i++) {
    let index = i + boardSize * i;
    indices.push(index);
    const value = squares[index];
    if (prev === false || prev === value) {
      prev = value;
    }
  }
  winner.value = prev ? prev : winner.value;
  if (winner.value) {
    winner.indices = indices;
    return winner;
  }

  prev = false;
  indices = [];
  for (let i = 0; i < boardSize; i++) {
    let index = (boardSize - 1) * (i + 1);
    indices.push(index);
    const value = squares[index];
    if (prev === false || prev === value) {
      prev = value;
    }
  }
  winner.value = prev ? prev : winner.value;
  if (winner.value) {
    winner.indices = indices;
    return winner;
  }
  return winner;
}

ReactDOM.render(
  <Game boardSize={4} />,
  document.querySelector("#root")
);