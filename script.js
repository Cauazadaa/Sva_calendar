const calendarElement = document.querySelector('.calendar-body');
const reminderForm = document.getElementById('reminder-form');
const reminderTextInput = document.getElementById('reminder-text');
const reminderColorInput = document.getElementById('reminder-color');
const cityInput = document.getElementById('city');
const saveReminderButton = document.getElementById('save-reminder');
let selectedDate = null;

//função para destacar o dia atual 
function highlightDia(){
    const today = new Date();
    const currentDay = today.toISOString().split('T')[0]; // Formata como 'YYYY-MM-DD'

    const days = document.querySelectorAll('.day');
    days.forEach(day => {
        if(day.dataset.date === currentDay) {
            day.classList.add('dia-atual'); 
   }  
 });  
}

highlightDia();


//eventos de click aos dias do calendario
calendarElement.addEventListener('click', (event) => {
    if (event.target.classList.contains('day')) {
        selectedDate = event.target.dataset.date; // Obtém a data do dia clicado
        reminderForm.style.display = 'block'; // Mostra o formulário
    }
});

saveReminderButton.addEventListener ('click',async () => {
    const reminder = {
        id: Date.now().toString(),  // Cria um id único para cada lembrete
        date: selectedDate,
        text: reminderTextInput.value,
        color: reminderColorInput.value,
        city: cityInput.value

    };
    console.log('lembrete sendo salvo',reminder);
    
    await fetch('http://localhost:3000/api/reminders', {
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body : JSON.stringify(reminder),
    });
    displayReminders();
    reminderForm.style.display = 'none'; // oculta o formulário
    reminderTextInput.value = ''; // limpa o campo de texto
    cityInput.value = ''; // limpa o campo de cidade
});

async function deleteReminder(id,reminderDiv){
    try {
        const response = await fetch(`http://localhost:3000/api/reminders/${id}`, {
            method: 'DELETE',
        });
            if(!response.ok){
                throw new Error(`erro ao excluir lembrete ${response.status}`) 
          }
          if(reminderDiv){
          reminderDiv.remove();
          } // Atualiza a lista de lembretes
        } catch (error) {
            console.error('error');
        }
    }


// Função para carregar os lembretes na tela
async function displayReminders() {
    try {
        const response = await fetch('http://localhost:3000/api/reminders');
        if(!response.ok){
            throw new Error(`Falha na requisição: ${response.status}`);
        }
        const reminders = await response.json();//converte a resposta pra json
        console.log('Lembretes',reminders);//lembretes no console
        
        const days = document.querySelectorAll('.day'); // Seleciona todos os elementos dia no HTML
        days.forEach(day => { 
            const fullDate = day.dataset.date; // Acessa o atributo data-date
         const dayNumber = fullDate.split('-')[2]; // Divide a data no formato 'yyyy-mm-dd' e pega apenas o dia (última parte)
            day.innerHTML='';
            day.innerHTML = dayNumber; // Reinicia o conteúdo do dia
        });
        
        // Adiciona lembretes para os dias correspondentes
        reminders.forEach(async(reminder) => {
            const day = Array.from(days).find(day => day.dataset.date === reminder.date);
            if (day) {
                // Verifica se já há lembretes neste dia e remove todos os existentes
              
                //cria e adiciona o novo lembrete
                const reminderDiv = document.createElement('div');
                reminderDiv.className = 'reminder';
                reminderDiv.style.backgroundColor = reminder.color;
                reminderDiv.textContent = reminder.text;

                const deleteButton = document.createElement('button');
                deleteButton.classList.add ( 'delete-button');
                deleteButton.textContent = 'x';

                console.log (reminderDiv);
                //adiciona o evento de exclusão
                deleteButton.addEventListener('click', () => deleteReminder(reminder.id, reminderDiv));//chama a funçao de exclusão
                reminderDiv.appendChild(deleteButton);//botao de delete ao lembrete
                day.appendChild(reminderDiv); // Adiciona o lembrete como filho do dia
               
                //obter a previsão do tempo
                if (reminder.city) {
                    const weather = await getWeather(reminder.city);
                    if (weather) {
                        // Cria um ícone para a previsão do tempo
                        const weatherIcon = document.createElement('img');
                        weatherIcon.src = `http://openweathermap.org/img/wn/${weather.icon}@2x.png`;
                        weatherIcon.alt = weather.description;
                        weatherIcon.className = 'weather-icon'; // Adicione uma classe para estilização, se necessário
                        reminderDiv.appendChild(weatherIcon);
                    }
                }
            
                // ... restante do seu código para criar o lembrete
            }
        });
        
        
    }
    catch (error) {
        console.error('Erro ao carregar lembretes:', error);
    }
    

            // Obter a previsão do tempo se a cidade estiver disponível
;
async function getWeather(city){
    const API_KEY = '289cf63b1aae26d00c76217d35905b25';
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        if(!response.ok){
            throw new Error(`Falha na requisição: ${response.status}`);
        }
        const weatherData = await response.json();
        return{
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
            icon: weatherData.weather[0].icon,

        };
    }catch(erro){
        console.error(error);
        return null;
    }        
   
        

    }
}

// Chama a função para carregar os lembretes na tela inicialmente
displayReminders();
