import express from "express";

const app = express();
app.use(express.json());

const userData = [
  {
    id: 101,
    name: "cm",
    email: "cmjjres@gmail.com",
  },
];

// ✅ Root route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome user..bhai" });
});

// ✅ Get all users
app.get("/user", (req, res) => {
  res.status(200).json({ message: "Data received", userData });
});

// ✅ Create new user
app.post("/create", (req, res) => {
  try {
    const { name, email } = req.body;

    const newUser = {
      id: userData.length + 1,
      name,
      email,
    };

    userData.push(newUser);
    res.status(201).json({ message: "User created successfully", newUser });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/user/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = userData.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ message: "User found", user });
});


app.put("/edit/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = userData.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { name, email } = req.body;
  user.name = name || user.name;
  user.email = email || user.email;

  res.status(200).json({ message: "User updated successfully", user });
});


app.delete("/delete/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const index = userData.findIndex((u) => u.id === userId);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  const deletedUser = userData.splice(index, 1);
  res.status(200).json({ message: "User deleted successfully", deletedUser });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
