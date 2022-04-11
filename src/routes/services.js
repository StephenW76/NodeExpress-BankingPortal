const express = require('express');
const { accounts, writeJSON } = require('../data');
const router = express.Router();


router.get("/transfer", (req, res) => {
    res.render("transfer");
});
router.get("/payment", (req, res) => {
    res.render("payment", {account: accounts.credit});
});

router.post("/transfer", (req, res) => {
    const fromAccount = req.body.from;
    const toAccount = req.body.to;
    const fromAccountBalance = parseInt(accounts[fromAccount].balance);
    const toAccountBalance = parseInt(accounts[toAccount].balance)
    const amount = req.body.amount;
    let newFromAccountBalance = fromAccountBalance - amount;
    let newToAccountBalance = toAccountBalance + amount;

    accounts[fromAccount].balance = newFromAccountBalance;
    accounts[toAccount].balance = newToAccountBalance;
    writeJSON();
    //let accountsJSON = JSON.stringify(accounts);

    //fs.writeFileSync(path.join(__dirname+'/json/accounts.json'), accountsJSON, 'utf8');

    res.render("transfer", {message: "Transfer Completed"});
});


router.post("/payment", (req, res) => {
    const amount = req.body.amount;
    accounts.credit.balance = parseInt(accounts.credit.balance) - parseInt(amount);
    accounts.credit.available = parseInt(accounts.credit.available) + parseInt(amount);
    writeJSON();
    //let accountsJSON = JSON.stringify(accounts);
    //fs.writeFileSync(path.join(__dirname+'/json/accounts.json'), accountsJSON, 'utf8');

    res.render("payment", {message: "Payment Successful", account: accounts.credit})


});

module.exports = router;