const bodyDiv = document.getElementById('bodydiv');
const profilParty = document.getElementById('profilParty');

profilParty && profilParty.addEventListener('click', async (e) => {
  e.preventDefault();
  const respons = await fetch('/profilParty');
  const resp = await respons.json();
if(resp.arrParty.length === 0) {
  window.location.assign('/');
}
  const divPartys = document.createElement('div');
  divPartys.className = 'contanerItems';
  for (let i = 0; i < resp.arrParty.length; i++) {
      const div = document.createElement('div');
      const time = resp.arrParty[i].date;
      const date = time.split('').reverse().join('').slice(14).split('').reverse().join('');
      const h3Time = document.createElement('h3');
      h3Time.innerText = `Дата ${date}`;
      h3Time.className = 'date-Party'
      div.appendChild(h3Time);
      div.className = 'done';
      div.id = `done${resp.arrParty[i]._id}`;
      const h1M = document.createElement('h1');
      h1M.innerText = 'Учасники';
      div.appendChild(h1M);
      resp.arrParty[i].member.map((el)=>{
      const h3 = document.createElement('h3');
      h3.innerText = el;
      div.appendChild(h3);
      });
      const h1B = document.createElement('h1');
      h1B.innerText = 'Должники';
      div.appendChild(h1B);
      resp.arrParty[i].debtors.map((el)=>{
      const h3 = document.createElement('h3');
      h3.innerText = el;
      div.appendChild(h3);
       });
      const a = document.createElement('a');
      a.innerText = 'Удалить';
      a.className = 'aDelete';
      a.id = `${resp.arrParty[i]._id}`;
      a.href = `/deleteParty/${resp.arrParty[i]._id}`;
      console.log(a,'aaaaaaaaaaaaaaaaa');
      const h3 = document.createElement('h3');
      h3.appendChild(a);
      div.appendChild(h3);
      divPartys.appendChild(div);
  }
  const divConaner =  document.getElementById('contenerFormAndDone');
  divConaner.innerHTML = "";
  bodyDiv.appendChild(divPartys);
});
///////////////////////////////// contanerItems

if (bodyDiv) {
 bodyDiv.addEventListener('click', (e) => {
  e.preventDefault();
  console.log(e.target.id, 'e.target.id');
  console.log(e.target.innerText, 'e.target.innerText,');
  if(e.target.innerText === 'Удалить'){
    const myobj = document.getElementById(`done${e.target.id}`);
    myobj.remove();
    const result = fetch(`/deleteParty/${e.target.id}`);
    
  }
});
}
