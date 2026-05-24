# Business

**The Problem**

In any application, one of the primary goals is understanding what exactly is going on while it is being used.

Application Developers usually want to:

1\. Understand the user’s experience while using their application.  
2\. Catch certain errors or bugs that the users encounter and fix them later.  
3\. Make decisions based on which features are used the most in order to focus on, and which ones that are completely abandoned and not worth further time or money investments.

**The Solution**

You will be offering an all-in-one logging system that application developers can rely on in order to save, manage, and analyze logs of the applications they build\!

# Requirement 1

**Requirement 1**

Build a backend server application with node.js, express, and mongoose.

You will have three primary models:

**1\. Developer**. 

It is the user who is interested in your solution and wants to use it to manage his/her applications' logs.

\- Username.  
\- Email.  
\- Password.  
\- Unique API key (Must be used to save a log).

**2\. Application**. 

It is a project the developer has built and wants to manage its logs.

\- Name.  
    a. Unique across the entire database.  
    b. Whitespaces are not allowed.  
\- Created at.

**3\. Log**. 

It is a piece of useful information that is collected during a particular event in the application's runtime and should be saved.

\- Message.  
\- Level (One of the following three):  
    a. INFO (For basic information the user is interested in).  
    b. WARN (For minor issues).  
    c. ERROR (For critical bugs and errors).  
\- Count (Number of times this message has been logged).  
\- Created at.  
\- Updated at.

---

Your backend server should offer the following endpoints:

**1\. Developer endpoints:**  
\- Login endpoint. */api/users/login*  
\- Register endpoint. */api/users/register*  
\- Logout endpoint. */api/users/logout*

**2\. Application endpoints:**  
\- Get all applications. */api/applications*  
\- Get an application by name. */api/applications/:name*  
\- Create an application. */api/applications*  
\- Delete an application. */api/applications/:name*

**3\. Logs endpoints:**  
\- Get all logs of an application (Sorting, Pagination, Filtration). */api/applications/:name/logs*

\- Post a log to an application (Must validate the developer's API key). */api/applications/:name/logs*

---

**Notes**

\- It's your responsibility to correctly establish the relations between those models.  
\- You must protect your routes against unauthorized users.  
\- Use query params for filtering, sorting, and paginating the logs.

# Requirement 2

**Requirement 2**

Build a dashboard for the application developers to manage their applications and logs. You can either build it by serving HTML pages or template engines directly from your express server, or you can have it as a separate application built with your favorite client-side technology *(React, Angular, etc.)*

The dashboard should offer the following features:

1\. Application developers can login, register, & logout.  
2\. They can view their account's API key.  
3\. They can view all their applications.  
4\. They can create and delete an application.  
5\. When the user clicks on an application, he goes to a page displaying the application's details.  
6\. Display a table with all the logs of the application, paginated by 10\.  
7\. Logs should by default be sorted by the most recently logged.  
8\. For each row, you should display the log's message, level, count, first occurrence datetime, last occurrence datetime.  
9\. You can control the sorting algorithm of the logs by either most recent (default), or most occurred (highest count).  
10\. You can filter logs by their level.  
11\. You can filter logs by searching for a log's message.

---

**Bonus**

1\. Display a pie chart that shows the ratio of INFO/WARN/ERROR logs in the project.  
2\. Display a line graph that shows the number of logs for each day, with 3 lines, each one representing one of the levels.  
3\. The charts can either be above the table, or have two tabs one for the table and another one for the charts.  
4\. Feel free to display any more useful information about the developer's application.

# Requirement 3

**Requirement 3**

The developer will need to start sending logs inside of his application.  
For that purpose, you will publish a npm package that will act as a Server SDK that the developer will rely on to send logs through it.

The package should offer two main methods:

1\. **init** \=\> Used to pass the client’s API key and application's unique name.  
2\. **log** \=\> Used to send a log. This method will accept the log’s data and then send a POST API request using the data provided in the init.

**Note**

You must validate that only the owner of both the API key and the application can send logs.

# Important Guidelines

**Important Guidelines**

**AI Tools usage.**

\- Those applications would normally take weeks in order to build them correctly.   
\- However, you are completely allowed to use AI Tools (Cursor, Copilot, Codex, etc.) to build those applications, which will save you so much time, and at the same time keep it somehow challenging.  
\- Use these tools in order to boost your development and implement your ideas faster.  
\- It's important to make good architectural decisions and apply clean code principles.  
\- If you rely on AI tools to just get things done and make it work while having a messy codebase, you will most likely not be selected.

**Dashboard UI/UX Design.**

\- For the dashboard, No specific design is included.  
\- The reason is that this project should be a chance to make each one of you have a unique project in his/her CV that stands out from the rest of the students.  
\- If all of you build the same UI, it will be difficult to differentiate yourselves.  
\- Since AI Tools are allowed, you can use tools like [Stitch UI](https://stitch.withgoogle.com/) to generate your own design with your own prompts.  
\- You can also find a design by browsing through the Figma Community, which surely contains various designs for Dashboards.

**Task submission.**

\- Send me an email with your task's details before the deadline.  
\- Include the links to all your github repositories, npm packages, and live URLs if you have managed to deploy your applications on any provider with a free-tier.

**Candidate Selection Criteria:**

\- Meeting the deadline.  
\- Meeting the requirements specified in this document.  
\- Time management is crucial. Always have something ready to submit.  
\- Quality over quantity. One solid application submitted by a candidate is more valuable than two or three weak applications submitted by another candidate.  
\- Clean code and structure of your project.  
\- Protecting your endpoints against unauthorized usage.  
\- Level of control over AI Tools, measured by the quality of your output (codebase).  
\- Applying git best practices and naming conventions.

# Final Message

**Final Message**

Don’t let this task stress you out.

Don’t worry too much about competition. Build this project for yourself and have fun doing so. No matter how it goes, you will become a winner.

Good luck to all of you :)  
