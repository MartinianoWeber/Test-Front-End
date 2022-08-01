const form = document.querySelector('#form');
const valid = document.querySelector('#valid');


form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Validate input email and name
    const email = document.querySelector('#email').value;
    const name = document.querySelector('#nombre').value;
    if(email.includes("@") && email.includes(".com") && name.length > 0 && email.length > 0){
        const data = {
            email,
            name,
        }
        fetch('https://corebiz-test.herokuapp.com/api/v1/newsletter', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(data => {
                valid.innerText = data.message;
                valid.classList.add('ok');
                setTimeout(() => {
                    valid.innerHTML = ""
                    valid.classList.remove('ok');
                }, 3000);
                document.querySelector('#form').reset();
            }).catch(err => console.log(err));
    }else{
        valid.innerText = 'Error'
        valid.classList.add('error');
        setTimeout(() => {
            valid.innerHTML = ""
            valid.classList.remove('error');
        }, 3000);
    }
    
})