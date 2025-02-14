# Project doc

## Features
- ** How to run: **
  - You can run the project using npm run dev
  - The tag script should be injected by itself. If it is not, place the script in assets/ and name it store-hours.js. The contents of the file are in public/scripts/store-hours.js. After that, go to theme.liquid and insert the script like this: 
 <script src="{{ 'store-hours.js' | asset_url }}" defer></script> 


## Main Files
- `store-hours.tsx`: Schedule configuration component logic.
- `api.store-hours.ts`: Endpoint to POST and GET.
- `StoreHoursConfigForm.tsx`: Fill in the form with the desired time.
- `StoreHoursConfigForm.css`: Components style.
- `entry.server.tsx`: Is responsible for rendering the Remix application on the server, generating the initial HTML that is sent to the client, and adding response headers necessary for the Shopify integration.
- `shopify.server.ts`: Configures and initializes the Shopify application, manages authentication, sessions, and creates ScriptTags to inject custom scripts into stores.
- `schema.prisma`: Defines the database structure, including tables for sessions (Session) and store hours (StoreHours), using the Prisma ORM.
- `/public/scripts/store-hours.js`: Responsible to check store hours, disable the "Add to Cart" button during closed hours and display an informative message to the user.


## Workflow
1. The user opens the configuration page.
2. Store hours are loaded via a GET request.
3. The user edits the hours and saves them via a POST request.


## Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.
