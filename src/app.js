const fs = require('fs');
const express = require('express');
const path = require('path');
const { render } = require('express/lib/response');

const app = express();


app.set('views',path.join(__dirname+"/views"));
app.set("view engine", 'ejs');


app.use(express.static(path.join(__dirname+"/public")));
app.use(express.urlencoded({extended: true}));

const accountData = fs.readFileSync(path.join(__dirname+'/json/accounts.json'), {encoding: 'UTF8'});

const accounts = JSON.parse(accountData);

const userData = fs.readFileSync(path.join(__dirname+'/json/users.json'), {encoding: 'UTF8'});

const users = JSON.parse(userData);


app.get("/", (req, res) => {
    res.render("index", {title: "Account Summary", accounts: accounts});
});

app.get("/profile", (req, res) => {
    res.render("profile", {user: users[0]});
});

app.get("/savings", (req, res) => {
    res.render("account", {account: accounts.savings});
});
app.get("/credit", (req, res) => {
    res.render("account", {account: accounts.credit});
});
app.get("/checking", (req, res) => {
    res.render("account", {account: accounts.checking});
});
app.get("/transfer", (req, res) => {
    res.render("transfer");
});
app.get("/payment", (req, res) => {
    res.render("payment", {account: accounts.credit});
});

app.post("/transfer", (req, res) => {
    const fromAccount = req.body.from;
    const toAccount = req.body.to;
    const fromAccountBalance = parseInt(accounts[fromAccount].balance);
    const toAccountBalance = parseInt(accounts[toAccount].balance)
    const amount = req.body.amount;
    let newFromAccountBalance = fromAccountBalance - amount;
    let newToAccountBalance = toAccountBalance + amount;

    accounts[fromAccount].balance = newFromAccountBalance;
    accounts[toAccount].balance = newToAccountBalance;

    let accountsJSON = JSON.stringify(accounts);

    fs.writeFileSync(path.join(__dirname+'/json/accounts.json'), accountsJSON, {encoding: 'UTF8'});

    res.render("transfer", {message: "Transfer Completed"});
});


app.post("/payment", (req, res) => {
    const amount = req.body.amount;
    accounts.credit.balance = parseInt(accounts.credit.balance) - parseInt(amount);
    accounts.credit.available = parseInt(accounts.credit.available) + parseInt(amount);

    let accountsJSON = JSON.stringify(accounts);
    fs.writeFileSync(path.join(__dirname+'/json/accounts.json'), accountsJSON, {encoding: 'UTF8'});

    res.render("payment", {message: "Payment Successful", account: accounts.credit})


});
app.listen(3000, ()=> {
    console.log('PS Project Running on port 3000!');
});

