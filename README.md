# Job Portal Mobile Application

A React Native mobile application that allows users to browse, search, and bookmark jobs. Built with Expo, this app provides a seamless job searching experience with features like infinite scrolling, real-time search, dark mode support, and offline bookmarking capabilities.

## 🚀 Features

### Job Listings
- Infinite scroll job listing
- Real-time job search functionality
- Detailed job information display
- Clean and intuitive user interface
- Loading states and error handling

### Search 
- Search across multiple job parameters:
  - Job titles
  - Company names
  - Locations
  - Salary ranges
  - Experience levels
- Real-time search results

### Dark Mode
- System theme detection
- Manual theme toggle
- Consistent styling across themes
- Smooth theme transitions

### Bookmarks
- Save jobs for offline viewing
- Local storage implementation
- Easy bookmark management
- Persistent storage across app restarts

### UI/UX Features
- Pull-to-refresh functionality
- Smooth animations
- Loading indicators
- Error handling with retry options
- Responsive design
- Cross-platform compatibility

## 🛠️ Technical Stack

- **React Native**: Core framework
- **Expo**: Development platform
- **React Navigation**: Navigation library
- **AsyncStorage**: Local storage solution
- **Custom Hooks**: For theme and data management
- **Context API**: For state management
- **REST API Integration**: For job data fetching

## 🏗️ Project Structure

- jobportalrn/
- ├── App.js # Main application component
- ├── navigation/ # Navigation configuration
- │ └── JobsStackNavigator.js
- ├── screens/ # Main screen components
- │ ├── JobsScreen.js
- │ ├── JobDetailScreen.js
- │ └── BookmarksScreen.js
- ├── utils/ # Utility functions and contexts
- │ ├── db.js
- │ ├── styles.js
- │ └── ThemeContext.js
- └── components/ # Reusable components
- └── ThemeToggleButton.js

## 📱 Video Referencing

- Video Link  -  " https://drive.google.com/file/d/1a2KW7lI7-F8yGn8yEt5MQvbDmJFIyqWY/view?usp=sharing "
