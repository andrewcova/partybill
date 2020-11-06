import express from 'express';
const router = express.Router();
import Party from '../models/party.js';
import User from '../models/user.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv'; 
dotenv.config(); 


function creteDebtors(arr, result = []) {

  let debtor = arr.reduce((a, b)=>{
    return Number(a.price) < Number(b.price) ? a : b;
  });
  debtor = arr.findIndex((el) => el.price === debtor.price );
  let creditor = arr.reduce((a, b)=>{
    return Number(a.price) > Number(b.price) ? a : b;
  });
  creditor = arr.findIndex((el) => el.price === creditor.price );
  const comparing = Math.floor(arr.reduce((a, b)=>{
    return a + Number(b.price);
  }, 0) / arr.length);

  const dolg = comparing - Number(arr[debtor].price);
  if (!dolg) {
    return result;
  }

if (Number(arr[creditor].price) - dolg >= comparing) {
  const serResult = `${arr[debtor].name} должен ${arr[creditor].name} ${dolg} руб`;
  arr[creditor].price = Number(arr[creditor].price) - (comparing - Number(arr[debtor].price))
  arr[debtor].price = comparing;
  result.push(serResult);
} else if (Number(arr[creditor].price) - dolg < comparing){
  const serResult = `${arr[debtor].name} должен ${arr[creditor].name} ${Number(arr[creditor].price) - comparing} руб`;
  arr[debtor].price = Number(arr[debtor].price) + (Number(arr[creditor].price) - comparing);
  arr[creditor].price = comparing;
  console.log(serResult);
  result.push(serResult);
}

  if(arr.every(( currentValue, index, arr ) => Number(currentValue.price) === comparing)){
    return result;
  }
 return creteDebtors(arr, result);
}

router.get('/', (req, res) => {

  return res.render('newParty');
});

router.put('/', async (req, res)=> {
const result = req.body;
console.log(result);
const arrObj = result.map((el) => {
  let arr = el.match(/\S+/gi);
  let nametest = arr[arr.length-1];
  arr.pop();
  console.log(nametest);
  const name = arr.join(' ');
  let price = nametest.split('-');
  const currency = price[1];
  price = price[0];
  const member = {name, price, currency};
  return member;
});
if (arrObj.find(item => item.currency !== 'RUB')) {
  const currencyFetch = await fetch(process.env.FETCH_CORENCY);
  const res = await currencyFetch.json();
  
  for (let i = 0; i < arrObj.length; i++) {
    if (arrObj[i].currency !== 'RUB' && arrObj[i].currency !== 'EUR') {
      arrObj[i].price = (Number(arrObj[i].price) / res.rates[arrObj[i].currency]) * res.rates.RUB;
      arrObj[i].price = Math.floor(arrObj[i].price);
    }else if(arrObj[i].currency === 'EUR'){
      arrObj[i].price =  Number(arrObj[i].price) * res.rates.RUB;
      arrObj[i].price = Math.floor(arrObj[i].price);
    }
    
  }
}

const debtors = creteDebtors(arrObj);
const nameUrer = req.session.username;
const now = new Date();
  const user = await User.findOne({
    name: nameUrer
  });

if (nameUrer) {
  const party = new Party({
      debtors,
      date: now,
    member: result,
    user: user._id,
  });
  await party.save();
}
return res.send({debtors});
});


export default router;
