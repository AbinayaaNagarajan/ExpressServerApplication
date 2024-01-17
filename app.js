const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;


// Middleware for Data Structuring
const structureDataMiddleware = (req, res, next) => {
  console.log('Executing structureDataMiddleware');
    req.data = {
      users: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }, {id: 3, name: 'Alice'}, {id: 4, name: 'Bobby'}],
      posts: [{ title: '1', content: '1a' }, { title: '2', content: '2a' }, { title: '3', content: '3a' }, { title: '4', content: '4a' }],
    };
    next();
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  console.log('Request:', req.method, req.url);
  next();
});

// Middleware for handling JSON
app.use(express.json());


// Data Categories Middleware
app.use(structureDataMiddleware);


   // Third-party Node package
// Use dynamic import for 'node-fetch'
import('node-fetch').then(async (module) => {
    const fetch = module.default;
  
 
    async function fetchData() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('Fetched data:', data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    }
  
    fetchData();
  }).catch((error) => {
    console.error('Error importing node-fetch:', error.message);
  });
  
  

// Regular Expression for API versioning (e.g., v1, v2, v3, etc.)
const versionRegex = /^v\d+$/;

// Middleware to validate API version in the route
const validateVersionMiddleware = (req, res, next) => {
    const { version } = req.params;
  
    if (!versionRegex.test(version)) {
      return res.status(400).json({ error: 'Invalid API version format' });
    }
  
    next();
  };
  
  // Route with regular expression for API versioning
  app.get('/api/:version/users', validateVersionMiddleware, (req, res) => {
    const { version } = req.params;
    res.json({ message: `API version ${version}: Fetching users` });
  });




// Route to render the user view as JSON
app.get('/user-view', (req, res) => {
    res.json({ users: req.data.users });
  });

// Custom Middleware 1
const customMiddleware1 = (req, res, next) => {
  console.log('Custom Middleware 1 executed');
  next();
};

// Custom Middleware 2
const customMiddleware2 = (req, res, next) => {
  console.log('Custom Middleware 2 executed');
  next();
};

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});



// Middleware Usage
app.use(customMiddleware1);
app.use(customMiddleware2);

// app.get('/user-view', (req, res) => {
//     res.json({ users: req.data.users });
//   });
  
// Form within a rendered view
app.get('/user-form', (req, res) => {
    res.json({ message: 'Render the form here if needed' });
});

// Posts Routes
app.get('/posts', (req, res) => {
    res.send(req.data.posts);
});


app.get('/posts/new', (req, res) => {
    res.send(`
        <form action="/posts" method="POST">
            <label for="title">Title:</label>
            <input type="text" id="title" name="title" required><br>
            <label for="content">Content:</label>
            <input type="text" id="content" name="content" required><br>
            <input type="submit" value="Create Post">
        </form>
    `);
});

// Route for handling the creation of a new post
app.post('/posts', (req, res) => {
    // Handle post creation logic here
    const { title, content } = req.body;
    req.data.posts.push({ title, content });
    res.json({ message: 'Post created successfully' });
});

// Middleware for Route Parameter Validation
const validateIdMiddleware = (req, res, next) => {
  const { id } = req.params;

  // Validate if id is a positive integer
  if (!/^\d+$/.test(id) || parseInt(id) <= 0) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  next();
};

// Routes
// GET route for all users
app.get('/users', (req, res) => {
  res.json(req.data.users);
});

// POST route for creating a user
app.post('/users', (req, res) => {
  const { name } = req.body;

  // Validate form data
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  // Create a new user
  const newUser = { id: req.data.users.length + 1, name };
  req.data.users.push(newUser);
  res.status(201).json(newUser);
});

// PUT route for updating user data
app.put('/users/:id', validateIdMiddleware, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // Update user data
  const userIndex = req.data.users.findIndex(user => user.id === parseInt(id));
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  req.data.users[userIndex].name = name;
  res.json(req.data.users[userIndex]);
});

// DELETE route for deleting a user
app.delete('/users/:id', validateIdMiddleware, (req, res) => {
  const { id } = req.params;

  // Delete user
  const userIndex = req.data.users.findIndex(user => user.id === parseInt(id));
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  req.data.users.splice(userIndex, 1);
  res.json({ message: 'User deleted successfully' });
});

// CSS Styling (simple)
app.use(express.static(__dirname + '/public'));

// Regular Expressions in Route Paths
app.get(/^\/users\/(\d+)$/, (req, res, next) => {
    const userId = parseInt(req.params[0]);
    console.log("Received ID:", userId);
  
    if (isNaN(userId) || userId <= 0) {
      console.log("Invalid ID format");
      return res.status(400).json({ error: 'Invalid ID format' });
    }
  
    next();
  }, (req, res) => {
    const userId = parseInt(req.params[0]);
    const user = req.data.users.find(u => u.id === userId);
  
    if (!user) {
      console.log("User not found for ID:", userId);
      return res.status(404).json({ error: 'User not found' });
    }
  
    console.log("Found user:", user);
    res.json(user);
  });
  
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
