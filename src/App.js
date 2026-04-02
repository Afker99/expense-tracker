import "./styles.css";
import { useState } from "react";

export default function App() {
  const [balance, setBalance] = useState(0);
  const date = new Date();
  // const curDate = `${date.getFullYear()}-${
  //   date.getMonth() + 1
  // }-${date.getDate()}`;
  const curDate = date.toISOString().split("T")[0];

  const [transactions, setTransactions] = useState([]);

  function handleSubmit(newItem) {
    if (newItem.type === "outgoing") {
      if (newItem.amount > balance) {
        alert("You exceeding the limits");
        return;
      }
    }

    setTransactions((prev) => [...prev, newItem]);

    if (newItem.type === "income") {
      setBalance((prev) => prev + newItem.amount);
    } else {
      setBalance((prev) => prev - newItem.amount);
    }
  }

  function handleClick() {
    if (window.confirm("Are you sure you want to reset the app?")) {
      setTransactions([]);
      setBalance(0);
    }
  }

  function removeTransactionItem(removingItemId, amount) {
    setTransactions((prev) =>
      prev.filter((item) => item.id !== removingItemId)
    );

    setBalance((prev) => prev + amount);
  }

  return (
    <div className="App">
      <div className="header">
        <h1>Expense Calculator</h1>
        <button onClick={handleClick}>Reset App</button>
      </div>
      <div className="divider"></div>
      <div className="app">
        <div className="left">
          <Summary balance={balance} curDate={curDate} />
          <div className="divider"></div>
          <Form onSubmit={handleSubmit} />
        </div>
        <div className="right">
          {transactions.length === 0 ? (
            <div className="starter-state">Add Transaction to display here</div>
          ) : (
            <Transactions
              transactions={transactions}
              removeTransactionItem={removeTransactionItem}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Summary({ balance, curDate }) {
  return (
    <div className="summary">
      <div className="balance">Rs. {balance.toLocaleString()}</div>
      <div className="date">{curDate}</div>
    </div>
  );
}

function Form({ onSubmit }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("income");

  function handleSubmitLocal(e) {
    e.preventDefault();

    if (!desc || !amount || !date) {
      alert("Please fill all fields");
      return;
    }

    const newItem = {
      id: Date.now(),
      type,
      amount: Number(amount),
      desc,
      date,
    };

    onSubmit(newItem);

    setDesc("");
    setAmount("");
    setDate("");
    setType("income");
  }

  return (
    <form action="" className="form" onSubmit={handleSubmitLocal}>
      <input
        type="text"
        placeholder="Ex: Groceries"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <input
        type="text"
        placeholder="25,000"
        value={amount ? amount.toLocaleString() : ""}
        onChange={(e) => {
          const rawValue = e.target.value.replace(/,/g, "");
          if (!isNaN(rawValue)) setAmount(Number(rawValue));
        }}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <select
        name=""
        id=""
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value={"income"}>Income</option>
        <option value={"outgoing"}>Outgoing</option>
      </select>
      <input type="submit" name="" id="" value="Add Transaction" />
    </form>
  );
}

function Transactions({ transactions, removeTransactionItem }) {
  return (
    <>
      {transactions.map((item) => (
        <TransactionItem
          key={item.id}
          id={item.id}
          type={item.type}
          amount={item.amount}
          desc={item.desc}
          date={item.date}
          onClick={removeTransactionItem}
        />
      ))}
    </>
  );
}

function TransactionItem({ id, type, amount, desc, date, onClick }) {
  function handleClick() {
    const removeItemID = id;
    const removeItemIDAmount = amount;
    onClick(removeItemID, removeItemIDAmount);
  }

  return (
    <div className={`item ${type === "income" ? "income" : "outgoing"}`}>
      <div>{date}</div>
      <div>{desc}</div>
      <div style={{ color: `${type === "income" ? "green" : "black"}` }}>
        Rs. {amount.toLocaleString()}
      </div>
      <div>
        <button onClick={handleClick}>X</button>
      </div>
    </div>
  );
}
