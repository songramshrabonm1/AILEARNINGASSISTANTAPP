# first commit এ 
-  প্রথম Backend & Frontend দুই টা folder create করেছি। frontend folder এ react install করেছি **npm create vite@latest .** দিয়েছি কারণ এই folder এর মধ্যেই যেন হয়ে যায়। 
- tailwind css install  করেছি 
- তারপর আমি **npm i react-router-dom lucide-react axios  react-hot-toast react-syntax-highlighter react-markdown** install করেছি 
- Appc.css টা delete করেছি index css টা তে tailwind import করেছি আর 

```js
@import url('https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap');
@import "tailwindcss"; 

@theme{ 
  /* Tailwind css custom variable create করা হয়েছে  */
  --font-display: 'urbanist' , 'sans-serif';
  --breakpoint-3xl: '1920px';
  --color-primary: '#FF9324' ; 
}
@layer base{
  html{
    font-family:  var(--font-display);
  }
  body{
    background-color: #fcfbfc;
  }
}
```

- app.jsx folder এ BrowserRouter as Router  Routes Route React-Router-Dom এর থেকে install করেছি। 

```jsx  
import React from 'react'
import {BrowserRouter as Router , Routes , Route , Navigate} from 'react-router-dom' ; 
import LoginPage from './pages/Auth/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import RegisterPage from './pages/Auth/RegisterPage';
import NoteFoundPages from './pages/NotFound/NoteFoundPages';
import Loading from './pages/Loading/Loading';
import DocumentDetailsPage from './pages/Documents/DocumentDetailsPage';
import FlashcardPage from './pages/Flashcards/FlashcardPage';
import FlashcardListPage from './pages/Flashcards/FlashcardListPage';
import QuizesTakePage from './pages/quizes/QuizesTakePage';
import QuizesResultPage from './pages/quizes/QuizesResultPage';
import ProfilePage from './pages/profile/ProfilePage';

const App = () => {
  const isAuthenticate = false ; 
  const loading = false ; 

  if(loading){
    return(
      <div>
        <Loading></Loading>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticate ? (
              <Navigate to="/dashboard" replace></Navigate>
            ) : (
              <Navigate to="/login" replace></Navigate>
            )
          }
        ></Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute></ProtectedRoute>}>
          <Route
            path="/dashboard"
            element={<DashboardPage></DashboardPage>}
          ></Route>
          <Route
            path="/documents"
            element={<DocumentDetailsPage></DocumentDetailsPage>}
          ></Route>
          <Route
            path="/documents:id"
            element={<DocumentDetailsPage></DocumentDetailsPage>}
          ></Route>
          <Route
            path="/flashcards"
            element={<FlashcardListPage></FlashcardListPage>}
          ></Route>
          <Route
            path="/documents:id/flashcards"
            element={<FlashcardPage></FlashcardPage>}
          ></Route>
          <Route
            path="/quizes/:quizedId"
            element={<QuizesTakePage></QuizesTakePage>}
          ></Route>
          <Route
            path="/quizes/:quizedId/results"
            element={<QuizesResultPage></QuizesResultPage>}
          ></Route>
          <Route path='/profile' element={<ProfilePage></ProfilePage>}></Route>
        </Route>

        <Route path="/login" element={<LoginPage></LoginPage>}></Route>
        <Route path="/register" element={<RegisterPage></RegisterPage>}></Route>
        <Route path="*" element={<NoteFoundPages></NoteFoundPages>}></Route>
      </Routes>
    </Router>
  );
}

export default App
```

তারপর protected  Route jsx create করেছি 

```jsx 
import React from 'react'
import Loading from '../../pages/Loading/Loading';
import { Navigate, Outlet } from 'react-router-dom';
import Applyaout from '../layout/Applyaout';

const ProtecetedRoute = () => {
    const isAuthenticate = true ; 
    const loading = false ; 
    if(loading) {
        return(
            <Loading></Loading>
        )
    }
  return isAuthenticate ? (
    <Applyaout>
        <Outlet></Outlet>
    </Applyaout>
  ): <Navigate to={'/login'}></Navigate>
}

export default ProtecetedRoute
```


# দ্বিতীয় commit  এ backend এ চলে গিয়েছি 

প্রথম node initize করেছি **npm init --y**
তারপর package install করেছি **npm i express bcrypt mongoose dotenv cors multer jsonwebtoken express-validator pdf-parse @google/genai**
আর তারপর devdepency install করেছি **npm i nodemon --save-dev** 
