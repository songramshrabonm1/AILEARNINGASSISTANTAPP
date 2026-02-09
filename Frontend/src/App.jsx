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