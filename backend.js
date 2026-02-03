
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


app.use(express.urlencoded({ extended: true }));


const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model("User", userSchema);
const allowedUsers = ["Ruchita", "Aastha", "Chirant"];

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

const ComponentSchema = new mongoose.Schema({
    name: String,
    description: String,
    buyDate: Date,
    
    cost: Number,
    warranty: Number,
    quantity: Number,
    condition: String,
    remark: String
});

const getComponentModel = (domain) => {
    // This function ensures the collection name matches the domain exactly (e.g., 'software')
    const collectionName = domain;
    if (mongoose.models[collectionName]) {
        return mongoose.model(collectionName);
    }
    // The third argument prevents Mongoose from automatically pluralizing the collection name
    return mongoose.model(collectionName, ComponentSchema, collectionName);
};

// app.post('/addComponent', async (req, res) => {
//     try {
//         const { domain, buyDate,...componentData } = req.body;
//         if (!domain) {
//             return res.status(400).json({ error: 'Domain is required.' });
//         }

//          const newComponentData = {
//             ...componentData,
//             buyDate: buyDate ? new Date(buyDate) : null,
//         };
//         const DomainComponent = getComponentModel(domain);
//         const newComponent = new DomainComponent(componentData);
//         await newComponent.save();
//         res.status(200).json({ message: 'Saved Successfully' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });



// ADD COMPONENT
app.post('/addComponent', async (req, res) => {
  try {
    const { domain, buyDate, ...componentData } = req.body;
    if (!domain) return res.status(400).json({ error: 'Domain is required.' });

    const newComponentData = {
      ...componentData,
      buyDate: buyDate ? new Date(buyDate) : null,
    };

    const DomainComponent = getComponentModel(domain);
    const newComponent = new DomainComponent(newComponentData); // ✅ use correct data
    await newComponent.save();

    res.status(200).json({ message: 'Saved Successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/getComponents/:domain', async (req, res) => {
    try {
        const domain = req.params.domain;
        if (!domain) {
            return res.status(400).json({ error: 'Domain is required.' });
        }
        const DomainComponent = getComponentModel(domain);
        const data = await DomainComponent.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/getComponentCount/:domain', async (req, res) => {
  try {
    const domain = req.params.domain;
    if (!domain) {
      return res.status(400).json({ error: 'Domain is required.' });
    }

    const DomainComponent = getComponentModel(domain);
    const count = await DomainComponent.countDocuments();

    res.json({ total: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: "User not found" });
        if (user.password !== password) return res.status(401).json({ message: "Incorrect password" });
        if (!allowedUsers.includes(user.username)) return res.status(403).json({ message: "You are not allowed to view this page" });
        return res.status(200).json({ message: "Login successful" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// app.delete('/deleteComponent/:domain/:id', async (req, res) => {
//     try {
//         const { domain, id } = req.params;
//         const DomainComponent = getComponentModel(domain);
//         const result = await DomainComponent.deleteOne({ _id: id });
//         if (result.deletedCount === 1) {
//             res.status(200).json({ message: 'Component deleted successfully' });
//         } else {
//             res.status(404).json({ message: 'Component not found' });
//         }
//     } catch (error) {
//         console.error('Error deleting component:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// DELETE COMPONENT
app.delete('/deleteComponent/:domain/:id', async (req, res) => {
  try {
    const { domain, id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const DomainComponent = getComponentModel(domain);
    const result = await DomainComponent.deleteOne({ _id: id });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Component deleted successfully' });
    } else {
      res.status(404).json({ message: 'Component not found' });
    }
  } catch (error) {
    console.error('Error deleting component:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/getComponent/:domain/:id', async (req, res) => {
    try {
        const { domain, id } = req.params;
        const DomainComponent = getComponentModel(domain);
        const component = await DomainComponent.findById(id);
        if (component) {
            res.status(200).json(component);
        } else {
            res.status(404).json({ message: 'Component not found' });
        }
    } catch (error) {
        console.error('Error fetching component:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// app.put('/updateComponent/:domain/:id', async (req, res) => {
//     try {
//         const { domain, id } = req.params;
//         const updatedData = req.body;
//         const DomainComponent = getComponentModel(domain);
//         const result = await DomainComponent.updateOne(
//             { _id: id },
//             { $set: updatedData }
//         );
//         if (result.matchedCount === 1) {
//             res.status(200).json({ message: 'Component updated successfully' });
//         } else {
//             res.status(404).json({ message: 'Component not found' });
//         }
//     } catch (error) {
//         console.error('Error updating component:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// UPDATE COMPONENT
app.put('/updateComponent/:domain/:id', async (req, res) => {
  try {
    const { domain, id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const updatedData = {
      ...req.body,
      buyDate: req.body.buyDate ? new Date(req.body.buyDate) : null, // ✅ fix date
    };

    const DomainComponent = getComponentModel(domain);
    const result = await DomainComponent.updateOne(
      { _id: id },
      { $set: updatedData }
    );

    if (result.matchedCount === 1) {
      res.status(200).json({ message: 'Component updated successfully' });
    } else {
      res.status(404).json({ message: 'Component not found' });
    }
  } catch (error) {
    console.error('Error updating component:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Server running at https://localhost:${PORT}`);
});

