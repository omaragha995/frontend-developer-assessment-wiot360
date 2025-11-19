# Fleet Tracking Frontend (Vue 3 + Vuetify + JS)

This project is a small fleet tracking dashboard built with:

 - Vue 3 (Composition API, JavaScript)
 - Vuetify 3 (UI library)
 - Pinia (state management)
 - Vue Router (routing)
 - Leaflet (maps)
 - Vite (build tool)
 - @mdi/font for icons

 ## Features

 - Live map with ~150 mock vehicles
 - Real-time simulation: about 25% of vehicles update every 3 seconds
 - Vehicle info linked to the selected marker
 - Vehicle list view with:
   - Search by name or plate
   - Filter by status
   - Sort by name, plate, or last updated
 - Vehicle route history view:
   - Polyline of vehicle historical positions
   - Start and end markers
   - Total distance, duration, and average speed

 All views share a single Pinia store (`src/stores/vehicles.js`).

 ## Project structure (important files)

 - `src/main.js` – app entry, sets up Pinia, Router, Vuetify
 - `src/App.vue` – Vuetify layout shell and top navigation
 - `plugins/vuetify.js` Configure the vuetify libray
 - `src/router/index.js` – defines the all routes
 - `src/stores/vehicles.js` – central fleet state + filters/sorting
 - `src/services/fleetMockService.js` – generates mock vehicles & history
 - `src/composables/useFleetSimulation.js` – interval-based real-time updates
 - `src/components/navbar/Navbar.vue` - Navbar component.
 - `src/components/map/VehicleMap.vue` – Leaflet map and markers
 - `src/components/vehicle/VehicleDetails.vue` – selected vehicle details
 - `src/components/vehicle/VehicleHistory.vue` - show vehicle history details
 - `src/views/LiveMap.vue` – map + selected vehicle details
 - `src/views/VehicleList.vue` – Vuetify table with search/filter/sort
 - `src/views/VehicleHistoryPage.vue` – map with historical route and metrics
 - `src/helpers/helpers.js` - helper function to capitalize string
 - `src/enums/VehicleStatus.js` - vehicles statuses & colors.

 ## How to run

 1. Install dependencies:

    ```bash
    npm install
    ```

 2. Start the dev server:

    ```bash
    npm run dev
    ```

 3. Open the URL printed in the terminal (usually `http://localhost:5173`).

 If the README does not open in your IDE, you can open it in any text editor (VS Code, Notepad, etc.) – it's a standard Markdown file.
