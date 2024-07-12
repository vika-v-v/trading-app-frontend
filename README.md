# Trading Application

This repository contains the frontend for the Trading application developed using Angular. This was a group project for university. The repository includes a simple mock server to replace the backend (it does not save any data or allow registration, but you can click through the app). Use the test user with email <em>test@test.de</em> and password <em>test123</em> to test the app.

<p align="center">
  <iframe width="80%" height="auto" style="max-width: 560px;" src="https://www.youtube.com/embed/2qALI9QUW5A?autoplay=1&mute=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
  <br>
  <iframe width="80%" height="auto" style="max-width: 560px;" src="https://www.youtube.com/embed/ghZr5NSFoVE?autoplay=1&mute=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</p>

# Get Started
Prerequisites: Node.js and Angular must be installed.
<ol>
    <li>Open the terminal and navigate to the project root.</li>
    <li>Run <code>cd wertpapieranlagen</code>.</li>
    <li>Run <code>npm i</code> (npm install) to install the necessary node_modules.</li>
    <li>Run <code>ng s</code> (ng serve) to start the application.</li>
    <li>Open <a href="http://localhost:4200/">http://localhost:4200/</a> in your browser, and use the test user with email <em>test@test.de</em> and password <em>test123</em> to explore the app.</li>
</ol>

# Switching from Mock Server to Backend
To integrate the frontend with the backend, follow these steps:
<ol>
    <li>Develop the required API endpoints (they are listed in the <a href='/wertpapieranlagen/src/app/mock-server/'>mock-server</a> services, and examples of their usage can be found in the <a href='/wertpapieranlagen/src/app/services/'>services</a> folder).</li>
    <li>Open `app.config.ts` and set the "USE_MOCK" variable to `false`.</li>
    <li>Update the "ROOT_URL" variable in `app.config.ts` to the root URL of your server.</li>
    <li>Run your server and test the application to ensure it connects properly.</li>
</ol>
