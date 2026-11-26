const express = require('express');
const app = express()
const port = 3001

app.use(express.json());

const users = [
    {
        id: 1,
        name: "Giorgi",
        age: 28,
        position: "Developer"
    },
    {
        id: 2,
        name: "Luka",
        age: 25,
        position: "Developer"
    },
    {
        id: 3,
        name: "Lizi",
        age: 22,
        position: "Designer"
    }
];

// ლოგირების middleware (უნდა იყოს როუტებამდე, რომ ყველა რექვესთზე იმუშაოს)
app.use((req, res, next) => {
    const time = new Date().toISOString();
    console.log(`[${time}] ${req.method} ${req.originalUrl}`);
    next();
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/tbc', (req, res) => {
    res.send('თიბისი ტექსკოლა')
})

app.get('/gamarjoba', (req, res) => {
    res.send("გამარჯობა თიბისი");
})

app.get('/api/users', (req, res) => {
    const { position } = req.query;

    if (position) {
        const filteredUsers = users.filter(
            user => user.position.toLowerCase() === position.toLowerCase()
        );
        return res.status(200).json(filteredUsers);
    }

    res.status(200).json(users);
});

app.get('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ message: "მომხმარებელი ვერ მოიძებნა" });
    }

    res.status(200).json(user);
});

app.post('/api/users', (req, res) => {
    const { name, age, position } = req.body;

    if (!name || !age || !position) {
        return res.status(400).json({ message: "ყველა ველი (name, age, position) სავალდებულოა" });
    }

    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

    const newUser = {
        id: newId,
        name,
        age: Number(age),
        position
    };

    users.push(newUser);
    res.status(201).json(newUser);
});

app.put('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ message: "მომხმარებელი ვერ მოიძებნა" });
    }

    const { name, age, position } = req.body;

    if (!name || !age || !position) {
        return res.status(400).json({ message: "ყველა ველი (name, age, position) სავალდებულოა" });
    }

    users[userIndex] = {
        id,
        name,
        age: Number(age),
        position
    };

    res.status(200).json(users[userIndex]);
});

app.patch('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ message: "მომხმარებელი ვერ მოიძებნა" });
    }

    const { name, age, position } = req.body;

    if (name !== undefined) user.name = name;
    if (age !== undefined) user.age = Number(age);
    if (position !== undefined) user.position = position;

    res.status(200).json(user);
});

app.delete('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ message: "მომხმარებელი ვერ მოიძებნა" });
    }

    const deletedUser = users.splice(userIndex, 1)[0];
    res.status(200).json({ message: "მომხმარებელი წარმატებით წაიშალა", user: deletedUser });
});



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
