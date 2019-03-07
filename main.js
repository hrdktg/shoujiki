form = document.getElementById("form");
loader = document.getElementById("loader");
cont = document.getElementById("main-content");
msgList = document.getElementById("msgList");


const api_url = 'http://localhost:5000/send';
const get_api_url = 'http://localhost:5000/getMsg';

listAllMsg();
loader.style.display='none';
var ctMsg=0;

form.addEventListener('submit', (event)=> {
    event.preventDefault();
    console.log('Form was submitted');

    const formData = new FormData(form);

    //Get name and msg from form
    const name = formData.get('name');
    const content = formData.get('msg');

    console.log([name,content]);

    const mdata = {
        name,
        content
    };

    //Send mdata to nodejs app as json data
    fetch(api_url, {
        method: 'POST',
        body: JSON.stringify(mdata),
        headers: {
            'content-type': 'application/json'
        }
    }).then(res=>res.json())
      .then(createdData => {
          console.log(createdData, "recd on client");
          form.reset();

          ctMsg++;
          if(ctMsg>=3) {
              ctMsg=0;
              hideForm(); 
          }

          console.log(ctMsg, " current number of msg");
          listAllMsg();
      });
});

function showForm() {
    loader.style.display='none';
    cont.style.display="block";
}

function hideForm() {
    loader.style.display='block';
    cont.style.display="none";
    setTimeout(showForm, 10000);
}

function listAllMsg() {
    msgList.innerHTML = "";
    fetch(get_api_url)
    .then(response => response.json())
    .then(mews => {
        console.log(mews);
        mews.forEach(mew => {
            const div = document.createElement('div');
            div.classList.add("tile", "is-child", "notification", "is-primary", "box");
            
            const mdate = document.createElement('p');
            mdate.classList.add("subtitle", "is-4");
            mdate.textContent = mew.created;

            const header = document.createElement('h3');
            header.classList.add("title", "is-3");
            header.textContent = mew.name;

            const contents = document.createElement('p');
            contents.classList.add("subtitle", "is-3");
            contents.textContent = mew.content;

            div.appendChild(mdate);
            div.appendChild(header);
            div.appendChild(contents);

            msgList.appendChild(div);
        });
    });
}