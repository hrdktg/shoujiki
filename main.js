form = document.getElementById("form");
loader = document.getElementById("loader");
cont = document.getElementById("main-content");

const api_url = 'http://localhost:5000/send';

loader.style.display='none';

form.addEventListener('submit', (event)=> {
    event.preventDefault();
    console.log('Form was submitted');

    const formData = new FormData(form);

    //Get name and msg from form
    const name = formData.get('name');
    const content = formData.get('msg');

    //loader.style.display='block';
    //cont.style.display="none";
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
          console.log(createdData);
      });
});