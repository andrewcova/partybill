const divResult =  document.getElementById('result');
const addUserParty = document.getElementById('addUserParty');
if (addUserParty) {
  
  addUserParty.addEventListener('submit', async (e) => {
    e.preventDefault();
    const {name:{value:name}, price:{value:price}, currency:{value:currency}} = e.target;
    const userInDiv = document.getElementsByClassName('userParty');
    let existUser = false;
    for (let i = 0; i < userInDiv.length; i++) {
      const userName=userInDiv[i]
      if(name === userName.innerText.split(' ')[0] ){
        existUser = true;
        const divТotice = document.createElement('h3');
        divТotice.className = 'deleteDiv';
        divТotice.innerText = 'Имя должнобыть уникальным';
        divResult.appendChild(divТotice);
      }
    }
    if (!existUser) {
      const newUser = document.createElement('p');
      newUser.className = 'userParty';
      newUser.innerText = `${name} ${price}-${currency}`;
      divResult.appendChild(newUser);
      const deletElement = document.getElementsByClassName('deleteDiv');
      if (deletElement.length) {
        while(deletElement.length > 0) deletElement[0].remove();
        console.log('remove');
      }
    }
  });
}

document.addEventListener('click', async (e) => {
  const act = e.target.innerText;
  const arrUserParty = [];
  if (act === 'СОЗДАТЬ' || act === 'Создать') {
    e.preventDefault();
  const element = document.getElementsByClassName('userParty');
  
  for (let index = 0; index < element.length; index++) {
    arrUserParty.push(element[index].innerText);
  }
  }
  if (arrUserParty.length) {

      const resp = await fetch('/newParty', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(arrUserParty),
      });
      const res = await resp.json();
      const divDone = document.createElement('div');
      divDone.innerHTML = '<h1 class="userParty">Должники</h1>';
      const divMain = document.getElementById('contenerFormAndDone');
      divDone.className = 'done';
      res.debtors.map((el) => {
        const newUser = document.createElement('h3');
        newUser.className = 'userParty';
        newUser.innerText = el;
        divDone.appendChild(newUser);
      });
      divMain.appendChild(divDone);
      
      const divNoDone = document.createElement('div');
      divNoDone.className = 'done';
      divNoDone.innerHTML = '<h1 class="userParty">Участники</h1>';
      arrUserParty.map((el)=> {
        const newUser = document.createElement('h3');
        newUser.className = 'userParty';
        newUser.innerText = el;
        divNoDone.appendChild(newUser);
      });
      divMain.appendChild(divNoDone);
      document.getElementById('patyForm').remove();
  }
    
  });


