import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Banner from './components/Bannner/Banner';

import FinalPage from './components/Finalpage/Finalpage';


import FailurePage from './components/Failurepage/Failurepage';

import { UserProvider } from './components/UserContext';



const App = () => {
 
 
 
  return (
    <UserProvider>
    <Router>
 
      <Routes> {/* All Route components must be wrapped inside Routes */}
        
        <Route 
          path="/" 
          element={<><Banner /></>} 
        />
        <Route 
          path="/confirmationpage" 
          element={<FinalPage />} />
          <Route 
          path="/failurepage" 
          element={<FailurePage/>}/>
          
      </Routes>
    
    </Router>
    </UserProvider>
  );
};

export default App;