import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

//laod ai answers 
function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
  element.textContent += '.';
  
  if(element.textContent === '....') {  //if the loading inicator has reached 3 dots we need reset it every 3 seconds
  element.textContent = '';
}
}, 300) 
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval (() => {
    if(index < text.length) {
    element.innerHTML += text.charAt(index);
    index++;
  } else {
    clearInterval(interval)
  }
}, 20)
}

//Generate a uniqe id for every single message (you create unique id in JS by is by using the current time and date )
//it's typed later by later 

function generateUniqueId () {
  const timestamp = Date.now()  //to make it more radom get another random number 
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

//This is charstripe function 

function chatStripe (isAi, value, uniqueId) {
  return (
    `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img 
          src="${isAi ? bot : user}" 
          alt="${isAi ? 'bot' : 'user'}"  
        />
      </div>
         <div class="message" id=${uniqueId}>${value}</div>
     </div>
    </div>

    `
  )
}

//Let us create handle submit function which is going to the trigger to get Ai generated response

const handleSubmit = async (e) => {
  e.preventDefault();  //we don't the browser to reload

  const data = new FormData(form); //we want to get the data that is typed on the form. This is simply a form element that with in our HTML line 4 and we want generate a new chat stripe

  //user's chatstripe , we say it's false b/c its not us it the AI, then clear the text area input 
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  //after clearing the chating are we can do that by typing from dot reset and nwo we are ready 
   form.reset();


//bot's chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  //fetch data from server -> bot's response

  const response = await fetch ('https://codex-0uus.onrender.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })
  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if(response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    console.log({parsedData});

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();

    messageDiv.innerHTML = "Something went wrong";
    alert(err);
  }

}

//to be able to see the changes we have to call the function 

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {  //this is the enter key on your keyboard
    handleSubmit(e);
  }
})
