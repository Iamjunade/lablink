import { Department, ContributionType } from './types';

export const MOCK_DATA: Department[] = [
  {
    id: 'dept-cs',
    name: 'Computer Science',
    subjects: [
      {
        id: 'subj-dv',
        name: 'Data Exploration and Visualization Lab',
        code: 'CS405L',
        driveLink: 'https://drive.google.com/drive/folders/1o-e06DLW0J0thE52BQRpom-jU10HVvSS',
        githubLink: 'https://github.com/Mahi-Repalle?page=2&tab=repositories',
        experiments: [
            {
                id: 'exp-dv-1',
                title: 'Data Understanding and Preprocessing',
                objective: 'Understand, find, explore, and clean up data. This includes handling formatting issues, outliers, duplicates, and performing normalization and standardization.',
                contributions: [],
            },
            {
                id: 'exp-dv-2',
                title: 'Parsing PDF Files with Python',
                objective: 'Develop a Python script to parse and extract data from PDF files using the pdfminer library.',
                contributions: [],
            },
            {
                id: 'exp-dv-3',
                title: 'Data Cleanup on a Real-World Dataset',
                objective: "Develop a Python script for data cleanup on the 'child labour and marriage data.xlsx' dataset. Focus on checking for duplicates and missing data, and cleaning line breaks, spaces, and special characters.",
                contributions: [],
            },
            {
                id: 'exp-dv-4',
                title: 'Correlation Visualization with Matplotlib',
                objective: 'Draw a chart to visualize the relationship between perceived corruption scores and child labour percentages using the Matplotlib library.',
                contributions: [],
            },
            {
                id: 'exp-dv-5',
                title: 'Web Scraping for robots.txt',
                objective: 'Write a Python script to download and display the content of the robots.txt file from en.wikipedia.org.',
                contributions: [],
            },
            {
                id: 'exp-dv-6',
                title: 'Introduction to Tableau Visualizations',
                objective: "Create a first visualization with Tableau software for various data file formats. Learn to create basic charts like line charts, bar charts, and tree maps using the 'Show Me' panel.",
                contributions: [],
            },
            {
                id: 'exp-dv-7',
                title: 'Advanced Tableau Calculations and Formatting',
                objective: 'Perform Tableau calculations like sum, average, and aggregate. Create custom calculations and fields. Explore advanced visualization formatting, tools, and menus for specific data calculations.',
                contributions: [],
            },
            {
                id: 'exp-dv-8',
                title: 'Editing, Formatting, and Pivoting Data in Tableau',
                objective: 'Learn to edit and format axes, manipulate data within Tableau, and utilize pivoting functionality for data transformation.',
                contributions: [],
            },
            {
                id: 'exp-dv-9',
                title: 'Data Structuring and Filtering in Tableau',
                objective: 'Master the techniques for structuring, sorting, filtering, and pivoting data to prepare it for effective visualization in Tableau.',
                contributions: [],
            },
            {
                id: 'exp-dv-10',
                title: 'Advanced Visualization Tools in Tableau',
                objective: 'Explore advanced visualization tools, including using filters, detail panels, size panels, customizing filters with tooltips, and applying color formatting to data.',
                contributions: [],
            },
            {
                id: 'exp-dv-11',
                title: 'Dashboards and Storytelling in Tableau',
                objective: 'Learn to create and design different interactive displays, and how to distribute and publish data using Tableau dashboards and storytelling features.',
                contributions: [],
            },
            {
                id: 'exp-dv-12',
                title: 'Creating Custom and Advanced Charts in Tableau',
                objective: 'Develop skills in creating custom charts, working with cyclical data, and implementing circular area charts and dual-axis charts for complex data representation.',
                contributions: [],
            }
        ],
      },
      {
        id: 'subj-ad',
        name: 'App Development Lab',
        code: 'CS501L',
        driveLink: '',
        githubLink: '',
        experiments: [
          {
            id: 'exp-ad-1',
            title: 'Android Studio Setup & Basic Intents',
            objective: 'Install Android Studio, set up an Android Virtual Device (AVD), and develop an app with menu options to dial a number, open a website, and send an SMS using intents.',
            contributions: [],
          },
          {
            id: 'exp-ad-2',
            title: 'Android Notifications and Toasts',
            objective: 'Develop a mobile app to insert notifications. On successful insertion, display a toast message to the user.',
            contributions: [],
          },
          {
            id: 'exp-ad-3',
            title: 'User Registration Screen',
            objective: 'Develop a mobile app with a registration screen. On submission, validate the user input and register the user.',
            contributions: [],
          },
          {
            id: 'exp-ad-4',
            title: 'User Login and Welcome Screen',
            objective: 'Develop a mobile app with login and welcome screens. On submission, validate the user details, and upon success, navigate to the welcome screen.',
            contributions: [],
          },
          {
            id: 'exp-ad-5',
            title: 'Flutter SDK and Dart Project Setup',
            objective: 'Install and configure the Flutter SDK. Create a new Dart project using IntelliJ IDEA.',
            contributions: [],
          },
          {
            id: 'exp-ad-6',
            title: 'Navigation and Routing in Flutter',
            objective: "Create a navigation and routing system for a sample 'Pizza Store' application in Flutter.",
            contributions: [],
          },
          {
            id: 'exp-ad-7',
            title: 'Password Reset Functionality in Flutter',
            objective: "Implement a 'forgot password' option in the Pizza Store App, allowing users to reset their password via a link sent to their email.",
            contributions: [],
          },
          {
            id: 'exp-ad-8',
            title: 'User Profile UI with Firebase',
            objective: 'Create a user profile interface in a mobile application and integrate it with Firebase for data storage and retrieval.',
            contributions: [],
          },
          {
            id: 'exp-ad-9',
            title: 'Flask Environment and HTML Templates',
            objective: 'Set up a virtual environment for Flask and create HTML templates for a web application with various menu items.',
            contributions: [],
          },
          {
            id: 'exp-ad-10',
            title: 'Handling Form Data with Flask',
            objective: 'Design an HTML form to get data from the client-side user. Access this data on the server using a POST request in a Flask application.',
            contributions: [],
          },
          {
            id: 'exp-ad-11',
            title: 'Login and Welcome Pages in Flask',
            objective: 'Develop a web application with login and welcome pages using Flask. Validate user details on submission and navigate to the welcome page upon success.',
            contributions: [],
          },
          {
            id: 'exp-ad-12',
            title: 'Simple Python Chatbot with Flask',
            objective: 'Implement a simple chatbot in a Flask web application that can answer Python-related questions from a predefined text file.',
            contributions: [],
          },
        ],
      },
      {
        id: 'subj-java',
        name: 'OOP through Java Lab',
        code: 'CS301L',
        driveLink: '',
        githubLink: '',
        experiments: [
          {
            id: 'exp-java-1',
            title: 'Quadratic Equation and Prime Numbers',
            objective: 'Write a Java program to a) find the roots of a quadratic equation and b) print all prime numbers up to a given integer using BufferedReader.',
            contributions: [
              {
                id: 'contrib-java-1',
                author: 'Initial Contribution',
                type: ContributionType.Code,
                content: 'This file contains two separate classes: one for solving quadratic equations and another for finding prime numbers.',
                codeSnippets: [{ language: 'java', code: `import java.io.BufferedReader;\nimport java.io.InputStreamReader;\nimport java.io.IOException;\n\nclass QuadraticEquation {\n    public static void main(String[] args) {\n        double a = 1, b = 5, c = 6;\n        double root1, root2;\n        double determinant = b * b - 4 * a * c;\n\n        if (determinant > 0) {\n            root1 = (-b + Math.sqrt(determinant)) / (2 * a);\n            root2 = (-b - Math.sqrt(determinant)) / (2 * a);\n            System.out.format("root1 = %.2f and root2 = %.2f", root1, root2);\n        } else if (determinant == 0) {\n            root1 = root2 = -b / (2 * a);\n            System.out.format("root1 = root2 = %.2f;", root1);\n        } else {\n            double realPart = -b / (2 * a);\n            double imaginaryPart = Math.sqrt(-determinant) / (2 * a);\n            System.out.format("root1 = %.2f+%.2fi and root2 = %.2f-%.2fi", realPart, imaginaryPart, realPart, imaginaryPart);\n        }\n    }\n}\n\nclass PrimeNumbers {\n    public static void main(String[] args) throws IOException {\n        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));\n        System.out.print("Enter a number: ");\n        int n = Integer.parseInt(reader.readLine());\n        System.out.println("Prime numbers up to " + n + " are: ");\n        for (int i = 2; i <= n; i++) {\n            boolean isPrime = true;\n            for (int j = 2; j < i; j++) {\n                if (i % j == 0) {\n                    isPrime = false;\n                    break;\n                }\n            }\n            if (isPrime) {\n                System.out.print(i + " ");\n            }\n        }\n    }\n}` }],
                upvotes: 0,
                createdAt: new Date(),
              }
            ],
          },
          {
            id: 'exp-java-2',
            title: 'Palindrome and String Sorting',
            objective: 'Write a Java program to a) check whether a given string is a palindrome and b) sort a list of strings read from the command line.',
            contributions: [
              {
                id: 'contrib-java-2',
                author: 'Initial Contribution',
                type: ContributionType.Code,
                content: 'Checks for palindrome and sorts command-line arguments.',
                codeSnippets: [{ language: 'java', code: `import java.util.Arrays;\n\npublic class StringOperations {\n    public static void main(String[] args) {\n        // Palindrome Check\n        String str = "madam";\n        String reversedStr = new StringBuilder(str).reverse().toString();\n        if (str.equals(reversedStr)) {\n            System.out.println(str + " is a palindrome.");\n        } else {\n            System.out.println(str + " is not a palindrome.");\n        }\n\n        // Sort strings from command line\n        if (args.length > 0) {\n            System.out.println("\\nOriginal command line arguments:");\n            for(String s : args) System.out.print(s + " ");\n            Arrays.sort(args);\n            System.out.println("\\nSorted command line arguments:");\n            for(String s : args) System.out.print(s + " ");\n            System.out.println();\n        } else {\n            System.out.println("\\nNo command line arguments to sort.");\n        }\n    }\n}` }],
                upvotes: 0,
                createdAt: new Date(),
              }
            ],
          },
          {
            id: 'exp-java-3',
            title: 'Method Overloading and Overriding',
            objective: 'Write a Java program to demonstrate method overloading and method overriding.',
            contributions: [
              {
                id: 'contrib-java-3',
                author: 'Initial Contribution',
                type: ContributionType.Code,
                content: 'Demonstrates compile-time (overloading) and run-time (overriding) polymorphism.',
                codeSnippets: [{ language: 'java', code: `class Animal {\n    public void makeSound() {\n        System.out.println("Animal makes a sound");\n    }\n}\n\nclass Dog extends Animal {\n    // Method Overriding\n    @Override\n    public void makeSound() {\n        System.out.println("Dog barks");\n    }\n}\n\nclass OverloadExample {\n    // Method Overloading\n    public int add(int a, int b) {\n        return a + b;\n    }\n\n    public double add(double a, double b) {\n        return a + b;\n    }\n}\n\npublic class PolymorphismDemo {\n    public static void main(String[] args) {\n        // Overriding Demo\n        Animal myAnimal = new Animal();\n        Animal myDog = new Dog();\n        myAnimal.makeSound();\n        myDog.makeSound();\n\n        // Overloading Demo\n        OverloadExample oe = new OverloadExample();\n        System.out.println("Sum of ints: " + oe.add(5, 10));\n        System.out.println("Sum of doubles: " + oe.add(5.5, 10.5));\n    }\n}` }],
                upvotes: 0,
                createdAt: new Date(),
              }
            ],
          },
          {
            id: 'exp-java-4',
            title: 'Packages and Abstract Classes',
            objective: 'Write a Java program to demonstrate a) packages and b) abstract class usage.',
            contributions: [
                {
                    id: 'contrib-java-4',
                    author: 'Initial Contribution',
                    type: ContributionType.Code,
                    content: 'Create a package `com.example` containing an abstract class and use it in another file.',
                    codeSnippets: [
                        { language: 'java', code: `// Save as com/example/Shape.java\npackage com.example;\n\nabstract class Shape {\n    abstract double area();\n}\n` },
                        { language: 'java', code: `// Save as com/example/Circle.java\npackage com.example;\n\nclass Circle extends Shape {\n    double radius;\n    Circle(double r) { this.radius = r; }\n    @Override\n    double area() {\n        return Math.PI * radius * radius;\n    }\n}\n`},
                        { language: 'java', code: `// Save as Main.java\nimport com.example.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Shape myShape = new Shape(); // Error: Cannot instantiate abstract class\n        Circle myCircle = new Circle(5.0);\n        System.out.println("Area of circle: " + myCircle.area());\n    }\n}` }
                    ],
                    upvotes: 0,
                    createdAt: new Date(),
                }
            ],
          },
          {
            id: 'exp-java-5',
            title: 'Exception Handling',
            objective: 'Write a Java program to a) demonstrate exception handling and b) create a user-defined exception.',
            contributions: [
              {
                id: 'contrib-java-5',
                author: 'Initial Contribution',
                type: ContributionType.Code,
                content: 'Shows a standard `try-catch` block and a custom exception for invalid age.',
                codeSnippets: [{ language: 'java', code: `// Custom Exception\nclass InvalidAgeException extends Exception {\n    public InvalidAgeException(String message) {\n        super(message);\n    }\n}\n\npublic class ExceptionDemo {\n    // Method to check age\n    static void validate(int age) throws InvalidAgeException {\n        if (age < 18) {\n            throw new InvalidAgeException("Age is not valid to vote");\n        }\n    }\n\n    public static void main(String[] args) {\n        // a) Standard Exception Handling\n        try {\n            int result = 10 / 0;\n        } catch (ArithmeticException e) {\n            System.out.println("Caught ArithmeticException: " + e.getMessage());\n        }\n\n        // b) User-Defined Exception\n        try {\n            validate(13);\n        } catch (InvalidAgeException e) {\n            System.out.println("Caught custom exception: " + e.getMessage());\n        }\n\n        System.out.println("Rest of the code...");\n    }\n}` }],
                upvotes: 0,
                createdAt: new Date(),
              }
            ],
          },
          {
            id: 'exp-java-6',
            title: 'Producer-Consumer Problem',
            objective: 'Write a Java program that implements the producer-consumer problem.',
            contributions: [
                {
                    id: 'contrib-java-6',
                    author: 'Initial Contribution',
                    type: ContributionType.Code,
                    content: 'A classic multi-threading synchronization problem using a shared buffer.',
                    codeSnippets: [{ language: 'java', code: `import java.util.LinkedList;\n\npublic class ProducerConsumer {\n    public static void main(String[] args) throws InterruptedException {\n        final PC pc = new PC();\n        Thread t1 = new Thread(() -> {\n            try { pc.produce(); } catch (InterruptedException e) { e.printStackTrace(); }\n        });\n        Thread t2 = new Thread(() -> {\n            try { pc.consume(); } catch (InterruptedException e) { e.printStackTrace(); }\n        });\n        t1.start();\n        t2.start();\n        t1.join();\n        t2.join();\n    }\n\n    public static class PC {\n        LinkedList<Integer> list = new LinkedList<>();\n        int capacity = 2;\n\n        public void produce() throws InterruptedException {\n            int value = 0;\n            while (true) {\n                synchronized (this) {\n                    while (list.size() == capacity) wait();\n                    System.out.println("Producer produced-" + value);\n                    list.add(value++);\n                    notify();\n                    Thread.sleep(1000);\n                }\n            }\n        }\n\n        public void consume() throws InterruptedException {\n            while (true) {\n                synchronized (this) {\n                    while (list.size() == 0) wait();\n                    int val = list.removeFirst();\n                    System.out.println("Consumer consumed-" + val);\n                    notify();\n                    Thread.sleep(1000);\n                }\n            }\n        }\n    }\n}` }],
                    upvotes: 0,
                    createdAt: new Date(),
                }
            ],
          },
          {
            id: 'exp-java-7',
            title: 'Swings Events and Factorial',
            objective: 'Write a Swings program to a) handle mouse and key events and b) compute factorial value.',
            contributions: [
              {
                id: 'contrib-java-7',
                author: 'Initial Contribution',
                type: ContributionType.Code,
                content: 'A simple Swing GUI that demonstrates event listeners.',
                codeSnippets: [{ language: 'java', code: `import javax.swing.*;\nimport java.awt.event.*;\n\npublic class SwingEventsDemo extends JFrame {\n    JLabel mouseStatus, keyStatus, factorialResult;\n    JTextField numberField;\n    JButton calcButton;\n\n    public SwingEventsDemo() {\n        setLayout(new java.awt.FlowLayout());\n        mouseStatus = new JLabel("Mouse Status: No event");\n        keyStatus = new JLabel("Key Status: No event");\n        numberField = new JTextField(10);\n        calcButton = new JButton("Factorial");\n        factorialResult = new JLabel("Result: ");\n\n        add(mouseStatus);\n        add(keyStatus);\n        add(new JLabel("Enter number:"));\n        add(numberField);\n        add(calcButton);\n        add(factorialResult);\n\n        addMouseListener(new MouseAdapter() {\n            public void mouseClicked(MouseEvent me) {\n                mouseStatus.setText("Mouse Clicked at: (" + me.getX() + ", " + me.getY() + ")");\n            }\n        });\n\n        numberField.addKeyListener(new KeyAdapter() {\n            public void keyTyped(KeyEvent ke) {\n                keyStatus.setText("Key Typed: " + ke.getKeyChar());\n            }\n        });\n        \n        calcButton.addActionListener(e -> {\n            try {\n                int n = Integer.parseInt(numberField.getText());\n                long fact = 1;\n                for(int i=1; i<=n; i++) fact *= i;\n                factorialResult.setText("Result: " + fact);\n            } catch (NumberFormatException ex) {\n                factorialResult.setText("Result: Invalid input");\n            }\n        });\n\n        setTitle("Events Demo");\n        setSize(300, 200);\n        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);\n        setVisible(true);\n    }\n\n    public static void main(String[] args) {\n        new SwingEventsDemo();\n    }\n}` }],
                upvotes: 0,
                createdAt: new Date(),
              }
            ],
          },
          {
            id: 'exp-java-8',
            title: 'Advanced Swing Components',
            objective: 'Develop a swing application using JList, JTree, JTable, JTabbedPane, and JScrollPane.',
            contributions: [
              {
                id: 'contrib-java-8',
                author: 'Initial Contribution',
                type: ContributionType.Code,
                content: 'A tabbed pane showing various advanced Swing components.',
                codeSnippets: [{ language: 'java', code: `import javax.swing.*;\nimport javax.swing.tree.DefaultMutableTreeNode;\n\npublic class AdvancedSwingDemo extends JFrame {\n    public AdvancedSwingDemo() {\n        JTabbedPane tabbedPane = new JTabbedPane();\n\n        // JList\n        String[] listData = {"Item 1", "Item 2", "Item 3"};\n        JList<String> list = new JList<>(listData);\n        tabbedPane.addTab("JList", new JScrollPane(list));\n\n        // JTree\n        DefaultMutableTreeNode root = new DefaultMutableTreeNode("Root");\n        root.add(new DefaultMutableTreeNode("Child 1"));\n        JTree tree = new JTree(root);\n        tabbedPane.addTab("JTree", new JScrollPane(tree));\n\n        // JTable\n        String[][] rowData = {{"1", "John"}, {"2", "Jane"}};\n        String[] columnNames = {"ID", "Name"};\n        JTable table = new JTable(rowData, columnNames);\n        tabbedPane.addTab("JTable", new JScrollPane(table));\n        \n        add(tabbedPane);\n        setTitle("Advanced Swing");\n        setSize(400, 300);\n        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);\n        setVisible(true);\n    }\n\n    public static void main(String[] args) {\n        new AdvancedSwingDemo();\n    }\n}` }],
                upvotes: 0,
                createdAt: new Date(),
              }
            ],
          },
          {
            id: 'exp-java-9',
            title: 'Simple Calculator using Grid Layout',
            objective: 'Write a Java program for a simple calculator using a grid layout.',
            contributions: [
              {
                id: 'contrib-java-9',
                author: 'Initial Contribution',
                type: ContributionType.Code,
                content: 'A very basic calculator GUI. Does not include calculation logic.',
                codeSnippets: [{ language: 'java', code: `import javax.swing.*;\nimport java.awt.*;\n\npublic class Calculator extends JFrame {\n    public Calculator() {\n        JTextField display = new JTextField();\n        display.setEditable(false);\n        add(display, BorderLayout.NORTH);\n\n        JPanel panel = new JPanel();\n        panel.setLayout(new GridLayout(4, 4));\n\n        String[] buttons = {\n            "7", "8", "9", "/",\n            "4", "5", "6", "*",\n            "1", "2", "3", "-",\n            "0", ".", "=", "+"\n        };\n\n        for (String text : buttons) {\n            panel.add(new JButton(text));\n        }\n\n        add(panel, BorderLayout.CENTER);\n        setTitle("Calculator");\n        setSize(300, 400);\n        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);\n        setVisible(true);\n    }\n\n    public static void main(String[] args) {\n        new Calculator();\n    }\n}` }],
                upvotes: 0,
                createdAt: new Date(),
              }
            ],
          },
          {
            id: 'exp-java-10',
            title: 'Servlet Parameters and Session Tracking',
            objective: 'Write a servlet for a) parameters passing and reading using an employee login page and b) session tracking using cookies.',
            contributions: [
                {
                    id: 'contrib-java-10',
                    author: 'Initial Contribution',
                    type: ContributionType.Code,
                    content: 'A simple login servlet that reads parameters and sets a cookie for session tracking. Requires a Servlet container like Tomcat.',
                    codeSnippets: [{ language: 'java', code: `// Note: This requires servlet-api.jar in your classpath and a web.xml configuration.\n\nimport javax.servlet.http.*;\nimport javax.servlet.*;\nimport java.io.*;\n\npublic class LoginServlet extends HttpServlet {\n    public void doPost(HttpServletRequest request, HttpServletResponse response) \n        throws ServletException, IOException {\n        \n        response.setContentType("text/html");\n        PrintWriter out = response.getWriter();\n\n        // a) Parameter Passing\n        String user = request.getParameter("username");\n        String pass = request.getParameter("password");\n\n        if (user.equals("admin") && pass.equals("pass")) {\n            out.print("Welcome, " + user);\n\n            // b) Session Tracking with Cookies\n            Cookie ck = new Cookie("user", user);\n            response.addCookie(ck);\n        } else {\n            out.print("Sorry, username or password error!");\n            request.getRequestDispatcher("login.html").include(request, response);\n        }\n\n        out.close();\n    }\n}` }],
                    upvotes: 0,
                    createdAt: new Date(),
                }
            ],
          },
          {
            id: 'exp-java-11',
            title: 'JDBC Operations',
            objective: 'Write a Java program to perform JDBC operations using the command line interface.',
            contributions: [
              {
                id: 'contrib-java-11',
                author: 'Initial Contribution',
                type: ContributionType.Code,
                content: 'Connects to a database, creates a table, inserts data, and retrieves it. Requires a JDBC driver (e.g., for MySQL or H2).',
                codeSnippets: [{ language: 'java', code: `import java.sql.*;\n\npublic class JdbcCliDemo {\n    // Example for H2 in-memory database. Replace with your DB details.\n    static final String DB_URL = "jdbc:h2:mem:testdb";\n    static final String USER = "sa";\n    static final String PASS = "";\n\n    public static void main(String[] args) {\n        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS);\n             Statement stmt = conn.createStatement()) {\n            \n            // Create Table\n            String sql = "CREATE TABLE Employees (id INT, name VARCHAR(255))";\n            stmt.executeUpdate(sql);\n            System.out.println("Table created.");\n\n            // Insert Data\n            stmt.executeUpdate("INSERT INTO Employees VALUES (1, 'John Doe')");\n            System.out.println("Data inserted.");\n\n            // Retrieve Data\n            ResultSet rs = stmt.executeQuery("SELECT * FROM Employees");\n            while (rs.next()) {\n                System.out.println("ID: " + rs.getInt("id") + ", Name: " + rs.getString("name"));\n            }\n        } catch (SQLException e) {\n            e.printStackTrace();\n        }\n    }\n}` }],
                upvotes: 0,
                createdAt: new Date(),
              }
            ],
          },
          {
            id: 'exp-java-12',
            title: 'Servlet Database Connection',
            objective: 'Write a servlet that connects to the database, retrieves the data, and displays it.',
            contributions: [
              {
                id: 'contrib-java-12',
                author: 'Initial Contribution',
                type: ContributionType.Code,
                content: 'A servlet that fetches data from a database and displays it in an HTML table. Requires a JDBC driver and Servlet container.',
                codeSnippets: [{ language: 'java', code: `import javax.servlet.http.*;\nimport javax.servlet.*;\nimport java.io.*;\nimport java.sql.*;\n\npublic class DbServlet extends HttpServlet {\n    public void doGet(HttpServletRequest request, HttpServletResponse response) \n        throws ServletException, IOException {\n        \n        response.setContentType("text/html");\n        PrintWriter out = response.getWriter();\n\n        try {\n            // Assumes a database and table from Exp 11 exist.\n            // In a real app, use connection pooling and proper configs.\n            Class.forName("org.h2.Driver"); // Example for H2 driver\n            Connection conn = DriverManager.getConnection("jdbc:h2:mem:testdb", "sa", "");\n            Statement stmt = conn.createStatement();\n            ResultSet rs = stmt.executeQuery("SELECT * FROM Employees");\n\n            out.println("<html><body><table border='1'><tr><th>ID</th><th>Name</th></tr>");\n            while (rs.next()) {\n                out.println("<tr><td>" + rs.getInt("id") + "</td><td>" + rs.getString("name") + "</td></tr>");\n            }\n            out.println("</table></body></html>");\n\n            conn.close();\n        } catch (Exception e) {\n            out.println("Error: " + e.getMessage());\n        }\n\n        out.close();\n    }\n}` }],
                upvotes: 0,
                createdAt: new Date(),
              }
            ],
          },
        ],
      }
    ],
  },
  {
    id: 'dept-ec',
    name: 'Electronics & Communication',
    subjects: [
      {
        id: 'subj-dld',
        name: 'Digital Logic Design Lab',
        code: 'EC201L',
        experiments: [
            {
                id: 'exp-dld-1',
                title: 'Implementation of Logic Gates',
                objective: 'To verify the truth tables of basic logic gates (AND, OR, NOT, NAND, NOR, XOR) using integrated circuits (ICs).',
                contributions: [],
            }
        ],
      },
    ],
  },
];