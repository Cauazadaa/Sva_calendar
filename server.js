const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors()); // Permite requisições de outros domínios
app.use(express.static(path.join(__dirname, '../public')));
const remindersFilePath = path.join(__dirname, 'reminders.json');

// Função para ler os lembretes do arquivo JSON
function getReminders() {
    if (!fs.existsSync(remindersFilePath)) {
        return [];
    }
    const data = fs.readFileSync(remindersFilePath, 'utf8');
    return JSON.parse(data);
}

// Função para salvar os lembretes no arquivo JSON
function saveReminders(reminders) {
    fs.writeFileSync(remindersFilePath, JSON.stringify(reminders, null, 2));
}
//rota para a raiz 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
// Rota para obter os lembretes
app.get('/api/reminders', (req, res) => {
    const reminders = getReminders();
    console.log('Lembretes retornados:', reminders);
    res.json(reminders);
});

// Rota para adicionar um novo lembrete
app.post('/api/reminders', (req, res) => {
    const newReminder = req.body;
    const reminders = getReminders();

    // Validação simples
    if (!newReminder.date || !newReminder.text) {
        return res.status(400).json({ error: 'Data e texto do lembrete são obrigatórios.' });
    }

    reminders.push(newReminder);
    saveReminders(reminders);
    console.log('Novo lembrete adicionado:', newReminder);
    res.status(201).json(newReminder);
});
// rota para apagar e atualizar lembretes
app.delete('/api/reminders/:id',(req, res) => {
    const reminders = getReminders();
    const reminderId = req.params.id;
    console.log(`id para exclusao ${reminderId}`);
    const updateReminder = reminders.filter(reminder => reminder.id.toString() !== reminderId.toString());
    console.log('lembretes depois da exclusão:',updateReminder)
    if (updateReminder.length === reminders.length){
        console.log('lembrete nao encontrado');
        return res.status(404).json({ message: 'Lembrete não encontrado.' });
    }
    
    
    saveReminders(updateReminder);

    res.status(200).json({ message: 'lembrete excluido com sucesso'});
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
